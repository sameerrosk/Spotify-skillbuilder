import React, { useState, useEffect, useRef } from 'react';
import { Zap, X, Send, ChevronRight, HelpCircle, Loader2 } from 'lucide-react';
import { getAssistantResponse } from '../services/geminiService';
import { AssistantResponse } from '../types';

interface AssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  context: any;
}

const AssistantDrawer: React.FC<AssistantDrawerProps> = ({ isOpen, onClose, onOpen, context }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ type: 'user' | 'bot'; content: AssistantResponse | string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setHistory(prev => [...prev, { type: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await getAssistantResponse(userMsg, context);
      setHistory(prev => [...prev, { type: 'bot', content: response }]);
    } catch (err) {
      setHistory(prev => [...prev, { type: 'bot', content: 'Sorry, I had trouble connecting.' }]);
    } finally {
      setLoading(false);
    }
  };

  // Render Logic for Structured Response
  const renderBotResponse = (res: AssistantResponse) => {
    return (
      <div className="space-y-4">
        {/* Step by Step Flow */}
        {res.stepByStepFlow && res.stepByStepFlow.length > 0 && (
          <div className="bg-white/5 rounded-lg p-3">
            <h4 className="text-sm font-bold text-spotify-primary mb-2">Suggested Steps</h4>
            <ul className="space-y-3">
              {res.stepByStepFlow.map((step, idx) => (
                <li key={idx} className="flex gap-3 text-sm">
                  <span className="flex-shrink-0 w-6 h-6 bg-white/10 rounded-full flex items-center justify-center font-bold text-xs">{idx + 1}</span>
                  <div>
                    <p className="font-bold text-gray-200">{step.title}</p>
                    <p className="text-gray-400 text-xs">{step.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Checklist */}
        {res.checklist && res.checklist.length > 0 && (
          <div className="bg-white/5 rounded-lg p-3 border border-dashed border-white/20">
            <h4 className="text-sm font-bold text-green-400 mb-2">Checklist</h4>
            <ul className="space-y-2">
              {res.checklist.map((item) => (
                <li key={item.id} className="flex items-start gap-2 text-sm text-gray-300">
                  <input type="checkbox" className="mt-1 accent-spotify-primary" />
                  <div className="flex-1">
                    <span>{item.label}</span>
                    {item.hints.length > 0 && <p className="text-xs text-gray-500 mt-0.5">{item.hints[0]}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Suggested Actions */}
        {res.suggestedActions && res.suggestedActions.length > 0 && (
           <div className="flex flex-wrap gap-2">
             {res.suggestedActions.map((action, idx) => (
               <button key={idx} className="bg-spotify-primary/20 hover:bg-spotify-primary/30 text-spotify-primary text-xs font-bold py-2 px-3 rounded-full border border-spotify-primary/50 transition">
                 {action.label}
               </button>
             ))}
           </div>
        )}

        {/* Follow Ups */}
        {res.followUpQuestions && res.followUpQuestions.length > 0 && (
          <div className="pt-2">
             <p className="text-xs text-gray-500 mb-2">You might also ask:</p>
             <div className="flex flex-col gap-2">
                {res.followUpQuestions.map((q, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => { setInput(q); }}
                    className="text-left text-sm text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded transition"
                  >
                    "{q}"
                  </button>
                ))}
             </div>
          </div>
        )}
        
        {/* Simple text fallback if empty structure but high confidence? Or just Intent? */}
        {!res.stepByStepFlow && !res.checklist && (
            <div className="text-sm text-gray-300">
                <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Response</span>
                {res.uncertaintyExplanation || "I found this information for you."}
            </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Thunder Nudge (FAB) */}
      {!isOpen && (
        <button
          onClick={onOpen}
          className="fixed bottom-6 right-6 w-14 h-14 bg-spotify-primary hover:bg-spotify-highlight rounded-full shadow-lg shadow-spotify-primary/40 flex items-center justify-center z-50 animate-[pulse_3s_infinite] transition-transform hover:scale-110 active:scale-95"
          aria-label="Open Assistant"
        >
          <Zap fill="black" className="text-black" size={24} />
        </button>
      )}

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end pointer-events-none">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
          
          {/* Main Container */}
          <div className="pointer-events-auto w-full sm:w-[400px] h-[85vh] sm:h-[600px] sm:mr-6 sm:mb-6 bg-spotify-surface rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-[slideUp_0.3s_ease-out]">
            
            {/* Header */}
            <div className="p-4 bg-spotify-base/50 border-b border-white/5 flex items-center justify-between backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-tr from-spotify-primary to-blue-500 rounded-full flex items-center justify-center">
                    <Zap size={16} fill="white" className="text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-white text-sm">Mini-Guide</h3>
                    <p className="text-[10px] text-green-400 font-mono">ONLINE</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#1e1e1e]" ref={scrollRef}>
                {history.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-500 space-y-4">
                        <HelpCircle size={48} className="text-white/10" />
                        <p className="text-sm">Hi! I'm your learning assistant. Ask me about today's lesson, your progress, or technical issues.</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            <button onClick={() => setInput("Why is the track buffering?")} className="text-xs border border-white/10 rounded-full px-3 py-1 hover:bg-white/10">Buffering issues?</button>
                            <button onClick={() => setInput("Explain 'Perseverance'")} className="text-xs border border-white/10 rounded-full px-3 py-1 hover:bg-white/10">Explain vocabulary</button>
                        </div>
                    </div>
                )}
                {history.map((msg, i) => (
                    <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.type === 'user' ? (
                             <div className="bg-spotify-primary text-black px-4 py-2 rounded-2xl rounded-tr-sm max-w-[80%] text-sm font-medium">
                                {msg.content as string}
                             </div>
                        ) : (
                            <div className="bg-spotify-base border border-white/5 text-white p-3 rounded-2xl rounded-tl-sm max-w-[90%] shadow-sm">
                                {typeof msg.content === 'string' ? msg.content : renderBotResponse(msg.content)}
                            </div>
                        )}
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-spotify-base border border-white/5 p-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                             <Loader2 size={16} className="animate-spin text-spotify-primary" />
                             <span className="text-xs text-gray-400">Thinking...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-3 bg-spotify-base border-t border-white/5 flex gap-2">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a question..." 
                    className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-spotify-primary transition-colors placeholder:text-gray-600"
                />
                <button 
                    type="submit" 
                    disabled={!input.trim() || loading}
                    className="bg-spotify-primary hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black p-2 rounded-full transition-colors flex-shrink-0"
                >
                    <Send size={20} className="ml-0.5" />
                </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
};

export default AssistantDrawer;