import React, { useCallback, useEffect, useState } from 'react';
import { Clock, Loader } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Foooter';
import { notify } from '../../Utiles/Notification';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const policyRoles = {
  entrepreneur: 'entrepreneur',
  investor: 'investor',
  agent: 'agent',
};

const TermsAndConditions = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const [searchParams] = useSearchParams();
  const [terms, setTerms] = useState([]);
  const [allTerms, setAllTerms] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('entrepreneur');
  const [effectiveDates, setEffectiveDates] = useState({});
  const roleType = searchParams.get('type');

  const fetchTermsByType = useCallback(async () => {
    setLoading(true);
    try {
      if (!roleType) return;
      const res = await axios.post(`${baseUrl}/get_term_conditions`, { role: roleType });
      if (res.data.status) {
        const termsData = res.data.terms.conditions_paras || [];
        setTerms(termsData);
        
        // Extract effective date - typically the third paragraph
        const effectiveDatePara = termsData.find((para, index) => 
          index < 5 && para.paragraph && para.paragraph.includes("Effective Date"));
        
        if (effectiveDatePara) {
          setEffectiveDates(prev => ({
            ...prev,
            [roleType]: effectiveDatePara.paragraph
          }));
        }
      }
    } catch (error) {
      notify('error', "Can't Get Terms And Conditions");
    } finally {
      setLoading(false);
    }
  }, [roleType, baseUrl]);

  const fetchAllTerms = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/get_term_all`);
      if (res.data.status) {
        const allTermsData = res.data.term || {};
        setAllTerms(allTermsData);
        
        // Extract effective dates for all roles
        const dates = {};
        Object.keys(policyRoles).forEach(role => {
          if (allTermsData[role] && allTermsData[role][0]?.term_paras) {
            const effectiveDatePara = allTermsData[role][0].term_paras.find((para, index) => 
              index < 5 && para.paragraph && para.paragraph.includes("Effective Date"));
            
            if (effectiveDatePara) {
              dates[role] = effectiveDatePara.paragraph;
            }
          }
        });
        
        setEffectiveDates(dates);
        setTerms(allTermsData[activeTab]?.[0]?.term_paras || []);
      }
    } catch (error) {
      notify('error', "Can't Get Terms And Conditions");
    } finally {
      setLoading(false);
    }
  }, [baseUrl, activeTab]);

  useEffect(() => {
    if (roleType) {
      fetchTermsByType();
    } else {
      fetchAllTerms();
    }
  }, [roleType, fetchTermsByType, fetchAllTerms]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setTerms(allTerms[tab]?.[0]?.term_paras || []);
  };

  return (
    <>
      <Navbar />
      {loading ? (
        <LoadingSpinner />
      ) : roleType ? (
        <TypeBasedTerms 
          terms={terms} 
          effectiveDate={effectiveDates[roleType]}
        />
      ) : (
        <AllTermsView
          terms={terms}
          activeTab={activeTab}
          handleTabClick={handleTabClick}
          effectiveDates={effectiveDates}
        />
      )}
      <Footer />
    </>
  );
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#4A3AFF]"></div>
  </div>
);

const organizeTermsIntoSections = (terms) => {
  const sections = [];
  let currentSection = null;
  
  const introContent = terms.slice(0, 3);
  
  terms.slice(3).forEach(term => {
    if (term.heading === "1") {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        heading: term.paragraph,
        paragraphs: []
      };
    } else if (term.heading === "0" && currentSection) {
      currentSection.paragraphs.push(term.paragraph);
    } else {
      if (!sections.length) {
        sections.push({
          heading: "Introduction",
          paragraphs: [term.paragraph]
        });
      } else {
        sections[sections.length - 1].paragraphs.push(term.paragraph);
      }
    }
  });
  
  // Add the last section if it exists
  if (currentSection) {
    sections.push(currentSection);
  }
  
  return { introContent, sections };
};

const TypeBasedTerms = ({ terms, effectiveDate }) => {
  const { introContent, sections } = organizeTermsIntoSections(terms);
  
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="bg-white shadow-md py-10 text-center">
        <div className="container mx-auto px-6 md:px-12">
          <h1 className="text-4xl font-extrabold text-gray-900">
            {introContent[0]?.paragraph || 'Terms & Conditions'}
          </h1>
          <p className="text-gray-600 text-lg mt-4 max-w-3xl mx-auto">
            {introContent[2]?.paragraph || 'Please read our terms carefully.'}
          </p>
        </div>
      </div>
      <div className="w-full px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex w-full items-center justify-center text-gray-600 mb-8">
            <Clock className="w-5 h-5 mr-2" />
            <span>{effectiveDate || introContent[1]?.paragraph || 'Terms & Conditions'}</span>
          </div>
          <TermsContent sections={sections} />
        </div>
      </div>
    </div>
  );
};

const AllTermsView = ({ terms, activeTab, handleTabClick, effectiveDates }) => {
  const { introContent, sections } = organizeTermsIntoSections(terms);
  
  return (
    <div className="py-10 px-6 max-w-5xl mx-auto">
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-3xl font-bold text-center">Terms and Conditions</h2>
        <p className="text-gray-600 text-lg mt-4 max-w-3xl mx-auto text-center">
          Welcome to Headstaart! These Terms & Conditions outline the rights,
          responsibilities, and guidelines for users of the Headstaart
          platform. By signing up and using our services, you agree to comply with
          these T&Cs.
        </p>
      </div>
      <div className="flex flex-wrap mt-8 justify-center mb-8 gap-2">
        {Object.keys(policyRoles).map((role) => (
          <button
            key={role}
            onClick={() => handleTabClick(role)}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === role
                ? 'bg-[#4A3AFF] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
         
          </button>
        ))}
      </div>
      
      {effectiveDates[activeTab] && (
        <div className="flex items-center justify-center text-gray-600 mb-8">
          <Clock className="w-5 h-5 mr-2" />
          <span>{effectiveDates[activeTab]}</span>
        </div>
      )}
      
      <TermsContent sections={sections} />
    </div>
  );
};

const TermsContent = ({ sections }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:shadow-xl p-6">
    {sections.map((section, index) => (
      <div key={index} className="mb-8 last:mb-0">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          {section.heading}
        </h3>
        <div className="space-y-4">
          {section.paragraphs.map((paragraph, paraIndex) => (
            <p key={paraIndex} className="text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default TermsAndConditions;