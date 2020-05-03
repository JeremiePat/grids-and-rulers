
const disableEvent = e => { e.preventDefault() }

const RULER = node => {
  // PRIVATE FUNTIONS ---------------------------------------------------------
  function isVertical () {
    return node.classList.contains(`${EXT_PREFIX}vertical`)
  }

  function notify (data) {
    CONNECTION.postMessage({
      action: 'UPDATE_RULER',
      id: id(), data
    })
  }

  const drag = offset => e => {
    const prop = isVertical() ? 'left' : 'top'
    const pointer = isVertical() ? e.screenX : e.screenY
    const maxPos = isVertical()
      ? (document.body.scrollWidth  - node.offsetWidth)
      : (document.body.scrollHeight - node.offsetHeight)

    const position = Math.min(Math.max(pointer - offset, 0), maxPos)

    node.style[prop] = position + 'px'
    notify({ position })
  }

  function startDrag (e) {
    const offset = isVertical() ? (e.screenX - node.offsetLeft) : (e.screenY - node.offsetTop)
    const dragging = drag(offset)

    function stop () {
      document.removeEventListener('mouseup', stop)
      document.removeEventListener('mousemove', dragging)
      document.removeEventListener('selectstart', disableEvent)
    }

    document.addEventListener('mouseup', stop)
    document.addEventListener('mousemove', dragging)
    document.addEventListener('selectstart', disableEvent)
  }

  function resize () {
    const param = isVertical()
      ? { height: document.body.scrollHeight + 'px' }
      : { width:  document.body.scrollWidth  + 'px' }

    Object.assign(node.style, param)
  }

  // PUBLIC API ---------------------------------------------------------------
  function id () {
    return node.id.replace(EXT_PREFIX, '')
  }

  function update (param) {
    const isV    = param.orientation === 'vertical'
    const top    =  isV ? '0px' : normalize(param.position, '0px')
    const left   = !isV ? '0px' : normalize(param.position, '0px')
    const width  = !isV ? document.body.scrollWidth  + 'px' : normalize(param.thickness, '0px')
    const height =  isV ? document.body.scrollHeight + 'px' : normalize(param.thickness, '0px')

    node.classList.toggle('--ext--vertical',    isV)
    node.classList.toggle('--ext--horizontal', !isV)

    Object.assign(node.style, {
      cursor: isV ? 'col-resize' : 'row-resize',

      top, left, width, height,

      color: param.color,
      opacity: param.opacity
    })
  }

  function remove () {
    window.removeEventListener('resize', resize)
    node.removeEventListener('mousedown', startDrag)
    node.remove()
  }

  function add (param) {
    node = document.createElement('div')
    node.className = `${EXT_PREFIX}ruler`
    node.id = `${EXT_PREFIX}ruler-${RULER.all().length + 1}`

    update(param)
    document.body.append(node)

    node.addEventListener('mousedown', startDrag)
    window.addEventListener('resize', resize)
  }

  return { id, add, update, remove }
}

RULER.get = id => {
  return RULER(document.getElementById(`${EXT_PREFIX}${id}`))
}

RULER.all = () => {
  return [...document.body.querySelectorAll(`.${EXT_PREFIX}ruler`)]
}
