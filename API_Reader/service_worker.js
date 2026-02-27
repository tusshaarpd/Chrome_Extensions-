let attachedTabId = null
let requests = []

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "ATTACH") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id
      attachedTabId = tabId

      chrome.debugger.attach(
        { tabId: tabId },
        "1.3",
        () => {
          if (chrome.runtime.lastError) {
            console.warn("Debugger attach error:", chrome.runtime.lastError.message)
            return
          }
          chrome.debugger.sendCommand(
            { tabId: tabId },
            "Network.enable"
          )
        }
      )
    })
  }

  if (message.type === "GET_REQUESTS") {
    sendResponse({ data: requests })
    return true
  }

  if (message.type === "CLEAR_REQUESTS") {
    requests = []
    sendResponse({ success: true })
    return true
  }

  return true
})

chrome.debugger.onEvent.addListener((source, method, params) => {
  if (method === "Network.requestWillBeSent") {
    requests.push({
      requestId: params.requestId,
      url: params.request.url,
      method: params.request.method,
      startTime: params.timestamp
    })
  }

  if (method === "Network.responseReceived") {
    const existing = requests.find(r => r.requestId === params.requestId)
    if (existing) {
      existing.status = params.response.status
      existing.mimeType = params.response.mimeType
    }
  }

  if (method === "Network.loadingFinished") {
    const existing = requests.find(r => r.requestId === params.requestId)
    if (existing) {
      existing.endTime = params.timestamp
      existing.duration =
        ((existing.endTime - existing.startTime) * 1000).toFixed(2)
    }
  }
})

chrome.debugger.onDetach.addListener((source, reason) => {
  if (source.tabId === attachedTabId) {
    attachedTabId = null
  }
})
