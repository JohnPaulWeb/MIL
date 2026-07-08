document.addEventListener('DOMContentLoaded', () => {
  const arenaBtn = document.getElementById('open-arena');
  const dashboardBtn = document.getElementById('open-dashboard');
  const overlayToggle = document.getElementById('overlay-toggle');

  // Open Arena game in new tab
  arenaBtn?.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('app.html?page=arena') });
  });

  // Open Dashboard in new tab
  dashboardBtn?.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('app.html?page=dashboard') });
  });

  // Toggle overlay
  overlayToggle?.addEventListener('click', () => {
    overlayToggle.classList.toggle('active');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'TOGGLE_OVERLAY',
          visible: overlayToggle?.classList.contains('active'),
        });
      }
    });
  });

  // Load overlay preference
  chrome.storage.local.get('overlayEnabled', (result) => {
    if (result.overlayEnabled === false) {
      overlayToggle?.classList.remove('active');
    }
  });
});
