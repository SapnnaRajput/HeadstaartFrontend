import { Circle, CircleCheck, Eye, Plus, Flag, Filter, ChevronDown } from 'lucide-react'
import React, { memo, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Dropdown, DropdownItem, Modal } from "flowbite-react";
import CustomButton from '../../../Utiles/CustomButton';
import axios from 'axios';
import { notify } from '../../../Utiles/Notification';
import Loader from '../../../Utiles/Loader';
import { UserState } from '../../../context/UserContext';
import img from '../../../Assets/Images/pr-1.png';


const FilterDropdown = memo(({ onFilterChange , filters , selectedFilter , setSelectedFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
 

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    onFilterChange(filter);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        className='bg-[#4A3AFF] w-32 px-2 py-2 rounded flex items-center justify-between '
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-white">{selectedFilter}</span>
        <ChevronDown className='text-white' />
      </button>
      {isOpen && (
        <div className="absolute mt-2 z-10 top-full left-0 w-40 bg-white border rounded-lg shadow-md">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterClick(filter)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-200"
            >
              {filter}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

const Projects = () => {

  const baseUrl = import.meta.env.VITE_APP_BASEURL;

  const navigate = useNavigate();
  const { user } = UserState();
  const [loading, setLoading] = useState(false);
  const [loadingSkelaton, setLoadingSkelaton] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [active, setActive] = useState('standard');
  const [project, setProject] = useState([]);

  const [selectedFilter, setSelectedFilter] = useState("All");
  const filters = ["All", "Flagged", "Unflagged"];

  const close = () => {
    setActive('standard')
    setOpenModal(false)
  }

  const handleNextClick = () => {
    if (active === 'standard') {
      navigate('/entrepreneur/new-project');
    } else if (active === 'ai-assisted') {
      navigate('/entrepreneur/ai-assisted');
    }
  };

  const postData = async (type = 'all') => {
    setLoadingSkelaton(true);
    try {
      const response = await axios.post(`${baseUrl}/entufilterProjects`,
        {
          filter_type: type,
        }, 
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
    );
    
      if (response.data.status) {
        setProject(response.data.projectDetail);
      } else {
        setProject([])
      }

    } catch (error) {
      notify('error', 'Unauthorized access please login again');
    } finally {
      setLoadingSkelaton(false);
    }
  };

  useEffect(() => {
    postData();
    setSelectedFilter('All')
  }, [baseUrl]);

    const handleFilterChange = async (filter) => {
      if (filter === 'Flagged') {
        await postData('flag')
      } else if (filter === 'Unflagged') {
        await postData('unflag');
      } else {
        await postData('all');
      }
    };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-500';
      case 'private':
        return 'bg-yellow-100 text-yellow-500';
      case 'publish':
        return 'bg-blue-100 text-blue-500';
      default:
        return '';
    }
  };

  const handleFlagUnflag = (isFlag, projectId) => async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/flag_or_unflag_project`,
        {
          project_unique_id: projectId,
          type: isFlag ? "false" : "true"
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.data.status) {
        await postData()

        notify('success', isFlag ? 'Project unflagged successfully' : 'Project flagged successfully');
        window.location.reload();
      } else {
        notify('error', response.data.message || 'Failed to update flag status');
      }
    } catch (error) {
      notify('error', error.response?.data?.message || 'An error occurred while updating flag status');
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      {loading && <Loader />}

      {loadingSkelaton && (
        <div className="min-h-screen  container mx-auto bg-gray-50 p-6">
          <div className="mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="h-10 w-32 bg-gray-200 rounded"></div>
                <div className="h-10 w-32 bg-gray-200 rounded"></div>
                <div className="h-10 w-40 bg-gray-200 rounded"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 md:gap-6">
              {[...Array(15)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                  <div className="relative h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="mb-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 pt-3 border-t border-gray-100">
                      <div className="text-sm">
                        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                      <div className="text-sm">
                        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="h-6 w-12 bg-gray-200 rounded"></div>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="h-6 w-6 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!loadingSkelaton && (<div className="min-h-screen  container mx-auto bg-gray-50 p-6">
        <div className="mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
            <FilterDropdown onFilterChange={handleFilterChange} filters={filters} setSelectedFilter={
              setSelectedFilter} selectedFilter={selectedFilter}
            />
              {user.role === 'entrepreneur' && (
                <Link
                  to="/entrepreneur/promote-project"
                  className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-[#4A3AFF] bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all duration-200"
                >
                  Promote Project
                </Link>
              )}
              <button
                onClick={() => setOpenModal(true)}
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-[#4A3AFF] rounded-lg hover:bg-[#3D32CC] shadow-sm transition-all duration-200"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Project
              </button>
            </div>
          </div>

          {project.length > 0 ? (
            <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 md:gap-6">
              {project.map((list, index) => (
                <Link
                  to={`${list.project_unique_id}`}
                  key={index}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full"
                >
                  <div className="relative">
                    <img
                      src={list.projectMedia?.find(media => media.media_type === "photo")?.media_link}
                      alt={list.title}
                      className="w-full h-40 xs:h-36 sm:h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 xs:top-3 xs:right-3">
                    <div
                          onClick={handleFlagUnflag(list.isFlag, list.project_unique_id)}
                          className="cursor-pointer"
                          role="button"
                          tabIndex={0}
                        >
                          <Flag
                            className="h-7 w-7 xs:h-6 xs:w-6 text-gray-500"
                            fill={list.isFlag ? "#f09035" : "none"}
                            color={list.isFlag ? "#f09035" : "currentColor"}
                          />
                        </div>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 flex flex-col flex-grow">
                    <div className="mb-2 sm:mb-3 flex-grow">
                      <h2 className="text-base xs:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 capitalize line-clamp-2">
                        {list.title}
                      </h2>
                      <p className="text-xs xs:text-sm text-gray-500">
                        {list.category?.category_name}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-1 xs:gap-1 pt-2 xs:pt-3 border-t border-gray-100 mt-auto text-center">
                      <div className="text-xs xs:text-sm">
                        <p className="text-gray-500">Funding</p>
                        <p className="font-semibold text-gray-900">${list.fund_amount}</p>
                      </div>
                      <div className="text-xs xs:text-sm">
                        <p className="text-gray-500">Equity</p>
                        <p className="font-semibold text-gray-900">{list.equity}%</p>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="flex items-center text-gray-500 text-xs xs:text-sm">
                          <Eye className="h-3 w-3 xs:h-4 xs:w-4 mr-0.5 xs:mr-1" />
                          <span>{list.view}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 xs:py-12 px-4">
              <div className="text-center">
                <h3 className="text-base xs:text-lg font-medium text-gray-900">No Projects Available</h3>
                <p className="mt-1 text-xs xs:text-sm text-gray-500">Get started by creating a new project.</p>
              </div>
            </div>
          )}
        </div>
      </div>)}

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Body>
          <div className="flex flex-row place-items-center justify-between">
            <h1 className='text-2xl font-semibold text-center'>Create New Project</h1>
            <div className="text-2xl rotate-45 cursor-pointer text-[#7d7d7e]" onClick={close}>
              <Plus />
            </div>
          </div>
          <div className="space-y-6 mt-5">
            <div onClick={() => setActive('standard')} className={`flex flex-row justify-between items-center cursor-pointer border-2 rounded-xl py-3 px-2 ${active === 'standard' ? 'border-[#4A3AFF]' : 'border-[#E4E4E7]'}`}>
              Standard Creation
              <div className={`${active === 'standard' ? 'text-[#4A3AFF]' : 'text-[#E4E4E7]'}`}>
                {active === 'standard' ? <CircleCheck /> : <Circle />}
              </div>
            </div>
            <div htmlFor="ai-assisted" onClick={() => setActive('ai-assisted')} className={`flex flex-row justify-between items-center cursor-pointer border-2 rounded-xl py-3 px-2 ${active === 'ai-assisted' ? 'border-[#4A3AFF]' : 'border-[#E4E4E7]'}`}>
              AI-Assisted Pitch Deck Creation
              <div className={`${active === 'ai-assisted' ? 'text-[#4A3AFF]' : 'text-[#E4E4E7]'}`}>
                {active === 'ai-assisted' ? <CircleCheck /> : <Circle />}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className='flex justify-end'>
          <CustomButton label="Next" onClick={handleNextClick} />
        </Modal.Footer>
      </Modal>


    </>
  )
}

export default Projects