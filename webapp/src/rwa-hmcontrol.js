import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';

class RwaHmcontrol extends PolymerElement {
    static get template() {
        return html`
            <style include="shared-styles"></style>
            
            <span>[[datapoint]]</span> <span>[[value]]</span><span>[[unit]]</span>    
        `;
    }

    static get properties() {
        return {
            datapoint: String,
            paramsetName: String,
            value: {
                type: String
            },
            unit: String
        };
    }

    connectedCallback() {
        super.connectedCallback();
        this.paramsetDescription = RwaGlobals.hm.paramsetDescriptions[this.paramsetName];
        // Console.log(this.paramsetDescription, this.paramsetName, this.datapoint);
        let unit = (this.paramsetDescription && this.paramsetDescription[this.datapoint] && this.paramsetDescription[this.datapoint].UNIT) || '';
        unit = unit.replace('�C', '°C');
        if (unit !== '°C') {
            unit = ' ' + unit;
        }
        this.unit = unit;
    }
}

window.customElements.define('rwa-hmcontrol', RwaHmcontrol);
