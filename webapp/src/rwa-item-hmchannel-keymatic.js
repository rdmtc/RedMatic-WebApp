import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import './shared-styles.js';
import './rwa-item.js';
import {RwaItemHmchannel} from './rwa-item-hmchannel.js';

class RwaItemHmchannelKeymatic extends RwaItemHmchannel {
    static get template() {
        return html`
        <style include="shared-styles">
            #control {
                white-space: nowrap;
                display: flex;
            }
            paper-button {
                height: 24px;
                background-color: var(--rwa-color-primary);
                color: var(--rwa-color-on-primary);
            }
        </style>
       
        <rwa-item title="[[_replaceChannelName(name, sub)]]" unreach="[[values.UNREACH]]" lowbat="[[values.LOWBAT]]">
            <div id="control" slot="control">
                <span><rwa-timespan timestamp="[[lastchange.STATE]]"></rwa-timespan>[[_formatState(values.STATE)]]</span><span>[[_formatUncertain(values.STATE_UNCERTAIN)]]</span>
                <paper-button id="open" raised on-click="_open">Öffnen</paper-button>
                <paper-toggle-button checked="[[values.STATE]]" on-checked-changed="_checkedChanged"></paper-toggle-button> 
            </div>
        </rwa-item>
    `;
    }

    _formatUncertain(val) {
        return val ? '?' : '';
    }

    _formatState(val) {
        return val ? 'Offen' : 'Geschlossen';
    }

    _open() {
        this.setValue({OPEN: true});
    }

    _checkedChanged(e) {
        if (this.values && this.values.STATE !== e.detail.value) {
            this.setValue({STATE: e.detail.value});
        }
    }
}

window.customElements.define('rwa-item-hmchannel-keymatic', RwaItemHmchannelKeymatic);
