
// Message handlers from devtools panel
// ----------------------------------------------------------------------------
const ONMESSAGE = {
  devtools: {
    close () {
      Array
        .from(document.querySelectorAll('.--grid--'))
        .forEach(n => n.remove())

      Object.keys(rulers).forEach(id => {
        rulers[id].remove()
      })
    }
  },

  grid: {
    remove (id)   { (new Grid(id)).remove() },
    add    (data) { (new Grid(data.id)).update(data) },
    update (data) { (new Grid(data.id)).update(data) }
  },

  ruler: {
    remove (id)   { rulers[id].remove() },
    add    (data) { new Ruler(data) },
    update (data) { rulers[data.id].update(data) }
  },

  key: {
    update (data) { keys[data.id] = data }
  }
}

// Start listening for incoming message from the devtools panel
// ----------------------------------------------------------------------------
browser.runtime.onMessage.addListener((msg) => {
  const {action, data} = msg
  const [command, target] = action.toLowerCase().split('_')

  if (ONMESSAGE[target] && ONMESSAGE[target][command]) {
    ONMESSAGE[target][command](data)
  }
})
