import { wire } from '../../../lib/hyperhtml.js'

function NumberInput (param) {
  return wire(param)`
    <span class=${'input small'}>
      <input type=number min=0 step=1
             name=${param.name}
             value=${param.value}
             oninput=${param.action}>
    </span>`
}

export default NumberInput
