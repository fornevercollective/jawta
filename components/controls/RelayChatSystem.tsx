
import React, { useState, useEffect, useRef } from 'react';
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Trash2, RefreshCw, Radio, Clock, Check, CheckCheck, Repeat, ArrowRight } from "lucide-react";
import { useResponsive } from "../ui/use-responsive";
import { Textarea } from "../ui/textarea";

// Type definitions
interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'remote';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  frequencyBand?: string;
}

interface RelayChatSystemProps {
  isTransmitting?: boolean;
  frequencyBand?: string;
}

export function RelayChatSystem({ 
  isTransmitting = false,
  frequencyBand = 'HF'
}: RelayChatSystemProps) {
  // State
  const [inputText, setInputText] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    // Sample messages to initialize the chat
    {
      id: "init-1",
      text: "CQ CQ CQ DE JAWTA",
      sender: 'user',
      timestamp: new Date(Date.now() - 600000), // 10 minutes ago
      status: 'read',
      frequencyBand: 'HF'
    },
    {
      id: "init-2",
      text: "JAWTA DE KD6PQF K",
      sender: 'remote',
      timestamp: new Date(Date.now() - 540000), // 9 minutes ago
      status: 'read',
      frequencyBand: 'HF'
    },
    {
      id: "init-3",
      text: "KD6PQF DE JAWTA GM UR RST 589 589 BT NAME IS OPERATOR QTH IS CALIFORNIA BT HW CPY? AR",
      sender: 'user',
      timestamp: new Date(Date.now() - 480000), // 8 minutes ago
      status: 'read',
      frequencyBand: 'HF'
    },
    {
      id: "init-4",
      text: "JAWTA DE KD6PQF R R FB COPY UR 589 589 ALSO BT NAME MIKE QTH ARIZONA BT USING 100W INTO A DIPOLE AR",
      sender: 'remote',
      timestamp: new Date(Date.now() - 420000), // 7 minutes ago
      status: 'read',
      frequencyBand: 'HF'
    }
  ]);
  
  const [activePane, setActivePane] = useState<'chat' | 'send'>('chat');
  const { isMobile } = useResponsive();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [autoResponse, setAutoResponse] = useState<boolean>(false);
  
  // Automatic response templates based on frequency band
  const responseTemplates = {
    'HF': [
      "DE {CALLSIGN} R RST 559 559 QTH GRID EM28 73",
      "{CALLSIGN} DE N0CALL BT GOOD SIGNAL BT 73",
      "R R TNX FOR CALL UR RST 579 579 QTH SEATTLE BK",
      "QSL FB COPY UR SIGNAL RST 599 K",
    ],
    'VHF': [
      "RECEIVED ON VHF RST 55 QTH GRID FN31 K",
      "COPYING YOUR VHF SIGNAL WITH SOME QSB K",
      "VHF PROPAGATION EXCELLENT TODAY K"
    ],
    'UHF': [
      "UHF SIGNAL RECEIVED RST 53 K",
      "WEAK SIGNAL ON UHF BUT READABLE K",
      "UHF RECEPTION LIMITED BY LOCAL TERRAIN K"
    ],
    'Satellite': [
      "COPIED VIA SATELLITE PASS AOS +2 MINS K",
      "SATELLITE DOWNLINK SIGNAL RST 57 K",
      "DOPPLER SHIFT NOTED ON SIGNAL K"
    ],
    'Optical': [
      "OPTICAL SIGNAL RECEIVED CLEAR K",
      "LIGHT MODULATION DETECTED K",
      "OPTICAL LINK ESTABLISHED K"
    ]
  };
  
  // Sample callsigns for random responses
  const callsigns = ["W1AW", "KD9XYZ", "N0CALL", "G4ABC", "VE3DEF", "JA2ZYX", "EA3QRP"];
  
  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Generate a random response based on the current frequency band
  const generateRandomResponse = (inputMessage: string): string => {
    const band = frequencyBand || 'HF';
    const templates = responseTemplates[band as keyof typeof responseTemplates] || responseTemplates.HF;
    
    // Pick a random template
    let template = templates[Math.floor(Math.random() * templates.length)];
    
    // Extract any callsign from the input message (basic pattern match)
    const callsignMatch = inputMessage.match(/DE\s+([A-Z0-9\/]+)/i);
    const userCallsign = callsignMatch ? callsignMatch[1] : "JAWTA";
    
    // Pick a random responding callsign
    const respondingCallsign = callsigns[Math.floor(Math.random() * callsigns.length)];
    
    // Replace template variables
    return template
      .replace('{CALLSIGN}', userCallsign)
      .replace('{RESPONDING_CALLSIGN}', respondingCallsign);
  };
  
  // Function to handle sending a message
  const handleSend = () => {
    if (!inputText.trim()) return;
    
    // Create a new user message
    const newUserMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending',
      frequencyBand
    };
    
    // Add user message to chat
    setMessages(prev => [...prev, newUserMessage]);
    
    // Clear the input after sending
    setInputText("");
    
    // If on mobile, switch to chat view after sending
    if (isMobile) {
      setActivePane('chat');
    }
    
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
        
        // Generate automatic response if enabled or randomly
        if (autoResponse || Math.random() > 0.4) {
          // Simulate a response after a delay
          setTimeout(() => {
            // Generate a response based on the message
            const responseText = generateRandomResponse(newUserMessage.text);
            
            // Add the remote response
            const responseMessage: ChatMessage = {
              id: `remote-${Date.now()}`,
              text: responseText,
              sender: 'remote',
              timestamp: new Date(),
              status: 'read',
              frequencyBand
            };
            
            setMessages(prev => [...prev, responseMessage]);
            
            // Mark the original message as read
            setMessages(prev => prev.map(msg => 
              msg.id === newUserMessage.id ? {...msg, status: 'read'} : msg
            ));
          }, 1500 + Math.random() * 3500); // Random response time
        }
        
      }, 800); // Mark as delivered after 800ms
      
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
          <h3 className="text-sm font-medium">Signal Relay</h3>
          <Badge variant="secondary" className="ml-2 text-xs bg-black/40">{frequencyBand} Band</Badge>
          {isTransmitting && (
            <Badge variant="destructive" className="ml-2 text-xs">LIVE</Badge>
          )}
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
            variant={autoResponse ? "default" : "ghost"}
            size="sm"
            onClick={() => setAutoResponse(!autoResponse)}
            className={`h-7 rounded-md ${autoResponse ? "midi-pad-active-cyan" : ""}`}
            title={autoResponse ? "Disable auto-response" : "Enable auto-response"}
          >
            <Repeat className="h-4 w-4 mr-1" />
            <span className="text-xs">Auto</span>
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
                  <Radio className="h-3.5 w-3.5 mr-1.5" />
                  <span>SIGNAL MONITOR</span>
                  {messages.length > 0 && 
                    <Badge variant="outline" className="ml-2 bg-black/60 text-[10px] h-4">
                      {messages.length} msg{messages.length !== 1 ? 's' : ''}
                    </Badge>
                  }
                </div>
                <div className="flex gap-1 items-center">
                  <div className={`w-2 h-2 rounded-full ${isTransmitting ? 'bg-green-500 animate-pulse-subtle' : 'bg-gray-500'}`}></div>
                  <span className="text-[10px] text-muted-foreground">{isTransmitting ? 'ACTIVE' : 'IDLE'}</span>
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
                        <div className="text-xs mb-1 px-0.5 flex justify-between">
                          <span>{message.sender === 'user' ? 'TX' : 'RX'} • {formatTime(message.timestamp)}</span>
                          <span className="text-[10px] text-muted-foreground ml-2">{message.frequencyBand}</span>
                        </div>
                        <p className="font-mono break-words text-sm">{message.text}</p>
                        
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
                  onClick={() => setInputText("")}
                  className="h-6 w-6 p-1 rounded-md"
                  title="Clear message"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            
            <div className="flex-1 p-3">
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to transmit..."
                className="resize-none h-full min-h-[120px] bg-input-background font-mono"
              />
            </div>
            
            <div className="p-3 pt-0 flex justify-between">
              <div className="flex items-center">
                <Badge 
                  variant="outline" 
                  className={`bg-black text-[10px] border-${
                    isTransmitting ? 'green-500' : 'border/30'
                  } ${isTransmitting ? 'text-green-500' : 'text-muted-foreground'}`}
                >
                  {frequencyBand} BAND
                </Badge>
              </div>
              <Button
                onClick={handleSend}
                disabled={!inputText.trim()}
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
              disabled={!inputText.trim()}
            >
              <span>TRANSMIT</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className={`midi-pad px-2 py-1 h-8 text-xs ${autoResponse ? "midi-pad-active-cyan" : ""}`}
              onClick={() => setAutoResponse(!autoResponse)}
              title="Auto-respond mode"
            >
              <Repeat className="h-3.5 w-3.5 mr-1" />
              <span>AUTO</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="midi-pad px-2 py-1 h-8 text-xs"
              title="Clear all messages"
              onClick={clearChat}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              <span>CLEAR</span>
            </Button>
          </div>
        </div>
      )}

      {/* Usage tips for mobile view */}
      {isMobile && activePane === 'chat' && messages.length === 0 && (
        <div className="mt-2 text-center">
          <p className="text-[10px] text-muted-foreground">
            Tap the "Compose" tab to create and send a message
          </p>
        </div>
      )}
    </div>
  );
}
