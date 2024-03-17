'use client'
import React, { useState } from 'react';

const ChatScreen = () => {
  const [sections, setSections] = useState([
    { id: 1, title: "All", client: "User", messages: [] },
    { id: 2, title: "Coaches", client: "Coach", messages: [] },
    { id: 3, title: "Players", client: "Player", messages: [] },
    { id: 4, title: "Groups", client: "Group", messages: [] }
  ]);

  const [currentSection, setCurrentSection] = useState(1);
  const [messageInput, setMessageInput] = useState('');

  const handleMessageSend = () => {
    if (messageInput.trim() !== '') {
      const updatedSections = sections.map(section => {
        if (section.id === currentSection) {
          return {
            ...section,
            messages: [
              ...section.messages,
              { text: messageInput, timestamp: new Date().toLocaleTimeString(), sender: section.client }
            ]
          };
        }
        return section;
      });
      setSections(updatedSections);
      setMessageInput('');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevents adding new line
      handleMessageSend();
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-900 text-white">
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-semibold">Sections</span>
          </div>
          {sections.map(section => (
            <div
              key={section.id}
              className={`bg-gray-800 rounded-md p-3 mb-3 cursor-pointer hover:bg-gray-700 ${currentSection === section.id ? 'bg-gray-700' : ''}`}
              onClick={() => setCurrentSection(section.id)}
            >
              {section.title}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1">
        <div className="p-4 bg-gray-100">
          <div className="flex items-center mb-4">
            <span className="text-lg font-semibold mr-2">{sections.find(section => section.id === currentSection)?.title} Chat</span>
          </div>
          <div className="border border-gray-200 rounded p-4">
            {sections.find(section => section.id === currentSection)?.messages.map((message, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex justify-center items-center mr-2">
                    {message.sender.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{message.sender}</div>
                    <div className="text-gray-600 text-xs">{message.timestamp}</div>
                  </div>
                </div>
                <div>{message.text}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex">
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="w-full p-2 border border-gray-300 rounded"
              rows="3"
            />
            <button onClick={handleMessageSend} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
