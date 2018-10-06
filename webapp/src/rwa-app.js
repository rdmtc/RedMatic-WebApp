import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {setPassiveTouchGestures, setRootPath} from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-collapse/iron-collapse.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-progress/paper-progress.js';

import './shared-styles.js';
import './rwa-view404.js';
import './rwa-icons.js';
import './rwa-list.js';

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath(RwaGlobals.rootPath);

class RwaApp extends PolymerElement {
    static get template() {
        return html`
            <style>
                :host {
                  display: block;
                }
                
                app-drawer {
                    --app-drawer-content-container: {
                        background-color: var( --rwa-color-secondary-dark);
                    }
                }
                
                app-drawer-layout:not([narrow]) [drawer-toggle] {
                  display: none;
                }
            
                app-header {
                  color: var(--rwa-color-on-primary);
                  background-color: var(--rwa-color-primary);
                }
            
                app-header paper-icon-button {
                  --paper-icon-button-ink-color: var(--rwa-color-primary-dark);
                }
                
            
                .drawer-list {
                  margin: 0 20px;
                }
            
                .drawer-list a {
                  display: block;
                  padding: 0 16px;
                  text-decoration: none;
                  color: var(--rwa-color-on-secondary);
                  line-height: 40px;
                }
                
                .nav-subhead {
                    padding-left: 16px;
                }
            
                .drawer-list a.iron-selected {
                  font-weight: bold;
                  color: var(--rwa-color-on-primary);
                  background-color: var(--rwa-color-primary);
                }
                #disconnect {
                    position:absolute;
                    z-index: 200000;
                   
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: #333;
                    color: white;
                    display: flex;
                    align-items: center;
                    align-content: center;
                    justify-content: center;
                }
                a.nav-room, a.nav-function {
                    padding-left: 18px;
                }
                .drawer-list {
                    margin: 0;
                }
                #nav-room paper-icon-button, #nav-function paper-icon-button {
                    float: right;
                    color: var(--rwa-color-primary);
                }
                #nav-room, #nav-function {
                    display: block;
                    padding: 0;
                    text-decoration: none;
                    color: var(--rwa-color-on-secondary);
                    line-height: 40px;
                }
                #progress {
                    position: fixed;
                    top:0;
                    width: 100%;
                    height: 2px;
                    display: none;
                    z-index: 100000;
                }
                
                paper-progress {
                    --paper-progress-active-color: var(--rwa-color-primary);
                    --paper-progress-secondary-color:var(--rwa-color-secondary-dark);
                }
              
                .sub-icon {
                    display: inline-block;
                    width: 28px;
                }
                .sub-title {
                    display: inline-block;
                }
                      
            </style>
          
            <paper-progress id="progress"></paper-progress>
            
            <div id="disconnect">
                <h3>{{disconnectMessage}}</h3>
            </div>
            
            <app-location route="{{route}}" query-params="[[queryParams]]" use-hash-as-path></app-location>
            <app-route route="{{route}}" pattern="/:page" data="{{routeData}}" tail="{{subroute}}" use-hash-as-path></app-route>
            <app-route route="{{subroute}}" pattern="/:sub" data="{{subrouteData}}" use-hash-as-path></app-route>
            
            <app-drawer-layout fullbleed="" narrow="{{narrow}}">
                <!-- Drawer content -->
                <app-drawer id="drawer" slot="drawer" swipe-open="[[narrow]]">
                    <div style="height: 100%; overflow-y: auto;">
                        <iron-selector selectable=".nav-page" id="pageSelector" selected="[[page]]" attr-for-selected="name" class="drawer-list" role="navigation">
                            <template is="dom-if" if="[[config.showHome]]">
                                <a class="nav-page" name="home" href="?/[[configName]]/#/home/">Übersicht</a>
                            </template>
                        
                            <div id="navRoomContainer">
                                <div href="#/room/" id="nav-room" on-click="_roomCollapse">
                                    <span class="nav-subhead">Räume</span>
                                    <paper-icon-button id="room-collapse" icon="icons:expand-more" ></paper-icon-button>
                                </div>
                                
                                <iron-collapse id="rooms" rooms-opened="{{roomsOpened}}">
                                    <iron-selector id="nav-room" selected="[[_roomSelected(sub)]]" attr-for-selected="name" class="drawer-list" role="navigation">
                                        <template is="dom-repeat" items="{{rooms}}">
                                            <template is="dom-if" if="[[!item.hidden]]">
                                                <a class="nav-room" name="[[item.name]]" href="?/[[configName]]/#/room/[[item.name]]">
                                                    <span class="sub-icon">
                                                        <template is="dom-if" if="[[item.icon]]">
                                                            <fontawesome-icon prefix="[[_iconPrefix(item.icon)]]" name="[[_iconName(item.icon)]]"></fontawesome-icon>
                                                        </template>
                                                    </span>
                                                    <span class="sub-title">[[item.name]]</span>
                                                </a>
                                            </template>
                                        
                                        </template>
                                    </iron-selector>
                                </iron-collapse>
                            </div>
                        
                        
                            <div id="navFunctionContainer">
                            
                                <div href="#/function/" id="nav-function" on-click="_functionCollapse">
                                    <span class="nav-subhead">Gewerke</span>
                                    <paper-icon-button id="function-collapse" icon="icons:expand-more" ></paper-icon-button>
                                </div>
                                
                                
                                <iron-collapse id="functions" functions-opened="{{functionsOpened}}">
                                    <iron-selector id="nav-function" selected="[[_functionSelected(sub)]]" attr-for-selected="name" class="drawer-list" role="navigation">
                                        <template is="dom-repeat" items="{{functions}}">
                                            <template is="dom-if" if="[[!item.hidden]]">
                                                <a class="nav-function" name="[[item.name]]" href="?/[[configName]]/#/function/[[item.name]]">
                                                    <span class="sub-icon">
                                                    <template is="dom-if" if="[[item.icon]]">
                                                        <fontawesome-icon prefix="[[_iconPrefix(item.icon)]]" name="[[_iconName(item.icon)]]"></fontawesome-icon>
                                                    </template>
                                                    </span>
                                                    <span class="sub-title">[[item.name]]</span>
                                                </a>
                                            </template>
                                        
                                        </template>
                                    </iron-selector>
                                </iron-collapse>
                            </div>
                            
                            <template is="dom-if" if="[[config.showSysvar]]">
                                <a class="nav-page" name="sysvar" href="?/[[configName]]/#/sysvar/">Variablen</a>
                            </template>
                            
                            <template is="dom-if" if="[[config.showProgram]]">
                                <a class="nav-page" name="program" href="?/[[configName]]/#/program/">Programme</a>
                            </template>
                            
                            <template is="dom-if" if="[[config.showSystem]]">
                                <a class="nav-page" name="system" href="?/[[configName]]/#/system/">System</a>
                            </template>
                        
                        </iron-selector>
                    </div>
                </app-drawer>
            
                <!-- Main content -->
                <app-header-layout has-scrolling-region="">
                    <template is="dom-if" if="{{narrow}}">
                        <app-header slot="header" condenses="true" reveals="" effects="waterfall">
                            <app-toolbar>
                                <paper-icon-button icon="my-icons:menu" drawer-toggle=""></paper-icon-button>
                                <div main-title="">[[mainTitle]]</div>
                            </app-toolbar>
                        </app-header>
                    </template>
                    
                    <iron-pages selected="[[page]]" attr-for-selected="nav-name" role="main">
                    
                        <rwa-list nav-current="[[page]]" nav-name="home" items="[[home]]"></rwa-list>
                        
                        <iron-pages nav-name="room" selected="[[_roomSelected(sub)]]" attr-for-selected="nav-name" role="main">
                            <template is="dom-repeat" items="{{rooms}}">
                                <rwa-list nav-current="[[sub]]" nav-name="[[item.name]]" items="[[item.items]]"></rwa-list>
                            </template>
                        </iron-pages>
                        
                        <iron-pages nav-name="function" selected="[[_functionSelected(sub)]]" attr-for-selected="nav-name" role="main">
                            <template is="dom-repeat" items="{{functions}}">
                                <rwa-list nav-current="[[sub]]" nav-name="[[item.name]]" items="[[item.items]]"></rwa-list>
                            </template>
                        </iron-pages>
                        
                        <rwa-list nav-current="[[page]]" nav-name="sysvar" items="[[sysvars]]"></rwa-list>
                        <rwa-list nav-current="[[page]]" nav-name="program" items="[[programs]]"></rwa-list>
                        
                        <rwa-view404 nav-name="view404"></rwa-view404>
                    
                    </iron-pages>
                </app-header-layout>
                
            </app-drawer-layout>
        `;
    }

