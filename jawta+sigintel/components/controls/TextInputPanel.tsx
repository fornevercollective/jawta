
import React, { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Trash2, ArrowRight, ArrowDown, ArrowUp, Repeat, RefreshCw, Clock, Check, CheckCheck } from "lucide-react";
import { Badge } from "../ui/badge";
import { useResponsive } from "../ui/use-responsive";

interface TextInputPanelProps {
  value: string;
  onChange: (text: string) => void;
  onClear: () => void;
  receivedText?: string;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'remote';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

export function TextInputPanel({
  value,
  onChange,
  onClear,
  receivedText = ""
}: TextInputPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    // Initialize with some example messages
    {
      id: "init-1",
      text: "CQ CQ CQ DE JAWTA",
      sender: 'user',
      timestamp: new Date(Date.now() - 600000), // 10 minutes ago
      status: 'read'
    },
    {
      id: "init-2",
      text: "JAWTA DE KD6PQF K",
      sender: 'remote',
      timestamp: new Date(Date.now() - 540000), // 9 minutes ago
      status: 'read'
    },
    {
      id: "init-3",
      text: "KD6PQF DE JAWTA GM UR RST 589 589 BT NAME IS OPERATOR QTH IS CALIFORNIA BT HW CPY? AR",
      sender: 'user',
      timestamp: new Date(Date.now() - 480000), // 8 minutes ago
      status: 'read'
    }
  ]);
  const { isMobile } = useResponsive();
  const [activePane, setActivePane] = useState<'chat' | 'send'>('chat');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Function to handle sending a message
  const handleSend = () => {
    if (!value.trim()) return;
    
    // Create a new user message
    const newUserMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: value,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending'
    };
    
    // Add user message to chat
    setMessages(prev => [...prev, newUserMessage]);
    
    // Clear the input after sending
    onChange("");
    
    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newUserMessage.id ? {...msg, status: 'sent'} : msg
      ));
      
      // Simulate delivery confirmation after another delay
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === newUserMessage.id ? {...msg, status: 'delivered'} : msg
        ));
        
        // Simulate a response after another delay
        setTimeout(() => {
          // Create a simulated response based on the sent message
          let responseText = "";
          
          // Generate different responses based on message content
          if (newUserMessage.text.includes("CQ")) {
            responseText = `${newUserMessage.text.split(" ").find(part => part !== "CQ" && part !== "DE")} DE KX9XYZ K`;
          } else if (newUserMessage.text.includes("TEST")) {
            responseText = "TEST RECEIVED RST 599 K";
          } else if (newUserMessage.text.includes("QTH")) {
            responseText = "QTH GRID FM19 NEAR WASHINGTON DC BT NAME MIKE K";
          } else {
            responseText = `RECEIVED UR SIGNAL RST 549 K`;
          }
          
          // Add the remote response
          const responseMessage: ChatMessage = {
            id: `remote-${Date.now()}`,
            text: responseText,
            sender: 'remote',
            timestamp: new Date(),
            status: 'read'
          };
          
          setMessages(prev => [...prev, responseMessage]);
          
          // Mark the original message as read
          setMessages(prev => prev.map(msg => 
            msg.id === newUserMessage.id ? {...msg, status: 'read'} : msg
          ));
        }, 2000 + Math.random() * 2000); // Random response time between 2-4 seconds
        
      }, 1000); // Mark as delivered after 1 second
      
    }, 1000); // Mark as sent after 1 second
  };
  
  // Format timestamp to HH:MM format
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Clear all messages
  const clearChat = () => {
    setMessages([]);
  };
  
  // Render status indicator icon based on message status
  const renderStatusIndicator = (status: string) => {
    switch(status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-muted-foreground" />;
      case 'sent':
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <h3 className="text-sm font-medium">Signal I/O</h3>
          <Badge variant="secondary" className="ml-2 text-xs bg-black/40">Relay Chat</Badge>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost" 
            size="sm" 
            onClick={clearChat} 
            className="h-7 w-7 rounded-md p-1"
            title="Clear chat history"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Clear chat</span>
          </Button>
          <Button
            variant="ghost" 
            size="sm"
            className="h-7 w-7 rounded-md p-1"
            title="Refresh signal"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Mobile tabs for chat/send */}
      {isMobile && (
        <div className="flex mb-3 bg-black rounded-lg p-1">
          <Button 
            variant={activePane === 'chat' ? "default" : "ghost"} 
            size="sm"
            className={`flex-1 rounded-md ${activePane === 'chat' ? '' : 'text-muted-foreground'}`}
            onClick={() => setActivePane('chat')}
          >
            Chat
          </Button>
          <Button 
            variant={activePane === 'send' ? "default" : "ghost"}  
            size="sm"
            className={`flex-1 rounded-md ${activePane === 'send' ? '' : 'text-muted-foreground'}`}
            onClick={() => setActivePane('send')}
          >
            Compose
          </Button>
        </div>
      )}

      <div className={`${isMobile ? 'flex flex-col' : 'grid grid-cols-5 gap-4'} h-full`}>
        {/* Chat/Response Window */}
        <div 
          className={`${isMobile ? (activePane !== 'chat' ? 'hidden' : 'block mb-3') : 'col-span-3'}`}
        >
          <div className="border border-border/30 rounded-md bg-black/40 h-full flex flex-col">
            <div className="bg-black/60 p-2 border-b border-border/30 rounded-t-md">
              <div className="flex justify-between items-center">
                <div className="text-xs font-medium flex items-center">
                  <span>LIVE RELAY</span>
                  {messages.length > 0 && 
                    <Badge variant="outline" className="ml-2 bg-black/60 text-[10px] h-4">
                      {messages.length} msg{messages.length !== 1 ? 's' : ''}
                    </Badge>
                  }
                </div>
                <div className="flex gap-1 items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-subtle"></div>
                  <span className="text-[10px] text-muted-foreground">ACTIVE</span>
                </div>
              </div>
            </div>
            
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-3 scrollbar-hide"
              style={{ maxHeight: isMobile ? "240px" : "320px", minHeight: isMobile ? "240px" : "320px" }}
            >
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">No messages</p>
                    <p className="text-xs text-muted-foreground">Send a signal to start communication</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div 
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`rounded-lg p-2.5 max-w-[85%] relative 
                          ${message.sender === 'user' 
                            ? 'bg-blue-900/40 mr-1 border border-blue-900/30' 
                            : 'bg-gray-700/40 ml-1 border border-gray-700/30'}`}
                      >
                        <div className="text-xs mb-1 px-0.5">
                          {message.sender === 'user' ? 'TX' : 'RX'} • {formatTime(message.timestamp)}
                        </div>
                        <p className="font-mono break-words">{message.text}</p>
                        
                        {/* Status indicators only for user messages */}
                        {message.sender === 'user' && (
                          <div className="absolute -bottom-1.5 right-1 flex justify-end">
                            <div className="bg-black rounded-full p-0.5">
                              {renderStatusIndicator(message.status)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Compose/Send panel */}
        <div 
          className={`${isMobile ? (activePane !== 'send' ? 'hidden' : 'block') : 'col-span-2'}`}
        >
          <div className="border border-border/30 rounded-md bg-black/40 h-full flex flex-col">
            <div className="bg-black/60 p-2 border-b border-border/30 rounded-t-md">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium">COMPOSE SIGNAL</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onClear}
                  className="h-6 w-6 p-1 rounded-md"
                  title="Clear message"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            
            <div className="flex-1 p-3">
              <Textarea
                id="signal-input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Enter text to transmit..."
                className="resize-none h-full min-h-[120px] bg-input-background font-mono"
              />
            </div>
            
            <div className="p-3 pt-0 flex justify-end">
              <Button
                onClick={handleSend}
                disabled={!value.trim()}
                className="midi-pad text-xs py-1 flex gap-1 items-center"
              >
                <span>TRANSMIT</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick action buttons for desktop - visible below both panels */}
      {!isMobile && (
        <div className="flex justify-center mt-3">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="midi-pad px-3 py-1 h-8 text-xs"
              onClick={handleSend}
              disabled={!value.trim()}
            >
              <span>TRANSMIT</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="midi-pad px-2 py-1 h-8 text-xs"
              title="Auto-respond mode"
            >
              <Repeat className="h-3.5 w-3.5 mr-1" />
              <span>AUTO</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="midi-pad px-2 py-1 h-8 text-xs"
              title="Frequency scanning"
            >
              <span>SCAN</span>
            </Button>
          </div>
        </div>
      )}

      {/* Usage tips for mobile view */}
      {isMobile && activePane === 'chat' && (
        <div className="mt-2 text-center">
          <p className="text-[10px] text-muted-foreground">
            Tap the "Compose" tab to create and send a message
          </p>
        </div>
      )}
    </div>
  );
}
