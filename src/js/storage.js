//Local Storage
(function(AX, win) {
	AX.Storage = (function() {
		var fLocalStorageSupported = function() {
			try {
				return !!win.localStorage;
			} catch (oErr) {
				return false;
			}
		}
		if (!fLocalStorageSupported()) {
			return;
		}
		var oStorage = win.localStorage;
		var fSerialize = function(oData) {
			return JSON.stringify(oData);
		}
		var fDeserialize = function(sData) {
				return JSON.parse(sData);
			}
			/**
			 * @param sKey {String} save index to local 
			 * @param oValue {Object} save data to local 
			 * @return oValue {Object} data
			 */
		var fSet = function(sKey, oValue) {
			if (oValue == undefined) {
				return fRemove(sKey);
			}
			oStorage.setItem(sKey, fSerialize(oValue));
			return oValue;
		}
		var fGet = function(sKey) {
			return fDeserialize(oStorage.getItem(sKey));
		}
		var fRemove = function(sKey) {
			oStorage.removeItem(sKey);
		}
		var fClear = function() {
			oStorage.clear();
		}
		var fGetAll = function() {
			var oAllData = {};
			fForEach(function(sIndex, oData) {
				oAllData[sIndex] = fGet(sIndex);
			});
			return oAllData;
		}
		var fForEach = function(fCallback) {
			for (var i = 0; i < oStorage.length; i++) {
				var sIndex = oStorage.key(i);
				fCallback(sIndex, fGet(sIndex));
			}
		}
		return {
			set: fSet,
			get: fGet,
			remove: fRemove,
			clear: fClear,
			getAll: fGetAll,
			forEach: fForEach
		}
	})();
})(AX, window);	