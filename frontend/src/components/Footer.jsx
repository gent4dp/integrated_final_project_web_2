import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#30578f] text-blue-100 border-t border-[#254675]">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="text-center text-sm font-semibold tracking-wide">
          &copy; {currentYear} KampusFix • UIN Alauddin Makassar. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;