    _roomSelected(sub) {
       return this.page === 'room' ? sub : '';
    }
    _functionSelected(sub) {
       return this.page === 'function' ? sub : '';
    }

    _roomCollapse() {
        this.$.rooms.toggle();
        this.shadowRoot.querySelector('#room-collapse').setAttribute('icon', 'icons:expand-' + (this.$.rooms.opened ? 'less' : 'more'));
    }

    _functionCollapse() {
        this.$.functions.toggle();
        this.shadowRoot.querySelector('#function-collapse').setAttribute('icon', 'icons:expand-' + (this.$.functions.opened ? 'less' : 'more'));
    }

    _href(name) {
        return name.toLowerCase().replace(/ /g, '_');
    }

    _neq(a, b) {
        return a !== b;
    }

    static get properties() {
        return {
            page: {
                type: String
            },
            sub: {
                type: String
            },
            config: Object,
            routeData: Object,
            subrouteData: Object,
            subroute: Object,
            rooms: {
                type: Array,
                value: []
            },
            functions: {
                type: Array,
                value: []
            },
            mainTitle: String,
            disconnectMessage: String,
            configName: {
                type: String
            }
        };
    }

    static get observers() {
        return [
            '_routePageChanged(routeData.page, subrouteData.sub)'
        ];
    }

