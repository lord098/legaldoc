import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Bot, User, FileText } from "lucide-react";
import Sidebar from "@/components/Sidebar";

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I've analyzed your legal document. I can help explain complex terms, summarize sections, or answer specific questions about the content. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        type: 'ai',
        content: getAIResponse(inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (userInput: string): string => {
    const responses = [
      "Based on the document analysis, this clause means that you have the right to terminate the agreement with 30 days notice. This is a standard provision that protects your interests.",
      "The legal term you're asking about refers to 'consideration' - essentially, it's what each party gives up or promises to do in exchange for something from the other party. It's a fundamental requirement for a valid contract.",
      "This section outlines the liability limitations. In simple terms, it means the company's responsibility for damages is capped at a specific amount, which helps limit their financial exposure.",
      "The indemnification clause requires one party to compensate the other for certain losses or damages. Think of it as a promise to 'make whole' if specific problems arise.",
      "This warranty section means the provider guarantees their service will meet certain standards. If they don't deliver as promised, you may have grounds for compensation or contract termination."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const suggestedQuestions = [
    "What does this clause mean?",
    "Summarize the main points",
    "Are there any red flags?",
    "Explain the payment terms"
  ];

  return (
    <div className="min-h-screen subtle-gradient flex">
      <Sidebar />
      
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-card/90 backdrop-blur-lg border-b border-border/50 p-6"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary rounded-lg">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Document Analysis</h1>
              <p className="text-sm text-muted-foreground">Legal_Contract_2024.pdf • Ready for questions</p>
            </div>
          </div>
        </motion.div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ 
                  opacity: 0, 
                  x: message.type === 'user' ? 100 : -100,
                  scale: 0.8 
                }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  scale: 1 
                }}
                transition={{ 
                  duration: 0.5,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 200 
                }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-2xl ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  {/* Avatar */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`p-2 rounded-full ${
                      message.type === 'user' 
                        ? 'bg-accent text-accent-foreground' 
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    {message.type === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </motion.div>

                  {/* Message Content */}
                  <Card className={`glass-card ${
                    message.type === 'user' 
                      ? 'bg-accent/10 border-accent/20' 
                      : 'bg-card/80 border-border/30'
                  }`}>
                    <CardContent className="p-4">
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-sm leading-relaxed"
                      >
                        {message.content}
                      </motion.p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-start"
              >
                <div className="flex items-start space-x-3 max-w-2xl">
                  <div className="p-2 bg-primary text-primary-foreground rounded-full">
                    <Bot className="h-4 w-4" />
                  </div>
                  <Card className="glass-card bg-card/80">
                    <CardContent className="p-4">
                      <div className="flex space-x-1">
                        {[0, 1, 2].map((dot) => (
                          <motion.div
                            key={dot}
                            className="w-2 h-2 bg-muted-foreground rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: dot * 0.2
                            }}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="px-6 pb-4"
          >
            <p className="text-sm text-muted-foreground mb-3">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <motion.button
                  key={question}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setInputMessage(question)}
                  className="px-3 py-2 bg-muted/50 text-sm rounded-lg hover:bg-muted transition-colors border border-border/30"
                >
                  {question}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Input Area */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="border-t border-border/50 bg-card/90 backdrop-blur-lg p-6"
        >
          <div className="flex space-x-4">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about your document..."
              className="flex-1 bg-background/50 border-border/50 focus:border-accent/50 focus:ring-accent/20"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-accent hover:bg-accent/90 transition-all duration-300 hover:scale-105 group"
            >
              <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Chat;