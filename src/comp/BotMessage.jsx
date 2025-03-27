import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


const BotMessage = ({ content, streamingSpeed = 30 }) => {
  const [displayedContent, setDisplayedContent] = useState("");

  useEffect(() => {
    let currentIndex = 0;
    setDisplayedContent(""); // Reset displayed content when content changes

    const interval = setInterval(() => {
      setDisplayedContent((prev) => prev + content.charAt(currentIndex));
      currentIndex++;
      if (currentIndex >= content.length) {
        clearInterval(interval);
      }
    }, streamingSpeed);

    return () => clearInterval(interval);
  }, [content, streamingSpeed]);

  return (
    <div className="bot-message">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
};

export default BotMessage;

