import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import {RwaItemHmchannel} from './rwa-item-hmchannel.js';

class RwaItemHmchannelMotiondetectorTransceiver extends RwaItemHmchannel {
    static get template() {
        return html`
       <style include="shared-styles">
            #values {
                width: calc(100% - 80px);
                text-align: right;
            }
            .switch {
                display: flex;
                flex-direction: row-reverse;
            }
       </style>
       
        <rwa-item title="[[_replaceChannelName(name, sub)]]" collapse unreach="[[values.UNREACH]]" lowbat="[[values.LOWBAT]]">
           <div slot="control"><rwa-timespan timestamp="[[lastchange.MOTION]]"></rwa-timespan><span class$="[[_classValue(values.MOTION)]]">[[_formatValue(values.MOTION)]]</span></div>
             <div slot="collapse">
                <div id="values">
                    <div><span>Helligkeit:</span> <span>[[values.ILLUMINATION]]</span></div>
                    <div class="switch"><paper-toggle-button slot="control" checked="[[values.MOTION_DETECTION_ACTIVE]]" on-checked-changed="_checkedChanged"></paper-toggle-button></div>
                </div>
             </div>
         </rwa-item>
      
    `;
    }

    _formatValue(val) {
        return val ? 'Bewegung erkannt' : 'Keine Bewegung';
    }

    _checkedChanged(e) {
        this.setValue({MOTION_DETECTION_ACTIVE: e.detail.value});
    }
}

window.customElements.define('rwa-item-hmchannel-motiondetector-transceiver', RwaItemHmchannelMotiondetectorTransceiver);
