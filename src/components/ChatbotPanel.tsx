import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  IconChevronDown, 
  IconPaperclip,
  IconBolt,
  IconArrowUp,
  IconCpu,
  IconEdit,
  IconChevronsRight,
  IconCopy,
  IconCheck,
  IconSearch,
  IconX,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  actions?: Action[];
  timestamp: string;
}

interface Action {
  label: string;
  type: 'navigate' | 'prompt';
  target?: string;
  prompt?: string;
}

interface ChatSession {
  id: string;
  title: string;
  updatedAt: string;
}

interface ChatbotPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ----------------------------------------
   Mock Response Generator
   ---------------------------------------- */

function generateMockResponse(userMessage: string): { content: string; actions: Action[] } {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes('ai workload') || lowerMessage.includes('ai workloads')) {
    return {
      content: '🤖 Active Training Jobs: 3\n⚡ Inference Jobs: 5\n📊 Total GPU Usage: 72%\n\nCurrently running:\n• Training: model-v2-training (2 GPUs)\n• Training: data-pipeline (1 GPU)\n• Inference: api-service (3 GPUs)',
      actions: [{ label: 'Open AI Platform', type: 'navigate', target: 'ai-platform' }]
    };
  }

  if (lowerMessage.includes('open') && lowerMessage.includes('compute')) {
    return {
      content: '🚀 Opening the Compute app...',
      actions: [{ label: 'Go to Compute', type: 'navigate', target: 'compute' }]
    };
  }

  if (lowerMessage.includes('gpu instance') || lowerMessage.includes('create') && lowerMessage.includes('gpu')) {
    return {
      content: '💡 To create a GPU instance:\n1. Open the Compute app\n2. Click "Create Instance"\n3. Select GPU instance type\n4. Configure and launch\n\n✨ Let me know if you need more help!',
      actions: [{ label: 'Go to Compute', type: 'navigate', target: 'compute' }]
    };
  }

  if (lowerMessage.includes('project') && lowerMessage.includes('resource')) {
    return {
      content: '📈 Resource Usage by Project:\n• Project Alpha: 45%\n• Project Beta: 32%\n• Project Gamma: 23%',
      actions: []
    };
  }

  if (lowerMessage.includes('edit') && lowerMessage.includes('dev-server')) {
    return {
      content: '🛠️ I can help you edit dev-server-01 configurations. Opening Compute app...',
      actions: [{ label: 'Go to Compute', type: 'navigate', target: 'compute' }]
    };
  }

  return {
    content: `👋 I understand you want to: "${userMessage}". How can I help you with that?`,
    actions: []
  };
}

/* ----------------------------------------
   Suggestion Buttons
   ---------------------------------------- */

const suggestions = [
  'Hello world',
  'What AI workloads are currently running?',
];

/* ----------------------------------------
   ChatbotPanel Component
   ---------------------------------------- */

