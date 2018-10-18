import { wire } from '../../../lib/hyperhtml.js'

function PercentInput (param) {
  return wire(param)`
    <span class=${'input'}>
      <input type=number min=0 step=1 max=100
             name=${param.name}
             value=${param.value}
             oninput=${param.action}>%
    </span>`
}

export default PercentInput
