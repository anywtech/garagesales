import React, { createContext, useEffect, useState } from 'react';

export const ShopContext = createContext(null);
/* 
const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index < 150 + 1; index++) {
        cart[index] = 0
    }
    return cart
}
 */
const ShopContextProvider = (props) => {

    const [all_product, setAllProduct] = useState([])

    const [cartItems, setCartItems] = useState({})

    useEffect(() => {

        console.log("in Effect");
        console.log(cartItems);
        let fetchDataExecuted = false;

        fetch('http://localhost:4000/allproducts').then((res) => res.json()).then((data) => { setAllProduct(data); })

        const fetchData = async () => {
            if (!fetchDataExecuted && localStorage.getItem('auth-token')) {
                fetch('http://localhost:4000/getcart', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/form-data',
                        'auth-token': `${localStorage.getItem('auth-token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: ""
                }).then((res) => res.json()).then((data) => setCartItems(data));
                fetchDataExecuted = true;
            }
        }

        fetchData();


    }, [])

    const addToCart = (itemId) => {

        setCartItems((prev) => {
            const updatedCartItems = Object.keys(prev).length === 0 ? {} : { ...prev };
            if (updatedCartItems && updatedCartItems[itemId]) {
                updatedCartItems[itemId] += 1;

            } else {
                updatedCartItems[itemId] = 1;

            }
            console.log('contex in add cartitem')
            console.log(cartItems)
            console.log('contex in add update')
            console.log(updatedCartItems)
            return updatedCartItems;
        });



        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/addtocart', {
                method: 'POST',
                headers: {
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/form-data'
                },
                body: JSON.stringify({ "itemId": itemId })

            }).then((res) => res.json()).then((data) => console.log(data))
        }

    }

    const removeFromCart = (itemId) => {
        setCartItems((prev) => {
            const updatedCartItems = { ...prev };
            if (updatedCartItems[itemId] > 1) {
                updatedCartItems[itemId] -= 1;
            } else {
                delete updatedCartItems[itemId];
            }
            return updatedCartItems;
        });
        console.log('remove')
        console.log(cartItems)
        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/removefromcart', {
                method: 'POST',
                headers: {
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/form-data'
                },
                body: JSON.stringify({ "itemId": itemId })

            }).then((res) => res.json()).then((data) => console.log(data))
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        if (cartItems != null) {
            for (const item in cartItems) {
                if (cartItems[item] > 0) {
                    console.log(item)
                    let itemInfo = all_product.find((prod) => prod.id === Number(item))
                    totalAmount += itemInfo.new_price * cartItems[item]
                }
            }
        }
        console.log("shopcontext gettotal", cartItems)
        return totalAmount
    }

    const getTotalCartCount = () => {
        let totalCount = 0;
        for (const item in cartItems) {
            totalCount += cartItems[item]
        }
        return totalCount;
    }

    const contextValue = { getTotalCartCount, getTotalCartAmount, all_product, cartItems, addToCart, removeFromCart };



    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;