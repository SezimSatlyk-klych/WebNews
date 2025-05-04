import React, { useEffect, useState, useRef } from 'react';
import { Form, Button, Spinner, Toast } from 'react-bootstrap';
import { Send, Robot, Paperclip, Mic, X, ArrowRepeat, Download, EmojiSmile } from 'react-bootstrap-icons';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ChatSupport = () => {
  const [menu, setMenu] = useState("");
  const [search, setSearch] = useState("");
  const searchRef = useRef(null);
  
  
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const messagesEndRef = useRef(null);
  const userEmail = localStorage.getItem('userEmail') || localStorage.getItem('email');
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadChatHistory();
  }, [userEmail]);

  const showNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const loadChatHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await axios.get('https://serverless-ai-beige.vercel.app/api/chat', {
        params: { email: userEmail },
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (res.data.messages && Array.isArray(res.data.messages)) {
        setMessages(res.data.messages.map(msg => ({
          role: msg.role,
          text: msg.text,
          timestamp: msg.timestamp || new Date().toISOString()
        })));
        if (res.data.messages.length > 0) {
          showNotification('Chat history loaded successfully');
        }
      } else {

        setMessages([{
          role: 'ai',
          text: 'Welcome! How can I assist you today?',
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      showNotification('Failed to load chat history');

      setMessages([{
        role: 'ai',
        text: 'Welcome! How can I assist you today?',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoadingHistory(false);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendPrompt(e);
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'ai',
      text: 'Chat cleared. How can I help you today?',
      timestamp: new Date().toISOString()
    }]);
    showNotification('Chat history cleared');
  };

  const sendPrompt = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;
    
    const currentTime = new Date().toISOString();
    const userMsg = { role: 'user', text: prompt, timestamp: currentTime };
    setMessages((prev) => [...prev, userMsg]);
    setPrompt('');
    setLoading(true);
  
    try {
      const res = await fetch('https://serverless-ai-beige.vercel.app/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: userEmail,
          prompt: prompt 
        }),
      });
      
      if (!res.ok) throw new Error('Network response was not ok');
      
      const data = await res.json();
      const aiMsg = { role: 'ai', text: data.answer, timestamp: new Date().toISOString() };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error('Error:', error);
      const errorMsg = { 
        role: 'ai', 
        text: 'Sorry, there was an error processing your request. Please try again later.', 
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages((prev) => [...prev, errorMsg]);
      showNotification('Failed to get response from AI');
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const downloadChatHistory = () => {
    const chatText = messages.map(m => `[${formatTimestamp(m.timestamp)}] ${m.role === 'user' ? 'You' : 'AI'}: ${m.text}`).join('\n\n');
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-history-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('Chat history downloaded');
  };

  return (
    <div className="d-flex flex-column vh-100">
      <Navbar setMenu={setMenu} setSearch={setSearch} searchRef={searchRef} hideCategories={true}  />
      
      <div className="flex-grow-1 d-flex flex-column" style={{ overflow: 'hidden' }}>

        <div className="bg-white border-bottom p-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 d-flex align-items-center">
            <Robot size={24} className="me-2 text-primary" />
            <span>AI Assistant</span>
            <div className="badge bg-success ms-2" style={{fontSize: '0.6rem'}}>Online</div>
          </h5>
          <div className="d-flex">
            <Button variant="outline-secondary" size="sm" className="me-2" onClick={loadChatHistory} title="Reload chat history">
              <ArrowRepeat size={16} />
            </Button>
            <Button variant="outline-secondary" size="sm" className="me-2" onClick={downloadChatHistory} title="Download chat history">
              <Download size={16} />
            </Button>
            <Button variant="outline-danger" size="sm" onClick={clearChat} title="Clear chat">
              <X size={16} />
            </Button>
          </div>
        </div>
        <Link to="/">
                    <button className="btn btn-outline-dark rounded-pill px-4 py-1">
                        Go to Main Page
                    </button>
                </Link>

        <div style={{ position: 'fixed', top: '80px', right: '20px', zIndex: 1050 }}>
          <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
            <Toast.Header closeButton={false}>
              <strong className="me-auto">Notification</strong>
            </Toast.Header>
            <Toast.Body>{toastMessage}</Toast.Body>
          </Toast>
        </div>

        <div 
          className="flex-grow-1 p-3 overflow-auto"
          style={{
            background: 'linear-gradient(to bottom, #f8f9fa, #edf2f7)',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-6 60c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM40 40c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4zm18 27c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4zm-13-44c0-1.66-1.34-3-3-3s-3 1.34-3 3 1.34 3 3 3 3-1.34 3-3z\' fill=\'%239C92AC\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
          }}
        >
          {isLoadingHistory ? (
            <div className="text-center d-flex flex-column justify-content-center align-items-center h-100">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading your conversation history...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-muted d-flex flex-column align-items-center justify-content-center h-100">
              <Robot size={58} className="mb-3 text-primary" />
              <h4>Welcome to AI Chat Support</h4>
              <p className="text-muted">How can I help you today?</p>
              <div className="mt-3">
                <Button variant="outline-primary" size="sm" className="mx-1" onClick={() => setPrompt("Tell me about your features")}>
                  What can you do?
                </Button>
                <Button variant="outline-primary" size="sm" className="mx-1" onClick={() => setPrompt("How do I get started?")}>
                  Help me get started
                </Button>
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={`d-flex mb-3 ${m.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
              >
                <div
                  className={`d-flex align-items-start ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                  style={{maxWidth: '80%'}}
                >
                  <div 
                    className={`d-flex align-items-center justify-content-center rounded-circle ${
                      m.role === 'user' 
                        ? 'bg-primary text-white' 
                        : m.isError 
                          ? 'bg-danger text-white' 
                          : 'bg-white border border-primary text-primary'
                    }`} 
                    style={{width: '40px', height: '40px', flexShrink: 0}}
                  >
                    {m.role === 'user' ? (
                      <div style={{fontSize: '18px'}}>You</div>
                    ) : (
                      <Robot size={20} />
                    )}
                  </div>
                  <div 
                    className={`px-3 py-2 mx-2 rounded-lg shadow-sm ${
                      m.role === 'user' 
                        ? 'bg-primary text-white' 
                        : m.isError 
                          ? 'bg-danger bg-opacity-10 border-danger text-danger' 
                          : 'bg-white border'
                    }`}
                    style={{wordBreak: 'break-word'}}
                  >
                    <div style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
                    <div className="text-end mt-1">
                      <small className={`opacity-75 ${m.role === 'user' ? 'text-white-50' : 'text-muted'}`}>
                        {formatTimestamp(m.timestamp)}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="d-flex justify-content-start">
              <div className="d-flex align-items-start" style={{maxWidth: '80%'}}>
                <div className="d-flex align-items-center justify-content-center rounded-circle bg-white border border-primary text-primary" style={{width: '40px', height: '40px', flexShrink: 0}}>
                  <Robot size={20} />
                </div>
                <div className="px-3 py-3 mx-2 bg-white border rounded-lg shadow-sm">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-3 border-top bg-white">
          <Form onSubmit={sendPrompt}>
            <div className="d-flex align-items-end">
              <div className="flex-grow-1 me-2 position-relative">
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message here..."
                  className="rounded-4 pr-5"
                  style={{
                    resize: 'none', 
                    padding: '12px 20px', 
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    paddingRight: '40px'
                  }}
                />
                <div className="position-absolute bottom-0 end-0 mb-2 me-2">
                  <Button variant="link" size="sm" className="text-muted p-1">
                    <EmojiSmile size={18} />
                  </Button>
                </div>
                <div className="d-flex justify-content-start mt-1">
                  <Button variant="link" size="sm" className="text-muted">
                    <Paperclip size={18} />
                  </Button>
                  <Button variant="link" size="sm" className="text-muted">
                    <Mic size={18} />
                  </Button>
                </div>
              </div>
              <Button 
                variant="primary" 
                type="submit" 
                disabled={loading || !prompt.trim()}
                className="rounded-circle p-2 d-flex align-items-center justify-content-center shadow" 
                style={{width: '50px', height: '50px'}}
              >
                <Send size={20} />
              </Button>
            </div>
          </Form>
        </div>
      </div>
      
      <style jsx>{`
        .typing-indicator {
          display: inline-flex;
          align-items: center;
        }
          
        
        .typing-indicator span {
          height: 8px;
          width: 8px;
          margin: 0 2px;
          background-color: #3498db;
          border-radius: 50%;
          display: inline-block;
          animation: typing 1.4s infinite ease-in-out both;
        }
        
        .typing-indicator span:nth-child(1) {
          animation-delay: 0s;
        }
        
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes typing {
          0% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.4);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0.7;
          }
        }
        
        .rounded-lg {
          border-radius: 18px;
        }
      `}</style>
    </div>
  );
};

export default ChatSupport;