chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'insertPrompt') {
    // Route to content script via active tab
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (!tabs[0]?.id) {
        sendResponse({ ok: false, error: 'No active tab found' })
        return
      }

      const tabId = tabs[0].id
      const url = tabs[0].url || ''

      // Check if we're on a supported site (case-insensitive)
      const supportedSites = [
        'chat.openai.com', 
        'chatgpt.com',
        'www.chatgpt.com',
        'www.perplexity.ai', 
        'github.com'
      ]
      
      // More flexible check - extract hostname and check if it ends with supported domains
      let isSupported = false
      try {
        const urlObj = new URL(url)
        const hostname = urlObj.hostname.toLowerCase()
        isSupported = supportedSites.some(site => {
          const siteLower = site.toLowerCase()
          return hostname === siteLower || hostname.endsWith('.' + siteLower)
        })
      } catch (error) {
        // Fallback to original string-based check if URL parsing fails
        isSupported = supportedSites.some(site => url.toLowerCase().includes(site.toLowerCase()))
      }

      if (!isSupported) {
        sendResponse({ ok: false, error: `This site is not supported. Current URL: ${url}. Please visit ChatGPT, Perplexity, or GitHub.` })
        return
      }

      try {
        // Try to inject the content script if it's not already there
        await chrome.scripting.executeScript({
          target: { tabId },
          files: ['contentScript.js']
        })
      } catch (injectionError) {
        // Content script might already be injected, that's okay
        console.log('Content script injection result:', injectionError)
      }

      // Wait a bit for the content script to be ready
      setTimeout(() => {
        chrome.tabs.sendMessage(tabId, message, (response) => {
          if (chrome.runtime.lastError) {
            console.error('Runtime error:', chrome.runtime.lastError)
            sendResponse({
              ok: false,
              error: `Failed to connect to content script: ${chrome.runtime.lastError.message}`
            })
          } else if (!response) {
            sendResponse({
              ok: false,
              error: 'No response from content script. Please refresh the page and try again.'
            })
          } else {
            sendResponse(response)
          }
        })
      }, 100)
    })
    return true // Keep message channel open for async response
  }
  return false
})
