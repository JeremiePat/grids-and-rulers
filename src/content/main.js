const RGX_NUMBER = /^\d*.?\d+$/
let CONNECTION = null

// Node utils -----------------------------------------------------------------
const EXT_PREFIX = '--ext--'

function normalize (value, fallback) {
  if (RGX_NUMBER.test(value)) { return `${value}px` }
  if (!value) { return fallback }
  return value
}

// Message handlers from devtools panel ---------------------------------------
const ONMESSAGE = {
  ADD_RULER: RULER().add,

  UPDATE_RULER (data, id) {
    RULER.get(id).update(data)
  },

  RESET_RULER (list) {
    const nodes = RULER.all()
    const len = Math.max(list.length, nodes.length)

    for (let i = 0; i < len; i++) {
      const node = nodes[i]
      const data = list[i]

      if ( node &&  data) { RULER(node).update(data); continue }
      if ( node && !data) { RULER(node).remove(); continue }
      if (!node &&  data) { RULER().add(data); continue }
    }
  },

  ADD_GRID: GRID().add,

  UPDATE_GRID (data, id) {
    const manager = GRID.get(id)
    manager.update(data)
    manager.notify()
  },

  RESET_GRID (list) {
    const nodes = GRID.all()
    const len = Math.max(list.length, nodes.length)

    for (let i = 0; i < len; i++) {
      const node = nodes[i]
      const data = list[i]

      if ( node &&  data) {
        const manager = GRID(node)
        manager.update(data)
        manager.notify()
        continue
      }

      if ( node && !data) { GRID(node).remove(); continue }
      if (!node &&  data) { GRID().add(data); continue }
    }
  }
}

// Start listening for incoming message from the devtools panel
// ----------------------------------------------------------------------------
browser.runtime.onConnect.addListener(port => {
  function onMsg ({action, id, data}) {
    ONMESSAGE[action](data, id)
  }

  port.onMessage.addListener(onMsg)
  port.onDisconnect.addListener(() => {
    port.onMessage.removeListener(onMsg)
    GRID.all().forEach(node => GRID(node).remove())
    RULER.all().forEach(node => RULER(node).remove())
  })

  CONNECTION = port
})
