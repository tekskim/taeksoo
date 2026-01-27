import { lazy } from 'react';
import { Route } from 'react-router-dom';

// Lazy load all agent pages for code splitting
const HomePage = lazy(() => import('@/pages/HomePage'));
const AgentPage = lazy(() => import('@/pages/AgentPage'));
const CreateAgentPage = lazy(() => import('@/pages/CreateAgentPage'));
const ChatPage = lazy(() => import('@/pages/ChatPage'));
const StoragePage = lazy(() => import('@/pages/StoragePage'));
const MCPToolsPage = lazy(() => import('@/pages/MCPToolsPage'));

export const agentRoutes = (
  <>
    {/* Agent Routes */}
    <Route path="/agent" element={<HomePage />} />
    <Route path="/agent/list" element={<AgentPage />} />
    <Route path="/agent/create" element={<CreateAgentPage />} />
    <Route path="/chat" element={<ChatPage />} />
    <Route path="/storage" element={<StoragePage />} />
    <Route path="/mcp-tools" element={<MCPToolsPage />} />
  </>
);
