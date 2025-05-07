import React, { useEffect, useState } from "react";
import { Eye, Flag, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { UserState } from "../../../context/UserContext";
import Loader from "../../../Utiles/Loader";
import { notify } from "../../../Utiles/Notification";
import axios from "axios";
import img from "../../../Assets/Images/pr-1.png";
import flag from "../../../Assets/Images/flag.png";

const Flagproject = () => {
  const [project, setProject] = useState([]);
  const { user } = UserState();
  const [loading, setLoading] = useState();

  const baseUrl = import.meta.env.VITE_APP_BASEURL;

  useEffect(() => {
    const postData = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${baseUrl}/get_flag_project`,
          {
            customer_unique_id: user?.customer?.customer_unique_id,
          },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        if (response.data.status) {
          setProject(response.data.projects);
        } else {
          setProject([]);
          // notify('error', response.data.message);
        }
      } catch (error) {
        // notify('error', 'Unauthorized access please login again');
      } finally {
        setLoading(false);
      }
    };

    postData();
  }, [baseUrl, user]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-500";
      case "Pending":
        return "bg-yellow-100 text-yellow-500";
      case "Completed" || "publish":
        return "bg-blue-100 text-blue-500";
      default:
        return "";
    }
  };

  return (
    <>
      {loading && (
        <div className="bg-gray-50 container mx-auto p-6 rounded-2xl animate-pulse">
          <div className="flex items-center mb-8">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-xl overflow-hidden transition-all duration-300"
              >
                <div className="relative aspect-video">
                  <div className="w-full h-full bg-gray-200"></div>
                  <div className="absolute top-3 right-3">
                    <div className="w-9 h-9 bg-gray-200 rounded-full"></div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center">
                      <div className="text-sm space-y-1">
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                        <div className="h-4 bg-gray-200 rounded w-12"></div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="h-4 w-4 bg-gray-200 rounded mr-1"></div>
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && (
        <div className="p-6 container mx-auto rounded-2xl">
          {project.length > 0 ? (
            <>
              <div className="flex items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                  Flag Projects
                </h1>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {project.map((list, index) => (
                  <Link
                    to={`${list.project_unique_id}`}
                    key={index}
                    className="group bg-white rounded-xl overflow-hidden transition-all shadow-sm border border-gray-100 hover:shadow-md duration-300 flex flex-col h-full"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={
                          list.projectMedia?.find(
                            (media) => media.media_type === "photo"
                          )?.media_link
                        }
                        alt={list.title}
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute top-3 right-3 transform transition-transform duration-300 hover:scale-110">
                        <div className="p-2 bg-white rounded-full shadow-md">
                          <Flag
                            className={`h-5 w-5 ${
                              user.role === "investor"
                                ? "text-purple-600"
                                : "text-yellow-500"
                            }`}
                            fill="currentColor"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-grow">
                      <div className="flex-grow">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <h2 className="font-semibold capitalize text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors duration-200">
                              {list.title}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                              {list.category.category_name}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 text-xs capitalize font-medium rounded-full whitespace-nowrap flex-shrink-0 ${getStatusClass(
                              list.status
                            )}`}
                          >
                            {list.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-2">
                        <div className="flex items-center">
                          <div className="text-sm">
                            <span className="text-gray-500">Fund Amount</span>
                            <p className="font-semibold text-gray-900">
                              {list.fund_amount || "-"}
                            </p>
                          </div>
                          <div className="text-sm ml-4">
                            <span className="text-gray-500">Equity</span>
                            <p className="font-semibold text-gray-900">
                              {list.equity || "-"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-700 text-sm">
                          <Eye className="h-4 w-4 mr-1" />
                          <span>{list.view}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">
                  No Flagged Projects
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Projects marked as flagged will appear here
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Flagproject;
