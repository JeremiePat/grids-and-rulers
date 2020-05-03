const DATA_LIFE_TIME = 1000*60*60*24*365 // 1 year in ms

class Store {
  constructor () {
    this.domain = browser.devtools.inspectedWindow
      .eval('document.domain').then(info => info[0])
  }

  async get () {
    const domain = await this.domain
    const data = await browser.storage.local.get(domain)

    this.data = data[domain] || {access: Date.now(), ruler: [], grid: []}

    return this.data
  }

  async save () {
    const data = this.data
    const domain = await this.domain
    data.access = Date.now()
    await browser.storage.local.set({[domain]: data})
    await this.get() // Necessary to make sure that we sync up the current data with what is really stored
    await this.purge() // Clean up old data
  }

  async purge () {
    // We purge old data (not accessed for more than a year)
    // We could also do a more efficient purge on a per quota
    // basis but Firefox 75 does not support
    // browser.storage.local.getBytesInUse()
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/StorageArea/getBytesInUse#Browser_compatibility
    const data = await browser.storage.local.get()
    const old = Date.now() - DATA_LIFE_TIME
    const rm = Object.keys(data).filter(key => data[key].access < old)
    await browser.storage.local.remove(rm)
  }
}

export default Store
