import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import './shared-styles.js';
import './rwa-item.js';
import {RwaItemHmchannel} from './rwa-item-hmchannel.js';

class RwaItemHmchannelSwitch extends RwaItemHmchannel {
    static get template() {
        return html`
       <style include="shared-styles">
       </style>
       
        <rwa-item title="[[_replaceChannelName(name, sub)]]" unreach="[[values.UNREACH]]" lowbat="[[values.LOWBAT]]">
             <paper-toggle-button slot="control" checked="[[values.STATE]]" on-checked-changed="_checkedChanged"></paper-toggle-button>
        </rwa-item>
      
     
    `;
    }

    static get properties() {
        return {

        };
    }

    _checkedChanged(e) {
        if (this.values && this.values.STATE !== e.detail.value) {
            this.setValue({STATE: e.detail.value});
        }
    }
}

window.customElements.define('rwa-item-hmchannel-switch', RwaItemHmchannelSwitch);

export {RwaItemHmchannelSwitch};
