import AppManager from './state.js'

// KeyBoardEvent.keyCode mapping
// ----------------------------------------------------------------------------
const code = {
  a: 65, b: 66, c: 67, d: 68, e: 69, f: 70, g: 71, h: 72, i: 73,
  j: 74, k: 75, l: 76, m: 77, n: 78, o: 79, p: 80, q: 81, r: 82,
  s: 83, t: 84, u: 85, v: 86, w: 87, x: 88, y: 89, z: 90
}

const visibility = {
  rulers: true,
  grids: 0
}

// Actions definied for each keyboard shortcut define in the application
// ----------------------------------------------------------------------------
const action = {
  KeyAddGrid () {
    AppManager.state.ui.grid.add()
  },

  KeyHideGrids () {
    Object.keys(AppManager.state.grids).forEach(id => {
      AppManager.grid.update({ id, active: false })
    })
  },

  KeyDeleteGrids () {
    Object.keys(AppManager.state.grids).forEach(id => {
      AppManager.grid.remove(id)
    })
  },

  KeyToggleGrids () {
    const grids   = Object.keys(AppManager.state.grids)
    const visible = visibility.grids
    const next    = visible + 1

    visibility.grids = next >= grids.length ? 0 : next

    grids.forEach((id, i) => {
      AppManager.grid.update({ id, active: i === visible })
    })
  },

  KeyAddHRulers () {
    AppManager.state.ui.ruler.add('horizontal')
  },

  KeyAddVRulers () {
    AppManager.state.ui.ruler.add('vertical')
  },

  KeyToggleRulers () {
    const active = visibility.rulers = !visibility.rulers
    Object.keys(AppManager.state.rulers).forEach(id => {
      AppManager.ruler.update({id, active})
    })
  },

  KeyDeleteRulers () {
    Object.keys(AppManager.state.rulers).forEach(id => {
      AppManager.ruler.remove(id)
    })
  },
}

// Start listening for keyboard events
// ----------------------------------------------------------------------------
function onkeyup (e) {
  const keys = AppManager.state.keys

  Object.keys(keys).forEach(id => {
    const key = keys[id]
    const match = key.altKey    === e.altKey   &&
                  key.shiftKey  === e.shiftKey &&
                  key.ctrlKey   === e.ctrlKey  &&
                  code[key.key] === e.keyCode

    if (match) { action[key.id]() }
  })
}

window.addEventListener('keyup', onkeyup)


// Export API to trigger actions on demand
// ----------------------------------------------------------------------------
function keyAction (id) {
  action[id]()
}

export default keyAction
