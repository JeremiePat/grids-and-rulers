import { wire } from '../../../lib/hyperhtml.js'
import { _ }    from '../../../lib/browser.js'

import KeyShortCut from './KeyShortCut.js'

function KeyConfig(k) {
  return wire(k)`
    <div class="grid keys">
    ${k.data.map(key => wire(key)`
      <div class="cell first">${_(key.id)}</div>
      <div class="cell last">
        ${KeyShortCut({
          id       : key.id,
          ctrlKey  : key.ctrlKey,
          shiftKey : key.shiftKey,
          altKey   : key.altKey,
          key      : key.key,
          action   : k.ui.update
        })}
        </div>`
    )}
    </div>`
}

export default KeyConfig
