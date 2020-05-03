function innerGRID (param) {
  const isVertical = param.orientation === 'vertical'
  const col = +param.columns > 0 ? +param.columns : 1
  const gap = normalize(param.gutter, '1px')
  const mrg = normalize(param.margin, '0px')
  let x = normalize(param.x, '100%')
  let y = normalize(param.y, '100%')

  const grid = document
    .createRange()
    .createContextualFragment(`
      <div class="--ext--inner">
        <div class="--ext--margin" style="
          ${isVertical ? 'width' : 'height'}: ${mrg};
          ${isVertical ? 'left'  : 'top'   }: 0px;
          transform: ${isVertical ? `translateX(-${mrg})` : `translateY(-${mrg})` };
        "></div>
        <div class="--ext--column"></div>
        ${Array(col-1).fill(`
        <div class="--ext--gutter" style="${isVertical ? 'width' : 'height'}:${gap}"></div>
        <div class="--ext--column"></div>
        `).join('')}
        <div class="--ext--margin" style="
          ${isVertical ? 'width' : 'height'}: ${mrg};
          ${isVertical ? 'right' : 'bottom'}: 0px;
          transform: ${isVertical ? `translateX(${mrg})` : `translateY(${mrg})` };
        "></div>
      </div>
    `).children[0]

  grid.classList.toggle('--ext--vertical',    isVertical)
  grid.classList.toggle('--ext--horizontal', !isVertical)

  Object.assign(grid.style, {
    opacity: param.opacity,
    color:   param.color,
    width:   normalize(param.width,  '100%'),
    height:  normalize(param.height, '100%'),
    top:  (y === 'top')    ? '0px' :
          (y === 'center') ? '50%' :
          (y === 'bottom') ? ''    : y,
    left: (x === 'left')   ? '0px' :
          (x === 'center') ? '50%' :
          (x === 'right')  ? ''    : x,
    right:  (x === 'right')  ? '0px' : '',
    bottom: (y === 'bottom') ? '0px' : '',
    transform: `translate(${
      x === 'center' ? '-50%' : '0'},${
      y === 'center' ? '-50%' : '0'})`
  })

  return grid
}

const GRID = node => {
  // PRIVATE FUNTIONS ---------------------------------------------------------
  function columnSize () {
    const col = node.querySelector(`.${EXT_PREFIX}column`)
    const inner = node.querySelector(`.${EXT_PREFIX}inner`)

    return getComputedStyle(col)[
      inner.classList.contains(`${EXT_PREFIX}vertical`) ? 'width' : 'height'
    ]
  }

  function resize () {
    node.style.width  = document.body.scrollWidth  + 'px'
    node.style.height = document.body.scrollHeight + 'px'
    notify()
  }

  // PUBLIC API ---------------------------------------------------------------
  function id () {
    return node.id.replace(EXT_PREFIX, '')
  }

  function notify () {
    CONNECTION.postMessage({
      action: 'UPDATE_GRID', id: id(),
      data: {
        size: columnSize()
      }
    })
  }

  function update (param) {
    node.style.width  = document.body.scrollWidth  + 'px'
    node.style.height = document.body.scrollHeight + 'px'

    while (node.firstChild) { node.removeChild(node.firstChild) }
    node.append(innerGRID(param))
  }

  function remove () {
    window.removeEventListener('resize', resize)
    node.remove()
  }

  function add (param) {
    node = document.createElement('div')
    node.className = `${EXT_PREFIX}grid`
    node.id = `${EXT_PREFIX}grid-${GRID.all().length + 1}`

    update(param)
    document.body.append(node)
    window.addEventListener('resize', resize)
    notify()
  }

  return { id, add, update, remove, notify }
}

GRID.get = id => {
  return GRID(document.getElementById(`${EXT_PREFIX}${id}`))
}

GRID.all = () => {
  return document.body.querySelectorAll(`.${EXT_PREFIX}grid`)
}
