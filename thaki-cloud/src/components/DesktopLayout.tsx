import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatbotIcon from '@/assets/desktop/chatbot.png';
import SettingsIcon from '@/assets/desktop/settings.png';
import ComputeIcon from '@/assets/desktop/compute.png';
import ContainerIcon from '@/assets/desktop/container.png';
import StorageIcon from '@/assets/desktop/storage.png';
import IAMIcon from '@/assets/desktop/iam.png';
import AIPlatformIcon from '@/assets/desktop/ai.png';
import AgentIcon from '@/assets/desktop/agent.png';
import CloudBuilderIcon from '@/assets/desktop/cloud.png';
import ComputeAdminIcon from '@/assets/desktop/compute_admin.png';
import StorageAdminIcon from '@/assets/desktop/storage_admin.png';
import SymbolIcon from '@/assets/desktop/symbol.svg';
import { ChatbotPanel } from './ChatbotPanel';
import SettingsPage from '@/pages/SettingsPage';

/* ----------------------------------------
   Desktop Layout Component
   ---------------------------------------- */

interface DesktopLayoutProps {
  children?: React.ReactNode;
}

export function DesktopLayout({ children }: DesktopLayoutProps) {
  const navigate = useNavigate();
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const desktopApps = [
    { id: 'iam', label: 'IAM', icon: IAMIcon, path: '/iam' },
    { id: 'compute', label: 'Compute', icon: ComputeIcon, path: '/compute' },
    { id: 'storage', label: 'Storage', icon: StorageIcon, path: '/storage' },
    { id: 'container', label: 'Container', icon: ContainerIcon, path: '/container' },
    { id: 'ai-platform', label: 'AI Platform', icon: AIPlatformIcon, path: '/ai-platform' },
    { id: 'agent-ops', label: 'Agent Ops', icon: AgentIcon, path: '/agent-ops' },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, path: '/settings', onClick: () => setSettingsOpen(true) },
  ];

  return (
    <div className="fixed inset-0 bg-[#353535] overflow-hidden">
      {/* Desktop Background */}
      <div className="absolute inset-0 bg-[#353535]">
        {/* Top Bar */}
        <div className="fixed top-0 left-0 right-0 h-12 bg-white flex items-center justify-between px-4 z-50 shadow-[2px_4px_4px_0px_rgba(0,0,0,0.11)]">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            {/* Domain Selector */}
            <div className="flex items-center gap-1.5 bg-[#ddddda] px-2.5 py-0.5 rounded-lg">
              <img src={SymbolIcon} alt="Symbol" className="w-4 h-4" />
              <span className="text-lg font-semibold text-[#0f172a]">Domain A</span>
            </div>
            
            <div className="w-px h-4 bg-[rgba(60,60,67,0.29)]" />
            
            {/* Service Icons */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center">
                <img src={StorageIcon} alt="Storage" className="w-full h-full object-cover" />
              </div>
              <div className="w-8 h-8 flex items-center justify-center">
                <img src={ContainerIcon} alt="Container" className="w-full h-full object-cover" />
              </div>
              <div className="w-8 h-8 flex items-center justify-center">
                <img src={AIPlatformIcon} alt="AI" className="w-full h-full object-cover" />
              </div>
              <div className="w-8 h-8 flex items-center justify-center">
                <img src={AgentIcon} alt="Agent" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3 h-8">
            {/* Action Icons */}
            <div className="flex items-center gap-3">
              {/* Adjustments, User, Bell icons would go here */}
            </div>
            
            <div className="w-px h-4 bg-[rgba(60,60,67,0.29)]" />
            
            {/* Chatbot Toggle */}
            <button
              onClick={() => setChatbotOpen(!chatbotOpen)}
              className="w-[34.314px] h-[35px] flex items-center justify-center cursor-pointer transition-opacity hover:opacity-70"
              title="AI Chatbot"
            >
              <img src={ChatbotIcon} alt="AI Chatbot" className="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        {/* Desktop Icons */}
        <div className="fixed top-[110px] left-11 flex flex-row items-center gap-[72px]">
          {desktopApps.map((app) => (
            <div
              key={app.id}
              className="flex flex-col items-center gap-2 w-16 cursor-pointer transition-transform hover:-translate-y-0.5"
              onClick={() => {
                if (app.onClick) {
                  app.onClick();
                } else {
                  navigate(app.path);
                }
              }}
            >
              <div className="w-16 h-16 flex items-center justify-center">
                <img src={app.icon} alt={app.label} className="w-full h-full object-cover" />
              </div>
              <span className="text-sm font-semibold text-white text-center whitespace-pre-wrap min-w-full">
                {app.label}
              </span>
            </div>
          ))}
          
          {/* Admin Center Icon */}
          <div className="flex flex-col items-center gap-2 w-16">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex flex-col gap-1 items-start justify-center p-2">
              <div className="flex gap-1 items-center">
                <img src={StorageAdminIcon} alt="Storage Admin" className="w-[22px] h-[22px] object-cover" />
                <img src={ComputeAdminIcon} alt="Compute Admin" className="w-[22px] h-[22px] object-cover" />
              </div>
              <div className="flex gap-1 items-center">
                <img src={CloudBuilderIcon} alt="Cloud Builder" className="w-[22px] h-[22px] object-cover" />
              </div>
            </div>
            <span className="text-sm font-semibold text-white text-center whitespace-pre-wrap min-w-full">
              Admin Center
            </span>
          </div>
        </div>
      </div>

      {/* Chatbot Panel */}
      <ChatbotPanel isOpen={chatbotOpen} onClose={() => setChatbotOpen(false)} />

      {/* Settings Window */}
      <SettingsPage isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* Main Content Area for Apps */}
      {!settingsOpen && children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
}

