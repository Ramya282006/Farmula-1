import { useState, useEffect, useRef, JSX } from 'react';
import { Send, Mic, Languages, Bot, User, Sparkles, Upload, FileText, CheckCircle, AlertCircle, Database } from 'lucide-react';

type Message = {
  type: 'bot' | 'user';
  text: string;
  time: string;
  sources?: { source: string }[];
};

type KBStats = {
  has_data: boolean;
  total_pdfs: number;
  total_chunks: number;
  processed_pdfs: string[];
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('en');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [kbStats, setKbStats] = useState<KBStats | null>(null);
  type UploadStatus = { type: 'success' | 'error' | 'loading'; message: string };
  const [uploadStatus, setUploadStatus] = useState<UploadStatus | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_BASE = 'http://localhost:8000';

  // Format bot message to handle markdown-style formatting
  const formatBotMessage = (text: string, messageType: 'bot' | 'user') => {
    if (messageType === 'user') {
      return <span>{text}</span>;
    }

    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    
    lines.forEach((line, index) => {
      // Handle numbered lists (e.g., "1. **Title**:")
      const numberedListMatch = line.match(/^(\d+)\.\s\*\*(.+?)\*\*:\s*(.*)$/);
      if (numberedListMatch) {
        elements.push(
          <div key={index} className="mb-3">
            <div className="flex gap-2">
              <span className="font-bold text-blue-600">{numberedListMatch[1]}.</span>
              <div>
                <span className="font-bold text-gray-900">{numberedListMatch[2]}:</span>
                <span className="text-gray-700"> {numberedListMatch[3]}</span>
              </div>
            </div>
          </div>
        );
        return;
      }

      // Handle bold text with colons (e.g., "**Summary**:")
      const boldColonMatch = line.match(/^\*\*(.+?)\*\*:\s*(.*)$/);
      if (boldColonMatch) {
        elements.push(
          <div key={index} className="mb-2">
            <span className="font-bold text-gray-900">{boldColonMatch[1]}:</span>
            <span className="text-gray-700"> {boldColonMatch[2]}</span>
          </div>
        );
        return;
      }

      // Handle lines starting with "- " (bullet points)
      if (line.trim().startsWith('- ')) {
        elements.push(
          <div key={index} className="flex gap-2 mb-1 ml-4">
            <span className="text-blue-600">•</span>
            <span className="text-gray-700">{line.trim().substring(2)}</span>
          </div>
        );
        return;
      }

      // Handle empty lines
      if (line.trim() === '') {
        elements.push(<div key={index} className="h-2" />);
        return;
      }

      // Regular text
      elements.push(
        <div key={index} className="mb-1 text-gray-700">
          {line}
        </div>
      );
    });

    return <div className="space-y-1">{elements}</div>;
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch knowledge base status on component mount
  useEffect(() => {
    fetchKBStatus();
  }, []);

  const fetchKBStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/chatbot/status`);
      const data = await response.json();
      setKbStats(data);
      
      // Add initial message based on KB status
      if (data.has_data) {
        setMessages([{
          type: 'bot',
          text: `Namaste! I am your AI farming assistant with knowledge from ${data.total_pdfs} document(s). How can I help you today?`,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        }]);
      } else {
        setMessages([{
          type: 'bot',
          text: 'Namaste! I am your AI farming assistant. Please upload PDF documents to build my knowledge base, then I can provide expert farming guidance!',
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        }]);
      }
    } catch (error) {
      console.error('Error fetching KB status:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadStatus({ type: 'loading', message: 'Processing PDFs...' });

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const response = await fetch(`${API_BASE}/api/chatbot/upload-pdfs`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        setUploadStatus({ type: 'success', message: data.message });
        
        // Add bot message about upload
        setMessages(prev => [...prev, {
          type: 'bot',
          text: `✅ ${data.message}. I'm now ready to answer questions based on this knowledge!`,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        }]);
        
        // Refresh KB stats
        fetchKBStatus();
        
        // Clear upload status after 3 seconds
        setTimeout(() => setUploadStatus(null), 3000);
      } else {
        setUploadStatus({ type: 'error', message: data.detail || 'Upload failed' });
      }
    } catch (error) {
      setUploadStatus({ type: 'error', message: 'Error uploading files' });
      console.error('Upload error:', error);
    }

    // Clear file input
    event.target.value = '';
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = {
      type: 'user',
      text: input,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/chatbot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          language: language,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        const botMessage: Message = {
          type: 'bot',
          text: data.answer,
          sources: data.sources || [],
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        };
        
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(data.detail || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    'What is the best time to irrigate?',
    'How to prevent pest attacks?',
    'Current weather forecast',
    'Fertilizer recommendations',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-6 px-4 shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <Bot className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h1 className="text-white mb-1 text-xl font-bold">AI Farming Assistant</h1>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-blue-100 text-sm">Online & Ready to Help</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="te">తెలుగు (Telugu)</option>
              </select>

              {/* Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Upload PDFs</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Upload Status */}
          {uploadStatus && (
            <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
              uploadStatus.type === 'success' ? 'bg-green-500/20 border border-green-300' :
              uploadStatus.type === 'error' ? 'bg-red-500/20 border border-red-300' :
              'bg-blue-500/20 border border-blue-300'
            }`}>
              {uploadStatus.type === 'success' && <CheckCircle className="w-5 h-5 text-green-200" />}
              {uploadStatus.type === 'error' && <AlertCircle className="w-5 h-5 text-red-200" />}
              {uploadStatus.type === 'loading' && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              <span className="text-white text-sm">{uploadStatus.message}</span>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-2">
            <div className="border-none shadow-lg overflow-hidden rounded-xl bg-white" style={{ height: 'calc(100vh - 240px)' }}>
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === 'bot' 
                          ? 'bg-gradient-to-br from-blue-500 to-cyan-500' 
                          : 'bg-gradient-to-br from-green-500 to-emerald-500'
                      }`}>
                        {message.type === 'bot' ? (
                          <Bot className="w-5 h-5 text-white" />
                        ) : (
                          <User className="w-5 h-5 text-white" />
                        )}
                      </div>
                      
                      <div className={`flex-1 max-w-[80%] ${message.type === 'user' ? 'flex justify-end' : ''}`}>
                        <div className={`rounded-2xl p-4 ${
                          message.type === 'bot'
                            ? 'bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-200'
                            : 'bg-gradient-to-br from-green-600 to-green-700 text-white'
                        }`}>
                          <div className="text-sm">
                            {formatBotMessage(message.text, message.type)}
                          </div>
                          
                          <p className={`text-xs mt-2 ${
                            message.type === 'bot' ? 'text-gray-500' : 'text-green-100'
                          }`}>
                            {message.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-gray-100 rounded-2xl p-4 border border-gray-200">
                        <div className="flex gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t bg-gray-50">
                  <div className="flex gap-2">
                    <input
                      placeholder="Type your question here..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      disabled={isLoading}
                      className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleSend}
                      disabled={isLoading || !input.trim()}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-full p-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <Send className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Knowledge Base Status */}
            <div className="p-6 rounded-xl shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-purple-600" />
                <h3 className="text-purple-900 font-bold">Knowledge Base</h3>
              </div>
              {kbStats && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-700">Documents:</span>
                    <span className="font-semibold text-purple-900">{kbStats.total_pdfs}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-700">Knowledge Chunks:</span>
                    <span className="font-semibold text-purple-900">{kbStats.total_chunks}</span>
                  </div>
                  {kbStats.processed_pdfs && kbStats.processed_pdfs.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-purple-200">
                      <p className="text-xs text-purple-700 mb-2">Loaded PDFs:</p>
                      <div className="space-y-1">
                        {kbStats.processed_pdfs.map((pdf, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-purple-600">
                            <FileText className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span className="truncate">{pdf}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Suggested Questions */}
            <div className="p-6 rounded-xl shadow-lg bg-white">
              <h3 className="text-green-900 mb-4 font-bold">Quick Questions</h3>
              <div className="space-y-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(question)}
                    className="w-full text-left p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 transition-all text-sm text-green-800"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="p-6 rounded-xl shadow-lg bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
              <h3 className="text-white mb-4 font-bold">Assistant Features</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Languages className="w-5 h-5" />
                  </div>
                  <span className="text-sm text-blue-50">Multi-language support</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-sm text-blue-50">PDF knowledge base</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-sm text-blue-50">AI-powered insights</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}