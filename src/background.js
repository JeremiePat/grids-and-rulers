// This script is here to allows connection between devtools and
// theire related inspected tab, it would be a thousand time easier
// if we could have an API such as browser.devtools.inspectesWindow.connect()
// rather than having to do all this mess!

// connect a devtools port with a tab port
function connect (dev, tab) {
  const tabMessage = tab.postMessage.bind(tab)
  const devMessage = dev.postMessage.bind(dev)

  // Message from the devtools are channeled to the inspected tab
  // and message from the inspected tab are channeled to the devtools
  dev.onMessage.addListener(tabMessage)
  tab.onMessage.addListener(devMessage)

  // When the tab disconnect, we make sure that we broke the link with the
  // devtools port to avoid error while trying to send message to a dead port
  tab.onDisconnect.addListener(() => {
    dev.onMessage.removeListener(tabMessage)
    tab.onMessage.removeListener(devMessage)
  })

  // When the devtools close, it's not necessary
  // to keep the inspected tab connection alive
  dev.onDisconnect.addListener(() => {
    tab.disconnect()
  })
}

// Wait for devtools incoming connections
// ----------------------------------------------------------------------------
browser.runtime.onConnect.addListener(async dev => {
  const tabId = Number(dev.name)
  const tab   = browser.tabs.connect(tabId, {name: dev.name})

  connect(dev, tab)

  // We make sure to reconnect the devtools with
  // the inspected tab once the tab has been fully reloaded
  // We wait for full reload because the content script can
  // inject DOM node within the inspected tab.
  function reconnect (id, info) {
    if (id !== tabId) { return } // Not the right tab
    if (info.status !== 'complete') { return } // Not fully loaded yet

    // We reconnect the tab
    const tab = browser.tabs.connect(id, {name: dev.name})
    connect(dev, tab)

    // We notify the devtools that the tab has reload so that they can send
    // back the necessary information to the tab content script.
    dev.postMessage({ action: 'TAB_RELOADED' })
  }

  browser.tabs.onUpdated.addListener(reconnect)
  dev.onDisconnect.addListener(() => {
    browser.tabs.onUpdated.removeListener(reconnect)
  })
})
