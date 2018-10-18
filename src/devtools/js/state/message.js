import { runtime, devtools } from '../../../lib/browser.js'
import AppManager from '../state.js'
import keyAction  from '../shortcut.js'

// Open a connection channel with the background script
// to carry message up to the content scripts in each tab
// ----------------------------------------------------------------------------
const connexion = runtime.connect({
  name: 'gridsAndRulers-' + devtools.inspectedWindow.tabId
})

// Send keyboard shortcut to background so that
// they can be catured from the content scripts
Object.keys(AppManager.state.keys).forEach(id => {
  connexion.postMessage({
    action: 'UPDATE_KEY_SOFT',
    data: AppManager.state.keys[id]
  })
})

// Listen for incoming message from the content scripts
// ----------------------------------------------------------------------------
connexion.onMessage.addListener((msg) => {
  // Rulers can be dragged so we need to take care for a ruler update
  if (msg.action === 'UPDATE_RULER_HARD') {
    AppManager.ruler.update(msg.data)
  }

  // If tabs is still open while the devtools have been reopen, background
  // will send rulers and grids to restore.
  else if (msg.action === 'ADD_RULER') {
    AppManager.ruler.add(msg.data)
  }

  else if (msg.action === 'ADD_GRID') {
    AppManager.grid.add(msg.data)
  }

  else if (msg.action === 'TRIGGER_KEY') {
    keyAction(msg.data)
  }
})

// Each time the application state change,
// we notifiy this change to the background script
// ----------------------------------------------------------------------------
AppManager.addStateListener((action, data) => {
  connexion.postMessage({ action, data })
})
