import AppManager from '../state.js'

// Base DOM actions for the tabs UI
// ----------------------------------------------------------------------------
function switchTab (e) {
  const hash = new URL(e.target.href).hash

  AppManager.state.tabs.forEach(tab => {
    tab.active = tab.link === hash
  })

  AppManager.tabs.update()
}

// We attach tehe event handler directly on the tab object because
// we know we will never have to serialize those objects with JSON
// ----------------------------------------------------------------------------
AppManager.state.tabs.forEach(tab => tab.onclick = switchTab)