export function ChatbotPanel({ isOpen, onClose }: ChatbotPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [currentTitle, setCurrentTitle] = useState('New chat');
  const [showChatList, setShowChatList] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [showModelSelect, setShowModelSelect] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Auto');
  const [mcpEnabled, setMcpEnabled] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<ChatSession | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  
  // Animation states (following Drawer pattern)
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Empty state fade-in animation key
  const [emptyStateKey, setEmptyStateKey] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modelSelectRef = useRef<HTMLDivElement>(null);
  const chatListRef = useRef<HTMLDivElement>(null);

  // Handle mount/unmount with animation (following Drawer pattern)
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small delay to ensure DOM is ready for animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300); // Wait for animation
    }
  }, [isOpen]);

  // Close chat list dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatListRef.current && !chatListRef.current.contains(event.target as Node)) {
        setShowChatList(false);
        setChatSearchQuery('');
      }
    };
    if (showChatList) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showChatList]);

  // Close model select dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modelSelectRef.current && !modelSelectRef.current.contains(event.target as Node)) {
        setShowModelSelect(false);
      }
    };

    if (showModelSelect) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showModelSelect]);

  // Create initial session when panel opens for the first time
  useEffect(() => {
    if (isOpen && sessions.length === 0 && !currentSessionId) {
      const sessionId = `session_${Date.now()}`;
      const newSession: ChatSession = {
        id: sessionId,
        title: 'New chat',
        updatedAt: new Date().toISOString(),
      };
      setSessions([newSession]);
      setCurrentSessionId(sessionId);
      setCurrentTitle('New chat');
    }
  }, [isOpen, sessions.length, currentSessionId]);

  const createNewSession = useCallback(() => {
    const sessionId = `session_${Date.now()}`;
    const newSession: ChatSession = {
      id: sessionId,
      title: 'New chat',
      updatedAt: new Date().toISOString(),
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(sessionId);
    setCurrentTitle('New chat');
    setMessages([]);
    setEmptyStateKey(prev => prev + 1); // Trigger fade-in animation
    setShowChatList(false);
    setChatSearchQuery('');
  }, []);

  const handleDeleteClick = useCallback((e: React.MouseEvent, session: ChatSession) => {
    e.stopPropagation();
    setSessionToDelete(session);
    setShowDeleteModal(true);
  }, []);

  const confirmDeleteSession = useCallback(() => {
    if (!sessionToDelete) return;
    
    setSessions(prev => prev.filter(s => s.id !== sessionToDelete.id));
    
    // If deleting current session, create a new one
    if (sessionToDelete.id === currentSessionId) {
      const remainingSessions = sessions.filter(s => s.id !== sessionToDelete.id);
      if (remainingSessions.length > 0) {
        setCurrentSessionId(remainingSessions[0].id);
        setCurrentTitle(remainingSessions[0].title);
        setMessages([]);
        setEmptyStateKey(prev => prev + 1); // Trigger fade-in animation
      } else {
        // Create new session if no sessions left
        const sessionId = `session_${Date.now()}`;
        const newSession: ChatSession = {
          id: sessionId,
          title: 'New chat',
          updatedAt: new Date().toISOString(),
        };
        setSessions([newSession]);
        setCurrentSessionId(sessionId);
        setCurrentTitle('New chat');
        setMessages([]);
        setEmptyStateKey(prev => prev + 1); // Trigger fade-in animation
      }
    }
    
    setShowDeleteModal(false);
    setSessionToDelete(null);
  }, [sessionToDelete, currentSessionId, sessions]);

  const cancelDeleteSession = useCallback(() => {
    setShowDeleteModal(false);
    setSessionToDelete(null);
  }, []);

  const handleAttachClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setAttachedFiles(prev => [...prev, ...Array.from(files)]);
    }
    // Reset file input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleRemoveFile = useCallback((index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setAttachedFiles([]);
    setIsTyping(true);

    // Update session title if first message
    if (messages.length === 0) {
      setCurrentTitle(content.trim().substring(0, 30));
      setSessions(prev => prev.map(s => 
        s.id === currentSessionId 
          ? { ...s, title: content.trim().substring(0, 30) }
          : s
      ));
    }

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateMockResponse(content);
      const assistantMessage: Message = {
        id: `msg_${Date.now()}_assistant`,
        role: 'assistant',
        content: response.content,
        actions: response.actions,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 300 + Math.random() * 500);
  }, [currentSessionId, messages.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleActionClick = (action: Action) => {
    console.log('Action clicked:', action);
    // In a real app, this would navigate or perform actions
  };

  const selectSession = (session: ChatSession) => {
    setCurrentSessionId(session.id);
    setCurrentTitle(session.title);
    // In a real app, we would load messages from storage
    setMessages([]);
    setEmptyStateKey(prev => prev + 1); // Trigger fade-in animation
    setShowChatList(false);
    setChatSearchQuery('');
  };

  if (!shouldRender) return null;

  return (
    <div 
      className={`
        fixed top-[52px] right-0 bottom-0 w-[400px]
        bg-[var(--color-surface-default)] 
        shadow-lg border border-[var(--color-border-subtle)] 
        overflow-hidden z-[3000] flex flex-col
        transition-all duration-300 ease-out
        ${isAnimating 
          ? 'opacity-100 translate-x-0' 
          : 'opacity-0 translate-x-full'
        }
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--color-border-default)] shrink-0">
        {/* Chat Selector - Left */}
        <div className="relative" ref={chatListRef}>
          <button 
            className="flex items-center gap-1 text-[var(--color-text-default)] hover:opacity-70 transition-opacity cursor-pointer"
            onClick={() => {
              setShowChatList(!showChatList);
              if (showChatList) setChatSearchQuery('');
            }}
          >
            <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-medium truncate max-w-[200px]">{currentTitle}</span>
            <IconChevronDown size={14} stroke={2} />
          </button>
          
          {showChatList && (
            <div className="absolute top-full left-0 mt-2 w-[300px] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg shadow-lg z-10 overflow-hidden">
              {/* Search Field */}
              <div className="px-3 py-2 border-b border-[var(--color-border-default)]">
                <div className="relative">
                  <IconSearch 
                    size={14} 
                    stroke={1.5} 
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" 
                  />
                  <input
                    type="text"
                    placeholder="Search chats..."
                    value={chatSearchQuery}
                    onChange={(e) => setChatSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-[length:var(--font-size-12)] leading-[var(--line-height-18)] bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-md text-[var(--color-text-default)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-border-focus)] transition-colors"
                  />
                </div>
              </div>
              
              {/* Chat List */}
              <div className="max-h-[300px] overflow-y-auto">
                {/* Today Section */}
                {sessions.filter(s => {
                  const today = new Date();
                  const sessionDate = new Date(s.updatedAt);
                  const matchesSearch = s.title.toLowerCase().includes(chatSearchQuery.toLowerCase());
                  return sessionDate.toDateString() === today.toDateString() && matchesSearch;
                }).length > 0 && (
                  <>
                    <div className="px-4 py-2 text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-medium text-[var(--color-text-muted)]">
                      Today
                    </div>
                    {sessions.filter(s => {
                      const today = new Date();
                      const sessionDate = new Date(s.updatedAt);
                      const matchesSearch = s.title.toLowerCase().includes(chatSearchQuery.toLowerCase());
                      return sessionDate.toDateString() === today.toDateString() && matchesSearch;
                    }).map(session => (
                      <div
                        key={session.id}
                        className={`group px-4 py-2.5 cursor-pointer transition-colors flex items-center justify-between ${
                          session.id === currentSessionId 
                            ? 'bg-[var(--color-surface-subtle)]' 
                            : 'hover:bg-[var(--color-surface-subtle)]'
                        }`}
                        onClick={() => selectSession(session)}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {session.id === currentSessionId && (
                            <IconCheck size={14} stroke={2} className="text-[var(--color-text-default)] shrink-0" />
                          )}
                          <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)] truncate">{session.title}</span>
                        </div>
                        <button
                          className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-surface-default)] rounded transition-all cursor-pointer shrink-0"
                          onClick={(e) => handleDeleteClick(e, session)}
                          title="Delete chat"
                        >
                          <IconX size={14} stroke={1.5} />
                        </button>
                      </div>
                    ))}
                  </>
                )}
                
                {/* Yesterday Section */}
                {sessions.filter(s => {
                  const yesterday = new Date();
                  yesterday.setDate(yesterday.getDate() - 1);
                  const sessionDate = new Date(s.updatedAt);
                  const matchesSearch = s.title.toLowerCase().includes(chatSearchQuery.toLowerCase());
                  return sessionDate.toDateString() === yesterday.toDateString() && matchesSearch;
                }).length > 0 && (
                  <>
                    <div className="px-4 py-2 text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-medium text-[var(--color-text-muted)] border-t border-[var(--color-border-default)]">
                      Yesterday
                    </div>
                    {sessions.filter(s => {
                      const yesterday = new Date();
                      yesterday.setDate(yesterday.getDate() - 1);
                      const sessionDate = new Date(s.updatedAt);
                      const matchesSearch = s.title.toLowerCase().includes(chatSearchQuery.toLowerCase());
                      return sessionDate.toDateString() === yesterday.toDateString() && matchesSearch;
                    }).map(session => (
                      <div
                        key={session.id}
                        className={`group px-4 py-2.5 cursor-pointer transition-colors flex items-center justify-between ${
                          session.id === currentSessionId 
                            ? 'bg-[var(--color-surface-subtle)]' 
                            : 'hover:bg-[var(--color-surface-subtle)]'
                        }`}
                        onClick={() => selectSession(session)}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {session.id === currentSessionId && (
                            <IconCheck size={14} stroke={2} className="text-[var(--color-text-default)] shrink-0" />
                          )}
                          <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)] truncate">{session.title}</span>
                        </div>
                        <button
                          className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-surface-default)] rounded transition-all cursor-pointer shrink-0"
                          onClick={(e) => handleDeleteClick(e, session)}
                          title="Delete chat"
                        >
                          <IconX size={14} stroke={1.5} />
                        </button>
                      </div>
                    ))}
                  </>
                )}
                
                {sessions.length === 0 && (
                  <div className="px-4 py-3 text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-muted)]">No chats yet</div>
                )}
                
                {sessions.length > 0 && sessions.filter(s => 
                  s.title.toLowerCase().includes(chatSearchQuery.toLowerCase())
                ).length === 0 && (
                  <div className="px-4 py-3 text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-muted)]">No matching chats</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          <button 
            className="w-7 h-7 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)] rounded transition-colors cursor-pointer"
            onClick={createNewSession}
            title="New chat"
          >
            <IconEdit size={18} stroke={1.5} />
          </button>
          <button 
            className="w-7 h-7 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)] rounded transition-colors cursor-pointer"
            onClick={onClose}
            title="Collapse"
          >
            <IconChevronsRight size={18} stroke={1.5} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.length === 0 ? (
          /* Empty State */
          <div 
            key={emptyStateKey}
            className="flex flex-col items-start p-5 animate-fade-in"
            style={{ animation: 'fadeIn 600ms ease-out forwards' }}
          >
            <h4 className="text-base font-semibold text-[var(--color-text-default)] mb-4">How can I help you?</h4>
            <div className="flex flex-col gap-4 w-full">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="px-2.5 py-1.5 bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-2xl text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-medium text-[var(--color-text-default)] text-left shadow-sm hover:bg-[var(--color-surface-subtle)] transition-colors w-fit cursor-pointer"
                  onClick={() => sendMessage(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col gap-1 animate-in fade-in slide-in-from-bottom-2 duration-200 group ${
                  message.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div className={`relative max-w-[80%] ${message.role === 'user' ? 'flex flex-row-reverse items-start gap-1' : 'flex items-start gap-1'}`}>
                  <div
                    className={`px-3.5 py-2.5 rounded-lg text-[length:var(--font-size-12)] leading-[var(--line-height-18)] whitespace-pre-wrap ${
                      message.role === 'user'
                        ? 'bg-[var(--color-action-primary)] text-white rounded-br-sm'
                        : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-default)] rounded-bl-sm'
                    }`}
                  >
                    {message.content}
                  </div>
                  {/* Copy Button - appears on hover */}
                  <button
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[var(--color-surface-subtle)] rounded shrink-0 cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(message.content);
                      setCopiedMessageId(message.id);
                      setTimeout(() => setCopiedMessageId(null), 2000);
                    }}
                    title="Copy message"
                  >
                    {copiedMessageId === message.id ? (
                      <IconCheck size={14} stroke={1.5} className="text-[var(--color-status-success)]" />
                    ) : (
                      <IconCopy size={14} stroke={1.5} className="text-[var(--color-text-muted)]" />
                    )}
                  </button>
                </div>
                {message.actions && message.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {message.actions.map((action, idx) => (
                      <button
                        key={idx}
                        className="px-3 py-1.5 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-action-primary)] hover:bg-[var(--color-surface-subtle)] hover:border-[var(--color-action-primary)] transition-colors cursor-pointer"
                        onClick={() => handleActionClick(action)}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-start">
                <div className="flex gap-1 px-3.5 py-2.5 bg-[var(--color-surface-subtle)] rounded-lg rounded-bl-sm">
                  <div className="w-1.5 h-1.5 bg-[var(--color-text-muted)] rounded-full animate-pulse" />
                  <div className="w-1.5 h-1.5 bg-[var(--color-text-muted)] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-1.5 h-1.5 bg-[var(--color-text-muted)] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Composer */}
      <div className="p-3 shrink-0">
        <div className={`bg-[var(--color-surface-default)] border rounded-2xl p-3 min-h-[160px] flex flex-col gap-2 transition-colors ${
          isInputFocused 
            ? 'border-[var(--color-border-focus)]' 
            : 'border-[var(--color-border-default)]'
        }`}>
          {/* Attached Files */}
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 pb-2 border-b border-[var(--color-border-default)]">
              {attachedFiles.map((file, index) => (
                <div 
                  key={`${file.name}-${index}`}
                  className="flex items-center gap-1.5 px-2 py-1 bg-[var(--color-surface-subtle)] rounded-md text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)] max-w-[150px]"
                >
                  <IconPaperclip size={12} stroke={1.5} className="text-[var(--color-text-muted)] shrink-0" />
                  <span className="truncate">{file.name}</span>
                  <button
                    className="w-4 h-4 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] transition-colors cursor-pointer shrink-0"
                    onClick={() => handleRemoveFile(index)}
                    title="Remove file"
                  >
                    <IconX size={12} stroke={1.5} />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            placeholder="Ask me anything..."
            className="flex-1 border-none bg-transparent text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)] resize-none outline-none placeholder:text-[var(--color-text-muted)] min-h-[60px]"
            rows={1}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
                accept="*/*"
              />
              {/* Attach Button */}
              <button 
                className="w-4 h-4 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] transition-colors cursor-pointer"
                onClick={handleAttachClick}
                title="Attach files"
              >
                <IconPaperclip size={16} stroke={1.5} />
              </button>

              {/* Model Select */}
              <div className="relative" ref={modelSelectRef}>
                <button 
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-md text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-medium text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)] transition-colors cursor-pointer"
                  onClick={() => setShowModelSelect(!showModelSelect)}
                >
                  <IconCpu size={12} stroke={1.5} />
                  <span>{selectedModel}</span>
                  <IconChevronDown size={8} stroke={2} />
                </button>
                {showModelSelect && (
                  <div className="absolute bottom-full left-0 mb-2 w-[140px] bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-md shadow-lg z-10 overflow-hidden">
                    {['Auto', 'Opus 4.5', 'GPT-5.2', 'Gemini 3'].map((model) => (
                      <div
                        key={model}
                        className={`px-3 py-2 text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-medium cursor-pointer transition-colors ${
                          selectedModel === model 
                            ? 'bg-[var(--color-action-primary-subtle)] text-[var(--color-action-primary)]'
                            : 'text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)]'
                        }`}
                        onClick={() => {
                          setSelectedModel(model);
                          setShowModelSelect(false);
                        }}
                      >
                        {model}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* MCP Toggle */}
              <button 
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-medium transition-colors cursor-pointer ${
                  mcpEnabled 
                    ? 'bg-[var(--color-action-primary)] text-white' 
                    : 'bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)]'
                }`}
                onClick={() => setMcpEnabled(!mcpEnabled)}
              >
                <IconBolt size={12} stroke={1.5} />
                <span>MCP</span>
              </button>
            </div>

            {/* Send Button */}
            <button 
              className="w-6 h-6 flex items-center justify-center bg-[var(--color-action-primary)] text-white rounded-full hover:bg-[var(--color-action-primary-hover)] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => sendMessage(inputValue)}
              disabled={!inputValue.trim()}
            >
              <IconArrowUp size={16} stroke={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-[4000]"
            onClick={cancelDeleteSession}
          />
          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] bg-[var(--color-surface-default)] rounded-lg shadow-xl z-[4001] overflow-hidden">
            <div className="p-5">
              <h3 className="text-base font-semibold text-[var(--color-text-default)] mb-2">Delete chat?</h3>
              <p className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-muted)]">
                Are you sure you want to delete "{sessionToDelete?.title}"? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-[var(--color-border-default)] bg-[var(--color-surface-subtle)]">
              <button
                className="px-4 py-2 text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-medium text-[var(--color-text-default)] bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-md hover:bg-[var(--color-surface-subtle)] transition-colors cursor-pointer"
                onClick={cancelDeleteSession}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors cursor-pointer"
                onClick={confirmDeleteSession}
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ChatbotPanel;


