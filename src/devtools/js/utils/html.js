// turn a template string into a DOM node or Array of DOM nodes
// const node = html`<span>Hello</span>`
// const nodeList = html`<span>Hello</span> <span>World</span>`
function html(str, ...keys) {
  const fragment = document
    .createRange()
    .createContextualFragment(
      str.reduce((arr, txt, i) => {
        arr.push(txt, keys[i] || '')
        return arr
      }, []).join('')
      // Sanitize unsafe tags
      .replace(/<\?(?:script|iframe|object|embed).*?>/g, '')
    )

  if (fragment.children.length === 1) {
    return fragment.children[0]
  }

  return Array.from(fragment.children);
}

export default html
