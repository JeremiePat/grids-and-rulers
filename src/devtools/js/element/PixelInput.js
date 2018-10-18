import { wire } from '../../../lib/hyperhtml.js'

function PixelInput (param) {
  return wire(param)`
    <span class=${param.hidden ? 'input hidden' : 'input'}>
      <input type=number min=0 step=1
             name=${param.name}
             value=${param.value}
             oninput=${param.action}>px
    </span>`
}

export default PixelInput
