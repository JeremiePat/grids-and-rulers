import { bind, wire } from '../../lib/hyperhtml.js'
import { _ } from '../../lib/browser.js'

import AppManager  from './state.js'
import Tabs        from './element/Tabs.js'
import Button      from './element/Button.js'
import KeyConfig   from './element/KeyConfig.js'
import GridConfig  from './element/GridConfig.js'
import RulerConfig from './element/RulerConfig.js'

// Set up state binding
// ----------------------------------------------------------------------------
import './state/menu.js'
import './state/grids.js'
import './state/rulers.js'
import './state/keys.js'
import './state/message.js'

// Set up base DOM for application
// ----------------------------------------------------------------------------
function App (msg) {
  // If it's a soft update we avoid upating the DOM
  if(msg && msg.slice(-4) === 'SOFT') { return }

  const state = AppManager.state

  bind(document.body)`
    ${Tabs(state.tabs)}

    <article id="grids">
      <p>${_('GridDescription')}</p>
      <p>${Button({type: 'add', label: _('BtnAddGrid'), action: state.ui.grid.add})}</p>

      <section>
        ${GridConfig({
          data: Object.keys(state.grids).map(id => state.grids[id]),
          ui:   state.ui.grid
        })}
      </section>
    </article>

    <article id="rulers">
      <p>${_('RulerDescription')}</p>
      <p>
      ${Button({
        type: 'add', label: _('BtnAddRulerH'),
        action: () => { state.ui.ruler.add('horizontal') }
      })}
      ${Button({
        type: 'add', label: _('BtnAddRulerV'),
        action: () => { state.ui.ruler.add('vertical') }
      })}
      </p>

      <section>
        ${RulerConfig({
          data: Object.keys(state.rulers).map(id => state.rulers[id]),
          ui:   state.ui.ruler
        })}
      </section>
    </article>

    <article id="params">
      <p>${_('KeysDescription')}</p>

      <section>
        ${KeyConfig({
          data: Object.keys(state.keys).map(id => state.keys[id]),
          ui:   state.ui.keys
        })}
      </section>
    </article>`
}

// We're ready, time to turn it live
// ----------------------------------------------------------------------------
AppManager.addStateListener(App)
App()
