import html from '../utils/html.js'

const _ = browser.i18n.getMessage
const RGX_CALC = /^calc\(/

// UTILS ----------------------------------------------------------------------
const updateField = (node, data) => name => {
  const input = node.querySelector(`#${node.id}-${name}`)
  input.value = data[name]
  input.classList.toggle('large', RGX_CALC.test(data[name]))

  if (name === 'opacity') {
    node.classList.toggle('disabled', +data.opacity === 0)
  } else if (name === 'orientation') {
    node.querySelector(`label[for="${node.id}-thickness"] span`).innerText =
      data.orientation === 'horizontal' ? _('LabelHeight') : _('LabelWidth')
    node.querySelector(`label[for="${node.id}-position"] span`).innerText =
      data.orientation === 'horizontal' ? _('LabelY') : _('LabelX')
  }
}

// PUBLIC API -----------------------------------------------------------------
// Provide a list of all rulers DOM UI
function all () {
  return [...document.querySelectorAll(`#ruler .row`)]
}

// Create a new ruler DOM UI
function create (key) {
  return html`
    <div class="row" id="ruler-${key}">
      <div class="head">${_('CellRuler', [key])}</div>

      <div class="param">
        <label for="ruler-${key}-orientation">
          ${_('LabelOrientation')}
          <select id="ruler-${key}-orientation">
            <option value="horizontal">${_('LabelHorizontal')}</option>
            <option selected value="vertical">${_('LabelVertical')}</option>
          </select>
        </label>

        <div class="group">
          <span><label for="ruler-${key}-position"><span>${_('LabelX')}</span> <input value="50vw" id="ruler-${key}-position" /></label></span>
          <span><label for="ruler-${key}-thickness"><span>${_('LabelWidth')}</span> <input value="1px" id="ruler-${key}-thickness" /></label></span>
        </div>
      </div>

      <div class="color">
        <label for="ruler-${key}-color">${_('LabelColor')} <input type="color" value="#ff0000" id="ruler-${key}-color" /></label>
        <label for="ruler-${key}-opacity">${_('LabelOpacity')} <input type="number" id="ruler-${key}-opacity" value="0.5" min="0" max="1" step="0.1" formnovalidate /></label>
      </div>

      <div class="end">
        <button title="${_('BtnDeleteRuler', key)}" value="ruler-${key}" class="delete">X</button>
      </div>
    </div>`
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
