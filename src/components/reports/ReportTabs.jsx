import React, { useState } from 'react';

const ReportTabs = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState('tramites');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  return (
    <div className="report-tabs">
      <button 
        className={activeTab === 'tramites' ? 'active' : ''}
        onClick={() => handleTabClick('tramites')}
      >
        Trámites
      </button>
      <button 
        className={activeTab === 'financiero' ? 'active' : ''}
        onClick={() => handleTabClick('financiero')}
      >
        Financiero
      </button>
      <button 
        className={activeTab === 'comparativo' ? 'active' : ''}
        onClick={() => handleTabClick('comparativo')}
      >
        Comparativo
      </button>
    </div>
  );
};

export default ReportTabs;
