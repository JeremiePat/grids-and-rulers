import AppManager from '../state.js'

// Base DOM actions for the grid UI
// ----------------------------------------------------------------------------
function toggle (e) {
  const id   = e.target.value
  const grid = AppManager.state.grids[id]

  AppManager.grid.update({id, active: !grid.active})
}

function update (e) {
  const [id, name] = e.target.name.split('-')
  const grid = { id }

  grid[name] = e.target.type === 'number'   ? Number(e.target.value)
             : e.target.type === 'checkbox' ? e.target.checked
             : e.target.type === 'select-one' && e.target.value === '0' ? 0
             : e.target.value

  if (e.target.type === 'select-one') {
    e.target.nextElementSibling.classList.toggle('hidden', e.target.value !== '0')
  }

  AppManager.grid.update(grid, true)
}

function add () {
  AppManager.grid.add({
    id: `g${Math.random().toString(36).substr(2, 9)}`,
    active:     true,
    color:      '#000000',
    opacity:    25,
    colSize:    100,
    colGutter:  20,
    colNumber:  0,
    colPos:     'left',
    colOutside: false,
    rowSize:    19,
    rowGutter:  1,
    rowNumber:  0,
    rowPos:     'top',
    rowOutside: false
  })
}

function remove (e) {
  AppManager.grid.remove(e.target.value)
}

// Bind actions to state
// ----------------------------------------------------------------------------
AppManager.state.ui.grid = { add, toggle, remove, update }
