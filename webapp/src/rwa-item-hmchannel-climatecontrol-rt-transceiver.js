import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import {RwaItemHmchannel} from './rwa-item-hmchannel.js';

class RwaItemHmchannelClimatecontrolRtTransceiver extends RwaItemHmchannel {
    static get template() {
        return html`
        <style include="shared-styles">
            #control {
                white-space: nowrap;
                display: flex;
            }
            paper-input {
                margin-top: -22px;
                display: inline-block;
                width: 68px;
                min-width: 68px;
            }
            paper-input {
                padding-right: 3px;
                --paper-input-container: {
                    padding: 0;
                }
            }
            paper-button {
                height: 24px;
                min-width: 92px;
            }
            #values {
                padding-top: 8px;
                width: calc(100% - 80px);
                text-align: right;
            }
            paper-dropdown-menu {
                top: -7px;
            }
            .collapse-buttons {
                padding-bottom: 8px;
            }
        </style>
        <rwa-item collapse title="[[_replaceChannelName(name, sub)]]" unreach="[[values.UNREACH]]" lowbat="[[values.LOWBAT]]">
            <div id="control" slot="control">
                
                <paper-input id="setpoint" value="[[values.SET_TEMPERATURE]]" on-change="_change" min="6" max="30" step="0.5" type="number">
                    <div slot="suffix">°C</div>
                </paper-input>
                <paper-button id="boost" raised toggles on-click="_boost">Boost</paper-button>
            </div>
            <div slot="collapse">
                <div id="values">
                    <paper-dropdown-menu label="Modus">
                        <paper-listbox id="mode" slot="dropdown-content" selected="[[values.CONTROL_MODE]]" on-selected-changed="_mode">
                            <paper-item>Auto</paper-item>
                            <paper-item>Manu</paper-item>
                            <paper-item disabled>Urlaub</paper-item>
                            <paper-item>Boost</paper-item>
                        </paper-listbox>
                    </paper-dropdown-menu>
                    
                    <span style="display: inline-block">
                        <div class="collapse-buttons"><paper-button on-click="_comfort" raised>Komfort</paper-button></div>
                        <div class=""><paper-button on-click="_eco" raised>Eco</paper-button></div>
                    </span>
                    
                    <template is="dom-if" if="[[_isDefined(values.ACTUAL_TEMPERATURE)]]">
                        <div class="">Gemessene Temperatur: <span>[[_format1Digit(values.ACTUAL_TEMPERATURE)]]</span>°C</div>
                    </template>
                    <template is="dom-if" if="[[_isDefined(values.VALVE_STATE)]]">
                        <div class="valve-state">Ventilöffnung: <span>[[values.VALVE_STATE]]</span> %</div>
                    </template>
                    <template is="dom-if" if="[[_isDefined(values.BATTERY_STATE)]]">
                        <div class="battery">Batteriespannung: <span>[[_format1Digit(values.BATTERY_STATE)]]</span> V</div>
                    </template>
                </div>
            </div>
        </rwa-item>
    `;
    }

    _isDefined(val) {
        return typeof val !== 'undefined';
    }

    _mode() {
        console.log('mode', this.$.mode.selected);
        switch (this.$.mode.selected) {
            case 0:
                this.$.boost.active = false;
                this.setValue({AUTO_MODE: true});
                break;
            case 1:
                this.$.boost.active = false;
                this.setValue({MANU_MODE: parseFloat(this.$.setpoint.value)});
                break;
            case 2:
                this.$.boost.active = false;
                this.setValue({PARTY_TEMPERATURE: parseFloat(this.$.setpoint.value)});
                break;
            case 3:
                this.$.boost.active = true;
                this._boost();
                break;
            default:
        }
    }

    _eco() {
        this.setValue({LOWERING_MODE: true});
    }

    _comfort() {
        this.setValue({COMFORT_MODE: true});
    }

    _boost() {
        if (this.$.boost.active) {
            console.log('boost!');
            this.setValue({BOOST_MODE: true});
        } else {
            console.log('stop boost!');
            this.setValue({SET_TEMPERATURE: parseFloat(this.$.setpoint.value)});
        }
    }

    _format1Digit(val) {
        return typeof val === 'undefined' ? '' : val.toFixed(1).replace('.', ',');
    }

    _change() {
        this.setValue({SET_TEMPERATURE: parseFloat(this.$.setpoint.value)});
    }
}

window.customElements.define('rwa-item-hmchannel-climatecontrol-rt-transceiver', RwaItemHmchannelClimatecontrolRtTransceiver);

export {RwaItemHmchannelClimatecontrolRtTransceiver};
