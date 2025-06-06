'use client';

import { useContent } from './ContentProvider';

interface CapabilityDetailProps {
  capabilityId: string;
}

/**
 * Component for displaying detailed information about a capability
 */
export function CapabilityDetail({ capabilityId }: CapabilityDetailProps) {
  const { getCapability, isLoading, error } = useContent();

  if (isLoading) {
    return <div>Loading capability details...</div>;
  }

  if (error) {
    return <div>Error loading capability: {error.message}</div>;
  }

  const capability = getCapability(capabilityId);

  if (!capability) {
    return <div>Capability not found: {capabilityId}</div>;
  }

  return (
    <div className="capability-detail">
      <h2>{capability.name}</h2>
      <div className="capability-meta">
        <span>Domain: {capability.domainName}</span>
        <span>Version: {capability.version}</span>
        <span>Last Updated: {capability.lastUpdated}</span>
      </div>

      <div className="capability-description">
        <h3>Description</h3>
        <p>{capability.description}</p>
      </div>

      <div className="capability-dimensions">
        <h3>Dimensions</h3>

        <div className="dimension">
          <h4>Outcome</h4>
          <p>{capability.dimensions.outcome.description}</p>
          <h5>Assessment Questions</h5>
          <ul>
            {capability.dimensions.outcome.assessmentQuestions.map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ul>
        </div>

        <div className="dimension">
          <h4>Role</h4>
          <p>{capability.dimensions.role.description}</p>
          <h5>Assessment Questions</h5>
          <ul>
            {capability.dimensions.role.assessmentQuestions.map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ul>
        </div>

        <div className="dimension">
          <h4>Business Process</h4>
          <p>{capability.dimensions.businessProcess.description}</p>
          <h5>Assessment Questions</h5>
          <ul>
            {capability.dimensions.businessProcess.assessmentQuestions.map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ul>
        </div>

        <div className="dimension">
          <h4>Information</h4>
          <p>{capability.dimensions.information.description}</p>
          <h5>Assessment Questions</h5>
          <ul>
            {capability.dimensions.information.assessmentQuestions.map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ul>
        </div>

        <div className="dimension">
          <h4>Technology</h4>
          <p>{capability.dimensions.technology.description}</p>
          <h5>Assessment Questions</h5>
          <ul>
            {capability.dimensions.technology.assessmentQuestions.map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CapabilityDetail;
