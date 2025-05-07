import React, { useState, useEffect } from 'react';
import CustomButton from '../../../Utiles/CustomButton';
import Loader from '../../../Utiles/Loader';
import axios from 'axios';
import { notify } from '../../../Utiles/Notification';
import { UserState } from '../../../context/UserContext';
import { X } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import useStripeCredentials from '../../../Utiles/StripePublicKey'


const DocumentCreator = ({ questions, content, onBack, selectedTemplate }) => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAllQuestionsAnswered, setIsAllQuestionsAnswered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDetail, setPaymentDetail] = useState(null);
  const [ansUniqueId, setAnsUniqueId] = useState(null);
  const { user } = UserState();
  const { publicKey, loading: stripeLoading, error: stripeError } = useStripeCredentials();
  const [stripeInstance, setStripeInstance] = useState(null);


  useEffect(() => {
    const initializeStripe = async () => {
      if (publicKey) {
        try {
          const stripe = await loadStripe(publicKey);
          setStripeInstance(stripe);
        } catch (error) {
          console.error('Error initializing Stripe:', error);
          notify('error', 'Failed to initialize payment system');
        }
      }
    };

    initializeStripe();
  }, [publicKey]);

  useEffect(() => {
    const checkAllAnswered = () => {
      const answeredQuestions = Object.keys(answers).length;
      const totalQuestions = questions.length;
      setIsAllQuestionsAnswered(answeredQuestions === totalQuestions);
    };

    checkAllAnswered();
  }, [answers, questions]);

  const handleInputChange = (legal_temp_content_id, value) => {
    setAnswers(prev => ({
      ...prev,
      [legal_temp_content_id]: value
    }));
  };

  const handleCheckboxChange = (legal_temp_content_id, value, checked) => {
    setAnswers(prev => {
      const currentValues = prev[legal_temp_content_id] ? prev[legal_temp_content_id].split(',') : [];
      let newValues;

      if (checked) {
        newValues = [...currentValues, value].filter(Boolean);
      } else {
        newValues = currentValues.filter(v => v !== value);
      }

      return {
        ...prev,
        [legal_temp_content_id]: newValues.join(',')
      };
    });
  };

  const preparePayload = () => {
    const data = Object.entries(answers).map(([legal_temp_content_id, value]) => ({
      legal_temp_content_id: parseInt(legal_temp_content_id),
      options: value.split(',').filter(Boolean)
    }));

    return { data };
  };

  const handleSaveDocument = async () => {
    try {
      const payload = preparePayload();
      setLoading(true);
      const response = await axios.post(
        `${baseUrl}/add_legal_temp_ans`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`
          }
        }
      );

      if (response.data.status) {
        setAnsUniqueId(response.data.data[0].ans_unique_id);
        Pay();
      }else{
        notify('error',response.data.message);
      }
    } catch (error) {
      console.error('Error fetching legal templates:', error);
      notify('error', 'Failed to fetch legal templates');
    } finally {
      setLoading(false);
    }
  };

  const Pay = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${baseUrl}/legal_checkout_success_app_web`, {
        legal_templates_id: selectedTemplate.legal_templates_id
      },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`
          }
        }
      );

      if (response.data.status) {
        setPaymentDetail(response.data.payment_detail);
        setShowPaymentModal(true)
      }
    } catch (error) {
      console.error('Error fetching legal templates:', error);
      notify('error', 'Failed to fetch legal templates');
    } finally {
      setLoading(false);
    }
  };

  const renderQuestion = (question) => {
    const { legal_temp_content_id, qus_type, question: questionText, options } = question;

    switch (qus_type) {
      case 'input':
        return (
          <div className="mb-4">
            <label className="block text-gray-700 text-base font-medium mb-2">
              {questionText}
            </label>
            <input
              type="text"
              value={answers[legal_temp_content_id] || ''}
              onChange={(e) => handleInputChange(legal_temp_content_id, e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A3AFF] focus:border-transparent outline-none transition-all"
              placeholder="Type your answer here..."
            />
          </div>
        );

      case 'radio':
        return (
          <div className="mb-4">
            <label className="block text-gray-700 text-base font-medium mb-2">
              {questionText}
            </label>
            <div className="space-y-2">
              {Object.entries(options).map(([key, value]) => {
                if (!value) return null;
                return (
                  <label key={key} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${legal_temp_content_id}`}
                      value={value}
                      checked={answers[legal_temp_content_id] === value}
                      onChange={(e) => handleInputChange(legal_temp_content_id, e.target.value)}
                      className="h-4 w-4 text-[#4A3AFF] focus:ring-[#4A3AFF]"
                    />
                    <span className="text-gray-700 capitalize">{value}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );

      case 'checkbox':
        const checkboxOptions = Object.values(options).filter(Boolean);
        return (
          <div className="mb-4">
            <label className="block text-gray-700 text-base font-medium mb-2">
              {questionText}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {checkboxOptions.map((option) => {
                const isChecked = (answers[legal_temp_content_id] || '')
                  .split(',')
                  .includes(option);
                return (
                  <label key={option} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      value={option}
                      checked={isChecked}
                      onChange={(e) => handleCheckboxChange(
                        legal_temp_content_id,
                        option,
                        e.target.checked
                      )}
                      className="h-4 w-4 text-[#4A3AFF] focus:ring-[#4A3AFF] rounded"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderDocument = () => {
    let renderedContent = content;
    Object.entries(answers).forEach(([id, answer]) => {
      renderedContent = renderedContent.replace(
        `{${id}}`,
        answer ? `<span class="text-black font-medium text-lg">${answer}</span>` : '<span class="text-gray-400">________</span>'
      );
    });
    return (
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: renderedContent }}
      />
    );
  };

  const handlePayNow = async () => {
    try {
      setLoading(true);

      const paymentPayload = {
        customer_unique_id: user?.customer?.customer_unique_id,
        legal_templates_id: selectedTemplate.legal_templates_id,
        ans_unique_id: ansUniqueId,
        payment_method: 'card',
        payable_amount: paymentDetail.payable_amount,
        template_tax: paymentDetail.serviceTax,
        template_service_fee: paymentDetail.governmentCharge,
        success_url: (`${window.location.origin}/${user.role}/e-sign-document`).trim(),
        cancel_url: (`${window.location.origin}/${user.role}/verification/cancel`).trim()
      };

      const response = await axios.post(
        `${baseUrl}/legal_checkout`,
        paymentPayload,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`
          }
        }
      );

      if (response.data.status) {
        localStorage.setItem('ans_unique_id', ansUniqueId)
        const { error } = await stripeInstance.redirectToCheckout({
          sessionId: response.data.id
        });

        if (error) {
          notify('error', error.message);
        }
      } else {
        notify('error', response.data.message || 'Payment processing failed');
      }

    } catch (error) {
      console.error('Error processing payment:', error);
      notify('error', 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-[#05004E]">Create Document</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border p-6 shadow-sm h-[calc(100vh-200px)] overflow-hidden">
            <div className="mb-4">
              <h2 className="text-lg font-medium text-gray-900 mb-3">
                Questions ({currentQuestionIndex + 1}/{questions.length})
              </h2>
              <div className="mt-1 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-[#4A3AFF] rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`
                  }}
                />
              </div>
            </div>

            <div className="space-y-6">
              {questions.map((q, index) => (
                <div
                  key={q.legal_temp_content_id}
                  className={index === currentQuestionIndex ? 'block' : 'hidden'}
                >
                  {renderQuestion(q)}
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 disabled:text-gray-400 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                disabled={currentQuestionIndex === questions.length - 1}
                className="px-4 py-2 text-sm font-medium bg-[#4A3AFF] text-white rounded-lg hover:bg-[#3D32CC] disabled:bg-gray-400 transition-colors"
              >
                Next
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-2 p-6 shadow-sm h-[calc(100vh-200px)] overflow-auto flex flex-col">
            <h2 className="text-lg font-medium text-gray-900 mb-4 sticky">Document Preview</h2>
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white opacity-50 rounded-lg"></div>

                <div className="relative prose max-w-none text-gray-800 leading-relaxed">
                  {renderDocument()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          {isAllQuestionsAnswered && (
            <CustomButton
              onClick={handleSaveDocument}
              label={"Save & Pay"}
            />
          )}
          <CustomButton
            onClick={onBack}
            label={'Back'}
            cancel={true}
          />
        </div>

      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X />
            </button>

            <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Details</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Customer Name</span>
                <span className="font-medium">{paymentDetail.customer_full_name}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Date</span>
                <span className="font-medium">{paymentDetail.today_date}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Document Name</span>
                <span className="font-medium">{paymentDetail.document_name}</span>
              </div>

              <div className="h-px bg-gray-200 my-4"></div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Document Amount</span>
                <span className="font-medium">${paymentDetail.documentAmount}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Service Tax</span>
                <span className="font-medium">${paymentDetail.serviceTax}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Service Tax Percentage</span>
                <span className="font-medium">{paymentDetail.service_tax_percentage} %</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Government Charge</span>
                <span className="font-medium">${paymentDetail.governmentCharge}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Government Charge Percentage</span>
                <span className="font-medium">{paymentDetail.government_charge_percentage} %</span>
              </div>

              <div className="h-px bg-gray-200 my-4"></div>

              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Amount</span>
                <span className="text-[#4A3AFF]">${paymentDetail.payable_amount}</span>
              </div>
            </div>
            <div className='mt-6 flex justify-end'>
              <CustomButton
                label={"Pay Now"}
                onClick={handlePayNow}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentCreator;