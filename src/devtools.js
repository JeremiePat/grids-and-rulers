import Store from './devtools/js/utils/store.js'
import message from './devtools/js/utils/message.js'

// Setup control pannel
browser.devtools.panels.create(
  browser.i18n.getMessage("extensionName"), // title
  `img/icon-small-${browser.devtools.panels.themeName === 'dark' ? 'dark' : 'light'}.png`, // icon
  "devtools/panel.html" // content
)

// Display grids and rulers each time devtools
// are open or the tab is reloaded
async function reset () {
  const store = new Store()
  const data = await store.get()

  if (!data || (data.ruler.length === 0 && data.grid.length === 0)) {
    return
  }

  // RESET RULERS -----------------
  message.send({ action: 'RESET_RULER', data: data.ruler })

  // RESET GRIDS ------------------
  message.send({ action: 'RESET_GRID', data: data.grid })
}

// Call when devtools open, before panel is open
reset()

// Listen for some messages from the inspected Tab
message.listen(async ({action, id, data}) => {
  // Send back info if the page is reloaded
  if (action === 'TAB_RELOADED') { reset() }

  // Save incoming changes about rulers from the tab
  // This is important if the panel isn't open yet
  if (action === 'UPDATE_RULER') {
    const index = Number(id.split('-')[1]) - 1
    const cache = new Store()
    const cData = await cache.get()
    Object.assign(cData.ruler[index], data)
    await cache.save()
  }
})
