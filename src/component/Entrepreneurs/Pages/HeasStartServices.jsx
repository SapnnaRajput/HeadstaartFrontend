import React, { useState, useEffect } from "react"
import { UserState } from "../../../context/UserContext"
import { notify } from "../../../Utiles/Notification"
import Loader from "../../../Utiles/Loader"
import CustomButton from "../../../Utiles/CustomButton"
import axios from "axios"
import { ChevronDown } from "lucide-react"
import LocationSelector from "../../../Utiles/LocationSelector"
import { useNavigate } from "react-router-dom"
import { use } from "react"

const HeadStartServices = () => {
    const baseUrl = import.meta.env.VITE_APP_BASEURL
    const { user } = UserState()
    const [loading, setLoading] = useState(false)
    const [skeletonLoading, setSkeletonLoading] = useState(false)
    const [services, setServices] = useState([])
    const [selectedServices, setSelectedServices] = useState([])
    const [expandedSection, setExpandedSection] = useState(null)
    const [selectedProject, setSelectedProject] = useState(null)
    const [aboutUs, setAboutUs] = useState(null)
    const [message, setMessage] = useState("")
    const [projects, setProjects] = useState([])
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [entProjects,setEntProjects] = useState([]);
    const navigate = useNavigate();
    

    const fetchServices = async () => {
        setSkeletonLoading(true)
        try {
            const response = await axios.get(`${baseUrl}/get_headstaart_service`, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            })
            if (response.data.status) {
                setServices(response.data.service || [])
                setAboutUs(response.data.about.description)
            } else {
                notify("error", response.data.message)
            }
        } catch (error) {
            notify("error", error.message)
        } finally {
            setSkeletonLoading(false)
        }
    }
    const getAgentProjects = async () => {
        setSkeletonLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/get_agent_project_web `,{
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            if (response.data.status) {
                setEntProjects(response.data.project_details)
            }else{
                notify('error',response.data.message);
            }
        } catch (error) {
            notify('error','Unauthorized access please login again');
        } finally {
            setSkeletonLoading(false);
        }
    };
    const getProjects = async () => {
        setSkeletonLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/get_service_project`,
                {
                    customer_unique_id: user?.customer?.customer_unique_id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            );

            if (response?.data?.status) {
                setProjects(response?.data?.projectDetails)
            } else {
                notify('error', response?.data?.message);
            }
        } catch (error) {
            notify('error', error.message);
        } finally {
            setSkeletonLoading(false);
        }
    };

    useEffect(() => {
        if(user.role == 'agent'){
        getAgentProjects()
        } else {
        getProjects()
        }
        fetchServices()
    }, [baseUrl])

    const toggleSection = (id) => {
        setExpandedSection(expandedSection === id ? null : id)
    }

    const toggleService = (id) => {
        setSelectedServices((prev) => (prev.includes(id) ? prev.filter((serviceId) => serviceId !== id) : [...prev, id]))
    }

    const sendMessage = async() => {
        if (!selectedProject) {
            notify("error", "Please select a project.");
            return;
        }
    
        if (selectedServices.length === 0) {
            notify("error", "Please select at least one service.");
            return;
        }
    
        if (!message.trim()) {
            notify("error", "Please enter a message.");
            return;
        }
    
        if (!selectedCountry || !selectedCountry.value) {
            notify("error", "Please select a country.");
            return;
        }
    
        if (!selectedState || !selectedState.value) {
            notify("error", "Please select a state.");
            return;
        }
    
        if (!selectedCity || !selectedCity.value) {
            notify("error", "Please select a city.");
            return;
        }
        const payload = {
            project_unique_id:selectedProject,
            services_id:selectedServices,
            leave_message:message,
            country: selectedCountry.value,
            state:selectedState.value,
            city:selectedCity.value
        }
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/customer_headstaart_chat_initiate_mob`,
                { ...payload },
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            );
            if (response?.data?.status) {
                notify("success",response.data.message);
                navigate(`/${user.role}/headstaart-team`)
            } else {
                notify("error", response?.data?.message || "Something went wrong.");
            }
        } catch (error) {
            notify('error', error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {loading && <Loader />}

            {skeletonLoading &&(<div className="p-6 bg-white rounded-lg animate-pulse">
      <div className="h-8 bg-gray-300 rounded w-1/2 mb-6"></div>

      <div className="mb-8">
        <div className="h-6 bg-gray-300 rounded w-1/3 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>

      <div className="space-y-4 mb-8">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="border rounded-lg bg-gray-100">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-gray-300 rounded"></div>
                <div className="h-5 bg-gray-300 rounded w-32"></div>
              </div>
              <div className="w-5 h-5 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2].map((_, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <div className="h-32 bg-gray-200"></div>
              <div className="p-3">
                <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="space-y-2">
                  {[1, 2, 3].map((_, lineIndex) => (
                    <div key={lineIndex} className="h-3 bg-gray-200 rounded w-full"></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="h-5 bg-gray-300 rounded w-1/4 mb-2"></div>
          <div className="h-24 bg-gray-200 rounded w-full"></div>
        </div>
        <div>
          <div className="h-5 bg-gray-300 rounded w-1/3 mb-2"></div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <div className="h-10 bg-gray-300 rounded w-32"></div>
        <div className="h-10 bg-gray-300 rounded w-32"></div>
      </div>
    </div>)}

            <div className="p-6 bg-white rounded-lg">
                <h1 className="text-2xl font-bold mb-6">Headstaart Services</h1>

                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-3">About Us</h2>
                    <p className="text-gray-600">{aboutUs}</p>
                </div>

                <div className="space-y-4 mb-8">
                    {services.map((section) => (
                        <div key={section.headstaart_service_id} className="border rounded-lg">
                            <div
                                className="flex items-center justify-between p-4 cursor-pointer"
                                onClick={() => toggleSection(section.headstaart_service_id)}
                            >
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedServices.includes(section.headstaart_service_id)}
                                        onChange={() => toggleService(section.headstaart_service_id)}
                                        className="w-5 h-5 rounded border-gray-300"
                                    />
                                    <h3 className="font-medium">{section.title}</h3>
                                </div>
                                <ChevronDown
                                    className={`w-5 h-5 transition-transform ${expandedSection === section.headstaart_service_id ? "rotate-180" : ""}`}
                                />
                            </div>
                            {expandedSection === section.headstaart_service_id && (
                                <div className="p-4 pt-0">
                                    <p className="text-gray-600">{section.description}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {(user.role == 'investor' || user.role == 'entrepreneur') && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Select Project</h2>
                    {projects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {projects.map((project) => (
                            <div key={project.project_unique_id} className="border rounded-lg overflow-hidden flex flex-col h-full">
                                <div className="h-32 overflow-hidden">
                                    {project.projectMedia?.length > 0 && project.projectMedia[0].media_type === "photo" ? (
                                        <img
                                            src={project.projectMedia[0].media_link || "/placeholder.svg"}
                                            alt={project.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 flex-grow flex flex-col">
                                    <h3 className="font-medium mb-2 line-clamp-2">{project.title}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{project.category.category_name}</p>
                                    <div className="flex flex-col gap-1 mb-2">
                                        <span className="text-sm text-gray-600 font-semibold">
                                            {project.fund_amount ? `$${project.fund_amount} for ${project.equity}% equity` : "Price on request"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto pt-2 border-t">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600">{project.view} views</span>
                                        </div>
                                        <input
                                            type="radio"
                                            name="project"
                                            checked={selectedProject === project.project_unique_id}
                                            onChange={() => setSelectedProject(project.project_unique_id)}
                                            className="w-4 h-4"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                     ) : (
                        <div className="w-full text-center p-4 bg-red-100 text-red-600 rounded-lg">
                        No flagged projects available. You cannot send a message.
                    </div>
                    )}
                </div>
                )}

                {user.role == 'agent' && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Select Project</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {entProjects.map((project) => (
                            <div key={project.project_unique_id} className="border rounded-lg overflow-hidden flex flex-col h-full">
                                <div className="h-32 overflow-hidden">
                                    {project.projectMedia?.length > 0 && project.projectMedia[0].media_type === "photo" ? (
                                        <img
                                            src={project.projectMedia[0].media_link || "/placeholder.svg"}
                                            alt={project.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 flex-grow flex flex-col">
                                    <h3 className="font-medium mb-2 line-clamp-2 capitalize">{project.title}</h3>
                                    <p className="text-sm text-gray-600 mb-2 capitalize">{project.category.category_name}</p>
                                    <div className="flex flex-col gap-1 mb-2">
                                        <span className="text-sm text-gray-600 font-semibold">
                                            {project.fund_amount ? `$${project.fund_amount} for ${project.equity}% equity` : "Price on request"}
                                        </span>
                                        {/* <span className="text-sm text-gray-600">{project.stage.business_stage_name}</span> */}
                                        {/* <span className="text-sm text-gray-600">
                                            {`${project.city.city_name}, ${project.state.state_name}`}
                                        </span> */}
                                    </div>
                                    {/* {project.additional_info?.length > 0 && (
                                        <div className="text-sm text-gray-600 mb-2 flex-grow overflow-y-auto max-h-24">
                                            {project.additional_info.map((info) => (
                                                <div key={info.additional_info_id}>
                                                    <strong>{info.heading}:</strong> {info.value}
                                                </div>
                                            ))}
                                        </div>
                                    )} */}
                                    <div className="flex items-center justify-between mt-auto pt-2 border-t">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600">{project.view} views</span>
                                            {/* <span className="text-sm text-gray-600">{project.investor_interest} interested</span> */}
                                        </div>
                                        <input
                                            type="radio"
                                            name="project"
                                            checked={selectedProject === project.project_unique_id}
                                            onChange={() => setSelectedProject(project.project_unique_id)}
                                            className="w-4 h-4"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block mb-2">Leave Message <span className="text-red-500">*</span></label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full border rounded-lg p-3 min-h-[100px] max-w-lg"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Service Location (city,state, country)</label>
                        <LocationSelector
                            selectedCountry={selectedCountry}
                            selectedState={selectedState}
                            selectedCity={selectedCity}
                            onCountryChange={setSelectedCountry}
                            onStateChange={setSelectedState}
                            onCityChange={setSelectedCity}
                            className="col-span-2 grid grid-cols-3 gap-2"
                            labelClass="block text-base text-gray-800 mb-2"
                            inputClass=" border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                </div>
                <div className="flex justify-start my-4 gap-4">
              <CustomButton label="Send Message" onClick={sendMessage} />
              <CustomButton label="Back" cancel={true} onClick={() => navigate('/entrepreneur/headstaart-team')} />
            </div>
            </div>
            
        </>
    )
}

export default HeadStartServices

