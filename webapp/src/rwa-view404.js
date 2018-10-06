import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

class RwaView404 extends PolymerElement {
    static get template() {
        return html`
      <style>
        :host {
          display: block;

          padding: 10px 20px;
        }
      </style>

      Oops - 404. Diese Seite existiert nicht. <a href="[[rootPath]]">Zurück.</a>
    `;
    }
}

window.customElements.define('rwa-view404', RwaView404);
