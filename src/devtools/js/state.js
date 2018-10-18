import { storage } from '../../lib/browser.js'

// Default state structure
// ----------------------------------------------------------------------------
const STATE = {
  ui: {},

  grids: {},

  rulers: {},

  tabs: [
    {label: 'TabNameGrids',     link: '#grids', active: true},
    {label: 'TabNameRulers',    link: '#rulers'},
    {label: 'TabNameShortcuts', link: '#params'}
  ],

  keys: {
    KeyAddGrid:      { id: 'KeyAddGrid',      altKey: true, shiftKey: false, ctrlKey: false, key: 'g' },
    KeyHideGrids:    { id: 'KeyHideGrids',    altKey: true, shiftKey: false, ctrlKey: false, key: 'h' },
    KeyToggleGrids:  { id: 'KeyToggleGrids',  altKey: true, shiftKey: false, ctrlKey: false, key: 't' },
    KeyDeleteGrids:  { id: 'KeyDeleteGrids',  altKey: true, shiftKey: false, ctrlKey: false, key: 'd' },
    KeyAddHRulers:   { id: 'KeyAddHRulers',   altKey: true, shiftKey: false, ctrlKey: false, key: 'r' },
    KeyAddVRulers:   { id: 'KeyAddVRulers',   altKey: true, shiftKey: false, ctrlKey: false, key: 'v' },
    KeyToggleRulers: { id: 'KeyToggleRulers', altKey: true, shiftKey: false, ctrlKey: false, key: 'i' },
    KeyDeleteRulers: { id: 'KeyDeleteRulers', altKey: true, shiftKey: false, ctrlKey: false, key: 's' }
  }
}

// Load persistent state if any
// ----------------------------------------------------------------------------
storage.get(['keys']).then(result => {
  if (result && result.keys) {
    STATE.keys = result.keys
  }
})

// Store listening function with the signature:
//   `function (action, data) {}`
//
// Actions are one of the following
//  - UPDATE_TABS       (no data associated)
//  - ADD_GRID          (associated with a grid object)
//  - UPDATE_GRID_SOFT  (associated with a grid object)
//  - UPDATE_GRID_HARD  (associated with a grid object)
//  - REMOVE_GRID       (associated with a grid id string)
//  - ADD_RULER         (associated with a ruler object)
//  - UPDATE_RULER_SOFT (associated with a ruler object)
//  - UPDATE_RULER_HARD (associated with a ruler object)
//  - REMOVE_RULER      (associated with a ruler id string)
//  - UPDATE_KEY_SOFT   (associated with a key object)
//
// Grid objects provide the following properties:
//  - id:         <String>
//  - active:     <Boolean>
//  - color:      <String>
//  - opacity:    <Number>
//  - colSize:    <Number>
//  - colGutter:  <Number>
//  - colNumber:  <Number>
//  - colPos:     <String>|<Number>
//  - colOutside: <Boolean>
//  - rowSize:    <Number>
//  - rowGutter:  <Number>
//  - rowNumber:  <Number>
//  - rowPos:     <String>|<Number>
//  - rowOutside: <Boolean>
//
// Ruler objects provide the following properties:
//  - id:         <String>
//  - active:     <Boolean>
//  - color:      <String>
//  - opacity:    <Number>
//  - position:   <Number>
//  - orientation:<String>
//
// Key objects provide the following properties:
//  - id:         <String>
//  - altKey:     <Boolean>
//  - shiftKey:   <Boolean>
//  - ctrlKey:    <Boolean>
//  - key:        <String>
// ----------------------------------------------------------------------------
const LISTENERS = new Set()

// API to access and manipulate the application state
// ----------------------------------------------------------------------------
const AppManager = {
  get state () {
    return STATE
  },

  // Navigation tag API (update)
  tabs: {
    update () {
      LISTENERS.forEach(fn => fn('UPDATE_TABS'))
    }
  },

  // Grid API (add, update, remove)
  grid: {
    add (grid) {
      STATE.grids[grid.id] = grid

      LISTENERS.forEach(fn => fn('ADD_GRID', grid))
    },

    update (change, soft) {
      const { id } = change
      if (!STATE.grids[id]) { return }

      const grid = Object.assign(STATE.grids[id], change)

      LISTENERS.forEach(fn => fn(`UPDATE_GRID_${soft ? 'SOFT' : 'HARD'}`, grid))
    },

    remove (id) {
      if (!STATE.grids[id]) { return }

      delete STATE.grids[id]

      LISTENERS.forEach(fn => fn('REMOVE_GRID', id))
    }
  },

  // Ruler API (add, update, remove)
  ruler: {
    add (ruler) {
      STATE.rulers[ruler.id] = ruler

      LISTENERS.forEach(fn => fn('ADD_RULER', ruler))
    },

    update (change, soft) {
      const { id } = change
      if (!STATE.rulers[id]) { return }

      const ruler = Object.assign(STATE.rulers[id], change)

      LISTENERS.forEach(fn => fn(`UPDATE_RULER_${soft ? 'SOFT' : 'HARD'}`, ruler))
    },

    remove (id) {
      if (!STATE.rulers[id]) { return }

      delete STATE.rulers[id]

      LISTENERS.forEach(fn => fn('REMOVE_RULER', id))
    }
  },

  // Keys API (update)
  keys: {
    update (change) {
      const { id } = change
      if (!STATE.keys[id]) { return }

      const key = Object.assign(STATE.keys[id], change)

      storage.set({keys: STATE.keys})

      LISTENERS.forEach(fn => fn('UPDATE_KEY_SOFT', key))
    }
  },

  // Record state change listener
  addStateListener (fn) {
    LISTENERS.add(fn)
  }
}

export default AppManager
