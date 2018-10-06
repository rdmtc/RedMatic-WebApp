import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import './rwa-item.js';
import './rwa-hmcontrol.js';

class RwaItemHmchannel extends PolymerElement {
    static get template() {
        return html`
            <style include="shared-styles"></style>
            
            <rwa-item title="[[_replaceChannelName(name, sub)]]" collapse unreach="[[values.UNREACH]]" lowbat="[[values.LOWBAT]]">
                <div slot="control"><span>[[config.hmChannelType]]</span></div>
                <div slot="collapse">
                    <template is="dom-repeat" items="[[datapoints]]">
                        <rwa-hmcontrol datapoint="[[item]]" value="[[_getValue(values.*, item)]]" paramset-name="[[config.paramsetName]]"></rwa-hmcontrol><br>
                    </template>
                </div>
            </rwa-item> 
        `;
    }

    _replaceChannelName(name, sub) {
        if (RwaGlobals.replaceChannelNames) {
            name = name.replace(/:[0-9]+$/, '');
            name = name.replace(/_/g, ' ');
            const subRx1 = new RegExp(' ' + sub + '$', 'i');
            const subRx2 = new RegExp(' ' + sub + ' ', 'i');
            const subRx3 = new RegExp('^' + sub + ' ', 'i');
            name = name.replace(subRx1, '').replace(subRx2, ' ').replace(subRx3, '');
            name = name.replace(/\s+/, ' ').replace(/^\s/, '', /\s$/, '');
        }
        return name;
    }

    _getValue(values, dp) {
        return this.values[dp];
    }

    _classValue(val) {
        return val ? 'strong' : '';
    }


    static get properties() {
        return {
            name: String,
            sub: String,
            config: Object,
            values: {
                type: Object
            },
            lastchange: {
                type: Object
            },
            datapoints: {
                type: Array
            }
        };
    }

    connectedCallback() {
        super.connectedCallback();

        this.iface = this.config.iface;
        this.address = this.config.address;
        this.channel = RwaGlobals.hm.deviceDescriptions[this.config.iface][this.address];
        this.device = RwaGlobals.hm.deviceDescriptions[this.config.iface][this.channel.PARENT];
        this.paramsetDescription = RwaGlobals.hm.paramsetDescriptions[this.config.paramsetName];
        this.datapoints = Object.keys(this.paramsetDescription);
        this.mAddress = this.channel.PARENT + ':0';

        const values = {};
        const lastchange = {};
        this.datapoints.forEach(dp => {
            const address = this.iface + '.' + this.address + '.' + dp;
            const val = RwaGlobals.hm.values[address] && RwaGlobals.hm.values[address].value;
            lastchange[dp] = RwaGlobals.hm.values[address] && RwaGlobals.hm.values[address].lc;
            if (typeof val !== 'undefined') {
                values[dp] = val;
            }
            if (this.paramsetDescription.WORKING && (dp === 'LEVEL' || dp === 'STATE')) {
                values[dp + '_NOTWORKING'] = val;
            }
        });

        ['UNREACH', 'LOWBAT'].forEach(dp => {
            const address = this.iface + '.' + this.mAddress + '.' + dp;
            const val = RwaGlobals.hm.values[address] && RwaGlobals.hm.values[address].value;
            if (typeof val !== 'undefined') {
                values[dp] = val;
            }
        });

        this.values = values;
        this.lastchange = lastchange;

        RwaBackend.socket.on('event', msg => this._eventListener(msg));
    }

    disconnectedCallback() {
        RwaBackend.socket.removeListener('event', this._eventListener);
        super.disconnectedCallback();
    }

    _eventListener(msg) {
        if (msg.channel === this.address || msg.channel === this.mAddress) {
            if (!msg.working && !msg.direction && (msg.datapoint === 'LEVEL' || msg.datapoint === 'STATE')) {
                this.set('values.' + msg.datapoint + '_NOTWORKING', msg.value);
            }
            this.set('values.' + msg.datapoint, msg.value);
            this.set('lastchange.' + msg.datapoint, msg.lc);
        }
    }

    setValue(vals) {
        if (!this.iface || !this.address) {
            return;
        }
        console.log('setValue', this.iface, this.address, vals);
        Object.keys(vals).forEach(dp => {
            RwaBackend.socket.emit('cmd', {type: 'hm', method: 'setValue', iface: this.iface, address: this.address, datapoint: dp, value: vals[dp]});
        });
    }
}

window.customElements.define('rwa-item-hmchannel', RwaItemHmchannel);

export {RwaItemHmchannel};