    getConfig() {
        this.$.disconnect.style.display = 'flex';
        this.disconnectMessage = 'Lade Konfiguration';
        RwaBackend.socket.emit('getConfig', this.configName, conf => {
            console.log('getConfig', conf);
            if (!conf.config || !conf.data) {
                this.disconnectMessage = 'Keine Konfiguration vorhanden';
                return;
            }
            this.config = conf.config;

            RwaGlobals.replaceChannelNames = this.config.replaceChannelNames;
            document.querySelector('title').innerHTML = this.config.title;

            const {data} = conf;

            if (!this.config.showRooms) {
                this.$.navRoomContainer.style.display = 'none';
            }
            if (!this.config.showFunctions) {
                this.$.navFunctionContainer.style.display = 'none';
            }

            const programs = [];
            Object.keys(data.programs).forEach(prg => {
                programs.push({
                    name: prg,
                    type: 'hmprogram',
                    config: data.programs[prg]
                })
            });
            this.programs = programs;

            const variables = [];
            Object.keys(data.variables).forEach(sysvar => {
                programs.push({
                    name: sysvar,
                    type: 'hmsysvar',
                    config: data.variables[sysvar]
                })
            });
            this.variables = variables;

            const rooms = [];
            const availRooms = data.rooms.map(v => v.name);
            const knownRooms = this.config.rooms.map(v => v.name);
            this.config.rooms.forEach(room => {
                if (availRooms.includes(room.name)) {
                    rooms.push(Object.assign(data.rooms[availRooms.indexOf(room.name)], room));
                }
            });
            availRooms.forEach(room => {
                if (!knownRooms.includes(room)) {
                    rooms.push(data.rooms[availRooms.indexOf(room)]);
                }
            });
            this.rooms = rooms;

            const functions = [];
            const availFunctions = data.functions.map(v => v.name);
            const knownFunctions = this.config.functions.map(v => v.name);
            this.config.functions.forEach(func => {
                if (availFunctions.includes(func.name)) {
                    functions.push(Object.assign(data.functions[availFunctions.indexOf(func.name)], func));
                }
            });
            availFunctions.forEach(func => {
                if (!knownFunctions.includes(func)) {
                    functions.push(data.functions[availFunctions.indexOf(func)]);
                }
            });
            this.functions = functions;

            RwaGlobals.hm = {
                deviceDescriptions: data.deviceDescriptions,
                paramsetDescriptions: data.paramsetDescriptions,
                values: data.values
            };
            this.hasData = true;
            document.querySelector('html').classList = this.config.theme;
            this.$.disconnect.style.display = 'none';
            this._routePageChanged(this.routeData.page, this.subrouteData.sub);
        });
    }

