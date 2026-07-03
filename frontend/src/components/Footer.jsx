import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#f8f9fa] text-gray-500 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="text-center text-sm tracking-wide">
          &copy; {currentYear} KampusFix. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;