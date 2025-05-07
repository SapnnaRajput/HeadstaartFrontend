import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { UserState } from '../../context/UserContext';
import { notify } from '../../Utiles/Notification';
import axios from 'axios';
import {
  Award,
  BadgeCheck,
  Building,
  Check,
  DollarSign,
  FileText,
  Globe,
  Mail,
  MapPin,
  Percent,
  Tag,
} from 'lucide-react';

const EntreprenurDetails = () => {
  const location = useLocation();

  const entreprenurDetails = location?.state;
  const { user } = UserState();

  const navigate = useNavigate();

  const handelSendMessage = (chatId) => {
    navigate(`/${user.role}/messages/${chatId}`);
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-3 border-b-2 border-gray-200 pb-3">
        Entrepreneur Details
      </h3>
      <div className="p-5">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <img
              src={entreprenurDetails?.reciver_profile_image}
              alt={entreprenurDetails?.reciver_full_name}
              className="w-full h-48 md:h-64 object-cover rounded-xl mb-4"
            />
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {entreprenurDetails?.reciver_full_name}
                </h3>
                {entreprenurDetails?.isVerified && (
                  <div className=" bg-blue-500/10 rounded-full p-1">
                    <BadgeCheck className="w-6 h-6 text-blue-500" />
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-600 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {entreprenurDetails?.city?.city_name || ''},
                {entreprenurDetails?.state?.state_name || ''},
                {entreprenurDetails?.country?.country_name || ''}
              </p>
            </div>
          </div>

          <div className="md:w-2/3">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {entreprenurDetails?.title}
                </h3>
                <p className="text-sm text-gray-600 flex items-center gap-1 mb-4">
                  <Building className="w-4 h-4" />
                  {entreprenurDetails?.company_name || ''}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Category</div>
                  <div className="font-medium flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    {entreprenurDetails?.category?.category_name || 'N/A'}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Stage</div>
                  <div className="font-medium flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    {entreprenurDetails?.stage?.business_stage_name || 'N/A'}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Funding Amount</div>
                  <div className="font-medium flex items-center gap-1">
                    {entreprenurDetails?.fund_amount
                      ? `$${entreprenurDetails?.fund_amount}`
                      : 'N/A'}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Equity Offered</div>
                  <div className="font-medium flex items-center gap-1">
                    {entreprenurDetails?.equity
                      ? `${entreprenurDetails?.equity}%`
                      : 'N/A'}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-gray-700 text-sm">
                  {entreprenurDetails?.description ||
                    'No description available.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {entreprenurDetails?.website_name && (
                  <a
                    href={
                      entreprenurDetails?.website_name.startsWith('http')
                        ? entreprenurDetails?.website_name
                        : `https://${entreprenurDetails?.website_name}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    Website
                  </a>
                )}
                {entreprenurDetails?.pitch_deck_file && (
                  <a
                    href={entreprenurDetails?.pitch_deck_file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    Pitch Deck
                  </a>
                )}
                <button
                  onClick={() =>
                    handelSendMessage(entreprenurDetails?.chat_initiate_id)
                  }
                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm bg-[#4A3AFF] text-white hover:bg-[#3D32CC] rounded-lg transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntreprenurDetails;