    constructor() {
        super();
        this.configName = location.search.replace(/\?\/?/, '').replace(/\/$/, '');

        RwaGlobals.hm = {values: {}};

        this.disconnectMessage = 'Keine Verbindung zu RedMatic';
        RwaBackend.socket = RwaBackend.io({path: location.pathname + 'socket.io'});
        RwaBackend.socket.on('connect', () => {
            this.getConfig();
        });

        RwaBackend.socket.on('disconnect', () => {
            this.disconnectMessage = 'Keine Verbindung zu RedMatic';
            this.$.disconnect.style.display = 'flex';
            // Console.log('disconnect');
        });

        RwaBackend.socket.on('event', msg => {
            const dp = msg.iface + '.' + msg.channel + '.' + msg.datapoint;
            if (!RwaGlobals.hm.values[dp]) {
                RwaGlobals.hm.values[dp] = {};
            }
            RwaGlobals.hm.values[dp].value = msg.value;
        });

        RwaGlobals.progress = (step, length) => {
            if (typeof step === 'number') {
                this.$.progress.style.display = 'block';
                this.$.progress.setAttribute('value', Math.ceil(((step + 1) / length) * 100));
            } else {
                setTimeout(() => {
                    this.$.progress.style.display = 'none';
                }, 100);
            }
        };

    }

    _routePageChanged(page, sub) {
        if (!this.hasData || (this.page && this.page === page && this.sub && this.sub === sub)) {
            return;
        }

        if (!page) {
            if (this.config.showHome) {
                page = 'home';
            } else if (this.config.showRooms) {
                page = 'room';
            } else if (this.config.showFunctions) {
                page = 'functions';
            } else if (this.config.showSysvar) {
                page = 'sysvar';
            } else if (this.config.showProgram) {
                page = 'program';
            } else if (this.config.showSystem) {
                page = 'system';
            }
        }

        switch (page) {
            case 'home':
                this.page = page;
                this.sub = '';
                this.mainTitle = 'Übersicht';
                break;

            case 'sysvar':
                this.page = page;
                this.sub = '';
                this.mainTitle = 'Variablen';
                break;

            case 'program':
                this.page = page;
                this.sub = '';
                this.mainTitle = 'Programme';
                break;

            case 'room': {
                if (this.page !== page) {
                    this.page = page;
                }

                if (!this.$.rooms.opened) {
                    this._roomCollapse();
                }

                if (!sub && !this.sub) {
                    sub = this.rooms[0].name;
                } else if (!sub) {
                    sub = this.sub;
                }

                const roomNames = this.rooms.map(v => v.name);
                if (roomNames.indexOf(sub) === -1) {
                    this.page = 'view404';
                } else {
                    this.mainTitle = roomNames[roomNames.indexOf(sub)];
                    this.sub = sub;
                }

                this.$.pageSelector.selected = 'room';

                break;
            }
            case 'function': {
                if (this.page !== page) {
                    this.page = page;
                }

                if (!this.$.functions.opened) {
                    this._functionCollapse();
                }

                if (!sub && !this.sub) {
                    sub = this.functions[0].name;
                } else if (!sub) {
                    sub = this.sub;
                }

                const functionNames = this.functions.map(v => v.name);
                if (functionNames.indexOf(sub) === -1) {
                    this.page = 'view404';
                } else {
                    this.mainTitle = functionNames[functionNames.indexOf(sub)];
                    this.sub = sub;
                }

                this.$.pageSelector.selected = 'function';

                break;
            }
            default:
                this.sub = '';
                this.page = 'view404';
        }

        // Close a non-persistent drawer when the page & route are changed.
        if (!this.$.drawer.persistent) {
            this.$.drawer.close();
        }
    }

    _iconPrefix(icon) {
        return String(icon).split(' ')[0];
    }
    _iconName(icon) {
        return (String(icon).split(' ')[1] || '').replace(/fa-/, '');
    }
}

window.customElements.define('rwa-app', RwaApp);
