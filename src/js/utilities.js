(function(win) {
	'use strict';
	/**
	 * @namespace
	 * @author Jason Zhang <v-zhlong@microsoft.com>
	 */
	AX.Util = AX.Util || {};
	/**
	 * Throttle function calls
	 * @param {Function} fFunction 
	 * @param {Number} nThreshhold 
	 * @example
	 * //Throttle function calls
	 * AX.Util.throttle(fFunction,nThreshhold); 
	 * @returns {undefined}
	 */

	AX.Util.throttle = function(fFunction, nThreshhold, oScope) {
		nThreshhold || (nThreshhold = 250);
		var nLast,
			oDeferTimer;
		return function() {
			var oContext,
				nNow,
				oArgs;
			oContext = oScope || this;
			nNow = +new Date();
			oArgs = arguments;
			if (nLast && (nNow < nLast + nThreshhold)) {
				clearTimeout(oDeferTimer);
				oDeferTimer = setTimeout(function() {
					nLast = nNow;
					fFunction.apply(oScope, oArgs);
				}, nThreshhold);
			} else {
				nLast = nNow;
				fFunction.apply(oScope, oArgs);
			}

		}
	}

	//Validation
	AX.Util.isElementExist = function(oDomElement) {
			return typeof(oDomElement) === "object" && oDomElement !== null;
		}
	
	/**
	 * @description Get upload file size.
	 * @param {Object}  oInput - HTML DOM input fileupload element object
	 * @returns {Number} File size(byte unite)
	 */
	AX.Util.getFileSize = function(oInputElement) {
		if (oInputElement) {
			//log(oInputElement);
			if ("files" in oInputElement) {
				if (oInputElement.files === null || oInputElement.files.length === 0) {
					return 0;
				} else {
					var oFiles = oInputElement.files;
					var nLength = oFiles.length;
					var nTotalSize = 0;
					for (var i = 0; i < nLength; i++) {
						nTotalSize += oFiles[i].size;
					}
					return nTotalSize;
					//log('Files total size:' + nTotalSize);
				}
			}
		}
	}

	

	

	//Time and Date
	AX.Util.time = AX.Util.time || {};
	AX.Util.time.now = function() {
		var oTime = new Date();
		var sResult = "";
		var sDateSeparateSymbol = "-";
		var sTimeSeparateSymbol = ":";
		var fFormateTime = function(nTimeNumber) {
			return nTimeNumber < 10 ? ("0" + nTimeNumber) : nTimeNumber;
		}
		var nYear = oTime.getFullYear();
		var nMonth = oTime.getMonth() + 1;
		var nDay = oTime.getDate();
		var nHour = oTime.getHours();
		var nMinutes = oTime.getMinutes();
		var nSeconds = oTime.getSeconds();
		nHour = fFormateTime(nHour);
		nMinutes = fFormateTime(nMinutes);
		nSeconds = fFormateTime(nSeconds);
		sResult = nYear + sDateSeparateSymbol + nMonth + sDateSeparateSymbol + nDay + " " + nHour + sTimeSeparateSymbol + nMinutes + sTimeSeparateSymbol + nSeconds;
		return sResult;
	}

})(window);

(function(AX) {
	AX.Util.Template = (function() {
		var cache = {};
		var tmpl = function(str, data) {
			// Figure out if we're getting a template, or if we need to
			// load the template - and be sure to cache the result.
			var fn = !/\W/.test(str) ?
				cache[str] = cache[str] ||
				tmpl(document.getElementById(str).innerHTML) :

				// Generate a reusable function that will serve as a template
				// generator (and which will be cached).
				new Function("obj",
					"var p=[],print=function(){p.push.apply(p,arguments);};" +

					// Introduce the data as local variables using with(){}
					"with(obj){p.push('" +

					// Convert the template into pure JavaScript
					str
					.replace(/[\r\t\n]/g, " ")
					.split("<%").join("\t")
					.replace(/((^|%>)[^\t]*)'/g, "$1\r")
					.replace(/\t=(.*?)%>/g, "',$1,'")
					.split("\t").join("');")
					.split("%>").join("p.push('")
					.split("\r").join("\\'") + "');}return p.join('');");

			// Provide some basic currying to the user
			return data ? fn(data) : fn;
		};
		return tmpl;
	})();
})(AX);

(function(AX, win) {

	/**
	 * Debug Tools 
	 * @param {String} [sTitle] Print debug title
	 * @param {String|Object} sMsg Print debug information
	 * @example
	 * //Output a debug information.
	 * AX.Util.log(sMsg);  
	 * 
	 * //Output a debug information with title.
	 * AX.Util.log(sTitle,sMsg); 
	 * @returns {undefined}
	 */
	AX.Util.log = function(sTitle, sMsg) {
		if (win.console) {
			if (!arguments.length) {
				console.log(AX.VERSION);
				return;
			}
			var sMsg;
			var sTitle;
			if (arguments.length == 1) {
				sMsg = arguments[0];
				sTitle = "";
			}else {
				sTitle = "[" + arguments[0] + "]";
				sMsg = arguments[1];
			}
			var oConfig = {
				timestampStyle: "color: #09a1d3",
				titleStyle: "color: #e66102",
				msgStyle: "color: #3e4c59"
			}
			var sTimestamp = AX.Util.time.now();
			var sLogInfo;
			if (typeof sMsg == "object") {
				var sLogInfoTimeStamp;
				sLogInfoTimeStamp = "%c[" + sTimestamp + "]%c";
				console.log(sLogInfoTimeStamp + sTitle + "\u2193", oConfig.timestampStyle, oConfig.titleStyle);
				console.dir(sMsg);
				return;
			}
			sLogInfo = "%c[" + sTimestamp + "]%c" + sTitle + "%c" + sMsg;
			console.log(sLogInfo, oConfig.timestampStyle, oConfig.titleStyle, oConfig.msgStyle);
		}
	}
	
	//TODO: Error info

})(AX, window);

(function(AX) {
	//TODO: Need to test
	AX.Util.textLimit = function(sText, nLimit, suffix){
		if(sText.length > nLimit){
			return sText.substr(0, nLimit) + suffix;
		}
		return sText;
	}
})(AX);