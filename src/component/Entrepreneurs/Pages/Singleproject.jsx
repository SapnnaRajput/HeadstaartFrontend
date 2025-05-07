import {
  BellDot,
  EllipsisVertical,
  Eye,
  FileStack,
  MessageCircleMore,
  MoreVertical,
  Lock,
  Send,
  FileText,
  Flag,
  Map,
  MapPin,
  ActivitySquare,
  WebcamIcon,
  Globe,
  Building,
  ArrowUpFromDot,
} from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import img from '../../../Assets/Images/project.png';
import flag from '../../../Assets/Images/flag.png';
import { UserState } from '../../../context/UserContext';
import axios from 'axios';
import Loader from '../../../Utiles/Loader';
import { notify } from '../../../Utiles/Notification';

const Singleproject = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const { id } = useParams();
  const { user } = UserState();
  const [loading, setLoading] = useState(false);
  const [projectData, setProjectData] = useState({});
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/get_entrepreneur_single_project`,
        {
          project_unique_id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.data.status) {
        console.log(response.data.projectDetail);

        setProjectData(response.data.projectDetail);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateProjectStatus = async (status) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/project_status_update`,
        {
          project_unique_id: id,
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.data.status) {
        notify('success', response.data.message);
      } else if (!response.data.status) {
        notify('error', response.data.message);
      }
    } catch (error) {
      console.error('Error updating project status:', error);
      notify('error', 'Failed to update project status');
    } finally {
      setLoading(false);
    }
  };
  const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
  };

  const getFileIcon = (extension) => {
    switch (extension) {
      case 'pdf':
        return (
          <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
            <span className="text-red-600 text-xs font-bold">PDF</span>
          </div>
        );
      case 'mp4':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
            <span className="text-blue-500 text-xs font-bold">MP4</span>
          </div>
        );
      case 'jpg':
        return (
          <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
            <span className="text-orange-500 text-xs font-bold">JPG</span>
          </div>
        );
      case 'jpeg':
        return (
          <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
            <span className="text-orange-500 text-xs font-bold">JPEG</span>
          </div>
        );
      case 'png':
        return (
          <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
            <span className="text-orange-500 text-xs font-bold">PNG</span>
          </div>
        );
      case 'xls':
      case 'xlsx':
        return (
          <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
            <span className="text-green-600 text-xs font-bold">XLS</span>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
            <FileText className="w-4 h-4 text-gray-600" />
          </div>
        );
    }
  };

  const handleDocumentClick = (url) => {
    window.open(url, '_blank');
  };

  const pathname = window.location.pathname;
  const firstPart = `/${pathname.split('/')[1]}`;

  const documentFiles = projectData.projectMedia ?? [];
  const getFileName = (url) => {
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  const handleFlagUnflag = (isFlag) => async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/flag_or_unflag_project`,
        {
          project_unique_id: id,
          type: isFlag ? 'false' : 'true',
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.data.status) {
        await fetchCategories();
        notify(
          'success',
          isFlag
            ? 'Project unflagged successfully'
            : 'Project flagged successfully'
        );
        window.location.reload();
      } else {
        notify(
          'error',
          response.data.message || 'Failed to update flag status'
        );
      }
    } catch (error) {
      notify(
        'error',
        error.response?.data?.message ||
          'An error occurred while updating flag status'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="bg-white rounded-xl p-3 md:p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
          <h1 className="text-2xl md:text-3xl font-semibold text-[#05004E] capitalize">
            {projectData.title}
          </h1>
          <div className="flex flex-row gap-2">
            <div
              onClick={handleFlagUnflag(
                projectData.isFlag,
                projectData.project_unique_id
              )}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
            >
              <Flag
                className="h-7 w-7 xs:h-6 xs:w-6 text-gray-500"
                fill={projectData.isFlag ? '#f09035' : 'none'}
                color={projectData.isFlag ? '#f09035' : 'currentColor'}
              />
            </div>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <MoreVertical className="text-gray-600 w-5 h-5" />
              </button>

              {showOptions && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    onClick={() => {
                      setShowOptions(false);
                      updateProjectStatus('Private');
                    }}
                  >
                    <Lock className="w-4 h-4" />
                    <span>Set as Private</span>
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-gray-50 flex items-center gap-2"
                    onClick={() => {
                      setShowOptions(false);
                      updateProjectStatus('Active');
                    }}
                  >
                    <Send className="w-4 h-4" />
                    <span>Publish</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row mt-5 gap-5">
          <div className="w-full lg:w-3/5">
            <img
              src={
                projectData.projectMedia?.find(
                  (media) => media.media_type === 'photo'
                ).media_link
              }
              alt=""
              className="rounded-xl w-full object-cover aspect-video"
            />
            <div className="flex flex-col sm:flex-row w-full mt-4 gap-5 ">
              <div className="w-full sm:w-1/2 flex gap-3  items-center  bg-neutral-100 p-4 sm:p-3 rounded-md">
                <MapPin className="text-[#4A3AFF]" />
                <p>
                  {`${projectData?.city?.city_name || ''} , ${
                    projectData?.state?.state_name || ''
                  } , 
                            ${projectData?.country?.country_name || ''}
                            `}
                </p>
              </div>
              <div className="w-full sm:w-1/2 flex gap-3 h-full justify-center items-center ">
                <div className="bg-neutral-100 p-3 w-1/2 rounded-md">
                  <p> Equity</p>
                  <p>
                    <span className="text-[#4A3AFF]">
                      {projectData?.equity}%{' '}
                    </span>
                  </p>
                </div>
                <div className="bg-neutral-100  w-1/2 p-3 rounded-md">
                  <p> Funding</p>
                  <p>
                    <span className="text-[#4A3AFF]">
                      ${projectData?.fund_amount}
                    </span>{' '}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-2 w-full">
                <div className="w-1/2 my-2 gap-3 rounded-md bg-neutral-100 p-3 font-medium text-blue-500 flex">
                  <Globe />
                  <a href={`https://${projectData?.website_name}`} rel="noopener noreferrer" target='_blank' className="line-clamp-2">{projectData?.website_name}</a>
                </div>             
              <div className="w-1/2 my-2 flex gap-3 rounded-md bg-neutral-100 p-3 ">
                <Building className="text-[#4A3AFF]" />
                <p>{projectData?.company_name}</p>
              </div>
            </div>
            <div className="flex gap-4 w-full">
                <div className="w-1/2 my-2 gap-3 rounded-md bg-neutral-100 p-3  ">
                 <h2 className='font-medium'>
                    Project Types
                 </h2>
                 <ul className=' translate-x-5'>
                 {
                    projectData?.projectTypes?.map(pt => <li
                   key={pt?.project_type} className='text-sm text-gray-600 list-disc'
                    >
                        {pt?.project_type}
                    </li>)
                 }
                 </ul>
                </div> 
                            
              <div className="w-1/2 my-2 sm:h-1/2  gap-3 rounded-md bg-neutral-100 p-3 ">
              <h2 className='font-medium'>
                    Sell Type
                 </h2>
                <p className='text-sm text-[#4A3AFF] '>{projectData?.sell_type}</p>
              </div>
            </div>
            <p className="text-base font-normal mt-2">
              {projectData.description}
            </p>
          </div>
          <div className="w-full lg:w-2/5 space-y-5">
            <div>
              <h1 className="text-base font-bold">Project Status</h1>
              <div className="mt-4 rounded-xl border border-[#D1D6DC] overflow-hidden">
                <div className="w-full flex justify-between place-items-center p-4">
                  <h1 className="text-[#535763] text-base font-semibold">
                    Status
                  </h1>
                  <div className="flex flex-row gap-2 items-center text-[#B7B7B7] font-bold text-sm">
                    {!loading && (
                      <div className="flex flex-row gap-2 items-center text-[#B7B7B7] font-bold text-sm">
                        {projectData?.status === 'Active' ? (
                          <span className="text-green-600">Active</span>
                        ) : (
                          <span className="text-red-600">In Active</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-base font-bold">Project Views</h1>
              <div className="mt-4 rounded-xl border border-[#D1D6DC] overflow-hidden">
                <div className="w-full flex justify-between place-items-center p-4">
                  <h1 className="text-[#535763] text-base font-semibold">
                    Total View
                  </h1>
                  <div className="flex flow-row gap-2 place-items-center text-[#B7B7B7] font-bold text-sm">
                    <Eye size={20} />
                    {projectData.total_view}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h1 className="text-base font-bold">Investor Interest</h1>
              <div className="mt-4 rounded-xl border border-[#D1D6DC] overflow-hidden">
                <div className="flex justify-between items-center px-4 py-3">
                  <h1 className="text-sm font-semibold">Investor interacted</h1>
                  <span className="text-[#535763] font-medium text-sm">
                    {projectData.investor_interacted}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-row gap-4 md:gap-10 place-items-center justify-center md:justify-evenly">
              <Link to={`/${user.role}/messages`}>
                <div className="bg-[#DFF1FF] p-4 rounded-full flex justify-center place-items-center text-[#0F65A9] relative">
                  <MessageCircleMore size={28} />
                  <div className="absolute bg-[#0F65A9] rounded-full h-5 w-5 -top-1 -right-1 text-white font-semibold text-sm flex place-items-center justify-center">
                    {projectData.chat_initiate_count}
                  </div>
                </div>
              </Link>
              <Link to={`/${user.role}/documents`}>
                <div className="bg-[#E8FFEB] p-4 rounded-full flex justify-center place-items-center text-[#008211] relative">
                  <FileStack size={28} />
                  <div className="absolute bg-[#008211] rounded-full h-5 w-5 -top-1 -right-1 text-white font-semibold text-sm flex place-items-center justify-center">
                    {projectData.shared_document_count}
                  </div>
                </div>
              </Link>
            </div>

            <div>
              <h1 className="text-base font-bold">Statistics</h1>
              <div className="space-y-4 mt-4">
                <div className="rounded-xl border border-[#D1D6DC] overflow-hidden">
                  <div className="flex justify-between px-4 md:px-8 py-3">
                    <h1 className="text-sm font-semibold">
                      Investor Inquiries
                    </h1>
                    <span className="text-[#535763] font-medium text-sm">
                      {projectData.investor_inuqiries}
                    </span>
                  </div>
                </div>
                <div className="rounded-xl border border-[#D1D6DC] overflow-hidden">
                  <div className="flex justify-between px-4 md:px-8 py-3">
                    <h1 className="text-sm font-semibold">Agent Inquiries</h1>
                    <span className="text-[#535763] font-medium text-sm">
                      {projectData.agent_inuqiries}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Important Documents</h2>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {documentFiles.map((doc, index) => {
                    const fileName = getFileName(doc.media_link);
                    const extension = getFileExtension(fileName);
                    return (
                      <div
                        key={doc.project_media_id}
                        onClick={() => window.open(doc.media_link, '_blank')}
                        className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-3"
                      >
                        <div className="flex items-center gap-3">
                          {getFileIcon(extension)}
                          <div>
                            <p className="text-sm font-medium">
                              {fileName.length > 20
                                ? `${fileName.substring(0, 20)}...`
                                : fileName}
                            </p>
                            <p className="text-xs text-gray-500">31.3 KB</p>
                          </div>
                        </div>
                        <Eye className="w-4 h-4 text-gray-400" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {projectData.additional_info &&
              projectData.additional_info.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold">
                      Financials & Key Milestones
                    </h2>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      {projectData.additional_info?.map((info, index) => (
                        <div key={index}>
                          <h3 className="font-medium mb-1">{info.heading}:</h3>
                          <p className="text-sm text-gray-600">{info.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Singleproject;
