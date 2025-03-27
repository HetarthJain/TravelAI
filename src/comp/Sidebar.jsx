import React from "react";
import "../styles/chatbot.css"; // Assuming you have a CSS file for styles
import { mockUser } from "../data/mockData";

const Sidebar = ({ 
  isOpen, 
  toggleSidebar, 
  showProfile, 
  setShowProfile,
  startNewChat,
  conversations,
  onSelectConversation,
  currentConversationId,
  handleSimulation
}) => {
  if (!isOpen) {
    return <div className="sidebar closed"></div>;
  }

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <div className="logo">
          <span className="plane-icon">✈️</span>
          <h2>TravelBuddy</h2>
        </div>
        <button className="sidebar-toggle" onClick={toggleSidebar}>×</button>
      </div>
      
      <div className="conversation-header">
        <h3>Conversations</h3>
        <button className="new-chat" onClick={startNewChat}>+ New Chat</button>
      </div>
      
      <div className="conversation-list">
        {conversations.map(convo => (
          <div 
            key={convo.id} 
            className={`conversation-item ${convo.thread_id === currentConversationId ? 'active' : ''}`}
            onClick={() => onSelectConversation(convo.thread_id)}
          >
            <span className="message-icon">💬</span>
            <div className="conversation-details">
              <p className="conversation-title">{convo.title}</p>
              <p className="conversation-date">{convo.date}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="sidebar-footer">
        <div>
          <button onClick={handleSimulation}>cancellation simulation</button>
        </div>
        <div className="user-info" onClick={() => setShowProfile(!showProfile)}>
          <div className="avatar">
            <img src={mockUser.avatar} alt={mockUser.name} />
          </div>
          <div className="user-details">
            <p className="user-name">{mockUser.name}</p>
            <p className="user-role">{mockUser.role}</p>
          </div>
        </div>
        <div className="sidebar-actions">
          <button className="settings-button">⚙️</button>
          <button className="logout-button">Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;