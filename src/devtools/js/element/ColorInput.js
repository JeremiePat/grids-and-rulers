import { wire } from '../../../lib/hyperhtml.js'

function preview (e) {
  const text  = e.target.type === 'text' ? e.target : e.target.parentElement.parentElement.children[0]
  const color = e.target.type === 'color'? e.target : e.target.nextElementSibling.children[0]

  text.value  = e.target.value
  color.value = e.target.value

  color.parentElement.style.backgroundColor = e.target.value
}

function ColorInput (param) {
  return wire(param)`
    <span class=${'input color'}
          oninput=${preview}>
      <input type=text
             name=${param.name}
             value=${param.value}
             oninput=${param.action}>
      <span class=preview style=${`background:${param.value};`}>
        <input type=color
               name=${param.name}
               value=${param.value}
               oninput=${param.action}>
      </span>
    </span>`
}

export default ColorInput
