import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-input/paper-input.js';

import './shared-styles.js';
import './rwa-item.js';

class RwaItemHmsysvar extends PolymerElement {
    static get template() {
        return html`
            <style include="shared-styles">
                :host {
                    overflow: hidden;
                }
                rwa-item::shadow .item-title {
                    width: 100px;
                }
                #value {
                    display: none;
                }
                #dropdown {
                    display: none;
                }
                #input {
                    display: none;
                }
               
                paper-dropdown-menu {
                /*
                    margin-top: -30px;
                    height: 18px;
                    top: -5px;*/
                }

            </style>
           
            <rwa-item title="[[name]]">
                <div slot="control">
                    <span id="value"><span>[[_formatValue(config.value)]]</span><span class="unit">[[unit]]</span></span>
                    <span id="dropdown">
                        <paper-dropdown-menu>
                            <paper-listbox id="listbox" slot="dropdown-content" selected="[[_number(config.value)]]" on-selected-changed="_dropdownChange">
                            </paper-listbox>
                        </paper-dropdown-menu>
                    </span>
                    <paper-input id="input" value="[[config.value]]" on-change="_inputChange"></paper-input>
                </div>
            </rwa-item>
        `;
    }

    static get properties() {
        return {
            name: String,
            unit: String,
            readonly: Boolean,
            config: Object
        };
    }

    connectedCallback() {
        super.connectedCallback();
        if (this.config.unit) {
            if (this.config.unit.startsWith('°')) {
                this.unit = this.config.unit;
            } else if (this.config.unit.startsWith('%')) {
                this.unit = this.config.unit;
            } else {
                this.unit = ' ' + this.config.unit;
            }
        }

        if (this.config.id === 40 || this.config.id === 41) {
            this.readonly = true;
        } else if (this.config.info && this.config.info.match(/\(r\)/)) {
            this.readonly = true;
        }
        this.readonly = this.readonly || this.config.readonly;

        if (this.readonly) {
            this.$.value.style.display = 'inline-block';
        } else {
            if (this.config.enum && this.config.enum.length > 0) {
                this.config.enum.forEach(name => {
                    const item = document.createElement('paper-item');
                    item.innerHTML = name;
                    this.$.listbox.append(item);
                });
                this.$.dropdown.style.display = 'inline-block';
            } else if (this.config.valueType === 'string') {
                this.$.input.style.display = 'inline-block';
            } else if (this.config.valueType === 'number') {
                this.$.input.setAttribute('type', 'number');
                if (this.config.unit) {
                    const suffix = document.createElement('span');
                    suffix.setAttribute('slot', 'suffix');
                    suffix.innerHTML = this.config.unit;
                    this.$.input.append(suffix);
                }
                this.$.input.style.display = 'inline-block';
            } else {
                this.$.value.style.display = 'inline-block';
            }
        }

        RwaBackend.socket.on('sysvar', msg => this._eventListener(msg));
    }

    disconnectedCallback() {
        RwaBackend.socket.removeListener('sysvar', this._eventListener);
        super.disconnectedCallback();
    }

    _eventListener(msg) {
        if (msg.name === this.name) {
            this.set('config.value', msg.value);
            this.set('config.valueEnum', msg.valueEnum);
        }
    }

    _dropdownChange() {
        let val;
        if (this.config.valueType === 'boolean') {
            val = Boolean(this.$.listbox.selected);
        } else {
            val = this.$.listbox.selected;
        }
        RwaBackend.socket.emit('cmd', {type: 'hm', method: 'setVariable', name: this.config.name, value: val});
    }

    _inputChange(e) {
        let val;
        if (this.config.valueType === 'number') {
            val = Number(this.$.input.value);
        } else {
            val = this.$.input.value;
        }
        RwaBackend.socket.emit('cmd', {type: 'hm', method: 'setVariable', name: this.config.name, value: val});

    }

    _number(val) {
        return Number(val);
    }

    _formatValue(val) {
        if (this.config.enum && this.config.enum.length > 0) {
            return this.config.enum[Number(val)];
        }
        return val;
    }
}

window.customElements.define('rwa-item-hmsysvar', RwaItemHmsysvar);
