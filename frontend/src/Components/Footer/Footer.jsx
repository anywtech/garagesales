import React from 'react'
import './Footer.css'
import footer_logo from '../assets/logo.png'
import instgram_icon from '../assets/instagram_icon.png'
import printerest_icon from '../assets/pintester_icon.png'
import whatsapp_icon from '../assets/whatsapp_icon.png'


const Footer = () => {
    return (
        <div className="footer">
            <div className="footer-logo">
                <img src={footer_logo} alt="" />
                <p>Garage Sales</p>
            </div>
            <ul className="footer-links">
                <li>Company</li>
                <li>Products</li>
                <li>Offices</li>
                <li>About</li>
                <li>Contact</li>
            </ul>
            <div className="footer-social-icon">
                <div className="footer-icons-container">
                    <img src={instgram_icon} alt="" />
                </div>
                <div className="footer-icons-container">
                    <img src={printerest_icon} alt="" />
                </div>
                <div className="footer-icons-container">
                    <img src={whatsapp_icon} alt="" />
                </div>
            </div>

            <div className="footer-copyright">
                <hr />
                <p>
                    CopyRight @ 2023 - All Right Reserved.
                </p>
            </div>
        </div>
    )
}


export default Footer