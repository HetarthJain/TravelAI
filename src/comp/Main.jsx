import React, { useState, useRef, useEffect, Children } from "react";
import Sidebar from "../comp/Sidebar";
import "../styles/chatbot.css";
import { mockUser, mockConversations as initialMockConversations } from "../data/mockData";
import Profile from "./Profile";
import BotMessage from "./BotMessage";
import { Client } from "@langchain/langgraph-sdk";
import axios from "axios";


// Generate a unique ID for each conversation
const generateId = () => {
  return Date.now().toString();
};

const Main = () => {

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState([
    { type: "system", content: "Hello! I'm TravelBuddy, your AI travel assistant. How can I help you plan your next business trip?" },
  ]);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [files, setFiles] = useState([]);
  const messagesEndRef = useRef(null);
  const client = new Client();
  const config = { "configurable": { "user_id": mockUser.user_id } }


  useEffect(() => {
    async function threadInit() {
      const thread = await client.threads.create();
      setCurrentConversationId(thread.thread_id)
      console.log(thread.thread_id)
    }

    async function initAllConv() {
      const allNewConv = []
      for (const conv of initialMockConversations) {
        const new_thread = await client.threads.create();
        const newconv = { ...conv, "thread_id": new_thread.thread_id };
        allNewConv.push(newconv);
      };
      console.log(allNewConv);
      setConversations(allNewConv);
    };

    initAllConv();
    threadInit();
  }, []);

  async function handleSimulation() {
    // create a new thread
    const thread_alert = await client.threads.create();
    const run_alert = await client.runs.create(thread_alert['thread_id'], "alert_graph", { input: { "messages": "dummy" }, config: config, multitask_strategy: "interrupt" })

    // Start the alert run but don't await it immediately.
    // Instead, use a then() to handle the response when it comes.
    await client.runs.join(thread_alert.thread_id, run_alert.run_id)
      .then(async (alertResponse) => {
        console.log("alert resp", alertResponse)
        // Append the alert_graph response as a system message in the current conversation
        const messagel = [{ role: "human", content: "dummy" }];
        // const thread_ = await client.threads.create();
        const continue_currconv_async = await client.runs.create(
          currentConversationId,
          "chatbot",
          {
            input: { messages: messagel },
            config: config,
            multitask_strategy: "interrupt"
          }
        ); 
        let promise = await client.runs.join(currentConversationId, continue_currconv_async.run_id);

        console.log(promise['output'])
        setMessages((prev) => [
          ...prev,
          { type: "system", content: promise['output'] || "No response from alert_graph" }
        ]);
        // setMessages((prev) => [
        //   ...prev,
        //   { type: "system", content: alertResponse?.output || "No response from alert_graph" }
        // ]);
      })
      .catch((error) => {
        console.error("Error joining alert_graph run:", error);
        setMessages((prev) => [
          ...prev,
          { type: "system", content: "Error processing simulation." }
        ]);
      });
    // const messagel = [{ role: "human", content: "dummy" }];

    // const continue_currconv_async = await client.runs.create(currentConversationId, "chatbot", input = { 'messages': messagel }, config = config, multitask_strategy = "interrupt")
    // const continue_currconv_async = await client.runs.create(
    //   currentConversationId,
    //   "chatbot",
    //   {
    //     input: { messages: messagel },
    //     config: config,
    //     multitask_strategy: "interrupt"
    //   }
    // );    let promise = await client.runs.join(currentConversationId, continue_currconv_async.run_id);

    // console.log(promise['output'])
    // setMessages((prev) => [
    //   ...prev,
    //   { type: "system", content: promise['output'] || "No response from alert_graph" }
    // ]);
    // return promise['output']

  }

  async function lg(user_prompt, config, thread_id) {
    // employee id
    // const config = { "configurable": { "user_id": "1001" } }

    // const client = new Client();
    console.log("client", client)
    // Start a new thread for a new conversation
    // const thread = await client.threads.create();
    console.log(thread_id)

    // Start a streaming run
    const messages = [{ role: "human", content: user_prompt }];
    const input = { 'messages': messages, 'prompt': user_prompt };

    // const streamResponse = await client.runs.create(
    //   thread["thread_id"], "chatbot", { input, config }
    // );
    const streamResponse = await client.runs.create(
      thread_id, "chatbot", { input, config }
    );
    let promise = await client.runs.join(thread_id, streamResponse.run_id);
    // let promise = await client.runs.join(thread.thread_id, streamResponse.run_id);

    console.log(promise['output'])
    return promise['output']
  }

  // Get the first few words to use as a title
  const generateTitle = (messages) => {
    if (messages.length <= 1) return "New Chat";

    // Find the first user message
    const firstUserMessage = messages.find(msg => msg.type === "user");
    if (!firstUserMessage) return "New Chat";

    // Take first few words of the first user message
    const words = firstUserMessage.content.split(' ');
    const title = words.slice(0, 3).join(' ');
    return title.length > 20 ? title.substring(0, 20) + '...' : title;
  };


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = { type: "user", content: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setIsWaiting(true);
    setInputValue(""); // Clear input immediately

    try {
      const botResponse = await lg(inputValue, config, currentConversationId); // Wait for response
      var botMessage = { type: "system", content: botResponse || "No response from AI" };

      setMessages((prev) => [...prev, botMessage]); // Append bot response after user input
    } catch (error) {
      console.error("Error in AI response:", error);
      setMessages((prev) => [...prev, { type: "system", content: "Error processing request." }]);
    } finally {

      if (currentConversationId) {
        setConversations(prev => {
          const updatedConversations = prev.map(convo => {
            if (convo.thread_id === currentConversationId) {
              return {
                ...convo,
                messages: [...convo.messages, userMessage, botMessage]
              };
            }
            return convo;
          });

          // Move the updated conversation to the top
          const movedConversation = updatedConversations.find(convo => convo.id === currentConversationId);
          const remainingConversations = updatedConversations.filter(convo => convo.id !== currentConversationId);

          return movedConversation ? [movedConversation, ...remainingConversations] : updatedConversations;
        });
      }
      setIsWaiting(false); // Ensure loading state resets
      // setInputValue(""); // Clear input immediately

    }
  };


  const handleNewChat = async () => {

    setShowProfile(false)
    // Save current chat if it has more than just the welcome message
    if (messages.length > 1 && currentConversationId !== null) {
      const newId = generateId();
      const newTitle = generateTitle(messages);
      const today = new Date();
      const dateString = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      const newConversation = {
        id: newId,
        title: newTitle,
        date: dateString,
        messages: [...messages]
      };

      setConversations(prev => [newConversation, ...prev]);
    }

    // Start a new thread for a new conversation
    const thread = await client.threads.create();
    // Start new conversation
    const newId = thread.thread_id;
    setCurrentConversationId(newId);

    setMessages([{ type: "system", content: "Hello! I'm TravelBuddy. How can I help you?" }]);
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const loadConversation = (id) => {

    // Use the current conversations state
    let updatedConvos = [...conversations];

    // Save current conversation:
    // If a conversation for the currentConversationId exists, update its messages.
    // Otherwise, create a new conversation with the current messages.
    const currentIndex = updatedConvos.findIndex(
      (convo) => convo.thread_id === currentConversationId
    );
    const num_of_conv = updatedConvos.length
    if (currentIndex !== -1) {
      updatedConvos[currentIndex] = {
        ...updatedConvos[currentIndex],
        messages: messages
      };
    } else {
      updatedConvos.push({
        thread_id: currentConversationId,
        messages: messages,
        id: num_of_conv + 1,
        title: generateTitle(messages),
        date: new Date().toLocaleDateString()
      });
    }
    setConversations(updatedConvos)

    const conversation = conversations.find(convo => convo.thread_id === id);
    if (conversation) {
      setMessages(conversation.messages || []);
      setCurrentConversationId(id);

      // If profile is showing, hide it and show chat
      if (showProfile) {
        setShowProfile(false);
      }
    }
  }


const handleSubmit = async (e) => {
  e.preventDefault();
  if (files.length === 0) return;

  // Create a FormData object and append each file
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("file", file); 
  });

  try {
    const response = await axios.post("http://localhost:9000/upload",formData);

    if (response.status === 200) {
      console.log("Files uploaded successfully");
      // Optionally, clear files or update UI here.
    } else {
      console.error("Upload failed");
    }
  } catch (error) {
    console.error("Error uploading files:", error);
  }
};
const handleFileChange = (e) => {
  setFiles(Array.from(e.target.files));
};

  return (
    <div className="travel-chatbot">
      <Sidebar isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        showProfile={showProfile}
        setShowProfile={setShowProfile}
        startNewChat={handleNewChat}
        conversations={conversations}
        onSelectConversation={loadConversation}
        currentConversationId={currentConversationId}
        handleSimulation={handleSimulation} />

      <div className="right-container">
        <div className="top-bar">
          <div className="top-buttons">
            {!sidebarOpen && <button onClick={toggleSidebar} className="sidebar-menu-toggle">☰</button>}
            <button onClick={handleNewChat} className="new-chat-button">+ New Chat</button>
            {/* <button onClick={handleFileUpload}></button> */}
          </div>
          <div>
          <form onSubmit={handleSubmit}>
            <input type="file" multiple onChange={handleFileChange} />
            <button type="submit">Upload Files</button>
          </form>
          </div>
          
        </div>
        {/* ContentArea */}
        {showProfile ? (
          <Profile setShowProfile={setShowProfile} />
        ) : (
          <div className={`main-content ${sidebarOpen ? "" : "expanded"}`}>
            <div className="chat-container">
              <div className="messages">
                {messages.map((message, index) => (
                  // <div key={index} className={`message ${message.type}`}>
                  //   <div className="message-content">{message.content}</div>
                  // </div>
                  <div key={index} className={`message ${message.type}`}>
                    {message.type === "system" ? (
                      <div className="message-content">
                        <BotMessage content={message.content} />
                      </div>
                    ) : (
                      <div className="message-content">{message.content}</div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="input-area">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                  placeholder="Message TravelBuddy..."
                  className="message-input"
                  disabled={isWaiting}
                />
                <button onClick={handleSendMessage} className="send-button" disabled={!inputValue.trim() && !isWaiting}>Send</button>
              </div>
            </div>
          </div>)}

      </div>
    </div>
  );
};

export default Main;
