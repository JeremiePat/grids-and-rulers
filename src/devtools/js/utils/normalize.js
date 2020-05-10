const IS_NUM = /^\d*\.*\d+$/
const IS_PERCENT = /^\d+(?:\.\d+)?%$/

function opacity (value) {
  if (IS_PERCENT.test(value)) {
    value = Math.round(Math.min(Math.max(Number(value.slice(0, -1)), 0), 100))
  } else if (IS_NUM.test(value)) {
    value = Math.round(Math.min(Math.max(Number(value), 0), 1) * 100)
  } else {
    value = 100
  }

  return { scale: value/100, percent: `${value}%` }
}

function length (value) {
  if (IS_NUM.test(value)) {
    return `${+value % 1 === 0 ? value : value.toFixed(2)}px`
  }

  return value
}

const normalize = {
  orientation: raw => raw === 'vertical' ? 'vertical' : 'horizontal',
  thickness:   length,
  position:    length,
  columns:     raw => Math.max(+raw, 1) || 1,
  opacity:     raw => opacity(raw).percent,
  gutter:      length,
  margin:      length,
  height:      length,
  width:       length,
  color:       raw => raw,
  size:        raw => `(${length(raw)})`,
  x:           length,
  y:           length
}

export default normalize
export { opacity, length }
