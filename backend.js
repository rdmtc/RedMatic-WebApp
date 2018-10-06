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

    const uiSettings = redSettings.ui || {};
    settings.path = uiSettings.path || 'app';
    settings.title = uiSettings.title || 'RedMatic WebApp';
    settings.defaultGroupHeader = uiSettings.defaultGroup || 'Default';

    const fullPath = join(redSettings.httpNodeRoot, settings.path);
    const socketIoPath = join(fullPath, 'socket.io');
    io = socketio(server, {path: socketIoPath});
    app.use(join(settings.path), serveStatic(path.join(__dirname, 'www')));

    log.info('RedMatic-WebApp started at ' + fullPath);

    io.on('connection', socket => {
        const address = socket.request.connection.remoteAddress;
        log.debug('RedMatic-WebApp connect from ' + address);
        socket.on('getConfig', (id, cb) => {
            id = id.replace(/^\?\/?/, '').replace(/\/$/, '');
            log.info('RedMatic-WebApp getConfig "' + id +  '" from ' + address);
            cb({
                config: config[id],
                data: conn.getData && conn.getData()
            });
        });

        socket.on('cmd', data => {
            conn.emit('cmd', data);
        });
    });

    io.on('connect_error', error => {
        console.log('connect_error', error);
    });
}

