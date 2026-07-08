export default defineContentScript({
  matches: ['<all_urls>'],
  world: 'MAIN',
  main() {
    console.log('[v0] Content script loaded');

    // Detect selected text
    document.addEventListener('mouseup', () => {
      const selectedText = window.getSelection()?.toString().trim();
      
      if (selectedText && selectedText.length > 10) {
        // Send message to UI component (will be handled by popup or overlay)
        chrome.runtime.sendMessage(
          {
            type: 'TEXT_SELECTED',
            text: selectedText,
          },
          (response) => {
            if (chrome.runtime.lastError) {
              console.log('[v0] Overlay not yet available');
            }
          }
        );
      }
    });

    // Listen for overlay toggle
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'TOGGLE_OVERLAY') {
        console.log('[v0] Overlay toggle received:', message.visible);
        sendResponse({ success: true });
      }
    });
  },
});
