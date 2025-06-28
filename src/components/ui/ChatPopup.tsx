"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid'; // Import uuid

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatPopup: React.FC<ChatPopupProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null); // State for sessionId
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    // Generate a sessionId when the chat popup is first opened and none exists
    if (isOpen && !sessionId) {
      setSessionId(uuidv4());
    }
    // If popup is closed, we could consider resetting sessionId or keeping it for persistence across closes/reopens.
    // For now, it persists until component unmounts or is explicitly reset.
  }, [isOpen, sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Simulate initial bot message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'initial-bot-message',
          text: "Hello! I'm your AI Consulting Agent. How can I help you today?",
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    const currentInputValue = inputValue;
    setInputValue('');

    // Add a temporary typing indicator message
    const typingMessageId = `bot-typing-${Date.now()}`;
    const typingMessage: Message = {
      id: typingMessageId,
      text: 'Bot is typing...',
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, typingMessage]);

    try {
      const response = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentInputValue, history: messages, sessionId: sessionId }), // Send sessionId
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();

      const botResponse: Message = {
        id: `bot-${Date.now()}`,
        text: data.reply || "Sorry, I couldn't get a response.",
        sender: 'bot',
        timestamp: new Date(),
      };
      // Replace typing indicator with actual response
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === typingMessageId ? botResponse : msg))
      );

    } catch (error) {
      console.error("Failed to send message:", error);
      const errorResponse: Message = {
        id: `error-${Date.now()}`, // Keep a new ID for the error message itself
        text: "Sorry, something went wrong. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
      };
      // Replace typing indicator with error message
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === typingMessageId ? errorResponse : msg))
      );
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "circOut" }}
          className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 w-[calc(100%-2rem)] max-w-md h-[70vh] max-h-[600px] bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-700 bg-neutral-800">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-orange-500" />
              <h3 className="text-lg font-semibold text-slate-100">AI Consulting Agent</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-slate-100">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages Area */}
          <div className="flex-grow p-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-800">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    msg.sender === 'user'
                      ? 'bg-orange-600 text-white rounded-br-none'
                      : msg.text === 'Bot is typing...'
                      ? 'bg-neutral-700 text-slate-400 italic rounded-bl-none animate-pulse' // Style for typing indicator
                      : 'bg-neutral-700 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.text !== 'Bot is typing...' && ( // Don't show timestamp for typing indicator
                    <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-orange-200' : 'text-neutral-400'} text-right`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-neutral-700 bg-neutral-800">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-grow bg-neutral-700 border-neutral-600 text-slate-100 placeholder-neutral-400 focus:ring-orange-500 focus:border-orange-500"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-orange-500 hover:bg-orange-600 text-white"
                size="icon"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            {/* Basic options can be added here later */}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatPopup;
