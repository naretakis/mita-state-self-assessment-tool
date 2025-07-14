import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

const BranchIndicator = () => {
  const router = useRouter();
  const [branch, setBranch] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    const path = router.asPath;
    const basePath = router.basePath;
    const pathname = router.pathname;
    
    // Debug info
    setDebugInfo(`Path: ${path}, BasePath: ${basePath}, Pathname: ${pathname}`);
    
    // Check if we're in a subdirectory deployment
    if (basePath.includes('/dev') || path.startsWith('/dev')) {
      setBranch('dev');
    } else if (basePath.includes('/test') || path.startsWith('/test')) {
      setBranch('test');
    } else {
      setBranch('main');
    }
  }, [router.asPath, router.basePath, router.pathname]);

  // Always show for debugging
  // if (!branch || branch === 'main') {
  //   return null;
  // }

  const getBranchColor = () => {
    switch (branch) {
      case 'dev':
        return 'ds-u-color--error';
      case 'test':
        return 'ds-u-color--warn';
      default:
        return 'ds-u-color--primary';
    }
  };

  return (
    <div className="ds-c-alert ds-c-alert--lightweight ds-u-margin-bottom--2">
      <div className="ds-c-alert__body">
        <span className={`ds-text--small ${getBranchColor()}`}>
          <strong>Environment: {branch.toUpperCase()}</strong>
        </span>
        <br />
        <small style={{ fontSize: '10px', opacity: 0.7 }}>{debugInfo}</small>
      </div>
    </div>
  );
};

export default BranchIndicator;
