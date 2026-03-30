"use client";

import { motion } from "framer-motion";
import { Truck, ShieldCheck, RefreshCcw, Star } from "lucide-react";

 function WhyChooseUs() {
  const features = [
    {
      title: "Free Delivery",
      desc: "Free shipping on all orders above ₹999",
      icon: Truck,
    },
    {
      title: "Secure Payment",
      desc: "100% secure and encrypted payments",
      icon: ShieldCheck,
    },
    {
      title: "Easy Returns",
      desc: "7-day hassle-free return policy",
      icon: RefreshCcw,
    },
    {
      title: "Top Quality",
      desc: "Only premium quality products",
      icon: Star,
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold mb-12"
        >
          Why Choose Us
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl transition duration-300 cursor-pointer"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-black text-white rounded-full group-hover:scale-110 transition duration-300">
                    <Icon size={24} />
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-2 group-hover:text-black">
                  {item.title}
                </h3>

                <p className="text-gray-600 text-sm">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export default WhyChooseUs;
