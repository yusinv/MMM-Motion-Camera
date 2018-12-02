/* global Module */

/* Magic Mirror
 * Module: MMM-Motion-Camera
 *
 * By Valentin
 * MIT Licensed.
 */

Module.register("MMM-Motion-Camera", {
	defaults: {
		height: "300px",
		width: "100%",
		scrolling: "no",
		notification_label: "MOTION_DETECTED",
		cameraUrl: "http://door/picture/1/frame/",
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function () {

		//let self = this;
		console.log("socketNotificationReceived2");
		//send message to establish connection with helper
		//this.sendSocketNotification("main", {cameraId: this.config.cameraId});
		this.motionDetected = false;
	},

	getDom: function () {
		var self = this;

		// create element wrapper for show into the module
		var wrapper = document.createElement("div");
		wrapper.className = "wrapper";

		var frameDiv = document.createElement("div");

		var iFrame = document.createElement("IFRAME");
		iFrame.className = "iframe";
		iFrame.src = self.config.cameraUrl;


		if (this.motionDetected) {
			wrapper.className = "wrapper_motion";
			var label = document.createElement("label");
			label.innerHTML = this.translate("MOTION");
			label.className = "label";
			wrapper.appendChild(label);
			wrapper.appendChild(document.createElement("br"));
			frameDiv.className = "camera_motion";
		} else {
			frameDiv.className = "camera";

		}


		wrapper.appendChild(frameDiv);
		frameDiv.appendChild(iFrame);
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

	//socketNotificationReceived from helper
	notificationReceived: function (notification, payload, sender) {
		console.log("socketNotificationReceived" + notification);
		Log.log("socketNotificationReceived2" + payload);
		if (notification === this.config.notification_label) {
			switch (payload) {
			case "0":
				this.motionDetected = false;
				this.header = "noone";
				break;
			case "1":
				this.motionDetected = true;
				this.header = "AA!!!!!!";
				break;
			}
			this.updateDom(100);
		}
	},
});
