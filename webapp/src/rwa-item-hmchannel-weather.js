import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import {RwaItemHmchannel} from './rwa-item-hmchannel.js';

class RwaItemHmchannelWeather extends RwaItemHmchannel {
    static get template() {
        return html`
       <style include="shared-styles">
            #values {
                width: calc(100% - 80px);
                text-align: right;
            }
       </style>
       
        <rwa-item title="[[_replaceChannelName(name, sub)]]" collapse unreach="[[values.UNREACH]]" lowbat="[[values.LOWBAT]]">
           <div slot="control"><span>[[_formatValue(values.TEMPERATURE)]]</span><span>°C</span></div>
             <div slot="collapse">
                <div id="values">
                    <span>Luftfeuchte:</span> <span>[[values.HUMIDITY]]</span><span>%</span>
                <div>
             </div>
         </rwa-item>
      
     
    `;
    }

    _formatValue(val) {
        return val.toFixed(1).replace('.', ',');
    }

    static get properties() {
        return {

        };
    }

    connectedCallback() {
        super.connectedCallback();
    }
}

window.customElements.define('rwa-item-hmchannel-weather', RwaItemHmchannelWeather);

export {RwaItemHmchannelWeather};
