let CONNECTION = null

if (!CONNECTION) {
  CONNECTION = browser.runtime.connect({
    name: String(browser.devtools.inspectedWindow.tabId)
  })
}

function send (data) {
  CONNECTION.postMessage(data)
}

function listen (callback) {
  CONNECTION.onMessage.addListener(callback)
}

export default { send, listen }
