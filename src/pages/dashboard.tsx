import React from 'react';

import { UserDashboard } from '../components/dashboard/UserDashboard';
import Layout from '../components/layout/Layout';
import { StorageProvider } from '../components/storage/StorageProvider';

/**
 * Dashboard page with storage provider wrapper
 */
const Dashboard: React.FC = () => {
  return (
    <Layout title="Dashboard - MITA State Self-Assessment Tool" maxWidth="xl">
      <StorageProvider>
        <UserDashboard />
      </StorageProvider>
    </Layout>
  );
};

export default Dashboard;
