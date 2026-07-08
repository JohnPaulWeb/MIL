export default defineBackground(() => {
  console.log('[v0] Background script loaded');

  // Listen for messages from content script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'TEXT_SELECTED') {
      console.log('[v0] Text selected:', message.text);
      
      // Analyze text by calling the web app API
      fetch('http://localhost:3000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          claim: message.text,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('[v0] Analysis result:', data);
          
          // Send result back to content script to display overlay
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
              chrome.tabs.sendMessage(tabs[0].id, {
                type: 'SHOW_OVERLAY',
                selectedText: message.text,
                result: data.result,
              }).catch(() => {
                console.log('[v0] Could not send message to content script');
              });
            }
          });
          
          sendResponse({ success: true, result: data });
        })
        .catch((error) => {
          console.error('[v0] Analysis failed:', error);
          sendResponse({ success: false, error: error.message });
        });
      
      return true; // Keep message channel open for async response
    }

    if (message.type === 'GET_PAGE_INFO') {
      const pageInfo = {
        url: sender.url,
        title: sender.tab?.title,
      };
      sendResponse(pageInfo);
    }
  });

  // Handle extension installation
  chrome.runtime.onInstalled.addListener(() => {
    console.log('[v0] Misinformation Detector extension installed');
  });
});
