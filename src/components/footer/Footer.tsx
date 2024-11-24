"use client";

import React from "react";

const Footer = () => {
  return (
    <footer className="bg-primary-500 text-white py-8">
      <div className="container mx-auto text-center">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Salah Tours</h3>
          <p className="text-sm">Adventure Awaits</p>
        </div>
        <nav className="flex justify-center space-x-4 mb-4">
          <a href="#about" className="hover:underline">
            About Us
          </a>
          <a href="#contact" className="hover:underline">
            Contact
          </a>
          <a href="#privacy" className="hover:underline">
            Privacy Policy
          </a>
        </nav>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Earth Trekkers. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
