import { wire } from '../../../lib/hyperhtml.js'

function Button (param) {
  return wire(param)`
    <button class=${param.type}
            value=${param.value}
            title=${param.label}
            onclick=${param.action}>
      ${param.label}
    </button>`
}

export default Button
