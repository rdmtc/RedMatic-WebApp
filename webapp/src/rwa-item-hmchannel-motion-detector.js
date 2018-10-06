import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import {RwaItemHmchannel} from './rwa-item-hmchannel.js';
import './rwa-timespan.js';

class RwaItemHmchannelMotionDetector extends RwaItemHmchannel {
    static get template() {
        return html`
       <style include="shared-styles">
            #values {
                width: calc(100% - 80px);
                text-align: right;
            }
       </style>
       
        <rwa-item title="[[_replaceChannelName(name, sub)]]" collapse unreach="[[values.UNREACH]]" lowbat="[[values.LOWBAT]]">
           <div slot="control"><rwa-timespan timestamp="[[lastchange.MOTION]]"></rwa-timespan><span class$="[[_classValue(values.MOTION)]]">[[_formatValue(values.MOTION)]]</span></div>
             <div slot="collapse">
                <div id="values">
                <span>Helligkeit:</span> <span>[[values.BRIGHTNESS]]</span>
             </div>
         </div>
         </rwa-item>
      
    `;
    }

    _formatValue(val) {
        return val ? 'Bewegung erkannt' : 'Keine Bewegung';
    }
}

window.customElements.define('rwa-item-hmchannel-motion-detector', RwaItemHmchannelMotionDetector);
