import { lazy } from 'react';
import { Route } from 'react-router-dom';

// Lazy load all agent pages for code splitting
const HomePage = lazy(() => import('@/pages/HomePage'));
const AgentPage = lazy(() => import('@/pages/AgentPage'));
const AgentDetailPage = lazy(() => import('@/pages/AgentDetailPage'));
const CreateAgentPage = lazy(() => import('@/pages/CreateAgentPage'));
const ChatPage = lazy(() => import('@/pages/ChatPage'));
const ChatConversationPage = lazy(() => import('@/pages/ChatConversationPage'));
const StoragePage = lazy(() => import('@/pages/StoragePage'));
const DatasourcePage = lazy(() => import('@/pages/DatasourcePage'));
const DatasourceCreatePage = lazy(() => import('@/pages/ai-platform/DatasourceCreatePage'));
const DatasourceEditPage = lazy(() => import('@/pages/ai-platform/DatasourceEditPage'));
const DatasourceConnectionsPage = lazy(
  () => import('@/pages/ai-platform/DatasourceConnectionsPage')
);
const MCPToolsPage = lazy(() => import('@/pages/MCPToolsPage'));
const MCPToolDetailPage = lazy(() => import('@/pages/MCPToolDetailPage'));
const CreateMCPTemplatePage = lazy(() => import('@/pages/CreateMCPTemplatePage'));

export const agentRoutes = (
  <>
    {/* Agent Routes */}
    <Route path="/agent" element={<HomePage />} />
    <Route path="/agent/list" element={<AgentPage />} />
    <Route path="/agent/list/:id" element={<AgentDetailPage />} />
    <Route path="/agent/create" element={<CreateAgentPage />} />
    <Route path="/chat" element={<ChatPage />} />
    <Route path="/chat/:id" element={<ChatConversationPage />} />
    <Route path="/agent/storage" element={<StoragePage />} />
    <Route path="/agent/datasource" element={<DatasourcePage />} />
    <Route path="/agent/datasource/connections" element={<DatasourceConnectionsPage />} />
    <Route path="/agent/datasource/create" element={<DatasourceCreatePage />} />
    <Route path="/agent/datasource/:id/edit" element={<DatasourceEditPage />} />
    <Route path="/storage" element={<StoragePage />} />
    <Route path="/mcp-tools" element={<MCPToolsPage />} />
    <Route path="/mcp-tools/create" element={<CreateMCPTemplatePage />} />
    <Route path="/mcp-tools/:id" element={<MCPToolDetailPage />} />
  </>
);
