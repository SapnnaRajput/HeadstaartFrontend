import React from 'react';
import Select from 'react-select';

const SelectDropdown = ({ 
  value, 
  onChange, 
  options, 
  placeholder = "", 
  isSearchable = true, 
  isClearable = true, 
  isDisabled = false, 
  isLoading = false, 
}) => {

    const customStyles = {
        control: (base) => ({
          ...base,
          minHeight: '44px',
          fontSize: '0.975rem',
        }),
        valueContainer: (base) => ({
          ...base,
          padding: '0 6px',
        }),
        input: (base) => ({
          ...base,
          margin: '0',
        }),
      };

  return (
    <Select
      className={`block text-base text-gray-800 mb-2`}
      classNamePrefix="select"
      value={value}
      onChange={onChange}
      options={options}
      isSearchable={isSearchable}
      isClearable={isClearable}
      placeholder={`${placeholder}`}
      isDisabled={isDisabled}
      isLoading={isLoading}
      styles={customStyles}
    />
  );
};

export default SelectDropdown;