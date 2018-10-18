import AppManager from '../state.js'

const TAB_SIZE_EVAL = {
  'vertical':   '[document.documentElement.clientWidth, document.documentElement.scrollLeft]',
  'horizontal': '[document.documentElement.clientHeight, document.documentElement.scrollTop]'
}

// Base DOM actions for the ruler UI
// ----------------------------------------------------------------------------
function toggle (e) {
  const id = e.target.value
  const ruler = AppManager.state.rulers[id]

  AppManager.ruler.update({id, active: !ruler.active})
}

function update (e) {
  const [id, name] = e.target.name.split('-')
  const ruler = { id }

  ruler[name] = e.target.type === 'number'   ? Number(e.target.value)
              : e.target.type === 'checkbox' ? e.target.checked
              : e.target.value

  AppManager.ruler.update(ruler, true)
}

function add (direction) {
  const orientation = direction === 'vertical' ? 'vertical' : 'horizontal'

  browser.devtools.inspectedWindow
    .eval(TAB_SIZE_EVAL[orientation])
    .then(result => {
      // Chrome and Firefox do not follow the same convention here
      const [size, scroll] = Array.isArray(result[0]) ? result[0] : result;

      AppManager.ruler.add({
        id: `r${Math.random().toString(36).substr(2, 9)}`,
        active:      true,
        color:       '#FF0000',
        opacity:     100,
        position:    Math.round(scroll + size/2),
        orientation
      })
    })
}

function remove (e) {
  AppManager.ruler.remove(e.target.value)
}

// Bind actions to state
// ----------------------------------------------------------------------------
AppManager.state.ui.ruler = { add, toggle, remove, update }
