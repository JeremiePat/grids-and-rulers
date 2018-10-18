
// HELPER
// ----------------------------------------------------------------------------
function preventSelect (e) {
  e.preventDefault()
}

// We maintain a list of all rulers as we need to controle them
// both from the content page as well as from the devtools panel
// ----------------------------------------------------------------------------
const rulers = {}


// Ruler manager class definition
// ----------------------------------------------------------------------------
class Ruler {
  constructor (data) {
    this.ruler = document.createElement('div')
    this.label = document.createElement('span')

    this.ruler.className = '--ruler--'
    this.label.className = '--label--'

    this.ruler.append(this.label)

    this.evt = {
      drag: (e) => {
        this.position(point)
      },

      resize: () => {
        this.resize()
      },

      startDrag: () => {
        this.label.classList.toggle('--show--', true)
        window.addEventListener('mousemove', this.evt.drag)
        window.addEventListener('selectstart', preventSelect)
      },

      stopDrag: () => {
        this.label.classList.toggle('--show--', false)
        window.removeEventListener('mousemove', this.evt.drag)
        window.removeEventListener('selectstart', preventSelect)
        browser.runtime.sendMessage({ action: 'UPDATE_RULER_HARD', data: this.data })
      }
    }

    this.ruler.addEventListener('mousedown', this.evt.startDrag)
    window.addEventListener('mouseup', this.evt.stopDrag)
    window.addEventListener('resize',  this.evt.resize)

    this.update(data)

    document.body.prepend(this.ruler)

    rulers[this.data.id] = this
  }

  update (data) {
    this.data = data

    // Orientation
    this.dir = data.orientation === 'horizontal' ? 'h' : 'v'
    this.ruler.classList.toggle('--v--', this.dir === 'v')
    this.ruler.classList.toggle('--h--', this.dir === 'h')
    this.resize()

    // Position
    this.position({ x: data.position, y: data.position })

    // Visibility
    this.ruler.style.display = data.active ? 'block' : 'none'

    // Color
    this.ruler.style.backgroundColor = data.color
    this.label.style.backgroundColor = data.color
    this.ruler.style.opacity = data.opacity / 100
  }

  resize () {
    this.ruler.style.height = this.dir === 'h' ? '1px' : `${document.body.clientHeight}px`
    this.ruler.style.width  = this.dir === 'v' ? '1px' : `${document.body.clientWidth}px`
  }

  position (point) {
    this.ruler.style.left  = this.dir === 'h' ?          '0px' : `${point.x}px`
    this.ruler.style.top   = this.dir === 'v' ?          '0px' : `${point.y}px`
    this.label.textContent = this.dir === 'h' ? `${point.y}px` : `${point.x}px`
    this.data.position     = this.dir === 'h' ?    point.y     :    point.x
  }

  remove () {
    this.evt.stopDrag()
    this.ruler.removeEventListener('mousedown', this.evt.startDrag)
    window.removeEventListener('mouseup', this.evt.stopDrag)
    window.removeEventListener('resize',  this.evt.resize)
    this.label.remove()
    this.ruler.remove()
    delete this.label
    delete this.ruler
    delete rulers[this.data.id]
  }
}

// INTERACTION
// ----------------------------------------------------------------------------

const point  = { x: 0, y: 0}

window.addEventListener('mousemove', (e) => {
  point.x = e.pageX
  point.y = e.pageY
})

window.addEventListener('scroll', (e) => {
  point.x = e.pageX + document.documentElement.clientWidth  / 2
  point.y = e.pageY + document.documentElement.clientHeight / 2
})
