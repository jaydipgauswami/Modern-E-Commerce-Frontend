"use client";
import { FaFacebookF, FaInstagram, FaMailBulk, FaTwitter } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";

 function Footer() {
  return (
    <footer className="bg-black text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Shop</h2>
          <p className="text-gray-400 text-sm">
            Discover premium products with the best quality and unbeatable prices.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-white cursor-pointer">Home</li>
            <li className="hover:text-white cursor-pointer">Products</li>
            <li className="hover:text-white cursor-pointer">Categories</li>
            <li className="hover:text-white cursor-pointer">Contact</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-white cursor-pointer">Help Center</li>
            <li className="hover:text-white cursor-pointer">Privacy Policy</li>
            <li className="hover:text-white cursor-pointer">Terms & Conditions</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
          <p className="text-gray-400 text-sm mb-4">
            Subscribe to get latest updates and offers.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 rounded-l-lg text-white outline-none border border-white-100"
            />
            <button className="bg-white text-black px-4 py-2 rounded-r-lg hover:bg-gray-200 transition">
              <AiOutlineMail size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-10 border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center px-6 max-w-7xl mx-auto">
        <p className="text-gray-400 text-sm">
          © 2026 Shop. All rights reserved.
        </p>

        {/* Social Icons */}
      <div className="flex gap-4 mt-4 md:mt-0">
  <FaFacebookF className="cursor-pointer hover:text-gray-400" />
  <FaInstagram className="cursor-pointer hover:text-gray-400" />
  <FaTwitter className="cursor-pointer hover:text-gray-400" />
  <FaMailBulk className="cursor-pointer hover:text-gray-400" />


</div>
{/* <button className="bg-white text-black px-4 py-2 rounded-r-lg hover:bg-gray-200 transition">
  <AiOutlineMail size={18} />
</button> */}
      </div>
    </footer>
  );
} 
export default Footer;
