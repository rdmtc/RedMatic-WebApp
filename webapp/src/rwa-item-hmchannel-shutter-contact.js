import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import {RwaItemHmchannel} from './rwa-item-hmchannel.js';

class RwaItemHmchannelShutterContact extends RwaItemHmchannel {
    static get template() {
        return html`
       <style include="shared-styles">

       </style>
       
        <rwa-item title="[[_replaceChannelName(name, sub)]]" unreach="[[values.UNREACH]]" lowbat="[[values.LOWBAT]]">
           <div slot="control"><rwa-timespan timestamp="[[lastchange.STATE]]"></rwa-timespan><span class$="[[_classValue(values.STATE)]]">[[_formatValue(values.STATE)]]</span></div>
        </rwa-item>
      
    `;
    }

    _formatValue(val) {
        return val ? 'Offen' : 'Geschlossen';
    }
}

window.customElements.define('rwa-item-hmchannel-shutter-contact', RwaItemHmchannelShutterContact);

export {RwaItemHmchannelShutterContact};
