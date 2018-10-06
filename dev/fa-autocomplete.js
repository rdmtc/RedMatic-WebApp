const fs = require('fs');
const path = require('path');

const fas = require(path.join(__dirname, '../webapp/node_modules/@fortawesome/free-solid-svg-icons/index.js'));
const far = require(path.join(__dirname, '../webapp/node_modules/@fortawesome/free-regular-svg-icons/index.js'));
const fab = require(path.join(__dirname, '../webapp/node_modules/@fortawesome/free-brands-svg-icons/index.js'));

const icons = [];

function pushIcons(family) {
    Object.keys(family).forEach(id => {
        if (family[id].prefix && family[id].iconName) {
            icons.push(family[id].prefix + ' fa-' + family[id].iconName);
        }
    });
}

pushIcons(fas);
pushIcons(far);
pushIcons(fab);

console.log(icons);
