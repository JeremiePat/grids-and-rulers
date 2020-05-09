import message from './utils/message.js'
import Store from './utils/store.js'
import ruler from './ui/ruler.js'
import grid from './ui/grid.js'
import html from './utils/html.js'

let CACHE = new Store()

// I18N -----------------------------------------------------------------------
const _ = browser.i18n.getMessage

document.querySelector('main').lang = browser.i18n.getUILanguage()
document.querySelector('label[for="globalGrid"] span').replaceWith(html`<span>${_('LabelPreserve')}</span>`)
document.querySelector('label[for="quickSelect"] span').innerText = _('QuickSelect')
document.getElementById('addRuler').innerText = _('BtnAddRuler')
document.getElementById('addGrid').innerText = _('BtnAddGrid')

// UI UTILS -------------------------------------------------------------------
const UI = { ruler, grid }

function scrollToNode (node) {
  const target = node.offsetTop
  const offset = document.querySelector('main header').offsetHeight

  window.scrollTo({
    top: target - offset,
    left: 0,
    behavior: 'smooth'
  })
}

async function updateQuickSelect () {
  const data = await CACHE.get()
  const node = document.getElementById('quickSelect')

  node.querySelector('optgroup:nth-of-type(1)').replaceWith(html`
    <optgroup label="${_('LabelRuler')}">
      ${data.ruler.map((d, index) => {
        return `<option value="ruler-${index + 1}">${_('CellRuler', [index + 1])}</option>`
      }).join('')}
    </optgroup>
  `)

  node.querySelector('optgroup:nth-of-type(2)').replaceWith(html`
    <optgroup label="${_('LabelGrid')}">
      ${data.grid.map((d, index) => {
        return `<option value="grid-${index + 1}">${_('CellGrid', [index + 1])}</option>`
      }).join('')}
    </optgroup>
  `)
}

// EVENTS HANDLERS ------------------------------------------------------------
async function onselect () {
  const data = await CACHE.get()
  const toggleNode = area => (node, i) => {
    const opacity = +data[area][i].opacity
    node.classList.toggle('selected', this.id === node.id)
    node.classList.toggle('disabled', this.id !== node.id && opacity === 0)
  }

  UI.ruler.all().forEach(toggleNode('ruler'))
  UI.grid.all().forEach(toggleNode('grid'))

  scrollToNode(this)
  document.getElementById('quickSelect').value = this.id
}

function onpick () {
  document.location.hash = `#${this.value}`
  onselect.call(document.getElementById(this.value))
}

async function onupdate (e) {
  const [area, index] = e.target.id.split('-')
  const data = await CACHE.get()
  const param = UI[area].data(this)

  UI[area].update(UI[area].all()[index - 1], param)
  onselect.call(this)

  data[area][index - 1] = param
  await CACHE.save()

  message.send({
    action: `UPDATE_${area.toUpperCase()}`,
    id: this.id,
    data: param
  })
}

async function ondelete (e) {
  const [area, index] = e.target.value.split('-')
  const list = UI[area].all()
  await CACHE.get()

  list[list.length - 1].remove()
  CACHE.data[area].splice(+index - 1, 1)
  await CACHE.save()

  CACHE.data[area].forEach((param, i) => {
    UI[area].update(list[i], param)
  })

  message.send({
    action: `RESET_${area.toUpperCase()}`,
    data: CACHE.data[area]
  })

  await updateQuickSelect()
}

async function onadd (e) {
  const area = e.target.value
  const parent = document.getElementById(area)
  const nextKey = (parent.children.length || 0) + 1

  const node = UI[area].create(nextKey)
  node.addEventListener('focusin', onselect)
  node.addEventListener('change', onupdate)
  node.querySelector('.delete').addEventListener('click', ondelete)
  parent.append(node)

  const data = UI[area].data(node)

  await CACHE.get()
  CACHE.data[area].push(data)
  await CACHE.save()

  message.send({
    action: `ADD_${area.toUpperCase()}`,
    data,
  })

  await updateQuickSelect()
  onpick.call({value: node.id})
}

// BOUND PANEL EVENT ----------------------------------------------------------
document.getElementById('addRuler').addEventListener('click', onadd)
document.getElementById('addGrid').addEventListener('click', onadd)
document.getElementById('quickSelect').addEventListener('change', onpick)

// RETRIEVE STORED DATA ON PANEL OPEN -----------------------------------------
async function initPanel () {
  const data = await CACHE.get()

  UI.ruler.all().forEach(node => node.remove())
  UI.grid.all().forEach(node => node.remove())
  await updateQuickSelect()

  if (!data || (data.ruler.length === 0 && data.grid.length === 0)) {
    return
  }

  ['ruler', 'grid'].forEach(area => {
    const parent = document.getElementById(area)
    message.send({ action: `RESET_${area.toUpperCase()}`, data: data[area] })

    data[area].forEach((param, index) => {
      const node = UI[area].create(index + 1)
      node.addEventListener('focusin', onselect)
      node.addEventListener('change', onupdate)
      node.querySelector('.delete').addEventListener('click', ondelete)

      UI[area].update(node, param)

      parent.append(node)
    })
  })
}

initPanel()

// LISTEN FOR INCOMING MESSAGE ------------------------------------------------
message.listen(async ({action, id, data}) => {
  if (
    action === 'UPDATE_GRID' ||
    action === 'UPDATE_RULER'
  ) {
    const [area, nbr] = id.split('-')
    const node = document.getElementById(id)

    UI[area].update(node, data)
    Object.assign(CACHE.data[area][+nbr - 1], data)
    await CACHE.save()
  }

  else if (
    action === 'TAB_RELOADED'
  ) {
    if (document.getElementById('globalGrid').checked) {
      const data = CACHE.data
      CACHE = new Store()
      CACHE.data = data
      await CACHE.save()
    } else {
      CACHE = new Store()
    }

    await initPanel()
  }
})
