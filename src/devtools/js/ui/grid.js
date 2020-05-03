import html from '../utils/html.js'

const _ = browser.i18n.getMessage
const RGX_CALC = /^calc\(/

// UTILS ----------------------------------------------------------------------
const updateField = (node, param) => name => {
  const input = node.querySelector(`#${node.id}-${name}`)
  input.value = param[name]
  input.classList.toggle('large', RGX_CALC.test(param[name]))

  if (name === 'opacity') {
    node.classList.toggle('disabled', +param.opacity === 0)
  } else if (name === 'orientation') {
    node.querySelector(`label[for="${node.id}-columns"] span`).innerText =
      _(param.orientation === 'horizontal' ? 'LabelRows' : 'LabelColumns')
    node.querySelector(`label[for="${node.id}-size"]`).title =
      _(param.orientation === 'horizontal' ? 'LabelRowSize' : 'LabelColumnSize')
  }
}

// PUBLIC API -----------------------------------------------------------------
// Provide a list of all grids DOM UI
function all () {
  return document.querySelectorAll(`#grid .row`)
}

// Create a new grid DOM UI
function create (key) {
  return html`
    <div class="row" id="grid-${key}">
      <div class="head">${_('CellGrid', [key])}</div>

      <div class="param">
        <label for="grid-${key}-orientation">
          ${_('LabelOrientation')}
          <select id="grid-${key}-orientation">
            <option value="horizontal">${_('LabelHorizontal')}</option>
            <option value="vertical" selected>${_('LabelVertical')}</option>
          </select>
        </label>

        <div class="group">
          <span>
            <label for="grid-${key}-columns"><span>${_('LabelColumns')}</span><input type="number" value="8" min="1" id="grid-${key}-columns" /></label>
            <label title="${_('LabelColumnSize')}" for="grid-${key}-size"><input value="90px" id="grid-${key}-size" disabled /></label>
          </span>

          <span>
            <label for="grid-${key}-gutter">${_('LabelGutter')} <input value="1rem" id="grid-${key}-gutter" /></label>
            <label for="grid-${key}-margin">${_('LabelMargin')} <input value=".5rem" id="grid-${key}-margin" /></label>
          </span>
          <span>
            <label for="grid-${key}-width" >${_('LabelWidth') } <input value="832px" id="grid-${key}-width" /></label>
            <label for="grid-${key}-height">${_('LabelHeight')} <input value="100%" id="grid-${key}-height" /></label>
          </span>
          <span>
            <label for="grid-${key}-x">${_('LabelX')} <input value="center" id="grid-${key}-x" /></label>
            <label for="grid-${key}-y">${_('LabelY')} <input value="0" id="grid-${key}-y" /></label>
          </span>
        </div>
      </div>

      <div class="color">
        <label for="grid-${key}-color">${_('LabelColor')} <input type="color" value="#0066ff" id="grid-${key}-color" /></label>
        <label for="grid-${key}-opacity">${_('LabelOpacity')} <input type="number" value="0.5" id="grid-${key}-opacity" min="0" max="1" step="0.1" /></label>
      </div>

      <div class="end">
        <button title="${_('BtnDeleteGrid', key)}" value="grid-${key}" class="delete">X</button>
      </div>
    </div>`
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
    opacity: node.querySelector(`#${node.id}-opacity`).value.trim(),
    gutter: node.querySelector(`#${node.id}-gutter`).value.trim(),
    margin: node.querySelector(`#${node.id}-margin`).value.trim(),
    height: node.querySelector(`#${node.id}-height`).value.trim(),
    width: node.querySelector(`#${node.id}-width`).value.trim(),
    color: node.querySelector(`#${node.id}-color`).value.trim(),
    size: node.querySelector(`#${node.id}-size`).value.trim(),
    x: node.querySelector(`#${node.id}-x`).value.trim(),
    y: node.querySelector(`#${node.id}-y`).value.trim()
  }
}

export default { all, create, update, data }
