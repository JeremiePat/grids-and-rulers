const keys = {}

// KeyBoardEvent.keyCode mapping
// ----------------------------------------------------------------------------
const code = {
  a: 65, b: 66, c: 67, d: 68, e: 69, f: 70, g: 71, h: 72, i: 73,
  j: 74, k: 75, l: 76, m: 77, n: 78, o: 79, p: 80, q: 81, r: 82,
  s: 83, t: 84, u: 85, v: 86, w: 87, x: 88, y: 89, z: 90
}

// Start listening for keyboard events
// ----------------------------------------------------------------------------
function onkeyup (e) {
  Object.keys(keys).forEach(id => {
    const key = keys[id]
    const match = key.altKey    === e.altKey   &&
                  key.shiftKey  === e.shiftKey &&
                  key.ctrlKey   === e.ctrlKey  &&
                  code[key.key] === e.keyCode

    if (match) {
      browser.runtime.sendMessage({
        action: 'TRIGGER_KEY',
        data: id
      })
    }
  })
}

window.addEventListener('keyup', onkeyup)
