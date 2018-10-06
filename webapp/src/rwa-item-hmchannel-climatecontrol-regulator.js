import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import '@polymer/paper-input/paper-input.js';
import {RwaItemHmchannel} from './rwa-item-hmchannel.js';

class RwaItemHmchannelClimatecontrolRegulator extends RwaItemHmchannel {
    static get template() {
        return html`
            <style include="shared-styles">
                #control {
                    white-space: nowrap;
                }
                paper-input {
                    margin-top: -22px;
                    width: 68px;
                    min-width: 68px;
                }
                paper-input {
                    --paper-input-container: {
                        padding: 0;
                    }
                }
            </style>
            <rwa-item title="[[_replaceChannelName(name, sub)]]" unreach="[[values.UNREACH]]" lowbat="[[values.LOWBAT]]">
                <div id="control" slot="control">
                    <paper-input id="setpoint" value="[[values.SETPOINT]]" on-change="_change" min="6" max="30" step="0.5" type="number">
                        <div slot="suffix">°C</div>
                    </paper-input>
                </div>
            </rwa-item>
        `;
    }

    _change() {
        this.setValue({SETPOINT: parseFloat(this.$.setpoint.value)});
    }
}

window.customElements.define('rwa-item-hmchannel-climatecontrol-regulator', RwaItemHmchannelClimatecontrolRegulator);
