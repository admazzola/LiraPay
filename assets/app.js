class App extends Letra{

	_construct(){

		this._device_ready =									false;
		this.networks_list =									[{"_name": "Ethereum Mainnet",
																										"_etherscan_api_url": "https://api.etherscan.io/api",
																										"_etherscan_api_key": "KIJA4UCUFGND7VVTTFK9JCNCXB3DFY92RE",
																										"_web3_provider": "https://mainnet.infura.io/nc9eiaThqvolLxLmBCbD",
																										"_contract_address": "0x49AAa160506F7e07E6C3F6cD6316b6866025cDcB"},

																						{	"_name": "Ropsten Testnet",
																												"_etherscan_api_url": "https://ropsten.etherscan.io/api",
																												"_etherscan_api_key": "KIJA4UCUFGND7VVTTFK9JCNCXB3DFY92RE",
																												"_web3_provider": "https://ropsten.infura.io/nc9eiaThqvolLxLmBCbD",
																												"_contract_address": "0xbef21cc9eaf047632fb66c73716c3615604c374a" }
																					];

		this._app_boot_speed =								1000;
    this._app_ret_buffer = 								{ _txs: null, _txs_temp: null, _send_funds_invoice_serial: null, _send_funds_is_invoice: null, _send_funds_amount_invoice: null, _send_funds_address_invoice: null, _gas_estimated_cost: null };
		this._app_version =           				"1.0.1";
		this._app_current_page =							"";
    this._app_config =            				""; // Buffer for application configurations
    this._app_qrscan_result =     				""; // Buffer for latest QR scan result
    this._app_qrscan_previous_result = 		""; // QR scan buffer for previous QR scan result
		this._app_qrscan_result_error = 			false;
    this._app_config_empty =      				false; // Indicates if the configuration is empty or inexistent (useful in determine app first run)
		this._app_window_width =							0;
		this._app_window_height =							0;
    this._web3 =                  				""; // The web3 handle for the application's web3 instance
		this._contract_abi =          				-1; // The current API model of the contract
		this._contract_address =      				"0x49AAa160506F7e07E6C3F6cD6316b6866025cDcB"; // The current contract address used in the application
		this._etherscan_url =         				"https://api.etherscan.io/api"; // The etherscan API url for retrieving transactions information only
		this._etherscan_api =         				"KIJA4UCUFGND7VVTTFK9JCNCXB3DFY92RE"; // The etherscan API key to be used in the application
		this._web3_provider =         				"https://mainnet.infura.io/nc9eiaThqvolLxLmBCbD"; // The infura URL for the API - specify the chosen network (mainnet or ropsten? &c.)
		this._wallets =               				-1; // Buffer array of wallets (address and ciphered private key)
		this._wallets_empty =         				false; // Indicates if the wallet is empty (no wallets available)
		this._wallet_address_id =     				-1; // The current selected wallet address id in the _wallets buffer array
    this._wallet_address =        				""; // The actual address of the current select wallet address
    this._wallet_address_key =    				""; // The ciphered private key for the current selected wallet address
    this._wallet_balance_lira =   				0.0; // The LIRA wallet balance
    this._wallet_balance_ether =  				0.0; // The ETH wallet balance
    this._wallet_balance_lira_actual =   	0.0; // The LIRA wallet balance
    this._wallet_balance_ether_actual =  	0.0; // The ETH wallet balance
		this._wallet_balance_trimmed = 				0.0; // The LIRA wallet balance
		this._wallet_txs = 										null; // Buffer for wallet txs templates (not array)
		this._wallet_balance_lira_loaded = 		false; // Indicates if Lira balance is loaded
		this._wallet_balance_ether_loaded = 	false; // Inbicates if Ether balance is loaded
		this._wallet_txs_update_interval =		2000;
		this._wallet_txs_loaded = 						false; // Indicates if wallet tx are loaded
		this._wallet_txs_load_lock =					false;
		this._wallet_txs_result_count = 			0;
		this._wallet_txs_pagination_count = 	15; // How many tx are displayed per page
		this._wallet_txs_pagination_last = 		1;
		this._wallet_txs_gas_multiplier =			1; // How much gas is paid for transaction requests (current_gas_price * multiplier) - gas price forecast taken from Ethgasstation.info
		this._wallet_txs_boot_load =					false;
		this._tx_pending_buffer =							"";

		this._gas_calculator_interval = 			null; // Handle for gas caluclation method (interval)
    this._transaction_current_hash = 			""; // The latest transaction hash (produced by send funds procedure)
		this._swipe_dashboard_init = 					false;
		this._swipe_history_init = 						false;
		this._swipe_lock = 										false;
		this._swipe_load_more_locked = 				false;
		this._swipe_loader_locked =						false;
		this._swipe_loader_top =							0;
		this._swipe_loader_min_dist =					80;
		this._swipe_loader_int =							null;
		this._scrollbar =											null;
		this._page_result_return =    				""; // Id of the return page portal

		this._ui_buttons_toggled =						false;
		this._templates_loaded_success  = 		false; // Inidicates if template has been loaded
		this._templates_loaded = 							0; // Counter of how many templates have been loaded
		this._templates_paths = 							[	"bootstrap_create",
																						"bootstrap_entrance",
																						"bootstrap_import",
																						"bootstrap_process",
																						"bootstrap_result_error",
																						"bootstrap_result_success",
																						"bootstrap_tos",
																						"bootstrap",
																						"dashboard",
																						"help",
																						"history",
																						"request_funds",
																						"send_funds_authentication",
																						"send_funds_confirmation",
																						"send_funds_failed",
																						"send_funds_process",
																						"send_funds_success",
																						"send_funds",
																						"settings",
																						"settings_add_wallet",
																						"settings_wallet_create",
																						"settings_wallet_import",
																						"settings_wallet_add_success",
																						"settings_wallet_create_process",
																						"settings_wallet_import_process",
																						"splash",
																						"retrieve_transaction",
																						"retrieve_transaction_success",
																						"widgets/contacts.widget",
																						"widgets/transactions.widget",
																						"widgets/transactions_pending.widget",
																						"widgets/network_info.widget",
																						"widgets/wallet_info.widget"];

		var core = this;

		// Load template styles
		core._page_clear();
		core._template_add_style(core._app_conf._template_dir + "css/index.css");
		core._template_add_style(core._app_conf._template_dir + "css/fonts.css");
		core._template_add_style(core._app_conf._template_dir + "css/tillium.css");
		core._template_add_style(core._app_conf._template_dir + "css/ubuntu.css");

		// Load all template assets
		for(var i = 0; i < core._templates_paths.length; i++){
			core._template_load_fs("/www/templates/default/" + core._templates_paths[i] + ".html", core._templates_paths[i], function(){ core._templates_loaded++; });
		}

		// Prepare the event hooks needed for the entire application
		var tmpReadyInterval = setInterval(function(){
			if(core._templates_loaded >= core._templates_paths.length-1 && !core._templates_loaded_success == true){

				// Prevent loop execution of method in context
				core._templates_loaded_success = true;

				// Attach navigation events
				core._ui_attach_event_hooks(true);

				// Get the app config and initalize web3
				console.log("Loading existing configurations...");
				core._ff_load_app_config();

				console.log("Loading wallets list...");
				core._ff_wallets_list();

				console.log("Loading contract abi...");
				core._web3_load_contract_abi();

				// Make sure text fields are not covered by the keyboard when on focus
				window.addEventListener("native.keyboardshow", function() {
          cordova.plugins.Keyboard.disableScroll(true);
        });

				core._app_window_width = window.innerWidth;
				core._app_window_height =	window.innerHeight;

				window.addEventListener('resize', function(){
					if(window.innerHeight >= (core._app_window_height - 50)){
						core._ui_toggle_buttons_out();
					} else {
						core._ui_toggle_buttons();
					}
				}, true);

				// Check if network is available
				console.log("Checking network state...");
			  var networkState = navigator.connection.type;
				if(networkState == Connection.NONE){
					alert("Error: unable to detect a network connection.");
					core._ui_show_result("bootstrap_result_error", "err_bootstrap_result", "No network connection detected.<br>Please try again.");
				} else {

					console.log("Initializing web3...");

					// Check if bootraping process has finished
					var bootstrapCheck = setInterval(function(){

						console.log("Web3 initialized...");
						if( core._contract_abi != -1 &&
								core._app_config != -1){

							console.log("Contract ABI loaded...");

							if( core._wallets_empty == true &&
									core._wallets.constructor !== Array){
								if(core._app_verbose) console.log("App initialized. Wallets not found.");
								core._ui_event_portals("bootstrap");
								clearInterval(bootstrapCheck);
							} else if(core._wallets != -1 &&
												core._wallets.constructor === Array) {
								if(core._app_verbose) console.log("App initialized. Wallets found.");
								core._ui_event_portals("bootstrap_entrance");
								setTimeout(function(){
									core._web3_init(core._wallets[core._app_config[0].default_address].address,
																	core._wallets[core._app_config[0].default_address].ckey);
								}, core._app_boot_speed);
								clearInterval(bootstrapCheck);
							} else {
								if(core._app_verbose) console.log("App initialized. Wallets not found.");
								core._ui_event_portals("bootstrap");
								clearInterval(bootstrapCheck);
							}
						}
					}, core._app_boot_speed);

					// Initailize swipe touch detection for infinite loading
					core._ui_swipe_detect(document, function(e){ core._ui_swipe_detect_callback(e, core); });
				}

				clearInterval(tmpReadyInterval);
			}
		}, core._app_boot_speed);
	}

	_ui_device_ready(){
		this._device_ready = true;
	}

	// Callback after page change
	_ui_event_portals_post(_aportal, _aparams = null){
		var core = this;
		var _arrs = null;
		var _acall = null;

		core._swipe_dashboard_init = false;
		core._swipe_history_init = false;

		switch(_aportal){

			case "dashboard":{
				var _findEl = document.getElementById("recent_transactions");
				if(_findEl != null && core._swipe_dashboard_init == false){
					core._swipe_dashboard_init = true;
				}

				// Resize the transactions list box - for some reason calc() doesn't work
				// Enable the "Load More" button if there are enough items on the tx list
				// Check if there are items in the transaction history, otherwise display the "no data" element
				if(core._wallet_txs_result_count != null){
					if(core._wallet_txs_result_count >= core._wallet_txs_pagination_count || (core._wallet_txs_result_count <= core._wallet_txs_pagination_count && core._wallet_txs_result_count > 0)){
						if(core._wallet_txs_result_count >= core._wallet_txs_pagination_count){
							document.getElementById("empty_notice_footer").style.display = "block";
							document.getElementById("nodata_transaction_history").style.display = "none";
							document.getElementById("recent_transactions_container").style.height = (window.innerHeight - (210 + 95)) + "px";
							document.getElementById("recent_transactions").style.minHeight = (window.innerHeight - (210 + 95)) + "px";
						} else {
							document.getElementById("empty_notice_footer").style.display = "block";
							document.getElementById("nodata_transaction_history").style.display = "none";
							document.getElementById("recent_transactions_container").style.height = (window.innerHeight - (210 + 95)) + "px";
							document.getElementById("recent_transactions").style.minHeight = (window.innerHeight - (210 + 95)) + "px";
						}
					} else {
						if(core._wallet_txs_result_count <= 0){
							document.getElementById("empty_notice_footer").style.display = "none";
							document.getElementById("nodata_transaction_history").style.display = "block";
						}
						document.getElementById("recent_transactions_container").style.height = (window.innerHeight - (210 + 95)) + "px";
						document.getElementById("recent_transactions").style.minHeight = (window.innerHeight - (210 + 95)) + "px";
					}
				} else {
					document.getElementById("empty_notice_footer").style.display = "none";
					document.getElementById("nodata_transaction_history").style.display = "block";
				}

				core._web3_get_wallet_balance_ether();
				core._web3_get_wallet_balance();

				// Get all the user's transactions at boot
				if(core._wallet_txs_boot_load == false){
					core._ui_update_transactions_list();

					// Create a timed interval to check wallet tx updates
					setInterval(function(){ core._ui_update_transactions_list(1, true); }, core._wallet_txs_update_interval);
					core._wallet_txs_boot_load = true;
				}

			} break;

			case "history":{
				var _findEl = document.getElementById("payment_history");
				if(_findEl != null && core._swipe_history_init == false){
					core._swipe_history_init = true;
				}

				// Resize the transactions list box - for some reason calc() doesn't work
				document.getElementById("payment_history_container").style.height = (window.innerHeight - (45 + 50)) + "px";
				document.getElementById("payment_history").style.minHeight = (window.innerHeight - (45 + 50)) + "px";

				// Enable the "Load More" button if there are enough items on the tx list
				// Check if there are items in the transaction history, otherwise display the "no data" element
				if(core._wallet_txs_result_count != null){
					if(core._wallet_txs_result_count >= core._wallet_txs_pagination_count || (core._wallet_txs_result_count <= core._wallet_txs_pagination_count && core._wallet_txs_result_count > 0)){
						if(core._wallet_txs_result_count >= core._wallet_txs_pagination_count){
							document.getElementById("empty_notice_footer").style.display = "block";
							document.getElementById("nodata_transaction_history").style.display = "none";
							document.getElementById("payment_history_container").style.height = (window.innerHeight - (45 + 50)) + "px";
							document.getElementById("payment_history").style.minHeight = (window.innerHeight - (45 + 50)) + "px";
						} else {
							document.getElementById("empty_notice_footer").style.display = "none";
							document.getElementById("nodata_transaction_history").style.display = "none";
							document.getElementById("payment_history_container").style.height = (window.innerHeight - (45 + 50)) + "px";
							document.getElementById("payment_history").style.minHeight = (window.innerHeight - (45 + 130)) + "px";
						}
					} else {
						if(core._wallet_txs_result_count <= 0){
							document.getElementById("empty_notice_footer").style.display = "none";
							document.getElementById("nodata_transaction_history").style.display = "block";
						}
						document.getElementById("payment_history_container").style.height = (window.innerHeight - (45 + 50)) + "px";
						document.getElementById("payment_history").style.minHeight = (window.innerHeight - (45 + 130)) + "px";
					}
				} else {
					document.getElementById("empty_notice_footer").style.display = "none";
					document.getElementById("nodata_transaction_history").style.display = "block";
				}

			} break;

			case "settings":{

				// Create list of all wallets
				var tmpWalletsList = "";
				for(var i = 0; i < core._wallets.length; i++){
					var walletData = [["wallet_address", core._wallets[i].address], ["wid", i], ["def", (i == core._app_config[0].default_address ? "checked" : "")]];
					var walletTemplate = core._template_parse_array("widgets/wallet_info.widget", walletData);
					tmpWalletsList = tmpWalletsList + walletTemplate;
				}

				var tmpNetworkList = "";
				for(var i = 0; i < core.networks_list.length; i++){
					var networkData = [["network_name", core.networks_list[i]._name], ["nid", i], ["def", (i == core._app_config[0].network ? "checked" : "")]];
					var networkTemplate = core._template_parse_array("widgets/network_info.widget", networkData);
					tmpNetworkList = tmpNetworkList + networkTemplate;
				}

				document.getElementById("network_list_container").innerHTML = tmpNetworkList;
				document.getElementById("wallet_list_container").innerHTML = tmpWalletsList;

			} break;

			case "bootstrap_process":{
				core._web3_get_wallet_balance_ether();
				core._web3_get_wallet_balance();
				core._ui_update_transactions_list();
			} break;

		}
	}

	_ui_event_popup(_aportal){
		var core = this;
		if(core._app_verbose) console.log("Loading popup: " + _aportal + " ...");
		var _popupTemplate = core._template_output(_aportal, true);
		document.getElementById("popups_list").innerHTML = _popupTemplate;
		document.getElementById("popups_list").style.display = "block";
		document.getElementById("page_pop").style.width = (window.innerWidth - 40) + "px";
		document.getElementById("page_pop").style.height = (window.innerHeight - 80) + "px";
		document.getElementById("page_pop_button").style.width = (window.innerWidth - 80) + "px";
	}

	_ui_event_portals(_aportal, _aparams = null){

		var core = this;
		var _arrs = null;
		var _acall = null;

		switch(_aportal){

			case "dashboard":{
				 _arrs = [	["wallet_balance_lira", core._wallet_balance_lira],
										["wallet_balance_trimmed", core._wallet_balance_trimmed],
										["wallet_balance_ether", core._wallet_balance_ether],
										["wallet_id", core._wallet_address],
										["wallet_txs", core._wallet_txs]
									];
					_acall = function(){
				}

				document.getElementById("dashboard_nav_button").style.color = "#3575e0";
				document.getElementById("dashboard_nav_button").style.backgroundColor = "#f5f5f5";
			} break;

			case "request_funds":{
				 _acall = function(){
					 core._ui_qrscan_code_generate("qrcode", core._wallets[core._app_config[0].default_address].address);
					 core._ui_apply_wallet_address_html(core._wallets[core._app_config[0].default_address].address);
				 }
			} break;

			case "history":{
				_arrs = [["wallet_txs", core._wallet_txs]];
			} break;

			case "retrieve_transaction_success":{

	 			var tmpTransactions = _aparams;
 				var txTime = new Date(parseInt(tmpTransactions.timeStamp)*1000).toLocaleDateString("en-US");
 				var txType = (tmpTransactions.from != core._wallet_address ? "&darr; Received" : "&uarr; Sent" );
 				var txHash = tmpTransactions.hash;
 				var txPayer = tmpTransactions.from;
 				var txReceipient = tmpTransactions.to;
 				var txGasUsed = tmpTransactions.gasUsed;
 				var txGasPrice = (tmpTransactions.gasPrice / 1000000000);
 				var txConfirmations = tmpTransactions.confirmations;
 				var txValue = (parseFloat(tmpTransactions.value)  / 100000000).toFixed(8);

 				var txPacket = [[	"type", txType ],
 												[	"value", txValue ],
 												[	"date", txTime ],
 												[	"hash", txHash ],
 												[ "time", txTime ],
 												[ "gas", txGasPrice ],
 												[ "gasused", txGasUsed ],
 												[ "confirmations", txConfirmations ],
 												[ "to", txReceipient ],
 												[ "from", txPayer ]];

				_arrs = txPacket;

			} break;

			case "send_funds_authentication":
			case "send_funds_confirmation":
			case "send_funds_failed":
			case "send_funds_process":
			case "send_funds_success":
			case "send_funds":
			case "send_funds":{
				document.getElementById("dashboard_nav_button").style.color = "#3575e0";
				document.getElementById("dashboard_nav_button").style.backgroundColor = "#f5f5f5";
			} break;

			case "settings":
			case "bootstrap":
			case "bootstrap_entrance":
			case "bootstrap_tos":
			case "bootstrap_create":
			case "bootstrap_import":
			case "bootstrap_process":
			case "bootstrap_result_error":
			case "bootstrap_result_success":{
				_arrs = [	["app_version", "App Version " + core._app_version],
									["app_version_number", core._app_version]];
			} break;

		}

		core._ui_page_change(_aportal, _arrs, _acall);
		core._ui_event_portals_post(_aportal, _aparams);
	}

	_ui_attach_event_hooks(_ainit = false){

		var core = this;
		var tmpErrNoticeEls = document.getElementsByClassName("error_notice");
		var tmpNavigationEls = document.getElementsByClassName("navigation");
		var tmpTextInputEls = document.getElementsByClassName("text_input");
		for(var i = 0; i < tmpNavigationEls.length; i++){

			// Page can change when portals are clicked
			tmpNavigationEls[i].addEventListener('click', function(event){

				// Navigation elements are portals to different pages
				if(this.hasAttribute("portal")){
					core._ui_event_portals(this.getAttribute("portal"));
				}

				// Navigation elements are popup portals to different pages
				if(this.hasAttribute("portal_popup")){
					core._ui_event_popup(this.getAttribute("portal_popup"));
				}

				// Anchor tag navigation are condered widgets
				// therefore do not require changing of style
				if(_ainit == true){

					if(this.nodeName.indexOf("A") == -1 && this.nodeName.indexOf("INPUT") == -1 && this.id.indexOf("import_wallet_qrcode") == -1 &&  this.id.indexOf("send_funds_qrcode") == -1){

						// If the portal also has command, execute it on click
						if(this.hasAttribute("portal_command")){
							eval(this.getAttribute("portal_command"));
						}
					}

					for(var ii = 0; ii < tmpNavigationEls.length; ii++){
						if(tmpNavigationEls[ii].nodeName.indexOf("A") == -1 && tmpNavigationEls[ii].nodeName.indexOf("INPUT") == -1 && tmpNavigationEls[ii].id.indexOf("import_wallet_qrcode") == -1 && tmpNavigationEls[ii].id.indexOf("send_funds_qrcode") == -1){
							tmpNavigationEls[ii].style.color = "#6e6e6e";
							tmpNavigationEls[ii].style.backgroundColor = "white";
						}
					}

					if(this.nodeName.indexOf("A") == -1 && this.nodeName.indexOf("INPUT") == -1 && this.id.indexOf("import_wallet_qrcode") == -1 && this.id.indexOf("send_funds_qrcode") == -1 && !this.hasAttribute("portal_popup")){
						this.style.color = "#3575e0";
						this.style.backgroundColor = "#f5f5f5";
					}

				}

				if(this.nodeName.indexOf("INPUT") > -1 || this.nodeName.indexOf("I") > -1){

					// Hide all error notice text boxes
					for(var ii = 0; ii < tmpErrNoticeEls.length;  ii++){
						tmpErrNoticeEls[ii].style.visibility = "hidden";
					}

					// Reset error notice input colors
					for(var ii = 0; ii < tmpTextInputEls.length;  ii++){
						tmpTextInputEls[ii].style.borderColor = "#eeeeee";
						tmpTextInputEls[ii].val = "";
					}

				}

			}, false);
		}
	}

	_ui_reload_event_hooks(){
		var core = this;
		var tmpNavigationEls = document.getElementsByClassName("navigation");
		for(var i = 0; i < tmpNavigationEls.length; i++){
			// Page can change when portals are clicked
			tmpNavigationEls[i].addEventListener('click', function(event){

				if(this.nodeName.indexOf("A") > -1 || this.nodeName.indexOf("INPUT") > -1 || this.id.indexOf("import_wallet_qrcode") > -1 || this.id.indexOf("send_funds_qrcode") > -1){
					// Make sure the default event do not fire
					event.preventDefault();

					// If the portal also has command, execute it on click
					if(this.hasAttribute("portal_command")){
						eval(this.getAttribute("portal_command"));
					}

					// Navigation elements are portals to different pages
					if(this.hasAttribute("portal")){
						core._ui_event_portals(this.getAttribute("portal"));
					}
				}

			}, false);
		}
	}

  _web3_init(addr, kkey, rebootstrap = false){
    var core = this;
    core._web3_set_wallet_address(addr);
    core._web3_set_wallet_address_key(kkey);
		if(!rebootstrap) core._web3 = new Web3(new Web3.providers.HttpProvider(core._web3_provider));
  }

  _web3_set_provider(provider){ this._web3_provider = provider; }
  _web3_count_wallet(){ return this._wallets.length; }
	_web3_set_wallet_address(wallet_address){ this._wallet_address = wallet_address; }
	_web3_set_wallet_address_key(wallet_address_key){ this._wallet_address_key = wallet_address_key; }
	_web3_set_contract_address(contract_address){ this._contract_address = contract_address; }
	_web3_set_etherscan_url(etherscan_address){ this._etherscan_url = etherscan_address; }
	_web3_set_etherscan_api(etherscan_api){ this._etherscan_api = etherscan_api; }
	_web3_generate_tx_serial(){ return Math.floor(Math.random() * (999999999 - 100000000 + 1)) + 100000000; }

  _web3_load_contract_abi(){
    var core = this;
    window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + "/www/contract-abi.json",
      function(fileEntry) {
        fileEntry.file(function(file) {
          var reader = new FileReader();
          reader.onloadend = function(e) {
            core._contract_abi = JSON.parse(this.result);
          }
          reader.readAsText(file);
        });
      },
      function(e) {
        core._contract_abi = -1;
      }
    );
  }

	_web3_create_pending_tx(amnt, hashid, type, from, to, gasUsed, gasPrice, conf){
		var core = this;

		var ts = Math.round((new Date()).getTime() / 1000);

		// Add TX record to tx_queue (app_conf) - this allows the app to track all pending tx
		if(core._app_config[0].tx_queue != null){
			if(core._app_config[0].tx_queue != 0){
				core._app_config[0].tx_queue.push({	"value": (amnt * 100000000),
																						"date": (new Date().toLocaleDateString("en-US")),
																						"timeStamp": ts,
																						"hash": hashid,
																						"data": 0,
																						"type": type,
																						"from": from,
																						"to": to,
																						"gasUsed": gasUsed,
																						"gasPrice": gasPrice,
																						"confirmations": conf,
																					 	"enabled": 0 });
			} else {
				core._app_config[0].tx_queue = [{	"value": (amnt * 100000000),
																						"date": (new Date().toLocaleDateString("en-US")),
																						"timeStamp": ts,
																						"hash": hashid,
																						"data": 0,
																						"data": 0,
																						"type": type,
																						"from": from,
																						"to": to,
																						"gasUsed": gasUsed,
																						"gasPrice": gasPrice,
																						"confirmations": conf,
																					 	"enabled": 0 }];
			}
		}

		core._ff_save_app_config();
	}

	// Not used for paying Lira Invoice, just normal transfer
  _web3_send_funds(to, amount, pass){
    var core = this;
		try{
	    var abiArray = core._contract_abi;
			var contractAddress = core._contract_address;
			let privateKey = ethereumjs.Buffer.Buffer(ethereumjs.Util.toBuffer("0x" + pass), 'hex');

	    var count = core._web3.eth.getTransactionCount(core._wallet_address);
	    var contract = core._web3.eth.contract(abiArray).at(contractAddress);

		 	let gasData = JSON.parse(core._app_ret_buffer._gas_estimated_cost);
	    let txParams = {
				data:     contract.transfer.getData(to, (amount * 100000000)),
	      nonce:    core._web3.toHex(count),
	      gasPrice: core._web3.toHex(((parseInt(gasData.average) / 10) * core._wallet_txs_gas_multiplier) * 1000000000), // Multiple of 1000000000 produces Gwei level value
	      gasLimit: core._web3.toHex(parseInt(gasData.average) * 10000),
	      value:    '0x0',
	      to:       contractAddress
	    }
	    let tx = new ethereumjs.Tx(txParams);
	        tx.sign(privateKey);
	    let serializedTx = tx.serialize().toString('hex');

			if(core._app_verbose) console.log(txParams);

	    core._web3.eth.sendRawTransaction('0x' + serializedTx, function(err, hash) {
	        if(!err){
	          core._transaction_current_hash = hash;

						// Add TX record to tx_queue (app_conf) - this allows the app to track all pending tx
						core._web3_create_pending_tx(amount, hash, -1, core._wallet_address, to, "...", (((parseInt(gasData.average) / 10) * core._wallet_txs_gas_multiplier) * 1000000000), 0);

	        } else {
						console.log("An error has occured while processing transaction: " + err);
			      core._ui_event_portals("send_funds_failed");
	        }
	    });

			// !important, gas cost must be nulled after the transaction
			// gas cost is checked for tx confirmation process
			core._app_ret_buffer._gas_estimated_cost = null;

		} catch(err){
			console.log("An error has occured while processing transaction: " + err);
			core._ui_event_portals("send_funds_failed");
			core._app_ret_buffer._gas_estimated_cost = null;
		}

  }

  _web3_send_funds_extra(to, amount, pass, sserial = -1){

		var core = this;
		try{
	    var abiArray = core._contract_abi;
	    var contractAddress = core._contract_address;
	    let privateKey = ethereumjs.Buffer.Buffer(ethereumjs.Util.toBuffer("0x" + pass), 'hex');

	    var count = core._web3.eth.getTransactionCount(core._wallet_address);
	    var contract = core._web3.eth.contract(abiArray).at(contractAddress);

			let gasData = JSON.parse(core._app_ret_buffer._gas_estimated_cost);
	    let txParams = {
				data:     contract.transferExtra.getData(to, (amount * 100000000), (sserial == -1 ? core._web3_generate_tx_serial() : sserial)),
	      nonce:    core._web3.toHex(count),
	      gasPrice: core._web3.toHex(((parseInt(gasData.average) / 10) * core._wallet_txs_gas_multiplier) * 1000000000), // Multiple of 1000000000 produces Gwei level value
	      gasLimit: core._web3.toHex(parseInt(gasData.average) * 10000),
	      value:    '0x0',
	      to:       contractAddress
	    }
	    let tx = new ethereumjs.Tx(txParams);
	        tx.sign(privateKey);

	    let serializedTx = tx.serialize().toString('hex');

			if(core._app_verbose) console.log(txParams);

	    core._web3.eth.sendRawTransaction('0x' + serializedTx, function(err, hash) {
	        if(!err){
	          core._transaction_current_hash = hash;

						// Add TX record to tx_queue (app_conf) - this allows the app to track all pending tx
						core._web3_create_pending_tx(amount, hash, -1, core._wallet_address, to, "...", (((parseInt(gasData.average) / 10) * core._wallet_txs_gas_multiplier) * 1000000000), 0);

					} else {
						console.log("An error has occured while processing transaction: " + err);
			      core._ui_event_portals("send_funds_failed");
	        }
	    });

			// !important, gas cost must be nulled after the transaction
			// gas cost is checked for tx confirmation process
			core._app_ret_buffer._gas_estimated_cost = null;
		} catch(err){
			console.log("An error has occured while processing transaction: " + err);
			core._ui_event_portals("send_funds_failed");
			core._app_ret_buffer._gas_estimated_cost = null;
		}
  }

  _web3_verify_transaction(txhash){
    var core = this;
		var txReceipt = core._web3.eth.getTransactionReceipt(txhash);

		console.log("Attemping to verify transaction: " + txhash + "...");
		console.log(txReceipt);

    // if(confirms > 0 && confirms < 10){
		if(txReceipt != null){
	    if(txReceipt.status.indexOf("0x1") !== -1){
	      core._ui_event_portals("send_funds_success");
	      return true;
	    } else if(txReceipt.status.indexOf("0x0") !== -1){
	      core._ui_event_portals("send_funds_failed");
	      return true;
	    }
		}
  }

  _web3_get_transactions_list(page = 1){
    var core = this;
		core._rest("GET", core._etherscan_url, [	['module', 'account'],
																							['action', 'tokentx'],
																							['page', page],
																							['offset', core._wallet_txs_pagination_count],
																							['sort', 'desc'],
																							['contractaddress', core._contract_address],
																							['address', core._wallet_address],
																							['apiKey', core._etherscan_api]
																						], core._app_ret_buffer, "_txs_temp");
  }

  _web3_encrypt_data(d, pass){

    // Add padding to key
    if(pass.length < 16){
      var newPass = "0000000000000000" + pass;
      var checkLen = 16 - pass.length;
      pass = newPass.substr(16 - checkLen);
    }

    // Accepted length for key are 16, and 32
    var _aesKey =           aesjs.utils.utf8.toBytes(pass);
    var _textBytes =        aesjs.utils.utf8.toBytes(d);
    var _aesCtr =           new aesjs.ModeOfOperation.ctr(_aesKey, new aesjs.Counter(5));
    var _encryptedBytes =    _aesCtr.encrypt(_textBytes);
    var _encryptedHex =     aesjs.utils.hex.fromBytes(_encryptedBytes);

    return _encryptedHex;

  }

  _web3_decrypt_data(d, pass){

    // Add padding to key
    if(pass.length < 16){
      var newPass = "0000000000000000" + pass;
      var checkLen = 16 - pass.length;
      pass = newPass.substr(16 - checkLen);
    }

    // Accepted length for key are 16, and 32
    var _aesKey =           aesjs.utils.utf8.toBytes(pass);
    var _textBytes =        aesjs.utils.hex.toBytes(d);
    var _aesCtr =           new aesjs.ModeOfOperation.ctr(_aesKey, new aesjs.Counter(5));
    var _decryptedBytes =   _aesCtr.decrypt(_textBytes);
    var _decryptedText =    aesjs.utils.utf8.fromBytes(_decryptedBytes);
    return _decryptedText;

  }

  _web3_create_wallet_info(pass, insettings = false){

    var core = this;
		var errCreateSettings = false;

    // Generate address
    setTimeout(function(){

      let _ec =               new elliptic.ec('secp256k1');
      let _walletKeyPair =    _ec.genKeyPair();
      let _walletPrivKey =    _walletKeyPair.getPrivate("hex");
      let _walletPubKey =     _walletKeyPair.getPublic();
      let _walletAddress =    "0x" + keccak256(ethereumjs.Buffer.Buffer.concat([ethereumjs.Util.toBuffer(_walletPubKey.getX()), ethereumjs.Util.toBuffer(_walletPubKey.getY())])).substr(24);

			let _cipheredkey, _cipheredlabel;

      // Encrypt wallet information - create wallet from bootstrap
			if(!insettings){
	      _cipheredkey =      core._web3_encrypt_data(_walletPrivKey, pass);
	      _cipheredlabel =      core._web3_encrypt_data("encrypted", pass);

	      // Add wallet to the array
	      core._wallets = [{"address": _walletAddress, "ckey": _cipheredkey, "label": _cipheredlabel }];

				// Init Web3
        core._web3_init(core._wallets[0].address, core._wallets[0].ckey);
      } else {
				if(core._web3_confirm_password(core._wallets, pass)){
					_cipheredkey =      core._web3_encrypt_data(_walletPrivKey, pass);
		      _cipheredlabel =      core._web3_encrypt_data("encrypted", pass);
				}
				core._wallets[core._wallets.length] = {"address": _walletAddress, "ckey": _cipheredkey, "label": _cipheredlabel };
			}

      // Save address info
      core._ff_wallets_list_save();

      if(!insettings){
      	core._ui_event_portals("bootstrap_tos");
			} else {
	      core._ui_show_result( "settings_wallet_add_success",
	                            null,
	                            null,
	                            "settings_wallet_create");
			}

    }, 3000);

  }

  _web3_import_wallet(pkey, pass, insettings = false){

    var core = this;
    setTimeout(function(){
      let _ec =               new elliptic.ec('secp256k1');
      let _walletKeyPair =    _ec.keyFromPrivate(pkey);
      let _walletPrivKey =    _walletKeyPair.getPrivate("hex");
      let _walletPubKey =     _walletKeyPair.getPublic();
      let _walletAddress =    "0x" + keccak256(ethereumjs.Buffer.Buffer.concat([ethereumjs.Util.toBuffer(_walletPubKey.getX()), ethereumjs.Util.toBuffer(_walletPubKey.getY())])).substr(24);

      // Encrypt wallet information
      var _cipheredkey =      core._web3_encrypt_data(_walletPrivKey, pass);
      var _cipheredlabel =      core._web3_encrypt_data("encrypted", pass);

      // Add wallet to the array
      if(!insettings){
      	core._wallets = [{"address": _walletAddress, "ckey": _cipheredkey, "label": _cipheredlabel }];
        core._web3_init(core._wallets[0].address, core._wallets[0].ckey);
      } else {
				if(core._web3_confirm_password(core._wallets, pass)){
					_cipheredkey =      core._web3_encrypt_data(_walletPrivKey, pass);
		      _cipheredlabel =      core._web3_encrypt_data("encrypted", pass);
				}
				core._wallets[core._wallets.length] = {"address": _walletAddress, "ckey": _cipheredkey, "label": _cipheredlabel };
			}

      // Save address info
      core._ff_wallets_list_save();
			if(!insettings){
	      core._ui_show_result( "bootstrap_result_success",
	                            "succ_bootstrap_result",
	                            "Your wallet has been successfully created.",
	                            "bootstrap_tos");
			} else {
	      core._ui_show_result( "settings_wallet_add_success",
	                            null,
	                            null,
	                            "settings_wallet_import");
			}


    }, 3000);
  }

	_web3_remove_wallet(idd){
		var core = this;
		var message = "Are you sure you want to remove wallet: " + core._wallets[idd].address + "?";
		var title = "Confirm Delete";
		var buttonLabels = "Proceed, Cancel";
		navigator.notification.confirm(message, function(i) { if(i == 1){
																														if(core._wallets.length == 1){
																															alert("Error: cannot remove this wallet. There must be at least 1 wallet available.");
																														} else {
																															var rRemoved = core._wallets[idd].address;
																															var wrSuccess = core._wallets.splice(idd,1);
																															if(wrSuccess){

																																// if wallet is default, pick another wallet before removing current default wallet
																																if(core._app_config[0].default_address == idd){
																																		core._wallet_address_id = 0;
																																		core._app_config[0].default_address = 0;
																																		alert("NOTE: Your default wallet has changed!");
																																}

																																core._ff_wallets_list_save();
																																core._ff_save_app_config();

																																// Create list of all wallets
																																var tmpWalletsList = "";
																																for(var iii = 0; iii < core._wallets.length; iii++){
																																	var walletData = [["wallet_address", core._wallets[iii].address], ["wid", iii], ["def", (iii == core._app_config[0].default_address ? "checked" : "")]];
																																	var txRecordTemplate = core._template_parse_array("widgets/wallet_info.widget", walletData);
																																	tmpWalletsList = tmpWalletsList + txRecordTemplate;
																																}

																																document.getElementById("wallet_list_container").innerHTML = tmpWalletsList;
																																alert("Wallet: " + rRemoved + " has been removed.");

																															}
																														}
																													}
																												}, title, buttonLabels);
	}

  _web3_get_wallet_info(){
    var core = this;
    return core._wallets[core._wallet_address_id];
  }

  _web3_get_wallet_balance_ether(){
    var core = this;
		console.log("Retrieving wallet details... " + core._wallet_address);
    var balance = core._web3.eth.getBalance(core._wallet_address);
    var tmpBalEther = core._web3.fromWei(balance, "ether");
		var tmpBal = document.getElementById("ether_balance");
 		if(tmpBal != null){
			core._wallet_balance_ether = ((parseInt(document.getElementById("ether_balance").innerText) > 10 || parseInt(document.getElementById("ether_balance").innerText) <= 0) ? tmpBalEther.toFixed(2) : tmpBalEther.toFixed(8));
			tmpBal.innerText = core._wallet_balance_ether + " ETH";
			core._wallet_balance_ether_actual = tmpBalEther;
		}
		core._wallet_balance_ether_loaded = true;
	}

  _web3_get_wallet_balance(){

    var core = this;
    var tknAddress = core._wallet_address.substring(2);
    var contractData = ('0x70a08231000000000000000000000000' + tknAddress);

    core._web3.eth.call({
      to: core._web3.toHex(core._contract_address),
      data: contractData
    }, function(err, result) {
      if (result != "0x" && result.length > 0) {
        var totalTokens = (core._web3.toBigNumber(result, 'ether') / 100000000);
				var tmpBal = document.getElementById("balance");
				var tmpActualBal = document.getElementById("actualBalance");

				let totalTokensTmp = ((totalTokens || totalTokens <= 0) > 1 ? totalTokens.toFixed(2) : totalTokens.toFixed(8));

    		if(tmpBal != null) document.getElementById("balance").innerText =	parseFloat(totalTokensTmp).toLocaleString('en');
        if(tmpActualBal != null)document.getElementById("actualBalance").innerText = totalTokens;

				core._wallet_balance_lira_actual = totalTokens;
        core._wallet_balance_lira =    	totalTokens;
        core._wallet_balance_trimmed = 	parseFloat(totalTokensTmp).toLocaleString('en');
				core._wallet_balance_lira_loaded = true;

    	} else {
				var tmpBal = document.getElementById("balance");
        if(tmpBal != null) document.getElementById("balance").innerText = 0.0;
				core._wallet_balance_lira_loaded = true;
      }

    });
  }

  _web3_confirm_password(jsn, pass){
    var core = this;
    var _decipheredtext = core._web3_decrypt_data(jsn[0].label, pass);
    if(_decipheredtext.indexOf("encrypted") !== -1) return 1;
    return 0;
  }

  _ff_wallets_list(){
    var core = this;
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
      fs.root.getFile("wallets.json", { create: true, exclusive: false },
      function (fileEntry) {
        fileEntry.file(function(file) {
          var reader = new FileReader();
          reader.onloadend = function(e) {

            // Read the contents of wallets.json
            var r = this.result;

            // If wallets.json is configured (done after first run) set the wallet variables of the app
            if(r.indexOf("empty") !== -1 || r.length <= 0){
              core._wallets_empty = true;
            } else {
              core._wallets = JSON.parse(r);
            }
          }
          reader.readAsText(file);
        });
      },
      function(e) {
        core._wallets = -1;
      });
    });
  }

  _ff_wallets_list_save(){
    var core = this;
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
      fs.root.getFile("wallets.json", { create: true, exclusive: false }, function (fileEntry) {
        fileEntry.createWriter(function (fileWriter) {
          fileWriter.onwriteend = function() {
            console.log("Successful file write...");
          };
          fileWriter.onerror = function (e) {
            console.log("Failed file write: " + e.toString());
          };
          var dataObj = new Blob([JSON.stringify(core._wallets)], { type: 'text/plain' });
          fileWriter.write(dataObj);
        });
      }, null);
    }, null);
  }

  _ff_save_app_config(){
    var core = this;
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
      fs.root.getFile("lira.json", { create: true, exclusive: false }, function (fileEntry) {
        fileEntry.createWriter(function (fileWriter) {
          fileWriter.onwriteend = function() {
            console.log("Successful file write...");
          };
          fileWriter.onerror = function (e) {
            console.log("Failed file write: " + e.toString());
          };
          var dataObj = new Blob([JSON.stringify(core._app_config)], { type: 'text/plain' });
          fileWriter.write(dataObj);
        });
      }, null);
    }, null);
  }

  _ff_load_app_config(){

    var core = this;
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
      fs.root.getFile("lira.json", { create: true, exclusive: false },
      function (fileEntry) {
        fileEntry.file(function(file) {
          var reader = new FileReader();
          reader.onloadend = function(e) {
            var r = this.result;
            if(r.length <= 0){
              core._app_config_empty = true;
            } else {
              core._app_config = JSON.parse(r);

							// Make sure all pending tx are disabled so they are re-added to the tx list in the app
							if(	core._app_config[0].tx_queue != null &&
									core._app_config[0].tx_queue != 0){
								for(var i = 0; i < core._app_config[0].tx_queue.length; i++){
									core._app_config[0].tx_queue[i].enabled = 0;
								}
							}

							// Select the default network
							var tmpNetworkData = 									(core._app_config[0].network == 0 ? core.networks_list[0] : core.networks_list[1] );
							core._contract_address =      				tmpNetworkData._contract_address;
							core._etherscan_url =         				tmpNetworkData._etherscan_url;
							core._etherscan_api =         				tmpNetworkData._etherscan_api_key;
							core._web3_provider =         				tmpNetworkData._web3_provider;

            }
          }
          reader.readAsText(file);
        });
      },
      function(e) {
        core._wallets = -1;
      });
    });
  }

  _ui_page_change(p, parrs = null, pcallback = null, pcallbackpre = false){

		var core = this;
		if(core._app_verbose) console.log("Changing page: " + p + " ...");
		if(pcallback != null && pcallbackpre == true) pcallback();
		core._template_display(core._template_output(p, true), document.getElementById("app_content"), parrs);
		core._ui_reload_event_hooks();
		if(pcallback != null && pcallbackpre == false) pcallback();


		document.getElementById("popups_list").style.display = "none";

		core._app_current_page = p;
		// When the page is changed, there is no point checking the transaction status of current transaction
		clearInterval(core._transaction_confirmation_interval);

  }

  _ui_show_result(errpage, errlement, errtxt, errpagereturn = null, errcallback = null){
		var core = this;
    core._ui_event_portals(errpage);
    core._page_result_return = errpagereturn;

		if(errlement != null){
			var _tmpErrlement = document.getElementById(errlement);
			if(_tmpErrlement != null){ _tmpErrlement.innerHTML = errtxt; }
		}

		if(errcallback != null) errcallback();
		if(errpagereturn == null) document.getElementById("return_nav").style.display = "none";
  }

  _ui_show_result_return(){
		var core = this;
    core._ui_event_portals(core._page_result_return);
  }

  _ui_password_validation_process(){
    var core = this;
    if(core._web3_confirm_password(core._wallets, document.getElementById("bootstrap_entrance_password").value)){
      var tmpBootToDashboard = setInterval(function(){
				if(	core._wallet_balance_lira_loaded == true &&
						core._wallet_balance_ether_loaded == true){
						core._ui_event_portals("dashboard");
					clearInterval(tmpBootToDashboard);
				}
      }, 1000);
    } else {
      var tmpBootToDashboard = setTimeout(function(){
        core._ui_show_result("bootstrap_result_error", "err_bootstrap_result", "Your pin is invalid.<br>Please try again.", "bootstrap_entrance");
      }, 2000);
    }

  }

  _ui_accept_tos(){
    var core = this;
        core._app_config = [{"default_address": 0, "network": 0, "terms_of_service": 1, "tx_queue" : 0 }];
        core._ff_save_app_config();
  }

	_ui_update_transactions_load_more(){
    var core = this;
		if(!core._swipe_load_more_locked){
			setTimeout(function(){
				core._ui_update_transactions_list(core._wallet_txs_pagination_last+1);
				document.getElementById("loading_transaction_progress").style.display = "none";
				document.getElementById("loading_transaction").style.display = "block";
				core._swipe_load_more_locked = false;
				core._swipe_loader_top = 0;
			}, 1000);

			core._swipe_load_more_locked = true;
		}
	}

  _ui_update_transactions_list(_page = 1, _latestonly = false){
    var core = this;
		if(core._app_current_page == "dashboard" || core._app_current_page == "history"){

			setTimeout(function(){

				// Lock the method so it can't be called more than once
				core._wallet_txs_load_lock = true;

				// Fetch the latest tx from etherscan
	      core._web3_get_transactions_list(_page);

				var tmpLatestOnlyTxHeaders = [];
				var tmpLatestOnlyTx = [];
				var tmpRecentTransact = document.getElementById("recent_transactions");
				var tmpTransactHistory =  document.getElementById("payment_history");
		    if((tmpRecentTransact != null || tmpTransactHistory != null) && core._app_ret_buffer._txs_temp != null){
					var tmpTransactions = JSON.parse(core._app_ret_buffer._txs_temp);
					var tmpLatestOnlyTxHeaders = tmpTransactions;
					var i = -1;

					// Query past live tx list from the blockchain
			    while(i < Object.keys(tmpTransactions.result).length-1){
						i++;
						var txTime = new Date(parseInt(tmpTransactions.result[i].timeStamp)*1000).toLocaleDateString("en-US");
						var txType = (tmpTransactions.result[i].from != core._wallet_address ? "<i class='fas fa-arrow-alt-circle-down tx_list_icon'></i> Received" : "<i class='fas fa-arrow-alt-circle-up tx_list_icon'></i> Sent" );
						var txHash = tmpTransactions.result[i].hash;
						var txPayer = tmpTransactions.result[i].from;
						var txReceipient = tmpTransactions.result[i].to;
						var txGasUsed = tmpTransactions.result[i].gasUsed;
						var txGasPrice = tmpTransactions.result[i].gasPrice;
						var txConfirmations = tmpTransactions.result[i].confirmations;
						var txValue = (parseFloat(tmpTransactions.result[i].value)  / 100000000).toFixed(8);

						var txPacket = [[	"type", 					txType ],
														[	"value", 					txValue ],
														[	"date", 					txTime ],
														[	"hash", 					txHash ],
														[ "time", 					txTime ],
														[ "gas", 						txGasPrice ],
														[ "gasused", 				txGasUsed ],
														[ "confirmations", 	txConfirmations ],
														[ "to", 						txReceipient ],
														[ "from", 					txPayer ]];

						// Load new tx only
						if(_latestonly == true){

							// If there are no new tx, break
							if(core._app_ret_buffer._txs != null){
								var ii = -1;
								var txFound = false;

								// Check if the tx already exist in the list
						    while(ii < Object.keys(core._app_ret_buffer._txs.result).length-1 && !txFound){
									ii++;
									if(txHash == core._app_ret_buffer._txs.result[ii].hash){
										txFound = true;
									}
								}

								// If not, add to the list
								if(!txFound){
									var txRecordTemplate = core._template_parse_array("widgets/transactions.widget", txPacket);

									var tmpRecentTransact = document.getElementById("recent_transactions");
									if(tmpRecentTransact != null){
										var txRecord = document.getElementById("recent_transactions").innerHTML;
										document.getElementById("recent_transactions").innerHTML = txRecordTemplate + txRecord;
										core._wallet_txs = txRecordTemplate + txRecord;
										core._wallet_txs_loaded = true;
									}

									var tmpPayHistory = document.getElementById("payment_history");
									if(tmpPayHistory != null){
										var txRecord = document.getElementById("payment_history").innerHTML;
										document.getElementById("payment_history").innerHTML = txRecordTemplate + txRecord;
										core._wallet_txs = txRecordTemplate + txRecord;
									}

									tmpLatestOnlyTx.push(tmpTransactions.result[i]);
									core._wallet_txs_result_count++;

									// Force break the loop
									i = Object.keys(tmpTransactions.result).length;
								}

							}

						// Load all tx - used mainly on boot
						} else {

							// Create template for new tx
					    var txRecordTemplate = core._template_parse_array("widgets/transactions.widget", txPacket);
							var tmpRecentTransact = document.getElementById("recent_transactions");
					    if(tmpRecentTransact != null){
					      var txRecord = document.getElementById("recent_transactions").innerHTML;
								document.getElementById("recent_transactions").innerHTML = txRecord + txRecordTemplate;
								core._wallet_txs = txRecord + txRecordTemplate;
								core._wallet_txs_loaded = true;
							}

							var tmpPayHistory = document.getElementById("payment_history");
							if(tmpPayHistory != null){
								var txRecord = document.getElementById("payment_history").innerHTML;
								document.getElementById("payment_history").innerHTML = txRecord + txRecordTemplate;
								core._wallet_txs = txRecord + txRecordTemplate;
							}

							core._wallet_txs_result_count++;

						}
			    }

					// Query the pending tx list and add it on top of the existing tx list
					if(core._app_config[0].tx_queue != null){
						if(core._app_config[0].tx_queue != 0){

							// Splice the redundant pending tx (succeeded)
							i = -1;
							var tmpTxSpliced = false;

							while(i < Object.keys(core._app_config[0].tx_queue).length-1){
								i++;

								// Check TX Status - remove if confirmations > 0
								var txReceipt = core._web3.eth.getTransactionReceipt(core._app_config[0].tx_queue[i].hash);

								// if(confirms > 0 && confirms < 10){
								if(txReceipt != null){
									if(txReceipt.status.indexOf("0x1") !== -1){
										core._app_config[0].tx_queue.splice(i,1);
										tmpTxSpliced = true;
									}
								}
							}

							if(tmpTxSpliced){

								// Remove all pending html item on the list and replace with a new list
								// make sure to append it on top of the list
								var tmpTxPendingItems = document.getElementsByClassName("hash_pending");
								for(var ii = 0; ii < tmpTxPendingItems.length; ii++){
									tmpTxPendingItems[ii].remove();
								}
							}

							// Create templates for remaining pending tx
							i = -1;
							core._tx_pending_buffer = "";
							while(i < Object.keys(core._app_config[0].tx_queue).length-1){
								i++;

								var txPacket = [[	"type", 					"<i class='fas fa-ellipsis-h tx_list_icon'></i>  Processing"],
																[	"value", 				  (parseFloat(core._app_config[0].tx_queue[i].value)  / 100000000).toFixed(8) ],
																[ "hash" , 					core._app_config[0].tx_queue[i].hash ],
																[	"date", 					core._app_config[0].tx_queue[i].date ]];

								var txRecordTemplate = core._template_parse_array("widgets/transactions_pending.widget", txPacket);
								core._tx_pending_buffer = txRecordTemplate + core._tx_pending_buffer;
							}

							// Remove all pending html item on the list and replace with a new list
							// make sure to append it on top of the list
							var tmpTxPendingItems = document.getElementsByClassName("hash_pending");
							for(var ii = 0; ii < tmpTxPendingItems.length; ii++){
								tmpTxPendingItems[ii].remove();
							}

							if(core._tx_pending_buffer.length > 0){

								var tmpRecentTransact = document.getElementById("recent_transactions");
								if(tmpRecentTransact != null){
									var txRecord = document.getElementById("recent_transactions").innerHTML;
									document.getElementById("recent_transactions").innerHTML = core._tx_pending_buffer + txRecord;
								}

								var tmpPayHistory = document.getElementById("payment_history");
								if(tmpPayHistory != null){
									var txRecord = document.getElementById("payment_history").innerHTML;
									document.getElementById("payment_history").innerHTML = core._tx_pending_buffer + txRecord;
								}

							}

							// Save changes to the config to save the state of tx_queue array
							core._ff_save_app_config();
						}
					}

					if(_latestonly == true){

						// There are no transactions available, show the sign "no data to display"
						if(tmpLatestOnlyTx.length >= 0){
							if(core._app_ret_buffer._txs != null){
								for(var iii = 0; iii < tmpLatestOnlyTx.length; iii++){
									core._app_ret_buffer._txs.result.push(tmpLatestOnlyTx[iii]);
								}
							} else {
								core._app_ret_buffer._txs = tmpTransactions;
							}
							core._wallet_txs_pagination_last++;
						}

					} else {

						// There are no transactions available, show the sign
						if(Object.keys(tmpTransactions.result).length >= 0){
							if(core._app_ret_buffer._txs != null){
								core._app_ret_buffer._txs.result.concat(tmpTransactions.result);
							} else {
								core._app_ret_buffer._txs = tmpTransactions;
							}
							core._wallet_txs_pagination_last++;
						}
					}
				}

				// Enable the "Load More" button if there are enough items on the tx list
				// Check if there are items in the transaction history, otherwise display the "no data" element
				if(	core._wallet_txs_result_count > 0){

					if(document.getElementById("empty_notice_footer") != null &&
					document.getElementById("nodata_transaction_history") != null){
						if(core._wallet_txs_result_count >= core._wallet_txs_pagination_count || core._wallet_txs_result_count > 0){
							if(core._wallet_txs_result_count >= core._wallet_txs_pagination_count){
								document.getElementById("empty_notice_footer").style.display = "block";
								document.getElementById("nodata_transaction_history").style.display = "none";
							} else {
								document.getElementById("empty_notice_footer").style.display = "none";
								document.getElementById("nodata_transaction_history").style.display = "none";
							}
						} else {
							if(core._wallet_txs_result_count <= 0){
								document.getElementById("empty_notice_footer").style.display = "none";
								document.getElementById("nodata_transaction_history").style.display = "block";
							}
						}
					}
				} else {
					if(document.getElementById("empty_notice_footer") != null &&
					document.getElementById("nodata_transaction_history") != null){
						document.getElementById("empty_notice_footer").style.display = "none";
						document.getElementById("nodata_transaction_history").style.display = "block";
					}
				}

				// Unlock the method
				if(document.getElementById("fetching_new_transaction_progress") != null) document.getElementById("fetching_new_transaction_progress").style.display = "none";
				core._app_ret_buffer._txs_temp = null;
				core._wallet_txs_load_lock = false;

			}, 1000);
		}
  }

	_ui_reset_tx_list(){
		var core = this;
		core._wallet_txs_boot_load = false;
		core._wallet_txs = null;
		core._app_ret_buffer._txs_temp = null;
		core._app_ret_buffer._txs = null;
		core._wallet_txs_result_count = 0;
		core._wallet_txs_pagination_last = 1;
	}

  _ui_qrscan(errfunc = null){
    var core = this;
    var _tmpQrscan = cordova.plugins.barcodeScanner.scan(	function (result) {
																										        core._app_qrscan_previous_result = core._app_qrscan_result;
																										        core._app_qrscan_result = result.text;
																										      }, null,
																										      {
																										          preferFrontCamera : false, // iOS and Android
																										          showFlipCameraButton : false, // iOS and Android
																										          showTorchButton : false, // iOS and Android
																										          torchOn: false, // Android, launch with the torch switched on (if available)
																										          saveHistory: false, // Android, save scan history (default false)
																										          prompt : "", // Android
																										          resultDisplayDuration: 0, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
																										          formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
																										          orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
																										          disableAnimations : true, // iOS
																										          disableSuccessBeep: false // iOS and Android
																										      });
  }

  _ui_qrscan_invoice(){
    var core = this;
        core._ui_qrscan(function(){
					alert("Error: an error has occured while processing that invoice. Please try again.");
					core._app_qrscan_result_error = true;
				});
		alert("Error: this feature is not yet available!");

		/*
    var scanInterval = setInterval(function(){
      if(core._app_qrscan_previous_result != core._app_qrscan_result || core._app_qrscan_result_error == true){
				if(core._app_qrscan_result_error == false){

	        var pk = JSON.parse(core._app_qrscan_result);
					var amnt = pk.invoice_amount;
					var addr = pk.invoice_address;
					var aserial = pk.invoice_serial;

					// Store the send amount and recipient address to buffer
					core._app_ret_buffer._send_funds_amount_invoice = amnt;
					core._app_ret_buffer._send_funds_address_invoice = addr;
					core._app_ret_buffer._send_funds_invoice_serial = aserial;
					core._app_ret_buffer._send_funds_is_invoice = true;
					core._app_ret_buffer._gas_estimated_cost = null;
					core._ui_event_portals("send_funds_confirmation");

					// Calculate gas cost
					setTimeout(function(){
						core._rest(	"GET",
												"https://ethgasstation.info/json/ethgasAPI.json",
												null,
												core._app_ret_buffer,
												"_gas_estimated_cost");
					}, 2000);

		      document.getElementById("send_funds_amount").innerText = amnt;
		      document.getElementById("send_funds_address").innerText = addr;

					core._gas_calculator_interval = setInterval(function(){
						var tmpGasContainerEl = document.getElementById("send_funds_gas");
						if(	tmpGasContainerEl != null &&
								core._app_ret_buffer._gas_estimated_cost != null){
							var tmpGasCost = JSON.parse(core._app_ret_buffer._gas_estimated_cost);
							if(tmpGasCost.average > 0){
								document.getElementById("send_funds_gas").innerHTML = tmpGasCost.average + " Gwei";
								clearInterval(core._gas_calculator_interval);
							}
						}
					}, 2000);

				}
				core._app_qrscan_result_error = false;
        clearInterval(scanInterval);
      }
    }, 10);*/
  }

  _ui_qrscan_invoice_generate(objid, addr, amnt){
		var tmpObjid = document.getElementById(objid);
		if(tmpObjid != null){
	    var core = this;
	    var qrgen = new QRCode(objid);
					qrgen.makeCode('{"invoice_address": "' + addr + '", "invoice_amount": ' + amnt + ', "invoice_serial": ' + core._web3_web3_generate_tx_serial() + '}');

			var tmpObjidChild = tmpObjid.children;
			for(var i = 0; i < tmpObjidChild.length; i++){
				tmpObjidChild[i].style.width = "100%";
				tmpObjidChild[i].style.height = "auto";
			}
		}
  }

  _ui_qrscan_code_generate(objid, txt){
		var tmpObjid = document.getElementById(objid);
		if(tmpObjid != null){
	    var qrgen = new QRCode(objid);
	        qrgen.makeCode(txt);

			var tmpObjidChild = tmpObjid.children;
			for(var i = 0; i < tmpObjidChild.length; i++){
				tmpObjidChild[i].style.width = "100%";
				tmpObjidChild[i].style.height = "auto";
			}
		}
  }

  _ui_qrscan_import_key(pass){
    var core = this;
        core._ui_qrscan();

	  var scanInterval = setInterval(function(){
	    if(core._app_qrscan_previous_result != core._app_qrscan_result){
	      var pk = core._app_qrscan_result;
	      document.getElementById("import_wallet_key_value").value = pk;
	      clearInterval(scanInterval);
	    }
	  }, 100);
  }

  _ui_qrscan_wallets(){
    var core = this;
        core._ui_qrscan();

    var scanInterval = setInterval(function(){
      if(core._app_qrscan_previous_result != core._app_qrscan_result){
        var pk = core._app_qrscan_result;
        document.getElementById("send_funds_address_input").value = pk;
        clearInterval(scanInterval);
      }
    }, 100);
  }

  _ui_share_wallet_address(){
    var core = this;
    var options = {
      message: core._wallet_address, // not supported on some apps (Facebook, Instagram)
      subject: 'My Lira Wallet', // fi. for email
    };

    window.plugins.socialsharing.shareWithOptions(options,
    function(result) {
      console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
      console.log("Shared to app: " + result.app); // On Android result.app since plugin version 5.4.0 this is no longer empty. On iOS it's empty when sharing is cancelled (result.completed=false)
    }, function(msg) {
      console.log("Sharing failed with message: " + msg);
    });
  }

  _ui_copy_wallet_address(obj_addr){
    cordova.plugins.clipboard.copy(obj_addr);
		alert("Wallet address copied to clibpoard.");
  }

  _ui_confirm_send_funds(){
    var core = this;
    var amnt = core._app_ret_buffer._send_funds_amount_invoice;
    var addr = core._app_ret_buffer._send_funds_address_invoice;
		let tmpGasData = JSON.parse(core._app_ret_buffer._gas_estimated_cost);

    if( core._wallet_balance_lira_actual >= amnt &&
        core._wallet_balance_ether_actual > 0.0 &&
        (core._wallet_balance_ether_actual * 1000000000) > tmpGasData.average &&
      	core._ui_validate_wallet_address(addr) &&
				core._app_ret_buffer._gas_estimated_cost != null){
      core._ui_event_portals("send_funds_authentication");
    } else if(core._app_ret_buffer._gas_estimated_cost == null){
			alert("Please wait until the gas cost has been estimated.");
		} else {
			if(!(parseFloat(core._wallet_balance_lira_actual) >= parseFloat(amnt))){
				alert("Cannot proceed with this request. Your LIRA balance is insufficient. Please try again.");
			}
			if(!(core._wallet_balance_ether_actual > 0.0) || !((core._wallet_balance_ether_actual * 1000000000) > tmpGasData.average)){
				alert("Cannot proceed with this request. Your Ether balance is insufficient. Please try again.");
			}
			if(!(core._ui_validate_wallet_address(addr))){
				alert("Cannot proceed with this request. The payee wallet address is invalid. Please try again.");
			}
		}
  }

  _ui_proceed_send_funds(amnt, addr){
    var core = this;

		document.getElementById("send_funds_amount_input_error").style.visibility = "hidden";
    document.getElementById("send_funds_address_input_error").style.visibility = "hidden";
    if(amnt <= 0 || addr == "" || !core._ui_validate_wallet_address(addr)){
      if(amnt <= 0){
        document.getElementById("send_funds_amount_input").style.borderColor = "red";
        document.getElementById("send_funds_amount_input_error").style.visibility = "visible";
      }
      if(addr == "" || !core._ui_validate_wallet_address(addr)){
        document.getElementById("send_funds_address_input").style.borderColor = "red";
        document.getElementById("send_funds_address_input_error").style.visibility = "visible";
      }
    } else {

			// Store the send amount and recipient address to buffer
			core._app_ret_buffer._send_funds_amount_invoice = amnt;
			core._app_ret_buffer._send_funds_address_invoice = addr;
			core._app_ret_buffer._gas_estimated_cost = null;

      core._ui_event_portals("send_funds_confirmation");

			// Calculate gas cost
			setTimeout(function(){
				core._rest(	"GET",
										"https://ethgasstation.info/json/ethgasAPI.json",
										null,
										core._app_ret_buffer,
										"_gas_estimated_cost");
			}, 2000);

      document.getElementById("send_funds_amount").innerText = amnt;
      document.getElementById("send_funds_address").innerText = addr;

			core._gas_calculator_interval = setInterval(function(){
				var tmpGasContainerEl = document.getElementById("send_funds_gas");
				if(	tmpGasContainerEl != null &&
						core._app_ret_buffer._gas_estimated_cost != null){
					var tmpGasCost = JSON.parse(core._app_ret_buffer._gas_estimated_cost);
					if(tmpGasCost.average > 0){
						document.getElementById("send_funds_gas").innerHTML = ((tmpGasCost.average / 10) * core._wallet_txs_gas_multiplier) + " Gwei";
						clearInterval(core._gas_calculator_interval);
					}
				}
			}, 2000);

    }
  }

	_ui_select_default_network(idd){
		var core = this;
		core._app_config = [{"default_address": core._app_config[0].default_address, "network": idd, "terms_of_service": 1, "tx_queue": core._app_config[0].tx_queue }];
		core._ff_save_app_config();

		alert("Notice: a new network has been selected. Please restart the application to take effect.");
	}

	_ui_select_default_wallet(idd){
		var core = this;
    core._app_config = [{"default_address": idd, "network": core._app_config[0].network, "terms_of_service": 1, "tx_queue": core._app_config[0].tx_queue }];
		core._ff_save_app_config();

		core._web3_set_wallet_address(core._wallets[core._app_config[0].default_address].address);

		// Rebootstrap process
		core._web3_init(core._wallets[core._app_config[0].default_address].address,
										core._wallets[core._app_config[0].default_address].ckey, true);

		core._web3_get_wallet_balance_ether();
		core._web3_get_wallet_balance();
		core._ui_reset_tx_list();

	}

  _ui_apply_wallet_address_html(idd){
    var core = this;
		document.getElementById("wallet_address_container").innerText = idd;
  }

  _ui_authenticate_send_funds(pass){
    var apass = pass;
    var core = this;
    var amnt = core._app_ret_buffer._send_funds_amount_invoice;
    var addr = core._app_ret_buffer._send_funds_address_invoice;
    var aserial = core._app_ret_buffer._send_funds_invoice_serial;

    var passdecrypted = core._web3_decrypt_data(core._wallet_address_key, apass);
    document.getElementById("send_funds_password_input_error").style.visibility = "hidden";

    if(core._web3_confirm_password(core._wallets, apass)){
      core._ui_event_portals("send_funds_process");
			if(core._app_ret_buffer._send_funds_is_invoice == true){
	      core._web3_send_funds_extra(addr, amnt, passdecrypted, aserial);
			} else {
	      core._web3_send_funds(addr, amnt, passdecrypted);
			}

      core._transaction_confirmation_interval = setInterval(function(){
        if(core._web3_verify_transaction(core._transaction_current_hash)){
					core._app_ret_buffer._send_funds_is_invoice = null;
					core._app_ret_buffer._send_funds_invoice_serial = null;
          clearInterval(core._transaction_confirmation_interval);
        }
      }, 1000);

    } else {
      document.getElementById("send_funds_password_input").style.borderColor = "red";
      document.getElementById("send_funds_password_input_error").style.visibility = "visible";
    }
  }

  _ui_show_popup(txt){
  }

  _ui_validate_wallet_address(address){
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) return false;
    return true;
  }

	_ui_visibility_toggle(objj){
		var x = objj;
		if (x.style.display === "none") {
		    x.style.display = "inline-block";
		} else {
		    x.style.display = "none";
		}
	}

	_ui_input_to_text_toggle(objj, objbutton, ccol){
		var x = objj;
		if (x.style.webkitTextSecurity === "none") {
		    x.style.webkitTextSecurity = "disc";
				objbutton.style.color = "rgba(" + ccol + ", 0.3)";
		} else {
		    x.style.webkitTextSecurity = "none";
				objbutton.style.color = "rgba(" + ccol + ", 1.0)";
		}
	}

	_ui_toggle_buttons(){
		var core = this;
		if(core._ui_buttons_toggled == false){
			var tmpInputs = document.getElementsByTagName('input');
			for(var i = 0; i < tmpInputs.length; i++){
				if(tmpInputs[i].type == "button"){
					tmpInputs[i].style.visibility = "hidden";
				}
			}

			var tmpAnchors = document.getElementsByClassName('navigation');
			for(var i = 0; i < tmpAnchors.length; i++){
				tmpAnchors[i].style.visibility = "hidden";
			}

			var tmpAppVerEl = document.getElementById("app_version_text");
			if(tmpAppVerEl != null){
				tmpAppVerEl.style.visibility = "hidden";
			}

			var tmpNavEl = document.getElementById("navigation_list");
			if(tmpNavEl != null){
				tmpNavEl.style.visibility = "hidden";
			}

			var tmpButtonContainerEl = document.getElementById("dual_button_container");
			if(tmpButtonContainerEl != null){
				tmpButtonContainerEl.style.visibility = "hidden";
			}

			core._ui_buttons_toggled = true;
		}
	}

	_ui_toggle_buttons_out(){
		var core = this;
		if(core._ui_buttons_toggled == true){
			var tmpInputs = document.getElementsByTagName('input');
			for(var i = 0; i < tmpInputs.length; i++){
				if(tmpInputs[i].type == "button"){
					tmpInputs[i].style.visibility = "visible";
				}
			}

			var tmpAnchors = document.getElementsByClassName('navigation');
			for(var i = 0; i < tmpAnchors.length; i++){
				tmpAnchors[i].style.visibility = "visible";
			}

			var tmpAppVerEl = document.getElementById("app_version_text");
			if(tmpAppVerEl != null){
				tmpAppVerEl.style.visibility = "visible";
			}

			var tmpNavEl = document.getElementById("navigation_list");
			if(tmpNavEl != null){
				tmpNavEl.style.visibility = "visible";
			}

			var tmpButtonContainerEl = document.getElementById("dual_button_container");
			if(tmpButtonContainerEl != null){
				tmpButtonContainerEl.style.visibility = "visible";
			}

			core._ui_buttons_toggled = false;
		}
	}

	_ui_retrieve_transaction(txhash, pending = false){
		var core = this;
		core._ui_event_portals("retrieve_transaction");
		var _tmpTxs = (pending == false ? core._app_ret_buffer._txs : core._app_config[0].tx_queue);

		setTimeout(function(){
			for(var i = 0; i < (pending == false ? _tmpTxs.result.length : core._app_config[0].tx_queue.length); i++){
				if((pending == false ? _tmpTxs.result[i].hash : _tmpTxs[i].hash) == txhash){
					core._ui_event_portals("retrieve_transaction_success", (pending == false ? _tmpTxs.result[i] : _tmpTxs[i]));
				}
			}
		}, 1000);
	}

	_ui_copy_tx_hash(txhash){
		cordova.plugins.clipboard.copy(txhash);
		alert("Transaction hash copied to clibpoard.");
	}

	_ui_swipe_detect_callback(_adir, _corel){
		var core = _corel;
		if(core._wallet_txs_load_lock == false){
			var updateLoadType = 0;
			var el = document.getElementById("payment_history");
			if(el != null){

				// Load the latest transactions
				if(_adir == "down"){
					//if(el.scrollTop === 0){
						document.getElementById("fetching_new_transaction").style.display = "block";
					//}
				}
			}

			var ell = document.getElementById("recent_transactions_container");
			if(ell != null){

				// Load the latest transaction
				if(_adir == "down"){
					document.getElementById("fetching_new_transaction").style.display = "block";
					updateLoadType = 2;
				// Load more transactions
				}
			}

		}
	}

	_ui_swipe_detect(el, callback){

		var core = this;
    var touchsurface = el,
    swipedir,
    startX,
    startY,
		dist,
    distX,
    distY,
    threshold = 50,
    restraint = 100,
    allowedTime = 1000,
    elapsedTime,
    startTime,
    handleswipe = callback || function(swipedir){};

    touchsurface.addEventListener('touchstart', function(e){

			// Touch calculations
      var touchobj = e.changedTouches[0];
      swipedir = 'none';
      dist = 0;
      startX = touchobj.pageX;
      startY = touchobj.pageY;
      startTime = new Date().getTime();

			// Fix to ensure touch callback is not called more than once
			if(!core._swipe_lock){

				// Prevent activating the loader after scrolling down
				// the user must untouch before it can activate the loader
				var _txContEl, _txContElScroll;
				if(document.getElementById("recent_transactions_container") != null){
					core._swipe_loader_top_orig = document.getElementById("recent_transactions_container").scrollTop;
				} else if(document.getElementById("payment_history_container") != null){
					core._swipe_loader_top_orig = document.getElementById("payment_history_container").scrollTop;
				}

				core._swipe_lock = true;
			}

    }, false);

		touchsurface.addEventListener('touchmove', function(e){

			// Animation loader methods to make it slide from the top when the tx container is swiped up or down
			var _infiLoaderEl = document.getElementById("recent_transactions");
			var _infiLoaderElX = document.getElementById("payment_history");
			if(_infiLoaderEl != null || _infiLoaderElX != null){

				var _txContEl, _txContElScroll;
				if(document.getElementById("recent_transactions_container") != null){
					_txContEl = document.getElementById("fetching_new_transaction");
					_txContElScroll = document.getElementById("recent_transactions_container");
				} else if(document.getElementById("payment_history_container") != null){
					_txContEl = document.getElementById("fetching_new_transaction");
					_txContElScroll = document.getElementById("payment_history_container");
				}

				var touchobjnew = e.changedTouches[0];
				var distX = touchobjnew.pageX - startX;
				var distY = touchobjnew.pageY - startY;

				elapsedTime = new Date().getTime() - startTime;
				if (elapsedTime <= allowedTime){
					if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){
						swipedir = (distX < 0)? 'left' : 'right';
					} else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){
						swipedir = (distY < 0) ? 'up' : 'down';
					}
				}

				if(_txContElScroll.scrollTop <= 0 && swipedir == "down" && core._swipe_loader_top_orig == 0){
					var _boxHeight = window.innerHeight;
					core._swipe_loader_top = (distY / (_boxHeight / 100)) * 2.5;
					_txContEl.style.marginTop = core._swipe_loader_top + "px";
					_txContEl.style.opacity = ((1.0 / 100) * core._swipe_loader_top);
				}
			}
		}, false);

    touchsurface.addEventListener('touchend', function(e){

			// Untouch calculations
      var touchobj = e.changedTouches[0];
      distX = touchobj.pageX - startX;
      distY = touchobj.pageY - startY;
      elapsedTime = new Date().getTime() - startTime;
      if (elapsedTime <= allowedTime){
        if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){
          swipedir = (distX < 0)? 'left' : 'right';
        } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){
          swipedir = (distY < 0) ? 'up' : 'down';
        }
      }

			// Fix to ensure touch callback is not called more than once
			if(core._swipe_lock){

				// When the user pulls the scroll over the minimum, place the
				// animated loader to the minimum top margin and let it spin
				// until the new tx list is loaded properly
				var _infLoaderInt = setInterval(function(){
					var _infiLoaderEl = document.getElementById("recent_transactions");
					var _infiLoaderElHistory = document.getElementById("payment_history");
					if(_infiLoaderEl != null || _infiLoaderElHistory != null){

						var _txContEl;
						if(document.getElementById("fetching_new_transaction") != null){
							_txContEl = document.getElementById("fetching_new_transaction");
						}

						// Before executing swipe method, make sure that the container is swiped properly
						// if loader passes over a threshold, load automatically
						if(core._swipe_loader_top > core._swipe_loader_min_dist && swipedir == "down"){
						 	handleswipe(swipedir);
							document.getElementById("fetching_new_transaction_progress").style.display = "block";
						}

						if(core._swipe_loader_top > 0){
							core._swipe_loader_top -= 10;
							if(core._swipe_loader_top <= 0){

								// Give the loader sometime to make sure the container is properly reset to its
								// original position before loading new items
								setTimeout(function(){
									core._ui_update_transactions_list(1, true);
								}, 500);

								core._swipe_loader_top = 0;
								clearInterval(_infLoaderInt);

							}

							_txContEl.style.marginTop = core._swipe_loader_top + "px";
							_txContEl.style.opacity = ((1.0 / 100) * core._swipe_loader_top);

						}

					} else {
						core._swipe_loader_top = 0;
						clearInterval(_infLoaderInt);
					}

				}, 1);

				core._swipe_loader_top_orig = -1;
				core._swipe_lock = false;
			}

    }, false);
	}

	_ui_scroll_callback(e, _shadowtop, _shadowbottom){
		if(e.scrollTop <= 3){
			_shadowtop.style.display = "none";
		} else {
			_shadowtop.style.display = "block";
		}

		if(e.scrollTop >= ((e.scrollHeight - e.offsetHeight) - 3)){
			_shadowbottom.style.display = "none";
		} else {
			_shadowbottom.style.display = "block";
		}
	}

};
