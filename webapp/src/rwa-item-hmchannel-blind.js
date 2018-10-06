import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/av-icons.js';
import '@polymer/paper-slider/paper-slider.js';
import './shared-styles.js';
import './rwa-item.js';
import {RwaItemHmchannel} from './rwa-item-hmchannel.js';

class RwaItemHmChannelBlind extends RwaItemHmchannel {
    static get template() {
        return html`
            <style include="shared-styles">
                paper-toggle-button {
                    display: inline-block;
                }
                #control {
                    height: 24px;
                    display: flex;
                }
                .level {
                    margin-right: 3px;
                }
                .direction {
                    width: 16px;
                    height: 16px;
                    margin-top: 3px;
                }
                #blind {
                    display: flex;
                    width: 100%;
                    padding-top: 13px;
                    justify-content: center;
                }
                #blind paper-slider {
                    width: calc(100% - 100px);
                }
                paper-icon-button {
                    margin-top: -2px;
                    padding-top: 6px;
                    height: 28px;
                    width: 28px;
                    border-radius: 14px;
                    margin-left: 3px;
                    margin-right: 3px;
                    background-color: var(--rwa-color-primary);
                    color: var(--rwa-color-on-primary);
                }
                
           </style>
           
            <rwa-item title="[[_replaceChannelName(name, sub)]]" unreach="[[values.UNREACH]]" lowbat="[[values.LOWBAT]]" collapse>
                <div id="control" slot="control">
                    <iron-icon class="direction" icon="[[_directionIcon(values.DIRECTION)]]"></iron-icon>
                    <span class="level">[[_formatValue(values.LEVEL)]]</span>
                    <paper-icon-button on-click="_down" icon="icons:arrow-downward"></paper-icon-button>
                    <paper-icon-button on-click="_stop" icon="av:stop"></paper-icon-button>
                    <paper-icon-button on-click="_up" icon="icons:arrow-upward"></paper-icon-button>
                </div>
                <div slot="collapse">
                    <div id="blind">
                        <paper-slider value="[[values.LEVEL_NOTWORKING]]" min="0" max="1" step="0.005" on-immediate-value-changed="_sliderChanged" on-value-changed="_sliderChanged"></paper-slider>    
                    </div>
                </div>
            </rwa-item>
        `;
    }

    static get properties() {
        return {

        };
    }

    _down() {
        this.setValue({LEVEL: 0});
    }
    _up() {
        this.setValue({LEVEL: 1});
    }
    _stop() {
        this.setValue({STOP: true});
    }

    _directionIcon(val) {
        switch (val) {
            case 1:
                return 'icons:arrow-upward';
            case 2:
                return 'icons:arrow-downward';
            default:
                return '';
        }
    }

    _formatValue(val) {
        return ((val || 0) * 100).toFixed(1).replace('.', ',') + '%';
    }

    _boolValue(val) {
        return Boolean(val);
    }

    _sliderChanged(e) {
        const val = e.detail.value;
        if (this.values && this.values.LEVEL_NOTWORKING !== val) {
            this.setValue({LEVEL: val});
        }
    }
}

window.customElements.define('rwa-item-hmchannel-blind', RwaItemHmChannelBlind);
