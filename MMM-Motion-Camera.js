/* global Module */

/* Magic Mirror
 * Module: MMM-Motion-Camera
 */

Module.register("MMM-Motion-Camera", {
    defaults: {
        animationSpeed: 1500,
        stream1: {
            streamUrl: "rtsp://door_camera/live/ch00_2",
            playerWidth: 800,
            playerHeight: 450
        }
    },

    requiresVersion: "2.1.0", // Required version of MagicMirror

    start: function () {
        this.motionDetected = false;
        this.sendSocketNotification("INIT", this.config);
    },

    getDom: function () {
        // create element wrapper for show into the module
        const wrapper = document.createElement("div");
        wrapper.className = "wrapper";

        const frameDiv = document.createElement("div");
        frameDiv.id = "camera_frame"
        wrapper.appendChild(frameDiv);

        if (this.motionDetected) {
            wrapper.className = "wrapper_motion";
            const label = document.createElement("label");
            label.innerHTML = this.translate("MOTION");
            label.className = "label";
            wrapper.appendChild(label);
            wrapper.appendChild(document.createElement("br"));
            frameDiv.className = "camera_motion";
        } else {
            frameDiv.className = "camera";
        }


        wrapper.appendChild(frameDiv);
        return wrapper;
    },

    getStyles: function () {
        return [
            "motion.css",
        ];
    },

    // Load translations files
    getTranslations: function () {
        //FIXME: This can be load a one file javascript definition
        return {
            en: "translations/en.json",
            ru: "translations/ru.json"
        };
    },


    notificationReceived: function (notification, payload, sender) {
        if (notification === "MOTION_START") {
            this.motionDetected = true;
            this.updateDom(this.config.animationSpeed);
            this.sendSocketNotification("START_PLAYER", payload);
        } else if (notification === "MOTION_END") {
            this.motionDetected = false;
            this.updateDom(this.config.animationSpeed);
            this.sendSocketNotification("STOP_PLAYER", payload);
        } else if (notification === "VIDEO_SNAPSHOT") {
            this.sendSocketNotification("PREPARE_SNAPSHOT", payload);
        }
    },


    // socketNotificationReceived from helper
    socketNotificationReceived: function (notification, payload) {
        if (notification === "STARTED") {
            if (!this.loaded) {
                this.loaded = true;
                this.updateDom(this.config.animationSpeed);
            }
            // this.sendSocketNotification("MODE_SNAPSHOT", payload);
        }
        if (notification === "UPDATE_SNAPSHOT") {
            if (payload.image && !this.motionDetected) {
                let img = document.getElementById("camera_image");
                if (img === null) {
                    const cf = document.getElementById("camera_frame")
                    img = document.createElement("img");
                    img.style.width = "100%";
                    img.style.height = "100%";
                    img.id = "camera_image";
                    cf.appendChild(img)
                }
                img.src = payload.buffer;
            }
        }
    },
});
