function link(theme) {
  return `themes/${theme === 'dark' ? 'dark' : 'light'}.css`
}

window.addEventListener('DOMContentLoaded', () => {
  const theme = browser.devtools.panels.themeName
  document.querySelector('link').href = link(theme)
})

if (browser.devtools.panels.onThemeChanged) {
  browser.devtools.panels.onThemeChanged.addListener(theme => {
    document.querySelector('link').href = link(theme)
  })
}
