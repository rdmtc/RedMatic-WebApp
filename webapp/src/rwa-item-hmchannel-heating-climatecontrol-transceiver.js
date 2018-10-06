import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import {RwaItemHmchannel} from './rwa-item-hmchannel.js';

class RwaItemHmchannelHeatingClimatecontrolTransceiver extends RwaItemHmchannel {
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
            </style>
            <rwa-item collapse title="[[_replaceChannelName(name, sub)]]" unreach="[[values.UNREACH]]" lowbat="[[values.LOWBAT]]">
                <div id="control" slot="control">
                    
                    <paper-input id="setpoint" value="[[values.SET_POINT_TEMPERATURE]]" on-change="_change" min="6" max="30" step="0.5" type="number">
                        <div slot="suffix">°C</div>
                    </paper-input>
                    <paper-button id="boost" raised toggles on-click="_boost" active="[[values.BOOST_MODE]]">Boost</paper-button>
                </div>
                <div slot="collapse">
                    <div id="values">
                        <paper-dropdown-menu label="Modus">
                            <paper-listbox id="mode" slot="dropdown-content" selected="[[values.SET_POINT_MODE]]" on-selected-changed="_mode">
                                <paper-item>Auto</paper-item>
                                <paper-item>Manu</paper-item>
                                <paper-item disabled>Urlaub</paper-item>
                            </paper-listbox>
                        </paper-dropdown-menu>
                        <paper-dropdown-menu label="Wochenprofil">
                            <paper-listbox id="week" slot="dropdown-content" selected="[[_subOne(values.ACTIVE_PROFILE)]]" on-selected-changed="_week">
                                <paper-item>1</paper-item>
                                <paper-item>2</paper-item>
                                <paper-item>3</paper-item>
                            </paper-listbox>
                        </paper-dropdown-menu>
                        <template is="dom-if" if="[[_isDefined(values.ACTUAL_TEMPERATURE)]]">
                            <div class="">Gemessene Temperatur: <span>[[_format1Digit(values.ACTUAL_TEMPERATURE)]]</span>°C</div>
                        </template>
                        <template is="dom-if" if="[[_isDefined(values.LEVEL)]]">
                            <div class="valve-state">Ventilöffnung: <span>[[values.LEVEL]]</span> %</div>
                        </template>
                    </div>
                </div>
            </rwa-item>
        `;
    }

    _subOne(val) {
        return val - 1;
    }

    _week() {
        console.log('week', this.$.week.selected + 1);
        this.setValue({ACTIVE_PROFILE: this.$.week.selected + 1});
    }

    _mode() {
        console.log('mode', this.$.mode.selected);
        switch (this.$.mode.selected) {
            case 0:
                this.$.boost.active = false;
                this.setValue({CONTROL_MODE: 0});
                break;
            case 1:
                this.$.boost.active = false;
                this.setValue({CONTROL_MODE: 1});
                break;
            default:
        }
    }

    _boost() {
        if (this.$.boost.active) {
            console.log('boost!');
            this.setValue({BOOST_MODE: true});
        } else {
            console.log('stop boost!');
            this.setValue({BOOST_MODE: false});
        }
    }

    _format1Digit(val) {
        return typeof val === 'undefined' ? '' : val.toFixed(1).replace('.', ',');
    }

    _isDefined(val) {
        return typeof val !== 'undefined';
    }

    _change() {
        this.setValue({SET_POINT_TEMPERATURE: parseFloat(this.$.setpoint.value)});
    }
}

window.customElements.define('rwa-item-hmchannel-heating-climatecontrol-transceiver', RwaItemHmchannelHeatingClimatecontrolTransceiver);
