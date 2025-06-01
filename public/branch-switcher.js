/**
 * Branch Switcher Component
 * 
 * This script creates a branch switcher component that can be included in any page
 * to allow users to navigate between different branch deployments.
 */

(function() {
  // Configuration
  const repoName = 'mita-state-self-assessment-tool';
  
  // Create and inject styles
  const style = document.createElement('style');
  style.textContent = `
    .branch-switcher {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.15);
      z-index: 1000;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 14px;
      transition: transform 0.3s ease;
    }
    .branch-switcher.collapsed {
      transform: translateY(calc(100% - 40px));
    }
    .branch-switcher-header {
      padding: 8px 12px;
      background: #e9ecef;
      border-bottom: 1px solid #dee2e6;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .branch-switcher-title {
      font-weight: 600;
      margin: 0;
    }
    .branch-switcher-toggle {
      border: none;
      background: none;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .branch-switcher-body {
      padding: 12px;
      max-height: 300px;
      overflow-y: auto;
    }
    .branch-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .branch-item {
      margin-bottom: 8px;
    }
    .branch-item:last-child {
      margin-bottom: 0;
    }
    .branch-link {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: #0073bb;
    }
    .branch-link:hover {
      text-decoration: underline;
    }
    .branch-link.current {
      font-weight: bold;
    }
    .branch-date {
      font-size: 0.8em;
      color: #6c757d;
      margin-left: 8px;
    }
  `;
  document.head.appendChild(style);
  
  // Create the component
  function createBranchSwitcher() {
    // Create elements
    const container = document.createElement('div');
    container.className = 'branch-switcher collapsed';
    
    const header = document.createElement('div');
    header.className = 'branch-switcher-header';
    
    const title = document.createElement('h3');
    title.className = 'branch-switcher-title';
    title.textContent = 'Branch Switcher';
    
    const toggle = document.createElement('button');
    toggle.className = 'branch-switcher-toggle';
    toggle.innerHTML = '▲';
    toggle.setAttribute('aria-label', 'Toggle branch switcher');
    
    const body = document.createElement('div');
    body.className = 'branch-switcher-body';
    body.innerHTML = '<p>Loading branches...</p>';
    
    // Assemble component
    header.appendChild(title);
    header.appendChild(toggle);
    container.appendChild(header);
    container.appendChild(body);
    document.body.appendChild(container);
    
    // Add event listeners
    header.addEventListener('click', () => {
      container.classList.toggle('collapsed');
      toggle.innerHTML = container.classList.contains('collapsed') ? '▲' : '▼';
    });
    
    // Load branch data
    loadBranches(body);
    
    return container;
  }
  
  // Load branch data
  function loadBranches(container) {
    const currentPath = window.location.pathname;
    const currentBranch = getCurrentBranch(currentPath);
    
    fetch(`/${repoName}/.github/branches.json?t=${Date.now()}`)
      .then(response => response.json())
      .then(data => {
        if (data.branches && data.branches.length) {
          // Sort branches - main first, then alphabetically
          const branches = data.branches.sort((a, b) => {
            if (a.name === 'main') return -1;
            if (b.name === 'main') return 1;
            return a.name.localeCompare(b.name);
          });
          
          // Create list
          const ul = document.createElement('ul');
          ul.className = 'branch-list';
          
          branches.forEach(branch => {
            const li = document.createElement('li');
            li.className = 'branch-item';
            
            const link = document.createElement('a');
            link.className = 'branch-link';
            if (branch.name === currentBranch) {
              link.className += ' current';
            }
            
            // Create equivalent path in the target branch
            link.href = createEquivalentPath(currentPath, currentBranch, branch.name);
            link.textContent = branch.name === 'main' ? 'Main (Production)' : branch.name;
            
            const date = document.createElement('span');
            date.className = 'branch-date';
            date.textContent = new Date(branch.updated).toLocaleDateString();
            
            li.appendChild(link);
            li.appendChild(date);
            ul.appendChild(li);
          });
          
          container.innerHTML = '';
          container.appendChild(ul);
        }
      })
      .catch(error => {
        container.innerHTML = `
          <ul class="branch-list">
            <li class="branch-item"><a href="/${repoName}/" class="branch-link ${currentBranch === 'main' ? 'current' : ''}">Main (Production)</a></li>
            <li class="branch-item"><a href="/${repoName}/staging/" class="branch-link ${currentBranch === 'staging' ? 'current' : ''}">Staging</a></li>
            <li class="branch-item"><a href="/${repoName}/dev/" class="branch-link ${currentBranch === 'dev' ? 'current' : ''}">Development</a></li>
          </ul>
          <p><small>Note: Branch list could not be loaded. Showing default branches.</small></p>
        `;
      });
  }
  
  // Get current branch from path
  function getCurrentBranch(path) {
    const repoIndex = path.indexOf(repoName);
    if (repoIndex !== -1) {
      const pathAfterRepo = path.substring(repoIndex + repoName.length);
      const segments = pathAfterRepo.split('/').filter(Boolean);
      
      if (segments.length > 0) {
        return segments[0];
      }
    }
    return 'main';
  }
  
  // Create equivalent path in target branch
  function createEquivalentPath(currentPath, currentBranch, targetBranch) {
    const repoIndex = currentPath.indexOf(repoName);
    if (repoIndex !== -1) {
      const pathAfterRepo = currentPath.substring(repoIndex + repoName.length);
      
      if (currentBranch !== 'main') {
        // Remove current branch from path
        const pathWithoutBranch = pathAfterRepo.replace(new RegExp(`^/${currentBranch}`), '');
        
        if (targetBranch === 'main') {
          return `/${repoName}${pathWithoutBranch}`;
        } else {
          return `/${repoName}/${targetBranch}${pathWithoutBranch}`;
        }
      } else {
        // Current is main, add target branch
        if (targetBranch === 'main') {
          return `/${repoName}${pathAfterRepo}`;
        } else {
          return `/${repoName}/${targetBranch}${pathAfterRepo}`;
        }
      }
    }
    
    // Fallback to branch root
    if (targetBranch === 'main') {
      return `/${repoName}/`;
    } else {
      return `/${repoName}/${targetBranch}/`;
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createBranchSwitcher);
  } else {
    createBranchSwitcher();
  }
})();