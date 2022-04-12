import React from "react";
const TabNavItem = ({ id, title, activeTab, setActiveTab }) => {
  const handleClick = () => {
    setActiveTab(id);
  };

  return (
    <li
      onClick={handleClick}
      className={`tab-list-item ${activeTab === id ? "tab-list-active" : ""}`}
    >
      {title}
    </li>
  );
};
export default TabNavItem;
