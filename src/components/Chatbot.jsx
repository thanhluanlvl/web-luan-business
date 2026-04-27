import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([
    { id: 1, text: "Chào bạn! Tôi là trợ lý AI của Nguyễn Thành Luân. Tôi có thể giúp gì cho bạn hôm nay?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Tự động phát hiện: localhost hay Vercel
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const proxyUrl = isLocal ? 'http://localhost:3001/api/chat' : '/api/chat'; 
      
      const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage.text,
          chatInput: userMessage.text, 
          text: userMessage.text,
          query: userMessage.text,
          sessionId: "user-session-123" 
        })
      });
      
      const data = await response.json();
      let botText = "Xin lỗi, hiện tại AI không thể xử lý yêu cầu.";
      
      // Nếu có lỗi từ n8n (VD: 404 workflow chưa active, hoặc server sập)
      if (data.error) {
        botText = `LỖI CHÍNH XÁC: ${data.message}`;
      } else {
        // Hỗ trợ đọc dữ liệu trả về
        botText = data.output || data.reply || data.response || data.text || data.message || (Array.isArray(data) ? data[0]?.output || JSON.stringify(data) : JSON.stringify(data));
      }

      const botMessage = { 
        id: Date.now() + 1, 
        text: botText, 
        sender: 'bot' 
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

    } catch (error) {
      console.error("Lỗi kết nối AI:", error);
      
      const errorMessage = { 
        id: Date.now() + 1, 
        text: `Lỗi kết nối: ${error.message}. (Gợi ý: Kiểm tra lại CORS trong Webhook n8n hoặc đảm bảo Workflow đang ở trạng thái Active)`, 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  return (
    <div className="chatbot-container">
      {/* Nút bong bóng chat */}
      <button 
        className={`chatbot-toggle ${isOpen ? 'hidden' : ''}`} 
        onClick={() => setIsOpen(true)}
      >
        <MessageSquare size={26} />
      </button>

      {/* Cửa sổ chat */}
      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-title">
            <Bot size={22} className="tech-icon" />
            <span>Trợ lý AI - Web Luân</span>
          </div>
          <button className="chatbot-close" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="chatbot-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`chat-bubble-wrapper ${msg.sender}`}>
              <div className="chat-avatar">
                {msg.sender === 'bot' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div className={`chat-bubble ${msg.sender}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="chat-bubble-wrapper bot">
              <div className="chat-avatar"><Bot size={16} /></div>
              <div className="chat-bubble bot typing">
                <span>.</span><span>.</span><span>.</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chatbot-input-area" onSubmit={handleSend}>
          <input 
            type="text" 
            placeholder="Nhập tin nhắn..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" disabled={!input.trim()}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
