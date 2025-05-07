import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';

const LocationSelector = ({
  date,
  ctg,
  status,
  role,
  selectedRole,
  onRoleChange,
  onMinChange,
  selectedMin,
  onMaxChange,
  selectedMax,
  onStatusChange,
  selectedStatus,
  onCategoryChange,
  selectedCategory,
  data,
  onCountryChange,
  onStateChange,
  onCityChange,
  selectedCountry,
  selectedState,
  selectedCity,
  className = "",
  labelClass = "",
  inputClass = "",
}) => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  
  // Refs to track initial loading and prevent loops
  const initialDataLoaded = useRef(false);
  const countryDataLoaded = useRef(false);
  const stateDataLoaded = useRef(false);
  const cityDataLoaded = useRef(false);

  const formatOptionscategory = (data, labelKey = 'category_name', valueKey = 'category_id') => {
    return data.map(item => ({
      label: item[labelKey],
      value: item[valueKey]
    }));
  };

  const formatOptions = (data, labelKey = 'country_name', valueKey = 'country_id') => {
    return data.map(item => ({
      label: item[labelKey],
      value: item[valueKey]
    }));
  };

  const formatOptionsState = (data, labelKey = 'state_subdivision_name', valueKey = 'state_subdivision_id') => {
    return data.map(item => ({
      label: item[labelKey],
      value: item[valueKey]
    }));
  };

  const formatOptionsCity = (data, labelKey = 'name_of_city', valueKey = 'cities_id') => {
    return data.map(item => ({
      label: item[labelKey],
      value: item[valueKey]
    }));
  };

  useEffect(() => {
    if (ctg && !initialDataLoaded.current) {
      const fetchCategories = async () => {
        try {
          const response = await fetch(`${baseUrl}/get_category`, { method: 'GET' });
          const result = await response.json();
          const formattedCategories = formatOptionscategory(result.category);
          setCategories(formattedCategories);

          if (data?.ctg) {
            const categoryOption = formattedCategories.find(
              ctg => ctg.value === data.ctg.category_id
            );
            if (categoryOption && onCategoryChange) {
              onCategoryChange(categoryOption);
            }
          }
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      };

      fetchCategories();
      initialDataLoaded.current = true;
    }
  }, [ctg, baseUrl, data]);

  useEffect(() => {
    if (!countryDataLoaded.current) {
      const fetchCountries = async () => {
        try {
          const response = await fetch(`${baseUrl}/getAllCountries`, { method: 'GET' });
          const result = await response.json();
          const formattedCountries = formatOptions(result.allCountries);
          setCountries(formattedCountries);

          if (data?.country && onCountryChange && !selectedCountry) {
            const countryOption = formattedCountries.find(
              country => country.value === data.country.country_id
            );
            
            if (countryOption) {
              onCountryChange(countryOption);
            }
          }
        } catch (error) {
          console.error('Error fetching countries:', error);
        }
      };

      fetchCountries();
      countryDataLoaded.current = true;
    }
  }, [baseUrl]);

  useEffect(() => {
    if (selectedCountry && (!stateDataLoaded.current || stateDataLoaded.current !== selectedCountry.value)) {
      const fetchStates = async () => {
        try {
          setIsLoadingStates(true);
          const response = await fetch(`${baseUrl}/getState/${selectedCountry.value}`, { method: 'GET' });
          const result = await response.json();
          const formattedStates = formatOptionsState(result.states);
          setStates(formattedStates);

          if (data?.state && onStateChange && !selectedState) {
            const stateOption = formattedStates.find(
              state => state.value === Number(data.state.state_subdivision_id)
            );
            if (stateOption) {
              onStateChange(stateOption);
            }
          }
          
          stateDataLoaded.current = selectedCountry.value;
        } catch (error) {
          console.error('Error fetching states:', error);
        } finally {
          setIsLoadingStates(false);
        }
      };

      fetchStates();
    } else if (!selectedCountry) {
      setStates([]);
      stateDataLoaded.current = false;
    }
  }, [selectedCountry, baseUrl]);

  useEffect(() => {
    if (selectedState && (!cityDataLoaded.current || cityDataLoaded.current !== selectedState.value)) {
      const fetchCities = async () => {
        try {
          setIsLoadingCities(true);
          const response = await fetch(`${baseUrl}/getCity/${selectedState.value}`, { method: 'GET' });
          const result = await response.json();
          const formattedCities = formatOptionsCity(result.cities);
          setCities(formattedCities);

          if (data?.city && onCityChange && !selectedCity) {
            const cityOption = formattedCities.find(
              city => city.value === Number(data.city.cities_id)
            );
            if (cityOption) {
              onCityChange(cityOption);
            }
          }
          
          cityDataLoaded.current = selectedState.value;
        } catch (error) {
          console.log('Error fetching cities:', error);
        } finally {
          setIsLoadingCities(false);
        }
      };

      fetchCities();
    } else if (!selectedState) {
      setCities([]);
      cityDataLoaded.current = false;
    }
  }, [selectedState, baseUrl]);

  const handleCountryChange = (option) => {
    onCountryChange(option);
    onStateChange(null);
    onCityChange(null);
    stateDataLoaded.current = false;
    cityDataLoaded.current = false;
  };

  const handleStateChange = (option) => {
    onStateChange(option);
    onCityChange(null);
    cityDataLoaded.current = false;
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      minHeight: '48px',
      fontSize: '1rem',
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

  const statusOptions = [
    {
      label: 'Active',
      value: 'Active',
    },
    {
      label: 'Inactive',
      value: 'Inactive',
    },
    {
      label: 'Private',
      value: 'Private',
    },
  ]

  const roleOptions = [
    {
      label: 'Entrepreneur',
      value: 'entrepreneur',
    },
    {
      label: 'Investor',
      value: 'investor',
    },
    {
      label: 'Agent',
      value: 'agent',
    },
  ]

  return (
    <div className={`${className}`}>
      {date &&
        <div className="flex flex-row gap-2 place-items-center text-sm">
          <input
            type="date"
            value={selectedMin}
            onChange={(e) => onMinChange(e.target.value)}
            className="px-2 h-full border border-neutral-300 rounded-md text-sm w-full"
          />
          <span>
            To
          </span>
        </div>
      }
      {date &&
        <div className="">
          <input
            type="date"
            value={selectedMax}
            onChange={(e) => onMaxChange(e.target.value)}
            className="px-2 h-full border border-neutral-300 rounded-md text-sm w-full"
          />
        </div>
      }
      {role &&
        <div className="2xl:col-span-1">
          <Select
            className={`${inputClass}`}
            classNamePrefix="select"
            value={selectedRole}
            onChange={onRoleChange}
            options={roleOptions}
            isSearchable={true}
            isClearable={true}
            placeholder="Select Role"
            isDisabled={false}
            isLoading={false}
            styles={customStyles}
          />
        </div>
      }
      {status &&
        <div className="2xl:col-span-1">
          <Select
            className={`${inputClass}`}
            classNamePrefix="select"
            value={selectedStatus}
            onChange={onStatusChange}
            options={statusOptions}
            isSearchable={true}
            isClearable={true}
            placeholder="Select Status"
            isDisabled={false}
            isLoading={false}
            styles={customStyles}
          />
        </div>
      }
      {ctg &&
        <div className="">
          <Select
            className={`${inputClass}`}
            classNamePrefix="select"
            value={selectedCategory}
            onChange={onCategoryChange}
            options={categories}
            isSearchable={true}
            isClearable={true}
            placeholder="Select Category"
            isDisabled={false}
            isLoading={false}
            styles={customStyles}
          />
        </div>
      }
      <div>
        <label className={`${labelClass}`}>Country</label>
        <Select
          className={`${inputClass}`}
          classNamePrefix="select"
          value={selectedCountry}
          onChange={handleCountryChange}
          options={countries}
          isSearchable={true}
          isClearable={true}
          placeholder="Select Country"
          isDisabled={false}
          isLoading={false}
          styles={customStyles}
        />
      </div>

      <div>
        <label className={`${labelClass}`}>State</label>
        <Select
          className={`${inputClass}`}
          classNamePrefix="select"
          value={selectedState}
          onChange={handleStateChange}
          options={states}
          isSearchable={true}
          isClearable={true}
          placeholder={isLoadingStates ? "Loading..." : "Select State"}
          isDisabled={!selectedCountry}
          isLoading={isLoadingStates}
          styles={customStyles}
        />
      </div>

      <div>
        <label className={`${labelClass}`}>City</label>
        <Select
          className={`${inputClass}`}
          classNamePrefix="select"
          value={selectedCity}
          onChange={onCityChange}
          options={cities}
          isSearchable={true}
          isClearable={true}
          placeholder={isLoadingCities ? "Loading..." : "Select City"}
          isDisabled={!selectedState}
          isLoading={isLoadingCities}
          styles={customStyles}
        />
      </div>
    </div>
  );
};

export default LocationSelector;