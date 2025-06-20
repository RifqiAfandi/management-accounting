import React from "react";
import { renderIcon } from "../../utils/iconUtils.jsx";
import { statsData } from "../../constants/dashboardConstants.js";

const StatsGrid = () => {
  return (
    <div className="summary-cards">
      {statsData.map((stat, index) => (
        <div key={index} className="summary-card primary">
          <div className="card-icon">
            {renderIcon(stat.icon)}
          </div>
          <div className="card-content">
            <h3 className="card-title">{stat.title}</h3>
            <div className="card-value">{stat.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;