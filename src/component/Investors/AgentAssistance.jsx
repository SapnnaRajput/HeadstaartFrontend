import React from 'react';
import { useNavigate } from 'react-router-dom';

const AgentAssistance = () => {
  const navigate = useNavigate();

  const handleAgentClick = () => {
    navigate('/investor/agent-with-project');
  };

  const handleInvestorClick = () => {
    navigate('/investor/agent-for-project');
  };

  return (
    <div className="p-6">
      <h1 className="text-[#1D214E] text-2xl font-semibold mb-4">Agent Assistance</h1>
      <div className="flex gap-4">
        <div 
          onClick={handleAgentClick}
          className="bg-[#B1E5FC] rounded-lg p-4 flex-1 cursor-pointer hover:shadow-md transition-shadow duration-300"
        >
          <span className="text-gray-700 font-medium">Contacted Agent (With Project)</span>
        </div>
        <div 
          onClick={handleInvestorClick}
          className="bg-[#FFD69D] rounded-lg p-4 flex-1 cursor-pointer hover:shadow-md transition-shadow duration-300"
        >
          <span className="text-gray-700 font-medium">Contacted Agent (For Project)</span>
        </div>
      </div>
    </div>
  );
};

export default AgentAssistance;