import html from '../utils/html.js'
import normalize, { opacity } from "../utils/normalize.js";

const _ = browser.i18n.getMessage
const RGX_CALC = /^calc\(/

// UTILS ----------------------------------------------------------------------
const updateField = (node, data) => name => {
  const value = normalize[name](data[name])
  const input = node.querySelector(`#${node.id}-${name}`)
  input.value = value
  input.classList.toggle('large', RGX_CALC.test(value))

  if (name === 'opacity') {
    node.classList.toggle('disabled', value === '0%')
  } else if (name === 'orientation') {
    node.querySelector(`label[for="${node.id}-thickness"] span`).innerText =
      value === 'horizontal' ? _('LabelHeight') : _('LabelWidth')
    node.querySelector(`label[for="${node.id}-position"] span`).innerText =
      value === 'horizontal' ? _('LabelY') : _('LabelX')
  }
}

// PUBLIC API -----------------------------------------------------------------
// Provide a list of all rulers DOM UI
function all () {
  return [...document.querySelectorAll(`#ruler section`)]
}

// Create a new ruler DOM UI
function create (key) {
  return html`
    <section id="ruler-${key}">
      <div class="title">
        <span>
          ${_('CellRuler', [key])}
          <input aria-label="${_('LabelColor')}" type="color" id="ruler-${key}-color" value="#ff0000">
          <input aria-label="${_('LabelOpacity')}" class="opacity" id="ruler-${key}-opacity" value="40%">
        </span>
      </div>

      <div class="orientation">
        <select id="ruler-${key}-orientation" aria-label="${_('LabelOrientation')}">
          <option value="vertical" selected>${_('LabelVertical')}</option>
          <option value="horizontal">${_('LabelHorizontal')}</option>
        </select>
      </div>

      <label class="position" for="ruler-${key}-position">
        <span>${_('LabelX')}</span>
        <input value="50vw" id="ruler-${key}-position" />
      </label>

      <label class="thickness" for="ruler-${key}-thickness">
        <span>${_('LabelWidth')}</span>
        <input value="1px" id="ruler-${key}-thickness" />
      </label>

      <div class="action">
        <button title="${_('BtnDeleteRuler', key)}" value="ruler-${key}" class="delete">${_('LabelDelete')}</button>
      </div>
    </section>`
}

// Fill up a given ruler DOM UI with some data
function update (node, data) {
  Object.keys(data).forEach(updateField(node, data))
}

// Extract all the values from a ruler DOM UI
function data (node) {
  return {
    orientation: node.querySelector(`#${node.id}-orientation`).value.trim(),
    thickness: node.querySelector(`#${node.id}-thickness`).value.trim(),
    position: node.querySelector(`#${node.id}-position`).value.trim(),
    opacity: node.querySelector(`#${node.id}-opacity`).value.trim(),
    color: node.querySelector(`#${node.id}-color`).value.trim()
  }
}

export default { all, create, update, data }
