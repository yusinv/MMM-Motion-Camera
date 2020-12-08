const NodeHelper = require("node_helper");
const dataUriParser = require("datauri/parser");
const childProcess = require("child_process");
const environ = Object.assign(process.env, {DISPLAY: ":0"});

module.exports = NodeHelper.create({

    config: {},
    players: {},

    start: function () {
        this.started = false;
    },

    stop: function () {
        console.log("Shutting down MMM-Motion");
        Object.keys(this.players).forEach(s => {
            this.stopFFPlay(s);
        });
    },

    stopFFPlay: function (name) {
        console.log("Stopping player for stream " + name);
        const proc = this.players[name];
        proc.kill();
    },

    startFFPlay: function (name) {
        const sc = this.config[name];
        const cmd = "ffplay";
        const args = [sc.streamUrl, "-x", sc.playerWidth, "-y", sc.playerHeight, "-v", "error"];
        const opts = {detached: false, env: environ, stdio: ["ignore", "ignore", "pipe"]};

        this.players[name] = childProcess.spawn(cmd, args, opts);

        this.players[name].on("error", (err) => {
            console.error(err)
            console.error(`Failed to start player: ${this.players[name]}.`);
        });
    },

    socketNotificationReceived: function (notification, payload) {
        const self = this;
        if (notification === "INIT") {
            this.config = payload;
            let streams = Object.keys(this.config).filter(key => key.startsWith("stream"));
            streams.forEach((name) => {
                // this.startListener(name);
                this.sendSocketNotification("STARTED", name);
            });
        } else if (notification === "STOP_PLAYER") {
            if (payload in this.players) {
                this.stopFFPlay(payload);
                delete this.players[payload];
            }
        } else if (notification === "START_PLAYER") {
            if (!(payload in this.players)) {
                this.startFFPlay(payload);
            }
        } else if (notification === "PREPARE_SNAPSHOT") {
            const parser = new dataUriParser();
            parser.format(".jpeg", payload);
            // console.log(parser.content);
            this.sendSocketNotification("UPDATE_SNAPSHOT", {name: "stream1", image: true, buffer: parser.content});
        }
    },
});
