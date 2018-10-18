import { wire }     from '../../../lib/hyperhtml.js'
import { _ }        from '../../../lib/browser.js'

import Button       from './Button.js'
import CheckBox     from './CheckBox.js'
import PixelInput   from './PixelInput.js'
import ColorInput   from './ColorInput.js'
import NumberInput  from './NumberInput.js'
import PercentInput from './PercentInput.js'

function GridConfig(g) {
  return wire(g)`
  <div class="grid">
    ${g.data.map(grid => wire(grid)`
    <div class="head flex">
      ${Button({
        type:   grid.active ? 'toggle' : 'toggle hidden',
        value:  grid.id,
        action: g.ui.toggle,
        label:  _('BtnToggleGrid')
      })}

      <label class="color">
        ${_('LabelColor')}
        ${ColorInput({
          value:  grid.color,
          name:   grid.id + '-color',
          action: g.ui.update
        })}
      </label>

      <label class="opacity stretch">
        ${_('LabelOpacity')}
        ${PercentInput({
          value:  grid.opacity,
          name:   grid.id + '-opacity',
          action: g.ui.update
        })}
      </label>

      ${Button({
        type:   'delete',
        value:  grid.id,
        action: g.ui.remove,
        label:  _('BtnDeleteGrid')
      })}
    </div>

    <div class="cell first">${_('RowHeaderColumns')}</div>
    <div class="cell">
      <code>W:</code>
      (${PixelInput({
        value:  grid.colSize,
        name:   grid.id + '-colSize',
        action: g.ui.update
      })}
      +
      ${PixelInput({
        value:  grid.colGutter,
        name:   grid.id + '-colGutter',
        action: g.ui.update
      })})
      x
      ${NumberInput({
        value:  grid.colNumber,
        name:   grid.id + '-colNumber',
        action: g.ui.update
      })}
    </div>
    <div class="cell last">
      <select name=${grid.id + '-colPos'} oninput=${g.ui.update}>
        <option selected=${grid.colPos === 'left'        }>left</option>
        <option selected=${grid.colPos === 'center'      }>center</option>
        <option selected=${grid.colPos === 'right'       }>right</option>
        <option selected=${grid.colPos === +grid.colPos} value="0">custom</option>
      </select>

      ${PixelInput({
        hidden: grid.colPos !== +grid.colPos,
        value:  grid.colPos === +grid.colPos ? grid.colPos : 0,
        name:   grid.id + '-colPos',
        action: g.ui.update
      })}

      ${CheckBox({
        name:    grid.id + '-colOutside',
        checked: grid.colOutside,
        label:   _('CBLabelAddGutter'),
        action:  g.ui.update
      })}
    </div>

    <div class="cell first">${_('RowHeaderRows')}</div>
    <div class="cell">
      <code>H:</code>
      (${PixelInput({
        value:  grid.rowSize,
        name:   grid.id + '-rowSize',
        action: g.ui.update
      })}
      +
      ${PixelInput({
        value:  grid.rowGutter,
        name:   grid.id + '-rowGutter',
        action: g.ui.update
      })})
      x
      ${NumberInput({
        value:  grid.rowNumber,
        name:   grid.id + '-rowNumber',
        action: g.ui.update
      })}
    </div>
    <div class="cell last">
      <select name=${grid.id + '-rowPos'} oninput=${g.ui.update}>
        <option selected=${grid.rowPos === 'top'         }>top</option>
        <option selected=${grid.rowPos === 'center'      }>center</option>
        <option selected=${grid.rowPos === 'bottom'      }>bottom</option>
        <option selected=${grid.rowPos === +grid.rowPos} value="0">custom</option>
      </select>

      ${PixelInput({
        hidden: grid.rowPos !== +grid.rowPos,
        value:  grid.rowPos === +grid.rowPos ? grid.rowPos : 0,
        name:   grid.id + '-rowPos',
        action: g.ui.update
      })}

      ${CheckBox({
        name:    grid.id + '-rowOutside',
        checked: grid.rowOutside,
        label:   _('CBLabelAddSeparator'),
        action:  g.ui.update
      })}
    </div>`
    )}
  </div>`
}

export default GridConfig
