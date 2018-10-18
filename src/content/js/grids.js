
// HELPERS
// ----------------------------------------------------------------------------

// Turn any template strings into an SVG data URI
function svguri (str, ...args) {
  const data = str.reduce((arr, s, i) => {
    arr.push(s)
    if (args[i]) { arr.push(args[i]) }
    return arr
  }, [])
    .join('')
    .replace(/\s+/g,    ' ')
    .replace(/>\s*</g, '><')
    .replace(/>/g,    '%3E')
    .replace(/</g,    '%3C')
    .replace(/#/g,    '%23')
    .trim()

  return `url('data:image/svg+xml,${data}')`
}

function bgColumn (data) {
  const { w, wg, wwg, color, opacity } = data

  return svguri`
    <svg xmlns="http://www.w3.org/2000/svg"
         width="${wwg}" height="${wwg}"
         viewBox="0 0 ${wwg} ${wwg}">
      <rect x="0" y="0"
            width="${w}" height="${wwg}"
            opacity="${opacity/4}" fill="${color}" />
      <rect x="${w}" y="0"
            width="${wg}" height="${wwg}"
            opacity="${opacity}" fill="${color}" />
    </svg>`
}

function bgRow (data) {
  const { h, hg, hhg, color, opacity } = data

  return svguri`
    <svg xmlns="http://www.w3.org/2000/svg"
         width="${hhg}" height="${hhg}"
         viewBox="0 0 ${hhg} ${hhg}">
      <rect x="0" y="0"
            width="${hhg}" height="${h}"
            opacity="${opacity/3}" fill="${color}" />
      <rect x="0" y="${h}"
            width="${hhg}" height="${hg}"
            opacity="${opacity}" fill="${color}" />
    </svg>`
}

// Grid manager class definition
// ----------------------------------------------------------------------------
class Grid {
  constructor (id) {
    this.grid = document.querySelector(`#${id} .--position--`)

    if (!this.grid) {
      const parent = document.createElement('div')
      parent.id = id
      parent.className = '--grid--'
      this.grid = document.createElement('div')
      this.grid.className = '--position--'

      parent.prepend(this.grid)
      document.body.prepend(parent)
    }
  }

  remove () {
    this.grid.parentElement.remove()
  }

  update (data) {
    if (!this.grid) { return }

    const color   = data.color

    // Set up grid pattern as CSS background images
    const w    = data.colSize > 0 ? data.colSize : 0
    const wg   = w > 0 ? data.colGutter : 0
    const wwg  = w + wg
    const h    = data.rowSize > 0 ? data.rowSize : 0
    const hg   = h > 0 ? data.rowGutter : 0
    const hhg  = h + hg

    const opacity = data.opacity / 100

    const ci  = w>0 ? bgColumn({w,wg,wwg,color,opacity}) : 'none'
    const ri  = h>0 ? bgRow({h,hg,hhg,color,opacity}) : 'none'
    const bgi = `${ci}, ${ri}`

    // Adjust size of the layer grid based on the number of line and column to display
    const width  = data.colNumber > 0 ? (wwg * data.colNumber + wg * (data.colOutside ? 1 : -1)) : 0
    const height = data.rowNumber > 0 ? (hhg * data.rowNumber + hg * (data.rowOutside ? 1 : -1)) : 0

    const bgp = `${data.colOutside ? wg : 0}px 0, 0 ${data.rowOutside ? hg : 0}px`

    // Set up style accordingly
    this.grid.style.display = data.active ? 'block' : 'none'

    this.grid.style.backgroundImage    = bgi
    this.grid.style.backgroundPosition = bgp
    this.grid.style.width   = width  > 0 ? `${width}px`  : null
    this.grid.style.height  = height > 0 ? `${height}px` : null

    this.grid.style.left = data.colPos > 0 ? `${data.colPos}px` : null
    this.grid.style.top  = data.rowPos > 0 ? `${data.rowPos}px` : null

    this.grid.classList.toggle('--left--',   data.colPos === 'left')
    this.grid.classList.toggle('--center--', data.colPos === 'center')
    this.grid.classList.toggle('--right--',  data.colPos === 'right')
    this.grid.classList.toggle('--top--',    data.rowPos === 'top')
    this.grid.classList.toggle('--middle--', data.rowPos === 'center')
    this.grid.classList.toggle('--bottom--', data.rowPos === 'bottom')
  }
}
