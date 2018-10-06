import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/paper-slider/paper-slider.js';
import './shared-styles.js';
import './rwa-item.js';
import {RwaItemHmchannel} from './rwa-item-hmchannel.js';

class RwaItemHmChannelDimmer extends RwaItemHmchannel {
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
            #dimmer {
                display: flex;
                width: 100%;
                padding-top: 13px;
                justify-content: center;
            }
            #dimmer paper-slider {
                width: calc(100% - 100px);
            }
            
       </style>
       
        <rwa-item title="[[_replaceChannelName(name, sub)]]" unreach="[[values.UNREACH]]" lowbat="[[values.LOWBAT]]" collapse>
            <div id="control" slot="control">
                <iron-icon class="direction" icon="[[_directionIcon(values.DIRECTION)]]"></iron-icon>
                <span class="level">[[_formatValue(values.LEVEL)]]</span>
                <paper-toggle-button checked="[[_boolValue(values.LEVEL_NOTWORKING)]]" on-checked-changed="_checkedChanged"></paper-toggle-button>
            </div>
            <div slot="collapse">
                <div id="dimmer">
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

    _checkedChanged(e) {
        if (e.detail.value) {
            if (this.paramsetDescription.OLD_LEVEL) {
                this.setValue({OLD_LEVEL: true});
            } else {
                this.setValue({LEVEL: 1});
            }
        } else {
            this.setValue({LEVEL: 0});
        }
    }
}

window.customElements.define('rwa-item-hmchannel-dimmer', RwaItemHmChannelDimmer);
