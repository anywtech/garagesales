const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { log } = require("console");

app.use(express.json());
app.use(cors());

//database connection with mongodb

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await mongoose.disconnect();
  }
}
run().catch(console.dir);

//api creation

app.get("/", (req, res) => {
  res.send("Express App is runing");
});

// image storage engine

const storeage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storeage });

//create upload endpoint for images
app.use("/images", express.static("upload/images"));
app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

//schema for creating products

const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  avialable: {
    type: Boolean,
    default: true,
  },
});

app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });

  console.log(product);

  await product.save();

  console.log("saved");

  res.json({
    success: true,
    name: req.body.name,
  });
});

//create remove endpoint for product
app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("removed");
  res.json({
    success: true,
    name: req.body.name,
  });
});

//create api for getting all products
app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  console.log(products);
  res.send(products);
});

//schema creating for user model

const Users = mongoose.model(
  "Users",
  new mongoose.Schema(
    {
      name: {
        type: String,
      },
      email: {
        type: String,
        unique: true,
      },
      password: {
        type: String,
      },
      cartData: {
        type: Object,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
    { minimize: false }
  )
);

//endpoint for registering

app.post("/signup", async (req, res) => {
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({
      success: false,
      errors: "existing user with the same address",
    });
  }
  //let cart = {};
  /* for (let index = 0; index < 2; index++) {
    cart[index] = 0;
  } */

  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: {},
  });

  await user
    .save()
    .then((savedUser) => {
      console.log("User saved:", savedUser);
    })
    .catch((error) => {
      console.error("Error saving user:", error);
    });

  const data = {
    user: {
      id: user.id,
    },
  };

  const token = jwt.sign(data, "secret_ecom");

  res.json({
    success: true,
    token: token,
  });
});

//endpiont for login
app.post("/login", async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = { user: { id: user.id } };
      const token = jwt.sign(data, "secret_ecom");

      res.json({
        success: true,
        token: token,
      });
    } else {
      res.json({ success: false, errors: "Wrong Password" });
    }
  } else {
    res.json({ success: false, errors: "Wrong Email" });
  }
});

///endpiont for new collection
app.get("/newcollection", async (req, res) => {
  let products = await Product.find({});
  let newcol = products.slice(1).slice(-8);
  console.log("newcol fetched");
  res.send(newcol);
});

//endpoint for popular in women section

app.get("/popularinwomen", async (req, res) => {
  let products = await Product.find({ category: "women" });
  let popular = products.slice(0, 4);
  console.log("popular in women fetched");
  res.send(popular);
});

//middleware for fetch user
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ errors: "auth failed" });
  } else {
    try {
      const data = jwt.verify(token, "secret_ecom");
      req.user = data.user;
      next();
    } catch {
      res.status(401).send({ errors: "auth failed" });
    }
  }
};

//endpoint for add production
app.post("/addtocart", fetchUser, async (req, res) => {
  console.log(req.body, req.user);
  let userData = await Users.findOne({ _id: req.user.id });
  console.log(userData.cartData);
  if (userData.cartData == null) {
    userData.cartData = {};
    console.log("init");
  }

  if (userData.cartData[req.body.itemId] == null) {
    userData.cartData[req.body.itemId] = 1;
  } else {
    userData.cartData[req.body.itemId] += 1;
  }

  console.log("userData.cartData", userData.cartData);

  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  console.log("Added");
  res.json({ success: true });
});

//endpoint for remove production
app.post("/removefromcart", fetchUser, async (req, res) => {
  let userData = await Users.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] > 1)
    userData.cartData[req.body.itemId] -= 1;
  else {
    delete userData.cartData[req.body.itemId];
    console.log("deleted");
  }
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  console.log("removed");
  res.json({ success: true });
});

//endpiont for get cart
app.post("/getcart", fetchUser, async (req, res) => {
  console.log("getcart");
  let userData = await Users.findOne({ _id: req.user.id });
  res.json(userData.cartData);
  console.log(userData);
});

app.listen(port, (error) => {
  if (!error) {
    console.log("Server runing on port " + port);
  } else {
    console.log("Error:" + error);
  }
});
