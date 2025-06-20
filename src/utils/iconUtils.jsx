import React from "react";

export const renderIcon = (iconName) => {
  const icons = {
    home: "🏠",
    plus: "➕",
    report: "📊",
    stock: "📦",
    product: "📋",
    users: "👥",
    userPlus: "👤",
    settings: "⚙️",
    logout: "🚪",
    menu: "☰",
    close: "✕",
    chevronRight: "▶",
    chevronDown: "▼",
    alertCircle: "⚠️",
    refreshCw: "🔄",
    eye: "👁️",
    eyeOff: "🙈",
    calendar: "📅",
    calendarMonth: "🗓️",
    edit: "✏️",
    creditCard: "💳",
    book: "📚",
    bookOpen: "📖",
    scale: "⚖️",
    fileText: "📄",
    trendingUp: "📈",
    list: "📋",
  };
  return <span className="nav-icon">{icons[iconName] || "•"}</span>;
};