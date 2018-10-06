import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import './shared-styles.js';
import './rwa-item.js';

class RwaItemHmsysvar extends PolymerElement {
    static get template() {
        return html`
            <style include="shared-styles">
                rwa-item::shadow .item-title {
                    width: 100px;
                }
            </style>
           
            <rwa-item title="[[name]]">
            </rwa-item>
        `;
    }

    static get properties() {
        return {
            name: String
        };
    }
}

window.customElements.define('rwa-item-sysvar', RwaItemHmsysvar);
