const _        = browser.i18n.getMessage
const storage  = browser.storage.local
const runtime  = browser.runtime
const devtools = browser.devtools

// const _ = (id) => { return id }
// const storage = { set(){ return Promise.resolve() }, get(){ return Promise.resolve() } }
// const runtime = { connect() { return { postMessage(){}, onMessage: { addListener() {} } } } }
// const devtools = { inspectedWindow: { tabId: 0 } }

export { _, storage, runtime, devtools }
