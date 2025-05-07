import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link, useLocation } from 'react-router-dom';
import Loader from '../../Utiles/Loader';
import { Search, ChevronDown, Filter, X, User, MapPin } from 'lucide-react';
import SelectDropdown from '../../Utiles/SelectDropdown';
import CustomButton from '../../Utiles/CustomButton';
import axios from 'axios';
import { notify } from '../../Utiles/Notification';
import { UserState } from '../../context/UserContext';
import { useSearchParams } from "react-router-dom";
const LucideMarker = ({ position, children }) => {
  const map = useMap();
  const markerRef = useRef(null);

  useEffect(() => {
    if (!markerRef.current) {
      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="position: relative;">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#ef4444" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-map-pin">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });

      const marker = L.marker(position, { icon: customIcon }).addTo(map);
      
      if (children) {
        const popupContent = document.createElement('div');
        const root = ReactDOM.createRoot(popupContent);
        root.render(children);
        
        marker.bindPopup(popupContent);
      }

      markerRef.current = marker;
    } else {
      markerRef.current.setLatLng(position);
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
    };
  }, [map, position, children]);

  return null;
};

const MyMap = () => {
    const baseUrl = import.meta.env.VITE_APP_BASEURL;
    const [loading, setLoading] = useState(false);
    const mapRef = useRef(null);
    const { user, logout } = UserState();
    const [categories, setCategories] = useState([]);
    const [countries, setCountries] = useState([]);
    const [selectedIndustry, setSelectedIndustry] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [agents, setAgents] = useState([]);
    const [states, setStates] = useState([]);
    const [selectedState, setSelectedState] = useState(null);
    const [loadingStates, setLoadingStates] = useState(false);
    const [zipcode, setZipcode] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [searchParams] = useSearchParams();
    const projectId = searchParams.get("project_id");
    
    const getFormattedAddress = (addressDetail) => {
        if (!addressDetail) return 'Address not available';
        const { address, city, state, country, zip_code } = addressDetail;
        return `${address}, ${city?.name_of_city || ''}, ${state?.state_subdivision_name || ''}, ${country?.country_name || ''} - ${zip_code || ''}`;
    };

    useEffect(() => {
        const getCategory = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${baseUrl}/get_category`);
                if (response.data.status) {
                    const formattedCategories = [
                        { value: 'All', label: 'All Categories' },
                        ...response.data.category.map(cat => ({
                            value: cat.category_id,
                            label: cat.category_name,
                            ...cat
                        }))
                    ];
                    setCategories(formattedCategories);
                    setSelectedIndustry(formattedCategories[0]);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        const getFilterCountries = async () => {
            try {
                const response = await axios.get(`${baseUrl}/getAllCountries`);
                if (response.data.status) {
                    const formattedCountries = [
                        { value: 'All', label: 'All Countries' },
                        ...response.data.allCountries.map(country => ({
                            value: country.country_id,
                            label: country.country_name,
                            ...country
                        }))
                    ];
                    setCountries(formattedCountries);
                    setSelectedCountry(formattedCountries[0]);
                }
            } catch (error) {
                console.error('Error fetching countries:', error);
            } finally {
                setLoading(false);
            }
        };

        getCategory();
        getFilterCountries();

    }, [baseUrl]);
    
    useEffect(() => {
        const getStates = async () => {
            setSelectedState(null);
            if (selectedCountry && selectedCountry.value !== 'All') {
                setLoadingStates(true);
                try {
                    const response = await axios.get(`${baseUrl}/getState/${selectedCountry.value}`);
                    if (response.data.status) {
                        const formattedStates = response.data.states.map(state => ({
                            value: state.state_subdivision_id,
                            label: state.state_subdivision_name,
                            ...state
                        }));
                        setStates(formattedStates);
                    }
                } catch (error) {
                    console.error('Error fetching states:', error);
                } finally {
                    setLoadingStates(false);
                }
            } else {
                setStates([]);
                setSelectedState(null);
            }
        };

        getStates();
    }, [selectedCountry, baseUrl]);

    const fetchInitialAgents = async () => {
        try {
            const filterData = {
                category_id: selectedIndustry?.value || 'All',
                country: selectedCountry?.value || 'All',
                state: null,
                zipcode: null
            };

            const response = await axios.post(`${baseUrl}/filter_agent_web`, filterData, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.status) {
                setAgents(response.data.filter_agent);
            } else {
                setAgents(response.data.filter_agent);
                notify('error', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching initial agents:', error);
            notify('error', 'Failed to fetch agents');
        }
    };

    const handleApplyFilters = async () => {
        try {
            setLoading(true);

            let verificationStatus;
            if (selectedStatus.value === 'All') {
                verificationStatus = 'All';
            } else if (selectedStatus.value === 'true') {
                verificationStatus = true;
            } else if (selectedStatus.value === 'false') {
                verificationStatus = false;
            } else {
                verificationStatus = null;
            }

            const filterData = {
                category_id: selectedIndustry?.value || null,
                is_verified: verificationStatus || null,
                country: selectedCountry?.value || null,
                state: selectedState?.value || null,
                zipcode: zipcode,
            };

            const response = await axios.post(`${baseUrl}/filter_agent_web`, filterData, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.status) {
                setAgents(response.data.filter_agent);
            } else if (!response.data.status) {
                setAgents(response.data.filter_agent);
                notify('error', response.data.message);
            }
        } catch (error) {
            console.error('Error filtering agents:', error);
        } finally {
            setLoading(false);
        }
    }
    
    useEffect(() => {
        fetchInitialAgents();
    }, []);

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query === '') {
            setSuggestions([]);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`${baseUrl}/get_search_suggestion/${query}`, {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            setSuggestions(response.data || []);
        } catch (error) {
            console.error('Error searching agents:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectSuggestion = async (city) => {
        try {
            setLoading(true);

            const response = await axios.post(
                `${baseUrl}/search_agent`,
                { city: city.city_id },
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.data.status) {
                setAgents(response.data.filter_agent);
                setSuggestions([]);
            } else {
                setAgents(response.data.filter_agent);
                setSuggestions([]);
            }
        } catch (error) {
            console.error("Error searching agents:", error);
            notify("error", "Failed to search agents");
        } finally {
            setLoading(false);
        }
    };

    const createCustomMarker = (agent) => {
        const handleMarkerClick = (e) => {
            const popup = L.popup()
                .setLatLng([parseFloat(agent.latitude), parseFloat(agent.longitude)])
                .setContent(`
                    <div class="text-sm">
                        <p class="font-bold">${agent.full_name}</p>
                        <p>${getFormattedAddress(agent.address_detail)}</p>
                    </div>
                `)
                .openOn(mapRef.current);
        };

        const customIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="position: relative; cursor: pointer;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#ef4444" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-map-pin">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        });

        return { icon: customIcon, onClick: handleMarkerClick };
    };

    const MapMarkers = () => {
        const map = useMap();
        mapRef.current = map;
        
        useEffect(() => {
            map.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                    layer.remove();
                }
            });
            
            agents.forEach((agent) => {
                const { icon, onClick } = createCustomMarker(agent);
                const marker = L.marker(
                    [parseFloat(agent.latitude), parseFloat(agent.longitude)],
                    { icon }
                ).addTo(map);
                
                const popupContent = `
                    <div class="text-sm">
                        <p class="font-bold">${agent.full_name}</p>
                        <p>${getFormattedAddress(agent.address_detail)}</p>
                    </div>
                `;
                
                marker.bindPopup(popupContent);
            });
        }, [map, agents]);
        
        return null;
    };

    return (
        <>
            {loading && <Loader />}
            <div className="h-[calc(100vh-94px)] flex flex-col">
                <div className="w-full px-4 py-4 bg-white shadow-sm border-b">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative flex-grow w-48">
                            <input
                                type="text"
                                placeholder="Search city..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            />
                            {suggestions.length > 0 && (
                                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-md max-h-60 overflow-y-auto">
                                    {suggestions.map((city) => (
                                        <li
                                            key={city.city_id}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                                            onClick={() => {
                                                handleSelectSuggestion(city)
                                            }}
                                        >
                                            <div className="text-sm text-gray-800">{city.city_name}</div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="flex-grow w-48 pt-2">
                            <SelectDropdown
                                value={selectedIndustry}
                                onChange={setSelectedIndustry}
                                options={categories}
                                placeholder="Select Industry"
                                isLoading={loading}
                            />
                        </div>

                        <div className="flex-grow w-48 pt-2">
                            <SelectDropdown
                                value={selectedStatus}
                                onChange={setSelectedStatus}
                                options={[
                                    { value: 'All', label: 'All' },
                                    { value: 'true', label: 'Verified' },
                                    { value: 'false', label: 'Unverified' },
                                ]}
                                placeholder="Select Status"
                                defaultValue={{ value: 'All', label: 'All' }}
                                isSearchable={false}
                            />
                        </div>

                        <div className="flex-grow w-48 pt-2">
                            <SelectDropdown
                                value={selectedCountry}
                                onChange={setSelectedCountry}
                                options={countries}
                                placeholder="Select Country"
                                isLoading={loading}
                            />
                        </div>

                        <div className="w-full sm:w-48 pt-2">
                            <SelectDropdown
                                value={selectedState}
                                onChange={setSelectedState}
                                options={states}
                                placeholder="Select State"
                                isLoading={loadingStates}
                            />
                        </div>

                        <div className="w-full sm:w-48">
                            <input
                                type="text"
                                value={zipcode}
                                onChange={(e) => setZipcode(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                placeholder="Enter Zipcode"
                            />
                        </div>
                    </div>
                    <div className="flex-grow w-48 mt-2">
                        <CustomButton
                            label={"Apply Filters"}
                            onClick={handleApplyFilters}
                        />
                    </div>
                </div>

                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    <div className="w-full md:w-2/3 h-[50vh] md:h-full">
                        <MapContainer 
                            center={[20.5937, 78.9629]} 
                            zoom={4} 
                            className="w-full h-full z-0" 
                            ref={mapRef}
                        >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <MapMarkers />
                        </MapContainer>
                    </div>

                    <div className="w-full md:w-1/3 flex flex-col h-[50vh] md:h-full">
                        <div className="flex-none p-4 border-b flex justify-between items-center bg-white">
                            <h2 className="text-xl font-semibold">Agents</h2>
                            <span className="text-sm text-gray-500">{agents.length} found</span>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {agents?.map((agent) => (
                                <Link
                                    to={projectId ? `${agent.customer_unique_id}?project_id=${projectId}` : agent.customer_unique_id}
                                    key={agent.customer_unique_id}
                                    className="flex items-center p-4 border-b hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center flex-1">
                                        <div className="relative flex-shrink-0">
                                            {agent.customer_profile_image ? (
                                                <img
                                                    src={agent.customer_profile_image}
                                                    alt={agent.full_name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                    <User className="w-6 h-6 text-gray-500" />
                                                </div>
                                            )}
                                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                                        </div>
                                        <div className="ml-4 flex-1 min-w-0">
                                            <h3 className="font-medium text-gray-900 capitalize">{agent.full_name}</h3>
                                            <p className='text-sm'>Asking for: <span className='font-semibold text-green-400'>{agent.deal_per}%</span> </p>

                                            <p className="text-sm text-gray-500 capitalize">
                                                {getFormattedAddress(agent.address_detail)}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyMap;