"use client";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";
import { useState } from "react";
import {motion} from "framer-motion";

 function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message Sent Successfully");
    setForm({ name: "", email: "", message: "" });
  };
  

  return (

    
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 bg-white p-6 md:p-10 rounded-2xl shadow-lg">
        
        {/* Left - Form */}
<motion.div
  initial={{ opacity: 0, x: -50 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.5 }}
>
  {  <div>
          <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your Message"
              rows="5"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Send Message
            </button>
          </form>
        </div>
}
</motion.div>
        

      
        {/* Right - Info */}
        <motion.div
  initial={{ opacity: 0, x: 50 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.5 }}
>
  {  <div className="flex flex-col justify-center space-y-6">
          <div>
            <h3 className="text-xl font-semibold">Get in Touch</h3>
            <p className="text-gray-600 mt-2">
              We'd love to hear from you. Fill out the form or reach us through the details below.
            </p>
          </div>

       
<div className="space-y-3 text-gray-700">
  <p className="flex items-center gap-3">
    <FaMapMarkerAlt /> Ahmedabad, India
  </p>

  <p className="flex items-center gap-3">
    <FaPhoneAlt className="text-gray-600"/> +91 9714536940
  </p>

  <p className="flex items-center gap-3">
    <FaEnvelope /> gauswamijaydip80@gmail.com
  </p>
</div>

          {/* Social Links */}
       <div className="flex gap-4 pt-4 text-xl">
  <a href="#" className="hover:scale-110 transition">
    <FaInstagram />
  </a>

  <a href="#" className="hover:scale-110 transition">
    <FaLinkedin />
  </a>

  <a href="#" className="hover:scale-110 transition">
    <FaGithub />
  </a>
</div>
        </div>}
</motion.div>
      

      </div>
    </div>
  );
}
export default ContactPage;
