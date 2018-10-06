import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';

class RwaTimespan extends PolymerElement {
    static get template() {
        return html`
           <span>[[elapsed]]</span>
        `;
    }

    static get properties() {
        return {
            timestamp: {
                type: Number
            },
            elapsed: {
                type: String,
                value: ''
            }
        };
    }

    static get observers() {
        return [
            '_timespan(timestamp)'
        ];
    }

    connectedCallback() {
        super.connectedCallback();
    }

    disconnectedCallback() {
        clearTimeout(this.timeout);
        super.disconnectedCallback();
    }

    _timespan() {
        clearTimeout(this.timeout);
        const ts = this.timestamp;
        let elapsed = Math.ceil(((new Date()).getTime() - ts) / 1000);
        const days = Math.floor(elapsed / 86400);
        elapsed -= (days * 86400);
        const hours = Math.floor(elapsed / 3600);
        elapsed -= (hours * 3600);
        const minutes = Math.floor(elapsed / 60);
        let seconds = Math.floor(elapsed % 60);
        let str = '';
        let timeout = 15 * 60 * 1000;
        if (days > 0) {
            str += days + (days === 1 ? ' Tag' : ' Tagen');
            if (days > 1) {
                this.elapsed = str;
                this.timeout = setTimeout(() => {
                    this._timespan();
                }, 4 * 60 * 60 * 1000);
                return;
            }
        }
        if (hours > 0 && days > 0) {
            this.elapsed = str + ` ${hours}h`;
        } else if (hours > 0) {
            this.elapsed = str + ' ' + hours + 'h';
        } else if ((hours > 0 && minutes > 0) && days === 0) {
            timeout = 15 * 1000;
            this.elapsed = str + ' ' + hours + 'h' + minutes;
        } else if (minutes > 0 && days === 0) {
            timeout = 15 * 1000;
            this.elapsed = str + ' ' + minutes + 'm';
        } else if (days === 0) {
            timeout = 2.5 * 1000;
            seconds = Math.floor(seconds / 5) * 5;
            this.elapsed = str + seconds + 's';
        } else {
            timeout = 4 * 60 * 60 * 1000;
            this.elapsed = str;
        }
        this.timeout = setTimeout(() => {
            this._timespan();
        }, timeout);
    }
}

window.customElements.define('rwa-timespan', RwaTimespan);
