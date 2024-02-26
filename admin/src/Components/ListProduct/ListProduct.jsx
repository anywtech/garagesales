import React, { useEffect, useState } from 'react'
import './ListProduct.css'
import cross_icon from '../../assets/cross_icon.png'

export const ListProduct = () => {

    const [allproducts, setAllProducts] = useState([])

    const removeProduct = async (id) => {
        await fetch('http://localhost:4000/removeproduct', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id })
        })

        await fetchInfo();

    }

    const fetchInfo = async () => {
        await fetch('http://localhost:4000/allproducts')
            .then((res) => res.json())
            .then((data) => {
                setAllProducts(data)
            })
    }

    useEffect(() => {
        fetchInfo();
    }, [])

    return (
        <div className='listproduct'>
            <h1>All Product List</h1>
            <div className="listproduct-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Old Price</p>
                <p>New Price</p>
                <p>Category</p>
                <p>Remove</p>
            </div>
            <div className="listproduct-allproducts">
                <hr />
                {allproducts.map((p, i) => {
                    return <>

                        <div key={i} className="listproduct-format-main listproduct-format">

                            <img src={p.image} alt="" className="listproduct-product-item" />
                            <p>{p.name}</p>
                            <p>${p.old_price}</p>
                            <p>${p.new_price}</p>
                            <p>{p.category}</p>
                            <img className='listproduct-remove-icon' onClick={() => {
                                removeProduct(p.id)
                            }} src={cross_icon} alt="" />
                        </div>
                        <hr />
                    </>
                })}

            </div>


        </div>
    )
}
