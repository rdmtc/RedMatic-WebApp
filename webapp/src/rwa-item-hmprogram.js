import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import './shared-styles.js';
import './rwa-item.js';

class RwaItemHmprogram extends PolymerElement {
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
           
            <rwa-item title="[[name]]">
                <paper-button id="button" raised slot="control" on-click="_programExecute"></paper-button>
            </rwa-item>
        `;
    }

    static get properties() {
        return {
            name: String,
            config: Object
        };
    }

    _programExecute() {
        console.log('programExecute', this.config);
        RwaBackend.socket.emit('cmd', {type: 'hm', method: 'programExecute', name: this.config.name});
    }
}

window.customElements.define('rwa-item-hmprogram', RwaItemHmprogram);
