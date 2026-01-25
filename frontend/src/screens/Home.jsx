import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ArrowRight, Star, Users2, Zap } from "lucide-react";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { text: "Home", href: "/" },
    { text: "About", href: "/about" },
    { text: "Services", href: "/services" },
    { text: "Contact", href: "/contact" },
  ];

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-black shadow-md">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/" className="text-xl font-bold text-gray-400">
                Sync
              </a>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                {menuItems.map((item) => (
                  <a
                    key={item.text}
                    href={item.href}
                    className="text-gray-400 hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {item.text}
                  </a>
                ))}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {menuItems.map((item) => (
                <a
                  key={item.text}
                  href={item.href}
                  className="text-gray-400 hover:text-gray-500 block px-3 py-2 rounded-md text-base font-medium"
                >
                  {item.text}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Build Something Amazing
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              The fastest way to turn your ideas into reality
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/">
                <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2">
                  Get Started <ArrowRight size={20} />
                </button>
              </Link>
              <button className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 bg-slate-900">
        <hr className="pb-2 opacity-20"></hr>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Everything you need to succeed
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="text-yellow-500" size={32} />,
                title: "Lightning Fast",
                description:
                  "Built for performance and speed from the ground up",
              },
              {
                icon: <Users2 className="text-blue-500" size={32} />,
                title: "Team Collaboration",
                description: "Work together seamlessly with your entire team",
              },
              {
                icon: <Star className="text-purple-500" size={32} />,
                title: "Premium Quality",
                description: "Professional grade tools for serious developers",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-slate-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 text-white">
        <hr className="pb-2 opacity-20"></hr>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of satisfied customers building amazing products
          </p>
          <button className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
            Start Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Guides
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
              <p className="text-gray-400 mb-4">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800 px-4 py-2 rounded-lg flex-1 text-white"
                />
                <button className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2025 Sync. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
