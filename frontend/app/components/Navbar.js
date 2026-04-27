// frontend/app/components/Navbar.js
"use client"; // This directive is necessary for client-side interactivity in Next.js App Router

import React, { useState } from 'react';
import Link from 'next/link'; // Assuming Next.js for routing

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-900 p-4 shadow-lg fixed w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Brand */}
        <Link href="/" className="text-white text-2xl font-bold hover:text-indigo-400 transition-colors duration-300">
          DevPilot
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-8">
          <Link href="/features" className="text-gray-300 hover:text-white transition-colors duration-300">
            Features
          </Link>
          <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors duration-300">
            Pricing
          </Link>
          <Link href="/blog" className="text-gray-300 hover:text-white transition-colors duration-300">
            Blog
          </Link>
          <Link href="/about" className="text-gray-300 hover:text-white transition-colors duration-300">
            About
          </Link>
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex space-x-4 items-center">
          <Link href="/signin" className="text-gray-300 hover:text-white transition-colors duration-300">
            Sign In
          </Link>
          <Link
            href="/signup"
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-md"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button (Hamburger Icon) */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-300 hover:text-white focus:outline-none focus:text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 py-4 mt-4 space-y-4 text-center rounded-b-lg shadow-inner">
          <Link href="/features" className="block text-gray-300 hover:text-white transition-colors duration-300" onClick={toggleMenu}>
            Features
          </Link>
          <Link href="/pricing" className="block text-gray-300 hover:text-white transition-colors duration-300" onClick={toggleMenu}>
            Pricing
          </Link>
          <Link href="/blog" className="block text-gray-300 hover:text-white transition-colors duration-300" onClick={toggleMenu}>
            Blog
          </Link>
          <Link href="/about" className="block text-gray-300 hover:text-white transition-colors duration-300" onClick={toggleMenu}>
            About
          </Link>
          <div className="border-t border-gray-700 mx-auto w-1/2 my-4"></div> {/* Separator */}
          <Link href="/signin" className="block text-gray-300 hover:text-white transition-colors duration-300" onClick={toggleMenu}>
            Sign In
          </Link>
          <Link
            href="/signup"
            className="block mx-auto w-fit bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-md mt-2" onClick={toggleMenu}
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;