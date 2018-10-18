import AppManager from '../state.js'

// Base DOM actions for the keys UI
// ----------------------------------------------------------------------------
function update (e) {
  const [id, name] = e.target.name.split('-')
  const key = { id }

  key[name] = e.target.type === 'checkbox' ? e.target.checked : e.target.value

  AppManager.keys.update(key, true)
}

// Bind actions to state
// ----------------------------------------------------------------------------
AppManager.state.ui.keys = { update }
