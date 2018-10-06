import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import {RwaItemHmchannel} from './rwa-item-hmchannel.js';

class RwaItemHmchannelSmokeDetector extends RwaItemHmchannel {
    static get template() {
        return html`
       <style include="shared-styles">
       </style>
       
        <rwa-item title="[[_replaceChannelName(name, sub)]]" unreach="[[values.UNREACH]]" lowbat="[[values.LOWBAT]]">
           <div slot="control"><span class$="[[_classValue(values.STATE)]]">[[_formatValue(values.STATE)]]</span></div>
         </rwa-item>
      
    `;
    }

    _formatValue(val) {
        return val ? 'Alarm: Rauch erkannt!' : 'Ok';
    }
}

window.customElements.define('rwa-item-hmchannel-smoke-detector', RwaItemHmchannelSmokeDetector);

export {RwaItemHmchannelSmokeDetector};
