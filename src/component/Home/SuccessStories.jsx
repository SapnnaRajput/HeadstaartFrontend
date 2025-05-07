import React, { useEffect, useState } from "react";
import rating from "../../Assets/Images/rating.png";
import axios from "axios";
import { Star, StarHalf, StarOff } from "lucide-react";

const SuccessStories = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getProjects = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/get_home_review`);
        if (response.data.status) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
      setLoading(false);
    };
    getProjects();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="w-4 h-4 text-yellow-500"
          fill="currentColor"
        />
      );
    }
    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          className="w-4 h-4 text-yellow-500"
          fill="currentColor"
        />
      );
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`off-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div id="testimonials" className="min-h-[600px] py-8 md:py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2 sm:mb-4">
          Testimonals
        </h2>
        <p className="text-xl md:text-xl lg:text-xl text-center mb-4 md:mb-6">
        Your success is our priority
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-12">
          {data.map((story) => (
            <div
              key={story.review_id}
              className="card2 flex flex-col items-center justify-center p-4 md:p-6 bg-gray-50 rounded-2xl mt-6 md:mt-12 space-y-1 text-gray-500"
            >
              <div>
                <img
                  src={story.customer_image}
                  alt=""
                  className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full"
                />
              </div>
              <h5 className="text-black font-medium text-sm md:text-base">
                {story.customer_name}
              </h5>
              <p className="text-xs md:text-sm">{story.role}</p>
              <p className="text-xs md:text-sm">{story.comment}</p>
              <div className="flex gap-1 mt-1">{renderStars(story.rating)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuccessStories;
