/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

/* eslint-disable camelcase */

import '@polymer/polymer/polymer-element.js';

const $_documentContainer = document.createElement('template');
$_documentContainer.innerHTML = `<dom-module id="shared-styles">
  <template>
    <style>

    
        .card {
            margin: 3px 6px 0;
            padding: 6px;
            border-radius: 5px;
            color: var(--rwa-color-on-secondary);
            background-color: var(--rwa-color-secondary-dark);
            box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }
        
        .strong {
            font-weight: bold;
        }
        
        h1 {
            margin: 16px 0;
            color:  var(--rwa-color-on-secondary);;
            font-size: 22px;
        }
        
        paper-toggle-button {
            --paper-toggle-button-unchecked-bar-color: var(--rwa-color-secondary);
            --paper-toggle-button-unchecked-button-color: var(--rwa-color-primary);
            --paper-toggle-button-checked-bar-color: var(--rwa-color-primary-dark);
            --paper-toggle-button-checked-button-color: var(--rwa-color-primary); 
        }
        
        paper-input {
            --paper-input-container-color: var(--rwa-color-primary);
            --paper-input-container-focus-color: var(--rwa-color-primary);
            --paper-input-container-input-color: var(--rwa-color-on-secondary);
        }
      
        paper-dropdown-menu {
            --paper-input-container-color: var(--rwa-color-primary);
            --paper-input-container-focus-color: var(--rwa-color-primary);
            --paper-input-container-input-color: var(--rwa-color-on-secondary);
        }
        
        --paper-menu-button {
            color: var(--rwa-color-primary);
        }
        
        paper-slider {
            --paper-slider-container-color:	var(--rwa-color-secondary);
            --paper-slider-active-color: var(--rwa-color-primary-dark);
            --paper-slider-secondary-color: var(--rwa-color-primary-dark);
            --paper-slider-knob-color: var(--rwa-color-primary); 
            --paper-slider-disabled-knob-color: var(--rwa-color-primary);
            --paper-slider-knob-start-color: var(--rwa-color-primary);
            --paper-slider-knob-start-border-color: var(--rwa-color-primary);
        }
        
        paper-button {
            background-color: var(--rwa-color-primary);
            color: var(--rwa-color-on-primary);
        }
        
    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
