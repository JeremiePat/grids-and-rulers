import { wire } from '../../../lib/hyperhtml.js'

function KeyShortCut (param) {
  return wire(param)`
    <span class=key id=${param.id}>
      <label for=${param.id + '-ctrlKey'}>
        <input type=checkbox
               checked=${param.ctrlKey}
               name=${param.id + '-ctrlKey'}
               id=${param.id + '-ctrlKey'}
               oninput=${param.action}>
        CTRL
      </label>
      <label for=${param.id + '-shiftKey'}>
        <input type=checkbox
               checked=${param.shiftKey}
               name=${param.id + '-shiftKey'}
               id=${param.id + '-shiftKey'}
               oninput=${param.action}>
        SHIFT
      </label>
      <label for=${param.id + '-altKey'}>
        <input type=checkbox
               checked=${param.altKey}
               name=${param.id + '-altKey'}
               id=${param.id + '-altKey'}
               oninput=${param.action}>
        ALT
      </label> +
      <input type=text maxlength=1
             name=${param.id + '-key'}
             value=${param.key}
             oninput=${param.action}>
    </span>`
}

export default KeyShortCut
