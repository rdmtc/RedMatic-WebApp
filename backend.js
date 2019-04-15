const fs = require('fs');
const path = require('path');
const {EventEmitter} = require('events');
const socketio = require('socket.io');
const serveStatic = require('serve-static');

let inited = false;

const settings = {};

let io;

class Conn extends EventEmitter {
    constructor() {
        super();
        this.on('event', data => {
            io.emit('event', data);
        });
        this.on('sysvar', data => {
            io.emit('sysvar', data);
        });
        this.on('program', data => {
            io.emit('program', data);
        });
    }
}

const conn = new Conn();
const config = {};

module.exports = function (RED, conf) {
    config[conf.name] = conf;
    if (!inited) {
        inited = true;
        init(RED);
    }
    return conn;
};

// From: http://stackoverflow.com/a/28592528/3016654
function join(...paths) {
    const trimRegex = new RegExp('^\\/|\\/$', 'g');

    return '/' + paths.map(e => {
        return e.replace(trimRegex, '');
    }).filter(e => {
        return e;
    }).join('/');
}

function init(RED) {
    const {log, server} = RED;
    const app = RED.httpNode || RED.httpAdmin;
    const redSettings = RED.settings;

    const uiSettings = redSettings.redmaticWebapp || {};
    settings.path = uiSettings.path || 'app';
    settings.title = uiSettings.title || 'RedMatic WebApp';
    settings.defaultGroupHeader = uiSettings.defaultGroup || 'Default';

    const fullPath = join(redSettings.httpNodeRoot, settings.path);
    const socketIoPath = join(fullPath, 'socket.io');
    io = socketio(server, {path: socketIoPath});

    // Replace base href and rootPath for usage without RedMatic
    if (!fs.existsSync('/usr/local/addons/redmatic')) {
        app.use((req, res, next) => {
            console.log(req.path, settings.path, redSettings.httpRoot)
            if (req.path === '/app/' || req.path === '/app/index.html') {
                fs.readFile(path.join(__dirname, 'www', 'index.html'), (err, data) => {
                    data = data.toString().replace(/\/addons\/red\/app\//g, fullPath + '/');
                    res.send(data)
                });
            } else {
                next();
            }
        });
    }

    app.use(join(settings.path), serveStatic(path.join(__dirname, 'www')));

    log.info('RedMatic-WebApp started at ' + fullPath);

    io.on('connection', socket => {
        const address = socket.request.connection.remoteAddress;
        log.debug('RedMatic-WebApp connect from ' + address);
        socket.on('getConfig', (id, cb) => {
            id = id.replace(/^\?\/?/, '').replace(/\/$/, '');
            log.info('RedMatic-WebApp getConfig "' + id +  '" from ' + address);
            if (config[id]) {
                cb({
                    config: {
                        name: config[id].name,
                        title: config[id].title,
                        theme: config[id].theme,
                        replaceChannelNames: config[id].replaceChannelNames,
                        showHome: config[id].showHome,
                        showRooms: config[id].showRooms,
                        showFunctions: config[id].showFunctions,
                        showSysvar: config[id].showSysvar,
                        showProgram: config[id].showProgram,
                        showSystem: config[id].showSystem,
                        rooms: config[id].rooms,
                        functions: config[id].functions
                    },
                    data: conn.getData && conn.getData()
                });
            } else {
                log.error('RedMatic-WebApp getConfig "' + id + '" unknown');
                cb({});
            }

        });

        socket.on('cmd', data => {
            conn.emit('cmd', data);
        });
    });

    io.on('connect_error', error => {
        console.log('connect_error', error);
    });
}

