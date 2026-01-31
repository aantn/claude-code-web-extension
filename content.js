// Claude Code Sessions Search & Filter Extension
(function() {
  'use strict';

  let searchInput = null;
  let repoFilter = null;
  let filterContainer = null;
  let isInitialized = false;

  // Debounce function to limit filter calls
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Extract unique repos from session items
  function extractRepos() {
    const repos = new Set();
    const sessionItems = document.querySelectorAll('[data-index]');

    sessionItems.forEach(item => {
      const repoSpan = item.querySelector('.text-text-500 .truncate');
      if (repoSpan) {
        repos.add(repoSpan.textContent.trim());
      }
    });

    return Array.from(repos).sort();
  }

  // Update repo dropdown options
  function updateRepoOptions() {
    if (!repoFilter) return;

    const currentValue = repoFilter.value;
    const repos = extractRepos();

    // Clear existing options except "All Repos"
    while (repoFilter.options.length > 1) {
      repoFilter.remove(1);
    }

    // Add repo options
    repos.forEach(repo => {
      const option = document.createElement('option');
      option.value = repo;
      option.textContent = repo;
      repoFilter.appendChild(option);
    });

    // Restore previous selection if still valid
    if (repos.includes(currentValue)) {
      repoFilter.value = currentValue;
    }
  }

  // Filter sessions based on search text and selected repo
  function filterSessions() {
    if (!searchInput || !repoFilter) return;

    const searchText = searchInput.value.toLowerCase().trim();
    const selectedRepo = repoFilter.value;

    const sessionItems = document.querySelectorAll('[data-index]');

    sessionItems.forEach(item => {
      const titleSpan = item.querySelector('.font-base.text-text-100.leading-relaxed');
      const repoSpan = item.querySelector('.text-text-500 .truncate');

      const title = titleSpan ? titleSpan.textContent.toLowerCase() : '';
      const repo = repoSpan ? repoSpan.textContent.trim() : '';

      const matchesSearch = !searchText || title.includes(searchText);
      const matchesRepo = !selectedRepo || repo === selectedRepo;

      // Find the parent group div that controls visibility
      const groupDiv = item.querySelector('.group');
      if (groupDiv) {
        if (matchesSearch && matchesRepo) {
          item.style.display = '';
          groupDiv.style.display = '';
        } else {
          item.style.display = 'none';
          groupDiv.style.display = 'none';
        }
      }
    });
  }

  // Create the search and filter UI
  function createFilterUI() {
    // Create container
    filterContainer = document.createElement('div');
    filterContainer.className = 'cc-filter-container';
    filterContainer.innerHTML = `
      <div class="cc-search-wrapper">
        <svg class="cc-search-icon" width="14" height="14" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M8.5 3C5.46243 3 3 5.46243 3 8.5C3 11.5376 5.46243 14 8.5 14C9.83879 14 11.0659 13.5217 12.0196 12.7266L16.1465 16.8536C16.3417 17.0488 16.6583 17.0488 16.8536 16.8536C17.0488 16.6583 17.0488 16.3417 16.8536 16.1465L12.7266 12.0196C13.5217 11.0659 14 9.83879 14 8.5C14 5.46243 11.5376 3 8.5 3ZM4 8.5C4 6.01472 6.01472 4 8.5 4C10.9853 4 13 6.01472 13 8.5C13 10.9853 10.9853 13 8.5 13C6.01472 13 4 10.9853 4 8.5Z"/>
        </svg>
        <input type="text"
               id="cc-session-search"
               class="cc-search-input"
               placeholder="Search sessions by title..."
               autocomplete="off">
        <button type="button" id="cc-clear-search" class="cc-clear-btn" style="display: none;">
          <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.1465 4.14642C15.3418 3.95121 15.6583 3.95118 15.8536 4.14642C16.0487 4.34168 16.0488 4.65822 15.8536 4.85346L10.7071 9.99997L15.8536 15.1465C16.0487 15.3417 16.0488 15.6583 15.8536 15.8535C15.6583 16.0486 15.3418 16.0486 15.1465 15.8535L10 10.707L4.85352 15.8535C4.65827 16.0486 4.34168 16.0486 4.14648 15.8535C3.95129 15.6583 3.95142 15.3418 4.14648 15.1465L9.293 9.99997L4.14648 4.85346C3.95142 4.65818 3.95129 4.34162 4.14648 4.14642C4.34168 3.95128 4.65825 3.95138 4.85352 4.14642L10 9.29294L15.1465 4.14642Z"/>
          </svg>
        </button>
      </div>
      <div class="cc-filter-wrapper">
        <svg class="cc-filter-icon" width="14" height="14" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M8.00536 1.4C4.35271 1.4 1.3999 4.42499 1.3999 8.16731C1.3999 11.1587 3.29187 13.6909 5.91653 14.5872C6.24468 14.6545 6.36488 14.4415 6.36488 14.2624C6.36488 14.1055 6.35407 13.5677 6.35407 13.0074C4.51659 13.4109 4.13395 12.2007 4.13395 12.2007C3.83865 11.4164 3.40112 11.2148 3.40112 11.2148C2.79971 10.8003 3.44493 10.8003 3.44493 10.8003C4.11204 10.8451 4.4621 11.4949 4.4621 11.4949C5.05255 12.5256 6.00401 12.2344 6.38679 12.0551C6.44141 11.6181 6.61651 11.3156 6.80242 11.1476C5.33689 10.9907 3.79498 10.4081 3.79498 7.80871C3.79498 7.06924 4.05728 6.46424 4.47291 5.99372C4.40734 5.8257 4.17762 5.13091 4.53863 4.201C4.53863 4.201 5.09636 4.0217 6.35393 4.89565C6.89234 4.74752 7.4476 4.67216 8.00536 4.67153C8.5631 4.67153 9.13165 4.75004 9.65666 4.89565C10.9144 4.0217 11.4721 4.201 11.4721 4.201C11.8331 5.13091 11.6033 5.8257 11.5377 5.99372C11.9643 6.46424 12.2157 7.06924 12.2157 7.80871C12.2157 10.4081 10.6738 10.9794 9.19736 11.1476C9.43803 11.3605 9.64571 11.7637 9.64571 12.4024C9.64571 13.3099 9.63489 14.0383 9.63489 14.2622C9.63489 14.4415 9.75523 14.6545 10.0832 14.5873C12.7079 13.6908 14.5999 11.1587 14.5999 8.16731C14.6107 4.42499 11.6471 1.4 8.00536 1.4Z"/>
        </svg>
        <select id="cc-repo-filter" class="cc-repo-select">
          <option value="">All Repos</option>
        </select>
      </div>
    `;

    return filterContainer;
  }

  // Find the sessions header and inject the filter UI
  function injectFilterUI() {
    // Look for the "Sessions" header
    const sessionsHeader = document.querySelector('.flex-shrink-0.flex.items-center.bg-bg-100');

    if (!sessionsHeader || document.getElementById('cc-session-search')) {
      return false;
    }

    const filterUI = createFilterUI();

    // Insert after the sessions header
    sessionsHeader.parentNode.insertBefore(filterUI, sessionsHeader.nextSibling);

    // Get references to the input elements
    searchInput = document.getElementById('cc-session-search');
    repoFilter = document.getElementById('cc-repo-filter');
    const clearBtn = document.getElementById('cc-clear-search');

    // Add event listeners
    const debouncedFilter = debounce(filterSessions, 150);

    searchInput.addEventListener('input', () => {
      clearBtn.style.display = searchInput.value ? 'flex' : 'none';
      debouncedFilter();
    });

    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearBtn.style.display = 'none';
      filterSessions();
      searchInput.focus();
    });

    repoFilter.addEventListener('change', filterSessions);

    // Keyboard shortcut: Ctrl/Cmd + K to focus search
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
      // Escape to clear and blur
      if (e.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        filterSessions();
        searchInput.blur();
      }
    });

    // Initial repo options update
    updateRepoOptions();

    return true;
  }

  // Main initialization function
  function init() {
    if (isInitialized) return;

    // Try to inject the filter UI
    if (injectFilterUI()) {
      isInitialized = true;
      console.log('Claude Code Sessions Search & Filter: Initialized');

      // Set up a MutationObserver to update repo options when sessions change
      const observer = new MutationObserver(debounce(() => {
        updateRepoOptions();
        // Re-apply filters when content changes
        if (searchInput?.value || repoFilter?.value) {
          filterSessions();
        }
      }, 300));

      const sessionsContainer = document.querySelector('.flex-1.overflow-x-hidden');
      if (sessionsContainer) {
        observer.observe(sessionsContainer, {
          childList: true,
          subtree: true
        });
      }
    }
  }

  // Wait for the page to be ready
  function waitForSidebar() {
    const checkInterval = setInterval(() => {
      const sessionsHeader = document.querySelector('.flex-shrink-0.flex.items-center.bg-bg-100');
      if (sessionsHeader) {
        clearInterval(checkInterval);
        init();
      }
    }, 500);

    // Stop checking after 30 seconds
    setTimeout(() => clearInterval(checkInterval), 30000);
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForSidebar);
  } else {
    waitForSidebar();
  }

  // Also listen for URL changes (SPA navigation)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      isInitialized = false;
      waitForSidebar();
    }
  }).observe(document, { subtree: true, childList: true });

})();
