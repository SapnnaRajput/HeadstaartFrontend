import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const PaymentCancel = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(true);
  const [showIcon, setShowIcon] = useState(true);

  useEffect(() => {
    setShowIcon(true);
    setTimeout(() => setShowContent(true), 400);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className={`bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 ease-out 
          ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>

          <div className="flex justify-center -mt-8">
            <div className={`bg-red-100 rounded-full p-4 border-4 border-white shadow-lg transform transition-all duration-500 ease-out
              ${showIcon ? 'rotate-0 scale-100' : '-rotate-180 scale-0'}`}>
              <X className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="p-8 pt-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Payment Cancelled
            </h2>
            <p className="text-gray-600 mb-6">
              Your payment process was cancelled. No charges have been made to your account.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => navigate(`/${user.role}/dashboard`)}
                className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-medium
                  transform transition-all duration-300 hover:bg-red-600 hover:scale-[1.02] 
                  active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Return Home
              </button>

              <button
                onClick={() => window.history.back()}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium
                  transform transition-all duration-300 hover:bg-gray-200 hover:scale-[1.02]
                  active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                Try Again
              </button>
            </div>

            <div className={`mt-8 text-sm text-gray-500 transition-all duration-500 delay-300
              ${showContent ? 'opacity-100' : 'opacity-0'}`}>
              <p>Need help? Contact our support team at</p>
              <a href="mailto:support@example.com"
                className="text-red-500 hover:text-red-600 underline decoration-dotted">
                support@example.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;