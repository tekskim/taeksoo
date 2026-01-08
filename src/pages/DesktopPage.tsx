import { useState, useRef, useEffect } from 'react';
import SettingsPage from './SettingsPage';
import { ChatbotPanel } from '@/components/ChatbotPanel';
import { 
  IconAdjustments,
  IconUserCircle,
  IconBell,
  IconLayoutDashboard,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { useDarkMode } from '@/hooks/useDarkMode';

// Desktop Icon Images (Figma exports)
import imgIam from '@/assets/desktop/iam.png';
import imgCompute from '@/assets/desktop/compute.png';
import imgStorage from '@/assets/desktop/storage.png';
import imgContainer from '@/assets/desktop/container.png';
import imgAi from '@/assets/desktop/ai.png';
import imgAgent from '@/assets/desktop/agent.png';
import imgSettings from '@/assets/desktop/settings.png';
import imgStorageAdmin from '@/assets/desktop/storage_admin.png';
import imgComputeAdmin from '@/assets/desktop/compute_admin.png';
import imgCloud from '@/assets/desktop/cloud.png';
import imgChatbot from '@/assets/desktop/chatbot.png';
import imgSymbol from '@/assets/desktop/symbol.svg';

/* ----------------------------------------
   Desktop Icon Component
   ---------------------------------------- */

interface DesktopIconProps {
  icon: string;
  label: string;
  onClick?: () => void;
}

function DesktopIcon({ icon, label, onClick }: DesktopIconProps) {
  return (
    <button
      type="button"
      className="flex flex-col items-center gap-2 w-16 cursor-pointer transition-transform hover:-translate-y-0.5 bg-transparent border-none p-0"
      onClick={onClick}
      aria-label={label}
    >
      <div className="w-16 h-16 flex items-center justify-center">
        <img 
          src={icon} 
          alt={label} 
          className="w-16 h-16 object-cover object-center"
        />
      </div>
      <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-medium text-white text-center whitespace-nowrap font-[Mona_Sans,sans-serif]">
        {label}
      </span>
    </button>
  );
}

/* ----------------------------------------
   Admin Center Icon Component (Multi-icon)
   ---------------------------------------- */

interface AdminCenterIconProps {
  onClick?: () => void;
  iconRef?: React.RefObject<HTMLButtonElement>;
}

function AdminCenterIcon({ onClick, iconRef }: AdminCenterIconProps) {
  return (
    <button
      ref={iconRef}
      type="button"
      className="flex flex-col items-center gap-2 w-16 cursor-pointer transition-transform hover:-translate-y-0.5 bg-transparent border-none p-0"
      onClick={onClick}
      aria-label="Admin Center"
    >
      <div className="bg-white/10 rounded-2xl p-2 flex flex-col gap-1">
        <div className="flex gap-1 items-center">
          <img src={imgStorageAdmin} alt="" className="w-[22px] h-[22px] object-cover" />
          <img src={imgComputeAdmin} alt="" className="w-[22px] h-[22px] object-cover" />
        </div>
        <div className="flex items-center">
          <img src={imgCloud} alt="" className="w-[22px] h-[22px] object-cover" />
        </div>
      </div>
      <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-medium text-white text-center whitespace-nowrap font-[Mona_Sans,sans-serif]">
        Admin Center
      </span>
    </button>
  );
}

/* ----------------------------------------
   Top Bar Component (Figma Style)
   ---------------------------------------- */

interface TopBarProps {
  onChatbotToggle: () => void;
}

function DesktopTopBar({ onChatbotToggle }: TopBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 h-14 bg-white flex items-center justify-between px-4 z-[1000] shadow-[2px_4px_4px_0px_rgba(0,0,0,0.11)]">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Domain Selector - Figma style */}
        <div className="flex items-center gap-1.5 bg-[#ddddda] px-2.5 py-0.5 rounded-lg">
          <img src={imgSymbol} alt="" className="w-4 h-4" />
          <span className="text-lg font-semibold text-black font-[Mona_Sans,sans-serif] leading-7">Domain A</span>
        </div>
        
        {/* Separator */}
        <div className="px-1.5 h-8 flex items-center">
          <div className="w-px h-4 bg-[rgba(60,60,67,0.29)]" />
        </div>
        
        {/* Quick Access Icons - Use Figma images */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 cursor-pointer transition-opacity hover:opacity-70">
            <img src={imgStorage} alt="Storage" className="w-full h-full object-cover" />
          </div>
          <div className="w-8 h-8 cursor-pointer transition-opacity hover:opacity-70">
            <img src={imgContainer} alt="Container" className="w-full h-full object-cover" />
          </div>
          <div className="w-8 h-8 cursor-pointer transition-opacity hover:opacity-70">
            <img src={imgAi} alt="AI Platform" className="w-full h-full object-cover" />
          </div>
          <div className="w-8 h-8 cursor-pointer transition-opacity hover:opacity-70">
            <img src={imgAgent} alt="Agent Ops" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 h-8">
        {/* Separator */}
        <div className="px-1.5 h-full flex items-center">
          <div className="w-px h-4 bg-[rgba(60,60,67,0.29)]" />
        </div>
        
        {/* Right Icons */}
        <div className="flex items-center gap-3">
          <button className="w-6 h-6 flex items-center justify-center text-black/60 hover:text-black cursor-pointer transition-colors">
            <IconAdjustments size={24} stroke={1.5} />
          </button>
          <button className="w-6 h-6 flex items-center justify-center text-black/60 hover:text-black cursor-pointer transition-colors">
            <IconUserCircle size={24} stroke={1.5} />
          </button>
          <button className="w-6 h-6 flex items-center justify-center text-black/60 hover:text-black cursor-pointer transition-colors">
            <IconBell size={24} stroke={1.5} />
          </button>
        </div>

        {/* Separator */}
        <div className="px-1.5 h-full flex items-center">
          <div className="w-px h-4 bg-[rgba(60,60,67,0.29)]" />
        </div>
        
        {/* AI Chatbot Toggle - rightmost position */}
        <button 
          className="w-[35px] h-[35px] cursor-pointer transition-opacity hover:opacity-70"
          onClick={onChatbotToggle}
          title="AI Chatbot"
        >
          <img src={imgChatbot} alt="AI Chatbot" className="w-full h-full object-cover" />
        </button>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Admin Center Popup Panel (Figma Style)
   ---------------------------------------- */

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement>;
}

function AdminCenterPanel({ isOpen, onClose, anchorRef }: AdminPanelProps) {
  if (!isOpen) return null;
  
  // Calculate position based on anchor element
  const anchorRect = anchorRef.current?.getBoundingClientRect();
  const panelWidth = 412; // Approximate panel width (3 icons * 64px + 2 gaps * 50px + padding * 2)
  
  // Position panel below the icon, centered horizontally
  const top = anchorRect ? anchorRect.bottom + 12 : 222;
  const left = anchorRect ? anchorRect.left + (anchorRect.width / 2) - (panelWidth / 2) : 0;
  
  return (
    <>
      {/* Click outside to close */}
      <div 
        className="fixed inset-0 z-[500]" 
        onClick={onClose}
      />
      {/* Panel - positioned below Admin Center icon */}
      <div 
        className="fixed bg-white/10 rounded-2xl px-10 py-[22px] flex gap-[50px] items-center z-[501]"
        style={{ top: `${top}px`, left: `${left}px` }}
      >
        <div className="flex flex-col items-center gap-2 w-16">
          <img src={imgStorageAdmin} alt="Storage Admin" className="w-16 h-16 object-cover" />
          <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-medium text-white text-center font-[Mona_Sans,sans-serif]">Storage Admin</span>
        </div>
        <div className="flex flex-col items-center gap-2 w-16">
          <img src={imgComputeAdmin} alt="Compute Admin" className="w-16 h-16 object-cover" />
          <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-medium text-white text-center font-[Mona_Sans,sans-serif]">Compute Admin</span>
        </div>
        <div className="flex flex-col items-center gap-2 w-16">
          <img src={imgCloud} alt="Cloud Builder" className="w-16 h-16 object-cover" />
          <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-medium text-white text-center font-[Mona_Sans,sans-serif]">Cloud Builder</span>
        </div>
      </div>
    </>
  );
}

/* ----------------------------------------
   Desktop Page Component
   ---------------------------------------- */

export function DesktopPage() {
  const [showSettings, setShowSettings] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showAdminCenter, setShowAdminCenter] = useState(false);
  const adminCenterIconRef = useRef<HTMLButtonElement>(null);
  const { setTheme } = useDarkMode();

  // Desktop UI는 항상 다크 모드로 표시되어야 함
  useEffect(() => {
    // 이전 테마를 저장하고 다크 모드로 전환
    const previousTheme = localStorage.getItem('tds-theme');
    setTheme('dark');

    // 언마운트 시 이전 테마로 복원
    return () => {
      if (previousTheme === 'light' || previousTheme === 'system') {
        setTheme(previousTheme as 'light' | 'dark' | 'system');
      }
    };
  }, [setTheme]);

  return (
    <div className="fixed inset-0 bg-[#353535] overflow-hidden">
      {/* Top Bar */}
      <DesktopTopBar onChatbotToggle={() => setShowChatbot(!showChatbot)} />

      {/* Desktop Icons Row - Positioned like Figma */}
      <div className="absolute top-[110px] left-[44px] flex flex-row items-start gap-[72px]">
        <DesktopIcon 
          icon={imgIam}
          label="IAM"
        />
        <DesktopIcon 
          icon={imgCompute}
          label="Compute"
        />
        <DesktopIcon 
          icon={imgStorage}
          label="Storage"
        />
        <DesktopIcon 
          icon={imgContainer}
          label="Container"
        />
        <DesktopIcon 
          icon={imgAi}
          label="AI Platform"
        />
        <DesktopIcon 
          icon={imgAgent}
          label="Agent Ops"
        />
        <DesktopIcon 
          icon={imgSettings}
          label="Settings"
          onClick={() => setShowSettings(true)}
        />
        <AdminCenterIcon 
          iconRef={adminCenterIconRef}
          onClick={() => setShowAdminCenter(!showAdminCenter)}
        />
      </div>

      {/* Admin Center Panel */}
      <AdminCenterPanel 
        isOpen={showAdminCenter}
        onClose={() => setShowAdminCenter(false)}
        anchorRef={adminCenterIconRef}
      />

      {/* Settings Window */}
      <SettingsPage 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />

      {/* Chatbot Panel */}
      <ChatbotPanel 
        isOpen={showChatbot} 
        onClose={() => setShowChatbot(false)} 
      />

      {/* Main Page Navigation Button - Bottom Left */}
      <Link 
        to="/"
        className="absolute bottom-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium transition-all hover:-translate-y-0.5"
      >
        <IconLayoutDashboard size={18} stroke={1.5} />
        <span>Go to main page</span>
      </Link>
    </div>
  );
}

export default DesktopPage;
