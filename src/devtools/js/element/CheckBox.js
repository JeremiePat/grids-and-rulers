import { wire } from '../../../lib/hyperhtml.js'

function CheckBox (param) {
  return wire(param)`
    <label for=${'id-' + param.name}>
      <input type="checkbox"
             id=${'id-' + param.name}
             name=${param.name}
             checked=${param.checked}
             oninput=${param.action}>
      ${param.label}
    </label>`
}

export default CheckBox
