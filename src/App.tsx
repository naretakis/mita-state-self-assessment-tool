import { JSX } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import HistoryView from './pages/HistoryView';
import Results from './pages/Results';
import DomainResults from './pages/DomainResults';
import AreaResults from './pages/AreaResults';
import ImportExport from './pages/ImportExport';
import About from './pages/About';

function App(): JSX.Element {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assessment/:assessmentId" element={<Assessment />} />
        <Route path="/history/:historyId" element={<HistoryView />} />
        <Route path="/results" element={<Results />} />
        <Route path="/results/:domainId" element={<DomainResults />} />
        <Route path="/results/:domainId/:areaId" element={<AreaResults />} />
        <Route path="/import-export" element={<ImportExport />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Layout>
  );
}

export default App;
