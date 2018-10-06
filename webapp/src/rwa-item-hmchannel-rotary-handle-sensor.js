import './shared-styles.js';
import {RwaItemHmchannelShutterContact} from './rwa-item-hmchannel-shutter-contact.js';

class RwaItemHmchannelRotaryHandleSensor extends RwaItemHmchannelShutterContact {
    _formatValue(val) {
        switch (val) {
            case 0:
                return 'Geschlossen';
            case 1:
                return 'Gekippt';
            case 2:
                return 'Offen';
            default:
                return '';
        }
    }
}

window.customElements.define('rwa-item-hmchannel-rotary-handle-sensor', RwaItemHmchannelRotaryHandleSensor);

export {RwaItemHmchannelRotaryHandleSensor};
