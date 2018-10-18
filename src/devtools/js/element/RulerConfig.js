import { wire } from '../../../lib/hyperhtml.js'
import { _ }    from '../../../lib/browser.js'

import Button       from './Button.js'
import PixelInput   from './PixelInput.js'
import ColorInput   from './ColorInput.js'
import PercentInput from './PercentInput.js'

function RulerConfig(r) {
  return wire(r)`
    <div class=grid>
      ${r.data.map(ruler => wire(ruler)`
      <div class="head flex large">
        ${Button({
          type:   ruler.active ? 'toggle' : 'toggle hidden',
          label:  _('BtnToggleRuler'),
          value:  ruler.id,
          action: r.ui.toggle
        })}

        <label>
          ${_('LabelPosition')}
          ${PixelInput({
            name:   ruler.id + '-position',
            value:  ruler.position,
            action: r.ui.update
          })}
        </label>

        <label>
          ${_('LabelOrientation')}
          <select name=${ruler.id + '-orientation'} oninput=${r.ui.update}>
            <option selected=${ruler.orientation === 'horizontal'}>horizontal</option>
            <option selected=${ruler.orientation === 'vertical'}>vertical</option>
          </select>
        </label>

        <label class="color">
          ${_('LabelColor')}
          ${ColorInput({
            name:   ruler.id + '-color',
            value:  ruler.color,
            action: r.ui.update
          })}
        </label>

        <label class="opacity stretch">
          ${_('LabelOpacity')}
          ${PercentInput({
            name:   ruler.id + '-opacity',
            value:  ruler.opacity,
            action: r.ui.update
          })}
        </label>

        ${Button({
          type:   'delete',
          label:  _('BtnDeleteRuler'),
          value:  ruler.id,
          action: r.ui.remove
        })}
      </div>`
      )}
    </div>`
}

export default RulerConfig
