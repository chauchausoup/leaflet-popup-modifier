// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/leaflet-popup-modifier.js":[function(require,module,exports) {
// Adding nametag labels to all popup-able leaflet layers
var sourceTypes = ['Layer', 'Circle', 'CircleMarker', 'Marker', 'Polyline', 'Polygon', 'ImageOverlay', 'VideoOverlay', 'SVGOverlay', 'Rectangle', 'LayerGroup', 'FeatureGroup', 'GeoJSON'];
sourceTypes.forEach(function (type) {
  L[type].include({
    nametag: type.toLowerCase()
  });
}); //  Adding new options to the default options of a popup

L.Popup.mergeOptions({
  removable: false,
  editable: false
}); // Modifying the popup mechanics

L.Popup.include({
  // modifying the _initLayout method to include edit and remove buttons, if those options are enabled
  //  ----------------    Source code  ---------------------------- //
  // original from https://github.com/Leaflet/Leaflet/blob/master/src/layer/Popup.js
  _initLayout: function _initLayout() {
    var prefix = 'leaflet-popup',
        container = this._container = L.DomUtil.create('div', prefix + ' ' + (this.options.className || '') + ' leaflet-zoom-animated');
    var wrapper = this._wrapper = L.DomUtil.create('div', prefix + '-content-wrapper', container);
    this._contentNode = L.DomUtil.create('div', prefix + '-content', wrapper);
    L.DomEvent.disableClickPropagation(wrapper);
    L.DomEvent.disableScrollPropagation(this._contentNode);
    L.DomEvent.on(wrapper, 'contextmenu', L.DomEvent.stopPropagation);
    this._tipContainer = L.DomUtil.create('div', prefix + '-tip-container', container);
    this._tip = L.DomUtil.create('div', prefix + '-tip', this._tipContainer);

    if (this.options.closeButton) {
      var closeButton = this._closeButton = L.DomUtil.create('a', prefix + '-close-button', container);
      closeButton.href = '#close';
      closeButton.innerHTML = '&#215;';
      L.DomEvent.on(closeButton, 'click', this._onCloseButtonClick, this);
    } //  ----------------    Source code  ---------------------------- //
    //  ---------------    My additions  --------------------------- //


    var nametag;

    if (this.options.nametag) {
      nametag = this.options.nametag;
    } else if (this._source) {
      nametag = this._source.nametag;
    } else {
      nametag = "popup";
    }

    if (this.options.removable && !this.options.editable) {
      var userActionButtons = this._userActionButtons = L.DomUtil.create('div', prefix + '-useraction-buttons', wrapper);
      var removeButton = this._removeButton = L.DomUtil.create('a', prefix + '-remove-button', userActionButtons);
      removeButton.href = '#close';
      removeButton.innerHTML = "Remove this ".concat(nametag);
      this.options.minWidth = 110;
      L.DomEvent.on(removeButton, 'click', this._onRemoveButtonClick, this);
    }

    if (this.options.editable && !this.options.removable) {
      var userActionButtons = this._userActionButtons = L.DomUtil.create('div', prefix + '-useraction-buttons', wrapper);
      var editButton = this._editButton = L.DomUtil.create('a', prefix + '-edit-button', userActionButtons);
      editButton.href = '#edit';
      editButton.innerHTML = 'Edit';
      L.DomEvent.on(editButton, 'click', this._onEditButtonClick, this);
    }

    if (this.options.editable && this.options.removable) {
      var userActionButtons = this._userActionButtons = L.DomUtil.create('div', prefix + '-useraction-buttons', wrapper);
      var removeButton = this._removeButton = L.DomUtil.create('a', prefix + '-remove-button', userActionButtons);
      removeButton.href = '#close';
      removeButton.innerHTML = "Remove this ".concat(nametag);
      var editButton = this._editButton = L.DomUtil.create('a', prefix + '-edit-button', userActionButtons);
      editButton.href = '#edit';
      editButton.innerHTML = 'Edit';
      this.options.minWidth = 160;
      L.DomEvent.on(removeButton, 'click', this._onRemoveButtonClick, this);
      L.DomEvent.on(editButton, 'click', this._onEditButtonClick, this);
    }
  },
  _onRemoveButtonClick: function _onRemoveButtonClick(e) {
    this._source.remove();

    L.DomEvent.stop(e);
  },
  _onEditButtonClick: function _onEditButtonClick(e) {
    //Needs to be defined first to capture width before changes are applied
    var inputFieldWidth = this._inputFieldWidth = this._container.offsetWidth - 2 * 19;
    this._contentNode.style.display = "none";
    this._userActionButtons.style.display = "none";
    var wrapper = this._wrapper;
    var editScreen = this._editScreen = L.DomUtil.create('div', 'leaflet-popup-edit-screen', wrapper);
    var inputField = this._inputField = L.DomUtil.create('div', 'leaflet-popup-input', editScreen);
    inputField.setAttribute("contenteditable", "true");
    inputField.innerHTML = this.getContent(); //  -----------  Making the input field grow till max width ------- //

    inputField.style.width = inputFieldWidth + 'px';
    var inputFieldDiv = L.DomUtil.get(this._inputField); // create invisible div to measure the text width in pixels

    var ruler = L.DomUtil.create('div', 'leaflet-popup-input-ruler', editScreen);
    var thisStandIn = this; // Padd event listener to the textinput to trigger a check

    this._inputField.addEventListener("keydown", function () {
      // Check to see if the popup is already at its maxWidth
      // and that text doesnt take up whole field
      if (thisStandIn._container.offsetWidth < thisStandIn.options.maxWidth + 38 && thisStandIn._inputFieldWidth + 5 < inputFieldDiv.clientWidth) {
        ruler.innerHTML = inputField.innerHTML;

        if (ruler.offsetWidth + 20 > inputFieldDiv.clientWidth) {
          console.log('expand now');
          inputField.style.width = thisStandIn._inputField.style.width = ruler.offsetWidth + 10 + 'px';
          thisStandIn.update();
        }
      }
    }, false);

    var inputActions = this._inputActions = L.DomUtil.create('div', 'leaflet-popup-input-actions', editScreen);
    var cancelButton = this._cancelButton = L.DomUtil.create('a', 'leaflet-popup-input-cancel', inputActions);
    cancelButton.href = '#cancel';
    cancelButton.innerHTML = 'Cancel';
    var saveButton = this._saveButton = L.DomUtil.create('a', 'leaflet-popup-input-save', inputActions);
    saveButton.href = "#save";
    saveButton.innerHTML = 'Save';
    L.DomEvent.on(cancelButton, 'click', this._onCancelButtonClick, this);
    L.DomEvent.on(saveButton, 'click', this._onSaveButtonClick, this);
    this.update();
    L.DomEvent.stop(e);
  },
  _onCancelButtonClick: function _onCancelButtonClick(e) {
    L.DomUtil.remove(this._editScreen);
    this._contentNode.style.display = "block";
    this._userActionButtons.style.display = "flex";
    this.update();
    L.DomEvent.stop(e);
  },
  _onSaveButtonClick: function _onSaveButtonClick(e) {
    var inputField = this._inputField;

    if (inputField.innerHTML.length > 0) {
      this.setContent(inputField.innerHTML);
    } else {
      alert('Enter something');
    }

    ;
    L.DomUtil.remove(this._editScreen);
    this._contentNode.style.display = "block";
    this._userActionButtons.style.display = "flex";
    this.update();
    L.DomEvent.stop(e); //  ---------------------End my additions --------------------------------------- //
  }
});
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "46195" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/leaflet-popup-modifier.js"], null)
//# sourceMappingURL=/leaflet-popup-modifier.7ac483f7.js.map