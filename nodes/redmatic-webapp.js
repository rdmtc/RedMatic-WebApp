
module.exports = function (RED) {
    class RedMaticWebApp {
        constructor(config) {
            const conn = require('../backend')(RED, config);

            /*
            Let multiple = false;
            RED.nodes.eachNode(n => {
                if (n.type === 'redmatic-webapp') {
                    RED.log.error('Es gibt bereits einen RedMatic-WebApp Node!');
                    multiple = true;
                }
            });
            if (multiple) {
                return;
            }
            */

            RED.nodes.createNode(this, config);

            this.ccu = RED.nodes.getNode(config.ccuConfig);

            if (!this.ccu) {
                return;
            }

            this.idSubscription = this.ccu.subscribe({}, msg => {
                conn.emit('event', msg);
            });

            conn.on('cmd', msg => {
                switch (msg.type) {
                    case 'hm':
                        switch (msg.method) {
                            case 'setValue':
                                this.ccu.setValue(msg.iface, msg.address, msg.datapoint, msg.value);
                                break;
                            case 'programExecute':
                                this.ccu.programExecute(msg.name);
                                break;
                            default:

                        }
                        break;
                    default:
                }
            });

            conn.getData = () => {
                if (!this.ccu.rooms || !this.ccu.channelRooms) {
                    return null;
                }

                const channels = {};
                const channelIface = {};
                Object.keys(this.ccu.metadata.devices).forEach(iface => {
                    Object.keys(this.ccu.metadata.devices[iface]).forEach(address => {
                        channelIface[address] = iface;
                    });
                    Object.assign(channels, this.ccu.metadata.devices[iface]);
                });

                const roomItems = {};
                Object.keys(this.ccu.channelRooms).forEach(channel => {
                    if (this.ccu.channelRooms[channel]) {
                        this.ccu.channelRooms[channel].forEach(room => {
                            roomItems[room] = roomItems[room] || [];
                            roomItems[room].push({
                                name: this.ccu.channelNames[channel],
                                type: 'hmchannel',
                                config: {
                                    iface: channelIface[channel],
                                    hmChannelType: channels[channel].TYPE.replace(/_/g, '-').toLowerCase(),
                                    address: channel,
                                    paramsetName: this.ccu.paramsetName(channelIface[channel], channels[channel], 'VALUES')
                                }
                            });
                        });
                    }
                });

                const functionItems = {};


                Object.keys(this.ccu.channelFunctions).forEach(channel => {
                    if (this.ccu.channelFunctions[channel]) {
                        this.ccu.channelFunctions[channel].forEach(func => {
                            functionItems[func] = functionItems[func] || [];
                            functionItems[func].push({
                                name: this.ccu.channelNames[channel],
                                type: 'hmchannel',
                                config: {
                                    iface: channelIface[channel],
                                    hmChannelType: channels[channel] && channels[channel].TYPE.replace(/_/g, '-').toLowerCase(),
                                    address: channel,
                                    paramsetName: this.ccu.paramsetName(channelIface[channel], channels[channel], 'VALUES')
                                }
                            });
                        });
                    }
                });
                
                const rooms = [];
                this.ccu.rooms.sort().forEach(room => {
                    rooms.push({
                        name: room,
                        items: roomItems[room]
                    });
                });

                const functions = [];
                this.ccu.functions.sort().forEach(func => {
                    functions.push({
                        name: func,
                        items: functionItems[func]
                    });
                });

                return {
                    channelRooms: this.ccu.channelRooms,
                    channelNames: this.ccu.channelNames,
                    paramsetDescriptions: this.ccu.paramsetDescriptions,
                    deviceDescriptions: this.ccu.metadata && this.ccu.metadata.devices,
                    rooms,
                    functions,
                    variables: this.ccu.sysvar,
                    programs: this.ccu.program,
                    values: this.ccu.values
                };
            };
        }

        _destructor(done) {
            this.ccu.unsubscribe(this.idSubscription);
            done();
        }
    }

    RED.nodes.registerType('redmatic-webapp', RedMaticWebApp);
};
