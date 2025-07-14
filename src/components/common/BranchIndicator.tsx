import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

const BranchIndicator = () => {
  const router = useRouter();
  const [branch, setBranch] = useState<string>('');

  useEffect(() => {
    const path = router.asPath;
    if (path.includes('/dev/')) {
      setBranch('dev');
    } else if (path.includes('/test/')) {
      setBranch('test');
    } else {
      setBranch('main');
    }
  }, [router.asPath]);

  if (!branch || branch === 'main') {
    return null;
  }

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
      </div>
    </div>
  );
};

export default BranchIndicator;
