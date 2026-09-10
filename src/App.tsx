/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RadarProvider, useRadar } from './context/RadarContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { GuidedJourneyBar } from './components/common/GuidedJourneyBar';
import { DashboardView } from './components/views/DashboardView';
import { VerticalsView } from './components/views/VerticalsView';
import { VerticalDetailView } from './components/views/VerticalDetailView';
import { OrganizationsView } from './components/views/OrganizationsView';
import { OrganizationDetailView } from './components/views/OrganizationDetailView';
import { InterviewsView } from './components/views/InterviewsView';
import { PainsView } from './components/views/PainsView';
import { PainDetailView } from './components/views/PainDetailView';
import { OpportunitiesView } from './components/views/OpportunitiesView';
import { OpportunityDetailView } from './components/views/OpportunityDetailView';
import { QuestionsView } from './components/views/QuestionsView';
import { SourcesView } from './components/views/SourcesView';
import { CompetitorsView } from './components/views/CompetitorsView';
import { RankingView } from './components/views/RankingView';
import { CrossVerticalView } from './components/views/CrossVerticalView';
import { FontesEMercadoView } from './components/views/FontesEMercadoView';
import { SimulacaoBanner } from './components/common/SimulacaoBadge';
import { NewOrganizationModal } from './components/modals/NewOrganizationModal';
import { NewInterviewModal } from './components/modals/NewInterviewModal';
import { NewFindingModal } from './components/modals/NewFindingModal';
import { useNavigationAdapter } from './navigation/useNavigationAdapter';

export const RadarAppContent: React.FC = () => {
  // Sincronização bidirecional entre activeView e a URL do TanStack Router
  useNavigationAdapter();

  const { activeView } = useRadar();
  const [isNewOrgOpen, setIsNewOrgOpen] = useState(false);
  const [isNewInterviewOpen, setIsNewInterviewOpen] = useState(false);
  const [isNewFindingOpen, setIsNewFindingOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'verticais':
        return <VerticalsView />;
      case 'vertical-detail':
        return <VerticalDetailView />;
      case 'organizacoes':
        return <OrganizationsView onNewOrgClick={() => setIsNewOrgOpen(true)} />;
      case 'organizacao-detail':
        return (
          <OrganizationDetailView 
            onNewInterviewClick={() => setIsNewInterviewOpen(true)}
            onNewFindingClick={() => setIsNewFindingOpen(true)}
          />
        );
      case 'entrevistas':
        return <InterviewsView onNewInterviewClick={() => setIsNewInterviewOpen(true)} />;
      case 'dores':
        return <PainsView />;
      case 'dor-detail':
        return <PainDetailView />;
      case 'oportunidades':
        return <OpportunitiesView />;
      case 'oportunidade-detail':
        return <OpportunityDetailView />;
      case 'ranking':
        return <RankingView />;
      case 'perguntas':
        return <QuestionsView />;
      case 'fontes':
        return <FontesEMercadoView defaultTab="fontes" />;
      case 'concorrentes':
        return <FontesEMercadoView defaultTab="concorrentes" />;
      case 'fontes-concorrentes':
        return <FontesEMercadoView defaultTab="fontes" />;
      case 'cross-vertical':
        return <CrossVerticalView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Top Main Navigation Header */}
      <Header />

      {/* Persistent Simulation Disclaimer Banner (PRD Seções 67 e 77) */}
      <SimulacaoBanner />

      {/* Guided 18-step Journey Bar from the PRD */}
      <GuidedJourneyBar />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Dynamic Main Content Stage */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/60">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals */}
      <NewOrganizationModal isOpen={isNewOrgOpen} onClose={() => setIsNewOrgOpen(false)} />
      <NewInterviewModal isOpen={isNewInterviewOpen} onClose={() => setIsNewInterviewOpen(false)} />
      <NewFindingModal isOpen={isNewFindingOpen} onClose={() => setIsNewFindingOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <RadarProvider>
      <RadarAppContent />
    </RadarProvider>
  );
}
