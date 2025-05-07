import React from 'react';

const CustomButton = ({ onClick, label, cancel }) => {
  return (
    <>
      {cancel ? (
        <button
          onClick={onClick}
          className="px-5 py-2.5 text-base font-medium text-[#4A3AFF] bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all duration-200"
        >{label}
        </button>
      ) : (
        <button
          onClick={onClick}
          className="px-5 py-2.5 text-base font-medium text-white bg-[#4A3AFF] rounded-lg hover:bg-[#3D32CC] shadow-sm transition-all duration-200"
        >{label}
        </button>
      )}
    </>
  );
};

export default CustomButton;