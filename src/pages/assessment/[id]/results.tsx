import { useRouter } from 'next/router';

import { AssessmentResults } from '../../../components/assessment';
import Layout from '../../../components/layout/Layout';

/**
 * Assessment Results Page
 */
export default function AssessmentResultsPage() {
  const router = useRouter();
  const { id } = router.query;

  if (!id || typeof id !== 'string') {
    return (
      <Layout>
        <div className="ds-c-alert ds-c-alert--error">
          <div className="ds-c-alert__body">
            <h3 className="ds-c-alert__heading">Invalid Assessment ID</h3>
            <p className="ds-c-alert__text">The assessment ID is missing or invalid.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <AssessmentResults assessmentId={id} />
    </Layout>
  );
}
