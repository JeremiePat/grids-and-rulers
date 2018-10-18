import { wire } from '../../../lib/hyperhtml.js'
import { _ }    from '../../../lib/browser.js'

function Tabs (tabs) {
  return wire(tabs)`
    <ul class="tabs">
      ${tabs.map(tab => wire(tab)`
        <li class=${tab.active ? 'active' : false}>
          <a href=${tab.link} onclick=${tab.onclick}>
            ${_(tab.label)}
          </a>
        </li>`
      )}
    </ul>`
}

export default Tabs
