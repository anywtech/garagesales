import React, { useState } from 'react'
import './Addproduct.css'
import upload_area from '../../assets/upload_area.svg'

const Addproduct = () => {

    const [image, setImage] = useState(false)
    const [productDetails, setProductDetails] = useState({
        name: "",
        image: "",
        category: "women",
        new_price: "",
        old_price: ""
    })

    const changeHandler = (e) => {
        if (e.target.name === "image") {
            setImage(e.target.files[0])
            console.log(e.target.files)
        }
        else {
            setProductDetails({
                ...productDetails, [e.target.name]: e.target.value
            })
        }
    }

    const SubmitProduct = async () => {


        console.log(productDetails)

        let resData;
        let product = productDetails;

        let formData = new FormData();
        formData.append('product', image)

        await fetch('http://localhost:4000/upload', {
            method: 'POST',
            headers: { Accept: 'applicationjson' },
            body: formData,

        }).then((res) => res.json().then((data) => { resData = data }))

        if (resData.success) {
            product.image = resData.image_url;
            console.log(product);

            await fetch('http://localhost:4000/addproduct', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product),
            }).then((res) => res.json()).then((data) => {
                data.success ? alert('Product Added') : alert('Failed')
            })
        }
    }


    return (
        <div className='addproduct'>
            <div className="addproduct-itemfield">
                <p>Product Title</p>
                <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Product Name' />
            </div>

            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input type="text" name='old_price' value={productDetails.old_price} onChange={changeHandler} placeholder='Market Price' />
                </div>
                <div className="addproduct-itemfield">
                    <p>Offer Price</p>
                    <input type="text" onChange={changeHandler} value={productDetails.new_price} name='new_price' placeholder='Offer Price' />
                </div>
            </div>

            <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select name="category" value={productDetails.category} onChange={changeHandler} className='addproduct-selector'>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kid">Kid</option>
                    <option value="women">Women</option>
                </select>
            </div>

            <div className="addproduct-itemfiled">
                <label htmlFor="file-input">
                    <img src={image ? URL.createObjectURL(image) : upload_area} className='addproduct-thumbnail-img' alt="" />
                </label>
                <input onChange={changeHandler} type="file" name="image" id='file-input' hidden />
            </div>
            <button onClick={() => SubmitProduct()} className='addproduct-btn'> ADD </button>
        </div>
    )
}

export default Addproduct
