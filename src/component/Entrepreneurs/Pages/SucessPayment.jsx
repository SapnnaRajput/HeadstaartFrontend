import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { UserState } from '../../../context/UserContext';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const {user} = UserState();

  useEffect(() => {
    setShowIcon(true);
    setTimeout(() => setShowContent(true), 400);
    setTimeout(() => setShowConfetti(true), 200);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10%',
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
                backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EC4899'][
                  Math.floor(Math.random() * 4)
                ],
                width: '8px',
                height: '8px',
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-md w-full">
        <div className={`bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 ease-out 
          ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          
          <div className="flex justify-center -mt-8">
            <div className={`bg-green-100 rounded-full p-4 border-4 border-white shadow-lg transform transition-all duration-500 ease-out
              ${showIcon ? 'rotate-0 scale-100' : '-rotate-180 scale-0'}`}>
              <Check className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="p-8 pt-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for your verification! Your blue tick will be activated soon.
            </p>

            {/* <div className={`mb-6 p-4 bg-green-50 rounded-lg border border-green-100 transition-all duration-500 delay-200
              ${showContent ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
              <div className="text-sm text-gray-600 space-y-2">
                <p>• Your verification is being processed</p>
                <p>• You'll receive a confirmation email shortly</p>
                <p>• Blue tick activation within 24-48 hours</p>
              </div>
            </div> */}

            <div className="space-y-3">
              <button
                onClick={() => navigate(`/${user.role}/dashboard`)}
                className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-medium
                  transform transition-all duration-300 hover:bg-green-600 hover:scale-[1.02] 
                  active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Return to Dashboard
              </button>
              
              <button
                onClick={() => window.history.back()}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium
                  transform transition-all duration-300 hover:bg-gray-200 hover:scale-[1.02]
                  active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
               Back
              </button>
            </div>

            <div className={`mt-8 text-sm text-gray-500 transition-all duration-500 delay-300
              ${showContent ? 'opacity-100' : 'opacity-0'}`}>
              <p>Have questions about your verification?</p>
              <a href="mailto:support@example.com" 
                className="text-green-500 hover:text-green-600 underline decoration-dotted">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;