import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import './shared-styles.js';
import './rwa-item.js';
import {RwaItemHmchannel} from './rwa-item-hmchannel.js';

class RwaItemHmchannelKey extends RwaItemHmchannel {
    static get template() {
        return html`
            <style include="shared-styles">
                paper-button {
                    height: 24px;
                    min-width: 92px;
                }
                rwa-item::shadow .item-title {
                    width: 100px;
                }
            </style>
           
            <rwa-item title="[[_replaceChannelName(name, sub)]]">
                <paper-button id="button" raised slot="control"></paper-button>
            </rwa-item>
        `;
    }

    static get properties() {
        return {
            name: String,
            longDuration: {
                type: Number,
                value: 1000
            }
        };
    }

    connectedCallback() {
        super.connectedCallback();
        let start;
        let pressed = null;
        this.$.button._buttonStateChanged = () => {
            if (pressed !== Boolean(this.$.button.pressed)) {
                pressed = Boolean(this.$.button.pressed);
                if (this.$.button.pressed) {
                    start = (new Date()).getTime();
                } else {
                    const duration = (new Date()).getTime() - start;
                    console.log('duration', duration, this.longDuration);
                    if (start && duration > this.longDuration) {
                        start = null;
                        this.setValue({PRESS_LONG: true});
                    } else {
                        this.setValue({PRESS_SHORT: true});
                    }
                }
            }
        };
    }
}

window.customElements.define('rwa-item-hmchannel-key', RwaItemHmchannelKey);

export {RwaItemHmchannelKey};
