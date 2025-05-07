import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserState } from '../../../context/UserContext';
import { notify } from '../../../Utiles/Notification';
import Loader from '../../../Utiles/Loader';
import { Star, StarHalf, Edit, Trash, X, Plus } from 'lucide-react';

const AddReview = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formMode, setFormMode] = useState('add'); 
  const [showForm, setShowForm] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const { user } = UserState();
  
  const [formData, setFormData] = useState({
    customer_name: '',
    comment: '',
    rating: '',
    customer_image: null
  });

  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/get_home_review_admin`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      
      if (response.data.status) {
        setReviews(response.data.data);
      }
    } catch (error) {
      notify("error", "Failed to fetch reviews");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        customer_image: file
      });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear error
      if (errors.customer_image) {
        setErrors({
          ...errors,
          customer_image: ''
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Customer name is required';
    }
    
    if (!formData.comment.trim()) {
      newErrors.comment = 'Review comment is required';
    }
    
    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }
    
    if (formMode === 'add' && !formData.customer_image) {
      newErrors.customer_image = 'Customer image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      customer_name: '',
      comment: '',
      rating: '',
      customer_image: null
    });
    setPreviewImage(null);
    setErrors({});
    setShowForm(false);
    setCurrentReview(null);
  };

  const handleAddReview = () => {
    setFormMode('add');
    setFormData({
      customer_name: '',
      comment: '',
      rating: '',
      customer_image: null
    });
    setPreviewImage(null);
    setErrors({});
    setShowForm(true);
  };

  const handleEditReview = (review) => {
    setFormMode('edit');
    setCurrentReview(review);
    setFormData({
      customer_name: review.customer_name,
      comment: review.comment,
      rating: review.rating,
      customer_image: null
    });
    setPreviewImage(review.customer_image);
    setErrors({});
    setShowForm(true);
  };

  const handleDeleteReview = async (reviewId) => {
    
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('review_id', reviewId);
        
        const response = await axios.post(`${baseUrl}/delete_home_review`, formData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (response.data.status) {
          notify("success", "Review deleted successfully");
          fetchReviews();
        } else {
          notify("error", response.data.message || "Failed to delete review");
        }
      } catch (error) {
        notify("error", "Failed to delete review");
        console.error(error);
      }
      setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    const submitFormData = new FormData();
    
    submitFormData.append('customer_name', formData.customer_name);
    submitFormData.append('comment', formData.comment);
    submitFormData.append('rating', formData.rating);
    
    if (formData.customer_image) {
      submitFormData.append('customer_image', formData.customer_image);
    }
    
    try {
      let response;
      
      if (formMode === 'add') {
        response = await axios.post(`${baseUrl}/add_home_review`, submitFormData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        submitFormData.append('review_id', currentReview.review_id);
        response = await axios.post(`${baseUrl}/update_home_review`, submitFormData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      if (response.data.status) {
        notify("success", formMode === 'add' ? "Review added successfully" : "Review updated successfully");
        resetForm();
        fetchReviews();
      } else {
        notify("error", response.data.message || `Failed to ${formMode} review`);
      }
    } catch (error) {
      notify("error", `Failed to ${formMode} review`);
      console.error(error);
    }
    
    setLoading(false);
  };

  const renderRatingStars = (rating) => {
    const numRating = parseFloat(rating);
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      if (i <= numRating) {
        stars.push(<Star key={i} className="inline text-yellow-500" size={16} fill="currentColor" />);
      } else if (i - 0.5 <= numRating) {
        stars.push(<StarHalf key={i} className="inline text-yellow-500" size={16} fill="currentColor" />);
      } else {
        stars.push(<Star key={i} className="inline text-gray-300" size={16} />);
      }
    }
    
    return stars;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
        <button 
          onClick={handleAddReview}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={18} /> Add Review
        </button>
      </div>

      {loading && <Loader />}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{formMode === 'add' ? 'Add New Review' : 'Edit Review'}</h3>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Customer Name</label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${errors.customer_name ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.customer_name && <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Comment</label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  rows="4"
                  className={`w-full p-2 border rounded ${errors.comment ? 'border-red-500' : 'border-gray-300'}`}
                ></textarea>
                {errors.comment && <p className="text-red-500 text-sm mt-1">{errors.comment}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Rating (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.5"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${errors.rating ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Customer Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={`w-full p-2 border rounded ${errors.customer_image ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.customer_image && <p className="text-red-500 text-sm mt-1">{errors.customer_image}</p>}
                
                {previewImage && (
                  <div className="mt-2">
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="w-24 h-24 object-cover rounded-full"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : formMode === 'add' ? 'Add Review' : 'Update Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {reviews.length === 0 && !loading ? (
        <div className="text-center py-8 text-gray-500">
          No reviews found. Add your first review!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div key={review.review_id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <img 
                  src={review.customer_image} 
                  alt={review.customer_name} 
                  className="w-16 h-16 rounded-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                  }}
                />
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-lg">{review.customer_name}</h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditReview(review)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteReview(review.review_id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center my-1">
                    {renderRatingStars(review.rating)}
                    <span className="ml-1 text-sm text-gray-600">({review.rating})</span>
                  </div>
                  
                  <p className="text-gray-700 mt-2">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddReview;