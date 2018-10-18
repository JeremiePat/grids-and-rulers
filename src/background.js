
// Keep track of which tab is connected to which devtool channel
// ----------------------------------------------------------------------------
const connections = {}


// Keep track of data shared between tabs and devtools. Data must be trashed
// only when the tab is closed because devtools can be open en closed at will
// and we want grids and rulers to be peristant
const data = {}


// Listen for incoming message from devtools
// ----------------------------------------------------------------------------
browser.runtime.onConnect.addListener((port) => {
  const tabId = Number(port.name.split('-')[1])
  connections[tabId] = port

  // Route messages to the target tab content script
  function message (msg) {
    if (msg.action === 'ADD_GRID'
    ||  msg.action === 'UPDATE_GRID_SOFT'
    ||  msg.action === 'UPDATE_GRID_HARD') {
      data[tabId].grids[msg.data.id] = msg.data
    }

    else if (msg.action === 'ADD_RULER'
    || msg.action === 'UPDATE_RULER_SOFT'
    || msg.action === 'UPDATE_RULER_HARD') {
      data[tabId].rulers[msg.data.id] = msg.data
    }

    else if (msg.action === 'REMOVE_GRID') {
      delete data[tabId].grids[msg.data]
    }

    else if (msg.action === 'REMOVE_RULER') {
      delete data[tabId].rulers[msg.data]
    }

    browser.tabs.sendMessage(tabId, msg)
  }

  // On disconnect we clean up the connection and send a
  // final message to the content script of the associated tab
  function disconnect (port) {
    browser.tabs.sendMessage(tabId, {
      action: 'CLOSE_DEVTOOLS'
    })

    port.onMessage.removeListener(message)
    port.onMessage.removeListener(disconnect)
    delete connections[tabId]
  }

  // Bound event handler
  port.onMessage.addListener(message)
  port.onDisconnect.addListener(disconnect)

  // Send back data for the related Tab
  if (data[tabId]) {
    const grids  = data[tabId].grids
    const rulers = data[tabId].rulers

    Object.keys(grids).forEach(id => {
      port.postMessage({ action: 'ADD_GRID', data: grids[id] })
    })

    Object.keys(rulers).forEach(id => {
      port.postMessage({ action: 'ADD_RULER', data: rulers[id] })
    })
  } else {
    data[tabId] = {
      grids:  {},
      rulers: {}
    }
  }
})


// Listen for incoming messages from tabs
// ----------------------------------------------------------------------------
browser.runtime.onMessage.addListener((request, sender) => {
  if (!sender.tab) { return }

  const tabId = sender.tab.id;

  if (tabId in connections) {
    // Route the message to the proper devtool channel
    connections[tabId].postMessage(request);
  }
})


// Listen for tabs load in order to reaply grids and rulers
// ----------------------------------------------------------------------------
browser.tabs.onUpdated.addListener((tabId, info) => {
  if (info.status !== 'complete') { return }

  if (data[tabId]) {
    const grids  = data[tabId].grids
    const rulers = data[tabId].rulers
    const keys   = data[tabId].keys

    if (grids) {
      Object.keys(grids).forEach(id => {
        browser.tabs.sendMessage(tabId, { action: 'ADD_GRID', data: grids[id] })
      })
    }

    if (rulers) {
      Object.keys(rulers).forEach(id => {
        browser.tabs.sendMessage(tabId, { action: 'ADD_RULER', data: rulers[id] })
      })
    }

    if (keys) {
      Object.keys(keys).forEach(id => {
        browser.tabs.sendMessage(tabId, { action: 'UPDATE_KEY', data: keys[id] })
      })
    }
  }
})


// Listen for closing tabs in order to clear up stored data
// ----------------------------------------------------------------------------
browser.tabs.onRemoved.addListener(tabId => {
  if (data[tabId]) {
    delete data[tabId]
  }
})
