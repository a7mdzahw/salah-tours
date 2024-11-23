"use client";

import React from 'react'

const Footer = () => {
  return (
    <footer>
    <div className="container">
        <div className="footer-top row">
            <div className="col-md-4 foot-logo">
                <h2>Travel Packages</h2>
            </div>
            <div className="col-md-8 foot-addr">
                <p>Donec venenatis metus at diam condimentum pretiuteger aliquet a turpis quis pel len tesque ueta turpis quis venenatissolelementum</p>
                <ul>
                    <li className="pl-0"><i className="fas fa-map-marker-alt"></i> Antonya Street, 23/H-2, Building, TA, AUS </li>
                    <li><i className="fas fa-mobile-alt"></i> +177 (089) 987665  </li>
                    <li><i className="far fa-envelope"></i> support@smarteyeapps.com </li>
                </ul>
            </div>
        </div>
        <div className="foot-botom row">
            <div className="col-md-3">
                <div className="fotter-coo">
                    <h5>IMPORTANT LINKS</h5>
                    <ul>
                        <li><i className="fas fa-caret-right"></i> ABOUT US</li>
                        <li><i className="fas fa-caret-right"></i> COMPANY PROFILE</li>
                        <li><i className="fas fa-caret-right"></i> OUR SERVICES</li>
                        <li><i className="fas fa-caret-right"></i> CONTACT US</li>
                        <li><i className="fas fa-caret-right"></i> READ BLOG</li>
                    </ul>
                </div>
                
            </div>
             <div className="col-md-4">
                <div className="fotter-coo">
                    <h5>GLOBAL UPDATE NEWS</h5>
                    <ul>
                        <li><i className="fas fa-caret-right"></i> 100 CHILDREN RESCUE FROM WAR ZONE</li>
                        <li><i className="fas fa-caret-right"></i> THR FRESH HOUSE CHILD</li>
                        <li><i className="fas fa-caret-right"></i> CREATE AWARENESS IN EDUCATON</li>
                        <li><i className="fas fa-caret-right"></i> WHAT HAPPEN WHEN WE LIVE!</li>
                        <li><i className="fas fa-caret-right"></i> READ BLOG</li>
                    </ul>
                </div>
                
            </div>
            <div className="col-md-5">
                <div className="fotter-coo">
                    <h5>PHOTO GALLERY</h5>
                    <div className="gallery-row row">
                        <div className="col-md-4 col-6 gall-col">
                         
                        </div>
                        <div className="col-md-4 col-6 gall-col">
                        </div>
                        <div className="col-md-4 col-6 gall-col">
                        </div>
                        <div className="col-md-4 col-6 gall-col">
                        </div>
                        <div className="col-md-4 col-6 gall-col">
                        </div>
                        <div className="col-md-4 col-6 gall-col">
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
</footer>
  )
}

export default Footer