import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import {RwaItemHmchannel} from './rwa-item-hmchannel.js';

class RwaItemHmchannelClimatecontrolVentDrive extends RwaItemHmchannel {
    static get template() {
        return html`
        <rwa-item title="[[_replaceChannelName(name, sub)]]" unreach="[[values.UNREACH]]" lowbat="[[values.LOWBAT]]">
           <div slot="control"><span>[[values.VALVE_STATE]]</span><span>%</span></div>
        </rwa-item>
    `;
    }
}

window.customElements.define('rwa-item-hmchannel-climatecontrol-vent-drive', RwaItemHmchannelClimatecontrolVentDrive);
