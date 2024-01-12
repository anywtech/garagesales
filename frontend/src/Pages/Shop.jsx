import React from 'react'
import { Heros } from '../Components/Heros/Heros'
import Popular from '../Components/Popular/Popular'
import Offers from '../Components/Offers/Offers'
import NewCollections from '../Components/NewCollections/NewCollections'
import NewsLetter from '../Components/NewsLetter/NewsLetter'

const Shop = () => {
    return (
        <div>
            <Heros />
            <Popular />
            <Offers />
            <NewCollections />
            <NewsLetter />
        </div>
    )
}

export default Shop