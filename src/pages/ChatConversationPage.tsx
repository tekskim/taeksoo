import { useState } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  TopBar,
  TopBarAction,
  StatusIndicator,
  PageShell,
  TabBar,
  Button,
  Drawer,
  Input,
  Textarea,
  SectionCard,
  Tooltip,
  InlineMessage,
} from '@/design-system';
import { AIPlatformSidebar } from '@/components/AIPlatformSidebar';
import { ChatSidebar } from '@/components/ChatSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconSettings,
  IconArrowUp,
  IconChevronDown,
  IconChevronUp,
  IconCopy,
  IconCircleCheck,
  IconX,
  IconInfoCircle,
  IconStar,
  IconStarFilled,
  IconBrain,
  IconFileSearch,
  IconRefresh,
} from '@tabler/icons-react';

/* ----------------------------------------
   Thinking Process
   ---------------------------------------- */
interface ThinkingStep {
  type: 'thinking' | 'search' | 'respond';
  content: string;
  context?: string;
}

function ThinkingProcess({
  steps,
  defaultOpen = false,
}: {
  steps: ThinkingStep[];
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const badgeLabel = (type: ThinkingStep['type']) => {
    switch (type) {
      case 'search':
        return 'Search';
      case 'respond':
        return 'Respond';
      default:
        return null;
    }
  };

  return (
    <div className="border border-[var(--color-border-default)] rounded-[6px] w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-[8px]"
      >
        <div className="flex items-center gap-[4px]">
          <IconBrain size={16} className="text-[var(--color-text-default)] shrink-0" />
          <span className="text-[11px] leading-[20px] font-normal text-[var(--color-text-default)]">
            Thinking process
          </span>
        </div>
        {isOpen ? (
          <IconChevronUp size={16} className="text-[var(--color-text-default)]" />
        ) : (
          <IconChevronDown size={16} className="text-[var(--color-text-default)]" />
        )}
      </button>

      {isOpen && (
        <div className="flex flex-col gap-[12px] px-[8px] pt-0 pb-[16px]">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="border-l border-[var(--color-border-default)] flex flex-col gap-[8px] px-[12px]"
            >
              <p className="text-[12px] leading-[16px] font-medium text-[var(--color-text-default)]">
                {step.content}
              </p>
              {step.context && (
                <p className="text-[12px] leading-[16px] font-normal text-[var(--color-text-subtle)]">
                  {step.context}
                </p>
              )}
              {badgeLabel(step.type) && (
                <div className="flex items-center">
                  <span className="bg-[#f3f4f6] text-[var(--color-text-muted)] text-[11px] leading-[16px] font-medium px-[6px] py-[2px] rounded-[6px]">
                    {badgeLabel(step.type)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------
   RAG Search Block
   ---------------------------------------- */
function RAGSearchBlock({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-[var(--color-border-default)] rounded-[6px] w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-[8px]"
      >
        <div className="flex items-center gap-[4px]">
          <IconFileSearch size={16} className="text-[var(--color-text-default)] shrink-0" />
          <span className="text-[11px] leading-[20px] font-normal text-[var(--color-text-default)]">
            RAG search
          </span>
        </div>
        {isOpen ? (
          <IconChevronUp size={16} className="text-[var(--color-text-default)]" />
        ) : (
          <IconChevronDown size={16} className="text-[var(--color-text-default)]" />
        )}
      </button>

      {isOpen && (
        <div className="flex flex-col gap-[12px] px-[8px] pt-0 pb-[16px]">
          <div className="border border-[var(--color-border-default)] rounded-[4px] min-h-[70px] px-[10px] py-[8px] bg-[var(--color-surface-default)]">
            <div className="font-mono text-[12px] leading-[18px] text-[var(--color-text-default)]">
              <p className="mb-0">입력:</p>
              <p className="whitespace-pre-wrap break-all">
                {`{ "query": "체코어 문서 Czech language document", "agent_id": "0b93482e-06ef-49f3-bf6b-303e1f654f03", "datasource_id": null, "limit": 10, "score_threshold": 0.3 }`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------
   Sources Block
   ---------------------------------------- */
interface SourceItem {
  document: string;
  chunk: string;
}

function SourcesBlock({ sources }: { sources: SourceItem[] }) {
  return (
    <div className="border border-[var(--color-border-default)] rounded-[16px] pt-[8px] pb-[12px] px-[10px] flex flex-col gap-[8px]">
      <p className="text-[18px] leading-[28px] font-semibold text-[var(--color-text-default)]">
        📚 Sources
      </p>
      <ul className="list-disc pl-[21px] flex flex-col">
        {sources.map((source, idx) => (
          <li
            key={idx}
            className="text-[14px] leading-[20px] font-normal text-[var(--color-text-default)]"
          >
            {source.document} (Chunk: {source.chunk})
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ----------------------------------------
   Message Action Bar
   Figma: Icon/Copy (겹치는 사각형) + Icon/Request (원+체크), 24x24 each
   클릭 시 bg #e2e8f0으로 1초간 변경
   ---------------------------------------- */
function MessageActionBar() {
  const [copyActive, setCopyActive] = useState(false);
  const [requestActive, setRequestActive] = useState(false);

  const handleCopy = () => {
    setCopyActive(true);
    setTimeout(() => setCopyActive(false), 1000);
  };

  const handleRequest = () => {
    setRequestActive(true);
    setTimeout(() => setRequestActive(false), 1000);
  };

  return (
    <div className="flex items-center gap-[8px]">
      <Tooltip content="Copy">
        <button
          onClick={handleCopy}
          className={`flex items-center justify-center size-[24px] rounded-[4px] transition-colors ${
            copyActive ? 'bg-[#e2e8f0]' : 'hover:bg-[var(--color-surface-muted)]'
          }`}
          aria-label="Copy"
        >
          <IconCopy size={16} stroke={1} className="text-[var(--color-text-default)]" />
        </button>
      </Tooltip>
      <Tooltip content="Good response">
        <button
          onClick={handleRequest}
          className={`flex items-center justify-center size-[24px] rounded-[4px] transition-colors ${
            requestActive ? 'bg-[#e2e8f0]' : 'hover:bg-[var(--color-surface-muted)]'
          }`}
          aria-label="Good response"
        >
          <IconCircleCheck size={16} stroke={1} className="text-[var(--color-text-default)]" />
        </button>
      </Tooltip>
    </div>
  );
}

/* ----------------------------------------
   Error Warning Bar — TDS InlineMessage + Try again
   ---------------------------------------- */
function ErrorWarningBar({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex items-center justify-between w-full">
      <InlineMessage variant="error" className="flex-1 min-w-0">
        {'An error occurred while generating the response.'}
      </InlineMessage>
      <Button
        variant="outline"
        size="sm"
        leftIcon={<IconRefresh size={12} />}
        onClick={onRetry}
        className="shrink-0 ml-[8px]"
      >
        Try again
      </Button>
    </div>
  );
}

/* ----------------------------------------
   RAG Warning Banner — TDS InlineMessage + dismiss
   ---------------------------------------- */
function RAGWarningBanner({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center w-full">
      <InlineMessage variant="warning" className="flex-1 min-w-0">
        RAG search is unavailable because no data sources are currently connected.
      </InlineMessage>
      <button
        onClick={onClose}
        className="p-[2px] rounded-[4px] hover:bg-[var(--color-surface-muted)] transition-colors shrink-0 ml-[8px]"
        aria-label="Dismiss"
      >
        <IconX size={14} className="text-[var(--color-text-subtle)]" />
      </button>
    </div>
  );
}

/* ----------------------------------------
   Read-only Mode Bar
   Figma: Input 자리에 bg gray-200 rounded-16px p-16px
   텍스트: 16px/24px regular, color-text-subtle + help icon
   ---------------------------------------- */
function ReadOnlyBar() {
  return (
    <div className="px-[32px] pb-[32px] flex justify-center">
      <div className="w-[659px]">
        <div className="bg-[#e5e7eb] rounded-[16px] p-[16px] min-w-[200px] flex flex-col items-start w-full">
          <div className="flex items-center gap-[4px] w-full">
            <span className="text-[16px] leading-[24px] text-[var(--color-text-subtle)] whitespace-nowrap">
              You are currently in read-only mode
            </span>
            <Tooltip content="Chat will be limited until the agent becomes active. Activate the agent to continue chatting.">
              <IconInfoCircle size={14} className="text-[var(--color-text-subtle)]" />
            </Tooltip>
          </div>
        </div>
      </OverlayScrollbarsComponent>
    </div>
  );
}

/* ----------------------------------------
   Chat Detail Drawer
   ---------------------------------------- */
function ChatDetailDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [chatName, setChatName] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Chat detail"
      width={400}
      showCloseButton={true}
      closeOnBackdropClick={true}
      closeOnEscape={true}
      footer={
        <div className="flex gap-[8px] w-full">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={onClose} className="flex-1">
            Save
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-[20px]">
        <div className="border border-[var(--color-border-default)] rounded-[6px] p-[16px] flex items-start justify-between gap-[12px]">
          <div className="flex flex-col gap-[4px]">
            <p className="text-[13px] leading-[18px] font-medium text-[var(--color-text-default)]">
              Agent title 2
            </p>
            <p className="text-[12px] leading-[18px] font-medium text-[var(--color-text-subtle)]">
              Agent description
            </p>
          </div>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="shrink-0 p-[4px] rounded-[4px] hover:bg-[var(--color-surface-muted)] transition-colors"
          >
            {isFavorite ? (
              <IconStarFilled size={18} className="text-[var(--primitive-color-yellow400)]" />
            ) : (
              <IconStar size={18} stroke={1.5} className="text-[var(--color-text-disabled)]" />
            )}
          </button>
        </div>

        <SectionCard>
          <SectionCard.Header title="Model information" />
          <SectionCard.Content>
            <SectionCard.DataRow label="Provider" value="anthropic" />
            <SectionCard.DataRow label="Model Name" value="claude-sonnet-4-5-20250929" />
            <SectionCard.DataRow label="Temperature" value="0.7" />
            <SectionCard.DataRow label="Connected Data Sources" value="No connected data sources" />
            <SectionCard.DataRow
              label="Connected MCP Servers"
              value="Google Calender, Weather MCP"
            />
          </SectionCard.Content>
        </SectionCard>

        <div className="border border-[var(--color-border-default)] rounded-[6px] p-[16px] flex flex-col gap-[12px]">
          <p className="text-[13px] leading-[18px] font-medium text-[var(--color-text-default)]">
            System Prompt
          </p>
          <div className="border-t border-[var(--color-border-subtle)] pt-[12px]">
            <p className="text-[12px] leading-[18px] font-medium text-[var(--color-text-default)]">
              You are a helpful assistant.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-[8px]">
          <p className="text-[13px] leading-[18px] font-medium text-[var(--color-text-default)]">
            Chat name
          </p>
          <Input
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
            placeholder="e.g., Project planning meeting, code review, etc."
            fullWidth
          />
        </div>

        <div className="flex flex-col gap-[8px]">
          <p className="text-[13px] leading-[18px] font-medium text-[var(--color-text-default)]">
            Additional instructions
          </p>
          <Textarea
            value={additionalInstructions}
            onChange={(e) => setAdditionalInstructions(e.target.value)}
            placeholder="Enter any specific instructions you would like to provide to the agent for this chat session."
            rows={3}
            fullWidth
          />
          <p className="text-[12px] leading-[18px] text-[var(--color-text-subtle)]">
            These instructions will be applied in addition to the agent&apos;s default system
            prompt.
          </p>
        </div>
      </div>
    </Drawer>
  );
}

/* ----------------------------------------
   Markdown Renderer
   ---------------------------------------- */
function MarkdownContent({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      elements.push(
        <p key={i} className="text-[18px] leading-[28px] font-semibold mt-[16px]">
          {line.replace('## ', '')}
        </p>
      );
      i++;
      continue;
    }
    if (line.startsWith('### ')) {
      elements.push(
        <p key={i} className="text-[16px] leading-[24px] font-semibold mt-[8px]">
          {line.replace('### ', '')}
        </p>
      );
      i++;
      continue;
    }
    if (line.startsWith('- ')) {
      const items: { text: string; key: number }[] = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push({ text: lines[i].replace('- ', ''), key: i });
        i++;
      }
      elements.push(
        <ul key={`ul-${items[0].key}`} className="list-disc ml-[21px] flex flex-col">
          {items.map((item) => (
            <li key={item.key} className="text-[14px] leading-[20px]">
              {item.text}
            </li>
          ))}
        </ul>
      );
      continue;
    }
    if (line.match(/^\d+\.\s/)) {
      const items: { text: string; key: number }[] = [];
      while (i < lines.length && lines[i].match(/^\d+\.\s/)) {
        items.push({ text: lines[i].replace(/^\d+\.\s/, ''), key: i });
        i++;
      }
      elements.push(
        <ol key={`ol-${items[0].key}`} className="list-decimal ml-[21px] flex flex-col">
          {items.map((item) => (
            <li key={item.key} className="text-[14px] leading-[20px]">
              {item.text}
            </li>
          ))}
        </ol>
      );
      continue;
    }
    if (line.trim() === '') {
      elements.push(<div key={i} className="h-0" />);
      i++;
      continue;
    }
    const rendered = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    elements.push(
      <p
        key={i}
        className="text-[14px] leading-[20px]"
        dangerouslySetInnerHTML={{ __html: rendered }}
      />
    );
    i++;
  }

  return <div className="flex flex-col gap-[8px] text-[var(--color-text-default)]">{elements}</div>;
}

/* ----------------------------------------
   Mock Data per Case
   ---------------------------------------- */
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  thinkingSteps?: ThinkingStep[];
  sources?: SourceItem[];
  ragSearch?: boolean;
  hasError?: boolean;
}

const thinkingSteps: ThinkingStep[] = [
  {
    type: 'thinking',
    content:
      'The user requested a 10-line summary of a "Czech document." In a previous conversation, there was content about Document 0000012.pdf, but it is not clear whether that file is a Czech document.',
    context:
      'The document discussed earlier was about seed packaging, and there was no mention of any Czech document. We should perform a RAG search to find the Czech document.',
  },
  {
    type: 'search',
    content: 'Searching for Czech language documents in the connected data sources.',
    context:
      'Found Document 0000014.pdf — a Czech language document about agricultural regulations.',
  },
  {
    type: 'respond',
    content: 'Generating a summary based on the retrieved Czech document content.',
  },
];

const sources: SourceItem[] = [
  { document: 'Document 0000014.pdf', chunk: 'cdf57921-e4ab-4836-9774-65d5434810b2' },
  { document: 'Document 0000014.pdf', chunk: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
  { document: 'Document 0000014.pdf', chunk: '11223344-5566-7788-99aa-bbccddeeff00' },
  { document: 'Document 0000014.pdf', chunk: 'deadbeef-cafe-babe-face-123456789abc' },
];

const assistantContent = `👋 Hello! Here is my **system information.**

## 🤖 AI Assistant Information

### LLM Model
- Claude 3.5 Sonnet (Anthropic)
- Latest conversational AI model
- 200,000-token context window

## 🔗 MCP (Model Context Protocol) Integration

### Connected Data Sources
- Claude 3.5 Sonnet (Anthropic)
- Latest conversational AI model
- 200,000-token context window

## ⚙️ System Workflow

1. User submits a question
2. System performs document retrieval (based on relevance score)
3. Combines search results with conversation context
4. Generates an answer (minimizing hallucinations)

## 💡 In short

I am a Claude 3.5 Sonnet-based AI assistant, connected through MCP to various documents, and I provide answers grounded in real search results.`;

type ChatCaseId = 'empty' | 'basic' | 'readonly' | 'no-datasource' | 'full';

function getCaseMessages(caseId: ChatCaseId): ChatMessage[] {
  switch (caseId) {
    case 'empty':
      return [];
    case 'basic':
      return [
        { id: '1', role: 'user', content: 'AI 플랫폼팀에 대해서 간략히 설명해줘' },
        { id: '2', role: 'assistant', content: assistantContent, sources },
      ];
    case 'readonly':
      return [
        { id: '1', role: 'user', content: 'AI 플랫폼팀에 대해서 간략히 설명해줘' },
        { id: '2', role: 'assistant', content: assistantContent, sources },
      ];
    case 'no-datasource':
      return [
        { id: '1', role: 'user', content: 'AI 플랫폼팀에 대해서 간략히 설명해줘' },
        { id: '2', role: 'assistant', content: assistantContent, sources },
      ];
    case 'full':
      return [
        { id: '1', role: 'user', content: 'AI 플랫폼팀에 대해서 간략히 설명해줘' },
        {
          id: '2',
          role: 'assistant',
          content: assistantContent,
          thinkingSteps,
          ragSearch: true,
          sources,
          hasError: true,
        },
      ];
    default:
      return [];
  }
}

function isChatCase(id: string | undefined): id is ChatCaseId {
  return (
    id === 'empty' || id === 'basic' || id === 'readonly' || id === 'no-datasource' || id === 'full'
  );
}

/* ----------------------------------------
   User / Assistant Message
   ---------------------------------------- */
function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div className="bg-[#f1f5f9] text-[14px] leading-[20px] text-[var(--color-text-default)] px-[12px] py-[8px] rounded-[6px]">
        {content}
      </div>
    </div>
  );
}

function AssistantMessage({ message, onRetry }: { message: ChatMessage; onRetry: () => void }) {
  return (
    <div className="flex flex-col gap-[20px] w-full">
      {message.thinkingSteps && message.thinkingSteps.length > 0 && (
        <ThinkingProcess steps={message.thinkingSteps} />
      )}

      {message.ragSearch && <RAGSearchBlock />}

      <MarkdownContent content={message.content} />

      {message.sources && message.sources.length > 0 && <SourcesBlock sources={message.sources} />}

      {message.hasError && <ErrorWarningBar onRetry={onRetry} />}

      <MessageActionBar />
    </div>
  );
}

/* ----------------------------------------
   Chat Input Area
   ---------------------------------------- */
function ChatInput({
  message,
  setMessage,
  onSend,
}: {
  message: string;
  setMessage: (v: string) => void;
  onSend: () => void;
}) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="border border-[var(--color-border-strong)] rounded-[16px] p-[16px] h-[100px] flex flex-col justify-between">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask me anything"
        className="w-full resize-none bg-transparent text-[16px] leading-[24px] text-[var(--color-text-default)] placeholder:text-[var(--color-text-subtle)] focus:outline-none flex-1"
        rows={2}
      />
      <div className="flex items-center justify-end">
        <button
          onClick={onSend}
          disabled={!message.trim()}
          className="bg-[var(--color-action-primary)] hover:bg-[var(--color-action-primary-hover)] disabled:bg-[var(--color-border-default)] text-white rounded-full p-[4px] transition-colors"
          aria-label="Send message"
        >
          <IconArrowUp size={16} stroke={2} />
        </button>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Main Page
   ---------------------------------------- */
export function ChatConversationPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const [message, setMessage] = useState('');
  const [showRagWarning, setShowRagWarning] = useState(true);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  const agentName = location.state?.agentName || 'Agent name';

  const caseId: ChatCaseId | null = isChatCase(id) ? id : null;
  const isReadOnly = caseId === 'readonly';
  const showNoDatasourceWarning = caseId === 'no-datasource';
  const messages = caseId ? getCaseMessages(caseId) : [];
  const hasMessages = messages.length > 0;

  const handleSendMessage = () => {
    if (!message.trim() || isReadOnly) return;
    setMessage('');
  };

  return (
    <PageShell
      sidebar={
        <AIPlatformSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
          showAddButton={true}
          showWindowControls={true}
          onWindowClose={() => navigate('/')}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(true)}
          left={
            <div className="flex items-center gap-[4px] bg-[var(--color-surface-default)] rounded-[6px] px-[8px] h-[28px]">
              <StatusIndicator layout="icon-only" status="active" />
              <span className="text-[12px] leading-[16px] font-medium text-[var(--color-text-default)]">
                {agentName}
              </span>
            </div>
          }
          actions={
            <>
              <TopBarAction
                icon={<IconSettings size={16} stroke={1.5} />}
                aria-label="Settings"
                onClick={() => setIsDetailDrawerOpen(true)}
              />
              <TopBarAction
                icon={<IconBell size={16} stroke={1.5} />}
                aria-label="Notifications"
                badge={true}
              />
            </>
          }
        />
      }
      contentClassName="p-0"
    >
      <div className="flex flex-1 min-h-0 h-full">
        <ChatSidebar />

        <div className="flex-1 flex flex-col h-full bg-[var(--color-surface-default)]">
          {hasMessages ? (
            <>
              <div className="flex-1 overflow-y-auto flex justify-center px-[32px] pt-[40px]">
                <div className="w-[659px] flex flex-col gap-[24px]">
                  {messages.map((msg) =>
                    msg.role === 'user' ? (
                      <UserMessage key={msg.id} content={msg.content} />
                    ) : (
                      <AssistantMessage key={msg.id} message={msg} onRetry={() => {}} />
                    )
                  )}
                  <div className="h-[60px] shrink-0" />
                </div>
              </div>

              {showNoDatasourceWarning && showRagWarning && (
                <div className="px-[32px] pb-[8px] flex justify-center">
                  <div className="w-[659px]">
                    <RAGWarningBanner onClose={() => setShowRagWarning(false)} />
                  </div>
                </div>
              )}

              {isReadOnly ? (
                <ReadOnlyBar />
              ) : (
                <div className="px-[32px] pb-[32px] flex justify-center">
                  <div className="w-[659px]">
                    <ChatInput
                      message={message}
                      setMessage={setMessage}
                      onSend={handleSendMessage}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center px-[32px] pb-[32px]">
              <div className="flex flex-col items-center gap-[16px] w-[659px]">
                <h2 className="text-[18px] leading-[28px] font-semibold text-[var(--color-text-default)]">
                  Tell me what you need
                </h2>
                <div className="w-full">
                  <ChatInput message={message} setMessage={setMessage} onSend={handleSendMessage} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ChatDetailDrawer isOpen={isDetailDrawerOpen} onClose={() => setIsDetailDrawerOpen(false)} />
    </PageShell>
  );
}

export default ChatConversationPage;
