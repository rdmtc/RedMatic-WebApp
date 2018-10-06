import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';

import './rwa-item-hmchannel.js';
import './rwa-item-hmchannel-blind.js';
import './rwa-item-hmchannel-climatecontrol-regulator.js';
import './rwa-item-hmchannel-climatecontrol-rt-transceiver.js';
import './rwa-item-hmchannel-climatecontrol-vent-drive.js';
import './rwa-item-hmchannel-dimmer.js';
import './rwa-item-hmchannel-key.js';
import './rwa-item-hmchannel-keymatic.js';
import './rwa-item-hmchannel-heating-climatecontrol-transceiver.js';
import './rwa-item-hmchannel-motion-detector.js';
import './rwa-item-hmchannel-motiondetector-transceiver.js';
import './rwa-item-hmchannel-shutter-contact.js';
import './rwa-item-hmchannel-smoke-detector.js';
import './rwa-item-hmchannel-smoke-detector-team.js';
import './rwa-item-hmchannel-switch.js';
import './rwa-item-hmchannel-switch-virtual-receiver.js';
import './rwa-item-hmchannel-thermalcontrol-transmit.js';
import './rwa-item-hmchannel-rotary-handle-sensor.js';
import './rwa-item-hmchannel-virtual-key.js';
import './rwa-item-hmchannel-weather.js';
import './rwa-item-hmprogram.js';
import './rwa-item-hmsysvar.js';

class RwaList extends PolymerElement {
    static get template() {
        return html`
        <style include="shared-styles">
        :host {
            display: block;
            padding-top: 3px;
        }
        #itemsOdd {
            margin-right: 3px;
            margin-left: 3px;
            display: none;
            width: calc(100% - 6px);
            vertical-align: top;
        }
        #itemsEven {
            margin-right: 3px;
            margin-left: 3px;
            display: none;
            vertical-align: top;
        }
        @media (min-width: 1280px) { 
            #itemsOdd {
                margin-right: 0;
                width: calc(50% - 6px);
            }
            #itemsEven {
                width: calc(50% - 6px);
                margin-left: 0px;
            }
        }
        
        </style>
        <div id="itemsOdd"></div>
        <div id="itemsEven"></div>

    `;
    }

    static get properties() {
        return {
            navName: String,
            items: {
                type: Array,
            },
            navCurrent: {
                type: String,
            },
            twoCol: {
                type: Boolean,
                value: window.innerWidth >= 1280,
                reflectToAttribute: true
            }
        };
    }

    static get observers() {
        return [
            '_renderedChanged(items, navCurrent, twoCol)'
        ];
    }

    connectedCallback() {
        super.connectedCallback();
        this._getSize();
        window.addEventListener('resize', () => {
            this._getSize();
        });
    }

    _getSize() {
        if (window.innerWidth >= 1280 && !this.twoCol) {
            this.twoCol = true;
        } else if (window.innerWidth < 1280 && this.twoCol) {
            this.twoCol = false;
        }
    }

    _render() {
        if (!this.items) {
            return;
        }
        if (this.twoCol && this.items.length > 1) {
            if (this.$.itemsEven.innerHTML) {
                return;
            }
        } else if (!this.twoCol && this.items.length > 1) {
            if (this.$.itemsOdd.innerHTML && !this.$.itemsEven.innerHTML) {
                return;
            }
        }
        this.$.itemsOdd.style.display = 'none';
        this.$.itemsEven.style.display = 'none';
        this.$.itemsOdd.innerHTML = '';
        this.$.itemsEven.innerHTML = '';
        const len = this.items.length;

        const addItem = i => {
            RwaGlobals.progress(i, len);

            const item = this.items[i];
            let tagName = 'rwa-item-' + item.type;

            switch (item.type) {
                case 'hmchannel':
                    if (customElements.get(tagName + '-' + item.config.hmChannelType)) {
                        tagName += '-' + item.config.hmChannelType;
                    } else {
                        console.log('no element', item.config.hmChannelType);
                    }
                    break;
                default:
            }
            const elem = document.createElement(tagName);
            elem.setAttribute('name', item.name);
            elem.setAttribute('sub', this.navCurrent);
            elem.config = item.config;
            if (this.twoCol && i % 2) {
                this.$.itemsEven.append(elem);
            } else {
                this.$.itemsOdd.append(elem);
            }

            i = i + 1;
            if (len > i) {
                setTimeout(() => {
                    addItem(i);
                }, 0);
            } else {
                if (this.twoCol) {
                    this.$.itemsOdd.style.display = 'inline-block';
                    this.$.itemsEven.style.display = 'inline-block';
                } else {
                    this.$.itemsOdd.style.display = 'inline-block';
                }
                RwaGlobals.progress();
            }
        };
        addItem(0);
    }

    _renderedChanged() {
        //console.log('_renderedChanged', this.navName);
        if (this.navName === this.navCurrent) {
            this._render();
        } else {
            this.$.itemsOdd.innerHTML = '';
            this.$.itemsEven.innerHTML = '';
        }
    }
}

window.customElements.define('rwa-list', RwaList);
