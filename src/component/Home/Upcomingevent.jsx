import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UpcomingEvents = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
  
  useEffect(() => {
    const getEvents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/get_home_event`);
        if (response.data.status) {
          setEvents(response.data.eventDetails || []);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    getEvents();
  }, [baseUrl]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const handleEventClick = () => {
    navigate(`/sign-up-as`);
  };
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-4">
            Upcoming Events
          </h2>
        </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div 
                key={event.upcoming_events_id}
                onClick={handleEventClick}
                className="bg-white rounded-xl cursor-pointer overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={event.eventImages && event.eventImages.length > 0 ? event.eventImages[0].event_image : 'https://via.placeholder.com/400x250'} 
                    alt={event.event_title}
                    className="w-full h-full object-cover"
                  />
                  {event.ispaid && (
                    <span className="absolute top-4 right-4 bg-[#4A3AFF] text-white text-xs font-bold px-3 py-1 rounded-full">
                      ${event.event_price}
                    </span>
                  )}
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{event.event_title}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{event.description}</p>
                  </div>
                  
                  <div className="space-y-3 mt-2">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span className="text-sm">
                        {formatDate(event.started_date)} - {formatDate(event.ended_date)}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="text-sm">
                        {formatTime(event.started_time)} - {formatTime(event.ended_time)}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <span className="text-sm line-clamp-1">
                        {event.city_name}, {event.state_name}, {event.country_name}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="inline-block bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full font-medium">
                      {event.event_type}
                    </span>
                  
                  </div>
                </div>
              </div>
            ))}
          </div>
        
        {!loading && events.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No upcoming events found.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingEvents;