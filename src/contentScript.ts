// Ensure content script is properly initialized
console.log('PromptStack content script loaded on:', window.location.href)

function setElementValue(el: HTMLTextAreaElement | HTMLElement, text: string) {
  console.log('Attempting to set value on element:', el.tagName, el.className, el.id)

  if (el instanceof HTMLTextAreaElement) {
    // Focus the element first
    el.focus()

    // Clear existing content and set new value
    el.value = text

    // Dispatch multiple events to ensure React detects the change
    el.dispatchEvent(new Event('focus', { bubbles: true }))
    el.dispatchEvent(new Event('input', { bubbles: true }))
    el.dispatchEvent(new Event('change', { bubbles: true }))

    // Also try React-specific events
    const reactEvent = new Event('input', { bubbles: true })
    Object.defineProperty(reactEvent, 'target', { value: el, enumerable: true })
    el.dispatchEvent(reactEvent)

    // Keep focus on the element after insertion
    setTimeout(() => {
      el.focus()
      // Move cursor to end of text
      el.setSelectionRange(el.value.length, el.value.length)
    }, 50)

    console.log('Set textarea value to:', text.substring(0, 50) + '...')
    return true
  }

  if (el.isContentEditable) {
    el.focus()

    // For contenteditable, we need to handle text insertion differently
    // Clear existing content and set new text
    el.innerHTML = ''
    el.textContent = text

    el.dispatchEvent(new Event('input', { bubbles: true }))
    el.dispatchEvent(new Event('change', { bubbles: true }))

    // Keep focus and move cursor to end
    setTimeout(() => {
      el.focus()
      // Move cursor to end for contenteditable
      const range = document.createRange()
      const sel = window.getSelection()
      range.selectNodeContents(el)
      range.collapse(false)
      sel?.removeAllRanges()
      sel?.addRange(range)
    }, 50)

    console.log('Set contenteditable value to:', text.substring(0, 50) + '...')
    return true
  }

  return false
}

function tryInsert(text: string): boolean {
  console.log('Trying to insert text:', text.substring(0, 50) + '...')
  console.log('Current URL:', window.location.href)

  // Wait for DOM to be ready
  if (document.readyState !== 'complete') {
    console.log('DOM not ready, waiting...')
    return false
  }

  // ChatGPT - try multiple selectors
  const chatGptSelectors = [
    'textarea[placeholder*="Message"]',
    'textarea[data-id="root"]',
    'textarea#prompt-textarea',
    'div[contenteditable="true"][data-id="root"]',
    'textarea',
    'div[contenteditable="true"]'
  ]

  for (const selector of chatGptSelectors) {
    const el = document.querySelector(selector) as HTMLTextAreaElement | HTMLElement | null
    if (el && (el as any).offsetParent !== null) { // Check if element is visible
      console.log('Found element with selector:', selector)
      if (setElementValue(el, text)) {
        console.log('Successfully inserted text')
        return true
      }
    }
  }

  // Perplexity
  if (window.location.hostname.includes('perplexity')) {
    const perplexityTextarea = document.querySelector('textarea') as HTMLTextAreaElement | null
    if (perplexityTextarea && setElementValue(perplexityTextarea, text)) {
      console.log('Inserted into Perplexity')
      return true
    }
  }

  // GitHub - handle different GitHub interfaces
  if (window.location.hostname.includes('github')) {
    // GitHub Copilot Chat - try various selectors for the chat interface
    const copilotSelectors = [
      'textarea[aria-label*="chat"]',
      'textarea[placeholder*="Ask Copilot"]',
      'textarea[placeholder*="Message"]',
      'div[contenteditable="true"][role="textbox"]',
      '.copilot-chat-input textarea',
      '[data-testid="copilot-chat-input"]',
      '[data-testid="chat-input"] textarea',
      'textarea[aria-describedby*="copilot"]'
    ]

    for (const selector of copilotSelectors) {
      const el = document.querySelector(selector) as HTMLTextAreaElement | HTMLElement | null
      if (el && (el as any).offsetParent !== null) {
        console.log('Found GitHub Copilot element with selector:', selector)
        if (setElementValue(el, text)) {
          console.log('Successfully inserted into GitHub Copilot')
          return true
        }
      }
    }

    // GitHub issue/PR comment fallback
    const gh = document.querySelector('#new_comment_field, .js-comment-field') as HTMLTextAreaElement | null
    if (gh && setElementValue(gh, text)) {
      console.log('Inserted into GitHub comment')
      return true
    }
  }

  console.log('No suitable element found for insertion')

  // Last resort: try to find any visible textarea or contenteditable element
  console.log('Attempting last resort element search...')
  const allTextareas = document.querySelectorAll('textarea')
  console.log('Found textareas:', allTextareas.length)

  for (let i = 0; i < allTextareas.length; i++) {
    const ta = allTextareas[i] as HTMLTextAreaElement
    if ((ta as any).offsetParent !== null) { // Check if visible
      console.log('Trying textarea', i, ':', ta.placeholder, ta.className, ta.id)
      if (setElementValue(ta, text)) {
        console.log('Successfully inserted via fallback textarea')
        return true
      }
    }
  }

  const allContentEditables = document.querySelectorAll('[contenteditable="true"]')
  console.log('Found contenteditable elements:', allContentEditables.length)

  for (let i = 0; i < allContentEditables.length; i++) {
    const ce = allContentEditables[i] as HTMLElement
    if ((ce as any).offsetParent !== null) { // Check if visible
      console.log('Trying contenteditable', i, ':', ce.className, ce.id, ce.getAttribute('role'))
      if (setElementValue(ce, text)) {
        console.log('Successfully inserted via fallback contenteditable')
        return true
      }
    }
  }

  return false
}

// Initialize message listener
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Content script received message:', message)

    if (message?.type === 'insertPrompt' && typeof message.text === 'string') {
      try {
        // If DOM isn't ready, wait and try again
        if (document.readyState !== 'complete') {
          setTimeout(() => {
            const ok = tryInsert(message.text)
            console.log('Insert result (delayed):', ok)

            sendResponse({ ok })
          }, 500)
        } else {
          const ok = tryInsert(message.text)
          console.log('Insert result:', ok)

          sendResponse({ ok })
        }
      } catch (error) {
        console.error('Error during insertion:', error)
        sendResponse({ ok: false, error: (error as Error).message })
      }
    } else {
      sendResponse({ ok: false, error: 'Invalid message format' })
    }
    return true
  })

  console.log('PromptStack content script message listener initialized')
} else {
  console.error('Chrome runtime not available for content script')
}
