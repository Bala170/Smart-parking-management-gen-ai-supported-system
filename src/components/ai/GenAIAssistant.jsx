import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Cpu,
  ChevronRight,
  RefreshCw,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { aiService } from '../../services/aiService';

export const GenAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modelInfo, setModelInfo] = useState({
    online: false,
    model: 'Detecting model...',
    models: []
  });
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: "Hello! I am your Parkwise GenAI Assistant connected to your local model. Ask me any doubt about parking slot directions, fee tariffs, lost token recovery, or proxy vehicle pickup.",
      actionCard: null,
      pipeline: null,
      timestamp: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const quickPrompts = [
    "Where is my bike parked?",
    "How much is my current parking fee?",
    "I lost my parking token, how do I recover it?",
    "Can my friend collect my bike?",
    "How does the RFID gate verification work?",
    "Explain the 4-step MFA recovery workflow"
  ];

  const refreshModelStatus = async () => {
    try {
      const info = await aiService.checkConnection();
      if (info) setModelInfo(info);
    } catch (e) {
      console.warn('Could not query model status:', e);
    }
  };

  useEffect(() => {
    refreshModelStatus();
  }, []);

  useEffect(() => {
    if (isOpen) {
      refreshModelStatus();
      scrollToBottom();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleModelChange = (newModel) => {
    aiService.setModel(newModel);
    setModelInfo((prev) => ({ ...prev, model: newModel }));
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await aiService.processQuery(text);
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: response.reply,
        actionCard: response.actionCard,
        pipeline: response.pipeline,
        intent: response.intent,
        suggestions: response.suggestions,
        engine: response.engine,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: "I encountered an error connecting to the local AI engine. Please verify that Ollama is running.",
          actionCard: null,
          timestamp: 'Now'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Helper to format basic markdown-style text (bold and bullets)
  const renderFormattedText = (rawText) => {
    if (!rawText) return null;
    const lines = rawText.split('\n');
    return lines.map((line, idx) => {
      // Bullet point line
      const isBullet = line.trim().startsWith('* ') || line.trim().startsWith('- ');
      const content = isBullet ? line.trim().slice(2) : line;

      // Handle **bold** fragments
      const parts = content.split(/(\*\*.*?\*\*)/g);
      const renderedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={idx} className="flex items-start gap-1.5 my-0.5 pl-1">
            <span className="text-blue-500 font-bold">•</span>
            <span>{renderedParts}</span>
          </div>
        );
      }

      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }

      return <p key={idx} className="my-0.5">{renderedParts}</p>;
    });
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white rounded-full shadow-[0_8px_30px_rgba(15,23,42,0.35)] hover:bg-slate-800 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer border border-slate-700/80 group"
          aria-label="Open GenAI Parking Assistant"
        >
          <div className="relative flex items-center justify-center">
            <Sparkles className="w-4.5 h-4.5 text-blue-400 group-hover:rotate-12 transition-transform duration-300" />
            <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${modelInfo.online ? 'bg-emerald-400' : 'bg-blue-500'}`} />
          </div>
          <span className="text-xs font-bold tracking-wide pr-1">GenAI Assistant</span>
          {modelInfo.online && (
            <span className="text-[9.5px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full font-mono border border-emerald-500/30">
              LOCAL LLM
            </span>
          )}
        </button>
      )}

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-[92vw] sm:w-[440px] h-[640px] max-h-[88vh] bg-white rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.25)] border border-slate-200/90 flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95">
          {/* Obsidian Header */}
          <div className="p-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800/80 relative">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold tracking-tight flex items-center gap-2">
                  Parkwise GenAI Assistant
                  {modelInfo.online ? (
                    <span className="flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      OLLAMA LIVE
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">
                      RULE ENGINE
                    </span>
                  )}
                </h3>
                <div className="flex items-center gap-1.5 text-[10.5px] text-slate-400">
                  <span>Model:</span>
                  {modelInfo.models && modelInfo.models.length > 1 ? (
                    <select
                      value={modelInfo.model}
                      onChange={(e) => handleModelChange(e.target.value)}
                      className="bg-slate-900 text-emerald-400 text-[10px] font-mono rounded px-1.5 py-0.5 border border-slate-700 focus:outline-none"
                    >
                      {modelInfo.models.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-emerald-400 font-mono text-[10.5px]">
                      {modelInfo.model || 'Detecting...'}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={refreshModelStatus}
                title="Refresh Ollama Connection"
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Architecture Disclaimer Badge */}
          <div className="px-3.5 py-2 bg-blue-50/90 border-b border-blue-100 flex items-center gap-2 text-[10.5px] text-blue-900">
            <Cpu className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">
              <strong>Decoupled Architecture:</strong> Local LLM resolves queries; backend validates security.
            </span>
          </div>

          {/* Message Thread */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/60">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs shadow-2xs">
                    <Bot className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  {/* Bubble */}
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-xs font-medium shadow-xs'
                        : 'bg-white text-slate-800 rounded-tl-xs border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)]'
                    }`}
                  >
                    {renderFormattedText(msg.text)}
                  </div>

                  {/* Engine badge */}
                  {msg.engine && (
                    <div className="flex items-center gap-1.5 text-[9.5px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200/90 px-2 py-0.5 rounded-lg w-fit">
                      <Zap className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{msg.engine}</span>
                    </div>
                  )}

                  {/* Flow pipeline trace if AI msg */}
                  {msg.pipeline && (
                    <div className="text-[9.5px] font-mono text-slate-600 bg-slate-100/90 border border-slate-200/80 px-2.5 py-1.5 rounded-xl">
                      <span className="font-bold text-slate-800">Intent Pipeline:</span> {msg.pipeline}
                    </div>
                  )}

                  {/* Action Card */}
                  {msg.actionCard && (
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                          {msg.actionCard.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-full font-semibold">
                          {msg.actionCard.status}
                        </span>
                      </div>

                      {msg.actionCard.metadata && (
                        <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                          {Object.entries(msg.actionCard.metadata).map(([k, v]) => (
                            <div key={k} className="flex justify-between">
                              <span className="text-slate-400 capitalize">{k}:</span>
                              <span className="font-bold text-slate-800">{v}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <button
                        onClick={() => {
                          setIsOpen(false);
                          navigate(msg.actionCard.actionUrl);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer"
                      >
                        <span>{msg.actionCard.actionLabel}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Suggestions chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(sug)}
                          className="text-[10.5px] font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 px-2.5 py-1 rounded-full transition-all cursor-pointer shadow-2xs active:scale-95"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold shadow-2xs">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-500 pl-9">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                <span className="font-medium text-[11px]">
                  Generating explanation via local model ({modelInfo.model})...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          {messages.length <= 2 && (
            <div className="px-3.5 py-2.5 bg-slate-50 border-t border-slate-200/80 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
              {quickPrompts.slice(0, 4).map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="inline-block text-[10.5px] font-medium text-slate-700 bg-white border border-slate-200 hover:border-blue-400 px-3 py-1 rounded-full cursor-pointer transition-all shrink-0 shadow-2xs"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="p-3.5 bg-white border-t border-slate-200/90">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask any doubt: bay, fees, lost token, proxy pickup..."
                className="flex-1 text-xs px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all text-slate-900 placeholder-slate-400"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="w-9 h-9 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95 shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
