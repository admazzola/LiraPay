var _app = new App("templates/default/", "", 1);
		_app._boot();

document.addEventListener("deviceready", function(){ _app._ui_device_ready() }, false);

var _tmpCheckStartup = setInterval(function(){
	if(_app._app_initialized && !_app._app_started && _app._device_ready){

		_app._construct();
		_app._app_started = true;

		clearInterval(_tmpCheckStartup);
	}
}, 1000);
