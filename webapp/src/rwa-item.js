import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import 'fontawesome-icon';
import './shared-styles.js';
import '@polymer/iron-collapse/iron-collapse.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/device-icons.js';
import '@polymer/iron-icons/notification-icons.js';

class RwaItem extends PolymerElement {
    static get template() {
        return html`
            <style include="shared-styles">
                :host {
                    padding-bottom: 6px;
                    display: block;
                    width: 100%;
                }
                
                .main {
                    display: flex;
                }
                
                .item-icon {
                    display: inline-block;
                    width: 28px;
                    min-width: 28px;
                    color: var(--rwa-color-on-secondary);
                }
                
                .item-title, .item-control, .item-expand {
                    display: inline-block;
                    color: var(--rwa-color-on-secondary);
                    background-color: var(--rwa-color-secondary-dark);
                
                }
                
                .item-title {
                    flex-grow: 1;
                    text-overflow: ellipsis;
                    
                    white-space: nowrap;
                    overflow: hidden;
                }
                
                .item-control {
                    
                    display: flex;
                    text-align: right;
                    justify-content: center;
                    align-items: flex-end;
                    white-space: nowrap;
                
                    
                }
                
                .item-menu {
                    width: 60px;
                    min-width: 60px;
                    display: flex;
                    align-items: flex-end;
                    flex-direction: row-reverse;
                }
                
                .item-collapse {
                   
                }
                
                #collapse-button {
                    width: 24px;
                    height: 24px;
                }
                
                #collapse-icon {
                    color: var(--rwa-color-primary);
                    padding: 0;
                    width: auto;
                    height: auto;
                }
                
                iron-icon.msg {
                    color: red;
                    width: 16px;
                }
            
            </style>
            
            <div class="card">
                <div class="main">
                    <!--
                    <div class="item-icon">
                        <fontawesome-icon prefix="[[_iconPrefix(icon)]]" name="[[_iconName(icon)]]"></fontawesome-icon>
                    </div>
                    -->
                    <div class="item-title">[[title]]</div>
                    <div class="item-control">
                        <slot name="control"></slot>
                    </div>
                    <div class="item-menu">
                        <div id="collapse-button">
                            <template is="dom-if" if="{{collapse}}">
                                <paper-icon-button id="collapse-icon" icon="icons:expand-more" on-click="toggleOpened"></paper-icon-button>
                            </template>
                        </div>
                        <template is="dom-if" if="{{unreach}}">
                            <iron-icon class="msg" icon="notification:do-not-disturb"></iron-icon>
                        </template>
                        <template is="dom-if" if="{{error}}">
                            <iron-icon class="msg" icon="icons:warning"></iron-icon>
                        </template>
                        <template is="dom-if" if="{{lowbat}}">
                            <iron-icon class="msg" icon="device:battery-20"></iron-icon>
                        </template>
                    </div>
                </div>
                <template is="dom-if" if="{{collapse}}">
                    <iron-collapse opened="{{opened}}">
                        <slot name="collapse"></slot>
                    </iron-collapse>
                </template>
            </div>
        `;
    }

    _iconPrefix(icon) {
        return String(icon).split(' ')[0];
    }
    _iconName(icon) {
        return String(icon).split(' ')[1].replace(/fa-/, '');
    }

    toggleOpened() {
        this.opened = !this.opened;
        this.shadowRoot.querySelector('#collapse-icon').setAttribute('icon', 'icons:expand-' + (this.opened ? 'less' : 'more'));
    }

    static get properties() {
        return {
            title: { type: String, reflectToAttribute: true},
            opened: Boolean,
            collapse: Boolean,
            unreach: Boolean,
            lowbat: Boolean,
            error: Boolean,
            icon: {
                type: String,
                reflectToAttribute: true
            }
        };
    }

    connectedCallback() {
        super.connectedCallback();
    }
}

window.customElements.define('rwa-item', RwaItem);
