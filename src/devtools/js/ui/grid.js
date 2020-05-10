import html from '../utils/html.js'
import normalize, { opacity } from "../utils/normalize.js";

const _ = browser.i18n.getMessage
const RGX_CALC = /^calc\(/

// UTILS ----------------------------------------------------------------------

const updateField = (node, data) => name => {
  const value = normalize[name](data[name])
  const input = node.querySelector(`#${node.id}-${name}`)

  if (input.nodeName === 'INPUT' || input.nodeName === 'SELECT') {
    input.value = value
  } else {
    input.innerText = value
  }

  input.classList.toggle('large', RGX_CALC.test(value))

  if (name === 'opacity') {
    node.classList.toggle('disabled', value === '0%')
  } else if (name === 'orientation') {
    node.querySelector(`#${node.id}-columns`).setAttribute('aria-label',
      _(value === 'horizontal' ? 'LabelRows' : 'LabelColumns'))
    node.querySelector(`#${node.id}-size`).title =
      _(value === 'horizontal' ? 'LabelRowSize' : 'LabelColumnSize')
  }
}

// PUBLIC API -----------------------------------------------------------------
// Provide a list of all grids DOM UI
function all () {
  return document.querySelectorAll(`#grid section`)
}

// Create a new grid DOM UI
function create (key) {
  return html`
    <section id="grid-${key}">
      <div class="title">
        <span>
          ${_('CellGrid', [key])}
          <input aria-label="${_('LabelColor')}" type="color" value="#0066ff" id="grid-${key}-color" />
          <input aria-label="${_('LabelOpacity')}" class="opacity" value="50%" id="grid-${key}-opacity" />
        </span>
      </div>

        <div class="orientation">
          <span>
            <select id="grid-${key}-orientation" aria-label="${_('LabelOrientation')}">
              <option value="vertical" selected>${_('ValueColumn')}</option>
              <option value="horizontal">${_('ValueRow')}</option>
            </select>
            <input aria-label="${_('LabelColumns')}" type="number" value="8" min="1" id="grid-${key}-columns" />
            <small id="grid-${key}-size" title="${_('LabelColumnSize')}">(90px)</small>
          </span>
        </div>

        <label class="gutter" for="grid-${key}-gutter">
          <span>${_('LabelGutter')}</span>
          <input value="1rem" id="grid-${key}-gutter" />
        </label>

        <label class="margin" for="grid-${key}-margin">
          <span>${_('LabelMargin')}</span>
          <input value=".5rem" id="grid-${key}-margin" />
        </label>

        <label class="width" for="grid-${key}-width" >
          <span>${_('LabelWidth') }</span>
          <input value="832px" id="grid-${key}-width" />
        </label>

        <label class="height" for="grid-${key}-height">
          <span>${_('LabelHeight')}</span>
          <input value="100%" id="grid-${key}-height" />
        </label>

        <label class="x" for="grid-${key}-x">
          <span>${_('LabelX')}</span>
          <input value="center" id="grid-${key}-x" />
        </label>

        <label class="y" for="grid-${key}-y">
          <span>${_('LabelY')}</span>
          <input value="0" id="grid-${key}-y" />
        </label>
      </div>

      <div class="action">
        <button title="${_('BtnDeleteGrid', key)}" value="grid-${key}" class="delete">${_('LabelDelete')}</button>
      </div>
    </section>`
}

// Fill up a given grid DOM UI with some data
function update (node, param) {
  Object.keys(param).forEach(updateField(node, param))
}

// Extract all the values from a grid DOM UI
function data (node) {
  return {
    orientation: node.querySelector(`#${node.id}-orientation`).value.trim(),
    columns: node.querySelector(`#${node.id}-columns`).value.trim(),
    opacity: opacity(node.querySelector(`#${node.id}-opacity`).value.trim()).scale,
    gutter: node.querySelector(`#${node.id}-gutter`).value.trim(),
    margin: node.querySelector(`#${node.id}-margin`).value.trim(),
    height: node.querySelector(`#${node.id}-height`).value.trim(),
    width: node.querySelector(`#${node.id}-width`).value.trim(),
    color: node.querySelector(`#${node.id}-color`).value.trim(),
    x: node.querySelector(`#${node.id}-x`).value.trim(),
    y: node.querySelector(`#${node.id}-y`).value.trim()
  }
}

export default { all, create, update, data }
