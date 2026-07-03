import React from 'react';

function Button({ children, type = 'button', onClick, className = '' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-[#30578f] text-white px-6 py-2 rounded-lg font-medium active:scale-95 transition-all duration-200 hover:bg-[#1c477d] shadow-sm shrink-0 ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;