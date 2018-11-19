class Letra{

	// Arg 0 - specify template directory
	// Arg 1 - specify the API file (e.g. api.php)
	// Arg 2 - should the class print logs in console?
	constructor(_atdiroverride = -1, _apiurl = -1, _averbose = false){
		this._app_initialized = false;
		this._app_conf = { _template_dir: _atdiroverride, _api_url: _apiurl };
		this._app_templates = [];
		this._app_templates_buffer = [];
		this._app_template_styles = [];
		this._app_started = false;
		this._app_verbose = _averbose;
	}

	// REST method to communicate with the back-end
	// Arg 0 - type of request (POST or GET)
	// Arg 1 - API url (_app_conf._api_url)
	// Arg 2 - Parameters of the request (must be an array)
	// Arg 3 - return buffer (object) - which object will be used to store return values
	// Arg 4 - return buffer (object key) - which key in the object will be used to store the return values
	// Arg 5 (optional) - execute a method on return
	// Arg 6 (optional) - include arguments in the return method (must be an array)
	_rest(_atype, _aurl, _aparams = null, _arethandle = null, _aretkey = null, _amethod = false, _amethodargs = []) {

		var core = this;

		// Encode the parameters for the request
		var params = "";
		if(_aparams != null){

			// GET request will have its params encoded into query strings
			// POST request will have its params encoded into form data
			if(_atype == "GET"){
				for (var i = 0, l = _aparams.length; i < l; i++){
					if(_aparams[i] instanceof Array){
						_aparams[i] = _aparams[i].join("=");
					}
				}
				params = _aparams.join("&");
			} else if(_atype == "POST"){
				params = new FormData();
				for (var i = 0, l = _aparams.length; i < l; i++){
					if(_aparams[i] instanceof Array){
						params.append(_aparams[i][0], _aparams[i][1]);
					}
				}
			}
		}

		// Log
		if(core._app_verbose){
			console.log("REST Request (" + _atype + "):");
			console.log(params);
		}

		// Execute the request
		var _xreq = new XMLHttpRequest();
			_xreq.open(_atype, _aurl + (_atype == "GET" ? (_aparams != null ? "?" + params : "") : ""), (_aparams != null ? (_atype == "POST" ? true : false) : false));
			_xreq.addEventListener("load", function(){ if(_amethod != false){ _amethod(_amethodargs); } _arethandle[_aretkey] = this.responseText; });
			_xreq.setRequestHeader('Cache-Control', 'no-cache');
			_xreq.send((_atype == "POST" ? (_aparams != null ? params : "") : ""));

	}

	// Load the configuration file (retrieve the template directory from the API)
	// or if template dir is already specified, use that.
	_boot(){
		var core = this;
		if(core._app_conf._template_dir != -1){
				core._app_initialized = true;
		} else {
				core._rest("POST", core._app_conf._api_url, [["api", "template_get_dir"]], core._app_conf, "_template_dir");

			// Wait until all the config variables are all retrieved
			var _tmpVarCheck = setInterval(function(){

				if(core._app_verbose) console.log("Initializing application...");
				if(core._app_conf._template_dir != -1){
					core._app_initialized = true;
					clearInterval(_tmpVarCheck);
				}
			}, 1);
		}
	}

	// Load a template from file, store the html script of the template in the _app_templates array buffer
	_template_load(_atpath, _atkey, _atcallback = null, _aterrorcallback = null){
		var core = this;
		if(core._app_verbose) console.log("Loading template: " + _atpath + "...");
		core._app_templates.push([_atkey, ""]);
		core._app_templates_buffer.push([_atkey, ""]);
		core._rest("GET", _atpath, [], core._app_templates, _atkey);
		core._rest("GET", _atpath, [], core._app_templates_buffer, _atkey);
		if(_atsuccesscallback != null) _atsuccesscallback();
	}

	// Load a template from string
	_template_load_string(_astr, _atkey, _atcallback = null, _aterrorcallback = null){
		var core = this;
		if(core._app_verbose) console.log("Loading template string...");
		core._app_templates.push([_atkey, ""]);
		core._app_templates[_atkey] = _astr;
		core._app_templates_buffer.push([_atkey, ""]);
		core._app_templates_buffer[_atkey] = _astr;
		if(_atsuccesscallback != null) _atsuccesscallback();
	}

	// Load a template from the filesystem (useful for mobile applications)
	_template_load_fs(_atpath, _atkey, _atsuccesscallback = null, _aterrorcallback = null){
		var core = this;
		window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + _atpath,
			function(fileEntry) {
				if(core._app_verbose) console.log("Loading template: " + cordova.file.applicationDirectory + _atpath + "...");
				fileEntry.file(function(file) {
					var reader = new FileReader();
					reader.onloadend = function(e) {
						core._app_templates.push([_atkey, ""]);
						core._app_templates[_atkey] = this.result;
						core._app_templates_buffer.push([_atkey, ""]);
						core._app_templates_buffer[_atkey] = this.result;
						if(_atsuccesscallback != null) _atsuccesscallback();
					}
					reader.readAsText(file);
				});
			}, function(){
				if(_aterrorcallback != null) _aterrorcallback();
				console.log("Error loading template: " + _atpath);
			});
	}

	// Retrieve the template markup code from the array buffer
	_template_output(_atname, _abuffer = false){
		var core = this;

		// Embed constant variable before printing
		if(_abuffer == true){
			return  core._app_templates_buffer[_atname];
		} else {
			return core._app_templates[_atname];
		}
	}

	// Parse variable keys in a template
	_template_parse(_atname, _atkey, _atvar){
		var core = this;
				core._app_templates_buffer[_atname] = core._app_templates[_atname].split('{' + _atkey + '}').join(_atvar);
	}

	_template_parse_array(_atname, _arrvars){
		var core = this;
		var ret = core._app_templates[_atname];
		for(var i = 0; i < _arrvars.length; i++){
			if(_arrvars[i][1] != null){
				ret = ret.split('{' + _arrvars[i][0] + '}').join(_arrvars[i][1]);
			} else {
				ret = ret.split('{' + _arrvars[i][0] + '}').join("");
			}
		}
		core._app_templates_buffer[_atname] = ret;
		return ret;
	}

	// Parse variable keys in a template
	_template_parse_temporary(_atname, _arrvars){
		var core = this;
		var ret = core._app_templates[_atname];
		for(var i = 0; i < _arrvars.length; i++){
			if(_arrvars[i][1] != null){
				ret = ret.split('{' + _arrvars[i][0] + '}').join(_arrvars[i][1]);
			} else {
				ret = ret.split('{' + _arrvars[i][0] + '}').join("");
			}
		}
		return ret;
	}

	// Parse variable keys in a template
	_template_parse_inline(_acontent, _arrvars){
		var core = this;
		var ret = _acontent;
		for(var i = 0; i < _arrvars.length; i++){
			if(_arrvars[i][1] != null){
				ret = ret.split('{' + _arrvars[i][0] + '}').join(_arrvars[i][1]);
			} else {
				ret = ret.split('{' + _arrvars[i][0] + '}').join("");
			}
		}
		return ret;
	}

	// Add a CSS style that will be used for the templates
	_template_add_style(_astyle){
		var core = this;
		core._app_template_styles.push(_astyle);
	}

	// Display the template to an element - default is "#app"
	_template_display(_acontent, _ael = document.getElementById("app"), _arrvars = null){
		var core = this;
		if(_arrvars != null){
			_acontent = core._template_parse_inline(_acontent, _arrvars);
		}
		_ael.innerHTML = _acontent;
		for(var i = 0; i < core._app_template_styles.length; i++){
			document.querySelector('head').innerHTML += "<link rel=\"stylesheet\" href=\"" + core._app_template_styles[i] + "\" type=\"text/css\"/>";
		}
	}

	// Clear the _app_templates array buffer
	_page_clear(){
		var core = this;
		core._app_templates = [];
	}

}
