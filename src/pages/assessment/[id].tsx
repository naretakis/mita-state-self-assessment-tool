import React, { useEffect, useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import { GuidedAssessment } from '../../components/assessment';
import { OrbitGuidedAssessment } from '../../components/assessment/orbit';
import enhancedStorageService from '../../services/EnhancedStorageService';

/**
 * Assessment detail page - guided assessment walkthrough
 * Detects assessment format and renders appropriate component (ORBIT or legacy)
 */
const AssessmentDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isOrbitAssessment, setIsOrbitAssessment] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && typeof id === 'string') {
      detectAssessmentFormat(id);
    }
  }, [id]);

  const detectAssessmentFormat = async (assessmentId: string) => {
    try {
      setLoading(true);
      const assessment = await enhancedStorageService.loadAssessment(assessmentId);

      if (!assessment) {
        setIsOrbitAssessment(null);
        return;
      }

      // Check if it's an ORBIT assessment by looking for 'orbit' property in capabilities
      if ('capabilities' in assessment && Array.isArray(assessment.capabilities)) {
        const firstCap = assessment.capabilities[0];
        if (firstCap && 'orbit' in firstCap) {
          setIsOrbitAssessment(true);
        } else {
          setIsOrbitAssessment(false);
        }
      } else {
        setIsOrbitAssessment(false);
      }
    } catch (err) {
      console.error('Failed to detect assessment format:', err);
      setIsOrbitAssessment(false);
    } finally {
      setLoading(false);
    }
  };

  if (!id || typeof id !== 'string') {
    return (
      <>
        <Head>
          <title>Assessment - MITA State Self-Assessment Tool</title>
          <meta name="description" content="MITA assessment not found" />
        </Head>
        <div className="ds-base">
          <div className="ds-l-container ds-u-padding-y--4">
            <div className="ds-c-alert ds-c-alert--error">
              <div className="ds-c-alert__body">
                <h2 className="ds-c-alert__heading">Assessment Not Found</h2>
                <p className="ds-c-alert__text">The requested assessment could not be found.</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Head>
          <title>Assessment - MITA State Self-Assessment Tool</title>
          <meta name="description" content="Loading assessment" />
        </Head>
        <div className="ds-base">
          <div className="ds-l-container ds-u-padding-y--4">
            <div className="ds-u-text-align--center">
              <div className="ds-c-spinner" aria-valuetext="Loading assessment..." />
              <p className="ds-u-margin-top--2">Loading assessment...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Assessment - MITA State Self-Assessment Tool</title>
        <meta name="description" content="Complete your MITA assessment" />
      </Head>

      {isOrbitAssessment ? (
        <OrbitGuidedAssessment assessmentId={id} />
      ) : (
        <GuidedAssessment assessmentId={id} />
      )}
    </>
  );
};

export default AssessmentDetail;
