import { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Mic, Languages, Bot, User, Sparkles } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function ChatbotPage() {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Namaste! I am your AI farming assistant. How can I help you today?',
      time: '10:30 AM',
    },
    {
      type: 'user',
      text: 'When should I fertilize my wheat?',
      time: '10:31 AM',
    },
    {
      type: 'bot',
      text: 'Based on your soil analysis, I recommend fertilizing your wheat crop in the next 2-3 days. Your soil nitrogen level is at 72%, which is good, but phosphorus is at 58% and could benefit from supplementation. Apply a balanced NPK fertilizer early morning for best results.',
      time: '10:31 AM',
    },
  ]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('en');
  const [isListening, setIsListening] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages([...messages, {
      type: 'user',
      text: input,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'bot',
        text: 'I understand your question. Let me check the latest data and provide you with the best recommendation...',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, 1000);
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Bot className="w-7 h-7 text-blue-600" />
              </motion.div>
              <div>
                <h1 className="text-white mb-1">AI Farming Assistant</h1>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-blue-100 text-sm">Online & Ready to Help</span>
                </div>
              </div>
            </div>

            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-40 bg-white/20 border-white/30 text-white">
                <Languages className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                <SelectItem value="pa">ਪੰਜਾਬੀ (Punjabi)</SelectItem>
                <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 240px)' }}>
              {/* Messages */}
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
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
                          <p className="text-sm">{message.text}</p>
                          <p className={`text-xs mt-2 ${
                            message.type === 'bot' ? 'text-gray-500' : 'text-green-100'
                          }`}>
                            {message.time}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {isListening && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-gray-100 rounded-2xl p-4 border border-gray-200">
                        <div className="flex gap-2">
                          <motion.div
                            className="w-2 h-2 bg-blue-500 rounded-full"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-blue-500 rounded-full"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-blue-500 rounded-full"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t bg-gray-50">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your question here..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      className="flex-1 bg-white border-gray-200 rounded-full"
                    />
                    <Button
                      size="icon"
                      className={`rounded-full ${
                        isListening 
                          ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                      onClick={() => setIsListening(!isListening)}
                    >
                      <Mic className="w-5 h-5" />
                    </Button>
                    <Button
                      size="icon"
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-full"
                      onClick={handleSend}
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>

                  {isListening && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 text-center"
                    >
                      <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
                        <motion.div
                          className="w-8 h-8 border-2 border-blue-600 rounded-full"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [1, 0.5, 1],
                          }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        Listening... Speak now
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Farmer Avatar */}
            <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-amber-50 to-orange-50">
              <div className="text-center">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                  className="relative inline-block mb-4"
                >
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1659021245220-8cf62b36fe25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtZXIlMjB3b3JraW5nJTIwZmllbGR8ZW58MXx8fHwxNzYxMTE4OTM5fDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Farmer with tablet"
                    className="w-32 h-32 rounded-2xl object-cover shadow-lg mx-auto"
                  />
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                </motion.div>
                <h3 className="text-green-900 mb-2">AI-Powered Support</h3>
                <p className="text-sm text-green-700/80">
                  Get instant answers to all your farming questions in your preferred language
                </p>
              </div>
            </Card>

            {/* Suggested Questions */}
            <Card className="p-6 border-none shadow-lg">
              <h3 className="text-green-900 mb-4">Quick Questions</h3>
              <div className="space-y-2">
                {suggestedQuestions.map((question, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setInput(question)}
                    className="w-full text-left p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 transition-all text-sm text-green-800"
                  >
                    {question}
                  </motion.button>
                ))}
              </div>
            </Card>

            {/* Features */}
            <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
              <h3 className="text-white mb-4">Assistant Features</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Languages className="w-5 h-5" />
                  </div>
                  <span className="text-sm text-blue-50">Multi-language support</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Mic className="w-5 h-5" />
                  </div>
                  <span className="text-sm text-blue-50">Voice commands</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-sm text-blue-50">AI-powered insights</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
