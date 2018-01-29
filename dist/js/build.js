/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 38);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(51)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {/* axios v0.17.1 | (c) 2017 by Matt Zabriskie */
(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["axios"] = factory();
	else
		root["axios"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(2);
	var bind = __webpack_require__(3);
	var Axios = __webpack_require__(5);
	var defaults = __webpack_require__(6);
	
	/**
	 * Create an instance of Axios
	 *
	 * @param {Object} defaultConfig The default config for the instance
	 * @return {Axios} A new instance of Axios
	 */
	function createInstance(defaultConfig) {
	  var context = new Axios(defaultConfig);
	  var instance = bind(Axios.prototype.request, context);
	
	  // Copy axios.prototype to instance
	  utils.extend(instance, Axios.prototype, context);
	
	  // Copy context to instance
	  utils.extend(instance, context);
	
	  return instance;
	}
	
	// Create the default instance to be exported
	var axios = createInstance(defaults);
	
	// Expose Axios class to allow class inheritance
	axios.Axios = Axios;
	
	// Factory for creating new instances
	axios.create = function create(instanceConfig) {
	  return createInstance(utils.merge(defaults, instanceConfig));
	};
	
	// Expose Cancel & CancelToken
	axios.Cancel = __webpack_require__(23);
	axios.CancelToken = __webpack_require__(24);
	axios.isCancel = __webpack_require__(20);
	
	// Expose all/spread
	axios.all = function all(promises) {
	  return Promise.all(promises);
	};
	axios.spread = __webpack_require__(25);
	
	module.exports = axios;
	
	// Allow use of default import syntax in TypeScript
	module.exports.default = axios;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var bind = __webpack_require__(3);
	var isBuffer = __webpack_require__(4);
	
	/*global toString:true*/
	
	// utils is a library of generic helper functions non-specific to axios
	
	var toString = Object.prototype.toString;
	
	/**
	 * Determine if a value is an Array
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Array, otherwise false
	 */
	function isArray(val) {
	  return toString.call(val) === '[object Array]';
	}
	
	/**
	 * Determine if a value is an ArrayBuffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
	 */
	function isArrayBuffer(val) {
	  return toString.call(val) === '[object ArrayBuffer]';
	}
	
	/**
	 * Determine if a value is a FormData
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an FormData, otherwise false
	 */
	function isFormData(val) {
	  return (typeof FormData !== 'undefined') && (val instanceof FormData);
	}
	
	/**
	 * Determine if a value is a view on an ArrayBuffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
	 */
	function isArrayBufferView(val) {
	  var result;
	  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
	    result = ArrayBuffer.isView(val);
	  } else {
	    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
	  }
	  return result;
	}
	
	/**
	 * Determine if a value is a String
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a String, otherwise false
	 */
	function isString(val) {
	  return typeof val === 'string';
	}
	
	/**
	 * Determine if a value is a Number
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Number, otherwise false
	 */
	function isNumber(val) {
	  return typeof val === 'number';
	}
	
	/**
	 * Determine if a value is undefined
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if the value is undefined, otherwise false
	 */
	function isUndefined(val) {
	  return typeof val === 'undefined';
	}
	
	/**
	 * Determine if a value is an Object
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Object, otherwise false
	 */
	function isObject(val) {
	  return val !== null && typeof val === 'object';
	}
	
	/**
	 * Determine if a value is a Date
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Date, otherwise false
	 */
	function isDate(val) {
	  return toString.call(val) === '[object Date]';
	}
	
	/**
	 * Determine if a value is a File
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a File, otherwise false
	 */
	function isFile(val) {
	  return toString.call(val) === '[object File]';
	}
	
	/**
	 * Determine if a value is a Blob
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Blob, otherwise false
	 */
	function isBlob(val) {
	  return toString.call(val) === '[object Blob]';
	}
	
	/**
	 * Determine if a value is a Function
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Function, otherwise false
	 */
	function isFunction(val) {
	  return toString.call(val) === '[object Function]';
	}
	
	/**
	 * Determine if a value is a Stream
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Stream, otherwise false
	 */
	function isStream(val) {
	  return isObject(val) && isFunction(val.pipe);
	}
	
	/**
	 * Determine if a value is a URLSearchParams object
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
	 */
	function isURLSearchParams(val) {
	  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
	}
	
	/**
	 * Trim excess whitespace off the beginning and end of a string
	 *
	 * @param {String} str The String to trim
	 * @returns {String} The String freed of excess whitespace
	 */
	function trim(str) {
	  return str.replace(/^\s*/, '').replace(/\s*$/, '');
	}
	
	/**
	 * Determine if we're running in a standard browser environment
	 *
	 * This allows axios to run in a web worker, and react-native.
	 * Both environments support XMLHttpRequest, but not fully standard globals.
	 *
	 * web workers:
	 *  typeof window -> undefined
	 *  typeof document -> undefined
	 *
	 * react-native:
	 *  navigator.product -> 'ReactNative'
	 */
	function isStandardBrowserEnv() {
	  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
	    return false;
	  }
	  return (
	    typeof window !== 'undefined' &&
	    typeof document !== 'undefined'
	  );
	}
	
	/**
	 * Iterate over an Array or an Object invoking a function for each item.
	 *
	 * If `obj` is an Array callback will be called passing
	 * the value, index, and complete array for each item.
	 *
	 * If 'obj' is an Object callback will be called passing
	 * the value, key, and complete object for each property.
	 *
	 * @param {Object|Array} obj The object to iterate
	 * @param {Function} fn The callback to invoke for each item
	 */
	function forEach(obj, fn) {
	  // Don't bother if no value provided
	  if (obj === null || typeof obj === 'undefined') {
	    return;
	  }
	
	  // Force an array if not already something iterable
	  if (typeof obj !== 'object') {
	    /*eslint no-param-reassign:0*/
	    obj = [obj];
	  }
	
	  if (isArray(obj)) {
	    // Iterate over array values
	    for (var i = 0, l = obj.length; i < l; i++) {
	      fn.call(null, obj[i], i, obj);
	    }
	  } else {
	    // Iterate over object keys
	    for (var key in obj) {
	      if (Object.prototype.hasOwnProperty.call(obj, key)) {
	        fn.call(null, obj[key], key, obj);
	      }
	    }
	  }
	}
	
	/**
	 * Accepts varargs expecting each argument to be an object, then
	 * immutably merges the properties of each object and returns result.
	 *
	 * When multiple objects contain the same key the later object in
	 * the arguments list will take precedence.
	 *
	 * Example:
	 *
	 * ```js
	 * var result = merge({foo: 123}, {foo: 456});
	 * console.log(result.foo); // outputs 456
	 * ```
	 *
	 * @param {Object} obj1 Object to merge
	 * @returns {Object} Result of all merge properties
	 */
	function merge(/* obj1, obj2, obj3, ... */) {
	  var result = {};
	  function assignValue(val, key) {
	    if (typeof result[key] === 'object' && typeof val === 'object') {
	      result[key] = merge(result[key], val);
	    } else {
	      result[key] = val;
	    }
	  }
	
	  for (var i = 0, l = arguments.length; i < l; i++) {
	    forEach(arguments[i], assignValue);
	  }
	  return result;
	}
	
	/**
	 * Extends object a by mutably adding to it the properties of object b.
	 *
	 * @param {Object} a The object to be extended
	 * @param {Object} b The object to copy properties from
	 * @param {Object} thisArg The object to bind function to
	 * @return {Object} The resulting value of object a
	 */
	function extend(a, b, thisArg) {
	  forEach(b, function assignValue(val, key) {
	    if (thisArg && typeof val === 'function') {
	      a[key] = bind(val, thisArg);
	    } else {
	      a[key] = val;
	    }
	  });
	  return a;
	}
	
	module.exports = {
	  isArray: isArray,
	  isArrayBuffer: isArrayBuffer,
	  isBuffer: isBuffer,
	  isFormData: isFormData,
	  isArrayBufferView: isArrayBufferView,
	  isString: isString,
	  isNumber: isNumber,
	  isObject: isObject,
	  isUndefined: isUndefined,
	  isDate: isDate,
	  isFile: isFile,
	  isBlob: isBlob,
	  isFunction: isFunction,
	  isStream: isStream,
	  isURLSearchParams: isURLSearchParams,
	  isStandardBrowserEnv: isStandardBrowserEnv,
	  forEach: forEach,
	  merge: merge,
	  extend: extend,
	  trim: trim
	};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	'use strict';
	
	module.exports = function bind(fn, thisArg) {
	  return function wrap() {
	    var args = new Array(arguments.length);
	    for (var i = 0; i < args.length; i++) {
	      args[i] = arguments[i];
	    }
	    return fn.apply(thisArg, args);
	  };
	};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	/*!
	 * Determine if an object is a Buffer
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	
	// The _isBuffer check is for Safari 5-7 support, because it's missing
	// Object.prototype.constructor. Remove this eventually
	module.exports = function (obj) {
	  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
	}
	
	function isBuffer (obj) {
	  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
	}
	
	// For Node v0.10 support. Remove this eventually.
	function isSlowBuffer (obj) {
	  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
	}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var defaults = __webpack_require__(6);
	var utils = __webpack_require__(2);
	var InterceptorManager = __webpack_require__(17);
	var dispatchRequest = __webpack_require__(18);
	
	/**
	 * Create a new instance of Axios
	 *
	 * @param {Object} instanceConfig The default config for the instance
	 */
	function Axios(instanceConfig) {
	  this.defaults = instanceConfig;
	  this.interceptors = {
	    request: new InterceptorManager(),
	    response: new InterceptorManager()
	  };
	}
	
	/**
	 * Dispatch a request
	 *
	 * @param {Object} config The config specific for this request (merged with this.defaults)
	 */
	Axios.prototype.request = function request(config) {
	  /*eslint no-param-reassign:0*/
	  // Allow for axios('example/url'[, config]) a la fetch API
	  if (typeof config === 'string') {
	    config = utils.merge({
	      url: arguments[0]
	    }, arguments[1]);
	  }
	
	  config = utils.merge(defaults, this.defaults, { method: 'get' }, config);
	  config.method = config.method.toLowerCase();
	
	  // Hook up interceptors middleware
	  var chain = [dispatchRequest, undefined];
	  var promise = Promise.resolve(config);
	
	  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
	    chain.unshift(interceptor.fulfilled, interceptor.rejected);
	  });
	
	  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
	    chain.push(interceptor.fulfilled, interceptor.rejected);
	  });
	
	  while (chain.length) {
	    promise = promise.then(chain.shift(), chain.shift());
	  }
	
	  return promise;
	};
	
	// Provide aliases for supported request methods
	utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
	  /*eslint func-names:0*/
	  Axios.prototype[method] = function(url, config) {
	    return this.request(utils.merge(config || {}, {
	      method: method,
	      url: url
	    }));
	  };
	});
	
	utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	  /*eslint func-names:0*/
	  Axios.prototype[method] = function(url, data, config) {
	    return this.request(utils.merge(config || {}, {
	      method: method,
	      url: url,
	      data: data
	    }));
	  };
	});
	
	module.exports = Axios;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(2);
	var normalizeHeaderName = __webpack_require__(7);
	
	var DEFAULT_CONTENT_TYPE = {
	  'Content-Type': 'application/x-www-form-urlencoded'
	};
	
	function setContentTypeIfUnset(headers, value) {
	  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
	    headers['Content-Type'] = value;
	  }
	}
	
	function getDefaultAdapter() {
	  var adapter;
	  if (typeof XMLHttpRequest !== 'undefined') {
	    // For browsers use XHR adapter
	    adapter = __webpack_require__(8);
	  } else if (typeof process !== 'undefined') {
	    // For node use HTTP adapter
	    adapter = __webpack_require__(8);
	  }
	  return adapter;
	}
	
	var defaults = {
	  adapter: getDefaultAdapter(),
	
	  transformRequest: [function transformRequest(data, headers) {
	    normalizeHeaderName(headers, 'Content-Type');
	    if (utils.isFormData(data) ||
	      utils.isArrayBuffer(data) ||
	      utils.isBuffer(data) ||
	      utils.isStream(data) ||
	      utils.isFile(data) ||
	      utils.isBlob(data)
	    ) {
	      return data;
	    }
	    if (utils.isArrayBufferView(data)) {
	      return data.buffer;
	    }
	    if (utils.isURLSearchParams(data)) {
	      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
	      return data.toString();
	    }
	    if (utils.isObject(data)) {
	      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
	      return JSON.stringify(data);
	    }
	    return data;
	  }],
	
	  transformResponse: [function transformResponse(data) {
	    /*eslint no-param-reassign:0*/
	    if (typeof data === 'string') {
	      try {
	        data = JSON.parse(data);
	      } catch (e) { /* Ignore */ }
	    }
	    return data;
	  }],
	
	  timeout: 0,
	
	  xsrfCookieName: 'XSRF-TOKEN',
	  xsrfHeaderName: 'X-XSRF-TOKEN',
	
	  maxContentLength: -1,
	
	  validateStatus: function validateStatus(status) {
	    return status >= 200 && status < 300;
	  }
	};
	
	defaults.headers = {
	  common: {
	    'Accept': 'application/json, text/plain, */*'
	  }
	};
	
	utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
	  defaults.headers[method] = {};
	});
	
	utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
	});
	
	module.exports = defaults;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(2);
	
	module.exports = function normalizeHeaderName(headers, normalizedName) {
	  utils.forEach(headers, function processHeader(value, name) {
	    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
	      headers[normalizedName] = value;
	      delete headers[name];
	    }
	  });
	};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(2);
	var settle = __webpack_require__(9);
	var buildURL = __webpack_require__(12);
	var parseHeaders = __webpack_require__(13);
	var isURLSameOrigin = __webpack_require__(14);
	var createError = __webpack_require__(10);
	var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || __webpack_require__(15);
	
	module.exports = function xhrAdapter(config) {
	  return new Promise(function dispatchXhrRequest(resolve, reject) {
	    var requestData = config.data;
	    var requestHeaders = config.headers;
	
	    if (utils.isFormData(requestData)) {
	      delete requestHeaders['Content-Type']; // Let the browser set it
	    }
	
	    var request = new XMLHttpRequest();
	    var loadEvent = 'onreadystatechange';
	    var xDomain = false;
	
	    // For IE 8/9 CORS support
	    // Only supports POST and GET calls and doesn't returns the response headers.
	    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
	    if (("production") !== 'test' &&
	        typeof window !== 'undefined' &&
	        window.XDomainRequest && !('withCredentials' in request) &&
	        !isURLSameOrigin(config.url)) {
	      request = new window.XDomainRequest();
	      loadEvent = 'onload';
	      xDomain = true;
	      request.onprogress = function handleProgress() {};
	      request.ontimeout = function handleTimeout() {};
	    }
	
	    // HTTP basic authentication
	    if (config.auth) {
	      var username = config.auth.username || '';
	      var password = config.auth.password || '';
	      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
	    }
	
	    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);
	
	    // Set the request timeout in MS
	    request.timeout = config.timeout;
	
	    // Listen for ready state
	    request[loadEvent] = function handleLoad() {
	      if (!request || (request.readyState !== 4 && !xDomain)) {
	        return;
	      }
	
	      // The request errored out and we didn't get a response, this will be
	      // handled by onerror instead
	      // With one exception: request that using file: protocol, most browsers
	      // will return status as 0 even though it's a successful request
	      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
	        return;
	      }
	
	      // Prepare the response
	      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
	      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
	      var response = {
	        data: responseData,
	        // IE sends 1223 instead of 204 (https://github.com/axios/axios/issues/201)
	        status: request.status === 1223 ? 204 : request.status,
	        statusText: request.status === 1223 ? 'No Content' : request.statusText,
	        headers: responseHeaders,
	        config: config,
	        request: request
	      };
	
	      settle(resolve, reject, response);
	
	      // Clean up request
	      request = null;
	    };
	
	    // Handle low level network errors
	    request.onerror = function handleError() {
	      // Real errors are hidden from us by the browser
	      // onerror should only fire if it's a network error
	      reject(createError('Network Error', config, null, request));
	
	      // Clean up request
	      request = null;
	    };
	
	    // Handle timeout
	    request.ontimeout = function handleTimeout() {
	      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
	        request));
	
	      // Clean up request
	      request = null;
	    };
	
	    // Add xsrf header
	    // This is only done if running in a standard browser environment.
	    // Specifically not if we're in a web worker, or react-native.
	    if (utils.isStandardBrowserEnv()) {
	      var cookies = __webpack_require__(16);
	
	      // Add xsrf header
	      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
	          cookies.read(config.xsrfCookieName) :
	          undefined;
	
	      if (xsrfValue) {
	        requestHeaders[config.xsrfHeaderName] = xsrfValue;
	      }
	    }
	
	    // Add headers to the request
	    if ('setRequestHeader' in request) {
	      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
	        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
	          // Remove Content-Type if data is undefined
	          delete requestHeaders[key];
	        } else {
	          // Otherwise add header to the request
	          request.setRequestHeader(key, val);
	        }
	      });
	    }
	
	    // Add withCredentials to request if needed
	    if (config.withCredentials) {
	      request.withCredentials = true;
	    }
	
	    // Add responseType to request if needed
	    if (config.responseType) {
	      try {
	        request.responseType = config.responseType;
	      } catch (e) {
	        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
	        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
	        if (config.responseType !== 'json') {
	          throw e;
	        }
	      }
	    }
	
	    // Handle progress if needed
	    if (typeof config.onDownloadProgress === 'function') {
	      request.addEventListener('progress', config.onDownloadProgress);
	    }
	
	    // Not all browsers support upload events
	    if (typeof config.onUploadProgress === 'function' && request.upload) {
	      request.upload.addEventListener('progress', config.onUploadProgress);
	    }
	
	    if (config.cancelToken) {
	      // Handle cancellation
	      config.cancelToken.promise.then(function onCanceled(cancel) {
	        if (!request) {
	          return;
	        }
	
	        request.abort();
	        reject(cancel);
	        // Clean up request
	        request = null;
	      });
	    }
	
	    if (requestData === undefined) {
	      requestData = null;
	    }
	
	    // Send the request
	    request.send(requestData);
	  });
	};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var createError = __webpack_require__(10);
	
	/**
	 * Resolve or reject a Promise based on response status.
	 *
	 * @param {Function} resolve A function that resolves the promise.
	 * @param {Function} reject A function that rejects the promise.
	 * @param {object} response The response.
	 */
	module.exports = function settle(resolve, reject, response) {
	  var validateStatus = response.config.validateStatus;
	  // Note: status is not exposed by XDomainRequest
	  if (!response.status || !validateStatus || validateStatus(response.status)) {
	    resolve(response);
	  } else {
	    reject(createError(
	      'Request failed with status code ' + response.status,
	      response.config,
	      null,
	      response.request,
	      response
	    ));
	  }
	};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var enhanceError = __webpack_require__(11);
	
	/**
	 * Create an Error with the specified message, config, error code, request and response.
	 *
	 * @param {string} message The error message.
	 * @param {Object} config The config.
	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
	 * @param {Object} [request] The request.
	 * @param {Object} [response] The response.
	 * @returns {Error} The created error.
	 */
	module.exports = function createError(message, config, code, request, response) {
	  var error = new Error(message);
	  return enhanceError(error, config, code, request, response);
	};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * Update an Error with the specified config, error code, and response.
	 *
	 * @param {Error} error The error to update.
	 * @param {Object} config The config.
	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
	 * @param {Object} [request] The request.
	 * @param {Object} [response] The response.
	 * @returns {Error} The error.
	 */
	module.exports = function enhanceError(error, config, code, request, response) {
	  error.config = config;
	  if (code) {
	    error.code = code;
	  }
	  error.request = request;
	  error.response = response;
	  return error;
	};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(2);
	
	function encode(val) {
	  return encodeURIComponent(val).
	    replace(/%40/gi, '@').
	    replace(/%3A/gi, ':').
	    replace(/%24/g, '$').
	    replace(/%2C/gi, ',').
	    replace(/%20/g, '+').
	    replace(/%5B/gi, '[').
	    replace(/%5D/gi, ']');
	}
	
	/**
	 * Build a URL by appending params to the end
	 *
	 * @param {string} url The base of the url (e.g., http://www.google.com)
	 * @param {object} [params] The params to be appended
	 * @returns {string} The formatted url
	 */
	module.exports = function buildURL(url, params, paramsSerializer) {
	  /*eslint no-param-reassign:0*/
	  if (!params) {
	    return url;
	  }
	
	  var serializedParams;
	  if (paramsSerializer) {
	    serializedParams = paramsSerializer(params);
	  } else if (utils.isURLSearchParams(params)) {
	    serializedParams = params.toString();
	  } else {
	    var parts = [];
	
	    utils.forEach(params, function serialize(val, key) {
	      if (val === null || typeof val === 'undefined') {
	        return;
	      }
	
	      if (utils.isArray(val)) {
	        key = key + '[]';
	      }
	
	      if (!utils.isArray(val)) {
	        val = [val];
	      }
	
	      utils.forEach(val, function parseValue(v) {
	        if (utils.isDate(v)) {
	          v = v.toISOString();
	        } else if (utils.isObject(v)) {
	          v = JSON.stringify(v);
	        }
	        parts.push(encode(key) + '=' + encode(v));
	      });
	    });
	
	    serializedParams = parts.join('&');
	  }
	
	  if (serializedParams) {
	    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
	  }
	
	  return url;
	};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(2);
	
	// Headers whose duplicates are ignored by node
	// c.f. https://nodejs.org/api/http.html#http_message_headers
	var ignoreDuplicateOf = [
	  'age', 'authorization', 'content-length', 'content-type', 'etag',
	  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
	  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
	  'referer', 'retry-after', 'user-agent'
	];
	
	/**
	 * Parse headers into an object
	 *
	 * ```
	 * Date: Wed, 27 Aug 2014 08:58:49 GMT
	 * Content-Type: application/json
	 * Connection: keep-alive
	 * Transfer-Encoding: chunked
	 * ```
	 *
	 * @param {String} headers Headers needing to be parsed
	 * @returns {Object} Headers parsed into an object
	 */
	module.exports = function parseHeaders(headers) {
	  var parsed = {};
	  var key;
	  var val;
	  var i;
	
	  if (!headers) { return parsed; }
	
	  utils.forEach(headers.split('\n'), function parser(line) {
	    i = line.indexOf(':');
	    key = utils.trim(line.substr(0, i)).toLowerCase();
	    val = utils.trim(line.substr(i + 1));
	
	    if (key) {
	      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
	        return;
	      }
	      if (key === 'set-cookie') {
	        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
	      } else {
	        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
	      }
	    }
	  });
	
	  return parsed;
	};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(2);
	
	module.exports = (
	  utils.isStandardBrowserEnv() ?
	
	  // Standard browser envs have full support of the APIs needed to test
	  // whether the request URL is of the same origin as current location.
	  (function standardBrowserEnv() {
	    var msie = /(msie|trident)/i.test(navigator.userAgent);
	    var urlParsingNode = document.createElement('a');
	    var originURL;
	
	    /**
	    * Parse a URL to discover it's components
	    *
	    * @param {String} url The URL to be parsed
	    * @returns {Object}
	    */
	    function resolveURL(url) {
	      var href = url;
	
	      if (msie) {
	        // IE needs attribute set twice to normalize properties
	        urlParsingNode.setAttribute('href', href);
	        href = urlParsingNode.href;
	      }
	
	      urlParsingNode.setAttribute('href', href);
	
	      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
	      return {
	        href: urlParsingNode.href,
	        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
	        host: urlParsingNode.host,
	        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
	        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
	        hostname: urlParsingNode.hostname,
	        port: urlParsingNode.port,
	        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
	                  urlParsingNode.pathname :
	                  '/' + urlParsingNode.pathname
	      };
	    }
	
	    originURL = resolveURL(window.location.href);
	
	    /**
	    * Determine if a URL shares the same origin as the current location
	    *
	    * @param {String} requestURL The URL to test
	    * @returns {boolean} True if URL shares the same origin, otherwise false
	    */
	    return function isURLSameOrigin(requestURL) {
	      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
	      return (parsed.protocol === originURL.protocol &&
	            parsed.host === originURL.host);
	    };
	  })() :
	
	  // Non standard browser envs (web workers, react-native) lack needed support.
	  (function nonStandardBrowserEnv() {
	    return function isURLSameOrigin() {
	      return true;
	    };
	  })()
	);


/***/ }),
/* 15 */
/***/ (function(module, exports) {

	'use strict';
	
	// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js
	
	var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	
	function E() {
	  this.message = 'String contains an invalid character';
	}
	E.prototype = new Error;
	E.prototype.code = 5;
	E.prototype.name = 'InvalidCharacterError';
	
	function btoa(input) {
	  var str = String(input);
	  var output = '';
	  for (
	    // initialize result and counter
	    var block, charCode, idx = 0, map = chars;
	    // if the next str index does not exist:
	    //   change the mapping table to "="
	    //   check if d has no fractional digits
	    str.charAt(idx | 0) || (map = '=', idx % 1);
	    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
	    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
	  ) {
	    charCode = str.charCodeAt(idx += 3 / 4);
	    if (charCode > 0xFF) {
	      throw new E();
	    }
	    block = block << 8 | charCode;
	  }
	  return output;
	}
	
	module.exports = btoa;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(2);
	
	module.exports = (
	  utils.isStandardBrowserEnv() ?
	
	  // Standard browser envs support document.cookie
	  (function standardBrowserEnv() {
	    return {
	      write: function write(name, value, expires, path, domain, secure) {
	        var cookie = [];
	        cookie.push(name + '=' + encodeURIComponent(value));
	
	        if (utils.isNumber(expires)) {
	          cookie.push('expires=' + new Date(expires).toGMTString());
	        }
	
	        if (utils.isString(path)) {
	          cookie.push('path=' + path);
	        }
	
	        if (utils.isString(domain)) {
	          cookie.push('domain=' + domain);
	        }
	
	        if (secure === true) {
	          cookie.push('secure');
	        }
	
	        document.cookie = cookie.join('; ');
	      },
	
	      read: function read(name) {
	        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
	        return (match ? decodeURIComponent(match[3]) : null);
	      },
	
	      remove: function remove(name) {
	        this.write(name, '', Date.now() - 86400000);
	      }
	    };
	  })() :
	
	  // Non standard browser env (web workers, react-native) lack needed support.
	  (function nonStandardBrowserEnv() {
	    return {
	      write: function write() {},
	      read: function read() { return null; },
	      remove: function remove() {}
	    };
	  })()
	);


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(2);
	
	function InterceptorManager() {
	  this.handlers = [];
	}
	
	/**
	 * Add a new interceptor to the stack
	 *
	 * @param {Function} fulfilled The function to handle `then` for a `Promise`
	 * @param {Function} rejected The function to handle `reject` for a `Promise`
	 *
	 * @return {Number} An ID used to remove interceptor later
	 */
	InterceptorManager.prototype.use = function use(fulfilled, rejected) {
	  this.handlers.push({
	    fulfilled: fulfilled,
	    rejected: rejected
	  });
	  return this.handlers.length - 1;
	};
	
	/**
	 * Remove an interceptor from the stack
	 *
	 * @param {Number} id The ID that was returned by `use`
	 */
	InterceptorManager.prototype.eject = function eject(id) {
	  if (this.handlers[id]) {
	    this.handlers[id] = null;
	  }
	};
	
	/**
	 * Iterate over all the registered interceptors
	 *
	 * This method is particularly useful for skipping over any
	 * interceptors that may have become `null` calling `eject`.
	 *
	 * @param {Function} fn The function to call for each interceptor
	 */
	InterceptorManager.prototype.forEach = function forEach(fn) {
	  utils.forEach(this.handlers, function forEachHandler(h) {
	    if (h !== null) {
	      fn(h);
	    }
	  });
	};
	
	module.exports = InterceptorManager;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(2);
	var transformData = __webpack_require__(19);
	var isCancel = __webpack_require__(20);
	var defaults = __webpack_require__(6);
	var isAbsoluteURL = __webpack_require__(21);
	var combineURLs = __webpack_require__(22);
	
	/**
	 * Throws a `Cancel` if cancellation has been requested.
	 */
	function throwIfCancellationRequested(config) {
	  if (config.cancelToken) {
	    config.cancelToken.throwIfRequested();
	  }
	}
	
	/**
	 * Dispatch a request to the server using the configured adapter.
	 *
	 * @param {object} config The config that is to be used for the request
	 * @returns {Promise} The Promise to be fulfilled
	 */
	module.exports = function dispatchRequest(config) {
	  throwIfCancellationRequested(config);
	
	  // Support baseURL config
	  if (config.baseURL && !isAbsoluteURL(config.url)) {
	    config.url = combineURLs(config.baseURL, config.url);
	  }
	
	  // Ensure headers exist
	  config.headers = config.headers || {};
	
	  // Transform request data
	  config.data = transformData(
	    config.data,
	    config.headers,
	    config.transformRequest
	  );
	
	  // Flatten headers
	  config.headers = utils.merge(
	    config.headers.common || {},
	    config.headers[config.method] || {},
	    config.headers || {}
	  );
	
	  utils.forEach(
	    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
	    function cleanHeaderConfig(method) {
	      delete config.headers[method];
	    }
	  );
	
	  var adapter = config.adapter || defaults.adapter;
	
	  return adapter(config).then(function onAdapterResolution(response) {
	    throwIfCancellationRequested(config);
	
	    // Transform response data
	    response.data = transformData(
	      response.data,
	      response.headers,
	      config.transformResponse
	    );
	
	    return response;
	  }, function onAdapterRejection(reason) {
	    if (!isCancel(reason)) {
	      throwIfCancellationRequested(config);
	
	      // Transform response data
	      if (reason && reason.response) {
	        reason.response.data = transformData(
	          reason.response.data,
	          reason.response.headers,
	          config.transformResponse
	        );
	      }
	    }
	
	    return Promise.reject(reason);
	  });
	};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(2);
	
	/**
	 * Transform the data for a request or a response
	 *
	 * @param {Object|String} data The data to be transformed
	 * @param {Array} headers The headers for the request or response
	 * @param {Array|Function} fns A single function or Array of functions
	 * @returns {*} The resulting transformed data
	 */
	module.exports = function transformData(data, headers, fns) {
	  /*eslint no-param-reassign:0*/
	  utils.forEach(fns, function transform(fn) {
	    data = fn(data, headers);
	  });
	
	  return data;
	};


/***/ }),
/* 20 */
/***/ (function(module, exports) {

	'use strict';
	
	module.exports = function isCancel(value) {
	  return !!(value && value.__CANCEL__);
	};


/***/ }),
/* 21 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * Determines whether the specified URL is absolute
	 *
	 * @param {string} url The URL to test
	 * @returns {boolean} True if the specified URL is absolute, otherwise false
	 */
	module.exports = function isAbsoluteURL(url) {
	  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
	  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
	  // by any combination of letters, digits, plus, period, or hyphen.
	  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
	};


/***/ }),
/* 22 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * Creates a new URL by combining the specified URLs
	 *
	 * @param {string} baseURL The base URL
	 * @param {string} relativeURL The relative URL
	 * @returns {string} The combined URL
	 */
	module.exports = function combineURLs(baseURL, relativeURL) {
	  return relativeURL
	    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
	    : baseURL;
	};


/***/ }),
/* 23 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * A `Cancel` is an object that is thrown when an operation is canceled.
	 *
	 * @class
	 * @param {string=} message The message.
	 */
	function Cancel(message) {
	  this.message = message;
	}
	
	Cancel.prototype.toString = function toString() {
	  return 'Cancel' + (this.message ? ': ' + this.message : '');
	};
	
	Cancel.prototype.__CANCEL__ = true;
	
	module.exports = Cancel;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var Cancel = __webpack_require__(23);
	
	/**
	 * A `CancelToken` is an object that can be used to request cancellation of an operation.
	 *
	 * @class
	 * @param {Function} executor The executor function.
	 */
	function CancelToken(executor) {
	  if (typeof executor !== 'function') {
	    throw new TypeError('executor must be a function.');
	  }
	
	  var resolvePromise;
	  this.promise = new Promise(function promiseExecutor(resolve) {
	    resolvePromise = resolve;
	  });
	
	  var token = this;
	  executor(function cancel(message) {
	    if (token.reason) {
	      // Cancellation has already been requested
	      return;
	    }
	
	    token.reason = new Cancel(message);
	    resolvePromise(token.reason);
	  });
	}
	
	/**
	 * Throws a `Cancel` if cancellation has been requested.
	 */
	CancelToken.prototype.throwIfRequested = function throwIfRequested() {
	  if (this.reason) {
	    throw this.reason;
	  }
	};
	
	/**
	 * Returns an object that contains a new `CancelToken` and a function that, when called,
	 * cancels the `CancelToken`.
	 */
	CancelToken.source = function source() {
	  var cancel;
	  var token = new CancelToken(function executor(c) {
	    cancel = c;
	  });
	  return {
	    token: token,
	    cancel: cancel
	  };
	};
	
	module.exports = CancelToken;


/***/ }),
/* 25 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * Syntactic sugar for invoking a function and expanding an array for arguments.
	 *
	 * Common use case would be to use `Function.prototype.apply`.
	 *
	 *  ```js
	 *  function f(x, y, z) {}
	 *  var args = [1, 2, 3];
	 *  f.apply(null, args);
	 *  ```
	 *
	 * With `spread` this example can be re-written.
	 *
	 *  ```js
	 *  spread(function(x, y, z) {})([1, 2, 3]);
	 *  ```
	 *
	 * @param {Function} callback
	 * @returns {Function}
	 */
	module.exports = function spread(callback) {
	  return function wrap(arr) {
	    return callback.apply(null, arr);
	  };
	};


/***/ })
/******/ ])
});
;
//# sourceMappingURL=axios.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_side_menu_vue__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_side_menu_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_side_menu_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_side_menu_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_side_menu_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_d1896c56_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_side_menu_vue__ = __webpack_require__(59);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(57)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_side_menu_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_d1896c56_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_side_menu_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/vue-comp/side-menu.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-d1896c56", Component.options)
  } else {
    hotAPI.reload("data-v-d1896c56", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = function escape(url) {
    // If url is already wrapped in quotes, remove them
    if (/^['"].*['"]$/.test(url)) {
        url = url.slice(1, -1);
    }
    // Should url be wrapped?
    // See https://drafts.csswg.org/css-values-3/#urls
    if (/["'() \t\n]/.test(url)) {
        return '"' + url.replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"'
    }

    return url
}


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_loading_vue__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_loading_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_loading_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_loading_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_loading_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_9bbc88b4_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_loading_vue__ = __webpack_require__(85);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(83)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_loading_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_9bbc88b4_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_loading_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/vue-comp/interface/loading.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-9bbc88b4", Component.options)
  } else {
    hotAPI.reload("data-v-9bbc88b4", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(39);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(8)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js??ref--3-1!../../node_modules/postcss-loader/lib/index.js!./variables.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js??ref--3-1!../../node_modules/postcss-loader/lib/index.js!./variables.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(40);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 9 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(44);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;


/***/ }),
/* 11 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _axios = _interopRequireDefault(__webpack_require__(3));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  //Проверка авторизации пользователя
  checkUser: function checkUser() {
    return _axios.default.get('php/checkauth.php').then(function (res) {
      return res.data === 1;
    }).catch(function (err) {
      console.log(err);
    }); // return false;
  }
};
exports.default = _default;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _variables = _interopRequireDefault(__webpack_require__(7));

var _reg = _interopRequireDefault(__webpack_require__(52));

var _axios = _interopRequireDefault(__webpack_require__(3));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  data: function data() {
    return {
      // Активный таб
      activeTab: 'auth',
      // Ошибки формы авторизации
      loginFormErr: '',
      // Ошибки формы регистрации
      regFormErr: '',
      // Данные авторизации
      loginFormData: {
        userEmail: '',
        userPassword: ''
      },
      // Данные регистрации
      regFormData: {
        userEmail: '',
        userPassword: '',
        userPassword_re: '',
        userName: '',
        userLastName: '',
        userCompany: ''
      }
    };
  },
  computed: {
    // Объект класса формы авторизации
    authForm: function authForm() {
      return {
        'auth-form': true,
        'auth-form_inactive': this.activeTab === 'reg'
      };
    },
    // Объект класса формы регистрации
    regForm: function regForm() {
      return {
        'reg-form': true,
        'reg-form_inactive': this.activeTab === 'auth'
      };
    },
    loginErrClass: function loginErrClass() {
      return {
        'log-form__flashmsg': true,
        'log-form__flashmsg_inactive': this.regFormErr.length === 0
      };
    },
    // Объект класса поля ошибок формы регистрации
    regErrClass: function regErrClass() {
      return {
        'reg-form__flashmsg': true,
        'reg-form__flashmsg_inactive': this.regFormErr.length === 0
      };
    }
  },
  methods: {
    // Обработчик события переключения табов Авторизация/Регистрация
    changeTab: function changeTab(e) {
      this.activeTab = e.target.getAttribute('href').slice(1);
      e.target.classList.contains;
    },
    // Обработчик события авторизации пользователя
    authorize: function authorize(e) {
      var _this = this;

      _axios.default.post('php/auth.php', this.loginFormData).then(function (res) {
        if (!res.data.success) {
          console.log(res);
          throw new Error(res.data.errorMsg);
        } else {
          var query = localStorage.getItem('query');
          localStorage.setItem('user_email', res.data.email);
          console.log(res.data);
          !query ? _this.$router.push({
            path: '/tester'
          }) : window.location.href = window.location.origin + '/exec?' + query;
        }
      }).catch(function (err) {
        console.log(err);
        _this.loginFormErr = err.message;
        setTimeout(function () {
          return _this.regFormErr = '';
        }, 4000);
      });
    },
    // Обработчик события регистрации пользователя
    registration: function registration(e) {
      var _this2 = this;

      var res = _reg.default.checkData(this.regFormData);

      if (!res.success) {
        this.regFormErr = res.errorMsg;
        setTimeout(function () {
          return _this2.regFormErr = '';
        }, 4000);
      } else {
        _axios.default.post('php/reg.php', this.regFormData).then(function (res) {
          console.log(res);

          if (!res.data.success) {
            throw new Error(res.data.errorMsg);
          } else {
            var query = localStorage.getItem('query');
            localStorage.setItem('user_email', res.data.email);
            console.log(res.data);
            !query ? _this2.$router.push({
              path: '/tester'
            }) : window.location.href = window.location.origin + '/exec?' + query;
          }
        }).catch(function (err) {
          console.log(err);
          _this2.regFormErr = err.message;
        });
      }
    }
  },
  beforeRouteLeave: function beforeRouteLeave(to, from, next) {
    localStorage.getItem('query') ? localStorage.removeItem('query') : false;
    next();
  }
};
exports.default = _default;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _variables = _interopRequireDefault(__webpack_require__(7));

var _sideMenu = _interopRequireDefault(__webpack_require__(4));

var _newTest = _interopRequireDefault(__webpack_require__(16));

var _loading = _interopRequireDefault(__webpack_require__(6));

var _testItem = _interopRequireDefault(__webpack_require__(86));

var _popUpTest = _interopRequireDefault(__webpack_require__(27));

var _flashmessage = _interopRequireDefault(__webpack_require__(23));

var _axios = _interopRequireDefault(__webpack_require__(3));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  components: {
    'side-menu': _sideMenu.default,
    'loading-indicator': _loading.default,
    'test-item': _testItem.default,
    'pop-up': _popUpTest.default,
    'flash-message': _flashmessage.default
  },
  data: function data() {
    return {
      loading: false,
      tests: null,
      currentSection: true,
      popUp: false,
      currentTest: null,
      flashMsg: {
        text: '',
        status: 1
      },
      sectionOne: 1,
      sectionTwo: 2
    };
  },
  computed: {
    //Всплывающие сообщения
    flashMsgClass: function flashMsgClass() {
      return {
        'test-flasgMesg': true,
        'test-flasgMesg_error': this.flashMsg.status == 1,
        'test-flasgMesg_warn': this.flashMsg.status == 2,
        'test-flasgMesg_succes': this.flashMsg.status == 3
      };
    }
  },
  created: function created() {
    this.fetchData();
  },
  methods: {
    // Получаем данные о тестах с сервера
    fetchData: function fetchData() {
      var _this = this;

      this.loading = true;

      _axios.default.get('php/gettests.php').then(function (res) {
        _this.loading = false;
        _this.tests = {};
        _this.tests.published = [];
        _this.tests.drafts = [];
        res.data.tests.forEach(function (v) {
          v.test_status == 1 ? _this.tests.published.push(v) : _this.tests.drafts.push(v);
        });
        console.log(_this.tests);
      }).catch(function (err) {
        _this.loading = false;
        console.log(err);
      });
    },
    //Вывод сообщения
    showFlashMsg: function showFlashMsg(status, text) {
      var _this2 = this;

      this.flashMsg.status = status;
      this.flashMsg.text = text;
      setTimeout(function () {
        return _this2.flashMsg.text = '';
      }, 10000);
    },
    // Выводим подтверждение того, что тест удален
    deleteTestHandler: function deleteTestHandler(code, msg) {
      var _this3 = this;

      this.showFlashMsg(code, msg);
      this.fetchData();
      setTimeout(function () {
        _this3.$router.replace('/tester');
      }, 3000);
    },
    //Выводим сообщение о том, что тест опубликован
    updateTestHandler: function updateTestHandler(code, msg) {
      var _this4 = this;

      this.showFlashMsg(code, msg);
      this.fetchData();
      setTimeout(function () {
        _this4.$router.replace('/tester');
      }, 3000);
    },
    // Выводим подтверждение того, что ссылка скопирована
    copyLinkHander: function copyLinkHander(msg) {
      this.showFlashMsg(3, msg);
    },
    // Добовление теста
    newTest: function newTest() {
      this.$router.push('/newtest');
    },
    //Показываем опубликованные тесты
    showPublished: function showPublished() {
      this.currentSection = true;
    },
    // Показываем черновики
    showDrafts: function showDrafts() {
      this.currentSection = false;
    },
    //Выводим всплывающее окно с полной информацией о тесте
    showTestHandler: function showTestHandler(id) {
      var _this5 = this;

      var query = "?test_id=".concat(id);

      _axios.default.get("php/gettest.php".concat(query)).then(function (res) {
        _this5.currentTest = res.data.test;
        _this5.popUp = true;
      }).catch(function (err) {
        return console.log(err);
      });
    },
    // Редактируем тест из черновиков по быстрой ссылке
    editNewTestHandler: function editNewTestHandler(id) {
      var _this6 = this;

      var query = "?test_id=".concat(id);

      _axios.default.get("php/gettest.php".concat(query)).then(function (res) {
        _this6.currentTest = res.data.test;
        localStorage.setItem('test', JSON.stringify(_this6.currentTest));

        _this6.$router.push('/newtest');
      }).catch(function (err) {
        return console.log(err);
      });
    },
    //Закрываем всплывающее окно
    closePopUp: function closePopUp() {
      this.popUp = false;
    },
    //Редактирование теста
    editTestHandler: function editTestHandler(id) {
      localStorage.setItem('test', JSON.stringify(this.currentTest));
      this.$router.push('/newtest');
    },
    // Удаление теста
    deleteTest: function deleteTest(code, msg) {
      var _this7 = this;

      this.showFlashMsg(code, msg);
      this.fetchData();
      setTimeout(function () {
        _this7.$router.replace('/tester');
      }, 3000);
    }
  }
};
exports.default = _default;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _axios = _interopRequireDefault(__webpack_require__(3));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  data: function data() {
    return {
      mobileMenu: false
    };
  },
  methods: {
    //Выход их профиля
    logout: function logout() {
      var _this = this;

      localStorage.clear();

      _axios.default.get('php/logout.php').then(function (res) {
        return _this.$router.push('/auth');
      }).catch(function (err) {
        return console.log(err);
      });
    },
    menuTrigger: function menuTrigger() {
      this.mobileMenu ? this.mobileMenu = false : this.mobileMenu = true;
      console.log(this.mobileMenu);
    }
  },
  computed: {
    email: function email() {
      return localStorage.getItem('user_email');
    },
    sideMenuStyle: function sideMenuStyle() {
      return {
        'side-menu': true,
        'side-menu__active': this.mobileMenu
      };
    },
    triggerClass: function triggerClass() {
      return {
        'trigger': true,
        'trigger_active': this.mobileMenu
      };
    }
  }
};
exports.default = _default;

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_test_vue__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_test_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_test_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_test_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_test_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1d6eb5e2_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_new_test_vue__ = __webpack_require__(82);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(60)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_test_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1d6eb5e2_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_new_test_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/vue-comp/new-test.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1d6eb5e2", Component.options)
  } else {
    hotAPI.reload("data-v-1d6eb5e2", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = "img/../img/add.svg";

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sideMenu = _interopRequireDefault(__webpack_require__(4));

var _newQuestion = _interopRequireDefault(__webpack_require__(62));

var _flashmessage = _interopRequireDefault(__webpack_require__(23));

var _test = _interopRequireDefault(__webpack_require__(81));

var _axios = _interopRequireDefault(__webpack_require__(3));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  components: {
    'side-menu': _sideMenu.default,
    'new-question': _newQuestion.default,
    'flash-message': _flashmessage.default
  },
  data: function data() {
    return {
      testTitle: '',
      testDescription: '',
      testOptions: {
        timeLimit: false,
        time: 60,
        anonym: false
      },
      questions: [{
        type: 1,
        text: '',
        id: 1,
        vars: []
      }],
      nextQuestionId: 2,
      flashMsg: {
        text: '',
        status: 1
      },
      testId: undefined
    };
  },
  computed: {
    // Объект класса переключателя ограничения по вреиени
    timeToggle: function timeToggle() {
      return this.testOptions.timeLimit === false ? 'img/switch_left.svg' : 'img/switch_rigth.svg';
    },
    // Объект класса переключателя анонимного прохождения
    anonymToggle: function anonymToggle() {
      return this.testOptions.anonym === false ? 'img/switch_left.svg' : 'img/switch_rigth.svg';
    },
    labelTime: function labelTime() {
      return {
        'active': this.testOptions.timeLimit
      };
    },
    labelAnonym: function labelAnonym() {
      return {
        'active': this.testOptions.anonym
      };
    },
    //Всплывающие сообщения
    flashMsgClass: function flashMsgClass() {
      return {
        'test-flasgMesg': true,
        'test-flasgMesg_error': this.flashMsg.status == 1,
        'test-flasgMesg_warn': this.flashMsg.status == 2,
        'test-flasgMesg_succes': this.flashMsg.status == 3
      };
    }
  },
  methods: {
    // Устанавливаем данные теста из ДБ
    fetchTestDb: function fetchTestDb(test) {
      this.testTitle = test.test_name;
      this.testDescription = test.test_description;
      this.testId = +test.test_id;
      this.testOptions.timeLimit = +test.test_time ? true : false;
      this.testOptions.time = +test.test_time;
      this.testOptions.anonym = +test.test_anonym;
      this.questions = [];
      this.nextQuestionId = +test.questions[test.questions.length - 1].question_client_id + 1;

      for (var i = 0; i < test.questions.length; i++) {
        this.questions[i] = {
          type: +test.questions[i].question_type_id,
          text: test.questions[i].question_description,
          id: +test.questions[i].question_client_id,
          db_id: +test.questions[i].question_id,
          vars: []
        };
        var type = +test.questions[i].question_type_id;

        if (type === 1 || type == 2) {
          for (var j = 0; j < test.questions[i].vars.length; j++) {
            var answer = test.questions[i].question_answer.length === 1 ? [test.questions[i].question_answer] : test.questions[i].question_answer.split(',');
            this.questions[i].vars.push({
              text: test.questions[i].vars[j].var_text,
              id: +test.questions[i].vars[j].question_client_id,
              db_id: +test.questions[i].vars[j].question_client_id,
              isRight: answer.indexOf(test.questions[i].vars[j].question_client_id) >= 0 ? true : false
            });
          }
        } else {
          this.questions[i].vars = test.questions[i].question_answer;
        }
      }
    },
    //Вывод сообщения
    showFlashMsg: function showFlashMsg(status, text) {
      var _this = this;

      this.flashMsg.status = status;
      this.flashMsg.text = text;
      setTimeout(function () {
        return _this.flashMsg.text = '';
      }, 10000);
    },
    // Валидация лимита времени
    validTimeLimit: function validTimeLimit(e) {
      var data = e.target.value;

      if (!/\d/i.test(data)) {
        var msg = "Лимит времени задается только в числовом эквиваленте и не должен превышать разумных пределов";
        this.showFlashMsg(1, msg);
        e.target.value = this.testOptions.time;
      } else {
        if (+e.target.value > 240) {
          var _msg = "Вы установили очень большой лимит времени, подумайте, может стоит отключить эту опцию.";
          this.showFlashMsg(2, _msg);
          this.testOptions.time = +e.target.value;
          e.target.value = 60;
        } else if (+e.target.value < 10) {
          e.target.value = 10;
          var _msg2 = "Вы установили очень низкий лимит времени!";
          this.showFlashMsg(1, _msg2);
        } else {
          this.testOptions.time = +e.target.value;
        }
      }
    },
    // Добавление нового вопроса
    addQuestion: function addQuestion() {
      this.questions.push({
        type: 1,
        text: '',
        id: this.nextQuestionId,
        vars: [{
          text: '',
          isRight: false,
          id: 1
        }]
      });
      this.nextQuestionId++;
    },
    // Удаляем вопрос
    deleteQuestionHandler: function deleteQuestionHandler(id) {
      var index = this.questions.map(function (v, i) {
        if (v.id === id) return i;
      });
      index.length > 1 ? index = index.filter(function (v) {
        if (typeof v == 'number') return v;
      })[0] : index = index[0];
      this.questions.splice(index, 1);
    },
    // Обновляем информацию вопроса
    updateQuestionInfo: function updateQuestionInfo(id, type, description, vars) {
      for (var i = 0; i < this.questions.length; i++) {
        if (this.questions[i].id === id) {
          this.questions[i].type = type;
          this.questions[i].text = description;
          this.questions[i].vars = vars;
        }
      }
    },
    publishTest: function publishTest() {
      this.saveTest(1);
    },
    // Сохраняем тест
    saveTest: function saveTest(status) {
      var _this2 = this;

      var status = status ? status : 0;
      var test = {
        title: this.testTitle,
        description: this.testDescription,
        options: this.testOptions,
        questions: this.questions,
        status: status,
        testId: this.testId
      };

      var res = _test.default.check(test);

      if (res.status) {
        _axios.default.post('php/savetest.php', test).then(function (res) {
          console.log(res);

          if (!res.data.success) {
            _this2.showFlashMsg(1, res.data.errorMsg);
          } else {
            var msg = status == 0 ? 'Тест успешно сохранен в базе данных' : 'Тест опубликован';

            _this2.showFlashMsg(3, msg);

            setTimeout(function () {
              return _this2.$router.push('/tester');
            }, 2000);
          }
        }).catch(function (err) {
          return console.log(err);
        });
      } else {
        console.log('мы здесь');
        this.showFlashMsg(res.code, res.msg);
        document.querySelector('.new-test-form__title').scrollIntoView({
          behavior: 'smooth'
        });

        if (res.questionId) {
          for (var i = 0; i < this.$children.length; i++) {
            if (this.$children[i].id === res.questionId) {
              (function () {
                var elem = _this2.$children[i].$el;
                elem.scrollIntoView({
                  behavior: 'smooth'
                });
                elem.classList.add('question_error');
                setTimeout(function () {
                  elem.classList.remove('question_error');
                }, 8000);
              })();
            }
          }
        }
      }
    }
  },
  // При создании компонента, проверяем localStorage и если в нем есть объект тест выводим его данные
  created: function created() {
    if (localStorage.getItem('test')) {
      var test = JSON.parse(localStorage.getItem('test'));
      this.fetchTestDb(test);
    }
  },
  // Перед уходом очищаем localStorage;
  beforeRouteLeave: function beforeRouteLeave(to, from, next) {
    localStorage.getItem('test') ? localStorage.removeItem('test') : false;
    next();
  }
};
exports.default = _default;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _single = _interopRequireDefault(__webpack_require__(65));

var _multiple = _interopRequireDefault(__webpack_require__(69));

var _string = _interopRequireDefault(__webpack_require__(73));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  props: ['questiontype', 'questiontext', 'questionid', 'questiondbid', 'questionvars'],
  components: {
    'single': _single.default,
    'multiple': _multiple.default,
    'string': _string.default
  },
  data: function data() {
    return {
      questionType: this.questiontype ? this.questiontype : 1,
      id: this.questionid,
      db_id: this.questiondbid,
      description: this.questiontext ? this.questiontext : '',
      // Вопросы с одним вариантом
      single: {
        vars: [{
          text: '',
          isRight: false,
          id: 1
        }],
        nextVarId: 2
      },
      // Вопросы с несколькими вариантами ответа
      multiple: {
        vars: [{
          text: '',
          isRight: false,
          id: 1
        }],
        nextVarId: 2
      },
      //Вопрос с вводом строки
      string: {
        answer: ''
      }
    };
  },
  methods: {
    updateDescription: function updateDescription() {
      this.updateQuestionVars();
    },
    changeType: function changeType(e) {
      this.questionType = +e.target.value;
      this.single = {
        vars: [{
          text: '',
          isRight: false,
          id: 1
        }],
        nextVarId: 2
      };
      this.multiple = {
        vars: [{
          text: '',
          isRight: false,
          id: 1
        }],
        nextVarId: 2
      };
    },

    /*Вопросы с одним варианторм*/
    //Добавляем вариант ответа
    singleAddVar: function singleAddVar() {
      this.single.nextVarId++;
      this.single.vars.push({
        text: '',
        isRight: false,
        id: this.single.nextVarId
      });
    },
    // Удаление вариантами
    removeVarHandler: function removeVarHandler(id) {
      var index;

      for (var i = 0; i < this.single.vars.length; i++) {
        if (this.single.vars[i].id === id) index = i;
      }

      this.single.vars.splice(index, 1);
      this.updateQuestionVars();
    },
    //Обновляем текст варианта
    singleUpdateVarHandler: function singleUpdateVarHandler(id, text) {
      var index;

      for (var i = 0; i < this.single.vars.length; i++) {
        if (this.single.vars[i].id === id) index = i;
      }

      this.single.vars[index].text = text;
      this.updateQuestionVars();
    },
    //Выбираем правильный вариант вопроса
    singleUpdateRightVarHandler: function singleUpdateRightVarHandler(index) {
      var _this = this;

      this.$children.forEach(function (v, i) {
        if (i === index) {
          v.isRight ? v.isRight = false : v.isRight = true;
          _this.single.vars[index].isRight ? _this.single.vars[index].isRight = false : _this.single.vars[index].isRight = true;
        } else {
          v.isRight = false;
          _this.single.vars[i].isRight = false;
        }
      });
      this.updateQuestionVars();
    },

    /*Вопросы с несолькими вариантами*/
    //Добавляем вариант ответа
    multipleAddVar: function multipleAddVar() {
      this.multiple.vars.push({
        text: 'Вариант ответа',
        isRight: false,
        id: this.multiple.nextVarId
      });
      this.multiple.nextVarId++;
    },
    // Удаляем вариант ответа
    multipleRemoveVarHandler: function multipleRemoveVarHandler(id) {
      var index;

      for (var i = 0; i < this.multiple.vars.length; i++) {
        if (this.multiple.vars[i].id === id) index = i;
      }

      this.multiple.vars.splice(index, 1);
      this.updateQuestionVars();
    },
    multipleUpdateVarHandler: function multipleUpdateVarHandler(id, text) {
      var index;

      for (var i = 0; i < this.multiple.vars.length; i++) {
        if (this.multiple.vars[i].id === id) index = i;
      }

      this.multiple.vars[index].text = text;
      this.updateQuestionVars();
    },
    //Выбираем правильный вариант вопроса
    multipleUpdateRightVarHandler: function multipleUpdateRightVarHandler(index) {
      var _this2 = this;

      this.$children.forEach(function (v, i) {
        if (i === index) {
          v.isRight ? v.isRight = false : v.isRight = true;
          _this2.multiple.vars[index].isRight ? _this2.multiple.vars[index].isRight = false : _this2.multiple.vars[index].isRight = true;
        }
      });
      this.updateQuestionVars();
    },

    /*Вопрос - строка*/
    stringUpdateVarHandler: function stringUpdateVarHandler(text) {
      this.string.answer = text;
      this.updateQuestionVars();
    },
    //Обновляем варианты в объекте вопроса в тесте
    updateQuestionVars: function updateQuestionVars() {
      switch (this.questionType) {
        case 1:
          this.$emit('udpate-question', this.id, this.questionType, this.description, this.single.vars);
          break;

        case 2:
          this.$emit('udpate-question', this.id, this.questionType, this.description, this.multiple.vars);
          break;

        case 3:
          this.$emit('udpate-question', this.id, this.questionType, this.description, this.string.answer);
          break;

        default:
      }
    },
    //Событие удаления вопроса
    deleteQuestion: function deleteQuestion() {
      this.$emit('delete-question', this.id);
    }
  },
  created: function created() {
    switch (this.questiontype) {
      case 1:
        this.single.vars = this.questionvars;
        this.single.nextVarId = this.questionvars[this.questionvars.length - 1] ? this.questionvars[this.questionvars.length - 1].id : 1;
        break;

      case 2:
        this.multiple.vars = this.questionvars;
        this.multiple.nextVarId = this.questionvars[this.questionvars.length - 1] ? this.questionvars[this.questionvars.length - 1].id : 1;
        break;

      case 3:
        this.string.answer = this.questionvars;
        break;
    }
  }
};
exports.default = _default;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  props: ['text', 'status', 'id'],
  data: function data() {
    return {
      varText: this.text,
      isRight: this.status,
      questionId: this.id
    };
  },
  methods: {
    //Удаление варианта
    deleteVar: function deleteVar(e) {
      this.$emit('removeVar', this.id);
    },
    // Обнавляем текст варианта
    updateInfo: function updateInfo() {
      this.$emit('updateVar', this.id, this.varText);
    },
    // Обнавляем статус правильного ответа варианта
    rightVar: function rightVar() {
      var index = Array.prototype.indexOf.call(this.$el.parentNode.childNodes, this.$el);
      this.$emit('updateRightVar', index);
    }
  }
};
exports.default = _default;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  props: ['text', 'status', 'id'],
  data: function data() {
    return {
      varText: this.text ? this.text : '',
      placeholderText: this.text,
      isRight: this.status,
      questionId: this.id
    };
  },
  methods: {
    //Удаление варианта
    deleteVar: function deleteVar(e) {
      this.$emit('removeVar', this.id);
    },
    // Обнавляем текст варианта
    updateInfo: function updateInfo() {
      this.$emit('updateVar', this.id, this.varText);
    },
    // Обнавляем статус правильного ответа варианта
    rightVar: function rightVar() {
      var index = Array.prototype.indexOf.call(this.$el.parentNode.childNodes, this.$el);
      this.$emit('updateRightVar', index);
    }
  }
};
exports.default = _default;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//
//
//
//
//
//
//
//
//
var _default = {
  props: ['text'],
  data: function data() {
    return {
      varText: this.text ? this.text : ''
    };
  },
  methods: {
    updateInfo: function updateInfo() {
      this.$emit('updateVar', this.varText);
    }
  }
};
exports.default = _default;

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_flashmessage_vue__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_flashmessage_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_flashmessage_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_flashmessage_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_flashmessage_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7367be9d_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_flashmessage_vue__ = __webpack_require__(80);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(78)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_flashmessage_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7367be9d_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_flashmessage_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/vue-comp/interface/flashmessage.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7367be9d", Component.options)
  } else {
    hotAPI.reload("data-v-7367be9d", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//
//
//
//
//
//
//
//
//
var _default = {
  props: ['code', 'text'],
  data: function data() {
    return {
      message: this.text,
      status: this.code
    };
  },
  computed: {
    //Всплывающие сообщения
    flashMsgClass: function flashMsgClass() {
      return {
        'test-flasgMesg': true,
        'test-flasgMesg_error': this.status == 1,
        'test-flasgMesg_warn': this.status == 2,
        'test-flasgMesg_succes': this.status == 3
      };
    }
  }
};
exports.default = _default;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//
//
//
//
//
//
//
//
//
//
//
var _default = {};
exports.default = _default;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _axios = _interopRequireDefault(__webpack_require__(3));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  props: ['description', 'testtitle', 'status', 'imglink', 'testid', 'respondents'],
  data: function data() {
    return {
      testTitle: this.testtitle,
      testDescription: this.description,
      testStatus: this.status,
      testId: this.testid,
      testImage: this.imglink ? this.imglink : 'img/default_test.svg',
      testRespondents: this.respondents,
      testLink: 'testLink-' + this.testid
    };
  },
  computed: {
    testLinkText: function testLinkText() {
      return window.location.origin + '/exec?' + encodeURIComponent(btoa('test_id=' + +this.testid));
    }
  },
  methods: {
    // Событие - показать ссылку на тест
    showLink: function showLink() {
      var elem = document.querySelector('.testLink-' + this.testId);
      elem.value = window.location.origin + '/exec?' + encodeURIComponent(btoa('test_id=' + +this.testid));
      elem.select();
      document.execCommand('copy');
      var msg = 'Ссылка скопирована в буфер обмена';
      this.$emit('copy-link', msg);
    },
    // Событие - показать респондентов, которые прошли данный тест
    showResp: function showResp() {
      console.log(this.testRespondents);
    },
    // Событие - редактирование теста
    editHandler: function editHandler() {
      this.$emit('edit-test-new', this.testId);
    },
    // Событие - удаление теста
    deleteHandler: function deleteHandler() {
      var _this = this;

      if (window.confirm('Вы точто хотите удалить тест?')) {
        var query = this.testId;

        _axios.default.get("php/deletetest.php?test_id=".concat(query)).then(function (res) {
          console.log('Server response after test deletion');
          console.log(res.data);

          if (res.data.status) {
            var msg = 'Тест успешно удален из базы данных';

            _this.$emit('delete-info', 3, msg);
          } else {
            var _msg = 'Ошибка базы данных, попробуйте позже';

            _this.$emit('delete-info', 1, _msg);
          }
        }).catch(function (err) {
          return console.log(err);
        });
      }
    },
    showTest: function showTest(e) {
      this.$emit('show-test', this.testId);
    }
  }
};
exports.default = _default;

/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_pop_up_test_vue__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_pop_up_test_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_pop_up_test_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_pop_up_test_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_pop_up_test_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_151a5f1c_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_pop_up_test_vue__ = __webpack_require__(99);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(90)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_pop_up_test_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_151a5f1c_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_pop_up_test_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/vue-comp/interface/pop-up-test.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-151a5f1c", Component.options)
  } else {
    hotAPI.reload("data-v-151a5f1c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _popUpQuestion = _interopRequireDefault(__webpack_require__(95));

var _axios = _interopRequireDefault(__webpack_require__(3));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  props: ['testtite', 'description', 'imglink', 'anonym', 'time', 'status', 'testquestions', 'testid'],
  components: {
    'question-item': _popUpQuestion.default
  },
  data: function data() {
    return {
      testTitle: this.testtite,
      testDescription: this.description,
      testImage: this.imglink ? this.imglink : 'img/default_test.svg',
      testStatus: +this.status ? true : false,
      testId: this.testid,
      testLink: window.location.origin + '/exec?' + encodeURIComponent(btoa('test_id=' + +this.testid)),
      //кодируем запрос в формат base64
      testOptions: {
        timeLimit: +this.time !== 0 ? true : false,
        time: +this.time,
        anonym: +this.status ? true : false
      },
      questions: this.testquestions
    };
  },
  methods: {
    closeWindow: function closeWindow() {
      // console.log(this.testId);
      this.$emit('close-window');
    },
    edit: function edit() {
      this.$emit('edit-test', this.testId);
    },
    //Удаляем тест
    deleteTest: function deleteTest() {
      var _this = this;

      if (window.confirm('Вы точто хотите удалить тест?')) {
        var query = this.testId;

        _axios.default.get("php/deletetest.php?test_id=".concat(query)).then(function (res) {
          if (res.data.success) {
            var msg = 'Тест успешно удален из базы данных';

            _this.$emit('delete-test', 3, msg);

            _this.closeWindow();
          } else {
            var _msg = 'Ошибка базы данных, попробуйте позже';

            _this.$emit('delete-test', 3, _msg);

            _this.closeWindow();
          }
        }).catch(function (err) {
          return console.log(err);
        });
      }
    },
    //Публикуем тест
    publish: function publish() {
      var _this2 = this;

      var query = this.testId;

      _axios.default.get("php/changeteststatus.php?test_id=".concat(query)).then(function (res) {
        if (res.data.success) {
          var msg = 'Тест успешно опубликован';

          _this2.$emit('update-test', 3, msg);

          _this2.closeWindow();
        } else {
          var _msg2 = 'Ошибка базы данных, попробуйте позже';

          _this2.$emit('update-test', 1, _msg2);

          _this2.closeWindow();
        }
      }).catch(function (err) {
        return console.log(err);
      });
    }
  },
  created: function created() {
    document.body.style.overflow = 'hidden';
  },
  destroyed: function destroyed() {
    document.body.style.overflow = 'auto';
  }
};
exports.default = _default;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  props: ['qsttitle', 'vars', 'answer', 'qsttype', 'useranswer', 'checkstatus'],
  data: function data() {
    return {
      title: this.qsttitle,
      variants: this.vars,
      right: this.answer,
      type: +this.qsttype,
      check: this.checkstatus,
      userAnswers: this.useranswer
    };
  },
  created: function created() {
    if (this.type == 1 || this.type == 2) {
      this.right = this.answer.length > 0 ? this.answer.split(',') : [this.anwer];
    }
  }
};
exports.default = _default;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _testMenu = _interopRequireDefault(__webpack_require__(106));

var _loading = _interopRequireDefault(__webpack_require__(6));

var _variants = _interopRequireDefault(__webpack_require__(110));

var _popUpExec = _interopRequireDefault(__webpack_require__(114));

var _axios = _interopRequireDefault(__webpack_require__(3));

var _auth = _interopRequireDefault(__webpack_require__(12));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  components: {
    'test-menu': _testMenu.default,
    'loading': _loading.default,
    'variants': _variants.default,
    'pop-up': _popUpExec.default
  },
  // Когда компонент создан, получаем тест, проверяем, аторизацию пользвателя
  created: function created() {
    this.fetchData();
  },
  data: function data() {
    return {
      test: null,
      questions: null,
      authorized: false,
      loaded: false,
      userProgress: {
        currentQstId: 0
      },
      currentQstType: 1,
      answers: [],
      timeStart: 0,
      time: 60,
      timeLimit: false,
      timeLeft: 60,
      popUp: false,
      testResults: {}
    };
  },
  computed: {
    //Описание вопроса в зависимости от типа
    questionDescr: function questionDescr() {
      switch (+this.questions[this.userProgress.currentQstId].question_type_id) {
        case 1:
          return 'Выберите один вариант ответа';
          break;

        case 2:
          return 'Выберите несколько вариантов';
          break;

        case 3:
          return 'Напишите вариант ответа';
          break;

        default:
      }
    }
  },
  methods: {
    //Получаем данные с сервер, сверяем авторизацию пользователя и возможность анонимного прохождения
    fetchData: function fetchData() {
      var _this = this;

      var query = "?" + atob(decodeURIComponent(window.location.search.slice(1)));

      _auth.default.checkUser().then(function (res) {
        var auth = res; //Если тест уже есть в localStorage берем данные от туда, в противном случае, загружаем их с сервера

        _axios.default.get("php/getexectest.php".concat(query)).then(function (res) {
          console.log(res);
          var date = new Date();
          var testId = +query.slice(9);
          var testData = JSON.parse(localStorage.getItem('current_test')); // Устанавливани все параметры теста

          _this.test = res.data.test;
          _this.questions = res.data.test.questions;
          _this.timeStart = testData && +testData.test_db_id == testId ? testData.time_start : date.getTime();
          _this.answers = testData && +testData.test_db_id == testId ? testData.answers : [];
          _this.currentQstType = testData && +testData.test_db_id == testId ? testData.currentQstType : +res.data.test.questions[0].question_type_id;
          _this.currentQstId = testData && +testData.test_db_id == testId ? testData.currentQstId : 0;
          _this.loaded = true;
          setTimeout(function () {
            var id = _this.currentQstId + 1;
            var elem = document.getElementById("qst_".concat(id));
            elem.click();
          }, 0);

          if (+res.data.test.test_anonym == 0 && !auth) {
            console.log('Просим авторизоваться');
            _this.authorized = false;
            window.localStorage.setItem('query', window.location.search.slice(1));
            setTimeout(function () {
              _this.$router.replace('/auth');
            }, 8000);
          } else {
            console.log('Показываем тест');
            _this.authorized = true; // Если тест на время, то будет отсчитывать время

            if (+res.data.test.test_time > 0) {
              console.log('Это тест на время');
              _this.timeLimit = true;
              _this.time = res.data.test.test_time;

              var _date = new Date(_this.timeStart); //Проверка времени


              var timeStart = _date.getMinutes();

              var interval = setInterval(function () {
                var newDate = new Date();
                var timeNow = newDate.getMinutes();
                var timeDifference = timeNow - timeStart;
                var minutes = new Date(timeDifference * 1000);
                _this.timeLeft = _this.time - timeDifference;

                if (_this.timeLeft <= 0) {
                  console.log('Время теста истекло, ваши данные отправлены на сервер');
                  window.alert('Время теста истекло, ваши данные отправлены на сервер');

                  _this.sendTestHander(true);

                  clearInterval(interval);
                }
              }, 1000);
            }
          }
        }).catch(function (err) {
          return console.log(err);
        });
      }).catch(function (err) {
        return console.log(err);
      });
    },
    //Навигация по вопросам
    changeQst: function changeQst(e) {
      var elemId = e.target.id;
      var children = e.target.parentElement.children;
      e.target.classList.contains('active') ? false : e.target.classList.add('active');

      for (var i = 0; i < children.length; i++) {
        if (children[i].id !== elemId) {
          children[i].classList.contains('active') ? children[i].classList.remove('active') : false;
        }
      }

      this.userProgress.currentQstId = +e.target.id.slice(4) - 1;
      this.currentQstType = +this.test.questions[this.userProgress.currentQstId].question_type_id;
      this.saveLocalStorage();
      console.log(this.answers);
    },
    mobileNavQst: function mobileNavQst(ind) {
      if (ind < 0) {
        var elem = document.querySelector('.active').previousSibling;

        if (elem) {
          elem.click();
        }
      } else {
        var _elem = document.querySelector('.active').nextSibling;

        if (_elem) {
          _elem.click();
        }
      }
    },
    //Обновляем информацию ответов и сохраняем объект теста в localStorage
    updateAnswerHandler: function updateAnswerHandler(answers) {
      this.answers = answers;
      this.saveLocalStorage();
    },
    saveLocalStorage: function saveLocalStorage() {
      var date = new Date();
      var test = {
        test_db_id: this.test.test_id,
        test: this.test,
        anonym: this.test.test_anonym,
        token: this.test.token ? this.test.token : btoa(date.getTime()),
        answers: this.answers,
        time_start: this.timeStart,
        currentQstType: this.currentQstType,
        currentQstId: this.userProgress.currentQstId
      };
      localStorage.setItem('current_test', JSON.stringify(test));
    },
    // Отправляем тест
    sendTestHander: function sendTestHander(autoEnd) {
      var _this2 = this;

      localStorage.removeItem('current_test');
      var date = new Date();
      var test = {
        test_db_id: this.test.test_id,
        anonym: this.test.test_anonym,
        token: this.token ? this.token : btoa(date.getTime()),
        answers: this.answers
      };
      console.log('test');
      console.log(test); // return test;

      if (!autoEnd && window.confirm('Вы готовы отправить ответы на проверку?')) {
        _axios.default.post('php/saveexectest.php', test).then(function (res) {
          console.log(res);
          _this2.testResults = res.data;
          _this2.popUp = true;
        }).catch(function (err) {
          console.log(err);
        });
      } else {
        _axios.default.post('php/saveexectest.php', test).then(function (res) {
          console.log(res);
          _this2.testResults = res.data;
          _this2.popUp = true;
        }).catch(function (err) {
          console.log(err);
        });
      }
    }
  },
  // Перед тем, как пользователь попадет на страницу, проверим, установлено ли id вопроса
  beforeRouteEnter: function beforeRouteEnter(to, from, next) {
    var check = decodeURIComponent(window.location.search.slice(1));

    if (/test_id/.test(atob(check))) {
      next();
    } else {
      window.location.pathname = '/tester';
    }
  }
};
exports.default = _default;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  props: ['testname', 'testdescription'],
  data: function data() {
    return {
      title: this.testname,
      description: this.testdescription
    };
  },
  methods: {
    sendTest: function sendTest() {
      this.$emit('send-test');
    }
  }
};
exports.default = _default;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  props: ['type', 'questions', 'currentqst', 'answersarr'],
  data: function data() {
    return {
      qstType: this.type,
      navId: this.currentqst,
      qstVars: this.questions[this.currentqst].vars,
      questionsArr: this.questions,
      answers: this.answersarr,
      qstId: undefined
    };
  },
  // mounted() {
  //     this.answers.forEach( (v,i,a) => {
  //         let dbIndex = v.questionDbId;
  //         let elements = document.querySelectorAll(`input[type="checkbox"][data-questionid="${dbIndex}"]`) || document.querySelectorAll(`input[type="radio"][data-questionid="${dbIndex}"]`);
  //         console.log(elements);
  //     });
  // },
  methods: {
    getMultipleAnswers: function getMultipleAnswers(id) {
      var answer = '';
      var vars = document.querySelectorAll("input[name=\"multiple_var_".concat(id, "\"]"));

      for (var i = 0; i < vars.length; i++) {
        if (vars[i].checked) {
          answer.length == 0 ? answer += vars[i].value : answer += ',' + vars[i].value;
        }
      }

      return answer;
    },
    // Обновляем информацию о вопросе
    updateAnswer: function updateAnswer(e) {
      var check = true;
      var answer = {
        answer: this.qstType !== 2 ? e.target.value : this.getMultipleAnswers(+e.target.getAttribute('data-questionid')),
        questionDbId: +e.target.getAttribute('data-questionid')
      };
      this.answers.forEach(function (v, i, a) {
        if (v.questionDbId == answer.questionDbId) {
          a[i] = answer;
          check = false;
        }
      });
      check ? this.answers.push(answer) : false;
      this.$emit('update-answer', this.answers);
    },
    //Устанавливани значение чекд в зависимости от типа вопроса
    updateInputs: function updateInputs() {
      var _this = this;

      switch (this.qstType) {
        case 1:
          setTimeout(function () {
            var elements;
            var answer;

            _this.answers.forEach(function (v, i, a) {
              if (document.querySelectorAll(["input[type=\"radio\"][data-questionid=\"".concat(v.questionDbId, "\"]")]).length > 0) {
                elements = document.querySelectorAll(["input[type=\"radio\"][data-questionid=\"".concat(v.questionDbId, "\"]")]);
                answer = v.answer;
              }
            });

            if (elements && elements.length > 0) {
              for (var i = 0; i < elements.length; i++) {
                elements[i].value == answer ? elements[i].checked = true : elements[i].checked = false;
              }
            }
          }, 100);
          break;

        case 2:
          setTimeout(function () {
            var elements;
            var answer;

            _this.answers.forEach(function (v, i, a) {
              if (document.querySelectorAll(["input[type=\"checkbox\"][data-questionid=\"".concat(v.questionDbId, "\"]")]).length > 0) {
                elements = document.querySelectorAll(["input[type=\"checkbox\"][data-questionid=\"".concat(v.questionDbId, "\"]")]);
                answer = v.answer;
              }
            });

            if (elements && elements.length > 0) {
              for (var i = 0; i < elements.length; i++) {
                answer.indexOf(elements[i].value) >= 0 ? elements[i].checked = true : elements[i].checked = false;
              }
            }
          }, 100);
          break;

        case 3:
          setTimeout(function () {
            var elements;
            var answer;

            _this.answers.forEach(function (v, i, a) {
              if (document.querySelectorAll("input[type=\"text\"][data-questionid=\"".concat(v.questionDbId, "\"]")).length > 0) {
                elements = document.querySelectorAll("input[type=\"text\"][data-questionid=\"".concat(v.questionDbId, "\"]"));
                elements[0].value = v.answer;
              }
            });
          }, 100);
          break;

        default:
      }
    }
  },
  // эта функция запускается при любом изменении навинации
  watch: {
    type: function type(data) {
      this.qstType = data;
      this.updateInputs();
    },
    currentqst: function currentqst(data) {
      this.qstVars = this.questionsArr[data].vars;
      this.qstId = this.questionsArr[data].question_id;
      this.updateInputs();
    }
  }
};
exports.default = _default;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  props: ['results', 'timestart'],
  data: function data() {
    return {
      res: this.results,
      time: this.timestart
    };
  },
  computed: {
    right: function right() {
      var right = 0;
      this.res.result.answers.forEach(function (v, i, a) {
        if (v.result) right++;
      });
      return right;
    },
    wrong: function wrong() {
      var wrong = 0;
      this.res.result.answers.forEach(function (v, i, a) {
        if (!v.result) wrong++;
      });
      return wrong;
    },
    timeLeft: function timeLeft() {
      var end = new Date(+this.res.time_end);
      var start = new Date(this.time);
      return end.getMinutes() - start.getMinutes();
    }
  },
  methods: {
    endTest: function endTest() {
      localStorage.clear();
      this.$router.replace('/tester');
    }
  },
  mounted: function mounted() {
    console.log('mounted');
    console.log(this.res);
  }
};
exports.default = _default;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sideMenu = _interopRequireDefault(__webpack_require__(4));

var _loading = _interopRequireDefault(__webpack_require__(6));

var _respondentItem = _interopRequireDefault(__webpack_require__(122));

var _popUpTest = _interopRequireDefault(__webpack_require__(27));

var _axios = _interopRequireDefault(__webpack_require__(3));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  components: {
    'side-menu': _sideMenu.default,
    'loading-indicator': _loading.default,
    'respondent-item': _respondentItem.default,
    'pop-up': _popUpTest.default
  },
  data: function data() {
    return {
      loading: false,
      testsArr: null,
      currentTest: null,
      popUp: false
    };
  },
  methods: {
    fetchData: function fetchData() {
      var _this = this;

      this.loading = true;

      _axios.default.get('php/getstats.php').then(function (res) {
        // console.log(res);
        _this.loading = false;
        _this.testsArr = res.data.tests; // console.log(this.testsArr);
      }).catch(function (err) {
        _this.loading = false;
        console.log(err);
      });
    },
    //Поиск по тесту
    searchTest: function searchTest(e) {
      console.log(e.target.value);
      var pattern = new RegExp(e.target.value, 'i');
      var elemList = document.querySelectorAll('.resondents-test-item h2');

      for (var i = 0; i < elemList.length; i++) {
        console.log(elemList[i].innerHTML);
        console.log(i);

        if (!pattern.test(elemList[i].innerHTML)) {
          elemList[i].parentNode.classList.contains('resondents-test-item__hide') ? false : elemList[i].parentNode.classList.add('resondents-test-item__hide');
        } else {
          elemList[i].parentNode.classList.contains('resondents-test-item__hide') ? elemList[i].parentNode.classList.remove('resondents-test-item__hide') : false;
        }
      }
    },
    //Разворачиваем список респондентов
    showListHandler: function showListHandler(e) {
      e.target.parentNode.classList.toggle('resondents-test-item__active');
      e.target.classList.toggle('active');
    },
    //Показываем всплывающее окно с подробностями о результатах пользователя
    showTryInfo: function showTryInfo(id, answers) {
      var _this2 = this;

      // console.log(id);
      // console.log(answers);
      _axios.default.get("php/gettest.php?test_id=".concat(id)).then(function (res) {
        var data = res.data.test;
        data.questions.forEach(function (val, ind, arr) {
          answers.forEach(function (v, i, a) {
            if (val.question_id === v.question_id) {
              data.questions[ind].user_answer = v.user_answer;
              data.questions[ind].check_status = v.result;
            }
          });
        });
        _this2.currentTest = data;
        _this2.popUp = true;
        console.log(data);
      }).catch(function (err) {
        return console.log(err);
      });
    },
    //Закрываем всплывающее окно
    closePopUp: function closePopUp() {
      this.popUp = false;
    }
  },
  created: function created() {
    this.fetchData();
  }
};
exports.default = _default;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  props: ['result'],
  data: function data() {
    return {
      results: this.result,
      rightAnswers: 0,
      falseAnswers: 0,
      percents: 0,
      testAnswerId: this.result.test_answer_id,
      testId: this.result.test_answer_test_id,
      answers: this.result.result.answers
    };
  },
  computed: {
    //Email пользователя
    userEmail: function userEmail() {
      return this.results.user_email ? this.results.user_email : 'Anonym';
    }
  },
  methods: {
    //показываем окно с информацией о тесте
    showTestHander: function showTestHander() {
      // console.log(this.testAnswerId + ' - testAnswerId');
      // console.log(this.testId + ' - testId');
      // console.log(this.answers);
      this.$emit('show-info', this.testId, this.answers);
    }
  },
  created: function created() {
    // console.log(this.results.result);
    for (var i = 0; i < this.results.result.answers.length; i++) {
      this.results.result.answers[i].result ? this.rightAnswers++ : this.falseAnswers++;
    }

    this.percents = Math.round(this.rightAnswers / this.results.result.answers.length * 100);
  }
};
exports.default = _default;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sideMenu = _interopRequireDefault(__webpack_require__(4));

var _loading = _interopRequireDefault(__webpack_require__(6));

var _statItem = _interopRequireDefault(__webpack_require__(130));

var _axios = _interopRequireDefault(__webpack_require__(3));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  components: {
    'side-menu': _sideMenu.default,
    'loading-indicator': _loading.default,
    'stat-item': _statItem.default
  },
  data: function data() {
    return {
      loading: false,
      testsArr: null
    };
  },
  methods: {
    fetchData: function fetchData() {
      var _this = this;

      this.loading = true;

      _axios.default.get('php/getstats.php').then(function (res) {
        _this.loading = false;
        _this.testsArr = res.data.tests;
        console.log(res);
      }).catch(function (err) {
        _this.loading = false;
        console.log(err);
      });
    }
  },
  created: function created() {
    this.fetchData();
  }
};
exports.default = _default;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  props: ['tries'],
  data: function data() {
    return {
      respondents: this.tries,
      testTitle: this.tries.test_name
    };
  },
  computed: {
    respondentsNum: function respondentsNum() {
      return this.respondents.tries.length;
    },
    rightAnswers: function rightAnswers() {
      var right = 0;
      this.respondents.tries.forEach(function (val, ind, arr) {
        val.result.answers.forEach(function (v, i, a) {
          if (v.result) right++;
        });
      });
      return right;
    },
    wrongAnswers: function wrongAnswers() {
      var wrong = 0;
      this.respondents.tries.forEach(function (val, ind, arr) {
        val.result.answers.forEach(function (v, i, a) {
          if (!v.result) wrong++;
        });
      });
      return wrong;
    }
  }
};
exports.default = _default;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _variables = _interopRequireDefault(__webpack_require__(7));

var _style = _interopRequireDefault(__webpack_require__(41));

var _vue = _interopRequireDefault(__webpack_require__(43));

var _vueRouter = _interopRequireDefault(__webpack_require__(45));

var _auth = _interopRequireDefault(__webpack_require__(12));

var _smoothscrollMin = _interopRequireDefault(__webpack_require__(46));

var _PromiseMin = _interopRequireDefault(__webpack_require__(47));

var _login = _interopRequireDefault(__webpack_require__(48));

var _tester = _interopRequireDefault(__webpack_require__(54));

var _newTest = _interopRequireDefault(__webpack_require__(16));

var _exec = _interopRequireDefault(__webpack_require__(101));

var _respondents = _interopRequireDefault(__webpack_require__(119));

var _stats = _interopRequireDefault(__webpack_require__(127));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.__forceSmoothScrollPolyfill__ = true; // компоненты

// Маршруты
_vue.default.use(_vueRouter.default);

var router = new _vueRouter.default({
  routes: [{
    path: '/',
    component: _tester.default,
    meta: {
      requiredAuth: true
    }
  }, {
    path: '/auth',
    component: _login.default
  }, {
    path: '/tester',
    component: _tester.default,
    meta: {
      requiredAuth: true
    }
  }, {
    path: '/newtest',
    component: _newTest.default,
    meta: {
      requiredAuth: true
    }
  }, {
    path: '/respondents',
    component: _respondents.default,
    meta: {
      requiredAuth: true
    }
  }, {
    path: '/stats',
    component: _stats.default,
    meta: {
      requiredAuth: true
    }
  }, {
    path: '/exec',
    component: _exec.default
  }],
  mode: 'history'
});
router.beforeEach(function (to, from, next) {
  if (to.meta.requiredAuth) {
    _auth.default.checkUser().then(function (res) {
      console.log(res);

      if (!res) {
        router.push('/auth');
      } else {
        next();
      }
    });
  } else {
    next();
  }
});
var app = new _vue.default({
  router: router,
  data: {
    user: {
      authinticate: false
    }
  },
  components: {
    'login': _login.default,
    'tester': _tester.default,
    'new-test': _newTest.default,
    'statistic': _stats.default
  },
  methods: {
    //Событие успешной авторизации или регистрации
    loginHandler: function loginHandler() {
      console.log('вот тут должна сработать переадресация');
      this.authinticate = true; // DELETE

      localStorage.setItem('tester_token', true); // DELETEEND

      router.push({
        path: '/tester'
      });
    }
  }
}).$mount('#app');

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ":root{font-family:Marta;font-size:16px;line-height:1.4}", ""]);

// exports


/***/ }),
/* 40 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(42);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(8)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js??ref--3-1!../../node_modules/postcss-loader/lib/index.js!./style.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js??ref--3-1!../../node_modules/postcss-loader/lib/index.js!./style.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports
exports.push([module.i, "@import url(http://fonts.fontstorage.com/import/marta.css);", ""]);

// module
exports.push([module.i, ":root{font-family:Marta;font-size:16px;line-height:1.4}*,:after,:before{box-sizing:border-box}button:focus,input:focus,select:focus,textarea:focus{outline:none}input{font-family:marta}h1,h2,h3,h4,h5,h6{margin:0;padding:0}body{margin:0}a{color:#092e64;text-decoration:none}ul{margin:0;padding:0}.new-test-nav{z-index:101;position:fixed;top:0;left:0;width:100%;padding:20px 0;padding-left:calc(4.16667vw * 6);background-color:hsla(0,0%,100%,.9);box-shadow:0 0 4px 0 rgba(0,0,0,.4)}.new-test-nav li{list-style:none;display:inline-block;opacity:1;min-width:calc(4.16667vw * 3);text-align:center;transition:opacity .2s ease-in-out}.new-test-nav li:hover{opacity:1}.new-test-nav li:last-child{padding-left:40px}.new-test-nav li a{font-weight:700;display:block;border-radius:3px;background-color:#092e64;color:#fff;padding:10px;transition:all .2s ease-in-out}.new-test-nav li a:hover{box-shadow:1px 1px 9px rgba(0,0,0,.4)}.test-flasgMesg{z-index:210}@media screen and (max-width:812px){h1,h2,h3,h4,h5,h6,p{text-align:center}}", ""]);

// exports


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, setImmediate) {/*!
 * Vue.js v2.5.13
 * (c) 2014-2017 Evan You
 * Released under the MIT License.
 */
(function (global, factory) {
	 true ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Vue = factory());
}(this, (function () { 'use strict';

/*  */

var emptyObject = Object.freeze({});

// these helpers produces better vm code in JS engines due to their
// explicitness and function inlining
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value e.g. [object Object]
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if a attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind, faster than native
 */
function bind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }
  // record original fn length
  boundFn._length = fn.length;
  return boundFn
}

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/**
 * Return same value
 */
var identity = function (_) { return _; };

/**
 * Generate a static keys string from compiler modules.
 */
function genStaticKeys (modules) {
  return modules.reduce(function (keys, m) {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var SSR_ATTR = 'data-server-rendered';

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured'
];

/*  */

var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = /[^\w.$]/;
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */


// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;

var supportsPassive = false;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = (function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

{
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm || {};
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */


var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
var targetStack = [];

function pushTarget (_target) {
  if (Dep.target) { targetStack.push(Dep.target); }
  Dep.target = _target;
}

function popTarget () {
  Dep.target = targetStack.pop();
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode, deep) {
  var componentOptions = vnode.componentOptions;
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.isCloned = true;
  if (deep) {
    if (vnode.children) {
      cloned.children = cloneVNodes(vnode.children, true);
    }
    if (componentOptions && componentOptions.children) {
      componentOptions.children = cloneVNodes(componentOptions.children, true);
    }
  }
  return cloned
}

function cloneVNodes (vnodes, deep) {
  var len = vnodes.length;
  var res = new Array(len);
  for (var i = 0; i < len; i++) {
    res[i] = cloneVNode(vnodes[i], deep);
  }
  return res
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
].forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However when passing down props,
 * we don't want to force conversion because the value may be a nested value
 * under a frozen data structure. Converting it would defeat the optimization.
 */
var observerState = {
  shouldConvert: true
};

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    var augment = hasProto
      ? protoAugment
      : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i], obj[keys[i]]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src, keys) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    observerState.shouldConvert &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ("development" !== 'production' && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    "development" !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    "development" !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
{
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      "development" !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
    "development" !== 'production' && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!/^[a-zA-Z][\w-]*$/.test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'can only contain alphanumeric characters and the hyphen, ' +
      'and must start with a letter.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);
  var extendsFrom = child.extends;
  if (extendsFrom) {
    parent = mergeOptions(parent, extendsFrom, vm);
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm);
    }
  }
  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ("development" !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */

function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // handle boolean props
  if (isType(Boolean, prop.type)) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (!isType(String, prop.type) && (value === '' || value === hyphenate(key))) {
      value = true;
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldConvert = observerState.shouldConvert;
    observerState.shouldConvert = true;
    observe(value);
    observerState.shouldConvert = prevShouldConvert;
  }
  {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ("development" !== 'production' && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }
  if (!valid) {
    warn(
      "Invalid prop: type check failed for prop \"" + name + "\"." +
      " Expected " + (expectedTypes.map(capitalize).join(', ')) +
      ", got " + (toRawType(value)) + ".",
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isType (type, fn) {
  if (!Array.isArray(fn)) {
    return getType(fn) === getType(type)
  }
  for (var i = 0, len = fn.length; i < len; i++) {
    if (getType(fn[i]) === getType(type)) {
      return true
    }
  }
  /* istanbul ignore next */
  return false
}

/*  */

function handleError (err, vm, info) {
  if (vm) {
    var cur = vm;
    while ((cur = cur.$parent)) {
      var hooks = cur.$options.errorCaptured;
      if (hooks) {
        for (var i = 0; i < hooks.length; i++) {
          try {
            var capture = hooks[i].call(cur, err, vm, info) === false;
            if (capture) { return }
          } catch (e) {
            globalHandleError(e, cur, 'errorCaptured hook');
          }
        }
      }
    }
  }
  globalHandleError(err, vm, info);
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      logError(e, null, 'config.errorHandler');
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */
/* globals MessageChannel */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using both micro and macro tasks.
// In < 2.4 we used micro tasks everywhere, but there are some scenarios where
// micro tasks have too high a priority and fires in between supposedly
// sequential events (e.g. #4521, #6690) or even between bubbling of the same
// event (#6566). However, using macro tasks everywhere also has subtle problems
// when state is changed right before repaint (e.g. #6813, out-in transitions).
// Here we use micro task by default, but expose a way to force macro task when
// needed (e.g. in event handlers attached by v-on).
var microTimerFunc;
var macroTimerFunc;
var useMacroTask = false;

// Determine (macro) Task defer implementation.
// Technically setImmediate should be the ideal choice, but it's only available
// in IE. The only polyfill that consistently queues the callback after all DOM
// events triggered in the same loop is by using MessageChannel.
/* istanbul ignore if */
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else if (typeof MessageChannel !== 'undefined' && (
  isNative(MessageChannel) ||
  // PhantomJS
  MessageChannel.toString() === '[object MessageChannelConstructor]'
)) {
  var channel = new MessageChannel();
  var port = channel.port2;
  channel.port1.onmessage = flushCallbacks;
  macroTimerFunc = function () {
    port.postMessage(1);
  };
} else {
  /* istanbul ignore next */
  macroTimerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

// Determine MicroTask defer implementation.
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  microTimerFunc = function () {
    p.then(flushCallbacks);
    // in problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else {
  // fallback to macro
  microTimerFunc = macroTimerFunc;
}

/**
 * Wrap a function so that if any code inside triggers state change,
 * the changes are queued using a Task instead of a MicroTask.
 */
function withMacroTask (fn) {
  return fn._withTask || (fn._withTask = function () {
    useMacroTask = true;
    var res = fn.apply(null, arguments);
    useMacroTask = false;
    return res
  })
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    if (useMacroTask) {
      macroTimerFunc();
    } else {
      microTimerFunc();
    }
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

var mark;
var measure;

{
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      perf.clearMeasures(name);
    };
  }
}

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

{
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' &&
    Proxy.toString().match(/native code/);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
      if (!has && !isAllowed) {
        warnNonPresent(target, key);
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        warnNonPresent(target, key);
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val)) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        cloned[i].apply(null, arguments$1);
      }
    } else {
      // return handler return value for single handlers
      return fns.apply(null, arguments)
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  vm
) {
  var name, def, cur, old, event;
  for (name in on) {
    def = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    /* istanbul ignore if */
    if (isUndef(cur)) {
      "development" !== 'production' && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur);
      }
      add(event.name, cur, event.once, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

function mergeVNodeHook (def, hookKey, hook) {
  if (def instanceof VNode) {
    def = def.data.hook || (def.data.hook = {});
  }
  var invoker;
  var oldHook = def[hookKey];

  function wrappedHook () {
    hook.apply(this, arguments);
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook);
  }

  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor,
  context
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (isDef(factory.contexts)) {
    // already pending
    factory.contexts.push(context);
  } else {
    var contexts = factory.contexts = [context];
    var sync = true;

    var forceRender = function () {
      for (var i = 0, l = contexts.length; i < l; i++) {
        contexts[i].$forceUpdate();
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender();
      }
    });

    var reject = once(function (reason) {
      "development" !== 'production' && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender();
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (typeof res.then === 'function') {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isDef(res.component) && typeof res.component.then === 'function') {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            setTimeout(function () {
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender();
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          setTimeout(function () {
            if (isUndef(factory.resolved)) {
              reject(
                "timeout (" + (res.timeout) + "ms)"
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn, once) {
  if (once) {
    target.$once(event, fn);
  } else {
    target.$on(event, fn);
  }
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var this$1 = this;

    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var this$1 = this;

    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$off(event[i], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    if (fn) {
      // specific handler
      var cb;
      var i$1 = cbs.length;
      while (i$1--) {
        cb = cbs[i$1];
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i$1, 1);
          break
        }
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        try {
          cbs[i].apply(vm, args);
        } catch (e) {
          handleError(e, vm, ("event handler for \"" + event + "\""));
        }
      }
    }
    return vm
  };
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  var slots = {};
  if (!children) {
    return slots
  }
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      (slots.default || (slots.default = [])).push(child);
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

function resolveScopedSlots (
  fns, // see flow/vnode
  res
) {
  res = res || {};
  for (var i = 0; i < fns.length; i++) {
    if (Array.isArray(fns[i])) {
      resolveScopedSlots(fns[i], res);
    } else {
      res[fns[i].key] = fns[i].fn;
    }
  }
  return res
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate');
    }
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(
        vm.$el, vnode, hydrating, false /* removeOnly */,
        vm.$options._parentElm,
        vm.$options._refElm
      );
      // no need for the ref nodes after initial patch
      // this prevents keeping a detached DOM tree in memory (#5851)
      vm.$options._parentElm = vm.$options._refElm = null;
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    activeInstance = prevActiveInstance;
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function mountComponent (
  vm,
  el,
  hydrating
) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  callHook(vm, 'beforeMount');

  var updateComponent;
  /* istanbul ignore if */
  if ("development" !== 'production' && config.performance && mark) {
    updateComponent = function () {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:" + id;
      var endTag = "vue-perf-end:" + id;

      mark(startTag);
      var vnode = vm._render();
      mark(endTag);
      measure(("vue " + name + " render"), startTag, endTag);

      mark(startTag);
      vm._update(vnode, hydrating);
      mark(endTag);
      measure(("vue " + name + " patch"), startTag, endTag);
    };
  } else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, null, true /* isRenderWatcher */);
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren
  var hasChildren = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    parentVnode.data.scopedSlots || // has new scoped slots
    vm.$scopedSlots !== emptyObject // has old scoped slots
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = (parentVnode.data && parentVnode.data.attrs) || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    observerState.shouldConvert = false;
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      props[key] = validateProp(key, vm.$options.props, propsData, vm);
    }
    observerState.shouldConvert = true;
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  if (listeners) {
    var oldListeners = vm.$options._parentListeners;
    vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, oldListeners);
  }
  // resolve slots + force update if has children
  if (hasChildren) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm);
      } catch (e) {
        handleError(e, vm, (hook + " hook"));
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
}

/*  */


var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  {
    circular = {};
  }
  waiting = flushing = false;
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ("development" !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */

var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression = expOrFn.toString();
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = function () {};
      "development" !== 'production' && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    var dep = this$1.deps[i];
    if (!this$1.newDepIds.has(dep.id)) {
      dep.removeSub(this$1);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    this$1.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
    var this$1 = this;

  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].removeSub(this$1);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  observerState.shouldConvert = isRoot;
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive(props, key, value, function () {
        if (vm.$parent && !isUpdatingChildComponent) {
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  observerState.shouldConvert = true;
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
    "development" !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
      "development" !== 'production' && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ("development" !== 'production' && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : userDef;
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : userDef.get
      : noop;
    sharedPropertyDefinition.set = userDef.set
      ? userDef.set
      : noop;
  }
  if ("development" !== 'production' &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    {
      if (methods[key] == null) {
        warn(
          "Method \"" + key + "\" has an undefined value in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  keyOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(keyOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  {
    dataDef.set = function (newData) {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      cb.call(vm, watcher.value);
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    observerState.shouldConvert = false;
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      {
        defineReactive(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      }
    });
    observerState.shouldConvert = true;
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject).filter(function (key) {
        /* istanbul ignore next */
        return Object.getOwnPropertyDescriptor(inject, key).enumerable
      })
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && provideKey in source._provided) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    keys = Object.keys(val);
    ret = new Array(keys.length);
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      ret[i] = render(val[key], key, i);
    }
  }
  if (isDef(ret)) {
    (ret)._isVList = true;
  }
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ("development" !== 'production' && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    nodes = scopedSlotFn(props) || fallback;
  } else {
    var slotNodes = this.$slots[name];
    // warn duplicate slot usage
    if (slotNodes) {
      if ("development" !== 'production' && slotNodes._rendered) {
        warn(
          "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
          "- this will likely cause render errors.",
          this
        );
      }
      slotNodes._rendered = true;
    }
    nodes = slotNodes || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInAlias,
  eventKeyName
) {
  var keyCodes = config.keyCodes[key] || builtInAlias;
  if (keyCodes) {
    if (Array.isArray(keyCodes)) {
      return keyCodes.indexOf(eventKeyCode) === -1
    } else {
      return keyCodes !== eventKeyCode
    }
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
      "development" !== 'production' && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        if (!(key in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree by doing a shallow clone.
  if (tree && !isInFor) {
    return Array.isArray(tree)
      ? cloneVNodes(tree)
      : cloneVNode(tree)
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
      "development" !== 'production' && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var options = Ctor.options;
  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () { return resolveSlots(children, parent); };

  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm = Object.create(parent);
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = data.scopedSlots || emptyObject;
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    vnode.fnContext = contextVm;
    vnode.fnOptions = options;
    if (data.slot) {
      (vnode.data || (vnode.data = {})).slot = data.slot;
    }
  }

  return vnode
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */




// Register the component hook to weex native render engine.
// The hook will be triggered by native, not javascript.


// Updates the state of the component to weex native render engine.

/*  */

// https://github.com/Hanks10100/weex-native-directive/tree/master/component

// listening on native callback

/*  */

/*  */

// hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (
    vnode,
    hydrating,
    parentElm,
    refElm
  ) {
    if (!vnode.componentInstance || vnode.componentInstance._isDestroyed) {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance,
        parentElm,
        refElm
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    } else if (vnode.data.keepAlive) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // merge component management hooks onto the placeholder node
  mergeHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  // Weex specific: invoke recycle-list optimized @render function for
  // extracting cell-slot template.
  // https://github.com/Hanks10100/weex-native-directive/tree/master/component
  /* istanbul ignore if */
  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent, // activeInstance in lifecycle state
  parentElm,
  refElm
) {
  var options = {
    _isComponent: true,
    parent: parent,
    _parentVnode: vnode,
    _parentElm: parentElm || null,
    _refElm: refElm || null
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function mergeHooks (data) {
  if (!data.hook) {
    data.hook = {};
  }
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var fromParent = data.hook[key];
    var ours = componentVNodeHooks[key];
    data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours;
  }
}

function mergeHook$1 (one, two) {
  return function (a, b, c, d) {
    one(a, b, c, d);
    two(a, b, c, d);
  }
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input';(data.props || (data.props = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  if (isDef(on[event])) {
    on[event] = [data.model.callback].concat(on[event]);
  } else {
    on[event] = data.model.callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
    "development" !== 'production' && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ("development" !== 'production' &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (isDef(vnode)) {
    if (ns) { applyNS(vnode, ns); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (isUndef(child.ns) || isTrue(force))) {
        applyNS(child, ns, force);
      }
    }
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  }
}

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (vm._isMounted) {
      // if the parent didn't update, the slot nodes will be the ones from
      // last render. They need to be cloned to ensure "freshness" for this render.
      for (var key in vm.$slots) {
        var slot = vm.$slots[key];
        // _rendered is a flag added by renderSlot, but may not be present
        // if the slot is passed from manually written render functions
        if (slot._rendered || (slot[0] && slot[0].elm)) {
          vm.$slots[key] = cloneVNodes(slot, true /* deep */);
        }
      }
    }

    vm.$scopedSlots = (_parentVnode && _parentVnode.data.scopedSlots) || emptyObject;

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      {
        if (vm.$options.renderError) {
          try {
            vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
          } catch (e) {
            handleError(e, vm, "renderError");
            vnode = vm._vnode;
          }
        } else {
          vnode = vm._vnode;
        }
      }
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ("development" !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

var uid$1 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$1++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ("development" !== 'production' && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    {
      initProxy(vm);
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    /* istanbul ignore if */
    if ("development" !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;
  opts._parentElm = options._parentElm;
  opts._refElm = options._refElm;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var extended = Ctor.extendOptions;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = dedupe(latest[key], extended[key], sealed[key]);
    }
  }
  return modified
}

function dedupe (latest, extended, sealed) {
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    var res = [];
    sealed = Array.isArray(sealed) ? sealed : [sealed];
    extended = Array.isArray(extended) ? extended : [extended];
    for (var i = 0; i < latest.length; i++) {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i]);
      }
    }
    return res
  } else {
    return latest
  }
}

function Vue$3 (options) {
  if ("development" !== 'production' &&
    !(this instanceof Vue$3)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue$3);
stateMixin(Vue$3);
eventsMixin(Vue$3);
lifecycleMixin(Vue$3);
renderMixin(Vue$3);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if ("development" !== 'production' && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if ("development" !== 'production' && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */

function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    var this$1 = this;

    for (var key in this$1.cache) {
      pruneCacheEntry(this$1.cache, key, this$1.keys);
    }
  },

  watch: {
    include: function include (val) {
      pruneCache(this, function (name) { return matches(val, name); });
    },
    exclude: function exclude (val) {
      pruneCache(this, function (name) { return !matches(val, name); });
    }
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue$3);

Object.defineProperty(Vue$3.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue$3.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

Vue$3.version = '2.5.13';

/*  */

// these are reserved for web because they are directly compiled away
// during template compilation
var isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select,progress');
var mustUseProp = function (tag, type, attr) {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false
};

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;
    if (childNode && childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode && parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return renderClass(data.staticClass, data.class)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class)
      ? [child.class, parent.class]
      : parent.class
  }
}

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot'
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);

var isPreTag = function (tag) { return tag === 'pre'; };

var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

var isTextInputType = makeMap('text,number,password,search,email,tel,url');

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);
    if (!selected) {
      "development" !== 'production' && warn(
        'Cannot find element: ' + el
      );
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}

/*  */

function createElement$1 (tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child) {
  node.removeChild(child);
}

function appendChild (node, child) {
  node.appendChild(child);
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text;
}

function setAttribute (node, key, val) {
  node.setAttribute(key, val);
}


var nodeOps = Object.freeze({
	createElement: createElement$1,
	createElementNS: createElementNS,
	createTextNode: createTextNode,
	createComment: createComment,
	insertBefore: insertBefore,
	removeChild: removeChild,
	appendChild: appendChild,
	parentNode: parentNode,
	nextSibling: nextSibling,
	tagName: tagName,
	setTextContent: setTextContent,
	setAttribute: setAttribute
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode);
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true);
  }
};

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!key) { return }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (!Array.isArray(refs[key])) {
        refs[key] = [ref];
      } else if (refs[key].indexOf(ref) < 0) {
        // $flow-disable-line
        refs[key].push(ref);
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}

function sameInputType (a, b) {
  if (a.tag !== 'input') { return true }
  var i;
  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
  return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) { map[key] = i; }
  }
  return map
}

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove () {
      if (--remove.listeners === 0) {
        removeNode(childElm);
      }
    }
    remove.listeners = listeners;
    return remove
  }

  function removeNode (el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  function isUnknownElement$$1 (vnode, inVPre) {
    return (
      !inVPre &&
      !vnode.ns &&
      !(
        config.ignoredElements.length &&
        config.ignoredElements.some(function (ignore) {
          return isRegExp(ignore)
            ? ignore.test(vnode.tag)
            : ignore === vnode.tag
        })
      ) &&
      config.isUnknownElement(vnode.tag)
    )
  }

  var creatingElmInVPre = 0;
  function createElm (vnode, insertedVnodeQueue, parentElm, refElm, nested) {
    vnode.isRootInsert = !nested; // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      {
        if (data && data.pre) {
          creatingElmInVPre++;
        }
        if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          );
        }
      }
      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        insert(parentElm, vnode.elm, refElm);
      }

      if ("development" !== 'production' && data && data.pre) {
        creatingElmInVPre--;
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;
    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */, parentElm, refElm);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true
      }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
      vnode.data.pendingInsert = null;
    }
    vnode.elm = vnode.componentInstance.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i;
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    var innerNode = vnode;
    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;
      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }
        insertedVnodeQueue.push(innerNode);
        break
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert (parent, elm, ref$$1) {
    if (isDef(parent)) {
      if (isDef(ref$$1)) {
        if (ref$$1.parentNode === parent) {
          nodeOps.insertBefore(parent, elm, ref$$1);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      {
        checkDuplicateKeys(children);
      }
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
    }
  }

  function isPatchable (vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) { i.create(emptyNode, vnode); }
      if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i;
    if (isDef(i = vnode.fnScopeId)) {
      nodeOps.setAttribute(vnode.elm, i, '');
    } else {
      var ancestor = vnode;
      while (ancestor) {
        if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
          nodeOps.setAttribute(vnode.elm, i, '');
        }
        ancestor = ancestor.parent;
      }
    }
    // for slot content they should also get the scopeId from the host instance.
    if (isDef(i = activeInstance) &&
      i !== vnode.context &&
      i !== vnode.fnContext &&
      isDef(i = i.$options._scopeId)
    ) {
      nodeOps.setAttribute(vnode.elm, i, '');
    }
  }

  function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm);
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else { // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      var i;
      var listeners = cbs.remove.length + 1;
      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    {
      checkDuplicateKeys(newCh);
    }

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
        } else {
          vnodeToMove = oldCh[idxInOld];
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
          }
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function checkDuplicateKeys (children) {
    var seenKeys = {};
    for (var i = 0; i < children.length; i++) {
      var vnode = children[i];
      var key = vnode.key;
      if (isDef(key)) {
        if (seenKeys[key]) {
          warn(
            ("Duplicate keys detected: '" + key + "'. This may cause an update error."),
            vnode.context
          );
        } else {
          seenKeys[key] = true;
        }
      }
    }
  }

  function findIdxInOld (node, oldCh, start, end) {
    for (var i = start; i < end; i++) {
      var c = oldCh[i];
      if (isDef(c) && sameVnode(node, c)) { return i }
    }
  }

  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      return
    }

    var elm = vnode.elm = oldVnode.elm;

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
      } else {
        vnode.isAsyncPlaceholder = true;
      }
      return
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance;
      return
    }

    var i;
    var data = vnode.data;
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }

    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var hydrationBailed = false;
  // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  // Note: style is excluded because it relies on initial clone for future
  // deep updates (#7063).
  var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate (elm, vnode, insertedVnodeQueue, inVPre) {
    var i;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    inVPre = inVPre || (data && data.pre);
    vnode.elm = elm;

    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
      vnode.isAsyncPlaceholder = true;
      return true
    }
    // assert node match
    {
      if (!assertNodeMatch(elm, vnode, inVPre)) {
        return false
      }
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          // v-html and domProps: innerHTML
          if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
            if (i !== elm.innerHTML) {
              /* istanbul ignore if */
              if ("development" !== 'production' &&
                typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('server innerHTML: ', i);
                console.warn('client innerHTML: ', elm.innerHTML);
              }
              return false
            }
          } else {
            // iterate and compare children lists
            var childrenMatch = true;
            var childNode = elm.firstChild;
            for (var i$1 = 0; i$1 < children.length; i$1++) {
              if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                childrenMatch = false;
                break
              }
              childNode = childNode.nextSibling;
            }
            // if childNode is not null, it means the actual childNodes list is
            // longer than the virtual children list.
            if (!childrenMatch || childNode) {
              /* istanbul ignore if */
              if ("development" !== 'production' &&
                typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
              }
              return false
            }
          }
        }
      }
      if (isDef(data)) {
        var fullInvoke = false;
        for (var key in data) {
          if (!isRenderedModule(key)) {
            fullInvoke = true;
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break
          }
        }
        if (!fullInvoke && data['class']) {
          // ensure collecting deps for deep class bindings for future updates
          traverse(data['class']);
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }
    return true
  }

  function assertNodeMatch (node, vnode, inVPre) {
    if (isDef(vnode.tag)) {
      return vnode.tag.indexOf('vue-component') === 0 || (
        !isUnknownElement$$1(vnode, inVPre) &&
        vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
      )
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3)
    }
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
      return
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue, parentElm, refElm);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode
            } else {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              );
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }

        // replacing existing element
        var oldElm = oldVnode.elm;
        var parentElm$1 = nodeOps.parentNode(oldElm);

        // create new node
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm$1,
          nodeOps.nextSibling(oldElm)
        );

        // update parent placeholder node element, recursively
        if (isDef(vnode.parent)) {
          var ancestor = vnode.parent;
          var patchable = isPatchable(vnode);
          while (ancestor) {
            for (var i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor);
            }
            ancestor.elm = vnode.elm;
            if (patchable) {
              for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                cbs.create[i$1](emptyNode, ancestor);
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              var insert = ancestor.data.hook.insert;
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                  insert.fns[i$2]();
                }
              }
            } else {
              registerRef(ancestor);
            }
            ancestor = ancestor.parent;
          }
        }

        // destroy old node
        if (isDef(parentElm$1)) {
          removeVnodes(parentElm$1, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm
  }
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives (oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update (oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };
    if (isCreate) {
      mergeVNodeHook(vnode, 'insert', callInsert);
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode, 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    });
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1 (
  dirs,
  vm
) {
  var res = Object.create(null);
  if (!dirs) {
    // $flow-disable-line
    return res
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      // $flow-disable-line
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  // $flow-disable-line
  return res
}

function getRawDirName (dir) {
  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
}

function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    } catch (e) {
      handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
    }
  }
}

var baseModules = [
  ref,
  directives
];

/*  */

function updateAttrs (oldVnode, vnode) {
  var opts = vnode.componentOptions;
  if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
    return
  }
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  // #6666: IE/Edge forces progress value down to 1 before setting a max
  /* istanbul ignore if */
  if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value) {
  if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // technically allowfullscreen is a boolean attribute for <iframe>,
      // but Flash expects a value of "true" when used on <embed> tag
      value = key === 'allowfullscreen' && el.tagName === 'EMBED'
        ? 'true'
        : key;
      el.setAttribute(key, value);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // #7138: IE10 & 11 fires input event when setting placeholder on
      // <textarea>... block the first input event and remove the blocker
      // immediately.
      /* istanbul ignore if */
      if (
        isIE && !isIE9 &&
        el.tagName === 'TEXTAREA' &&
        key === 'placeholder' && !el.__ieph
      ) {
        var blocker = function (e) {
          e.stopImmediatePropagation();
          el.removeEventListener('input', blocker);
        };
        el.addEventListener('input', blocker);
        // $flow-disable-line
        el.__ieph = true; /* IE placeholder patched */
      }
      el.setAttribute(key, value);
    }
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (
    isUndef(data.staticClass) &&
    isUndef(data.class) && (
      isUndef(oldData) || (
        isUndef(oldData.staticClass) &&
        isUndef(oldData.class)
      )
    )
  ) {
    return
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};

/*  */

var validDivisionCharRE = /[\w).+\-_$\]]/;

function parseFilters (exp) {
  var inSingle = false;
  var inDouble = false;
  var inTemplateString = false;
  var inRegex = false;
  var curly = 0;
  var square = 0;
  var paren = 0;
  var lastFilterIndex = 0;
  var c, prev, i, expression, filters;

  for (i = 0; i < exp.length; i++) {
    prev = c;
    c = exp.charCodeAt(i);
    if (inSingle) {
      if (c === 0x27 && prev !== 0x5C) { inSingle = false; }
    } else if (inDouble) {
      if (c === 0x22 && prev !== 0x5C) { inDouble = false; }
    } else if (inTemplateString) {
      if (c === 0x60 && prev !== 0x5C) { inTemplateString = false; }
    } else if (inRegex) {
      if (c === 0x2f && prev !== 0x5C) { inRegex = false; }
    } else if (
      c === 0x7C && // pipe
      exp.charCodeAt(i + 1) !== 0x7C &&
      exp.charCodeAt(i - 1) !== 0x7C &&
      !curly && !square && !paren
    ) {
      if (expression === undefined) {
        // first filter, end of expression
        lastFilterIndex = i + 1;
        expression = exp.slice(0, i).trim();
      } else {
        pushFilter();
      }
    } else {
      switch (c) {
        case 0x22: inDouble = true; break         // "
        case 0x27: inSingle = true; break         // '
        case 0x60: inTemplateString = true; break // `
        case 0x28: paren++; break                 // (
        case 0x29: paren--; break                 // )
        case 0x5B: square++; break                // [
        case 0x5D: square--; break                // ]
        case 0x7B: curly++; break                 // {
        case 0x7D: curly--; break                 // }
      }
      if (c === 0x2f) { // /
        var j = i - 1;
        var p = (void 0);
        // find first non-whitespace prev char
        for (; j >= 0; j--) {
          p = exp.charAt(j);
          if (p !== ' ') { break }
        }
        if (!p || !validDivisionCharRE.test(p)) {
          inRegex = true;
        }
      }
    }
  }

  if (expression === undefined) {
    expression = exp.slice(0, i).trim();
  } else if (lastFilterIndex !== 0) {
    pushFilter();
  }

  function pushFilter () {
    (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
    lastFilterIndex = i + 1;
  }

  if (filters) {
    for (i = 0; i < filters.length; i++) {
      expression = wrapFilter(expression, filters[i]);
    }
  }

  return expression
}

function wrapFilter (exp, filter) {
  var i = filter.indexOf('(');
  if (i < 0) {
    // _f: resolveFilter
    return ("_f(\"" + filter + "\")(" + exp + ")")
  } else {
    var name = filter.slice(0, i);
    var args = filter.slice(i + 1);
    return ("_f(\"" + name + "\")(" + exp + "," + args)
  }
}

/*  */

function baseWarn (msg) {
  console.error(("[Vue compiler]: " + msg));
}

function pluckModuleFunction (
  modules,
  key
) {
  return modules
    ? modules.map(function (m) { return m[key]; }).filter(function (_) { return _; })
    : []
}

function addProp (el, name, value) {
  (el.props || (el.props = [])).push({ name: name, value: value });
  el.plain = false;
}

function addAttr (el, name, value) {
  (el.attrs || (el.attrs = [])).push({ name: name, value: value });
  el.plain = false;
}

// add a raw attr (use this in preTransforms)
function addRawAttr (el, name, value) {
  el.attrsMap[name] = value;
  el.attrsList.push({ name: name, value: value });
}

function addDirective (
  el,
  name,
  rawName,
  value,
  arg,
  modifiers
) {
  (el.directives || (el.directives = [])).push({ name: name, rawName: rawName, value: value, arg: arg, modifiers: modifiers });
  el.plain = false;
}

function addHandler (
  el,
  name,
  value,
  modifiers,
  important,
  warn
) {
  modifiers = modifiers || emptyObject;
  // warn prevent and passive modifier
  /* istanbul ignore if */
  if (
    "development" !== 'production' && warn &&
    modifiers.prevent && modifiers.passive
  ) {
    warn(
      'passive and prevent can\'t be used together. ' +
      'Passive handler can\'t prevent default event.'
    );
  }

  // check capture modifier
  if (modifiers.capture) {
    delete modifiers.capture;
    name = '!' + name; // mark the event as captured
  }
  if (modifiers.once) {
    delete modifiers.once;
    name = '~' + name; // mark the event as once
  }
  /* istanbul ignore if */
  if (modifiers.passive) {
    delete modifiers.passive;
    name = '&' + name; // mark the event as passive
  }

  // normalize click.right and click.middle since they don't actually fire
  // this is technically browser-specific, but at least for now browsers are
  // the only target envs that have right/middle clicks.
  if (name === 'click') {
    if (modifiers.right) {
      name = 'contextmenu';
      delete modifiers.right;
    } else if (modifiers.middle) {
      name = 'mouseup';
    }
  }

  var events;
  if (modifiers.native) {
    delete modifiers.native;
    events = el.nativeEvents || (el.nativeEvents = {});
  } else {
    events = el.events || (el.events = {});
  }

  var newHandler = { value: value };
  if (modifiers !== emptyObject) {
    newHandler.modifiers = modifiers;
  }

  var handlers = events[name];
  /* istanbul ignore if */
  if (Array.isArray(handlers)) {
    important ? handlers.unshift(newHandler) : handlers.push(newHandler);
  } else if (handlers) {
    events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
  } else {
    events[name] = newHandler;
  }

  el.plain = false;
}

function getBindingAttr (
  el,
  name,
  getStatic
) {
  var dynamicValue =
    getAndRemoveAttr(el, ':' + name) ||
    getAndRemoveAttr(el, 'v-bind:' + name);
  if (dynamicValue != null) {
    return parseFilters(dynamicValue)
  } else if (getStatic !== false) {
    var staticValue = getAndRemoveAttr(el, name);
    if (staticValue != null) {
      return JSON.stringify(staticValue)
    }
  }
}

// note: this only removes the attr from the Array (attrsList) so that it
// doesn't get processed by processAttrs.
// By default it does NOT remove it from the map (attrsMap) because the map is
// needed during codegen.
function getAndRemoveAttr (
  el,
  name,
  removeFromMap
) {
  var val;
  if ((val = el.attrsMap[name]) != null) {
    var list = el.attrsList;
    for (var i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1);
        break
      }
    }
  }
  if (removeFromMap) {
    delete el.attrsMap[name];
  }
  return val
}

/*  */

/**
 * Cross-platform code generation for component v-model
 */
function genComponentModel (
  el,
  value,
  modifiers
) {
  var ref = modifiers || {};
  var number = ref.number;
  var trim = ref.trim;

  var baseValueExpression = '$$v';
  var valueExpression = baseValueExpression;
  if (trim) {
    valueExpression =
      "(typeof " + baseValueExpression + " === 'string'" +
        "? " + baseValueExpression + ".trim()" +
        ": " + baseValueExpression + ")";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }
  var assignment = genAssignmentCode(value, valueExpression);

  el.model = {
    value: ("(" + value + ")"),
    expression: ("\"" + value + "\""),
    callback: ("function (" + baseValueExpression + ") {" + assignment + "}")
  };
}

/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */
function genAssignmentCode (
  value,
  assignment
) {
  var res = parseModel(value);
  if (res.key === null) {
    return (value + "=" + assignment)
  } else {
    return ("$set(" + (res.exp) + ", " + (res.key) + ", " + assignment + ")")
  }
}

/**
 * Parse a v-model expression into a base path and a final key segment.
 * Handles both dot-path and possible square brackets.
 *
 * Possible cases:
 *
 * - test
 * - test[key]
 * - test[test1[key]]
 * - test["a"][key]
 * - xxx.test[a[a].test1[key]]
 * - test.xxx.a["asa"][test1[key]]
 *
 */

var len;
var str;
var chr;
var index$1;
var expressionPos;
var expressionEndPos;



function parseModel (val) {
  len = val.length;

  if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
    index$1 = val.lastIndexOf('.');
    if (index$1 > -1) {
      return {
        exp: val.slice(0, index$1),
        key: '"' + val.slice(index$1 + 1) + '"'
      }
    } else {
      return {
        exp: val,
        key: null
      }
    }
  }

  str = val;
  index$1 = expressionPos = expressionEndPos = 0;

  while (!eof()) {
    chr = next();
    /* istanbul ignore if */
    if (isStringStart(chr)) {
      parseString(chr);
    } else if (chr === 0x5B) {
      parseBracket(chr);
    }
  }

  return {
    exp: val.slice(0, expressionPos),
    key: val.slice(expressionPos + 1, expressionEndPos)
  }
}

function next () {
  return str.charCodeAt(++index$1)
}

function eof () {
  return index$1 >= len
}

function isStringStart (chr) {
  return chr === 0x22 || chr === 0x27
}

function parseBracket (chr) {
  var inBracket = 1;
  expressionPos = index$1;
  while (!eof()) {
    chr = next();
    if (isStringStart(chr)) {
      parseString(chr);
      continue
    }
    if (chr === 0x5B) { inBracket++; }
    if (chr === 0x5D) { inBracket--; }
    if (inBracket === 0) {
      expressionEndPos = index$1;
      break
    }
  }
}

function parseString (chr) {
  var stringQuote = chr;
  while (!eof()) {
    chr = next();
    if (chr === stringQuote) {
      break
    }
  }
}

/*  */

var warn$1;

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

function model (
  el,
  dir,
  _warn
) {
  warn$1 = _warn;
  var value = dir.value;
  var modifiers = dir.modifiers;
  var tag = el.tag;
  var type = el.attrsMap.type;

  {
    // inputs with type="file" are read only and setting the input's
    // value will throw an error.
    if (tag === 'input' && type === 'file') {
      warn$1(
        "<" + (el.tag) + " v-model=\"" + value + "\" type=\"file\">:\n" +
        "File inputs are read only. Use a v-on:change listener instead."
      );
    }
  }

  if (el.component) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else if (tag === 'select') {
    genSelect(el, value, modifiers);
  } else if (tag === 'input' && type === 'checkbox') {
    genCheckboxModel(el, value, modifiers);
  } else if (tag === 'input' && type === 'radio') {
    genRadioModel(el, value, modifiers);
  } else if (tag === 'input' || tag === 'textarea') {
    genDefaultModel(el, value, modifiers);
  } else if (!config.isReservedTag(tag)) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else {
    warn$1(
      "<" + (el.tag) + " v-model=\"" + value + "\">: " +
      "v-model is not supported on this element type. " +
      'If you are working with contenteditable, it\'s recommended to ' +
      'wrap a library dedicated for that purpose inside a custom component.'
    );
  }

  // ensure runtime directive metadata
  return true
}

function genCheckboxModel (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
  var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
  addProp(el, 'checked',
    "Array.isArray(" + value + ")" +
    "?_i(" + value + "," + valueBinding + ")>-1" + (
      trueValueBinding === 'true'
        ? (":(" + value + ")")
        : (":_q(" + value + "," + trueValueBinding + ")")
    )
  );
  addHandler(el, 'change',
    "var $$a=" + value + "," +
        '$$el=$event.target,' +
        "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" +
    'if(Array.isArray($$a)){' +
      "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," +
          '$$i=_i($$a,$$v);' +
      "if($$el.checked){$$i<0&&(" + value + "=$$a.concat([$$v]))}" +
      "else{$$i>-1&&(" + value + "=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}" +
    "}else{" + (genAssignmentCode(value, '$$c')) + "}",
    null, true
  );
}

function genRadioModel (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  valueBinding = number ? ("_n(" + valueBinding + ")") : valueBinding;
  addProp(el, 'checked', ("_q(" + value + "," + valueBinding + ")"));
  addHandler(el, 'change', genAssignmentCode(value, valueBinding), null, true);
}

function genSelect (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var selectedVal = "Array.prototype.filter" +
    ".call($event.target.options,function(o){return o.selected})" +
    ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" +
    "return " + (number ? '_n(val)' : 'val') + "})";

  var assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
  var code = "var $$selectedVal = " + selectedVal + ";";
  code = code + " " + (genAssignmentCode(value, assignment));
  addHandler(el, 'change', code, null, true);
}

function genDefaultModel (
  el,
  value,
  modifiers
) {
  var type = el.attrsMap.type;

  // warn if v-bind:value conflicts with v-model
  {
    var value$1 = el.attrsMap['v-bind:value'] || el.attrsMap[':value'];
    if (value$1) {
      var binding = el.attrsMap['v-bind:value'] ? 'v-bind:value' : ':value';
      warn$1(
        binding + "=\"" + value$1 + "\" conflicts with v-model on the same element " +
        'because the latter already expands to a value binding internally'
      );
    }
  }

  var ref = modifiers || {};
  var lazy = ref.lazy;
  var number = ref.number;
  var trim = ref.trim;
  var needCompositionGuard = !lazy && type !== 'range';
  var event = lazy
    ? 'change'
    : type === 'range'
      ? RANGE_TOKEN
      : 'input';

  var valueExpression = '$event.target.value';
  if (trim) {
    valueExpression = "$event.target.value.trim()";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }

  var code = genAssignmentCode(value, valueExpression);
  if (needCompositionGuard) {
    code = "if($event.target.composing)return;" + code;
  }

  addProp(el, 'value', ("(" + value + ")"));
  addHandler(el, event, code, null, true);
  if (trim || number) {
    addHandler(el, 'blur', '$forceUpdate()');
  }
}

/*  */

// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
function normalizeEvents (on) {
  /* istanbul ignore if */
  if (isDef(on[RANGE_TOKEN])) {
    // IE input[type=range] only supports `change` event
    var event = isIE ? 'change' : 'input';
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
    delete on[RANGE_TOKEN];
  }
  // This was originally intended to fix #4521 but no longer necessary
  // after 2.5. Keeping it for backwards compat with generated code from < 2.4
  /* istanbul ignore if */
  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
    on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
    delete on[CHECKBOX_RADIO_TOKEN];
  }
}

var target$1;

function createOnceHandler (handler, event, capture) {
  var _target = target$1; // save current target element in closure
  return function onceHandler () {
    var res = handler.apply(null, arguments);
    if (res !== null) {
      remove$2(event, onceHandler, capture, _target);
    }
  }
}

function add$1 (
  event,
  handler,
  once$$1,
  capture,
  passive
) {
  handler = withMacroTask(handler);
  if (once$$1) { handler = createOnceHandler(handler, event, capture); }
  target$1.addEventListener(
    event,
    handler,
    supportsPassive
      ? { capture: capture, passive: passive }
      : capture
  );
}

function remove$2 (
  event,
  handler,
  capture,
  _target
) {
  (_target || target$1).removeEventListener(
    event,
    handler._withTask || handler,
    capture
  );
}

function updateDOMListeners (oldVnode, vnode) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target$1 = vnode.elm;
  normalizeEvents(on);
  updateListeners(on, oldOn, add$1, remove$2, vnode.context);
  target$1 = undefined;
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};

/*  */

function updateDOMProps (oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (isUndef(props[key])) {
      elm[key] = '';
    }
  }
  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) { vnode.children.length = 0; }
      if (cur === oldProps[key]) { continue }
      // #6601 work around Chrome version <= 55 bug where single textNode
      // replaced by innerHTML/textContent retains its parentNode property
      if (elm.childNodes.length === 1) {
        elm.removeChild(elm.childNodes[0]);
      }
    }

    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = isUndef(cur) ? '' : String(cur);
      if (shouldUpdateValue(elm, strCur)) {
        elm.value = strCur;
      }
    } else {
      elm[key] = cur;
    }
  }
}

// check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue (elm, checkVal) {
  return (!elm.composing && (
    elm.tagName === 'OPTION' ||
    isNotInFocusAndDirty(elm, checkVal) ||
    isDirtyWithModifiers(elm, checkVal)
  ))
}

function isNotInFocusAndDirty (elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is
  // not equal to the updated value
  var notInFocus = true;
  // #6157
  // work around IE bug when accessing document.activeElement in an iframe
  try { notInFocus = document.activeElement !== elm; } catch (e) {}
  return notInFocus && elm.value !== checkVal
}

function isDirtyWithModifiers (elm, newVal) {
  var value = elm.value;
  var modifiers = elm._vModifiers; // injected by v-model runtime
  if (isDef(modifiers)) {
    if (modifiers.lazy) {
      // inputs with lazy should only be updated when not in focus
      return false
    }
    if (modifiers.number) {
      return toNumber(value) !== toNumber(newVal)
    }
    if (modifiers.trim) {
      return value.trim() !== newVal.trim()
    }
  }
  return value !== newVal
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData (data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle (vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (
        childNode && childNode.data &&
        (styleData = normalizeStyleData(childNode.data))
      ) {
        extend(res, styleData);
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res
}

/*  */

var cssVarRE = /^--/;
var importantRE = /\s*!important$/;
var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(name, val.replace(importantRE, ''), 'important');
  } else {
    var normalizedName = normalize(name);
    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (var i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i];
      }
    } else {
      el.style[normalizedName] = val;
    }
  }
};

var vendorNames = ['Webkit', 'Moz', 'ms'];

var emptyStyle;
var normalize = cached(function (prop) {
  emptyStyle = emptyStyle || document.createElement('div').style;
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in emptyStyle)) {
    return prop
  }
  var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < vendorNames.length; i++) {
    var name = vendorNames[i] + capName;
    if (name in emptyStyle) {
      return name
    }
  }
});

function updateStyle (oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style)
  ) {
    return
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldData.staticStyle;
  var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  var oldStyle = oldStaticStyle || oldStyleBinding;

  var style = normalizeStyleBinding(vnode.data.style) || {};

  // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likely wants
  // to mutate it.
  vnode.data.normalizedStyle = isDef(style.__ob__)
    ? extend({}, style)
    : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};

/*  */

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
    if (!el.classList.length) {
      el.removeAttribute('class');
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    cur = cur.trim();
    if (cur) {
      el.setAttribute('class', cur);
    } else {
      el.removeAttribute('class');
    }
  }
}

/*  */

function resolveTransition (def) {
  if (!def) {
    return
  }
  /* istanbul ignore else */
  if (typeof def === 'object') {
    var res = {};
    if (def.css !== false) {
      extend(res, autoCssTransition(def.name || 'v'));
    }
    extend(res, def);
    return res
  } else if (typeof def === 'string') {
    return autoCssTransition(def)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    enterToClass: (name + "-enter-to"),
    enterActiveClass: (name + "-enter-active"),
    leaveClass: (name + "-leave"),
    leaveToClass: (name + "-leave-to"),
    leaveActiveClass: (name + "-leave-active")
  }
});

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined
  ) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined
  ) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser
  ? window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : setTimeout
  : /* istanbul ignore next */ function (fn) { return fn(); };

function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass (el, cls) {
  var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
  if (transitionClasses.indexOf(cls) < 0) {
    transitionClasses.push(cls);
    addClass(el, cls);
  }
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  var transitionDelays = styles[transitionProp + 'Delay'].split(', ');
  var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = styles[animationProp + 'Delay'].split(', ');
  var animationDurations = styles[animationProp + 'Duration'].split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

function toMs (s) {
  return Number(s.slice(0, -1)) * 1000
}

/*  */

function enter (vnode, toggleDisplay) {
  var el = vnode.elm;

  // call leave callback now
  if (isDef(el._leaveCb)) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return
  }

  /* istanbul ignore if */
  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;
  while (transitionNode && transitionNode.parent) {
    transitionNode = transitionNode.parent;
    context = transitionNode.context;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear && appearClass
    ? appearClass
    : enterClass;
  var activeClass = isAppear && appearActiveClass
    ? appearActiveClass
    : enterActiveClass;
  var toClass = isAppear && appearToClass
    ? appearToClass
    : enterToClass;

  var beforeEnterHook = isAppear
    ? (beforeAppear || beforeEnter)
    : beforeEnter;
  var enterHook = isAppear
    ? (typeof appear === 'function' ? appear : enter)
    : enter;
  var afterEnterHook = isAppear
    ? (afterAppear || afterEnter)
    : afterEnter;
  var enterCancelledHook = isAppear
    ? (appearCancelled || enterCancelled)
    : enterCancelled;

  var explicitEnterDuration = toNumber(
    isObject(duration)
      ? duration.enter
      : duration
  );

  if ("development" !== 'production' && explicitEnterDuration != null) {
    checkDuration(explicitEnterDuration, 'enter', vnode);
  }

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode, 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode &&
        pendingNode.tag === vnode.tag &&
        pendingNode.elm._leaveCb
      ) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    });
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      addTransitionClass(el, toClass);
      removeTransitionClass(el, startClass);
      if (!cb.cancelled && !userWantsControl) {
        if (isValidDuration(explicitEnterDuration)) {
          setTimeout(cb, explicitEnterDuration);
        } else {
          whenTransitionEnds(el, type, cb);
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave (vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (isDef(el._enterCb)) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data) || el.nodeType !== 1) {
    return rm()
  }

  /* istanbul ignore if */
  if (isDef(el._leaveCb)) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(leave);

  var explicitLeaveDuration = toNumber(
    isObject(duration)
      ? duration.leave
      : duration
  );

  if ("development" !== 'production' && isDef(explicitLeaveDuration)) {
    checkDuration(explicitLeaveDuration, 'leave', vnode);
  }

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        addTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled && !userWantsControl) {
          if (isValidDuration(explicitLeaveDuration)) {
            setTimeout(cb, explicitLeaveDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

// only used in dev mode
function checkDuration (val, name, vnode) {
  if (typeof val !== 'number') {
    warn(
      "<transition> explicit " + name + " duration is not a valid number - " +
      "got " + (JSON.stringify(val)) + ".",
      vnode.context
    );
  } else if (isNaN(val)) {
    warn(
      "<transition> explicit " + name + " duration is NaN - " +
      'the duration expression might be incorrect.',
      vnode.context
    );
  }
}

function isValidDuration (val) {
  return typeof val === 'number' && !isNaN(val)
}

/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength (fn) {
  if (isUndef(fn)) {
    return false
  }
  var invokerFns = fn.fns;
  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(
      Array.isArray(invokerFns)
        ? invokerFns[0]
        : invokerFns
    )
  } else {
    return (fn._length || fn.length) > 1
  }
}

function _enter (_, vnode) {
  if (vnode.data.show !== true) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove$$1 (vnode, rm) {
    /* istanbul ignore else */
    if (vnode.data.show !== true) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
];

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var directive = {
  inserted: function inserted (el, binding, vnode, oldVnode) {
    if (vnode.tag === 'select') {
      // #6903
      if (oldVnode.elm && !oldVnode.elm._vOptions) {
        mergeVNodeHook(vnode, 'postpatch', function () {
          directive.componentUpdated(el, binding, vnode);
        });
      } else {
        setSelected(el, binding, vnode.context);
      }
      el._vOptions = [].map.call(el.options, getValue);
    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd);
        if (!isAndroid) {
          el.addEventListener('compositionstart', onCompositionStart);
          el.addEventListener('compositionend', onCompositionEnd);
        }
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },

  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var prevOptions = el._vOptions;
      var curOptions = el._vOptions = [].map.call(el.options, getValue);
      if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
        // trigger change event if
        // no matching option found for at least one value
        var needReset = el.multiple
          ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
          : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
        if (needReset) {
          trigger(el, 'change');
        }
      }
    }
  }
};

function setSelected (el, binding, vm) {
  actuallySetSelected(el, binding, vm);
  /* istanbul ignore if */
  if (isIE || isEdge) {
    setTimeout(function () {
      actuallySetSelected(el, binding, vm);
    }, 0);
  }
}

function actuallySetSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    "development" !== 'production' && warn(
      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
      vm
    );
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption (value, options) {
  return options.every(function (o) { return !looseEqual(o, value); })
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value
}

function onCompositionStart (e) {
  e.target.composing = true;
}

function onCompositionEnd (e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) { return }
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.componentInstance._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay =
      el.style.display === 'none' ? '' : el.style.display;
    if (value && transition$$1) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },

  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (value === oldValue) { return }
    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    if (transition$$1) {
      vnode.data.show = true;
      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },

  unbind: function unbind (
    el,
    binding,
    vnode,
    oldVnode,
    isDestroy
  ) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
};

var platformDirectives = {
  model: directive,
  show: show
};

/*  */

// Provides transition support for a single element/component.
// supports transition mode (out-in / in-out)

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1];
  }
  return data
}

function placeholder (h, rawChild) {
  if (/\d-keep-alive$/.test(rawChild.tag)) {
    return h('keep-alive', {
      props: rawChild.componentOptions.propsData
    })
  }
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

function isSameChild (child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag
}

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,

  render: function render (h) {
    var this$1 = this;

    var children = this.$slots.default;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(function (c) { return c.tag || isAsyncPlaceholder(c); });
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    if ("development" !== 'production' && children.length > 1) {
      warn(
        '<transition> can only be used on a single element. Use ' +
        '<transition-group> for lists.',
        this.$parent
      );
    }

    var mode = this.mode;

    // warn invalid mode
    if ("development" !== 'production' &&
      mode && mode !== 'in-out' && mode !== 'out-in'
    ) {
      warn(
        'invalid <transition> mode: ' + mode,
        this.$parent
      );
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.
    var id = "__transition-" + (this._uid) + "-";
    child.key = child.key == null
      ? child.isComment
        ? id + 'comment'
        : id + child.tag
      : isPrimitive(child.key)
        ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
        : child.key;

    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(function (d) { return d.name === 'show'; })) {
      child.data.show = true;
    }

    if (
      oldChild &&
      oldChild.data &&
      !isSameChild(child, oldChild) &&
      !isAsyncPlaceholder(oldChild) &&
      // #6687 component root is a comment node
      !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
    ) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild.data.transition = extend({}, data);
      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        });
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        if (isAsyncPlaceholder(child)) {
          return oldRawChild
        }
        var delayedLeave;
        var performLeave = function () { delayedLeave(); };
        mergeVNodeHook(data, 'afterEnter', performLeave);
        mergeVNodeHook(data, 'enterCancelled', performLeave);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
      }
    }

    return rawChild
  }
};

/*  */

// Provides transition support for list items.
// supports move transitions using the FLIP technique.

// Because the vdom's children update algorithm is "unstable" - i.e.
// it doesn't guarantee the relative positioning of removed elements,
// we force transition-group to update its children into two passes:
// in the first pass, we remove all nodes that need to be removed,
// triggering their leaving transition; in the second pass, we insert/move
// into the final desired state. This way in the second pass removed
// nodes will remain where they should be.

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData;
        } else {
          var opts = c.componentOptions;
          var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
          warn(("<transition-group> children must be keyed: <" + name + ">"));
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children)
  },

  beforeUpdate: function beforeUpdate () {
    // force removing pass
    this.__patch__(
      this._vnode,
      this.kept,
      false, // hydrating
      true // removeOnly (!important avoids unnecessary moves)
    );
    this._vnode = this.kept;
  },

  updated: function updated () {
    var children = this.prevChildren;
    var moveClass = this.moveClass || ((this.name || 'v') + '-move');
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    // assign to this to avoid being removed in tree-shaking
    // $flow-disable-line
    this._reflow = document.body.offsetHeight;

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      /* istanbul ignore if */
      if (this._hasMove) {
        return this._hasMove
      }
      // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.
      var clone = el.cloneNode();
      if (el._transitionClasses) {
        el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
      }
      addClass(clone, moveClass);
      clone.style.display = 'none';
      this.$el.appendChild(clone);
      var info = getTransitionInfo(clone);
      this.$el.removeChild(clone);
      return (this._hasMove = info.hasTransform)
    }
  }
};

function callPendingCbs (c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition (c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation (c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};

/*  */

// install platform specific utils
Vue$3.config.mustUseProp = mustUseProp;
Vue$3.config.isReservedTag = isReservedTag;
Vue$3.config.isReservedAttr = isReservedAttr;
Vue$3.config.getTagNamespace = getTagNamespace;
Vue$3.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(Vue$3.options.directives, platformDirectives);
extend(Vue$3.options.components, platformComponents);

// install platform patch function
Vue$3.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
Vue$3.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};

// devtools global hook
/* istanbul ignore next */
Vue$3.nextTick(function () {
  if (config.devtools) {
    if (devtools) {
      devtools.emit('init', Vue$3);
    } else if ("development" !== 'production' && isChrome) {
      console[console.info ? 'info' : 'log'](
        'Download the Vue Devtools extension for a better development experience:\n' +
        'https://github.com/vuejs/vue-devtools'
      );
    }
  }
  if ("development" !== 'production' &&
    config.productionTip !== false &&
    inBrowser && typeof console !== 'undefined'
  ) {
    console[console.info ? 'info' : 'log'](
      "You are running Vue in development mode.\n" +
      "Make sure to turn on production mode when deploying for production.\n" +
      "See more tips at https://vuejs.org/guide/deployment.html"
    );
  }
}, 0);

/*  */

var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

var buildRegex = cached(function (delimiters) {
  var open = delimiters[0].replace(regexEscapeRE, '\\$&');
  var close = delimiters[1].replace(regexEscapeRE, '\\$&');
  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
});



function parseText (
  text,
  delimiters
) {
  var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
  if (!tagRE.test(text)) {
    return
  }
  var tokens = [];
  var rawTokens = [];
  var lastIndex = tagRE.lastIndex = 0;
  var match, index, tokenValue;
  while ((match = tagRE.exec(text))) {
    index = match.index;
    // push text token
    if (index > lastIndex) {
      rawTokens.push(tokenValue = text.slice(lastIndex, index));
      tokens.push(JSON.stringify(tokenValue));
    }
    // tag token
    var exp = parseFilters(match[1].trim());
    tokens.push(("_s(" + exp + ")"));
    rawTokens.push({ '@binding': exp });
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    rawTokens.push(tokenValue = text.slice(lastIndex));
    tokens.push(JSON.stringify(tokenValue));
  }
  return {
    expression: tokens.join('+'),
    tokens: rawTokens
  }
}

/*  */

function transformNode (el, options) {
  var warn = options.warn || baseWarn;
  var staticClass = getAndRemoveAttr(el, 'class');
  if ("development" !== 'production' && staticClass) {
    var res = parseText(staticClass, options.delimiters);
    if (res) {
      warn(
        "class=\"" + staticClass + "\": " +
        'Interpolation inside attributes has been removed. ' +
        'Use v-bind or the colon shorthand instead. For example, ' +
        'instead of <div class="{{ val }}">, use <div :class="val">.'
      );
    }
  }
  if (staticClass) {
    el.staticClass = JSON.stringify(staticClass);
  }
  var classBinding = getBindingAttr(el, 'class', false /* getStatic */);
  if (classBinding) {
    el.classBinding = classBinding;
  }
}

function genData (el) {
  var data = '';
  if (el.staticClass) {
    data += "staticClass:" + (el.staticClass) + ",";
  }
  if (el.classBinding) {
    data += "class:" + (el.classBinding) + ",";
  }
  return data
}

var klass$1 = {
  staticKeys: ['staticClass'],
  transformNode: transformNode,
  genData: genData
};

/*  */

function transformNode$1 (el, options) {
  var warn = options.warn || baseWarn;
  var staticStyle = getAndRemoveAttr(el, 'style');
  if (staticStyle) {
    /* istanbul ignore if */
    {
      var res = parseText(staticStyle, options.delimiters);
      if (res) {
        warn(
          "style=\"" + staticStyle + "\": " +
          'Interpolation inside attributes has been removed. ' +
          'Use v-bind or the colon shorthand instead. For example, ' +
          'instead of <div style="{{ val }}">, use <div :style="val">.'
        );
      }
    }
    el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
  }

  var styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
  if (styleBinding) {
    el.styleBinding = styleBinding;
  }
}

function genData$1 (el) {
  var data = '';
  if (el.staticStyle) {
    data += "staticStyle:" + (el.staticStyle) + ",";
  }
  if (el.styleBinding) {
    data += "style:(" + (el.styleBinding) + "),";
  }
  return data
}

var style$1 = {
  staticKeys: ['staticStyle'],
  transformNode: transformNode$1,
  genData: genData$1
};

/*  */

var decoder;

var he = {
  decode: function decode (html) {
    decoder = decoder || document.createElement('div');
    decoder.innerHTML = html;
    return decoder.textContent
  }
};

/*  */

var isUnaryTag = makeMap(
  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
  'link,meta,param,source,track,wbr'
);

// Elements that you can, intentionally, leave open
// (and which close themselves)
var canBeLeftOpenTag = makeMap(
  'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
);

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
var isNonPhrasingTag = makeMap(
  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
  'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
  'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
  'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
  'title,tr,track'
);

/**
 * Not type-checking this file because it's mostly vendor code.
 */

/*!
 * HTML Parser By John Resig (ejohn.org)
 * Modified by Juriy "kangax" Zaytsev
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 */

// Regular Expressions for parsing tags and attributes
var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
// but for Vue templates we can enforce a simple charset
var ncname = '[a-zA-Z_][\\w\\-\\.]*';
var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
var startTagOpen = new RegExp(("^<" + qnameCapture));
var startTagClose = /^\s*(\/?)>/;
var endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>"));
var doctype = /^<!DOCTYPE [^>]+>/i;
var comment = /^<!--/;
var conditionalComment = /^<!\[/;

var IS_REGEX_CAPTURING_BROKEN = false;
'x'.replace(/x(.)?/g, function (m, g) {
  IS_REGEX_CAPTURING_BROKEN = g === '';
});

// Special Elements (can contain anything)
var isPlainTextElement = makeMap('script,style,textarea', true);
var reCache = {};

var decodingMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#10;': '\n',
  '&#9;': '\t'
};
var encodedAttr = /&(?:lt|gt|quot|amp);/g;
var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10|#9);/g;

// #5992
var isIgnoreNewlineTag = makeMap('pre,textarea', true);
var shouldIgnoreFirstNewline = function (tag, html) { return tag && isIgnoreNewlineTag(tag) && html[0] === '\n'; };

function decodeAttr (value, shouldDecodeNewlines) {
  var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
  return value.replace(re, function (match) { return decodingMap[match]; })
}

function parseHTML (html, options) {
  var stack = [];
  var expectHTML = options.expectHTML;
  var isUnaryTag$$1 = options.isUnaryTag || no;
  var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
  var index = 0;
  var last, lastTag;
  while (html) {
    last = html;
    // Make sure we're not in a plaintext content element like script/style
    if (!lastTag || !isPlainTextElement(lastTag)) {
      var textEnd = html.indexOf('<');
      if (textEnd === 0) {
        // Comment:
        if (comment.test(html)) {
          var commentEnd = html.indexOf('-->');

          if (commentEnd >= 0) {
            if (options.shouldKeepComment) {
              options.comment(html.substring(4, commentEnd));
            }
            advance(commentEnd + 3);
            continue
          }
        }

        // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
        if (conditionalComment.test(html)) {
          var conditionalEnd = html.indexOf(']>');

          if (conditionalEnd >= 0) {
            advance(conditionalEnd + 2);
            continue
          }
        }

        // Doctype:
        var doctypeMatch = html.match(doctype);
        if (doctypeMatch) {
          advance(doctypeMatch[0].length);
          continue
        }

        // End tag:
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          var curIndex = index;
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1], curIndex, index);
          continue
        }

        // Start tag:
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          handleStartTag(startTagMatch);
          if (shouldIgnoreFirstNewline(lastTag, html)) {
            advance(1);
          }
          continue
        }
      }

      var text = (void 0), rest = (void 0), next = (void 0);
      if (textEnd >= 0) {
        rest = html.slice(textEnd);
        while (
          !endTag.test(rest) &&
          !startTagOpen.test(rest) &&
          !comment.test(rest) &&
          !conditionalComment.test(rest)
        ) {
          // < in plain text, be forgiving and treat it as text
          next = rest.indexOf('<', 1);
          if (next < 0) { break }
          textEnd += next;
          rest = html.slice(textEnd);
        }
        text = html.substring(0, textEnd);
        advance(textEnd);
      }

      if (textEnd < 0) {
        text = html;
        html = '';
      }

      if (options.chars && text) {
        options.chars(text);
      }
    } else {
      var endTagLength = 0;
      var stackedTag = lastTag.toLowerCase();
      var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
      var rest$1 = html.replace(reStackedTag, function (all, text, endTag) {
        endTagLength = endTag.length;
        if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
          text = text
            .replace(/<!--([\s\S]*?)-->/g, '$1')
            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
        }
        if (shouldIgnoreFirstNewline(stackedTag, text)) {
          text = text.slice(1);
        }
        if (options.chars) {
          options.chars(text);
        }
        return ''
      });
      index += html.length - rest$1.length;
      html = rest$1;
      parseEndTag(stackedTag, index - endTagLength, index);
    }

    if (html === last) {
      options.chars && options.chars(html);
      if ("development" !== 'production' && !stack.length && options.warn) {
        options.warn(("Mal-formatted tag at end of template: \"" + html + "\""));
      }
      break
    }
  }

  // Clean up any remaining tags
  parseEndTag();

  function advance (n) {
    index += n;
    html = html.substring(n);
  }

  function parseStartTag () {
    var start = html.match(startTagOpen);
    if (start) {
      var match = {
        tagName: start[1],
        attrs: [],
        start: index
      };
      advance(start[0].length);
      var end, attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        match.attrs.push(attr);
      }
      if (end) {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match
      }
    }
  }

  function handleStartTag (match) {
    var tagName = match.tagName;
    var unarySlash = match.unarySlash;

    if (expectHTML) {
      if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
        parseEndTag(lastTag);
      }
      if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
        parseEndTag(tagName);
      }
    }

    var unary = isUnaryTag$$1(tagName) || !!unarySlash;

    var l = match.attrs.length;
    var attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      var args = match.attrs[i];
      // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
      if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
        if (args[3] === '') { delete args[3]; }
        if (args[4] === '') { delete args[4]; }
        if (args[5] === '') { delete args[5]; }
      }
      var value = args[3] || args[4] || args[5] || '';
      var shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
        ? options.shouldDecodeNewlinesForHref
        : options.shouldDecodeNewlines;
      attrs[i] = {
        name: args[1],
        value: decodeAttr(value, shouldDecodeNewlines)
      };
    }

    if (!unary) {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs });
      lastTag = tagName;
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end);
    }
  }

  function parseEndTag (tagName, start, end) {
    var pos, lowerCasedTagName;
    if (start == null) { start = index; }
    if (end == null) { end = index; }

    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase();
    }

    // Find the closest opened tag of the same type
    if (tagName) {
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break
        }
      }
    } else {
      // If no tag name is provided, clean shop
      pos = 0;
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (var i = stack.length - 1; i >= pos; i--) {
        if ("development" !== 'production' &&
          (i > pos || !tagName) &&
          options.warn
        ) {
          options.warn(
            ("tag <" + (stack[i].tag) + "> has no matching end tag.")
          );
        }
        if (options.end) {
          options.end(stack[i].tag, start, end);
        }
      }

      // Remove the open elements from the stack
      stack.length = pos;
      lastTag = pos && stack[pos - 1].tag;
    } else if (lowerCasedTagName === 'br') {
      if (options.start) {
        options.start(tagName, [], true, start, end);
      }
    } else if (lowerCasedTagName === 'p') {
      if (options.start) {
        options.start(tagName, [], false, start, end);
      }
      if (options.end) {
        options.end(tagName, start, end);
      }
    }
  }
}

/*  */

var onRE = /^@|^v-on:/;
var dirRE = /^v-|^@|^:/;
var forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/;
var forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
var stripParensRE = /^\(|\)$/g;

var argRE = /:(.*)$/;
var bindRE = /^:|^v-bind:/;
var modifierRE = /\.[^.]+/g;

var decodeHTMLCached = cached(he.decode);

// configurable state
var warn$2;
var delimiters;
var transforms;
var preTransforms;
var postTransforms;
var platformIsPreTag;
var platformMustUseProp;
var platformGetTagNamespace;



function createASTElement (
  tag,
  attrs,
  parent
) {
  return {
    type: 1,
    tag: tag,
    attrsList: attrs,
    attrsMap: makeAttrsMap(attrs),
    parent: parent,
    children: []
  }
}

/**
 * Convert HTML string to AST.
 */
function parse (
  template,
  options
) {
  warn$2 = options.warn || baseWarn;

  platformIsPreTag = options.isPreTag || no;
  platformMustUseProp = options.mustUseProp || no;
  platformGetTagNamespace = options.getTagNamespace || no;

  transforms = pluckModuleFunction(options.modules, 'transformNode');
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');

  delimiters = options.delimiters;

  var stack = [];
  var preserveWhitespace = options.preserveWhitespace !== false;
  var root;
  var currentParent;
  var inVPre = false;
  var inPre = false;
  var warned = false;

  function warnOnce (msg) {
    if (!warned) {
      warned = true;
      warn$2(msg);
    }
  }

  function closeElement (element) {
    // check pre state
    if (element.pre) {
      inVPre = false;
    }
    if (platformIsPreTag(element.tag)) {
      inPre = false;
    }
    // apply post-transforms
    for (var i = 0; i < postTransforms.length; i++) {
      postTransforms[i](element, options);
    }
  }

  parseHTML(template, {
    warn: warn$2,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
    shouldKeepComment: options.comments,
    start: function start (tag, attrs, unary) {
      // check namespace.
      // inherit parent ns if there is one
      var ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);

      // handle IE svg bug
      /* istanbul ignore if */
      if (isIE && ns === 'svg') {
        attrs = guardIESVGBug(attrs);
      }

      var element = createASTElement(tag, attrs, currentParent);
      if (ns) {
        element.ns = ns;
      }

      if (isForbiddenTag(element) && !isServerRendering()) {
        element.forbidden = true;
        "development" !== 'production' && warn$2(
          'Templates should only be responsible for mapping the state to the ' +
          'UI. Avoid placing tags with side-effects in your templates, such as ' +
          "<" + tag + ">" + ', as they will not be parsed.'
        );
      }

      // apply pre-transforms
      for (var i = 0; i < preTransforms.length; i++) {
        element = preTransforms[i](element, options) || element;
      }

      if (!inVPre) {
        processPre(element);
        if (element.pre) {
          inVPre = true;
        }
      }
      if (platformIsPreTag(element.tag)) {
        inPre = true;
      }
      if (inVPre) {
        processRawAttrs(element);
      } else if (!element.processed) {
        // structural directives
        processFor(element);
        processIf(element);
        processOnce(element);
        // element-scope stuff
        processElement(element, options);
      }

      function checkRootConstraints (el) {
        {
          if (el.tag === 'slot' || el.tag === 'template') {
            warnOnce(
              "Cannot use <" + (el.tag) + "> as component root element because it may " +
              'contain multiple nodes.'
            );
          }
          if (el.attrsMap.hasOwnProperty('v-for')) {
            warnOnce(
              'Cannot use v-for on stateful component root element because ' +
              'it renders multiple elements.'
            );
          }
        }
      }

      // tree management
      if (!root) {
        root = element;
        checkRootConstraints(root);
      } else if (!stack.length) {
        // allow root elements with v-if, v-else-if and v-else
        if (root.if && (element.elseif || element.else)) {
          checkRootConstraints(element);
          addIfCondition(root, {
            exp: element.elseif,
            block: element
          });
        } else {
          warnOnce(
            "Component template should contain exactly one root element. " +
            "If you are using v-if on multiple elements, " +
            "use v-else-if to chain them instead."
          );
        }
      }
      if (currentParent && !element.forbidden) {
        if (element.elseif || element.else) {
          processIfConditions(element, currentParent);
        } else if (element.slotScope) { // scoped slot
          currentParent.plain = false;
          var name = element.slotTarget || '"default"';(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
        } else {
          currentParent.children.push(element);
          element.parent = currentParent;
        }
      }
      if (!unary) {
        currentParent = element;
        stack.push(element);
      } else {
        closeElement(element);
      }
    },

    end: function end () {
      // remove trailing whitespace
      var element = stack[stack.length - 1];
      var lastNode = element.children[element.children.length - 1];
      if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
        element.children.pop();
      }
      // pop stack
      stack.length -= 1;
      currentParent = stack[stack.length - 1];
      closeElement(element);
    },

    chars: function chars (text) {
      if (!currentParent) {
        {
          if (text === template) {
            warnOnce(
              'Component template requires a root element, rather than just text.'
            );
          } else if ((text = text.trim())) {
            warnOnce(
              ("text \"" + text + "\" outside root element will be ignored.")
            );
          }
        }
        return
      }
      // IE textarea placeholder bug
      /* istanbul ignore if */
      if (isIE &&
        currentParent.tag === 'textarea' &&
        currentParent.attrsMap.placeholder === text
      ) {
        return
      }
      var children = currentParent.children;
      text = inPre || text.trim()
        ? isTextTag(currentParent) ? text : decodeHTMLCached(text)
        // only preserve whitespace if its not right after a starting tag
        : preserveWhitespace && children.length ? ' ' : '';
      if (text) {
        var res;
        if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))) {
          children.push({
            type: 2,
            expression: res.expression,
            tokens: res.tokens,
            text: text
          });
        } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
          children.push({
            type: 3,
            text: text
          });
        }
      }
    },
    comment: function comment (text) {
      currentParent.children.push({
        type: 3,
        text: text,
        isComment: true
      });
    }
  });
  return root
}

function processPre (el) {
  if (getAndRemoveAttr(el, 'v-pre') != null) {
    el.pre = true;
  }
}

function processRawAttrs (el) {
  var l = el.attrsList.length;
  if (l) {
    var attrs = el.attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      attrs[i] = {
        name: el.attrsList[i].name,
        value: JSON.stringify(el.attrsList[i].value)
      };
    }
  } else if (!el.pre) {
    // non root node in pre blocks with no attributes
    el.plain = true;
  }
}

function processElement (element, options) {
  processKey(element);

  // determine whether this is a plain element after
  // removing structural attributes
  element.plain = !element.key && !element.attrsList.length;

  processRef(element);
  processSlot(element);
  processComponent(element);
  for (var i = 0; i < transforms.length; i++) {
    element = transforms[i](element, options) || element;
  }
  processAttrs(element);
}

function processKey (el) {
  var exp = getBindingAttr(el, 'key');
  if (exp) {
    if ("development" !== 'production' && el.tag === 'template') {
      warn$2("<template> cannot be keyed. Place the key on real elements instead.");
    }
    el.key = exp;
  }
}

function processRef (el) {
  var ref = getBindingAttr(el, 'ref');
  if (ref) {
    el.ref = ref;
    el.refInFor = checkInFor(el);
  }
}

function processFor (el) {
  var exp;
  if ((exp = getAndRemoveAttr(el, 'v-for'))) {
    var res = parseFor(exp);
    if (res) {
      extend(el, res);
    } else {
      warn$2(
        ("Invalid v-for expression: " + exp)
      );
    }
  }
}

function parseFor (exp) {
  var inMatch = exp.match(forAliasRE);
  if (!inMatch) { return }
  var res = {};
  res.for = inMatch[2].trim();
  var alias = inMatch[1].trim().replace(stripParensRE, '');
  var iteratorMatch = alias.match(forIteratorRE);
  if (iteratorMatch) {
    res.alias = alias.replace(forIteratorRE, '');
    res.iterator1 = iteratorMatch[1].trim();
    if (iteratorMatch[2]) {
      res.iterator2 = iteratorMatch[2].trim();
    }
  } else {
    res.alias = alias;
  }
  return res
}

function processIf (el) {
  var exp = getAndRemoveAttr(el, 'v-if');
  if (exp) {
    el.if = exp;
    addIfCondition(el, {
      exp: exp,
      block: el
    });
  } else {
    if (getAndRemoveAttr(el, 'v-else') != null) {
      el.else = true;
    }
    var elseif = getAndRemoveAttr(el, 'v-else-if');
    if (elseif) {
      el.elseif = elseif;
    }
  }
}

function processIfConditions (el, parent) {
  var prev = findPrevElement(parent.children);
  if (prev && prev.if) {
    addIfCondition(prev, {
      exp: el.elseif,
      block: el
    });
  } else {
    warn$2(
      "v-" + (el.elseif ? ('else-if="' + el.elseif + '"') : 'else') + " " +
      "used on element <" + (el.tag) + "> without corresponding v-if."
    );
  }
}

function findPrevElement (children) {
  var i = children.length;
  while (i--) {
    if (children[i].type === 1) {
      return children[i]
    } else {
      if ("development" !== 'production' && children[i].text !== ' ') {
        warn$2(
          "text \"" + (children[i].text.trim()) + "\" between v-if and v-else(-if) " +
          "will be ignored."
        );
      }
      children.pop();
    }
  }
}

function addIfCondition (el, condition) {
  if (!el.ifConditions) {
    el.ifConditions = [];
  }
  el.ifConditions.push(condition);
}

function processOnce (el) {
  var once$$1 = getAndRemoveAttr(el, 'v-once');
  if (once$$1 != null) {
    el.once = true;
  }
}

function processSlot (el) {
  if (el.tag === 'slot') {
    el.slotName = getBindingAttr(el, 'name');
    if ("development" !== 'production' && el.key) {
      warn$2(
        "`key` does not work on <slot> because slots are abstract outlets " +
        "and can possibly expand into multiple elements. " +
        "Use the key on a wrapping element instead."
      );
    }
  } else {
    var slotScope;
    if (el.tag === 'template') {
      slotScope = getAndRemoveAttr(el, 'scope');
      /* istanbul ignore if */
      if ("development" !== 'production' && slotScope) {
        warn$2(
          "the \"scope\" attribute for scoped slots have been deprecated and " +
          "replaced by \"slot-scope\" since 2.5. The new \"slot-scope\" attribute " +
          "can also be used on plain elements in addition to <template> to " +
          "denote scoped slots.",
          true
        );
      }
      el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope');
    } else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) {
      /* istanbul ignore if */
      if ("development" !== 'production' && el.attrsMap['v-for']) {
        warn$2(
          "Ambiguous combined usage of slot-scope and v-for on <" + (el.tag) + "> " +
          "(v-for takes higher priority). Use a wrapper <template> for the " +
          "scoped slot to make it clearer.",
          true
        );
      }
      el.slotScope = slotScope;
    }
    var slotTarget = getBindingAttr(el, 'slot');
    if (slotTarget) {
      el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
      // preserve slot as an attribute for native shadow DOM compat
      // only for non-scoped slots.
      if (el.tag !== 'template' && !el.slotScope) {
        addAttr(el, 'slot', slotTarget);
      }
    }
  }
}

function processComponent (el) {
  var binding;
  if ((binding = getBindingAttr(el, 'is'))) {
    el.component = binding;
  }
  if (getAndRemoveAttr(el, 'inline-template') != null) {
    el.inlineTemplate = true;
  }
}

function processAttrs (el) {
  var list = el.attrsList;
  var i, l, name, rawName, value, modifiers, isProp;
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name;
    value = list[i].value;
    if (dirRE.test(name)) {
      // mark element as dynamic
      el.hasBindings = true;
      // modifiers
      modifiers = parseModifiers(name);
      if (modifiers) {
        name = name.replace(modifierRE, '');
      }
      if (bindRE.test(name)) { // v-bind
        name = name.replace(bindRE, '');
        value = parseFilters(value);
        isProp = false;
        if (modifiers) {
          if (modifiers.prop) {
            isProp = true;
            name = camelize(name);
            if (name === 'innerHtml') { name = 'innerHTML'; }
          }
          if (modifiers.camel) {
            name = camelize(name);
          }
          if (modifiers.sync) {
            addHandler(
              el,
              ("update:" + (camelize(name))),
              genAssignmentCode(value, "$event")
            );
          }
        }
        if (isProp || (
          !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name)
        )) {
          addProp(el, name, value);
        } else {
          addAttr(el, name, value);
        }
      } else if (onRE.test(name)) { // v-on
        name = name.replace(onRE, '');
        addHandler(el, name, value, modifiers, false, warn$2);
      } else { // normal directives
        name = name.replace(dirRE, '');
        // parse arg
        var argMatch = name.match(argRE);
        var arg = argMatch && argMatch[1];
        if (arg) {
          name = name.slice(0, -(arg.length + 1));
        }
        addDirective(el, name, rawName, value, arg, modifiers);
        if ("development" !== 'production' && name === 'model') {
          checkForAliasModel(el, value);
        }
      }
    } else {
      // literal attribute
      {
        var res = parseText(value, delimiters);
        if (res) {
          warn$2(
            name + "=\"" + value + "\": " +
            'Interpolation inside attributes has been removed. ' +
            'Use v-bind or the colon shorthand instead. For example, ' +
            'instead of <div id="{{ val }}">, use <div :id="val">.'
          );
        }
      }
      addAttr(el, name, JSON.stringify(value));
      // #6887 firefox doesn't update muted state if set via attribute
      // even immediately after element creation
      if (!el.component &&
          name === 'muted' &&
          platformMustUseProp(el.tag, el.attrsMap.type, name)) {
        addProp(el, name, 'true');
      }
    }
  }
}

function checkInFor (el) {
  var parent = el;
  while (parent) {
    if (parent.for !== undefined) {
      return true
    }
    parent = parent.parent;
  }
  return false
}

function parseModifiers (name) {
  var match = name.match(modifierRE);
  if (match) {
    var ret = {};
    match.forEach(function (m) { ret[m.slice(1)] = true; });
    return ret
  }
}

function makeAttrsMap (attrs) {
  var map = {};
  for (var i = 0, l = attrs.length; i < l; i++) {
    if (
      "development" !== 'production' &&
      map[attrs[i].name] && !isIE && !isEdge
    ) {
      warn$2('duplicate attribute: ' + attrs[i].name);
    }
    map[attrs[i].name] = attrs[i].value;
  }
  return map
}

// for script (e.g. type="x/template") or style, do not decode content
function isTextTag (el) {
  return el.tag === 'script' || el.tag === 'style'
}

function isForbiddenTag (el) {
  return (
    el.tag === 'style' ||
    (el.tag === 'script' && (
      !el.attrsMap.type ||
      el.attrsMap.type === 'text/javascript'
    ))
  )
}

var ieNSBug = /^xmlns:NS\d+/;
var ieNSPrefix = /^NS\d+:/;

/* istanbul ignore next */
function guardIESVGBug (attrs) {
  var res = [];
  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];
    if (!ieNSBug.test(attr.name)) {
      attr.name = attr.name.replace(ieNSPrefix, '');
      res.push(attr);
    }
  }
  return res
}

function checkForAliasModel (el, value) {
  var _el = el;
  while (_el) {
    if (_el.for && _el.alias === value) {
      warn$2(
        "<" + (el.tag) + " v-model=\"" + value + "\">: " +
        "You are binding v-model directly to a v-for iteration alias. " +
        "This will not be able to modify the v-for source array because " +
        "writing to the alias is like modifying a function local variable. " +
        "Consider using an array of objects and use v-model on an object property instead."
      );
    }
    _el = _el.parent;
  }
}

/*  */

/**
 * Expand input[v-model] with dyanmic type bindings into v-if-else chains
 * Turn this:
 *   <input v-model="data[type]" :type="type">
 * into this:
 *   <input v-if="type === 'checkbox'" type="checkbox" v-model="data[type]">
 *   <input v-else-if="type === 'radio'" type="radio" v-model="data[type]">
 *   <input v-else :type="type" v-model="data[type]">
 */

function preTransformNode (el, options) {
  if (el.tag === 'input') {
    var map = el.attrsMap;
    if (map['v-model'] && (map['v-bind:type'] || map[':type'])) {
      var typeBinding = getBindingAttr(el, 'type');
      var ifCondition = getAndRemoveAttr(el, 'v-if', true);
      var ifConditionExtra = ifCondition ? ("&&(" + ifCondition + ")") : "";
      var hasElse = getAndRemoveAttr(el, 'v-else', true) != null;
      var elseIfCondition = getAndRemoveAttr(el, 'v-else-if', true);
      // 1. checkbox
      var branch0 = cloneASTElement(el);
      // process for on the main node
      processFor(branch0);
      addRawAttr(branch0, 'type', 'checkbox');
      processElement(branch0, options);
      branch0.processed = true; // prevent it from double-processed
      branch0.if = "(" + typeBinding + ")==='checkbox'" + ifConditionExtra;
      addIfCondition(branch0, {
        exp: branch0.if,
        block: branch0
      });
      // 2. add radio else-if condition
      var branch1 = cloneASTElement(el);
      getAndRemoveAttr(branch1, 'v-for', true);
      addRawAttr(branch1, 'type', 'radio');
      processElement(branch1, options);
      addIfCondition(branch0, {
        exp: "(" + typeBinding + ")==='radio'" + ifConditionExtra,
        block: branch1
      });
      // 3. other
      var branch2 = cloneASTElement(el);
      getAndRemoveAttr(branch2, 'v-for', true);
      addRawAttr(branch2, ':type', typeBinding);
      processElement(branch2, options);
      addIfCondition(branch0, {
        exp: ifCondition,
        block: branch2
      });

      if (hasElse) {
        branch0.else = true;
      } else if (elseIfCondition) {
        branch0.elseif = elseIfCondition;
      }

      return branch0
    }
  }
}

function cloneASTElement (el) {
  return createASTElement(el.tag, el.attrsList.slice(), el.parent)
}

var model$2 = {
  preTransformNode: preTransformNode
};

var modules$1 = [
  klass$1,
  style$1,
  model$2
];

/*  */

function text (el, dir) {
  if (dir.value) {
    addProp(el, 'textContent', ("_s(" + (dir.value) + ")"));
  }
}

/*  */

function html (el, dir) {
  if (dir.value) {
    addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"));
  }
}

var directives$1 = {
  model: model,
  text: text,
  html: html
};

/*  */

var baseOptions = {
  expectHTML: true,
  modules: modules$1,
  directives: directives$1,
  isPreTag: isPreTag,
  isUnaryTag: isUnaryTag,
  mustUseProp: mustUseProp,
  canBeLeftOpenTag: canBeLeftOpenTag,
  isReservedTag: isReservedTag,
  getTagNamespace: getTagNamespace,
  staticKeys: genStaticKeys(modules$1)
};

/*  */

var isStaticKey;
var isPlatformReservedTag;

var genStaticKeysCached = cached(genStaticKeys$1);

/**
 * Goal of the optimizer: walk the generated template AST tree
 * and detect sub-trees that are purely static, i.e. parts of
 * the DOM that never needs to change.
 *
 * Once we detect these sub-trees, we can:
 *
 * 1. Hoist them into constants, so that we no longer need to
 *    create fresh nodes for them on each re-render;
 * 2. Completely skip them in the patching process.
 */
function optimize (root, options) {
  if (!root) { return }
  isStaticKey = genStaticKeysCached(options.staticKeys || '');
  isPlatformReservedTag = options.isReservedTag || no;
  // first pass: mark all non-static nodes.
  markStatic$1(root);
  // second pass: mark static roots.
  markStaticRoots(root, false);
}

function genStaticKeys$1 (keys) {
  return makeMap(
    'type,tag,attrsList,attrsMap,plain,parent,children,attrs' +
    (keys ? ',' + keys : '')
  )
}

function markStatic$1 (node) {
  node.static = isStatic(node);
  if (node.type === 1) {
    // do not make component slot content static. this avoids
    // 1. components not able to mutate slot nodes
    // 2. static slot content fails for hot-reloading
    if (
      !isPlatformReservedTag(node.tag) &&
      node.tag !== 'slot' &&
      node.attrsMap['inline-template'] == null
    ) {
      return
    }
    for (var i = 0, l = node.children.length; i < l; i++) {
      var child = node.children[i];
      markStatic$1(child);
      if (!child.static) {
        node.static = false;
      }
    }
    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        var block = node.ifConditions[i$1].block;
        markStatic$1(block);
        if (!block.static) {
          node.static = false;
        }
      }
    }
  }
}

function markStaticRoots (node, isInFor) {
  if (node.type === 1) {
    if (node.static || node.once) {
      node.staticInFor = isInFor;
    }
    // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.
    if (node.static && node.children.length && !(
      node.children.length === 1 &&
      node.children[0].type === 3
    )) {
      node.staticRoot = true;
      return
    } else {
      node.staticRoot = false;
    }
    if (node.children) {
      for (var i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for);
      }
    }
    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        markStaticRoots(node.ifConditions[i$1].block, isInFor);
      }
    }
  }
}

function isStatic (node) {
  if (node.type === 2) { // expression
    return false
  }
  if (node.type === 3) { // text
    return true
  }
  return !!(node.pre || (
    !node.hasBindings && // no dynamic bindings
    !node.if && !node.for && // not v-if or v-for or v-else
    !isBuiltInTag(node.tag) && // not a built-in
    isPlatformReservedTag(node.tag) && // not a component
    !isDirectChildOfTemplateFor(node) &&
    Object.keys(node).every(isStaticKey)
  ))
}

function isDirectChildOfTemplateFor (node) {
  while (node.parent) {
    node = node.parent;
    if (node.tag !== 'template') {
      return false
    }
    if (node.for) {
      return true
    }
  }
  return false
}

/*  */

var fnExpRE = /^\s*([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/;
var simplePathRE = /^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/;

// keyCode aliases
var keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  'delete': [8, 46]
};

// #4868: modifiers that prevent the execution of the listener
// need to explicitly return null so that we can determine whether to remove
// the listener for .once
var genGuard = function (condition) { return ("if(" + condition + ")return null;"); };

var modifierCode = {
  stop: '$event.stopPropagation();',
  prevent: '$event.preventDefault();',
  self: genGuard("$event.target !== $event.currentTarget"),
  ctrl: genGuard("!$event.ctrlKey"),
  shift: genGuard("!$event.shiftKey"),
  alt: genGuard("!$event.altKey"),
  meta: genGuard("!$event.metaKey"),
  left: genGuard("'button' in $event && $event.button !== 0"),
  middle: genGuard("'button' in $event && $event.button !== 1"),
  right: genGuard("'button' in $event && $event.button !== 2")
};

function genHandlers (
  events,
  isNative,
  warn
) {
  var res = isNative ? 'nativeOn:{' : 'on:{';
  for (var name in events) {
    res += "\"" + name + "\":" + (genHandler(name, events[name])) + ",";
  }
  return res.slice(0, -1) + '}'
}

function genHandler (
  name,
  handler
) {
  if (!handler) {
    return 'function(){}'
  }

  if (Array.isArray(handler)) {
    return ("[" + (handler.map(function (handler) { return genHandler(name, handler); }).join(',')) + "]")
  }

  var isMethodPath = simplePathRE.test(handler.value);
  var isFunctionExpression = fnExpRE.test(handler.value);

  if (!handler.modifiers) {
    if (isMethodPath || isFunctionExpression) {
      return handler.value
    }
    /* istanbul ignore if */
    return ("function($event){" + (handler.value) + "}") // inline statement
  } else {
    var code = '';
    var genModifierCode = '';
    var keys = [];
    for (var key in handler.modifiers) {
      if (modifierCode[key]) {
        genModifierCode += modifierCode[key];
        // left/right
        if (keyCodes[key]) {
          keys.push(key);
        }
      } else if (key === 'exact') {
        var modifiers = (handler.modifiers);
        genModifierCode += genGuard(
          ['ctrl', 'shift', 'alt', 'meta']
            .filter(function (keyModifier) { return !modifiers[keyModifier]; })
            .map(function (keyModifier) { return ("$event." + keyModifier + "Key"); })
            .join('||')
        );
      } else {
        keys.push(key);
      }
    }
    if (keys.length) {
      code += genKeyFilter(keys);
    }
    // Make sure modifiers like prevent and stop get executed after key filtering
    if (genModifierCode) {
      code += genModifierCode;
    }
    var handlerCode = isMethodPath
      ? handler.value + '($event)'
      : isFunctionExpression
        ? ("(" + (handler.value) + ")($event)")
        : handler.value;
    /* istanbul ignore if */
    return ("function($event){" + code + handlerCode + "}")
  }
}

function genKeyFilter (keys) {
  return ("if(!('button' in $event)&&" + (keys.map(genFilterCode).join('&&')) + ")return null;")
}

function genFilterCode (key) {
  var keyVal = parseInt(key, 10);
  if (keyVal) {
    return ("$event.keyCode!==" + keyVal)
  }
  var code = keyCodes[key];
  return (
    "_k($event.keyCode," +
    (JSON.stringify(key)) + "," +
    (JSON.stringify(code)) + "," +
    "$event.key)"
  )
}

/*  */

function on (el, dir) {
  if ("development" !== 'production' && dir.modifiers) {
    warn("v-on without argument does not support modifiers.");
  }
  el.wrapListeners = function (code) { return ("_g(" + code + "," + (dir.value) + ")"); };
}

/*  */

function bind$1 (el, dir) {
  el.wrapData = function (code) {
    return ("_b(" + code + ",'" + (el.tag) + "'," + (dir.value) + "," + (dir.modifiers && dir.modifiers.prop ? 'true' : 'false') + (dir.modifiers && dir.modifiers.sync ? ',true' : '') + ")")
  };
}

/*  */

var baseDirectives = {
  on: on,
  bind: bind$1,
  cloak: noop
};

/*  */

var CodegenState = function CodegenState (options) {
  this.options = options;
  this.warn = options.warn || baseWarn;
  this.transforms = pluckModuleFunction(options.modules, 'transformCode');
  this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
  this.directives = extend(extend({}, baseDirectives), options.directives);
  var isReservedTag = options.isReservedTag || no;
  this.maybeComponent = function (el) { return !isReservedTag(el.tag); };
  this.onceId = 0;
  this.staticRenderFns = [];
};



function generate (
  ast,
  options
) {
  var state = new CodegenState(options);
  var code = ast ? genElement(ast, state) : '_c("div")';
  return {
    render: ("with(this){return " + code + "}"),
    staticRenderFns: state.staticRenderFns
  }
}

function genElement (el, state) {
  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state)
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el, state)
  } else if (el.for && !el.forProcessed) {
    return genFor(el, state)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.tag === 'template' && !el.slotTarget) {
    return genChildren(el, state) || 'void 0'
  } else if (el.tag === 'slot') {
    return genSlot(el, state)
  } else {
    // component or element
    var code;
    if (el.component) {
      code = genComponent(el.component, el, state);
    } else {
      var data = el.plain ? undefined : genData$2(el, state);

      var children = el.inlineTemplate ? null : genChildren(el, state, true);
      code = "_c('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
    }
    // module transforms
    for (var i = 0; i < state.transforms.length; i++) {
      code = state.transforms[i](el, code);
    }
    return code
  }
}

// hoist static sub-trees out
function genStatic (el, state) {
  el.staticProcessed = true;
  state.staticRenderFns.push(("with(this){return " + (genElement(el, state)) + "}"));
  return ("_m(" + (state.staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")")
}

// v-once
function genOnce (el, state) {
  el.onceProcessed = true;
  if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.staticInFor) {
    var key = '';
    var parent = el.parent;
    while (parent) {
      if (parent.for) {
        key = parent.key;
        break
      }
      parent = parent.parent;
    }
    if (!key) {
      "development" !== 'production' && state.warn(
        "v-once can only be used inside v-for that is keyed. "
      );
      return genElement(el, state)
    }
    return ("_o(" + (genElement(el, state)) + "," + (state.onceId++) + "," + key + ")")
  } else {
    return genStatic(el, state)
  }
}

function genIf (
  el,
  state,
  altGen,
  altEmpty
) {
  el.ifProcessed = true; // avoid recursion
  return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty)
}

function genIfConditions (
  conditions,
  state,
  altGen,
  altEmpty
) {
  if (!conditions.length) {
    return altEmpty || '_e()'
  }

  var condition = conditions.shift();
  if (condition.exp) {
    return ("(" + (condition.exp) + ")?" + (genTernaryExp(condition.block)) + ":" + (genIfConditions(conditions, state, altGen, altEmpty)))
  } else {
    return ("" + (genTernaryExp(condition.block)))
  }

  // v-if with v-once should generate code like (a)?_m(0):_m(1)
  function genTernaryExp (el) {
    return altGen
      ? altGen(el, state)
      : el.once
        ? genOnce(el, state)
        : genElement(el, state)
  }
}

function genFor (
  el,
  state,
  altGen,
  altHelper
) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';

  if ("development" !== 'production' &&
    state.maybeComponent(el) &&
    el.tag !== 'slot' &&
    el.tag !== 'template' &&
    !el.key
  ) {
    state.warn(
      "<" + (el.tag) + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " +
      "v-for should have explicit keys. " +
      "See https://vuejs.org/guide/list.html#key for more info.",
      true /* tip */
    );
  }

  el.forProcessed = true; // avoid recursion
  return (altHelper || '_l') + "((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + ((altGen || genElement)(el, state)) +
    '})'
}

function genData$2 (el, state) {
  var data = '{';

  // directives first.
  // directives may mutate the el's other properties before they are generated.
  var dirs = genDirectives(el, state);
  if (dirs) { data += dirs + ','; }

  // key
  if (el.key) {
    data += "key:" + (el.key) + ",";
  }
  // ref
  if (el.ref) {
    data += "ref:" + (el.ref) + ",";
  }
  if (el.refInFor) {
    data += "refInFor:true,";
  }
  // pre
  if (el.pre) {
    data += "pre:true,";
  }
  // record original tag name for components using "is" attribute
  if (el.component) {
    data += "tag:\"" + (el.tag) + "\",";
  }
  // module data generation functions
  for (var i = 0; i < state.dataGenFns.length; i++) {
    data += state.dataGenFns[i](el);
  }
  // attributes
  if (el.attrs) {
    data += "attrs:{" + (genProps(el.attrs)) + "},";
  }
  // DOM props
  if (el.props) {
    data += "domProps:{" + (genProps(el.props)) + "},";
  }
  // event handlers
  if (el.events) {
    data += (genHandlers(el.events, false, state.warn)) + ",";
  }
  if (el.nativeEvents) {
    data += (genHandlers(el.nativeEvents, true, state.warn)) + ",";
  }
  // slot target
  // only for non-scoped slots
  if (el.slotTarget && !el.slotScope) {
    data += "slot:" + (el.slotTarget) + ",";
  }
  // scoped slots
  if (el.scopedSlots) {
    data += (genScopedSlots(el.scopedSlots, state)) + ",";
  }
  // component v-model
  if (el.model) {
    data += "model:{value:" + (el.model.value) + ",callback:" + (el.model.callback) + ",expression:" + (el.model.expression) + "},";
  }
  // inline-template
  if (el.inlineTemplate) {
    var inlineTemplate = genInlineTemplate(el, state);
    if (inlineTemplate) {
      data += inlineTemplate + ",";
    }
  }
  data = data.replace(/,$/, '') + '}';
  // v-bind data wrap
  if (el.wrapData) {
    data = el.wrapData(data);
  }
  // v-on data wrap
  if (el.wrapListeners) {
    data = el.wrapListeners(data);
  }
  return data
}

function genDirectives (el, state) {
  var dirs = el.directives;
  if (!dirs) { return }
  var res = 'directives:[';
  var hasRuntime = false;
  var i, l, dir, needRuntime;
  for (i = 0, l = dirs.length; i < l; i++) {
    dir = dirs[i];
    needRuntime = true;
    var gen = state.directives[dir.name];
    if (gen) {
      // compile-time directive that manipulates AST.
      // returns true if it also needs a runtime counterpart.
      needRuntime = !!gen(el, dir, state.warn);
    }
    if (needRuntime) {
      hasRuntime = true;
      res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value))) : '') + (dir.arg ? (",arg:\"" + (dir.arg) + "\"") : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
    }
  }
  if (hasRuntime) {
    return res.slice(0, -1) + ']'
  }
}

function genInlineTemplate (el, state) {
  var ast = el.children[0];
  if ("development" !== 'production' && (
    el.children.length !== 1 || ast.type !== 1
  )) {
    state.warn('Inline-template components must have exactly one child element.');
  }
  if (ast.type === 1) {
    var inlineRenderFns = generate(ast, state.options);
    return ("inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns.map(function (code) { return ("function(){" + code + "}"); }).join(',')) + "]}")
  }
}

function genScopedSlots (
  slots,
  state
) {
  return ("scopedSlots:_u([" + (Object.keys(slots).map(function (key) {
      return genScopedSlot(key, slots[key], state)
    }).join(',')) + "])")
}

function genScopedSlot (
  key,
  el,
  state
) {
  if (el.for && !el.forProcessed) {
    return genForScopedSlot(key, el, state)
  }
  var fn = "function(" + (String(el.slotScope)) + "){" +
    "return " + (el.tag === 'template'
      ? el.if
        ? ((el.if) + "?" + (genChildren(el, state) || 'undefined') + ":undefined")
        : genChildren(el, state) || 'undefined'
      : genElement(el, state)) + "}";
  return ("{key:" + key + ",fn:" + fn + "}")
}

function genForScopedSlot (
  key,
  el,
  state
) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';
  el.forProcessed = true; // avoid recursion
  return "_l((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + (genScopedSlot(key, el, state)) +
    '})'
}

function genChildren (
  el,
  state,
  checkSkip,
  altGenElement,
  altGenNode
) {
  var children = el.children;
  if (children.length) {
    var el$1 = children[0];
    // optimize single v-for
    if (children.length === 1 &&
      el$1.for &&
      el$1.tag !== 'template' &&
      el$1.tag !== 'slot'
    ) {
      return (altGenElement || genElement)(el$1, state)
    }
    var normalizationType = checkSkip
      ? getNormalizationType(children, state.maybeComponent)
      : 0;
    var gen = altGenNode || genNode;
    return ("[" + (children.map(function (c) { return gen(c, state); }).join(',')) + "]" + (normalizationType ? ("," + normalizationType) : ''))
  }
}

// determine the normalization needed for the children array.
// 0: no normalization needed
// 1: simple normalization needed (possible 1-level deep nested array)
// 2: full normalization needed
function getNormalizationType (
  children,
  maybeComponent
) {
  var res = 0;
  for (var i = 0; i < children.length; i++) {
    var el = children[i];
    if (el.type !== 1) {
      continue
    }
    if (needsNormalization(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return needsNormalization(c.block); }))) {
      res = 2;
      break
    }
    if (maybeComponent(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return maybeComponent(c.block); }))) {
      res = 1;
    }
  }
  return res
}

function needsNormalization (el) {
  return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
}

function genNode (node, state) {
  if (node.type === 1) {
    return genElement(node, state)
  } if (node.type === 3 && node.isComment) {
    return genComment(node)
  } else {
    return genText(node)
  }
}

function genText (text) {
  return ("_v(" + (text.type === 2
    ? text.expression // no need for () because already wrapped in _s()
    : transformSpecialNewlines(JSON.stringify(text.text))) + ")")
}

function genComment (comment) {
  return ("_e(" + (JSON.stringify(comment.text)) + ")")
}

function genSlot (el, state) {
  var slotName = el.slotName || '"default"';
  var children = genChildren(el, state);
  var res = "_t(" + slotName + (children ? ("," + children) : '');
  var attrs = el.attrs && ("{" + (el.attrs.map(function (a) { return ((camelize(a.name)) + ":" + (a.value)); }).join(',')) + "}");
  var bind$$1 = el.attrsMap['v-bind'];
  if ((attrs || bind$$1) && !children) {
    res += ",null";
  }
  if (attrs) {
    res += "," + attrs;
  }
  if (bind$$1) {
    res += (attrs ? '' : ',null') + "," + bind$$1;
  }
  return res + ')'
}

// componentName is el.component, take it as argument to shun flow's pessimistic refinement
function genComponent (
  componentName,
  el,
  state
) {
  var children = el.inlineTemplate ? null : genChildren(el, state, true);
  return ("_c(" + componentName + "," + (genData$2(el, state)) + (children ? ("," + children) : '') + ")")
}

function genProps (props) {
  var res = '';
  for (var i = 0; i < props.length; i++) {
    var prop = props[i];
    /* istanbul ignore if */
    {
      res += "\"" + (prop.name) + "\":" + (transformSpecialNewlines(prop.value)) + ",";
    }
  }
  return res.slice(0, -1)
}

// #3895, #4268
function transformSpecialNewlines (text) {
  return text
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

/*  */

// these keywords should not appear inside expressions, but operators like
// typeof, instanceof and in are allowed
var prohibitedKeywordRE = new RegExp('\\b' + (
  'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
  'super,throw,while,yield,delete,export,import,return,switch,default,' +
  'extends,finally,continue,debugger,function,arguments'
).split(',').join('\\b|\\b') + '\\b');

// these unary operators should not be used as property/method names
var unaryOperatorsRE = new RegExp('\\b' + (
  'delete,typeof,void'
).split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)');

// strip strings in expressions
var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

// detect problematic expressions in a template
function detectErrors (ast) {
  var errors = [];
  if (ast) {
    checkNode(ast, errors);
  }
  return errors
}

function checkNode (node, errors) {
  if (node.type === 1) {
    for (var name in node.attrsMap) {
      if (dirRE.test(name)) {
        var value = node.attrsMap[name];
        if (value) {
          if (name === 'v-for') {
            checkFor(node, ("v-for=\"" + value + "\""), errors);
          } else if (onRE.test(name)) {
            checkEvent(value, (name + "=\"" + value + "\""), errors);
          } else {
            checkExpression(value, (name + "=\"" + value + "\""), errors);
          }
        }
      }
    }
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        checkNode(node.children[i], errors);
      }
    }
  } else if (node.type === 2) {
    checkExpression(node.expression, node.text, errors);
  }
}

function checkEvent (exp, text, errors) {
  var stipped = exp.replace(stripStringRE, '');
  var keywordMatch = stipped.match(unaryOperatorsRE);
  if (keywordMatch && stipped.charAt(keywordMatch.index - 1) !== '$') {
    errors.push(
      "avoid using JavaScript unary operator as property name: " +
      "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim())
    );
  }
  checkExpression(exp, text, errors);
}

function checkFor (node, text, errors) {
  checkExpression(node.for || '', text, errors);
  checkIdentifier(node.alias, 'v-for alias', text, errors);
  checkIdentifier(node.iterator1, 'v-for iterator', text, errors);
  checkIdentifier(node.iterator2, 'v-for iterator', text, errors);
}

function checkIdentifier (
  ident,
  type,
  text,
  errors
) {
  if (typeof ident === 'string') {
    try {
      new Function(("var " + ident + "=_"));
    } catch (e) {
      errors.push(("invalid " + type + " \"" + ident + "\" in expression: " + (text.trim())));
    }
  }
}

function checkExpression (exp, text, errors) {
  try {
    new Function(("return " + exp));
  } catch (e) {
    var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
    if (keywordMatch) {
      errors.push(
        "avoid using JavaScript keyword as property name: " +
        "\"" + (keywordMatch[0]) + "\"\n  Raw expression: " + (text.trim())
      );
    } else {
      errors.push(
        "invalid expression: " + (e.message) + " in\n\n" +
        "    " + exp + "\n\n" +
        "  Raw expression: " + (text.trim()) + "\n"
      );
    }
  }
}

/*  */

function createFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err: err, code: code });
    return noop
  }
}

function createCompileToFunctionFn (compile) {
  var cache = Object.create(null);

  return function compileToFunctions (
    template,
    options,
    vm
  ) {
    options = extend({}, options);
    var warn$$1 = options.warn || warn;
    delete options.warn;

    /* istanbul ignore if */
    {
      // detect possible CSP restriction
      try {
        new Function('return 1');
      } catch (e) {
        if (e.toString().match(/unsafe-eval|CSP/)) {
          warn$$1(
            'It seems you are using the standalone build of Vue.js in an ' +
            'environment with Content Security Policy that prohibits unsafe-eval. ' +
            'The template compiler cannot work in this environment. Consider ' +
            'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
            'templates into render functions.'
          );
        }
      }
    }

    // check cache
    var key = options.delimiters
      ? String(options.delimiters) + template
      : template;
    if (cache[key]) {
      return cache[key]
    }

    // compile
    var compiled = compile(template, options);

    // check compilation errors/tips
    {
      if (compiled.errors && compiled.errors.length) {
        warn$$1(
          "Error compiling template:\n\n" + template + "\n\n" +
          compiled.errors.map(function (e) { return ("- " + e); }).join('\n') + '\n',
          vm
        );
      }
      if (compiled.tips && compiled.tips.length) {
        compiled.tips.forEach(function (msg) { return tip(msg, vm); });
      }
    }

    // turn code into functions
    var res = {};
    var fnGenErrors = [];
    res.render = createFunction(compiled.render, fnGenErrors);
    res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
      return createFunction(code, fnGenErrors)
    });

    // check function generation errors.
    // this should only happen if there is a bug in the compiler itself.
    // mostly for codegen development use
    /* istanbul ignore if */
    {
      if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
        warn$$1(
          "Failed to generate render function:\n\n" +
          fnGenErrors.map(function (ref) {
            var err = ref.err;
            var code = ref.code;

            return ((err.toString()) + " in\n\n" + code + "\n");
        }).join('\n'),
          vm
        );
      }
    }

    return (cache[key] = res)
  }
}

/*  */

function createCompilerCreator (baseCompile) {
  return function createCompiler (baseOptions) {
    function compile (
      template,
      options
    ) {
      var finalOptions = Object.create(baseOptions);
      var errors = [];
      var tips = [];
      finalOptions.warn = function (msg, tip) {
        (tip ? tips : errors).push(msg);
      };

      if (options) {
        // merge custom modules
        if (options.modules) {
          finalOptions.modules =
            (baseOptions.modules || []).concat(options.modules);
        }
        // merge custom directives
        if (options.directives) {
          finalOptions.directives = extend(
            Object.create(baseOptions.directives || null),
            options.directives
          );
        }
        // copy other options
        for (var key in options) {
          if (key !== 'modules' && key !== 'directives') {
            finalOptions[key] = options[key];
          }
        }
      }

      var compiled = baseCompile(template, finalOptions);
      {
        errors.push.apply(errors, detectErrors(compiled.ast));
      }
      compiled.errors = errors;
      compiled.tips = tips;
      return compiled
    }

    return {
      compile: compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }
}

/*  */

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
var createCompiler = createCompilerCreator(function baseCompile (
  template,
  options
) {
  var ast = parse(template.trim(), options);
  if (options.optimize !== false) {
    optimize(ast, options);
  }
  var code = generate(ast, options);
  return {
    ast: ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
});

/*  */

var ref$1 = createCompiler(baseOptions);
var compileToFunctions = ref$1.compileToFunctions;

/*  */

// check whether current browser encodes a char inside attribute values
var div;
function getShouldDecode (href) {
  div = div || document.createElement('div');
  div.innerHTML = href ? "<a href=\"\n\"/>" : "<div a=\"\n\"/>";
  return div.innerHTML.indexOf('&#10;') > 0
}

// #3663: IE encodes newlines inside attribute values while other browsers don't
var shouldDecodeNewlines = inBrowser ? getShouldDecode(false) : false;
// #6828: chrome encodes content in a[href]
var shouldDecodeNewlinesForHref = inBrowser ? getShouldDecode(true) : false;

/*  */

var idToTemplate = cached(function (id) {
  var el = query(id);
  return el && el.innerHTML
});

var mount = Vue$3.prototype.$mount;
Vue$3.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && query(el);

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    "development" !== 'production' && warn(
      "Do not mount Vue to <html> or <body> - mount to normal elements instead."
    );
    return this
  }

  var options = this.$options;
  // resolve template/el and convert to render function
  if (!options.render) {
    var template = options.template;
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template);
          /* istanbul ignore if */
          if ("development" !== 'production' && !template) {
            warn(
              ("Template element not found or is empty: " + (options.template)),
              this
            );
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        {
          warn('invalid template option:' + template, this);
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el);
    }
    if (template) {
      /* istanbul ignore if */
      if ("development" !== 'production' && config.performance && mark) {
        mark('compile');
      }

      var ref = compileToFunctions(template, {
        shouldDecodeNewlines: shouldDecodeNewlines,
        shouldDecodeNewlinesForHref: shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this);
      var render = ref.render;
      var staticRenderFns = ref.staticRenderFns;
      options.render = render;
      options.staticRenderFns = staticRenderFns;

      /* istanbul ignore if */
      if ("development" !== 'production' && config.performance && mark) {
        mark('compile end');
        measure(("vue " + (this._name) + " compile"), 'compile', 'compile end');
      }
    }
  }
  return mount.call(this, el, hydrating)
};

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML (el) {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    var container = document.createElement('div');
    container.appendChild(el.cloneNode(true));
    return container.innerHTML
  }
}

Vue$3.compile = compileToFunctions;

return Vue$3;

})));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9), __webpack_require__(10).setImmediate))

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9), __webpack_require__(11)))

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

/**
  * vue-router v3.0.1
  * (c) 2017 Evan You
  * @license MIT
  */
(function (global, factory) {
	 true ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.VueRouter = factory());
}(this, (function () { 'use strict';

/*  */

function assert (condition, message) {
  if (!condition) {
    throw new Error(("[vue-router] " + message))
  }
}

function warn (condition, message) {
  if ("development" !== 'production' && !condition) {
    typeof console !== 'undefined' && console.warn(("[vue-router] " + message));
  }
}

function isError (err) {
  return Object.prototype.toString.call(err).indexOf('Error') > -1
}

var View = {
  name: 'router-view',
  functional: true,
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  render: function render (_, ref) {
    var props = ref.props;
    var children = ref.children;
    var parent = ref.parent;
    var data = ref.data;

    data.routerView = true;

    // directly use parent context's createElement() function
    // so that components rendered by router-view can resolve named slots
    var h = parent.$createElement;
    var name = props.name;
    var route = parent.$route;
    var cache = parent._routerViewCache || (parent._routerViewCache = {});

    // determine current view depth, also check to see if the tree
    // has been toggled inactive but kept-alive.
    var depth = 0;
    var inactive = false;
    while (parent && parent._routerRoot !== parent) {
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++;
      }
      if (parent._inactive) {
        inactive = true;
      }
      parent = parent.$parent;
    }
    data.routerViewDepth = depth;

    // render previous view if the tree is inactive and kept-alive
    if (inactive) {
      return h(cache[name], data, children)
    }

    var matched = route.matched[depth];
    // render empty node if no matched route
    if (!matched) {
      cache[name] = null;
      return h()
    }

    var component = cache[name] = matched.components[name];

    // attach instance registration hook
    // this will be called in the instance's injected lifecycle hooks
    data.registerRouteInstance = function (vm, val) {
      // val could be undefined for unregistration
      var current = matched.instances[name];
      if (
        (val && current !== vm) ||
        (!val && current === vm)
      ) {
        matched.instances[name] = val;
      }
    }

    // also register instance in prepatch hook
    // in case the same component instance is reused across different routes
    ;(data.hook || (data.hook = {})).prepatch = function (_, vnode) {
      matched.instances[name] = vnode.componentInstance;
    };

    // resolve props
    var propsToPass = data.props = resolveProps(route, matched.props && matched.props[name]);
    if (propsToPass) {
      // clone to prevent mutation
      propsToPass = data.props = extend({}, propsToPass);
      // pass non-declared props as attrs
      var attrs = data.attrs = data.attrs || {};
      for (var key in propsToPass) {
        if (!component.props || !(key in component.props)) {
          attrs[key] = propsToPass[key];
          delete propsToPass[key];
        }
      }
    }

    return h(component, data, children)
  }
};

function resolveProps (route, config) {
  switch (typeof config) {
    case 'undefined':
      return
    case 'object':
      return config
    case 'function':
      return config(route)
    case 'boolean':
      return config ? route.params : undefined
    default:
      {
        warn(
          false,
          "props in \"" + (route.path) + "\" is a " + (typeof config) + ", " +
          "expecting an object, function or boolean."
        );
      }
  }
}

function extend (to, from) {
  for (var key in from) {
    to[key] = from[key];
  }
  return to
}

/*  */

var encodeReserveRE = /[!'()*]/g;
var encodeReserveReplacer = function (c) { return '%' + c.charCodeAt(0).toString(16); };
var commaRE = /%2C/g;

// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
var encode = function (str) { return encodeURIComponent(str)
  .replace(encodeReserveRE, encodeReserveReplacer)
  .replace(commaRE, ','); };

var decode = decodeURIComponent;

function resolveQuery (
  query,
  extraQuery,
  _parseQuery
) {
  if ( extraQuery === void 0 ) extraQuery = {};

  var parse = _parseQuery || parseQuery;
  var parsedQuery;
  try {
    parsedQuery = parse(query || '');
  } catch (e) {
    "development" !== 'production' && warn(false, e.message);
    parsedQuery = {};
  }
  for (var key in extraQuery) {
    parsedQuery[key] = extraQuery[key];
  }
  return parsedQuery
}

function parseQuery (query) {
  var res = {};

  query = query.trim().replace(/^(\?|#|&)/, '');

  if (!query) {
    return res
  }

  query.split('&').forEach(function (param) {
    var parts = param.replace(/\+/g, ' ').split('=');
    var key = decode(parts.shift());
    var val = parts.length > 0
      ? decode(parts.join('='))
      : null;

    if (res[key] === undefined) {
      res[key] = val;
    } else if (Array.isArray(res[key])) {
      res[key].push(val);
    } else {
      res[key] = [res[key], val];
    }
  });

  return res
}

function stringifyQuery (obj) {
  var res = obj ? Object.keys(obj).map(function (key) {
    var val = obj[key];

    if (val === undefined) {
      return ''
    }

    if (val === null) {
      return encode(key)
    }

    if (Array.isArray(val)) {
      var result = [];
      val.forEach(function (val2) {
        if (val2 === undefined) {
          return
        }
        if (val2 === null) {
          result.push(encode(key));
        } else {
          result.push(encode(key) + '=' + encode(val2));
        }
      });
      return result.join('&')
    }

    return encode(key) + '=' + encode(val)
  }).filter(function (x) { return x.length > 0; }).join('&') : null;
  return res ? ("?" + res) : ''
}

/*  */


var trailingSlashRE = /\/?$/;

function createRoute (
  record,
  location,
  redirectedFrom,
  router
) {
  var stringifyQuery$$1 = router && router.options.stringifyQuery;

  var query = location.query || {};
  try {
    query = clone(query);
  } catch (e) {}

  var route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query: query,
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery$$1),
    matched: record ? formatMatch(record) : []
  };
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery$$1);
  }
  return Object.freeze(route)
}

function clone (value) {
  if (Array.isArray(value)) {
    return value.map(clone)
  } else if (value && typeof value === 'object') {
    var res = {};
    for (var key in value) {
      res[key] = clone(value[key]);
    }
    return res
  } else {
    return value
  }
}

// the starting route that represents the initial state
var START = createRoute(null, {
  path: '/'
});

function formatMatch (record) {
  var res = [];
  while (record) {
    res.unshift(record);
    record = record.parent;
  }
  return res
}

function getFullPath (
  ref,
  _stringifyQuery
) {
  var path = ref.path;
  var query = ref.query; if ( query === void 0 ) query = {};
  var hash = ref.hash; if ( hash === void 0 ) hash = '';

  var stringify = _stringifyQuery || stringifyQuery;
  return (path || '/') + stringify(query) + hash
}

function isSameRoute (a, b) {
  if (b === START) {
    return a === b
  } else if (!b) {
    return false
  } else if (a.path && b.path) {
    return (
      a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query)
    )
  } else if (a.name && b.name) {
    return (
      a.name === b.name &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query) &&
      isObjectEqual(a.params, b.params)
    )
  } else {
    return false
  }
}

function isObjectEqual (a, b) {
  if ( a === void 0 ) a = {};
  if ( b === void 0 ) b = {};

  // handle null value #1566
  if (!a || !b) { return a === b }
  var aKeys = Object.keys(a);
  var bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false
  }
  return aKeys.every(function (key) {
    var aVal = a[key];
    var bVal = b[key];
    // check nested equality
    if (typeof aVal === 'object' && typeof bVal === 'object') {
      return isObjectEqual(aVal, bVal)
    }
    return String(aVal) === String(bVal)
  })
}

function isIncludedRoute (current, target) {
  return (
    current.path.replace(trailingSlashRE, '/').indexOf(
      target.path.replace(trailingSlashRE, '/')
    ) === 0 &&
    (!target.hash || current.hash === target.hash) &&
    queryIncludes(current.query, target.query)
  )
}

function queryIncludes (current, target) {
  for (var key in target) {
    if (!(key in current)) {
      return false
    }
  }
  return true
}

/*  */

// work around weird flow bug
var toTypes = [String, Object];
var eventTypes = [String, Array];

var Link = {
  name: 'router-link',
  props: {
    to: {
      type: toTypes,
      required: true
    },
    tag: {
      type: String,
      default: 'a'
    },
    exact: Boolean,
    append: Boolean,
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    event: {
      type: eventTypes,
      default: 'click'
    }
  },
  render: function render (h) {
    var this$1 = this;

    var router = this.$router;
    var current = this.$route;
    var ref = router.resolve(this.to, current, this.append);
    var location = ref.location;
    var route = ref.route;
    var href = ref.href;

    var classes = {};
    var globalActiveClass = router.options.linkActiveClass;
    var globalExactActiveClass = router.options.linkExactActiveClass;
    // Support global empty active class
    var activeClassFallback = globalActiveClass == null
            ? 'router-link-active'
            : globalActiveClass;
    var exactActiveClassFallback = globalExactActiveClass == null
            ? 'router-link-exact-active'
            : globalExactActiveClass;
    var activeClass = this.activeClass == null
            ? activeClassFallback
            : this.activeClass;
    var exactActiveClass = this.exactActiveClass == null
            ? exactActiveClassFallback
            : this.exactActiveClass;
    var compareTarget = location.path
      ? createRoute(null, location, null, router)
      : route;

    classes[exactActiveClass] = isSameRoute(current, compareTarget);
    classes[activeClass] = this.exact
      ? classes[exactActiveClass]
      : isIncludedRoute(current, compareTarget);

    var handler = function (e) {
      if (guardEvent(e)) {
        if (this$1.replace) {
          router.replace(location);
        } else {
          router.push(location);
        }
      }
    };

    var on = { click: guardEvent };
    if (Array.isArray(this.event)) {
      this.event.forEach(function (e) { on[e] = handler; });
    } else {
      on[this.event] = handler;
    }

    var data = {
      class: classes
    };

    if (this.tag === 'a') {
      data.on = on;
      data.attrs = { href: href };
    } else {
      // find the first <a> child and apply listener and href
      var a = findAnchor(this.$slots.default);
      if (a) {
        // in case the <a> is a static node
        a.isStatic = false;
        var extend = _Vue.util.extend;
        var aData = a.data = extend({}, a.data);
        aData.on = on;
        var aAttrs = a.data.attrs = extend({}, a.data.attrs);
        aAttrs.href = href;
      } else {
        // doesn't have <a> child, apply listener to self
        data.on = on;
      }
    }

    return h(this.tag, data, this.$slots.default)
  }
};

function guardEvent (e) {
  // don't redirect with control keys
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) { return }
  // don't redirect when preventDefault called
  if (e.defaultPrevented) { return }
  // don't redirect on right click
  if (e.button !== undefined && e.button !== 0) { return }
  // don't redirect if `target="_blank"`
  if (e.currentTarget && e.currentTarget.getAttribute) {
    var target = e.currentTarget.getAttribute('target');
    if (/\b_blank\b/i.test(target)) { return }
  }
  // this may be a Weex event which doesn't have this method
  if (e.preventDefault) {
    e.preventDefault();
  }
  return true
}

function findAnchor (children) {
  if (children) {
    var child;
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      if (child.tag === 'a') {
        return child
      }
      if (child.children && (child = findAnchor(child.children))) {
        return child
      }
    }
  }
}

var _Vue;

function install (Vue) {
  if (install.installed && _Vue === Vue) { return }
  install.installed = true;

  _Vue = Vue;

  var isDef = function (v) { return v !== undefined; };

  var registerInstance = function (vm, callVal) {
    var i = vm.$options._parentVnode;
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal);
    }
  };

  Vue.mixin({
    beforeCreate: function beforeCreate () {
      if (isDef(this.$options.router)) {
        this._routerRoot = this;
        this._router = this.$options.router;
        this._router.init(this);
        Vue.util.defineReactive(this, '_route', this._router.history.current);
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
      }
      registerInstance(this, this);
    },
    destroyed: function destroyed () {
      registerInstance(this);
    }
  });

  Object.defineProperty(Vue.prototype, '$router', {
    get: function get () { return this._routerRoot._router }
  });

  Object.defineProperty(Vue.prototype, '$route', {
    get: function get () { return this._routerRoot._route }
  });

  Vue.component('router-view', View);
  Vue.component('router-link', Link);

  var strats = Vue.config.optionMergeStrategies;
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created;
}

/*  */

var inBrowser = typeof window !== 'undefined';

/*  */

function resolvePath (
  relative,
  base,
  append
) {
  var firstChar = relative.charAt(0);
  if (firstChar === '/') {
    return relative
  }

  if (firstChar === '?' || firstChar === '#') {
    return base + relative
  }

  var stack = base.split('/');

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop();
  }

  // resolve relative path
  var segments = relative.replace(/^\//, '').split('/');
  for (var i = 0; i < segments.length; i++) {
    var segment = segments[i];
    if (segment === '..') {
      stack.pop();
    } else if (segment !== '.') {
      stack.push(segment);
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('');
  }

  return stack.join('/')
}

function parsePath (path) {
  var hash = '';
  var query = '';

  var hashIndex = path.indexOf('#');
  if (hashIndex >= 0) {
    hash = path.slice(hashIndex);
    path = path.slice(0, hashIndex);
  }

  var queryIndex = path.indexOf('?');
  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1);
    path = path.slice(0, queryIndex);
  }

  return {
    path: path,
    query: query,
    hash: hash
  }
}

function cleanPath (path) {
  return path.replace(/\/\//g, '/')
}

var isarray = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

/**
 * Expose `pathToRegexp`.
 */
var pathToRegexp_1 = pathToRegexp;
var parse_1 = parse;
var compile_1 = compile;
var tokensToFunction_1 = tokensToFunction;
var tokensToRegExp_1 = tokensToRegExp;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g');

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var defaultDelimiter = options && options.delimiter || '/';
  var res;

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length;

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1];
      continue
    }

    var next = str[index];
    var prefix = res[2];
    var name = res[3];
    var capture = res[4];
    var group = res[5];
    var modifier = res[6];
    var asterisk = res[7];

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path);
      path = '';
    }

    var partial = prefix != null && next != null && next !== prefix;
    var repeat = modifier === '+' || modifier === '*';
    var optional = modifier === '?' || modifier === '*';
    var delimiter = res[2] || defaultDelimiter;
    var pattern = capture || group;

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
    });
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index);
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path);
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile (str, options) {
  return tokensToFunction(parse(str, options))
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty (str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk (str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length);

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
    }
  }

  return function (obj, opts) {
    var path = '';
    var data = obj || {};
    var options = opts || {};
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        path += token;

        continue
      }

      var value = data[token.name];
      var segment;

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix;
          }

          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j]);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment;
        }

        continue
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value);

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment;
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys;
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      });
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  var strict = options.strict;
  var end = options.end !== false;
  var route = '';

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (typeof token === 'string') {
      route += escapeString(token);
    } else {
      var prefix = escapeString(token.prefix);
      var capture = '(?:' + token.pattern + ')';

      keys.push(token);

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*';
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?';
        } else {
          capture = prefix + '(' + capture + ')?';
        }
      } else {
        capture = prefix + '(' + capture + ')';
      }

      route += capture;
    }
  }

  var delimiter = escapeString(options.delimiter || '/');
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys)
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */ (keys))
  }

  if (isarray(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
  }

  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
}

pathToRegexp_1.parse = parse_1;
pathToRegexp_1.compile = compile_1;
pathToRegexp_1.tokensToFunction = tokensToFunction_1;
pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

/*  */

// $flow-disable-line
var regexpCompileCache = Object.create(null);

function fillParams (
  path,
  params,
  routeMsg
) {
  try {
    var filler =
      regexpCompileCache[path] ||
      (regexpCompileCache[path] = pathToRegexp_1.compile(path));
    return filler(params || {}, { pretty: true })
  } catch (e) {
    {
      warn(false, ("missing param for " + routeMsg + ": " + (e.message)));
    }
    return ''
  }
}

/*  */

function createRouteMap (
  routes,
  oldPathList,
  oldPathMap,
  oldNameMap
) {
  // the path list is used to control path matching priority
  var pathList = oldPathList || [];
  // $flow-disable-line
  var pathMap = oldPathMap || Object.create(null);
  // $flow-disable-line
  var nameMap = oldNameMap || Object.create(null);

  routes.forEach(function (route) {
    addRouteRecord(pathList, pathMap, nameMap, route);
  });

  // ensure wildcard routes are always at the end
  for (var i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0]);
      l--;
      i--;
    }
  }

  return {
    pathList: pathList,
    pathMap: pathMap,
    nameMap: nameMap
  }
}

function addRouteRecord (
  pathList,
  pathMap,
  nameMap,
  route,
  parent,
  matchAs
) {
  var path = route.path;
  var name = route.name;
  {
    assert(path != null, "\"path\" is required in a route configuration.");
    assert(
      typeof route.component !== 'string',
      "route config \"component\" for path: " + (String(path || name)) + " cannot be a " +
      "string id. Use an actual component instead."
    );
  }

  var pathToRegexpOptions = route.pathToRegexpOptions || {};
  var normalizedPath = normalizePath(
    path,
    parent,
    pathToRegexpOptions.strict
  );

  if (typeof route.caseSensitive === 'boolean') {
    pathToRegexpOptions.sensitive = route.caseSensitive;
  }

  var record = {
    path: normalizedPath,
    regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
    components: route.components || { default: route.component },
    instances: {},
    name: name,
    parent: parent,
    matchAs: matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    meta: route.meta || {},
    props: route.props == null
      ? {}
      : route.components
        ? route.props
        : { default: route.props }
  };

  if (route.children) {
    // Warn if route is named, does not redirect and has a default child route.
    // If users navigate to this route by name, the default child will
    // not be rendered (GH Issue #629)
    {
      if (route.name && !route.redirect && route.children.some(function (child) { return /^\/?$/.test(child.path); })) {
        warn(
          false,
          "Named Route '" + (route.name) + "' has a default child route. " +
          "When navigating to this named route (:to=\"{name: '" + (route.name) + "'\"), " +
          "the default child route will not be rendered. Remove the name from " +
          "this route and use the name of the default child route for named " +
          "links instead."
        );
      }
    }
    route.children.forEach(function (child) {
      var childMatchAs = matchAs
        ? cleanPath((matchAs + "/" + (child.path)))
        : undefined;
      addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs);
    });
  }

  if (route.alias !== undefined) {
    var aliases = Array.isArray(route.alias)
      ? route.alias
      : [route.alias];

    aliases.forEach(function (alias) {
      var aliasRoute = {
        path: alias,
        children: route.children
      };
      addRouteRecord(
        pathList,
        pathMap,
        nameMap,
        aliasRoute,
        parent,
        record.path || '/' // matchAs
      );
    });
  }

  if (!pathMap[record.path]) {
    pathList.push(record.path);
    pathMap[record.path] = record;
  }

  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = record;
    } else if ("development" !== 'production' && !matchAs) {
      warn(
        false,
        "Duplicate named routes definition: " +
        "{ name: \"" + name + "\", path: \"" + (record.path) + "\" }"
      );
    }
  }
}

function compileRouteRegex (path, pathToRegexpOptions) {
  var regex = pathToRegexp_1(path, [], pathToRegexpOptions);
  {
    var keys = Object.create(null);
    regex.keys.forEach(function (key) {
      warn(!keys[key.name], ("Duplicate param keys in route with path: \"" + path + "\""));
      keys[key.name] = true;
    });
  }
  return regex
}

function normalizePath (path, parent, strict) {
  if (!strict) { path = path.replace(/\/$/, ''); }
  if (path[0] === '/') { return path }
  if (parent == null) { return path }
  return cleanPath(((parent.path) + "/" + path))
}

/*  */


function normalizeLocation (
  raw,
  current,
  append,
  router
) {
  var next = typeof raw === 'string' ? { path: raw } : raw;
  // named target
  if (next.name || next._normalized) {
    return next
  }

  // relative params
  if (!next.path && next.params && current) {
    next = assign({}, next);
    next._normalized = true;
    var params = assign(assign({}, current.params), next.params);
    if (current.name) {
      next.name = current.name;
      next.params = params;
    } else if (current.matched.length) {
      var rawPath = current.matched[current.matched.length - 1].path;
      next.path = fillParams(rawPath, params, ("path " + (current.path)));
    } else {
      warn(false, "relative params navigation requires a current route.");
    }
    return next
  }

  var parsedPath = parsePath(next.path || '');
  var basePath = (current && current.path) || '/';
  var path = parsedPath.path
    ? resolvePath(parsedPath.path, basePath, append || next.append)
    : basePath;

  var query = resolveQuery(
    parsedPath.query,
    next.query,
    router && router.options.parseQuery
  );

  var hash = next.hash || parsedPath.hash;
  if (hash && hash.charAt(0) !== '#') {
    hash = "#" + hash;
  }

  return {
    _normalized: true,
    path: path,
    query: query,
    hash: hash
  }
}

function assign (a, b) {
  for (var key in b) {
    a[key] = b[key];
  }
  return a
}

/*  */


function createMatcher (
  routes,
  router
) {
  var ref = createRouteMap(routes);
  var pathList = ref.pathList;
  var pathMap = ref.pathMap;
  var nameMap = ref.nameMap;

  function addRoutes (routes) {
    createRouteMap(routes, pathList, pathMap, nameMap);
  }

  function match (
    raw,
    currentRoute,
    redirectedFrom
  ) {
    var location = normalizeLocation(raw, currentRoute, false, router);
    var name = location.name;

    if (name) {
      var record = nameMap[name];
      {
        warn(record, ("Route with name '" + name + "' does not exist"));
      }
      if (!record) { return _createRoute(null, location) }
      var paramNames = record.regex.keys
        .filter(function (key) { return !key.optional; })
        .map(function (key) { return key.name; });

      if (typeof location.params !== 'object') {
        location.params = {};
      }

      if (currentRoute && typeof currentRoute.params === 'object') {
        for (var key in currentRoute.params) {
          if (!(key in location.params) && paramNames.indexOf(key) > -1) {
            location.params[key] = currentRoute.params[key];
          }
        }
      }

      if (record) {
        location.path = fillParams(record.path, location.params, ("named route \"" + name + "\""));
        return _createRoute(record, location, redirectedFrom)
      }
    } else if (location.path) {
      location.params = {};
      for (var i = 0; i < pathList.length; i++) {
        var path = pathList[i];
        var record$1 = pathMap[path];
        if (matchRoute(record$1.regex, location.path, location.params)) {
          return _createRoute(record$1, location, redirectedFrom)
        }
      }
    }
    // no match
    return _createRoute(null, location)
  }

  function redirect (
    record,
    location
  ) {
    var originalRedirect = record.redirect;
    var redirect = typeof originalRedirect === 'function'
        ? originalRedirect(createRoute(record, location, null, router))
        : originalRedirect;

    if (typeof redirect === 'string') {
      redirect = { path: redirect };
    }

    if (!redirect || typeof redirect !== 'object') {
      {
        warn(
          false, ("invalid redirect option: " + (JSON.stringify(redirect)))
        );
      }
      return _createRoute(null, location)
    }

    var re = redirect;
    var name = re.name;
    var path = re.path;
    var query = location.query;
    var hash = location.hash;
    var params = location.params;
    query = re.hasOwnProperty('query') ? re.query : query;
    hash = re.hasOwnProperty('hash') ? re.hash : hash;
    params = re.hasOwnProperty('params') ? re.params : params;

    if (name) {
      // resolved named direct
      var targetRecord = nameMap[name];
      {
        assert(targetRecord, ("redirect failed: named route \"" + name + "\" not found."));
      }
      return match({
        _normalized: true,
        name: name,
        query: query,
        hash: hash,
        params: params
      }, undefined, location)
    } else if (path) {
      // 1. resolve relative redirect
      var rawPath = resolveRecordPath(path, record);
      // 2. resolve params
      var resolvedPath = fillParams(rawPath, params, ("redirect route with path \"" + rawPath + "\""));
      // 3. rematch with existing query and hash
      return match({
        _normalized: true,
        path: resolvedPath,
        query: query,
        hash: hash
      }, undefined, location)
    } else {
      {
        warn(false, ("invalid redirect option: " + (JSON.stringify(redirect))));
      }
      return _createRoute(null, location)
    }
  }

  function alias (
    record,
    location,
    matchAs
  ) {
    var aliasedPath = fillParams(matchAs, location.params, ("aliased route with path \"" + matchAs + "\""));
    var aliasedMatch = match({
      _normalized: true,
      path: aliasedPath
    });
    if (aliasedMatch) {
      var matched = aliasedMatch.matched;
      var aliasedRecord = matched[matched.length - 1];
      location.params = aliasedMatch.params;
      return _createRoute(aliasedRecord, location)
    }
    return _createRoute(null, location)
  }

  function _createRoute (
    record,
    location,
    redirectedFrom
  ) {
    if (record && record.redirect) {
      return redirect(record, redirectedFrom || location)
    }
    if (record && record.matchAs) {
      return alias(record, location, record.matchAs)
    }
    return createRoute(record, location, redirectedFrom, router)
  }

  return {
    match: match,
    addRoutes: addRoutes
  }
}

function matchRoute (
  regex,
  path,
  params
) {
  var m = path.match(regex);

  if (!m) {
    return false
  } else if (!params) {
    return true
  }

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = regex.keys[i - 1];
    var val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i];
    if (key) {
      params[key.name] = val;
    }
  }

  return true
}

function resolveRecordPath (path, record) {
  return resolvePath(path, record.parent ? record.parent.path : '/', true)
}

/*  */


var positionStore = Object.create(null);

function setupScroll () {
  // Fix for #1585 for Firefox
  window.history.replaceState({ key: getStateKey() }, '');
  window.addEventListener('popstate', function (e) {
    saveScrollPosition();
    if (e.state && e.state.key) {
      setStateKey(e.state.key);
    }
  });
}

function handleScroll (
  router,
  to,
  from,
  isPop
) {
  if (!router.app) {
    return
  }

  var behavior = router.options.scrollBehavior;
  if (!behavior) {
    return
  }

  {
    assert(typeof behavior === 'function', "scrollBehavior must be a function");
  }

  // wait until re-render finishes before scrolling
  router.app.$nextTick(function () {
    var position = getScrollPosition();
    var shouldScroll = behavior(to, from, isPop ? position : null);

    if (!shouldScroll) {
      return
    }

    if (typeof shouldScroll.then === 'function') {
      shouldScroll.then(function (shouldScroll) {
        scrollToPosition((shouldScroll), position);
      }).catch(function (err) {
        {
          assert(false, err.toString());
        }
      });
    } else {
      scrollToPosition(shouldScroll, position);
    }
  });
}

function saveScrollPosition () {
  var key = getStateKey();
  if (key) {
    positionStore[key] = {
      x: window.pageXOffset,
      y: window.pageYOffset
    };
  }
}

function getScrollPosition () {
  var key = getStateKey();
  if (key) {
    return positionStore[key]
  }
}

function getElementPosition (el, offset) {
  var docEl = document.documentElement;
  var docRect = docEl.getBoundingClientRect();
  var elRect = el.getBoundingClientRect();
  return {
    x: elRect.left - docRect.left - offset.x,
    y: elRect.top - docRect.top - offset.y
  }
}

function isValidPosition (obj) {
  return isNumber(obj.x) || isNumber(obj.y)
}

function normalizePosition (obj) {
  return {
    x: isNumber(obj.x) ? obj.x : window.pageXOffset,
    y: isNumber(obj.y) ? obj.y : window.pageYOffset
  }
}

function normalizeOffset (obj) {
  return {
    x: isNumber(obj.x) ? obj.x : 0,
    y: isNumber(obj.y) ? obj.y : 0
  }
}

function isNumber (v) {
  return typeof v === 'number'
}

function scrollToPosition (shouldScroll, position) {
  var isObject = typeof shouldScroll === 'object';
  if (isObject && typeof shouldScroll.selector === 'string') {
    var el = document.querySelector(shouldScroll.selector);
    if (el) {
      var offset = shouldScroll.offset && typeof shouldScroll.offset === 'object' ? shouldScroll.offset : {};
      offset = normalizeOffset(offset);
      position = getElementPosition(el, offset);
    } else if (isValidPosition(shouldScroll)) {
      position = normalizePosition(shouldScroll);
    }
  } else if (isObject && isValidPosition(shouldScroll)) {
    position = normalizePosition(shouldScroll);
  }

  if (position) {
    window.scrollTo(position.x, position.y);
  }
}

/*  */

var supportsPushState = inBrowser && (function () {
  var ua = window.navigator.userAgent;

  if (
    (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  ) {
    return false
  }

  return window.history && 'pushState' in window.history
})();

// use User Timing api (if present) for more accurate key precision
var Time = inBrowser && window.performance && window.performance.now
  ? window.performance
  : Date;

var _key = genKey();

function genKey () {
  return Time.now().toFixed(3)
}

function getStateKey () {
  return _key
}

function setStateKey (key) {
  _key = key;
}

function pushState (url, replace) {
  saveScrollPosition();
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  var history = window.history;
  try {
    if (replace) {
      history.replaceState({ key: _key }, '', url);
    } else {
      _key = genKey();
      history.pushState({ key: _key }, '', url);
    }
  } catch (e) {
    window.location[replace ? 'replace' : 'assign'](url);
  }
}

function replaceState (url) {
  pushState(url, true);
}

/*  */

function runQueue (queue, fn, cb) {
  var step = function (index) {
    if (index >= queue.length) {
      cb();
    } else {
      if (queue[index]) {
        fn(queue[index], function () {
          step(index + 1);
        });
      } else {
        step(index + 1);
      }
    }
  };
  step(0);
}

/*  */

function resolveAsyncComponents (matched) {
  return function (to, from, next) {
    var hasAsync = false;
    var pending = 0;
    var error = null;

    flatMapComponents(matched, function (def, _, match, key) {
      // if it's a function and doesn't have cid attached,
      // assume it's an async component resolve function.
      // we are not using Vue's default async resolving mechanism because
      // we want to halt the navigation until the incoming component has been
      // resolved.
      if (typeof def === 'function' && def.cid === undefined) {
        hasAsync = true;
        pending++;

        var resolve = once(function (resolvedDef) {
          if (isESModule(resolvedDef)) {
            resolvedDef = resolvedDef.default;
          }
          // save resolved on async factory in case it's used elsewhere
          def.resolved = typeof resolvedDef === 'function'
            ? resolvedDef
            : _Vue.extend(resolvedDef);
          match.components[key] = resolvedDef;
          pending--;
          if (pending <= 0) {
            next();
          }
        });

        var reject = once(function (reason) {
          var msg = "Failed to resolve async component " + key + ": " + reason;
          "development" !== 'production' && warn(false, msg);
          if (!error) {
            error = isError(reason)
              ? reason
              : new Error(msg);
            next(error);
          }
        });

        var res;
        try {
          res = def(resolve, reject);
        } catch (e) {
          reject(e);
        }
        if (res) {
          if (typeof res.then === 'function') {
            res.then(resolve, reject);
          } else {
            // new syntax in Vue 2.3
            var comp = res.component;
            if (comp && typeof comp.then === 'function') {
              comp.then(resolve, reject);
            }
          }
        }
      }
    });

    if (!hasAsync) { next(); }
  }
}

function flatMapComponents (
  matched,
  fn
) {
  return flatten(matched.map(function (m) {
    return Object.keys(m.components).map(function (key) { return fn(
      m.components[key],
      m.instances[key],
      m, key
    ); })
  }))
}

function flatten (arr) {
  return Array.prototype.concat.apply([], arr)
}

var hasSymbol =
  typeof Symbol === 'function' &&
  typeof Symbol.toStringTag === 'symbol';

function isESModule (obj) {
  return obj.__esModule || (hasSymbol && obj[Symbol.toStringTag] === 'Module')
}

// in Webpack 2, require.ensure now also returns a Promise
// so the resolve/reject functions may get called an extra time
// if the user uses an arrow function shorthand that happens to
// return that Promise.
function once (fn) {
  var called = false;
  return function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    if (called) { return }
    called = true;
    return fn.apply(this, args)
  }
}

/*  */

var History = function History (router, base) {
  this.router = router;
  this.base = normalizeBase(base);
  // start with a route object that stands for "nowhere"
  this.current = START;
  this.pending = null;
  this.ready = false;
  this.readyCbs = [];
  this.readyErrorCbs = [];
  this.errorCbs = [];
};

History.prototype.listen = function listen (cb) {
  this.cb = cb;
};

History.prototype.onReady = function onReady (cb, errorCb) {
  if (this.ready) {
    cb();
  } else {
    this.readyCbs.push(cb);
    if (errorCb) {
      this.readyErrorCbs.push(errorCb);
    }
  }
};

History.prototype.onError = function onError (errorCb) {
  this.errorCbs.push(errorCb);
};

History.prototype.transitionTo = function transitionTo (location, onComplete, onAbort) {
    var this$1 = this;

  var route = this.router.match(location, this.current);
  this.confirmTransition(route, function () {
    this$1.updateRoute(route);
    onComplete && onComplete(route);
    this$1.ensureURL();

    // fire ready cbs once
    if (!this$1.ready) {
      this$1.ready = true;
      this$1.readyCbs.forEach(function (cb) { cb(route); });
    }
  }, function (err) {
    if (onAbort) {
      onAbort(err);
    }
    if (err && !this$1.ready) {
      this$1.ready = true;
      this$1.readyErrorCbs.forEach(function (cb) { cb(err); });
    }
  });
};

History.prototype.confirmTransition = function confirmTransition (route, onComplete, onAbort) {
    var this$1 = this;

  var current = this.current;
  var abort = function (err) {
    if (isError(err)) {
      if (this$1.errorCbs.length) {
        this$1.errorCbs.forEach(function (cb) { cb(err); });
      } else {
        warn(false, 'uncaught error during route navigation:');
        console.error(err);
      }
    }
    onAbort && onAbort(err);
  };
  if (
    isSameRoute(route, current) &&
    // in the case the route map has been dynamically appended to
    route.matched.length === current.matched.length
  ) {
    this.ensureURL();
    return abort()
  }

  var ref = resolveQueue(this.current.matched, route.matched);
    var updated = ref.updated;
    var deactivated = ref.deactivated;
    var activated = ref.activated;

  var queue = [].concat(
    // in-component leave guards
    extractLeaveGuards(deactivated),
    // global before hooks
    this.router.beforeHooks,
    // in-component update hooks
    extractUpdateHooks(updated),
    // in-config enter guards
    activated.map(function (m) { return m.beforeEnter; }),
    // async components
    resolveAsyncComponents(activated)
  );

  this.pending = route;
  var iterator = function (hook, next) {
    if (this$1.pending !== route) {
      return abort()
    }
    try {
      hook(route, current, function (to) {
        if (to === false || isError(to)) {
          // next(false) -> abort navigation, ensure current URL
          this$1.ensureURL(true);
          abort(to);
        } else if (
          typeof to === 'string' ||
          (typeof to === 'object' && (
            typeof to.path === 'string' ||
            typeof to.name === 'string'
          ))
        ) {
          // next('/') or next({ path: '/' }) -> redirect
          abort();
          if (typeof to === 'object' && to.replace) {
            this$1.replace(to);
          } else {
            this$1.push(to);
          }
        } else {
          // confirm transition and pass on the value
          next(to);
        }
      });
    } catch (e) {
      abort(e);
    }
  };

  runQueue(queue, iterator, function () {
    var postEnterCbs = [];
    var isValid = function () { return this$1.current === route; };
    // wait until async components are resolved before
    // extracting in-component enter guards
    var enterGuards = extractEnterGuards(activated, postEnterCbs, isValid);
    var queue = enterGuards.concat(this$1.router.resolveHooks);
    runQueue(queue, iterator, function () {
      if (this$1.pending !== route) {
        return abort()
      }
      this$1.pending = null;
      onComplete(route);
      if (this$1.router.app) {
        this$1.router.app.$nextTick(function () {
          postEnterCbs.forEach(function (cb) { cb(); });
        });
      }
    });
  });
};

History.prototype.updateRoute = function updateRoute (route) {
  var prev = this.current;
  this.current = route;
  this.cb && this.cb(route);
  this.router.afterHooks.forEach(function (hook) {
    hook && hook(route, prev);
  });
};

function normalizeBase (base) {
  if (!base) {
    if (inBrowser) {
      // respect <base> tag
      var baseEl = document.querySelector('base');
      base = (baseEl && baseEl.getAttribute('href')) || '/';
      // strip full URL origin
      base = base.replace(/^https?:\/\/[^\/]+/, '');
    } else {
      base = '/';
    }
  }
  // make sure there's the starting slash
  if (base.charAt(0) !== '/') {
    base = '/' + base;
  }
  // remove trailing slash
  return base.replace(/\/$/, '')
}

function resolveQueue (
  current,
  next
) {
  var i;
  var max = Math.max(current.length, next.length);
  for (i = 0; i < max; i++) {
    if (current[i] !== next[i]) {
      break
    }
  }
  return {
    updated: next.slice(0, i),
    activated: next.slice(i),
    deactivated: current.slice(i)
  }
}

function extractGuards (
  records,
  name,
  bind,
  reverse
) {
  var guards = flatMapComponents(records, function (def, instance, match, key) {
    var guard = extractGuard(def, name);
    if (guard) {
      return Array.isArray(guard)
        ? guard.map(function (guard) { return bind(guard, instance, match, key); })
        : bind(guard, instance, match, key)
    }
  });
  return flatten(reverse ? guards.reverse() : guards)
}

function extractGuard (
  def,
  key
) {
  if (typeof def !== 'function') {
    // extend now so that global mixins are applied.
    def = _Vue.extend(def);
  }
  return def.options[key]
}

function extractLeaveGuards (deactivated) {
  return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true)
}

function extractUpdateHooks (updated) {
  return extractGuards(updated, 'beforeRouteUpdate', bindGuard)
}

function bindGuard (guard, instance) {
  if (instance) {
    return function boundRouteGuard () {
      return guard.apply(instance, arguments)
    }
  }
}

function extractEnterGuards (
  activated,
  cbs,
  isValid
) {
  return extractGuards(activated, 'beforeRouteEnter', function (guard, _, match, key) {
    return bindEnterGuard(guard, match, key, cbs, isValid)
  })
}

function bindEnterGuard (
  guard,
  match,
  key,
  cbs,
  isValid
) {
  return function routeEnterGuard (to, from, next) {
    return guard(to, from, function (cb) {
      next(cb);
      if (typeof cb === 'function') {
        cbs.push(function () {
          // #750
          // if a router-view is wrapped with an out-in transition,
          // the instance may not have been registered at this time.
          // we will need to poll for registration until current route
          // is no longer valid.
          poll(cb, match.instances, key, isValid);
        });
      }
    })
  }
}

function poll (
  cb, // somehow flow cannot infer this is a function
  instances,
  key,
  isValid
) {
  if (instances[key]) {
    cb(instances[key]);
  } else if (isValid()) {
    setTimeout(function () {
      poll(cb, instances, key, isValid);
    }, 16);
  }
}

/*  */


var HTML5History = (function (History$$1) {
  function HTML5History (router, base) {
    var this$1 = this;

    History$$1.call(this, router, base);

    var expectScroll = router.options.scrollBehavior;

    if (expectScroll) {
      setupScroll();
    }

    var initLocation = getLocation(this.base);
    window.addEventListener('popstate', function (e) {
      var current = this$1.current;

      // Avoiding first `popstate` event dispatched in some browsers but first
      // history route not updated since async guard at the same time.
      var location = getLocation(this$1.base);
      if (this$1.current === START && location === initLocation) {
        return
      }

      this$1.transitionTo(location, function (route) {
        if (expectScroll) {
          handleScroll(router, route, current, true);
        }
      });
    });
  }

  if ( History$$1 ) HTML5History.__proto__ = History$$1;
  HTML5History.prototype = Object.create( History$$1 && History$$1.prototype );
  HTML5History.prototype.constructor = HTML5History;

  HTML5History.prototype.go = function go (n) {
    window.history.go(n);
  };

  HTML5History.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      pushState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      replaceState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.ensureURL = function ensureURL (push) {
    if (getLocation(this.base) !== this.current.fullPath) {
      var current = cleanPath(this.base + this.current.fullPath);
      push ? pushState(current) : replaceState(current);
    }
  };

  HTML5History.prototype.getCurrentLocation = function getCurrentLocation () {
    return getLocation(this.base)
  };

  return HTML5History;
}(History));

function getLocation (base) {
  var path = window.location.pathname;
  if (base && path.indexOf(base) === 0) {
    path = path.slice(base.length);
  }
  return (path || '/') + window.location.search + window.location.hash
}

/*  */


var HashHistory = (function (History$$1) {
  function HashHistory (router, base, fallback) {
    History$$1.call(this, router, base);
    // check history fallback deeplinking
    if (fallback && checkFallback(this.base)) {
      return
    }
    ensureSlash();
  }

  if ( History$$1 ) HashHistory.__proto__ = History$$1;
  HashHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  HashHistory.prototype.constructor = HashHistory;

  // this is delayed until the app mounts
  // to avoid the hashchange listener being fired too early
  HashHistory.prototype.setupListeners = function setupListeners () {
    var this$1 = this;

    var router = this.router;
    var expectScroll = router.options.scrollBehavior;
    var supportsScroll = supportsPushState && expectScroll;

    if (supportsScroll) {
      setupScroll();
    }

    window.addEventListener(supportsPushState ? 'popstate' : 'hashchange', function () {
      var current = this$1.current;
      if (!ensureSlash()) {
        return
      }
      this$1.transitionTo(getHash(), function (route) {
        if (supportsScroll) {
          handleScroll(this$1.router, route, current, true);
        }
        if (!supportsPushState) {
          replaceHash(route.fullPath);
        }
      });
    });
  };

  HashHistory.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      pushHash(route.fullPath);
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      replaceHash(route.fullPath);
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.go = function go (n) {
    window.history.go(n);
  };

  HashHistory.prototype.ensureURL = function ensureURL (push) {
    var current = this.current.fullPath;
    if (getHash() !== current) {
      push ? pushHash(current) : replaceHash(current);
    }
  };

  HashHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    return getHash()
  };

  return HashHistory;
}(History));

function checkFallback (base) {
  var location = getLocation(base);
  if (!/^\/#/.test(location)) {
    window.location.replace(
      cleanPath(base + '/#' + location)
    );
    return true
  }
}

function ensureSlash () {
  var path = getHash();
  if (path.charAt(0) === '/') {
    return true
  }
  replaceHash('/' + path);
  return false
}

function getHash () {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var href = window.location.href;
  var index = href.indexOf('#');
  return index === -1 ? '' : href.slice(index + 1)
}

function getUrl (path) {
  var href = window.location.href;
  var i = href.indexOf('#');
  var base = i >= 0 ? href.slice(0, i) : href;
  return (base + "#" + path)
}

function pushHash (path) {
  if (supportsPushState) {
    pushState(getUrl(path));
  } else {
    window.location.hash = path;
  }
}

function replaceHash (path) {
  if (supportsPushState) {
    replaceState(getUrl(path));
  } else {
    window.location.replace(getUrl(path));
  }
}

/*  */


var AbstractHistory = (function (History$$1) {
  function AbstractHistory (router, base) {
    History$$1.call(this, router, base);
    this.stack = [];
    this.index = -1;
  }

  if ( History$$1 ) AbstractHistory.__proto__ = History$$1;
  AbstractHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  AbstractHistory.prototype.constructor = AbstractHistory;

  AbstractHistory.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index + 1).concat(route);
      this$1.index++;
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index).concat(route);
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.go = function go (n) {
    var this$1 = this;

    var targetIndex = this.index + n;
    if (targetIndex < 0 || targetIndex >= this.stack.length) {
      return
    }
    var route = this.stack[targetIndex];
    this.confirmTransition(route, function () {
      this$1.index = targetIndex;
      this$1.updateRoute(route);
    });
  };

  AbstractHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    var current = this.stack[this.stack.length - 1];
    return current ? current.fullPath : '/'
  };

  AbstractHistory.prototype.ensureURL = function ensureURL () {
    // noop
  };

  return AbstractHistory;
}(History));

/*  */

var VueRouter = function VueRouter (options) {
  if ( options === void 0 ) options = {};

  this.app = null;
  this.apps = [];
  this.options = options;
  this.beforeHooks = [];
  this.resolveHooks = [];
  this.afterHooks = [];
  this.matcher = createMatcher(options.routes || [], this);

  var mode = options.mode || 'hash';
  this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false;
  if (this.fallback) {
    mode = 'hash';
  }
  if (!inBrowser) {
    mode = 'abstract';
  }
  this.mode = mode;

  switch (mode) {
    case 'history':
      this.history = new HTML5History(this, options.base);
      break
    case 'hash':
      this.history = new HashHistory(this, options.base, this.fallback);
      break
    case 'abstract':
      this.history = new AbstractHistory(this, options.base);
      break
    default:
      {
        assert(false, ("invalid mode: " + mode));
      }
  }
};

var prototypeAccessors = { currentRoute: { configurable: true } };

VueRouter.prototype.match = function match (
  raw,
  current,
  redirectedFrom
) {
  return this.matcher.match(raw, current, redirectedFrom)
};

prototypeAccessors.currentRoute.get = function () {
  return this.history && this.history.current
};

VueRouter.prototype.init = function init (app /* Vue component instance */) {
    var this$1 = this;

  "development" !== 'production' && assert(
    install.installed,
    "not installed. Make sure to call `Vue.use(VueRouter)` " +
    "before creating root instance."
  );

  this.apps.push(app);

  // main app already initialized.
  if (this.app) {
    return
  }

  this.app = app;

  var history = this.history;

  if (history instanceof HTML5History) {
    history.transitionTo(history.getCurrentLocation());
  } else if (history instanceof HashHistory) {
    var setupHashListener = function () {
      history.setupListeners();
    };
    history.transitionTo(
      history.getCurrentLocation(),
      setupHashListener,
      setupHashListener
    );
  }

  history.listen(function (route) {
    this$1.apps.forEach(function (app) {
      app._route = route;
    });
  });
};

VueRouter.prototype.beforeEach = function beforeEach (fn) {
  return registerHook(this.beforeHooks, fn)
};

VueRouter.prototype.beforeResolve = function beforeResolve (fn) {
  return registerHook(this.resolveHooks, fn)
};

VueRouter.prototype.afterEach = function afterEach (fn) {
  return registerHook(this.afterHooks, fn)
};

VueRouter.prototype.onReady = function onReady (cb, errorCb) {
  this.history.onReady(cb, errorCb);
};

VueRouter.prototype.onError = function onError (errorCb) {
  this.history.onError(errorCb);
};

VueRouter.prototype.push = function push (location, onComplete, onAbort) {
  this.history.push(location, onComplete, onAbort);
};

VueRouter.prototype.replace = function replace (location, onComplete, onAbort) {
  this.history.replace(location, onComplete, onAbort);
};

VueRouter.prototype.go = function go (n) {
  this.history.go(n);
};

VueRouter.prototype.back = function back () {
  this.go(-1);
};

VueRouter.prototype.forward = function forward () {
  this.go(1);
};

VueRouter.prototype.getMatchedComponents = function getMatchedComponents (to) {
  var route = to
    ? to.matched
      ? to
      : this.resolve(to).route
    : this.currentRoute;
  if (!route) {
    return []
  }
  return [].concat.apply([], route.matched.map(function (m) {
    return Object.keys(m.components).map(function (key) {
      return m.components[key]
    })
  }))
};

VueRouter.prototype.resolve = function resolve (
  to,
  current,
  append
) {
  var location = normalizeLocation(
    to,
    current || this.history.current,
    append,
    this
  );
  var route = this.match(location, current);
  var fullPath = route.redirectedFrom || route.fullPath;
  var base = this.history.base;
  var href = createHref(base, fullPath, this.mode);
  return {
    location: location,
    route: route,
    href: href,
    // for backwards compat
    normalizedTo: location,
    resolved: route
  }
};

VueRouter.prototype.addRoutes = function addRoutes (routes) {
  this.matcher.addRoutes(routes);
  if (this.history.current !== START) {
    this.history.transitionTo(this.history.getCurrentLocation());
  }
};

Object.defineProperties( VueRouter.prototype, prototypeAccessors );

function registerHook (list, fn) {
  list.push(fn);
  return function () {
    var i = list.indexOf(fn);
    if (i > -1) { list.splice(i, 1); }
  }
}

function createHref (base, fullPath, mode) {
  var path = mode === 'hash' ? '#' + fullPath : fullPath;
  return base ? cleanPath(base + '/' + path) : path
}

VueRouter.install = install;
VueRouter.version = '3.0.1';

if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter);
}

return VueRouter;

})));


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

!function () {
  "use strict";

  function o(o) {
    var t = ["MSIE ", "Trident/", "Edge/"];
    return new RegExp(t.join("|")).test(o);
  }

  function t() {
    function t(o, t) {
      this.scrollLeft = o, this.scrollTop = t;
    }

    function r(o) {
      return .5 * (1 - Math.cos(Math.PI * o));
    }

    function i(o) {
      if (null === o || "object" != _typeof(o) || void 0 === o.behavior || "auto" === o.behavior || "instant" === o.behavior) return !0;
      if ("object" == _typeof(o) && "smooth" === o.behavior) return !1;
      throw new TypeError("behavior member of ScrollOptions " + o.behavior + " is not a valid value for enumeration ScrollBehavior.");
    }

    function s(o, t) {
      return "Y" === t ? o.clientHeight + h < o.scrollHeight : "X" === t ? o.clientWidth + h < o.scrollWidth : void 0;
    }

    function c(o, t) {
      var e = l.getComputedStyle(o, null)["overflow" + t];
      return "auto" === e || "scroll" === e;
    }

    function n(o) {
      var t = s(o, "Y") && c(o, "Y"),
          l = s(o, "X") && c(o, "X");
      return t || l;
    }

    function f(o) {
      var t;

      do {
        t = (o = o.parentNode) === e.body;
      } while (!1 === t && !1 === n(o));

      return t = null, o;
    }

    function a(o) {
      var t,
          e,
          i,
          s = (y() - o.startTime) / v;
      t = r(s = s > 1 ? 1 : s), e = o.startX + (o.x - o.startX) * t, i = o.startY + (o.y - o.startY) * t, o.method.call(o.scrollable, e, i), e === o.x && i === o.y || l.requestAnimationFrame(a.bind(l, o));
    }

    function p(o, r, i) {
      var s,
          c,
          n,
          f,
          p = y();
      o === e.body ? (s = l, c = l.scrollX || l.pageXOffset, n = l.scrollY || l.pageYOffset, f = u.scroll) : (s = o, c = o.scrollLeft, n = o.scrollTop, f = t), a({
        scrollable: s,
        method: f,
        startTime: p,
        startX: c,
        startY: n,
        x: r,
        y: i
      });
    }

    if (!("scrollBehavior" in e.documentElement.style && !0 !== l.__forceSmoothScrollPolyfill__)) {
      var d = l.HTMLElement || l.Element,
          v = 468,
          h = o(l.navigator.userAgent) ? 1 : 0,
          u = {
        scroll: l.scroll || l.scrollTo,
        scrollBy: l.scrollBy,
        elementScroll: d.prototype.scroll || t,
        scrollIntoView: d.prototype.scrollIntoView
      },
          y = l.performance && l.performance.now ? l.performance.now.bind(l.performance) : Date.now;
      l.scroll = l.scrollTo = function () {
        void 0 !== arguments[0] && (!0 !== i(arguments[0]) ? p.call(l, e.body, void 0 !== arguments[0].left ? ~~arguments[0].left : l.scrollX || l.pageXOffset, void 0 !== arguments[0].top ? ~~arguments[0].top : l.scrollY || l.pageYOffset) : u.scroll.call(l, void 0 !== arguments[0].left ? arguments[0].left : "object" != _typeof(arguments[0]) ? arguments[0] : l.scrollX || l.pageXOffset, void 0 !== arguments[0].top ? arguments[0].top : void 0 !== arguments[1] ? arguments[1] : l.scrollY || l.pageYOffset));
      }, l.scrollBy = function () {
        void 0 !== arguments[0] && (i(arguments[0]) ? u.scrollBy.call(l, void 0 !== arguments[0].left ? arguments[0].left : "object" != _typeof(arguments[0]) ? arguments[0] : 0, void 0 !== arguments[0].top ? arguments[0].top : void 0 !== arguments[1] ? arguments[1] : 0) : p.call(l, e.body, ~~arguments[0].left + (l.scrollX || l.pageXOffset), ~~arguments[0].top + (l.scrollY || l.pageYOffset)));
      }, d.prototype.scroll = d.prototype.scrollTo = function () {
        if (void 0 !== arguments[0]) if (!0 !== i(arguments[0])) {
          var o = arguments[0].left,
              t = arguments[0].top;
          p.call(this, this, void 0 === o ? this.scrollLeft : ~~o, void 0 === t ? this.scrollTop : ~~t);
        } else {
          if ("number" == typeof arguments[0] && void 0 === arguments[1]) throw new SyntaxError("Value couldn't be converted");
          u.elementScroll.call(this, void 0 !== arguments[0].left ? ~~arguments[0].left : "object" != _typeof(arguments[0]) ? ~~arguments[0] : this.scrollLeft, void 0 !== arguments[0].top ? ~~arguments[0].top : void 0 !== arguments[1] ? ~~arguments[1] : this.scrollTop);
        }
      }, d.prototype.scrollBy = function () {
        void 0 !== arguments[0] && (!0 !== i(arguments[0]) ? this.scroll({
          left: ~~arguments[0].left + this.scrollLeft,
          top: ~~arguments[0].top + this.scrollTop,
          behavior: arguments[0].behavior
        }) : u.elementScroll.call(this, void 0 !== arguments[0].left ? ~~arguments[0].left + this.scrollLeft : ~~arguments[0] + this.scrollLeft, void 0 !== arguments[0].top ? ~~arguments[0].top + this.scrollTop : ~~arguments[1] + this.scrollTop));
      }, d.prototype.scrollIntoView = function () {
        if (!0 !== i(arguments[0])) {
          var o = f(this),
              t = o.getBoundingClientRect(),
              r = this.getBoundingClientRect();
          o !== e.body ? (p.call(this, o, o.scrollLeft + r.left - t.left, o.scrollTop + r.top - t.top), "fixed" !== l.getComputedStyle(o).position && l.scrollBy({
            left: t.left,
            top: t.top,
            behavior: "smooth"
          })) : l.scrollBy({
            left: r.left,
            top: r.top,
            behavior: "smooth"
          });
        } else u.scrollIntoView.call(this, void 0 === arguments[0] || arguments[0]);
      };
    }
  }

  var l = window,
      e = document;
  "object" == ( false ? "undefined" : _typeof(exports)) ? module.exports = {
    polyfill: t
  } : t();
}();

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(setImmediate) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : e.Promise = t();
}(this, function () {
  "use strict";

  function e() {}

  function t(e) {
    if (!(this instanceof t)) throw new TypeError("Promises must be constructed via new");
    if ("function" != typeof e) throw new TypeError("not a function");
    this._state = 0, this._handled = !1, this._value = void 0, this._deferreds = [], f(e, this);
  }

  function n(e, n) {
    for (; 3 === e._state;) {
      e = e._value;
    }

    0 !== e._state ? (e._handled = !0, t._immediateFn(function () {
      var t = 1 === e._state ? n.onFulfilled : n.onRejected;

      if (null !== t) {
        var r;

        try {
          r = t(e._value);
        } catch (e) {
          return void i(n.promise, e);
        }

        o(n.promise, r);
      } else (1 === e._state ? o : i)(n.promise, e._value);
    })) : e._deferreds.push(n);
  }

  function o(e, n) {
    try {
      if (n === e) throw new TypeError("A promise cannot be resolved with itself.");

      if (n && ("object" == _typeof(n) || "function" == typeof n)) {
        var o = n.then;
        if (n instanceof t) return e._state = 3, e._value = n, void r(e);
        if ("function" == typeof o) return void f(function (e, t) {
          return function () {
            e.apply(t, arguments);
          };
        }(o, n), e);
      }

      e._state = 1, e._value = n, r(e);
    } catch (t) {
      i(e, t);
    }
  }

  function i(e, t) {
    e._state = 2, e._value = t, r(e);
  }

  function r(e) {
    2 === e._state && 0 === e._deferreds.length && t._immediateFn(function () {
      e._handled || t._unhandledRejectionFn(e._value);
    });

    for (var o = 0, i = e._deferreds.length; i > o; o++) {
      n(e, e._deferreds[o]);
    }

    e._deferreds = null;
  }

  function f(e, t) {
    var n = !1;

    try {
      e(function (e) {
        n || (n = !0, o(t, e));
      }, function (e) {
        n || (n = !0, i(t, e));
      });
    } catch (e) {
      if (n) return;
      n = !0, i(t, e);
    }
  }

  var u = setTimeout;
  return t.prototype.catch = function (e) {
    return this.then(null, e);
  }, t.prototype.then = function (t, o) {
    var i = new this.constructor(e);
    return n(this, new function (e, t, n) {
      this.onFulfilled = "function" == typeof e ? e : null, this.onRejected = "function" == typeof t ? t : null, this.promise = n;
    }(t, o, i)), i;
  }, t.all = function (e) {
    return new t(function (t, n) {
      function o(e, f) {
        try {
          if (f && ("object" == _typeof(f) || "function" == typeof f)) {
            var u = f.then;
            if ("function" == typeof u) return void u.call(f, function (t) {
              o(e, t);
            }, n);
          }

          i[e] = f, 0 == --r && t(i);
        } catch (e) {
          n(e);
        }
      }

      if (!e || void 0 === e.length) throw new TypeError("Promise.all accepts an array");
      var i = Array.prototype.slice.call(e);
      if (0 === i.length) return t([]);

      for (var r = i.length, f = 0; i.length > f; f++) {
        o(f, i[f]);
      }
    });
  }, t.resolve = function (e) {
    return e && "object" == _typeof(e) && e.constructor === t ? e : new t(function (t) {
      t(e);
    });
  }, t.reject = function (e) {
    return new t(function (t, n) {
      n(e);
    });
  }, t.race = function (e) {
    return new t(function (t, n) {
      for (var o = 0, i = e.length; i > o; o++) {
        e[o].then(t, n);
      }
    });
  }, t._immediateFn = "function" == typeof setImmediate && function (e) {
    setImmediate(e);
  } || function (e) {
    u(e, 0);
  }, t._unhandledRejectionFn = function (e) {
    void 0 !== console && console && console.warn("Possible Unhandled Promise Rejection:", e);
  }, t;
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10).setImmediate))

/***/ }),
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_login_vue__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_login_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_login_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_login_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_login_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_59496b29_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_login_vue__ = __webpack_require__(53);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(49)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_login_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_59496b29_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_login_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/vue-comp/login.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-59496b29", Component.options)
  } else {
    hotAPI.reload("data-v-59496b29", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(50);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("1ce50758", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-59496b29\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./login.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-59496b29\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./login.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n:root{font-family:Marta;font-size:16px;line-height:1.4\n}\n.auth-page{width:100%;height:100vh;display:flex;font-weight:700\n}\n.forms{width:50%;padding-top:15%;padding-left:calc(4.16667vw * 2);padding-right:calc(4.16667vw * 2)\n}\n.info{width:50%;padding-top:15%;padding-left:calc(4.16667vw * 2);padding-right:calc(4.16667vw * 2)\n}\n.info{background-color:#656695;background-image:linear-gradient(0deg,#313149,#656695 95%);color:#fff\n}\n.info ul{list-style:none;margin-top:40px\n}\n.info li{position:relative;margin-bottom:40px;padding-left:60px\n}\n.info li img{position:absolute;left:0;top:-10px;max-width:40px\n}\n.forms-nav{text-align:center;height:2rem\n}\n.forms-nav a{color:#092e64;font-size:2rem;transition:all .2s ease-in-out\n}\n.forms-nav a.from-nav__link_inactive{color:#092e64;font-size:1.4rem;opacity:.5\n}\n.auth-form_inactive,.reg-form_inactive{display:none\n}\n.auth-form,.reg-form{padding-top:20px\n}\n.auth-form input{display:block;width:50%;margin:0 auto;margin-bottom:10px;background:none;background-color:#fff;border:none;border-bottom:1px solid #092e64;text-align:center;transition:width .2s ease-in-out\n}\n.reg-form input{display:block;width:50%;margin:0 auto;margin-bottom:10px;background:none;background-color:#fff;border:none;border-bottom:1px solid #092e64;text-align:center;transition:width .2s ease-in-out\n}\n.auth-form input:focus,.reg-form input:focus{width:60%\n}\n.auth-form input[type=submit]{width:30%;margin-top:40px;padding:10px;background-color:#092e64;color:#fff;font-weight:700\n}\n.reg-form input[type=submit]{width:30%;margin-top:40px;padding:10px;background-color:#092e64;color:#fff;font-weight:700\n}\n.log-form__flashmsg{width:50%;opacity:1;margin:0 auto;padding-top:40px;font-size:.8rem;text-align:center;color:#c74545\n}\n.reg-form__flashmsg{width:50%;opacity:1;margin:0 auto;padding-top:40px;font-size:.8rem;text-align:center;color:#c74545\n}\n@media screen and (max-width:812px){\n.auth-page{flex-direction:column;height:auto\n}\n.forms,.info{width:100%;height:auto\n}\n.info li{text-align:left\n}\n.info li img{max-width:30px;top:-10px\n}\n.info li:nth-of-type(2) img{top:0\n}\n.forms-nav a{font-size:1.1rem\n}\n.forms-nav a.from-nav__link_inactive{font-size:.9rem\n}\n.auth-page ul{text-align:center;list-style:none\n}\n.auth-page li{margin-bottom:10px;font-style:italic\n}\n}", "", {"version":3,"sources":["/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/css/variables.css","/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/vue-comp/src/vue-comp/login.vue"],"names":[],"mappings":";AAAA,MACI,kBAAqB,eACL,eACC;CAapB;AC2MD,WACA,WAAA,aACA,aACA,eACA;CAEA;AAEA,OAEA,UAAA,gBACA,iCACA,iCACA;CACA;AANA,MAEA,UAAA,gBACA,iCACA,iCACA;CACA;AAEA,MACA,yBAAA,2DACA,UACA;CACA;AAEA,SACA,gBAAA,eACA;CACA;AAEA,SACA,kBAAA,mBACA,iBACA;CACA;AAEA,aACA,kBAAA,OACA,UACA,cACA;CACA;AAEA,WACA,kBAAA,WACA;CACA;AAEA,aACA,cAAA,eACA,8BAGA;CACA;AAGA,qCACA,cAAA,iBACA,UACA;CACA;AAEA,uCAEA,YAAA;CACA;AAEA,qBAEA,gBAAA;CACA;AAEA,iBAEA,cAAA,UACA,cACA,mBACA,gBACA,sBACA,YACA,gCACA,kBACA,gCAGA;CACA;AAdA,gBAEA,cAAA,UACA,cACA,mBACA,gBACA,sBACA,YACA,gCACA,kBACA,gCAGA;CACA;AAEA,6CAEA,SAAA;CACA;AAEA,8BAEA,UAAA,gBACA,aACA,yBACA,WACA,eACA;CACA;AARA,6BAEA,UAAA,gBACA,aACA,yBACA,WACA,eACA;CACA;AAEA,oBAEA,UAAA,UACA,cACA,iBACA,gBACA,kBACA,aACA;CACA;AATA,oBAEA,UAAA,UACA,cACA,iBACA,gBACA,kBACA,aACA;CACA;AAEA;AACA,WACA,sBAAA,WACA;CACA;AAEA,aAEA,WAAA,WACA;CACA;AAEA,SACA,eAAA;CACA;AAEA,aACA,eAAA,SACA;CACA;AAEA,4BACA,KAAA;CACA;AAEA,aACA,gBAAA;CACA;AAEA,qCACA,eAAA;CACA;AAEA,cACA,kBAAA,eACA;CACA;AAEA,cACA,mBAAA,iBACA;CACA;CAEA","file":"login.vue","sourcesContent":[":root {\n    font-family: 'Marta';\n    font-size: 16px;\n    line-height: 1.4;\n    --blue: #092E64;\n    --purple: #656695;\n    --darkpurple: #313149;\n    --marine: #3493A8;\n    --yellow: #EFDA7B;\n    --green: #9DBE87;\n    --red: #c74545;\n    --background: #e6e5e5;\n    --column: calc(100vw / 24);\n    --row: calc(100vh / 12);\n    --column-mobile: calc(100vw / 12);\n    --row-mobile: calc(100vh / 24);\n}\n","<template lang=\"html\">\n    <div class=\"auth-page\">\n\n        <div class=\"forms\">\n\n            <div class=\"forms-nav\">\n\n                <a\n                    href=\"/auth\"\n                    :class=\"[activeTab == 'auth' ? '' : 'from-nav__link_inactive']\"\n                    @click.prevent=\"changeTab\"\n                >\n                Авторизация\n                </a>\n\n                <span>/</span>\n\n                <a\n                    href=\"/reg\"\n                    :class=\"[activeTab == 'reg' ? '' : 'from-nav__link_inactive']\"\n                    @click.prevent=\"changeTab\"\n                >\n                Регистрация\n                </a>\n\n            </div>\n\n            <form\n                :class=\"authForm\"\n                @submit.prevent=\"authorize\"\n            >\n\n                <input type=\"text\" name=\"user_email_login\" id=\"user_email_login\" value=\"\" placeholder=\"Email\" v-model=\"loginFormData.userEmail\" required>\n                <input type=\"password\" name=\"user_password_login\" id=\"user_password_login\" value=\"\" placeholder=\"Пароль\" v-model=\"loginFormData.userPassword\" required>\n                <input type=\"submit\" name=\"Enter\" value=\"Войти\">\n\n                <p :class=\"loginErrClass\">{{loginFormErr}}</p>\n\n            </form>\n\n            <form\n                :class=\"regForm\"\n                @submit.prevent=\"registration\"\n            >\n\n                <input type=\"text\" name=\"user_email\" id=\"user_email\" value=\"\" placeholder=\"Email\" v-model=\"regFormData.userEmail\" required>\n                <input type=\"password\" name=\"user_password\" id=\"user_password\" value=\"\" placeholder=\"Пароль\" v-model=\"regFormData.userPassword\" required>\n                <input type=\"password\" name=\"user_password_re\" id=\"user_password_re\" value=\"\" placeholder=\"Повторите пароль\" v-model=\"regFormData.userPassword_re\" required>\n                <input type=\"text\" name=\"user_name\" id=\"user_name\" value=\"\" placeholder=\"Имя\" v-model=\"regFormData.userName\">\n                <input type=\"text\" name=\"user_last_name\" id=\"user_last_name\" value=\"\" placeholder=\"Фамилия\" v-model=\"regFormData.userLastName\">\n                <input type=\"text\" name=\"user_company\" id=\"user_company\" value=\"\" placeholder=\"Компания\" v-model=\"regFormData.userComapny\">\n                <input type=\"submit\" name=\"Enter\" value=\"Регистрация\">\n\n                <p :class=\"regErrClass\">{{regFormErr}}</p>\n\n            </form>\n\n        </div>\n\n        <div class=\"info\">\n            <h1>Добро пожаловать в Tester</h1>\n            <p>Tester – это удобная платформа для быстрого создания опроса или тестирования. Вы можете быстро создать свой тест через веб-интерфейс и посмотреть статистику ответов. Гибкая настройка вопросов, возможность ограничить тестирование по времени. </p>\n            <ul>\n                <li><img src=\"img/settings_main.svg\" alt=\"\"> Гибкая настройка вопросов</li>\n                <li><img src=\"img/graph.svg\" alt=\"\"> Общая статистика по каждому тесту</li>\n                <li><img src=\"img/watch_main.svg\" alt=\"\">Возможность ограничить тестирование по времени</li>\n            </ul>\n        </div>\n\n    </div>\n\n\n\n\n</template>\n\n<script>\n\nimport variables from './../css/variables.css';\nimport Registration from './../js/reg.js';\nimport axios from './../../node_modules/axios/dist/axios.js';\n\n\nexport default {\n\n    data() {\n        return {\n            // Активный таб\n            activeTab: 'auth',\n\n            // Ошибки формы авторизации\n            loginFormErr: '',\n\n            // Ошибки формы регистрации\n            regFormErr: '',\n\n            // Данные авторизации\n            loginFormData: {\n                userEmail: '',\n                userPassword: ''\n            },\n\n            // Данные регистрации\n            regFormData: {\n                userEmail: '',\n                userPassword: '',\n                userPassword_re: '',\n                userName: '',\n                userLastName: '',\n                userCompany: ''\n            }\n        }\n\n    },\n\n    computed: {\n        // Объект класса формы авторизации\n        authForm() {\n            return {\n                'auth-form': true,\n                'auth-form_inactive': this.activeTab === 'reg'\n            }\n        },\n\n        // Объект класса формы регистрации\n        regForm() {\n            return {\n                'reg-form': true,\n                'reg-form_inactive': this.activeTab === 'auth'\n            }\n        },\n\n        loginErrClass() {\n            return {\n                'log-form__flashmsg': true,\n                'log-form__flashmsg_inactive': this.regFormErr.length === 0\n            }\n        },\n\n        // Объект класса поля ошибок формы регистрации\n        regErrClass() {\n            return {\n                'reg-form__flashmsg': true,\n                'reg-form__flashmsg_inactive': this.regFormErr.length === 0\n            }\n        }\n\n    },\n\n    methods: {\n        // Обработчик события переключения табов Авторизация/Регистрация\n        changeTab(e) {\n            this.activeTab = e.target.getAttribute('href').slice(1);\n            e.target.classList.contains\n        },\n\n        // Обработчик события авторизации пользователя\n        authorize(e) {\n\n            axios.post('php/auth.php',this.loginFormData)\n            .then( (res) => {\n                if(!res.data.success) {\n                    console.log(res);\n                    throw new Error(res.data.errorMsg);\n                }\n                else {\n                    let query = localStorage.getItem('query');\n                    localStorage.setItem('user_email', res.data.email);\n                    console.log(res.data);\n                    !query ? this.$router.push({path: '/tester'}) : window.location.href = window.location.origin + '/exec?' + query;\n                }\n            })\n            .catch( (err) => {\n                console.log(err);\n                this.loginFormErr = err.message;\n                setTimeout( () => this.regFormErr = '', 4000);\n            });\n        },\n\n        // Обработчик события регистрации пользователя\n        registration(e) {\n            let res = Registration.checkData(this.regFormData);\n            if(!res.success) {\n                this.regFormErr = res.errorMsg;\n                setTimeout( () => this.regFormErr = '', 4000);\n            }\n            else {\n                axios.post('php/reg.php', this.regFormData)\n                .then( (res) => {\n                    console.log(res);\n                    if(!res.data.success) {\n                        throw new Error(res.data.errorMsg);\n                    }\n                    else {\n                        let query = localStorage.getItem('query');\n                        localStorage.setItem('user_email', res.data.email);\n                        console.log(res.data);\n                        !query ? this.$router.push({path: '/tester'}) : window.location.href = window.location.origin + '/exec?' + query;\n                    }\n                })\n                .catch( (err) => {\n                    console.log(err);\n                    this.regFormErr = err.message;\n                });\n            }\n        }\n    },\n\n    beforeRouteLeave(to, from, next) {\n        localStorage.getItem('query') ? localStorage.removeItem('query') : false;\n        next();\n    }\n\n}\n</script>\n\n<style lang=\"css\">\n\n    @import './../css/variables.css';\n\n    .auth-page {\n        width: 100%;\n        height: 100vh;\n        display: flex;\n        font-weight: bold;\n\n    }\n\n    .forms,\n    .info {\n        width: 50%;\n        padding-top: 15%;\n        padding-left: calc(var(--column) * 2);\n        padding-right: calc(var(--column) * 2);\n    }\n\n    .info {\n        background-color: var(--purple);\n        background-image: linear-gradient(to top, var(--darkpurple), var(--purple) 95%);\n        color: #fff;\n    }\n\n    .info ul {\n        list-style: none;\n        margin-top: 40px;\n    }\n\n    .info li {\n        position: relative;\n        margin-bottom: 40px;\n        padding-left: 60px;\n    }\n\n    .info li img {\n        position: absolute;\n        left: 0;\n        top: -10px;\n        max-width: 40px;\n    }\n\n    .forms-nav {\n        text-align: center;\n        height: 2rem;\n    }\n\n    .forms-nav a {\n        color: var(--blue);\n        font-size: 2rem;\n        -webkit-transition: all .2s ease-in-out;\n        -o-transition: all .2s ease-in-out;\n        transition: all .2s ease-in-out;\n    }\n\n\n    .forms-nav a.from-nav__link_inactive {\n        color: var(--blue);\n        font-size: 1.4rem;\n        opacity: 0.5;\n    }\n\n    .auth-form_inactive,\n    .reg-form_inactive {\n        display: none;\n    }\n\n    .auth-form,\n    .reg-form {\n        padding-top: 20px;\n    }\n\n    .auth-form input,\n    .reg-form input {\n        display: block;\n        width: 50%;\n        margin: 0 auto;\n        margin-bottom: 10px;\n        background: none;\n        background-color: #fff;\n        border: none;\n        border-bottom: 1px solid var(--blue);\n        text-align: center;\n        -webkit-transition: width .2s ease-in-out;\n        -o-transition: width .2s ease-in-out;\n        transition: width .2s ease-in-out;\n    }\n\n    .auth-form input:focus,\n    .reg-form input:focus {\n        width: 60%;\n    }\n\n    .auth-form input[type=\"submit\"],\n    .reg-form input[type=\"submit\"] {\n        width: 30%;\n        margin-top: 40px;\n        padding: 10px;\n        background-color: var(--blue);\n        color: #fff;\n        font-weight: bold;\n    }\n\n    .log-form__flashmsg,\n    .reg-form__flashmsg {\n        width: 50%;\n        opacity: 1;\n        margin: 0 auto;\n        padding-top: 40px;\n        font-size: .8rem;\n        text-align: center;\n        color: var(--red);\n    }\n\n    @media screen and (max-width: 812px) {\n        .auth-page {\n            flex-direction: column;\n            height: auto;\n        }\n\n        .forms,\n        .info {\n            width: 100%;\n            height: auto;\n        }\n\n        .info li {\n            text-align: left;\n        }\n\n        .info li img {\n            max-width: 30px;\n            top: -10px;\n        }\n\n        .info li:nth-of-type(2) img {\n            top: 0px;\n        }\n\n        .forms-nav a {\n            font-size: 1.1rem;\n        }\n\n        .forms-nav a.from-nav__link_inactive {\n            font-size: .9rem;\n        }\n\n        .auth-page ul {\n            text-align: center;\n            list-style: none;\n        }\n\n        .auth-page li{\n            margin-bottom: 10px;\n            font-style: italic;\n        }\n\n    }\n\n\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 51 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  //Проверка регистрационных данных пользователя
  checkData: function checkData(data) {
    var result = {
      success: true,
      errorMsg: ''
    };

    for (var prop in data) {
      switch (prop) {
        case 'userEmail':
          var pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          result.success = pattern.test(data[prop]);

          if (!result.success) {
            result.errorMsg = 'Неверный формат электронной почты, пожалуйста, введите электронный адрес формата "example@domain.com"';
            return result;
          }

          break;

        case 'userPassword':
          var pattern = /[a-z0-9!@#$%^&*]/i;
          result.success = pattern.test(data[prop]) && data[prop].length >= 6;

          if (!result.success) {
            result.errorMsg = 'Поле пароля долдно содержать только буквы латинского алфавита и спецсимволы !@#$%^&*, а также должно содержать минимуи 6 символов';
            return result;
          }

          break;

        case 'userPassword_re':
          var pattern = new RegExp(data.userPassword);
          result.success = pattern.test(data[prop]);

          if (!result.success) {
            result.errorMsg = 'Введенные пароли не совпадают! Попробуйте еще раз.';
            return result;
          }

          break;
      }
    }

    return result;
  }
};
exports.default = _default;

/***/ }),
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "auth-page" }, [
    _c("div", { staticClass: "forms" }, [
      _c("div", { staticClass: "forms-nav" }, [
        _c(
          "a",
          {
            class: [_vm.activeTab == "auth" ? "" : "from-nav__link_inactive"],
            attrs: { href: "/auth" },
            on: {
              click: function($event) {
                $event.preventDefault()
                _vm.changeTab($event)
              }
            }
          },
          [_vm._v("\n            Авторизация\n            ")]
        ),
        _vm._v(" "),
        _c("span", [_vm._v("/")]),
        _vm._v(" "),
        _c(
          "a",
          {
            class: [_vm.activeTab == "reg" ? "" : "from-nav__link_inactive"],
            attrs: { href: "/reg" },
            on: {
              click: function($event) {
                $event.preventDefault()
                _vm.changeTab($event)
              }
            }
          },
          [_vm._v("\n            Регистрация\n            ")]
        )
      ]),
      _vm._v(" "),
      _c(
        "form",
        {
          class: _vm.authForm,
          on: {
            submit: function($event) {
              $event.preventDefault()
              _vm.authorize($event)
            }
          }
        },
        [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.loginFormData.userEmail,
                expression: "loginFormData.userEmail"
              }
            ],
            attrs: {
              type: "text",
              name: "user_email_login",
              id: "user_email_login",
              value: "",
              placeholder: "Email",
              required: ""
            },
            domProps: { value: _vm.loginFormData.userEmail },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.loginFormData, "userEmail", $event.target.value)
              }
            }
          }),
          _vm._v(" "),
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.loginFormData.userPassword,
                expression: "loginFormData.userPassword"
              }
            ],
            attrs: {
              type: "password",
              name: "user_password_login",
              id: "user_password_login",
              value: "",
              placeholder: "Пароль",
              required: ""
            },
            domProps: { value: _vm.loginFormData.userPassword },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.loginFormData, "userPassword", $event.target.value)
              }
            }
          }),
          _vm._v(" "),
          _c("input", {
            attrs: { type: "submit", name: "Enter", value: "Войти" }
          }),
          _vm._v(" "),
          _c("p", { class: _vm.loginErrClass }, [
            _vm._v(_vm._s(_vm.loginFormErr))
          ])
        ]
      ),
      _vm._v(" "),
      _c(
        "form",
        {
          class: _vm.regForm,
          on: {
            submit: function($event) {
              $event.preventDefault()
              _vm.registration($event)
            }
          }
        },
        [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.regFormData.userEmail,
                expression: "regFormData.userEmail"
              }
            ],
            attrs: {
              type: "text",
              name: "user_email",
              id: "user_email",
              value: "",
              placeholder: "Email",
              required: ""
            },
            domProps: { value: _vm.regFormData.userEmail },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.regFormData, "userEmail", $event.target.value)
              }
            }
          }),
          _vm._v(" "),
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.regFormData.userPassword,
                expression: "regFormData.userPassword"
              }
            ],
            attrs: {
              type: "password",
              name: "user_password",
              id: "user_password",
              value: "",
              placeholder: "Пароль",
              required: ""
            },
            domProps: { value: _vm.regFormData.userPassword },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.regFormData, "userPassword", $event.target.value)
              }
            }
          }),
          _vm._v(" "),
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.regFormData.userPassword_re,
                expression: "regFormData.userPassword_re"
              }
            ],
            attrs: {
              type: "password",
              name: "user_password_re",
              id: "user_password_re",
              value: "",
              placeholder: "Повторите пароль",
              required: ""
            },
            domProps: { value: _vm.regFormData.userPassword_re },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(
                  _vm.regFormData,
                  "userPassword_re",
                  $event.target.value
                )
              }
            }
          }),
          _vm._v(" "),
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.regFormData.userName,
                expression: "regFormData.userName"
              }
            ],
            attrs: {
              type: "text",
              name: "user_name",
              id: "user_name",
              value: "",
              placeholder: "Имя"
            },
            domProps: { value: _vm.regFormData.userName },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.regFormData, "userName", $event.target.value)
              }
            }
          }),
          _vm._v(" "),
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.regFormData.userLastName,
                expression: "regFormData.userLastName"
              }
            ],
            attrs: {
              type: "text",
              name: "user_last_name",
              id: "user_last_name",
              value: "",
              placeholder: "Фамилия"
            },
            domProps: { value: _vm.regFormData.userLastName },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.regFormData, "userLastName", $event.target.value)
              }
            }
          }),
          _vm._v(" "),
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.regFormData.userComapny,
                expression: "regFormData.userComapny"
              }
            ],
            attrs: {
              type: "text",
              name: "user_company",
              id: "user_company",
              value: "",
              placeholder: "Компания"
            },
            domProps: { value: _vm.regFormData.userComapny },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.regFormData, "userComapny", $event.target.value)
              }
            }
          }),
          _vm._v(" "),
          _c("input", {
            attrs: { type: "submit", name: "Enter", value: "Регистрация" }
          }),
          _vm._v(" "),
          _c("p", { class: _vm.regErrClass }, [_vm._v(_vm._s(_vm.regFormErr))])
        ]
      )
    ]),
    _vm._v(" "),
    _vm._m(0)
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "info" }, [
      _c("h1", [_vm._v("Добро пожаловать в Tester")]),
      _vm._v(" "),
      _c("p", [
        _vm._v(
          "Tester – это удобная платформа для быстрого создания опроса или тестирования. Вы можете быстро создать свой тест через веб-интерфейс и посмотреть статистику ответов. Гибкая настройка вопросов, возможность ограничить тестирование по времени. "
        )
      ]),
      _vm._v(" "),
      _c("ul", [
        _c("li", [
          _c("img", { attrs: { src: "img/settings_main.svg", alt: "" } }),
          _vm._v(" Гибкая настройка вопросов")
        ]),
        _vm._v(" "),
        _c("li", [
          _c("img", { attrs: { src: "img/graph.svg", alt: "" } }),
          _vm._v(" Общая статистика по каждому тесту")
        ]),
        _vm._v(" "),
        _c("li", [
          _c("img", { attrs: { src: "img/watch_main.svg", alt: "" } }),
          _vm._v("Возможность ограничить тестирование по времени")
        ])
      ])
    ])
  }
]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-59496b29", esExports)
  }
}

/***/ }),
/* 54 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_tester_vue__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_tester_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_tester_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_tester_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_tester_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7f9081a2_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_tester_vue__ = __webpack_require__(100);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(55)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_tester_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7f9081a2_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_tester_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/vue-comp/tester.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7f9081a2", Component.options)
  } else {
    hotAPI.reload("data-v-7f9081a2", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(56);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("5281e9a8", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7f9081a2\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./tester.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7f9081a2\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./tester.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n:root{font-family:Marta;font-size:16px;line-height:1.4\n}\n.content{margin-left:calc(4.16667vw * 2);margin-right:calc(4.16667vw * 2);width:calc(4.16667vw * 16)\n}\n.tester-page{width:100%;padding-top:calc(8.33333vh * 2);display:flex;background-color:#e6e5e5\n}\n.tests-list-main{width:100%;align-items:center\n}\n.tests-list,.tests-list-main{display:flex;justify-content:flex-start;flex-wrap:wrap\n}\n.tests-list>:nth-child(3n+1){margin-right:calc(4.16667vw * 1)\n}\n.tests-list>:nth-child(3n+3){margin-left:calc(4.16667vw * 1)\n}\n.add-new-test{width:calc(4.16667vw * 4);max-height:calc(8.33333vh * 4);min-height:calc(8.33333vh * 4);cursor:pointer;background-color:#e6e5e5;border:none;background-repeat:no-repeat;background-position:50%;background-size:auto\n}\n.add-new-test img{display:block;width:100%;box-shadow:1px 1px 4px rgba(0,0,0,.1);opacity:.2;transition:opacity .3s ease-in-out\n}\n.add-new-test img:hover{opacity:1;box-shadow:2px 2px 6px rgba(0,0,0,.3)\n}\n.fix{opacity:0;position:fixed;top:-100;display:none\n}\n.fade-enter-active,.fade-leave-active{transition:opacity .5s\n}\n.fade-enter,.fade-leave-to{opacity:0\n}\n@media screen and (max-width:812px){\n.tester-page .content{flex-flow:column;margin:0;width:calc(8.33333vw * 12)\n}\n.tests-list{flex-flow:column;justify-content:center;align-items:center;width:100%\n}\n.tests-list>:nth-child(3n+1){margin-right:0\n}\n.tests-list>:nth-child(3n+3){margin-left:0\n}\n.new-test-nav{padding:10px\n}\n.new-test-nav ul{display:flex;justify-content:flex-end\n}\n.new-test-nav li{min-width:calc(8.33333vw * 3);font-size:.8rem\n}\n.new-test-nav li:last-child{padding-left:10px\n}\n.add-new-test{width:calc(8.33333vw * 12 - 40px);max-height:0;min-height:300px;margin:0\n}\n}", "", {"version":3,"sources":["/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/css/variables.css","/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/vue-comp/src/vue-comp/tester.vue"],"names":[],"mappings":";AAAA,MACI,kBAAqB,eACL,eACC;CAapB;ACkRD,SACA,gCAAA,iCACA,0BACA;CACA;AAEA,aACA,WAAA,gCACA,aACA,wBACA;CACA;AAMA,iBACA,WAAA,kBAGA;CAEA;AAEA,6BANA,aAAA,2BACA,cAEA;CASA;AAEA,6BACA,gCAAA;CACA;AAEA,6BACA,+BAAA;CACA;AAEA,cACA,0BAAA,+BACA,+BACA,eACA,yBACA,YACA,4BAGA,wBACA,oBACA;CAEA;AAEA,kBACA,cAAA,WACA,sCAEA,WACA,kCAGA;CACA;AAEA,wBACA,UAAA,qCAEA;CACA;AAEA,KACA,UAAA,eACA,SACA,YACA;CACA;AAEA,sCACA,sBAAA;CACA;AACA,2BACA,SAAA;CACA;AAEA;AAEA,sBACA,iBAAA,SACA,0BACA;CACA;AAEA,YACA,iBAAA,uBACA,mBACA,UACA;CACA;AAEA,6BACA,cAAA;CACA;AAEA,6BACA,aAAA;CACA;AAEA,cACA,YAAA;CACA;AAEA,iBACA,aAAA,wBACA;CACA;AAEA,iBACA,8BAAA,eACA;CACA;AAEA,4BACA,iBAAA;CACA;AAEA,cACA,kCAAA,aACA,iBACA,QACA;CACA;CAEA","file":"tester.vue","sourcesContent":[":root {\n    font-family: 'Marta';\n    font-size: 16px;\n    line-height: 1.4;\n    --blue: #092E64;\n    --purple: #656695;\n    --darkpurple: #313149;\n    --marine: #3493A8;\n    --yellow: #EFDA7B;\n    --green: #9DBE87;\n    --red: #c74545;\n    --background: #e6e5e5;\n    --column: calc(100vw / 24);\n    --row: calc(100vh / 12);\n    --column-mobile: calc(100vw / 12);\n    --row-mobile: calc(100vh / 24);\n}\n","<template lang=\"html\">\n\n    <div class=\"tester-page\">\n\n        <side-menu></side-menu>\n        <section class=\"content\">\n\n\n\n              <transition name=\"fade\">\n            <pop-up\n                v-if=\"popUp\"\n                :testtite=\"currentTest.test_name\"\n                :description=\"currentTest.test_description\"\n                :imglink=\"currentTest.test_image\"\n                :anonym=\"currentTest.test_anonym\"\n                :time=\"currentTest.test_time\"\n                :status=\"currentTest.test_status\"\n                :testquestions=\"currentTest.questions\"\n                :testid=\"currentTest.test_id\"\n                @close-window=\"closePopUp\"\n                @edit-test=\"editTestHandler\"\n                @update-test=\"updateTestHandler\"\n                @delete-test=\"deleteTestHandler\"\n\n            >\n\n            </pop-up>\n        </transition>\n\n\n\n            <nav class=\"new-test-nav\">\n                <ul>\n                    <li>\n                        <a\n                            href=\"save\"\n                            @click.prevent=\"showPublished\"\n                        >Опубликованные</a>\n                    </li>\n                    <li>\n                        <a\n                            href=\"publish\"\n                            @click.prevent=\"showDrafts\"\n                        >Черновики</a>\n                    </li>\n                </ul>\n            </nav>\n\n\n\n            <div class=\"loading\" v-if=\"loading\">\n\n                <loading-indicator></loading-indicator>\n\n            </div>\n\n\n            <div class=\"tests-list-main\" v-else>\n\n\n                <div v-if=\"currentSection\" class=\"tests-list\" :key=\"sectionOne\">\n                    <test-item\n                    v-for=\"test in tests.published\"\n                    :description = \"test.test_description\"\n                    :testtitle=\"test.test_name\"\n                    :testid=\"test.test_id\"\n                    :key=\"test.test_id\"\n                    :imglink=\"test.test_img\"\n                    :status=\"test.test_status\"\n                    :respondents=\"test.respondents\"\n                    @show-test=\"showTestHandler\"\n                    @delete-info=\"deleteTest\"\n                    @copy-link=\"copyLinkHander\"\n                    ></test-item>\n                    <button type=\"button\" name=\"button\" class=\"add-new-test\" @click=\"newTest\"><img src=\"img/add.svg\" alt=\"\"></button>\n\n                </div>\n\n                <div v-else class=\"tests-list\" :key=\"sectionTwo\">\n\n                    <test-item\n                    v-for=\"test in tests.drafts\"\n                    :description = \"test.test_description\"\n                    :testtitle=\"test.test_name\"\n                    :testid=\"test.test_id\"\n                    :key=\"test.test_id\"\n                    :imglink=\"test.test_img\"\n                    :status=\"test.test_status\"\n                    @show-test=\"showTestHandler\"\n                    @delete-info=\"deleteTest\"\n                    @edit-test-new=\"editNewTestHandler\"\n                    ></test-item>\n                    <button type=\"button\" name=\"button\" class=\"add-new-test\" @click=\"newTest\"><img src=\"img/add.svg\" alt=\"\"></button>\n\n                </div>\n\n                <!-- <div class=\"add-new-test\" @click=\"newTest\"> -->\n\n                </div>\n\n                <transition name=\"fade\">\n                   <flash-message\n                       v-if=\"flashMsg.text.length > 0\"\n                       :code=\"flashMsg.status\"\n                       :text=\"flashMsg.text\"\n                   >\n                   </flash-message>\n                </transition>\n\n            </section>\n\n\n            </div>\n\n\n</template>\n\n<script>\n\nimport variables from './../css/variables.css';\n\nimport sideMenu from './side-menu.vue';\nimport newTest from './new-test.vue';\nimport loadingIndicator from './interface/loading.vue';\nimport testItem from './interface/test-item.vue';\nimport popUpElem from './interface/pop-up-test.vue';\nimport flashMessage from './interface/flashmessage.vue';\nimport axios from './../../node_modules/axios/dist/axios.js';\n\nexport default {\n\n    components: {\n       'side-menu': sideMenu,\n       'loading-indicator': loadingIndicator,\n       'test-item': testItem,\n       'pop-up': popUpElem,\n      'flash-message': flashMessage\n   },\n\n   data() {\n       return {\n           loading: false,\n           tests: null,\n           currentSection: true,\n           popUp: false,\n           currentTest: null,\n           flashMsg: {\n               text: '',\n               status: 1\n           },\n           sectionOne: 1,\n           sectionTwo: 2\n       }\n   },\n\n   computed: {\n       //Всплывающие сообщения\n       flashMsgClass() {\n           return {\n               'test-flasgMesg' : true,\n               'test-flasgMesg_error' : this.flashMsg.status == 1,\n               'test-flasgMesg_warn' : this.flashMsg.status == 2,\n               'test-flasgMesg_succes' : this.flashMsg.status == 3\n           }\n       }\n   },\n\n   created() {\n       this.fetchData();\n\n   },\n\n   methods: {\n       // Получаем данные о тестах с сервера\n       fetchData() {\n           this.loading = true;\n           axios.get('php/gettests.php')\n           .then( (res) => {\n               this.loading = false;\n               this.tests = {};\n               this.tests.published = [];\n               this.tests.drafts = [];\n               res.data.tests.forEach( (v) => {\n                   v.test_status == 1 ? this.tests.published.push(v) : this.tests.drafts.push(v);\n               });\n               console.log(this.tests);\n\n           })\n           .catch( (err) => {\n               this.loading = false;\n               console.log(err);\n           });\n       },\n       //Вывод сообщения\n       showFlashMsg(status, text) {\n           this.flashMsg.status = status;\n           this.flashMsg.text = text;\n           setTimeout( () => this.flashMsg.text = '', 10000);\n       },\n\n       // Выводим подтверждение того, что тест удален\n\n       deleteTestHandler(code, msg) {\n           this.showFlashMsg(code, msg);\n           this.fetchData();\n           setTimeout( () => {\n               this.$router.replace('/tester');\n           }, 3000)\n       },\n\n       //Выводим сообщение о том, что тест опубликован\n       updateTestHandler(code, msg) {\n           this.showFlashMsg(code, msg);\n           this.fetchData();\n           setTimeout( () => {\n               this.$router.replace('/tester');\n           }, 3000)\n       },\n\n       // Выводим подтверждение того, что ссылка скопирована\n       copyLinkHander(msg) {\n           this.showFlashMsg(3, msg);\n       },\n\n       // Добовление теста\n       newTest() {\n            this.$router.push('/newtest');\n       },\n\n       //Показываем опубликованные тесты\n       showPublished() {\n           this.currentSection = true;\n       },\n\n       // Показываем черновики\n       showDrafts() {\n           this.currentSection = false;\n       },\n       //Выводим всплывающее окно с полной информацией о тесте\n       showTestHandler(id) {\n           let query = `?test_id=${id}`;\n           axios.get(`php/gettest.php${query}`)\n           .then( (res) => {\n               this.currentTest = res.data.test;\n               this.popUp = true;\n           })\n           .catch( (err) => console.log(err));\n       },\n\n       // Редактируем тест из черновиков по быстрой ссылке\n       editNewTestHandler(id) {\n           let query = `?test_id=${id}`;\n           axios.get(`php/gettest.php${query}`)\n           .then( (res) => {\n               this.currentTest = res.data.test;\n               localStorage.setItem('test', JSON.stringify(this.currentTest));\n               this.$router.push('/newtest');\n           })\n           .catch( (err) => console.log(err));\n       },\n\n       //Закрываем всплывающее окно\n       closePopUp() {\n           this.popUp = false;\n       },\n\n       //Редактирование теста\n       editTestHandler(id) {\n            localStorage.setItem('test', JSON.stringify(this.currentTest));\n            this.$router.push('/newtest');\n       },\n\n       // Удаление теста\n       deleteTest(code, msg) {\n           this.showFlashMsg(code, msg);\n           this.fetchData();\n           setTimeout( () => {\n               this.$router.replace('/tester');\n           }, 3000)\n       }\n   }\n\n\n}\n</script>\n\n<style lang=\"css\">\n\n@import './../css/variables.css';\n\n.content {\n    margin-left: calc(var(--column) * 2);\n    margin-right: calc(var(--column) * 2);\n    width: calc(var(--column) * 16);\n}\n\n.tester-page {\n    width: 100%;\n    padding-top: calc(var(--row) * 2);\n    display: flex;\n    background-color: var(--background);\n}\n\n.content {\n    /* margin-left: calc(var(--column) * 6); */\n}\n\n.tests-list-main {\n    width: 100%;\n    display: flex;\n    justify-content: flex-start;\n    align-items: center;\n    flex-wrap: wrap;\n}\n\n.tests-list {\n    /* width: 100%; */\n    /* min-height: 100vh; */\n    display: flex;\n    justify-content: flex-start;\n    flex-wrap: wrap;\n}\n\n.tests-list > *:nth-child(3n+1) {\n    margin-right: calc(var(--column) * 1);\n}\n\n.tests-list > *:nth-child(3n+3) {\n    margin-left: calc(var(--column) * 1);\n}\n\n.add-new-test {\n    width: calc(var(--column) * 4);\n    max-height: calc(var(--row) * 4);\n    min-height: calc(var(--row) * 4);\n    cursor: pointer;\n    background-color: var(--background);\n    border: none;\n\n    /* background-image: url('./../img/add.svg'); */\n    background-repeat: no-repeat;\n    background-position: center;\n    background-size: auto;\n\n}\n\n.add-new-test img {\n    display: block;\n    width: 100%;\n    -webkit-box-shadow: 1px 1px 4px rgba(0,0,0,0.1);\n    box-shadow: 1px 1px 4px rgba(0,0,0,0.1);\n    opacity: .2;\n    -webkit-transition: opacity .3s ease-in-out;\n    -o-transition: opacity .3s ease-in-out;\n    transition: opacity .3s ease-in-out;\n}\n\n.add-new-test img:hover {\n    opacity: 1;\n    -webkit-box-shadow: 2px 2px 4px rgba(0,0,0,0.3);\n    box-shadow: 2px 2px 6px rgba(0,0,0,0.3);\n}\n\n.fix {\n    opacity: 0;\n    position: fixed;\n    top: -100;\n    display: none;\n}\n\n.fade-enter-active, .fade-leave-active {\n  transition: opacity .5s;\n}\n.fade-enter, .fade-leave-to {\n  opacity: 0;\n}\n\n@media screen and (max-width: 812px) {\n\n    .tester-page .content{\n        flex-flow: column;\n        margin: 0;\n        width: calc(var(--column-mobile) * 12);\n    }\n\n    .tests-list {\n        flex-flow: column;\n        justify-content: center;\n        align-items: center;\n        width: 100%;\n    }\n\n    .tests-list > *:nth-child(3n+1) {\n        margin-right: 0;\n    }\n\n    .tests-list > *:nth-child(3n+3) {\n        margin-left: 0;\n    }\n\n    .new-test-nav {\n        padding: 10px;\n    }\n\n    .new-test-nav ul {\n        display: flex;\n        justify-content: flex-end;\n    }\n\n    .new-test-nav li {\n        min-width: calc(var(--column-mobile) * 3);\n        font-size: .8rem;\n    }\n\n    .new-test-nav li:last-child {\n        padding-left: 10px;\n    }\n\n    .add-new-test {\n        width: calc(var(--column-mobile) * 12 - 40px);\n        max-height: 0;\n        min-height: 300px;\n        margin: 0;\n    }\n\n}\n\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(58);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("60be4428", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-d1896c56\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./side-menu.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-d1896c56\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./side-menu.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n:root{font-family:Marta;font-size:16px;line-height:1.4\n}\n.menu{width:calc(4.16667vw * 4);height:100vh\n}\n.side-menu{width:calc(4.16667vw * 4);height:100vh\n}\n.side-menu{z-index:102;position:fixed;top:0;left:0;box-shadow:inset -4px 0 3px rgba(0,0,0,.2);background-color:#313149;background-image:linear-gradient(0deg,#313149,#656695 95%);color:#fff\n}\n.side-menu-nav{padding-top:40px\n}\n.side-menu-nav li{position:relative;list-style:none;padding:20px 0;padding-left:40px;font-weight:700;background-color:transparent;transition:all .3s ease-in-out\n}\n.side-menu-nav li:hover{background-color:rgba(0,0,0,.4)\n}\n.side-menu-nav li:before{position:absolute;left:0;top:0;display:block;transform:scale(0);transform-origin:center;content:\"\";width:3px;height:100%;background-color:#fff;transition:all .2s ease-in-out .2s\n}\n.side-menu-nav li:hover:before{transform:scale(1)\n}\n.side-menu-nav a{color:#fff;display:block\n}\n.side-menu p{text-align:center;font-size:.8rem\n}\n.side-menu p:first-child a{color:#fff;opacity:.6;text-align:center;font-weight:700\n}\n.trigger{display:none\n}\n@media screen and (max-width:812px){\n.menu{width:0\n}\n.trigger{display:block;position:fixed;left:10px;top:10px;z-index:110\n}\n.trigger span{display:block;width:40px;height:5px;background-color:#313149;transition:all .3s ease-in-out\n}\n.trigger_active span{background-color:#fff\n}\n.trigger span:nth-child(2){margin:10px 0\n}\n.side-menu{width:calc(8.33333vw * 8);left:-100%;transition:left .3s ease-in-out\n}\n.side-menu-nav{padding-top:60px\n}\n.side-menu p{position:absolute;font-size:.7rem;bottom:10px;text-align:center;width:100%\n}\n.side-menu p a{display:block\n}\n.side-menu__active{left:0\n}\n}", "", {"version":3,"sources":["/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/css/variables.css","/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/vue-comp/src/vue-comp/side-menu.vue"],"names":[],"mappings":";AAAA,MACI,kBAAqB,eACL,eACC;CAapB;AC4ED,MAJA,0BAAA,YACA;CAeA;AAZA,WAJA,0BAAA,YACA;CAeA;AAZA,WACA,YAAA,eACA,MACA,OACA,2CAEA,yBAGA,2DACA,UACA;CACA;AAGA,eACA,gBAAA;CACA;AAGA,kBACA,kBAAA,gBACA,eACA,kBACA,gBACA,6BACA,8BAGA;CACA;AAEA,wBACA,+BAAA;CACA;AAEA,yBACA,kBAAA,OACA,MACA,cACA,mBACA,wBACA,WACA,UACA,YACA,sBACA,kCAGA;CACA;AAEA,+BACA,kBAAA;CACA;AAEA,iBACA,WAAA,aACA;CACA;AAEA,aACA,kBAAA,eACA;CACA;AAEA,2BACA,WAAA,WACA,kBACA,eACA;CACA;AAEA,SACA,YAAA;CACA;AAEA;AACA,MACA,OAAA;CACA;AAEA,SACA,cAAA,eACA,UACA,SACA,WACA;CACA;AAEA,cACA,cAAA,WACA,WACA,yBACA,8BAGA;CACA;AAEA,qBACA,qBAAA;CACA;AAEA,2BACA,aAAA;CACA;AAGA,WACA,0BAAA,WACA,+BACA;CACA;AAEA,eACA,gBAAA;CACA;AAEA,aACA,kBAAA,gBACA,YACA,kBACA,UACA;CACA;AAEA,eACA,aAAA;CACA;AAEA,mBACA,MAAA;CACA;CACA","file":"side-menu.vue","sourcesContent":[":root {\n    font-family: 'Marta';\n    font-size: 16px;\n    line-height: 1.4;\n    --blue: #092E64;\n    --purple: #656695;\n    --darkpurple: #313149;\n    --marine: #3493A8;\n    --yellow: #EFDA7B;\n    --green: #9DBE87;\n    --red: #c74545;\n    --background: #e6e5e5;\n    --column: calc(100vw / 24);\n    --row: calc(100vh / 12);\n    --column-mobile: calc(100vw / 12);\n    --row-mobile: calc(100vh / 24);\n}\n","<template lang=\"html\">\n\n    <div class=\"menu\">\n\n        <a href=\"\" :class=\"triggerClass\" @click.prevent=\"menuTrigger\">\n            <span></span>\n            <span></span>\n            <span></span>\n        </a>\n\n        <aside :class=\"sideMenuStyle\">\n            <p><a href=\"#\">{{email}}</a></p>\n\n            <nav class=\"side-menu-nav\">\n                <ul>\n                    <li><router-link to=\"/tester\">Мои тесты</router-link></li>\n                    <li><router-link to=\"/newtest\">Новый тест</router-link></li>\n                    <li><router-link to=\"/respondents\">Респонденты</router-link></li>\n                    <li><router-link to=\"/stats\">Статистика</router-link></li>\n                    <li><a\n                            href=\"exit\"\n                            @click.prevent=\"logout\"\n                        >\n                        Выход</a></li>\n                </ul>\n            </nav>\n\n        </aside>\n    </div>\n\n</template>\n\n<script>\n\nimport axios from './../../node_modules/axios/dist/axios.js';\n\nexport default {\n\n    data() {\n        return {\n            mobileMenu: false\n        }\n    },\n\n    methods: {\n\n        //Выход их профиля\n        logout() {\n            localStorage.clear();\n            axios.get('php/logout.php')\n            .then( (res) => this.$router.push('/auth') )\n            .catch( (err) => console.log(err));\n        },\n\n        menuTrigger() {\n            this.mobileMenu ? this.mobileMenu = false : this.mobileMenu = true;\n            console.log(this.mobileMenu);\n        }\n\n    },\n\n    computed: {\n        email() {\n            return localStorage.getItem('user_email');\n        },\n\n        sideMenuStyle() {\n            return {\n                'side-menu': true,\n                'side-menu__active': this.mobileMenu\n            }\n        },\n\n        triggerClass() {\n            return {\n                'trigger': true,\n                'trigger_active': this.mobileMenu\n            }\n        }\n    }\n\n}\n</script>\n\n<style lang=\"css\">\n\n@import './../css/variables.css';\n\n.menu {\n    width: calc(var(--column) * 4);\n    height: 100vh;\n}\n\n.side-menu {\n    z-index: 102;\n    position: fixed;\n    top: 0;\n    left: 0;\n    -webkit-box-shadow: inset -4px 0px 3px rgba(0,0,0,0.2);\n    box-shadow: inset -4px 0px 3px rgba(0,0,0,0.2);\n    width: calc(var(--column) * 4);\n    height: 100vh;\n    background-color: var(--darkpurple);\n    background-image: linear-gradient(to top, var(--darkpurple), var(--purple) 95%);\n    color: #fff;\n}\n\n\n.side-menu-nav {\n    padding-top: 40px;\n}\n\n\n.side-menu-nav li {\n    position: relative;\n    list-style: none;\n    padding: 20px 0px;\n    padding-left: 40px;\n    font-weight: bold;\n    background-color: rgba(0,0,0,0);\n    -webkit-transition: all .3s ease-in-out;\n    -o-transition: all .3s ease-in-out;\n    transition: all .3s ease-in-out;\n}\n\n.side-menu-nav li:hover {\n    background-color: rgba(0,0,0,.4);\n}\n\n.side-menu-nav li:before {\n    position: absolute;\n    left: 0px;\n    top: 0px;\n    display: block;\n    transform: scale(0);\n    transform-origin: center;\n    content: '';\n    width: 3px;\n    height: 100%;\n    background-color: #fff;\n    -webkit-transition: all .2s ease-in-out .2s;\n    -o-transition: all .2s ease-in-out .2s;\n    transition: all .2s ease-in-out .2s;\n}\n\n.side-menu-nav li:hover:before {\n    transform: scale(1);\n}\n\n.side-menu-nav a {\n    color: #fff;\n    display: block;\n}\n\n.side-menu p {\n    text-align: center;\n    font-size: .8rem;\n}\n\n.side-menu p:first-child a{\n    color: #fff;\n    opacity: .6;\n    text-align: center;\n    font-weight: bold;\n}\n\n.trigger {\n    display: none;\n}\n\n@media screen and (max-width: 812px) {\n    .menu {\n        width: 0;\n    }\n\n    .trigger {\n        display: block;\n        position: fixed;\n        left: 10px;\n        top: 10px;\n        z-index: 110;\n    }\n\n    .trigger span {\n        display: block;\n        width: 40px;\n        height: 5px;\n        background-color: var(--darkpurple);\n        -webkit-transition: all .3s ease-in-out;\n        -o-transition: all .3s ease-in-out;\n        transition: all .3s ease-in-out;\n    }\n\n    .trigger_active span {\n        background-color: #fff;\n    }\n\n    .trigger span:nth-child(2) {\n        margin: 10px 0px;\n    }\n\n\n    .side-menu {\n        width: calc(var(--column-mobile) * 8);\n        left: -100%;\n        transition: left .3s ease-in-out;\n    }\n\n    .side-menu-nav {\n        padding-top: 60px;\n    }\n\n    .side-menu p {\n        position: absolute;\n        font-size: .7rem;\n        bottom: 10px;\n        text-align: center;\n        width: 100%;\n    }\n\n    .side-menu p a {\n        display: block;\n    }\n\n    .side-menu__active {\n        left: 0;\n    }\n}\n\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 59 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "menu" }, [
    _c(
      "a",
      {
        class: _vm.triggerClass,
        attrs: { href: "" },
        on: {
          click: function($event) {
            $event.preventDefault()
            _vm.menuTrigger($event)
          }
        }
      },
      [_c("span"), _vm._v(" "), _c("span"), _vm._v(" "), _c("span")]
    ),
    _vm._v(" "),
    _c("aside", { class: _vm.sideMenuStyle }, [
      _c("p", [_c("a", { attrs: { href: "#" } }, [_vm._v(_vm._s(_vm.email))])]),
      _vm._v(" "),
      _c("nav", { staticClass: "side-menu-nav" }, [
        _c("ul", [
          _c(
            "li",
            [
              _c("router-link", { attrs: { to: "/tester" } }, [
                _vm._v("Мои тесты")
              ])
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "li",
            [
              _c("router-link", { attrs: { to: "/newtest" } }, [
                _vm._v("Новый тест")
              ])
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "li",
            [
              _c("router-link", { attrs: { to: "/respondents" } }, [
                _vm._v("Респонденты")
              ])
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "li",
            [
              _c("router-link", { attrs: { to: "/stats" } }, [
                _vm._v("Статистика")
              ])
            ],
            1
          ),
          _vm._v(" "),
          _c("li", [
            _c(
              "a",
              {
                attrs: { href: "exit" },
                on: {
                  click: function($event) {
                    $event.preventDefault()
                    _vm.logout($event)
                  }
                }
              },
              [_vm._v("\n                    Выход")]
            )
          ])
        ])
      ])
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-d1896c56", esExports)
  }
}

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(61);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("256bf384", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1d6eb5e2\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./new-test.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1d6eb5e2\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./new-test.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(5);
exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n:root{font-family:Marta;font-size:16px;line-height:1.4\n}\n.newtest-page{background-color:#e6e5e5;display:flex\n}\n.newtest-page .content{margin-left:calc(4.16667vw * 2);margin-right:calc(4.16667vw * 2);width:calc(4.16667vw * 16)\n}\n.new-test-form{padding-top:calc(4.16667vw * 2);position:relative\n}\n.new-test-form__title{display:block;width:98%;border:none;border-bottom:3px solid rgba(0,0,0,.1);margin-bottom:40px;font-family:marta;font-size:3rem;color:#092e64\n}\n.new-test-form__options{background-color:#fff;box-shadow:1px 1px 4px rgba(0,0,0,.1);padding:20px\n}\n.new-test-form__options h3{padding:0;margin:0;margin-bottom:20px;color:#8496b1\n}\n.new-test-form__description{padding:10px;border:none;margin-bottom:20px;width:98%;max-width:98%;min-width:98%;max-height:calc(8.33333vh * 2);min-height:calc(8.33333vh * 2);height:calc(8.33333vh * 2);border:3px solid rgba(0,0,0,.1)\n}\n.new-test-form__options label{color:#8496b1\n}\n.new-test-form__options label.active{color:#656695\n}\n.new-test-form__inputs>*{display:inline-block\n}\n.new-test-form__inputs img{max-width:30px;margin-bottom:-10px;margin-left:20px\n}\n.new-test-form__inputs img:first-child{padding-left:0\n}\n.new-test-form__inputs input[type=text]{background-color:#dddde8;border:none;border-bottom:1px solid #092e64;width:50px;text-align:center\n}\n.new-test-form__inputs input[type=checkbox]{display:none\n}\n.new-test__add-question{border:none;margin:40px 0;padding-left:40px;font-family:marta;font-size:1.2rem;font-weight:700;cursor:pointer;background-image:url(" + escape(__webpack_require__(17)) + ");background-repeat:no-repeat;background-position:0;background-color:#e6e5e5;color:#656695;opacity:.5;transition:opacity .2s ease-in-out\n}\n.new-test__add-question:hover{opacity:1\n}\n.test-flasgMesg{z-index:201;position:fixed;max-width:30%;top:40px;right:40px;padding:20px;color:#fff;font-size:1.1rem;text-align:center;font-weight:700\n}\n.test-flasgMesg_error{background-color:#c74545\n}\n.test-flasgMesg_warn{background-color:#efda7b\n}\n.test-flasgMesg_succes{background-color:#9dbe87\n}\n.fade-enter-active,.fade-leave-active{transition:opacity .3s ease-in-out\n}\n.fade-enter,.fade-leave-to{opacity:0\n}\n@media screen and (max-width:812px){\n.newtest-page .content{width:100%;margin:0;justify-content:center;align-items:center\n}\n.new-test-nav{padding:10px\n}\n.new-test-nav ul{display:flex;justify-content:flex-end\n}\n.new-test-nav li{min-width:calc(8.33333vw * 3);font-size:.8rem\n}\n.new-test-nav li:last-child{padding-left:10px\n}\n.new-test-form{padding-top:calc(4.16667vh * 4)\n}\n.new-test-form__options{width:90%;margin:0 auto\n}\n.new-test-form__inputs img{float:left;clear:left;margin-bottom:1px\n}\n.new-test-form__options label{font-size:.8rem;padding-left:40px;margin-bottom:12px\n}\n.new-test__add-question{display:block;margin:40px auto\n}\n}", "", {"version":3,"sources":["/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/css/variables.css","/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/vue-comp/src/vue-comp/new-test.vue"],"names":[],"mappings":";AAAA,MACI,kBAAqB,eACL,eACC;CAapB;AC+UD,cAEA,yBAAA,YACA;CACA;AAEA,uBACA,gCAAA,iCACA,0BACA;CACA;AAIA,eACA,gCAAA,iBACA;CACA;AAEA,sBACA,cAAA,UACA,YACA,uCACA,mBACA,kBACA,eACA,aACA;CACA;AAEA,wBACA,sBAAA,sCAEA,YACA;CACA;AAEA,2BACA,UAAA,SACA,mBACA,aACA;CACA;AAEA,4BACA,aAAA,YACA,mBACA,UACA,cACA,cACA,+BACA,+BACA,2BACA,+BACA;CACA;AAEA,8BACA,aAAA;CACA;AAEA,qCACA,aAAA;CACA;AAEA,yBACA,oBAAA;CACA;AAEA,2BACA,eAAA,oBACA,gBACA;CACA;AAEA,uCACA,cAAA;CACA;AAEA,wCACA,yBAAA,YACA,gCACA,WACA,iBACA;CACA;AAEA,4CACA,YAAA;CACA;AAEA,wBACA,YAAA,cACA,kBACA,kBACA,iBACA,gBACA,eACA,+CACA,4BACA,sBACA,yBACA,cACA,WACA,kCAGA;CACA;AAEA,8BACA,SAAA;CACA;AAEA,gBACA,YAAA,eACA,cACA,SACA,WACA,aACA,WACA,iBACA,kBACA,eACA;CACA;AAEA,sBACA,wBAAA;CACA;AAEA,qBACA,wBAAA;CACA;AAEA,uBACA,wBAAA;CACA;AAEA,sCACA,kCAAA;CACA;AAEA,2BACA,SAAA;CACA;AAEA;AAEA,uBACA,WAAA,SACA,uBACA,kBACA;CACA;AAEA,cACA,YAAA;CACA;AAEA,iBACA,aAAA,wBACA;CACA;AAEA,iBACA,8BAAA,eACA;CACA;AAEA,4BACA,iBAAA;CACA;AAEA,eACA,+BAAA;CACA;AAEA,wBACA,UAAA,aACA;CAEA;AAEA,2BACA,WAAA,WACA,iBACA;CACA;AAEA,8BACA,gBAAA,kBACA,kBACA;CACA;AAEA,wBACA,cAAA,gBACA;CACA;CAKA","file":"new-test.vue","sourcesContent":[":root {\n    font-family: 'Marta';\n    font-size: 16px;\n    line-height: 1.4;\n    --blue: #092E64;\n    --purple: #656695;\n    --darkpurple: #313149;\n    --marine: #3493A8;\n    --yellow: #EFDA7B;\n    --green: #9DBE87;\n    --red: #c74545;\n    --background: #e6e5e5;\n    --column: calc(100vw / 24);\n    --row: calc(100vh / 12);\n    --column-mobile: calc(100vw / 12);\n    --row-mobile: calc(100vh / 24);\n}\n","<template lang=\"html\">\n\n    <div class=\"newtest-page\">\n\n        <side-menu></side-menu>\n        <section class=\"content\">\n\n            <nav class=\"new-test-nav\">\n                <ul>\n                    <li>\n                        <a\n                            href=\"save\"\n                            @click.prevent=\"saveTest(0)\"\n                        >Сохранить</a>\n                    </li>\n                    <li>\n                        <a href=\"publish\"\n                        @click.prevent=\"saveTest(1)\"\n                    >Опубликовать</a>\n                    </li>\n                </ul>\n            </nav>\n\n            <form class=\"new-test-form\">\n\n\n                <div class=\"new-test-form__options\">\n                    <input type=\"text\" class=\"new-test-form__title\" placeholder=\"Название теста\" v-model=\"testTitle\">\n                    <h3>Описание:</h3>\n                    <textarea v-model=\"testDescription\" class=\"new-test-form__description\" name=\"test_description\"></textarea>\n\n                    <div class=\"new-test-form__inputs\">\n                        <img :src=\"timeToggle\" alt=\"\">\n                        <label for=\"time_limit\" :class=\"labelTime\">Лимит по времени</label>\n                        <input type=\"checkbox\" name=\"time_limit\" id=\"time_limit\" v-model=\"testOptions.timeLimit\">\n                        <transition name=\"fade\">\n                        <img src=\"img/stopwatch.svg\" alt=\"\" v-if=\"testOptions.timeLimit\">\n                        </transition>\n                        <transition name=\"fade\">\n                        <label class=\"active\" for=\"time\" v-if=\"testOptions.timeLimit\">Время в мин.:</label>\n                        </transition>\n                        <transition name=\"fade\">\n                        <input type=\"text\" name=\"time\" id=\"time\" value=\"60\" v-if=\"testOptions.timeLimit\" @change=\"validTimeLimit\">\n                        </transition>\n                        <img :src=\"anonymToggle\" alt=\"\">\n                        <label for=\"anonym\" :class=\"labelAnonym\">Анонимное прохождение</label>\n                        <input type=\"checkbox\" name=\"anonym\" id=\"anonym\" v-model=\"testOptions.anonym\">\n                    </div>\n\n                </div>\n\n                <new-question\n                    v-for=\"question in questions\"\n                    :key=\"question.id\"\n                    :questiontype=\"question.type\"\n                    :questiontext=\"question.text\"\n                    :questionid=\"question.id\"\n                    :questiondbid=\"question.db_id\"\n                    :questionvars=\"question.vars\"\n                    @delete-question=\"deleteQuestionHandler\"\n                    @udpate-question=\"updateQuestionInfo\"\n                ></new-question>\n\n                <button\n                    type=\"button\"\n                    name=\"button\"\n                    @click=\"addQuestion\"\n                    class=\"new-test__add-question\"\n                >\n                добавить вопрос</button>\n\n                <transition name=\"fade\">\n                   <flash-message\n                       v-if=\"flashMsg.text.length > 0\"\n                       :code=\"flashMsg.status\"\n                       :text=\"flashMsg.text\"\n                   >\n                   </flash-message>\n              </transition>\n\n            </form>\n\n        </section>\n\n    </div>\n\n</template>\n\n<script>\n\nimport sideMenu from './side-menu.vue';\nimport newQuestion from './new-question.vue';\nimport flashMessage from './interface/flashmessage.vue';\nimport testCheck from './../js/test.js';\nimport axios from './../../node_modules/axios/dist/axios.js';\n\n\nexport default {\n\n    components: {\n       'side-menu': sideMenu,\n       'new-question': newQuestion,\n       'flash-message': flashMessage\n   },\n\n   data() {\n       return {\n           testTitle: '',\n           testDescription: '',\n           testOptions: {\n               timeLimit: false,\n               time: 60,\n               anonym: false\n           },\n           questions: [\n               {\n                   type: 1,\n                   text: '',\n                   id: 1,\n                   vars: []\n               }\n           ],\n           nextQuestionId: 2,\n           flashMsg: {\n               text: '',\n               status: 1\n           },\n           testId: undefined\n       }\n   },\n\n   computed: {\n\n       // Объект класса переключателя ограничения по вреиени\n       timeToggle() {\n           return this.testOptions.timeLimit === false ? 'img/switch_left.svg' : 'img/switch_rigth.svg';\n       },\n\n       // Объект класса переключателя анонимного прохождения\n       anonymToggle() {\n           return this.testOptions.anonym === false ? 'img/switch_left.svg' : 'img/switch_rigth.svg';\n       },\n\n       labelTime() {\n           return {\n               'active': this.testOptions.timeLimit\n           }\n       },\n\n       labelAnonym() {\n           return {\n               'active' : this.testOptions.anonym\n           }\n       },\n\n       //Всплывающие сообщения\n       flashMsgClass() {\n           return {\n               'test-flasgMesg' : true,\n               'test-flasgMesg_error' : this.flashMsg.status == 1,\n               'test-flasgMesg_warn' : this.flashMsg.status == 2,\n               'test-flasgMesg_succes' : this.flashMsg.status == 3\n           }\n       }\n   },\n\n   methods: {\n\n       // Устанавливаем данные теста из ДБ\n       fetchTestDb(test) {\n           this.testTitle = test.test_name;\n           this.testDescription = test.test_description;\n           this.testId = +test.test_id;\n           this.testOptions.timeLimit = +test.test_time ? true : false;\n           this.testOptions.time = +test.test_time;\n           this.testOptions.anonym = +test.test_anonym;\n           this.questions = [];\n           this.nextQuestionId = +test.questions[test.questions.length-1].question_client_id + 1;\n           for(let i = 0; i < test.questions.length; i++) {\n               this.questions[i] = {\n                   type: +test.questions[i].question_type_id,\n                   text: test.questions[i].question_description,\n                   id: +test.questions[i].question_client_id,\n                   db_id: +test.questions[i].question_id,\n                   vars: []\n               };\n               let type = +test.questions[i].question_type_id;\n               if(type === 1 || type == 2) {\n                   for(let j = 0; j < test.questions[i].vars.length; j++) {\n                       let answer = test.questions[i].question_answer.length === 1 ? [test.questions[i].question_answer] : test.questions[i].question_answer.split(',');\n                       this.questions[i].vars.push({\n                           text: test.questions[i].vars[j].var_text,\n                           id: +test.questions[i].vars[j].question_client_id,\n                           db_id: +test.questions[i].vars[j].question_client_id,\n                           isRight: answer.indexOf(test.questions[i].vars[j].question_client_id) >= 0 ? true : false\n                       });\n                   }\n               }\n               else {\n                   this.questions[i].vars =  test.questions[i].question_answer;\n               }\n\n\n\n           }\n       },\n\n       //Вывод сообщения\n       showFlashMsg(status, text) {\n           this.flashMsg.status = status;\n           this.flashMsg.text = text;\n           setTimeout( () => this.flashMsg.text = '', 10000);\n       },\n\n       // Валидация лимита времени\n       validTimeLimit(e) {\n           let data = e.target.value;\n           if(!/\\d/i.test(data)) {\n               let msg = \"Лимит времени задается только в числовом эквиваленте и не должен превышать разумных пределов\";\n               this.showFlashMsg(1, msg);\n               e.target.value = this.testOptions.time;\n           }\n           else {\n               if(+e.target.value > 240) {\n                   let msg = \"Вы установили очень большой лимит времени, подумайте, может стоит отключить эту опцию.\";\n                   this.showFlashMsg(2, msg);\n                   this.testOptions.time = +e.target.value;\n                   e.target.value = 60;\n               }\n               else if(+e.target.value < 10) {\n                   e.target.value = 10;\n                   let msg = \"Вы установили очень низкий лимит времени!\";\n                   this.showFlashMsg(1, msg);\n               }\n               else {\n                   this.testOptions.time = +e.target.value;\n               }\n           }\n       },\n\n       // Добавление нового вопроса\n       addQuestion() {\n           this.questions.push( {\n                type: 1,\n                text: '',\n                id: this.nextQuestionId,\n                vars: [{\n                    text: '',\n                    isRight: false,\n                    id: 1\n                }]\n            });\n            this.nextQuestionId++;\n       },\n\n       // Удаляем вопрос\n       deleteQuestionHandler(id) {\n           let index = this.questions.map( (v,i) => {\n               if(v.id === id) return i;\n           });\n           index.length > 1 ? index = index.filter( (v) => {if(typeof v == 'number') return v})[0] : index = index[0];\n           this.questions.splice(index, 1);\n       },\n\n       // Обновляем информацию вопроса\n       updateQuestionInfo(id, type, description, vars) {\n           for(let i = 0; i < this.questions.length; i++) {\n               if(this.questions[i].id === id) {\n                   this.questions[i].type = type;\n                   this.questions[i].text = description;\n                   this.questions[i].vars = vars;\n               }\n           }\n       },\n\n       publishTest() {\n           this.saveTest(1);\n       },\n\n       // Сохраняем тест\n       saveTest(status) {\n           var status = status ? status : 0;\n           let test = {\n               title: this.testTitle,\n               description: this.testDescription,\n               options: this.testOptions,\n               questions: this.questions,\n               status: status,\n               testId: this.testId\n           };\n\n           let res = testCheck.check(test);\n\n\n           if(res.status) {\n               axios.post('php/savetest.php', test)\n               .then( (res) => {\n                   console.log(res);\n                   if(!res.data.success) {\n                       this.showFlashMsg(1, res.data.errorMsg);\n                   }\n                   else {\n                       let msg = status == 0 ? 'Тест успешно сохранен в базе данных' : 'Тест опубликован';\n                       this.showFlashMsg(3, msg);\n                       setTimeout( () => this.$router.push('/tester'), 2000);\n                   }\n               })\n               .catch( (err) => console.log(err));\n           }\n           else {\n               console.log('мы здесь');\n               this.showFlashMsg(res.code, res.msg);\n               document.querySelector('.new-test-form__title').scrollIntoView({ behavior: 'smooth' });\n               if(res.questionId) {\n                   for(let i = 0; i < this.$children.length; i++) {\n                       if(this.$children[i].id === res.questionId) {\n                           let elem = this.$children[i].$el;\n                           elem.scrollIntoView({ behavior: 'smooth' });\n                           elem.classList.add('question_error');\n                           setTimeout( () => {\n                               elem.classList.remove('question_error');\n                           }, 8000)\n                       }\n                   }\n               }\n           }\n\n       }\n\n   },\n\n   // При создании компонента, проверяем localStorage и если в нем есть объект тест выводим его данные\n   created() {\n       if(localStorage.getItem('test')) {\n           let test = JSON.parse(localStorage.getItem('test'));\n           this.fetchTestDb(test);\n       }\n   },\n\n   // Перед уходом очищаем localStorage;\n   beforeRouteLeave(to, from, next) {\n       localStorage.getItem('test') ? localStorage.removeItem('test') : false;\n       next();\n   }\n\n}\n</script>\n\n<style lang=\"css\">\n\n@import './../css/variables.css';\n\n    .newtest-page {\n        /* margin-left: calc(var(--column) * 6); */\n        background-color: var(--background);\n        display: flex;\n    }\n\n    .newtest-page .content {\n        margin-left: calc(var(--column) * 2);\n        margin-right: calc(var(--column) * 2);\n        width: calc(var(--column) * 16);\n    }\n\n\n\n    .new-test-form {\n        padding-top: calc(var(--column) * 2);\n        position: relative;\n    }\n\n    .new-test-form__title {\n        display: block;\n        width: 98%;\n        border: none;\n        border-bottom: 3px solid rgba(0,0,0,0.1);\n        margin-bottom: 40px;\n        font-family: 'marta';\n        font-size: 3rem;\n        color: var(--blue);\n    }\n\n    .new-test-form__options {\n        background-color: #fff;\n        -webkit-box-shadow: 1px 1px 4px rgba(0,0,0,0.1);\n        box-shadow: 1px 1px 4px rgba(0,0,0,0.1);\n        padding: 20px;\n    }\n\n    .new-test-form__options h3 {\n        padding: 0;\n        margin: 0;\n        margin-bottom: 20px;\n        color: #8496b1;\n    }\n\n    .new-test-form__description {\n        padding: 10px;\n        border: none;\n        margin-bottom: 20px;\n        width: 98%;\n        max-width: 98%;\n        min-width: 98%;\n        max-height: calc(var(--row) * 2);\n        min-height: calc(var(--row) * 2);\n        height: calc(var(--row) * 2);\n        border: 3px solid rgba(0,0,0,0.1);\n    }\n\n    .new-test-form__options label {\n        color: #8496b1;\n    }\n\n    .new-test-form__options label.active {\n        color: var(--purple);\n    }\n\n    .new-test-form__inputs > * {\n        display: inline-block;\n    }\n\n    .new-test-form__inputs img {\n        max-width: 30px;\n        margin-bottom: -10px;\n        margin-left: 20px;\n    }\n\n    .new-test-form__inputs img:first-child {\n        padding-left: 0px;\n    }\n\n    .new-test-form__inputs input[type=\"text\"] {\n        background-color: #dddde8;\n        border: none;\n        border-bottom: 1px solid var(--blue);\n        width: 50px;\n        text-align: center;\n    }\n\n    .new-test-form__inputs input[type=\"checkbox\"] {\n        display: none;\n    }\n\n    .new-test__add-question {\n        border: none;\n        margin: 40px 0px;\n        padding-left: 40px;\n        font-family: 'marta';\n        font-size: 1.2rem;\n        font-weight: bold;\n        cursor: pointer;\n        background-image: url('./../img/add.svg');\n        background-repeat: no-repeat;\n        background-position: left;\n        background-color: var(--background);\n        color: var(--purple);\n        opacity: 0.5;\n        -webkit-transition: opacity .2s ease-in-out;\n        -o-transition: opacity .2s ease-in-out;\n        transition: opacity .2s ease-in-out;\n    }\n\n    .new-test__add-question:hover {\n        opacity: 1;\n    }\n\n    .test-flasgMesg {\n        z-index: 201;\n        position: fixed;\n        max-width: 30%;\n        top: 40px;\n        right: 40px;\n        padding: 20px;\n        color: #fff;\n        font-size: 1.1rem;\n        text-align: center;\n        font-weight: bold;\n    }\n\n    .test-flasgMesg_error {\n        background-color: var(--red);\n    }\n\n    .test-flasgMesg_warn {\n        background-color: var(--yellow);\n    }\n\n    .test-flasgMesg_succes {\n        background-color: var(--green);\n    }\n\n    .fade-enter-active, .fade-leave-active {\n        transition: opacity .3s ease-in-out;\n    }\n\n    .fade-enter, .fade-leave-to {\n        opacity: 0;\n    }\n\n    @media screen and (max-width: 812px) {\n\n        .newtest-page .content{\n            width: 100%;\n            margin: 0;\n            justify-content: center;\n            align-items: center;\n        }\n\n        .new-test-nav {\n            padding: 10px;\n        }\n\n        .new-test-nav ul {\n            display: flex;\n            justify-content: flex-end;\n        }\n\n        .new-test-nav li {\n            min-width: calc(var(--column-mobile) * 3);\n            font-size: .8rem;\n        }\n\n        .new-test-nav li:last-child {\n            padding-left: 10px;\n        }\n\n        .new-test-form {\n            padding-top: calc(var(--row-mobile) * 4);\n        }\n\n        .new-test-form__options {\n            width: 90%;\n            margin: 0 auto;\n\n        }\n\n        .new-test-form__inputs img {\n            float: left;\n            clear: left;\n            margin-bottom: 1px;\n        }\n\n        .new-test-form__options label {\n            font-size: .8rem;\n            padding-left: 40px;\n            margin-bottom: 12px;\n        }\n\n        .new-test__add-question {\n            display: block;\n            margin: 40px auto;\n        }\n\n\n\n\n    }\n\n\n\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 62 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_question_vue__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_question_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_question_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_question_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_question_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1868d7e3_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_new_question_vue__ = __webpack_require__(77);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(63)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_question_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1868d7e3_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_new_question_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/vue-comp/new-question.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1868d7e3", Component.options)
  } else {
    hotAPI.reload("data-v-1868d7e3", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(64);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("ff66885c", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1868d7e3\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./new-question.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1868d7e3\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./new-question.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(5);
exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n:root{font-family:Marta;font-size:16px;line-height:1.4\n}\n.question{position:relative;margin-top:40px;padding:20px;background-color:#fff;box-shadow:1px 1px 4px rgba(0,0,0,.1);transition:all .3s ease-in-out\n}\n.question_error{border:1px solid #c74545;box-shadow:3px 3px 8px #c74545\n}\n.question h3{margin-bottom:20px;color:#8496b1\n}\n.question-type{position:absolute;right:-1px;top:-1px;border:none;background-color:#656695;color:#fff;font-family:marta;padding:10px\n}\n.question-type option{padding:10px\n}\n.question__description{width:calc(4.16667vw * 10);max-width:calc(4.16667vw * 10);min-width:calc(4.16667vw * 10);height:calc(8.33333vh * 1);min-height:calc(8.33333vh * 1);max-height:calc(8.33333vh * 1);margin-bottom:20px;border:none;border:3px solid rgba(0,0,0,.1)\n}\n.question-controls{position:absolute;bottom:20px;right:10px;width:calc(4.16667vw * 2)\n}\n.question-controls img{cursor:pointer;max-width:30px;display:inline-block;opacity:.5;transition:opacity .2s ease-in-out\n}\n.question-controls img:hover{opacity:1\n}\n.question-controls img:nth-child(2){margin:0 10px\n}\n.question__add-var-button{border:none;padding-left:30px;cursor:pointer;font-family:marta;font-weight:700;background-image:url(" + escape(__webpack_require__(17)) + ");background-repeat:no-repeat;background-position:0;background-color:#fff;color:#656695;opacity:.5;transition:opacity .2s ease-in-out\n}\n.question__add-var-button:hover{opacity:1\n}\n@media screen and (max-width:812px){\n.question{width:90%;margin:20px auto;padding-top:60px\n}\n.question__description{width:100%;max-width:none;min-width:none\n}\n.question-controls{bottom:none;right:none;width:50%;top:10px;left:10px;max-height:30px\n}\n.question-controls img{max-width:20px\n}\n}", "", {"version":3,"sources":["/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/css/variables.css","/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/vue-comp/src/vue-comp/new-question.vue"],"names":[],"mappings":";AAAA,MACI,kBAAqB,eACL,eACC;CAapB;AC+RD,UACA,kBAAA,gBACA,aACA,sBACA,sCAEA,8BAGA;CACA;AAEA,gBACA,yBAAA,8BAEA;CACA;AAEA,aACA,mBAAA,aACA;CACA;AAEA,eACA,kBAAA,WACA,SACA,YACA,yBACA,WACA,kBACA,YACA;CACA;AAEA,sBACA,YAAA;CACA;AAEA,uBACA,2BAAA,+BACA,+BACA,2BACA,+BACA,+BACA,mBACA,YACA,+BACA;CACA;AAEA,mBACA,kBAAA,YACA,WACA,yBACA;CACA;AACA,uBACA,eAAA,eACA,qBACA,WACA,kCAGA;CACA;AAEA,6BACA,SAAA;CACA;AAEA,oCACA,aAAA;CACA;AAEA,0BACA,YAAA,kBACA,eACA,kBACA,gBACA,+CACA,4BACA,sBACA,sBACA,cACA,WACA,kCAGA;CACA;AAEA,gCACA,SAAA;CACA;AAEA;AACA,UACA,UAAA,iBACA,gBACA;CACA;AAEA,uBACA,WAAA,eACA,cACA;CACA;AAEA,mBACA,YAAA,WACA,UACA,SACA,UACA,eACA;CACA;AAEA,uBACA,cAAA;CACA;CACA","file":"new-question.vue","sourcesContent":[":root {\n    font-family: 'Marta';\n    font-size: 16px;\n    line-height: 1.4;\n    --blue: #092E64;\n    --purple: #656695;\n    --darkpurple: #313149;\n    --marine: #3493A8;\n    --yellow: #EFDA7B;\n    --green: #9DBE87;\n    --red: #c74545;\n    --background: #e6e5e5;\n    --column: calc(100vw / 24);\n    --row: calc(100vh / 12);\n    --column-mobile: calc(100vw / 12);\n    --row-mobile: calc(100vh / 24);\n}\n","<template lang=\"html\">\n\n    <div class=\"question\">\n\n        <h3>Текст вопроса:</h3>\n        <textarea class=\"question__description\" v-model=\"description\" @input=\"updateDescription\"></textarea>\n\n        <select class=\"\" name=\"\" class=\"question-type\" @change=\"changeType\">\n            <option value=\"1\">Один из списка</option>\n            <option value=\"2\">Несколько из списка</option>\n            <option value=\"3\">Строка</option>\n        </select>\n\n        <div class=\"variants\">\n\n            <div v-if=\"questionType === 1\" key=\"single-question\">\n                <single\n                    v-for=\"(variant, index) in single.vars\"\n                    :text=\"variant.text\"\n                    :status=\"variant.isRight\"\n                    :id=\"variant.id\"\n                    :key=\"variant.id\"\n                    @removeVar=\"removeVarHandler\"\n                    @updateVar=\"singleUpdateVarHandler\"\n                    @updateRightVar=\"singleUpdateRightVarHandler\"\n                ></single>\n                <button key=\"add-single\"  class=\"question__add-var-button sngl\" type=\"button\" name=\"button\" @click=\"singleAddVar\">добавить вариант</button>\n            </div>\n\n            <div v-else-if=\"questionType === 2\" key=\"multiple-question\">\n                <multiple\n\n                    v-for=\"(variant, index) in multiple.vars\"\n                    :text=\"variant.text\"\n                    :status=\"variant.isRight\"\n                    :id=\"variant.id\"\n                    :key=\"variant.id\"\n                    @removeVar=\"multipleRemoveVarHandler\"\n                    @updateVar=\"multipleUpdateVarHandler\"\n                    @updateRightVar=\"multipleUpdateRightVarHandler\"\n                >\n                </multiple>\n                <button key=\"add-multiple\" class=\"question__add-var-button mlt\" type=\"button\" name=\"button\" @click=\"multipleAddVar\">добавить вариант</button>\n            </div>\n\n            <div v-else key=\"string-question\">\n                <string\n                    :text=\"string.answer\"\n                    @updateVar=\"stringUpdateVarHandler\"\n                ></string>\n            </div>\n\n        </div>\n\n\n\n        <div class=\"question-controls\">\n            <img src=\"img/success.svg\" alt=\"\">\n            <img src=\"img/edit.svg\" alt=\"\">\n            <img @click=\"deleteQuestion\" src=\"img/dustbin.svg\" alt=\"\">\n\n        </div>\n\n\n\n    </div>\n\n</template>\n\n<script>\n\nimport single from './questions/single.vue';\nimport multiple from './questions/multiple.vue';\nimport string from './questions/string.vue';\n\nexport default {\n\n    props: [\n        'questiontype',\n        'questiontext',\n        'questionid',\n        'questiondbid',\n        'questionvars'\n    ],\n\n    components: {\n       'single': single,\n       'multiple': multiple,\n       'string': string\n   },\n\n    data() {\n        return {\n            questionType: this.questiontype ? this.questiontype : 1,\n            id: this.questionid,\n            db_id: this.questiondbid,\n            description: this.questiontext ? this.questiontext : '',\n            // Вопросы с одним вариантом\n            single: {\n                vars: [\n                    {\n                        text: '',\n                        isRight: false,\n                        id: 1\n                    }\n                ],\n                nextVarId: 2\n            },\n            // Вопросы с несколькими вариантами ответа\n            multiple: {\n                vars: [\n                    {\n                        text: '',\n                        isRight: false,\n                        id: 1\n                    }\n                ],\n                nextVarId: 2\n            },\n            //Вопрос с вводом строки\n            string: {\n                answer: ''\n            }\n\n        }\n    },\n\n    methods: {\n\n        updateDescription() {\n            this.updateQuestionVars();\n        },\n\n\n        changeType(e) {\n\n            this.questionType = +e.target.value;\n\n            this.single = {\n                vars: [\n                    {\n                        text: '',\n                        isRight: false,\n                        id: 1\n                    }\n                ],\n                nextVarId: 2\n            };\n\n            this.multiple = {\n                vars: [\n                    {\n                        text: '',\n                        isRight: false,\n                        id: 1\n                    }\n                ],\n                nextVarId: 2\n            };\n        },\n\n        /*Вопросы с одним варианторм*/\n\n        //Добавляем вариант ответа\n        singleAddVar() {\n            this.single.nextVarId++;\n            this.single.vars.push({\n                text: '',\n                isRight: false,\n                id: this.single.nextVarId\n            });\n\n        },\n\n        // Удаление вариантами\n        removeVarHandler(id) {\n            let index;\n            for(let i = 0; i < this.single.vars.length; i++) {\n                if(this.single.vars[i].id === id) index = i;\n            }\n            this.single.vars.splice(index, 1);\n            this.updateQuestionVars();\n        },\n\n        //Обновляем текст варианта\n        singleUpdateVarHandler(id, text) {\n            let index;\n            for(let i = 0; i < this.single.vars.length; i++) {\n                if(this.single.vars[i].id === id) index = i;\n            }\n            this.single.vars[index].text = text;\n            this.updateQuestionVars();\n        },\n\n        //Выбираем правильный вариант вопроса\n        singleUpdateRightVarHandler(index) {\n            this.$children.forEach( (v,i) => {\n                if(i === index) {\n                    v.isRight ? v.isRight = false : v.isRight = true;\n                    this.single.vars[index].isRight ? this.single.vars[index].isRight = false : this.single.vars[index].isRight = true;\n                }\n                else {\n                    v.isRight = false;\n                    this.single.vars[i].isRight = false;\n                }\n            });\n            this.updateQuestionVars();\n        },\n\n        /*Вопросы с несолькими вариантами*/\n\n        //Добавляем вариант ответа\n        multipleAddVar() {\n            this.multiple.vars.push({\n                text: 'Вариант ответа',\n                isRight: false,\n                id: this.multiple.nextVarId\n            });\n            this.multiple.nextVarId++;\n        },\n\n        // Удаляем вариант ответа\n        multipleRemoveVarHandler(id) {\n            let index;\n            for(let i = 0; i < this.multiple.vars.length; i++) {\n                if(this.multiple.vars[i].id === id) index = i;\n            }\n            this.multiple.vars.splice(index, 1);\n            this.updateQuestionVars();\n        },\n\n        multipleUpdateVarHandler(id, text) {\n            let index;\n            for(let i = 0; i < this.multiple.vars.length; i++) {\n                if(this.multiple.vars[i].id === id) index = i;\n            }\n            this.multiple.vars[index].text = text;\n            this.updateQuestionVars();\n        },\n\n        //Выбираем правильный вариант вопроса\n        multipleUpdateRightVarHandler(index) {\n            this.$children.forEach( (v,i) => {\n                if(i === index) {\n                    v.isRight ? v.isRight = false : v.isRight = true;\n                    this.multiple.vars[index].isRight ? this.multiple.vars[index].isRight = false : this.multiple.vars[index].isRight = true;\n                }\n            });\n            this.updateQuestionVars();\n        },\n\n        /*Вопрос - строка*/\n\n        stringUpdateVarHandler(text) {\n            this.string.answer = text;\n            this.updateQuestionVars();\n        },\n\n        //Обновляем варианты в объекте вопроса в тесте\n        updateQuestionVars() {\n            switch (this.questionType) {\n                case 1:\n                    this.$emit('udpate-question', this.id, this.questionType, this.description, this.single.vars);\n                    break;\n                case 2:\n                    this.$emit('udpate-question', this.id, this.questionType, this.description, this.multiple.vars);\n                    break;\n                case 3:\n                    this.$emit('udpate-question', this.id, this.questionType, this.description, this.string.answer);\n                    break;\n                default:\n\n            }\n        },\n\n        //Событие удаления вопроса\n        deleteQuestion() {\n            this.$emit('delete-question', this.id);\n        }\n    },\n\n    created() {\n        switch(this.questiontype) {\n            case 1:\n                this.single.vars = this.questionvars;\n                this.single.nextVarId = this.questionvars[this.questionvars.length-1] ? this.questionvars[this.questionvars.length-1].id : 1;\n                break;\n            case 2:\n                this.multiple.vars = this.questionvars;\n                this.multiple.nextVarId = this.questionvars[this.questionvars.length-1] ? this.questionvars[this.questionvars.length-1].id : 1;\n                break;\n            case 3:\n                this.string.answer = this.questionvars;\n                break;\n        }\n    }\n\n}\n</script>\n\n<style lang=\"css\">\n\n    @import './../css/variables.css';\n\n    .question {\n        position: relative;\n        margin-top: 40px;\n        padding: 20px;\n        background-color: #fff;\n        -webkit-box-shadow: 1px 1px 4px rgba(0,0,0,0.1);\n        box-shadow: 1px 1px 4px rgba(0,0,0,0.1);\n        -webkit-transition: all .3s ease-in-out;\n        -o-transition: all .3s ease-in-out;\n        transition: all .3s ease-in-out;\n    }\n\n    .question_error {\n        border: 1px solid var(--red);\n        -webkit-box-shadow: 3px 3px 8px var(--red);\n        box-shadow: 3px 3px 8px var(--red);\n    }\n\n    .question h3 {\n        margin-bottom: 20px;\n        color: #8496b1;\n    }\n\n    .question-type {\n        position: absolute;\n        right: -1px;\n        top: -1px;\n        border: none;\n        background-color: var(--purple);\n        color: #fff;\n        font-family: 'marta';\n        padding: 10px;\n    }\n\n    .question-type option{\n        padding: 10px;\n    }\n\n    .question__description {\n        width: calc(var(--column) * 10);\n        max-width: calc(var(--column) * 10);\n        min-width: calc(var(--column) * 10);\n        height: calc(var(--row) * 1);\n        min-height: calc(var(--row) * 1);\n        max-height: calc(var(--row) * 1);\n        margin-bottom: 20px;\n        border: none;\n        border: 3px solid rgba(0,0,0,.1);\n    }\n\n    .question-controls {\n        position: absolute;\n        bottom: 20px;\n        right: 10px;\n        width: calc(var(--column) * 2);\n    }\n    .question-controls img {\n        cursor: pointer;\n        max-width: 30px;\n        display: inline-block;\n        opacity: 0.5;\n        -webkit-transition: opacity 0.2s ease-in-out;\n        -o-transition: opacity 0.2s ease-in-out;\n        transition: opacity 0.2s ease-in-out;\n    }\n\n    .question-controls img:hover {\n        opacity: 1;\n    }\n\n    .question-controls img:nth-child(2) {\n        margin: 0 10px;\n    }\n\n    .question__add-var-button {\n        border: none;\n        padding-left: 30px;\n        cursor: pointer;\n        font-family: 'marta';\n        font-weight: bold;\n        background-image: url('./../img/add.svg');\n        background-repeat: no-repeat;\n        background-position: left;\n        background-color: #fff;\n        color: var(--purple);\n        opacity: 0.5;\n        -webkit-transition: opacity .2s ease-in-out;\n        -o-transition: opacity .2s ease-in-out;\n        transition: opacity .2s ease-in-out;\n    }\n\n    .question__add-var-button:hover {\n        opacity: 1;\n    }\n\n    @media screen and (max-width: 812px) {\n        .question {\n            width: 90%;\n            margin: 20px auto;\n            padding-top: 60px;\n        }\n\n        .question__description {\n            width: 100%;\n            max-width: none;\n            min-width: none;\n        }\n\n        .question-controls {\n            bottom: none;\n            right: none;\n            width: 50%;\n            top: 10px;\n            left: 10px;\n            max-height: 30px;\n        }\n\n        .question-controls img {\n            max-width: 20px;\n        }\n    }\n\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 65 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_single_vue__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_single_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_single_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_single_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_single_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_36837b8c_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_single_vue__ = __webpack_require__(68);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(66)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_single_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_36837b8c_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_single_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/vue-comp/questions/single.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-36837b8c", Component.options)
  } else {
    hotAPI.reload("data-v-36837b8c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(67);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("03a485cc", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-36837b8c\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./single.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-36837b8c\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./single.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n:root{font-family:Marta;font-size:16px;line-height:1.4\n}\n.question-var{display:flex;width:calc(4.16667vw * 10);max-height:40px;margin-bottom:20px;justify-content:space-between\n}\n.question-var>*{display:block;max-width:calc(4.16667vw * 10);align-self:center\n}\n.question-var input[type=text]{max-width:calc(4.16667vw * 6);border:none;border-bottom:1px solid #092e64\n}\n.question-var img{max-width:20px;cursor:pointer;opacity:.5;transition:opacity .2s ease-in-out\n}\n.question-var img:hover{opacity:1\n}\n.question-var input[type=checkbox]{display:none\n}\nlabel[for=right_var]{cursor:pointer;color:#092e64;opacity:.5;transition:opacity .2s ease-in-out\n}\n.question-var label.active,label[for=right_var]:hover{opacity:1\n}\n@media screen and (max-width:812px){\n.question-var{width:100%\n}\n}", "", {"version":3,"sources":["/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/css/variables.css","/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/vue-comp/questions/src/vue-comp/questions/single.vue"],"names":[],"mappings":";AAAA,MACI,kBAAqB,eACL,eACC;CAapB;AC+BD,cACA,aAAA,2BACA,gBACA,mBACA,6BACA;CACA;AAEA,gBACA,cAAA,+BACA,iBACA;CACA;AAEA,+BACA,8BAAA,YACA,+BACA;CACA;AAEA,kBACA,eAAA,eACA,WACA,kCAGA;CACA;AAEA,wBACA,SAAA;CACA;AAEA,mCACA,YAAA;CACA;AAEA,qBACA,eAAA,cACA,WACA,kCAGA;CACA;AAMA,sDACA,SAAA;CACA;AAEA;AAEA,cACA,UAAA;CACA;CACA","file":"single.vue","sourcesContent":[":root {\n    font-family: 'Marta';\n    font-size: 16px;\n    line-height: 1.4;\n    --blue: #092E64;\n    --purple: #656695;\n    --darkpurple: #313149;\n    --marine: #3493A8;\n    --yellow: #EFDA7B;\n    --green: #9DBE87;\n    --red: #c74545;\n    --background: #e6e5e5;\n    --column: calc(100vw / 24);\n    --row: calc(100vh / 12);\n    --column-mobile: calc(100vw / 12);\n    --row-mobile: calc(100vh / 24);\n}\n","<template lang=\"html\">\n\n    <div class=\"question-var\">\n        <input type=\"text\" name=\"\" value=\"\" placeholder=\"Вариант ответа\" v-model=\"varText\" @input=\"updateInfo\">\n        <img @click=\"deleteVar\" src=\"img/cross.svg\" alt=\"\">\n        <label @click=\"rightVar\" for=\"right_var\" :class=\"{active: isRight}\">правильный</label>\n        <input type=\"checkbox\" name=\"\" value=\"\" id=\"right_var\">\n    </div>\n\n</template>\n\n<script>\nexport default {\n\n    props: ['text', 'status', 'id'],\n\n    data() {\n        return {\n            varText: this.text,\n            isRight: this.status,\n            questionId: this.id\n        }\n    },\n\n    methods: {\n        //Удаление варианта\n        deleteVar(e) {\n            this.$emit('removeVar', this.id);\n        },\n\n        // Обнавляем текст варианта\n        updateInfo() {\n            this.$emit('updateVar', this.id, this.varText);\n        },\n\n        // Обнавляем статус правильного ответа варианта\n        rightVar() {\n            let index = Array.prototype.indexOf.call(this.$el.parentNode.childNodes, this.$el);\n            this.$emit('updateRightVar', index);\n        }\n    }\n}\n</script>\n\n<style lang=\"css\">\n\n@import './../../css/variables.css';\n\n    .question-var {\n        display: flex;\n        width: calc(var(--column) * 10);\n        max-height: 40px;\n        margin-bottom: 20px;\n        justify-content: space-between;\n    }\n\n    .question-var > * {\n        display: block;\n        max-width: calc(var(--column) * 10);\n        align-self: center;\n    }\n\n    .question-var input[type=\"text\"] {\n        max-width: calc(var(--column) * 6);\n        border: none;\n        border-bottom: 1px solid var(--blue);\n    }\n\n    .question-var img{\n        max-width: 20px;\n        cursor: pointer;\n        opacity: 0.5;\n        -webkit-transition: opacity .2s ease-in-out;\n        -o-transition: opacity .2s ease-in-out;\n        transition: opacity .2s ease-in-out;\n    }\n\n    .question-var img:hover {\n        opacity: 1;\n    }\n\n    .question-var input[type=\"checkbox\"] {\n        display: none;\n    }\n\n    label[for=\"right_var\"] {\n        cursor: pointer;\n        color: var(--blue);\n        opacity: .5;\n        -webkit-transition: opacity .2s ease-in-out;\n        -o-transition: opacity .2s ease-in-out;\n        transition: opacity .2s ease-in-out;\n    }\n\n    label[for=\"right_var\"]:hover {\n        opacity: 1;\n    }\n\n    .question-var label.active {\n        opacity: 1;\n    }\n\n    @media screen and (max-width: 812px) {\n\n        .question-var {\n            width: 100%;\n        }\n    }\n\n\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 68 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "question-var" }, [
    _c("input", {
      directives: [
        {
          name: "model",
          rawName: "v-model",
          value: _vm.varText,
          expression: "varText"
        }
      ],
      attrs: {
        type: "text",
        name: "",
        value: "",
        placeholder: "Вариант ответа"
      },
      domProps: { value: _vm.varText },
      on: {
        input: [
          function($event) {
            if ($event.target.composing) {
              return
            }
            _vm.varText = $event.target.value
          },
          _vm.updateInfo
        ]
      }
    }),
    _vm._v(" "),
    _c("img", {
      attrs: { src: "img/cross.svg", alt: "" },
      on: { click: _vm.deleteVar }
    }),
    _vm._v(" "),
    _c(
      "label",
      {
        class: { active: _vm.isRight },
        attrs: { for: "right_var" },
        on: { click: _vm.rightVar }
      },
      [_vm._v("правильный")]
    ),
    _vm._v(" "),
    _c("input", {
      attrs: { type: "checkbox", name: "", value: "", id: "right_var" }
    })
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-36837b8c", esExports)
  }
}

/***/ }),
/* 69 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_multiple_vue__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_multiple_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_multiple_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_multiple_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_multiple_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_deac5cfc_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_multiple_vue__ = __webpack_require__(72);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(70)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_multiple_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_deac5cfc_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_multiple_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/vue-comp/questions/multiple.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-deac5cfc", Component.options)
  } else {
    hotAPI.reload("data-v-deac5cfc", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(71);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("4f89ae6a", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-deac5cfc\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./multiple.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-deac5cfc\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./multiple.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n:root{font-family:Marta;font-size:16px;line-height:1.4\n}\n.question-var{display:flex;width:calc(4.16667vw * 10);max-height:40px;margin-bottom:20px;justify-content:space-between\n}\n.question-var>*{display:block;max-width:calc(4.16667vw * 10);align-self:center\n}\n.question-var input[type=text]{max-width:calc(4.16667vw * 6);border:none;border-bottom:1px solid #092e64\n}\n.question-var img{max-width:20px;cursor:pointer;opacity:.5;transition:opacity .2s ease-in-out\n}\n.question-var img:hover{opacity:1\n}\n.question-var input[type=checkbox]{display:none\n}\nlabel[for=right_var]{cursor:pointer;color:#092e64;opacity:.5;transition:opacity .2s ease-in-out\n}\n.question-var label.active,label[for=right_var]:hover{opacity:1\n}\n@media screen and (max-width:812px){\n.question-var{width:100%\n}\n}", "", {"version":3,"sources":["/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/css/variables.css","/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/vue-comp/questions/src/vue-comp/questions/multiple.vue"],"names":[],"mappings":";AAAA,MACI,kBAAqB,eACL,eACC;CAapB;ACgCD,cACA,aAAA,2BACA,gBACA,mBACA,6BACA;CACA;AAEA,gBACA,cAAA,+BACA,iBACA;CACA;AAEA,+BACA,8BAAA,YACA,+BACA;CACA;AAEA,kBACA,eAAA,eACA,WACA,kCAGA;CACA;AAEA,wBACA,SAAA;CACA;AAEA,mCACA,YAAA;CACA;AAEA,qBACA,eAAA,cACA,WACA,kCAGA;CACA;AAMA,sDACA,SAAA;CACA;AAEA;AAEA,cACA,UAAA;CACA;CACA","file":"multiple.vue","sourcesContent":[":root {\n    font-family: 'Marta';\n    font-size: 16px;\n    line-height: 1.4;\n    --blue: #092E64;\n    --purple: #656695;\n    --darkpurple: #313149;\n    --marine: #3493A8;\n    --yellow: #EFDA7B;\n    --green: #9DBE87;\n    --red: #c74545;\n    --background: #e6e5e5;\n    --column: calc(100vw / 24);\n    --row: calc(100vh / 12);\n    --column-mobile: calc(100vw / 12);\n    --row-mobile: calc(100vh / 24);\n}\n","<template lang=\"html\">\n\n    <div class=\"question-var\">\n        <input type=\"text\" name=\"\" value=\"\" placeholder=\"Вариант ответа\" v-model=\"varText\" @input=\"updateInfo\">\n        <img @click=\"deleteVar\" src=\"img/cross.svg\" alt=\"\">\n        <label @click=\"rightVar\" for=\"right_var\" :class=\"{active: isRight}\">правильный</label>\n        <input type=\"checkbox\" name=\"\" value=\"\" id=\"right_var\">\n    </div>\n\n</template>\n\n<script>\nexport default {\n\n    props: ['text', 'status', 'id'],\n\n    data() {\n        return {\n            varText: this.text ? this.text : '',\n            placeholderText: this.text,\n            isRight: this.status,\n            questionId: this.id\n        }\n    },\n\n    methods: {\n        //Удаление варианта\n        deleteVar(e) {\n            this.$emit('removeVar', this.id);\n        },\n\n        // Обнавляем текст варианта\n        updateInfo() {\n            this.$emit('updateVar', this.id, this.varText);\n        },\n\n        // Обнавляем статус правильного ответа варианта\n        rightVar() {\n            let index = Array.prototype.indexOf.call(this.$el.parentNode.childNodes, this.$el);\n            this.$emit('updateRightVar', index);\n        }\n    }\n}\n</script>\n\n<style lang=\"css\">\n\n@import './../../css/variables.css';\n\n    .question-var {\n        display: flex;\n        width: calc(var(--column) * 10);\n        max-height: 40px;\n        margin-bottom: 20px;\n        justify-content: space-between;\n    }\n\n    .question-var > * {\n        display: block;\n        max-width: calc(var(--column) * 10);\n        align-self: center;\n    }\n\n    .question-var input[type=\"text\"] {\n        max-width: calc(var(--column) * 6);\n        border: none;\n        border-bottom: 1px solid var(--blue);\n    }\n\n    .question-var img{\n        max-width: 20px;\n        cursor: pointer;\n        opacity: 0.5;\n        -webkit-transition: opacity .2s ease-in-out;\n        -o-transition: opacity .2s ease-in-out;\n        transition: opacity .2s ease-in-out;\n    }\n\n    .question-var img:hover {\n        opacity: 1;\n    }\n\n    .question-var input[type=\"checkbox\"] {\n        display: none;\n    }\n\n    label[for=\"right_var\"] {\n        cursor: pointer;\n        color: var(--blue);\n        opacity: .5;\n        -webkit-transition: opacity .2s ease-in-out;\n        -o-transition: opacity .2s ease-in-out;\n        transition: opacity .2s ease-in-out;\n    }\n\n    label[for=\"right_var\"]:hover {\n        opacity: 1;\n    }\n\n    .question-var label.active {\n        opacity: 1;\n    }\n\n    @media screen and (max-width: 812px) {\n\n        .question-var {\n            width: 100%;\n        }\n    }\n\n\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 72 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "question-var" }, [
    _c("input", {
      directives: [
        {
          name: "model",
          rawName: "v-model",
          value: _vm.varText,
          expression: "varText"
        }
      ],
      attrs: {
        type: "text",
        name: "",
        value: "",
        placeholder: "Вариант ответа"
      },
      domProps: { value: _vm.varText },
      on: {
        input: [
          function($event) {
            if ($event.target.composing) {
              return
            }
            _vm.varText = $event.target.value
          },
          _vm.updateInfo
        ]
      }
    }),
    _vm._v(" "),
    _c("img", {
      attrs: { src: "img/cross.svg", alt: "" },
      on: { click: _vm.deleteVar }
    }),
    _vm._v(" "),
    _c(
      "label",
      {
        class: { active: _vm.isRight },
        attrs: { for: "right_var" },
        on: { click: _vm.rightVar }
      },
      [_vm._v("правильный")]
    ),
    _vm._v(" "),
    _c("input", {
      attrs: { type: "checkbox", name: "", value: "", id: "right_var" }
    })
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-deac5cfc", esExports)
  }
}

/***/ }),
/* 73 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_string_vue__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_string_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_string_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_string_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_string_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_50861183_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_string_vue__ = __webpack_require__(76);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(74)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_string_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_50861183_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_string_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/vue-comp/questions/string.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-50861183", Component.options)
  } else {
    hotAPI.reload("data-v-50861183", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(75);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("0d122143", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-50861183\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./string.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-50861183\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./string.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n:root{font-family:Marta;font-size:16px;line-height:1.4\n}\n.question-var-str{display:flex;flex-wrap:wrap\n}\n.var-string{width:calc(4.16667vw * 10);border:none;border-bottom:1px solid #092e64\n}\n@media screen and (max-width:812px){\n.var-string{width:100%;text-align:center\n}\n}", "", {"version":3,"sources":["/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/css/variables.css","/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/vue-comp/questions/src/vue-comp/questions/string.vue"],"names":[],"mappings":";AAAA,MACI,kBAAqB,eACL,eACC;CAapB;ACeD,kBACA,aAAA,cACA;CACA;AAEA,YACA,2BAAA,YACA,+BACA;CACA;AAEA;AACA,YACA,WAAA,iBACA;CACA;CACA","file":"string.vue","sourcesContent":[":root {\n    font-family: 'Marta';\n    font-size: 16px;\n    line-height: 1.4;\n    --blue: #092E64;\n    --purple: #656695;\n    --darkpurple: #313149;\n    --marine: #3493A8;\n    --yellow: #EFDA7B;\n    --green: #9DBE87;\n    --red: #c74545;\n    --background: #e6e5e5;\n    --column: calc(100vw / 24);\n    --row: calc(100vh / 12);\n    --column-mobile: calc(100vw / 12);\n    --row-mobile: calc(100vh / 24);\n}\n","<template lang=\"html\">\n\n    <div class=\"question-var-str\">\n        <p>Если вариант ответа предполагает несколько вариантов написания, просто перечислите их через строчку</p>\n        <input class=\"var-string\" type=\"text\" name=\"\" value=\"\" placeholder=\"Введите свое описание\" v-model=\"varText\" @input=\"updateInfo\">\n    </div>\n\n</template>\n\n<script>\nexport default {\n\n    props: ['text'],\n\n    data() {\n        return {\n            varText: this.text ? this.text : ''\n        }\n    },\n\n    methods: {\n        updateInfo() {\n            this.$emit('updateVar', this.varText);\n        }\n    }\n}\n</script>\n\n<style lang=\"css\">\n\n@import './../../css/variables.css';\n\n.question-var-str {\n    display: flex;\n    flex-wrap: wrap;\n}\n\n.var-string {\n    width: calc(var(--column) * 10);\n    border: none;\n    border-bottom: 1px solid var(--blue);\n}\n\n@media screen and (max-width: 812px) {\n    .var-string {\n        width: 100%;\n        text-align: center;\n    }\n}\n\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 76 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "question-var-str" }, [
    _c("p", [
      _vm._v(
        "Если вариант ответа предполагает несколько вариантов написания, просто перечислите их через строчку"
      )
    ]),
    _vm._v(" "),
    _c("input", {
      directives: [
        {
          name: "model",
          rawName: "v-model",
          value: _vm.varText,
          expression: "varText"
        }
      ],
      staticClass: "var-string",
      attrs: {
        type: "text",
        name: "",
        value: "",
        placeholder: "Введите свое описание"
      },
      domProps: { value: _vm.varText },
      on: {
        input: [
          function($event) {
            if ($event.target.composing) {
              return
            }
            _vm.varText = $event.target.value
          },
          _vm.updateInfo
        ]
      }
    })
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-50861183", esExports)
  }
}

/***/ }),
/* 77 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "question" }, [
    _c("h3", [_vm._v("Текст вопроса:")]),
    _vm._v(" "),
    _c("textarea", {
      directives: [
        {
          name: "model",
          rawName: "v-model",
          value: _vm.description,
          expression: "description"
        }
      ],
      staticClass: "question__description",
      domProps: { value: _vm.description },
      on: {
        input: [
          function($event) {
            if ($event.target.composing) {
              return
            }
            _vm.description = $event.target.value
          },
          _vm.updateDescription
        ]
      }
    }),
    _vm._v(" "),
    _c(
      "select",
      {
        staticClass: "question-type",
        attrs: { name: "", class: "question-type" },
        on: { change: _vm.changeType }
      },
      [
        _c("option", { attrs: { value: "1" } }, [_vm._v("Один из списка")]),
        _vm._v(" "),
        _c("option", { attrs: { value: "2" } }, [
          _vm._v("Несколько из списка")
        ]),
        _vm._v(" "),
        _c("option", { attrs: { value: "3" } }, [_vm._v("Строка")])
      ]
    ),
    _vm._v(" "),
    _c("div", { staticClass: "variants" }, [
      _vm.questionType === 1
        ? _c(
            "div",
            { key: "single-question" },
            [
              _vm._l(_vm.single.vars, function(variant, index) {
                return _c("single", {
                  key: variant.id,
                  attrs: {
                    text: variant.text,
                    status: variant.isRight,
                    id: variant.id
                  },
                  on: {
                    removeVar: _vm.removeVarHandler,
                    updateVar: _vm.singleUpdateVarHandler,
                    updateRightVar: _vm.singleUpdateRightVarHandler
                  }
                })
              }),
              _vm._v(" "),
              _c(
                "button",
                {
                  key: "add-single",
                  staticClass: "question__add-var-button sngl",
                  attrs: { type: "button", name: "button" },
                  on: { click: _vm.singleAddVar }
                },
                [_vm._v("добавить вариант")]
              )
            ],
            2
          )
        : _vm.questionType === 2
          ? _c(
              "div",
              { key: "multiple-question" },
              [
                _vm._l(_vm.multiple.vars, function(variant, index) {
                  return _c("multiple", {
                    key: variant.id,
                    attrs: {
                      text: variant.text,
                      status: variant.isRight,
                      id: variant.id
                    },
                    on: {
                      removeVar: _vm.multipleRemoveVarHandler,
                      updateVar: _vm.multipleUpdateVarHandler,
                      updateRightVar: _vm.multipleUpdateRightVarHandler
                    }
                  })
                }),
                _vm._v(" "),
                _c(
                  "button",
                  {
                    key: "add-multiple",
                    staticClass: "question__add-var-button mlt",
                    attrs: { type: "button", name: "button" },
                    on: { click: _vm.multipleAddVar }
                  },
                  [_vm._v("добавить вариант")]
                )
              ],
              2
            )
          : _c(
              "div",
              { key: "string-question" },
              [
                _c("string", {
                  attrs: { text: _vm.string.answer },
                  on: { updateVar: _vm.stringUpdateVarHandler }
                })
              ],
              1
            )
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "question-controls" }, [
      _c("img", { attrs: { src: "img/success.svg", alt: "" } }),
      _vm._v(" "),
      _c("img", { attrs: { src: "img/edit.svg", alt: "" } }),
      _vm._v(" "),
      _c("img", {
        attrs: { src: "img/dustbin.svg", alt: "" },
        on: { click: _vm.deleteQuestion }
      })
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-1868d7e3", esExports)
  }
}

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(79);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("55ee3c26", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7367be9d\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./flashmessage.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7367be9d\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./flashmessage.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n:root{font-family:Marta;font-size:16px;line-height:1.4\n}\n.test-flasgMesg{position:fixed;max-width:30%;top:40px;right:40px;padding:10px;border:3px solid #656695;color:#fff;font-size:1.1rem;text-align:center;font-weight:700;box-shadow:3px 3px 8px #656695\n}\n.test-flasgMesg_error{background-color:#c74545\n}\n.test-flasgMesg_warn{background-color:#efda7b\n}\n.test-flasgMesg_succes{background-color:#9dbe87\n}\n.fade-enter-active,.fade-leave-active{transition:opacity .3s ease-in-out\n}\n.fade-enter,.fade-leave-to{opacity:0\n}", "", {"version":3,"sources":["/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/css/variables.css","/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/vue-comp/interface/src/vue-comp/interface/flashmessage.vue"],"names":[],"mappings":";AAAA,MACI,kBAAqB,eACL,eACC;CAapB;ACuBD,gBACA,eAAA,cACA,SACA,WACA,aACA,yBACA,WACA,iBACA,kBACA,gBACA,8BAEA;CACA;AAEA,sBACA,wBAAA;CACA;AAEA,qBACA,wBAAA;CACA;AAEA,uBACA,wBAAA;CACA;AAEA,sCACA,kCAAA;CACA;AAEA,2BACA,SAAA;CACA","file":"flashmessage.vue","sourcesContent":[":root {\n    font-family: 'Marta';\n    font-size: 16px;\n    line-height: 1.4;\n    --blue: #092E64;\n    --purple: #656695;\n    --darkpurple: #313149;\n    --marine: #3493A8;\n    --yellow: #EFDA7B;\n    --green: #9DBE87;\n    --red: #c74545;\n    --background: #e6e5e5;\n    --column: calc(100vw / 24);\n    --row: calc(100vh / 12);\n    --column-mobile: calc(100vw / 12);\n    --row-mobile: calc(100vh / 24);\n}\n","<template lang=\"html\">\n\n       <p\n           :class=\"flashMsgClass\"\n       >{{this.message}}</p>\n\n\n</template>\n\n<script>\nexport default {\n\n    props: ['code', 'text'],\n\n    data() {\n        return {\n            message: this.text,\n            status: this.code\n        }\n    },\n\n    computed: {\n        //Всплывающие сообщения\n        flashMsgClass() {\n            return {\n                'test-flasgMesg' : true,\n                'test-flasgMesg_error' : this.status == 1,\n                'test-flasgMesg_warn' : this.status == 2,\n                'test-flasgMesg_succes' : this.status == 3\n            }\n        }\n    }\n\n}\n</script>\n\n<style lang=\"css\">\n\n    @import './../../css/variables.css';\n\n    .test-flasgMesg {\n        position: fixed;\n        max-width: 30%;\n        top: 40px;\n        right: 40px;\n        padding: 10px;\n        border: 3px solid var(--purple);\n        color: #fff;\n        font-size: 1.1rem;\n        text-align: center;\n        font-weight: bold;\n        -webkit-box-shadow: 3px 3px 8px var(--purple);\n        box-shadow: 3px 3px 8px var(--purple);\n    }\n\n    .test-flasgMesg_error {\n        background-color: var(--red);\n    }\n\n    .test-flasgMesg_warn {\n        background-color: var(--yellow);\n    }\n\n    .test-flasgMesg_succes {\n        background-color: var(--green);\n    }\n\n    .fade-enter-active, .fade-leave-active {\n        transition: opacity .3s ease-in-out;\n    }\n\n    .fade-enter, .fade-leave-to {\n        opacity: 0;\n    }\n\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 80 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("p", { class: _vm.flashMsgClass }, [_vm._v(_vm._s(this.message))])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-7367be9d", esExports)
  }
}

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var QUESTIONS_MIN_NUM = 3;
var VARS_MIN_NUM = 2;
var VARS_MAX_NUM = 10;
var _default = {
  check: function check(testObj) {
    // console.log(testObj);
    var res = {
      status: true,
      msg: '',
      code: 3,
      questionId: undefined
    }; //Обходим объект теста и выполняем проверки

    for (var prop in testObj) {
      switch (prop) {
        case 'title':
          res.status = checkTitle(testObj.title);

          if (!res.status) {
            res.msg = 'Поле названия теста должно быть заполнено и должно содержать строку длинной от 3 до 200 символов! Допкскаются буквы кириллического и латинского алфавита, а так же числа и знак нижнего подчеркивния';
            res.code = 1;
            return res;
          }

          break;

        case 'description':
          res.status = checkDesc(testObj.description);

          if (!res.status) {
            res.msg = 'Поле описание должно быть не длиннее 1200 символов.';
            res.code = 1;
            return res;
          }

          break;

        case 'questions':
          var check = checkQuestions(testObj.questions);
          res.status = check.status;

          if (!res.status) {
            res.msg = check.msg;
            res.questionId = check.questionId;
            res.code = check.code;
            return res;
          }

          break;

        default:
      }
    }

    return res;
  }
}; // Helpers

exports.default = _default;

function checkTitle(title) {
  var pattern = /[а-яa-z0-9_"]{3,200}/i;
  return pattern.test(title);
}

function checkDesc(desc) {
  var pattern = /.{0,1200}/i;
  return pattern.test(desc);
}

function checkQuestions(questions) {
  var res = {
    status: true,
    msg: '',
    code: 3,
    questionId: undefined
  }; // Если в тесте меньше константного значения вопросов

  if (questions.length <= QUESTIONS_MIN_NUM) {
    res.status = false;
    res.code = 1;
    res.msg = 'В тесте должно быть, как минимум 4 вопроса';
    return res;
  }

  for (var i = 0; i < questions.length; i++) {
    var check = checkQuestion(questions[i]);

    if (!check.status) {
      res.status = check.status;
      res.code = 1;
      res.msg = check.msg;
      res.questionId = check.questionId;
      return res;
    }
  }

  return res;
}

function checkQuestion(question) {
  var res = {
    status: true,
    questionId: question.id,
    msg: '' // Проверяем поле описание вопроса

  };

  if (question.text.length < 10 || question.text.length > 800) {
    res.status = false;
    res.questionId = question.id;
    res.msg = 'Поле текста вопроса должно быть заполнено. Количество символов должно быть больше 10 и меньше 800';
    return res;
  } else {
    // Проверка вариантов вопросов с одинм или несколькими вариантами ответа
    if (question.type === 1 || question.type === 2) {
      // Минимальное число вариантов
      if (question.vars.length < VARS_MIN_NUM) {
        res.status = false;
        res.questionId = question.id;
        res.msg = 'Вы должны предоставить пользователю как минимум ' + VARS_MIN_NUM + ' варианта на выбор';
        return res;
      } // Максимальное число вариантов
      else if (question.vars.length > VARS_MAX_NUM) {
          res.status = false;
          res.questionId = question.id;
          res.msg = 'Количество вариантов не должно превышать ' + VARS_MAN_NUM;
          return res;
        } else if (!checkMultiVarsText(question.vars)) {
          res.status = false;
          res.questionId = question.id;
          res.msg = 'Текст варианта ответа должен быть заполнен и не должен превышать длинной 200 символов';
          return res;
        } else if (!checkMultiVarsRights(question.vars)) {
          res.status = false;
          res.questionId = question.id;
          res.msg = 'Вы должны указать, как минимум 1 правильный вариант ответа';
          return res;
        }
    } //Проверка вопроса свариантом ответа - строка
    else if (question.type === 3) {
        if (question.vars.length === 0) {
          res.status = false;
          res.questionId = question.id;
          res.msg = 'Вы должны указать, как минимум 1 правильный вариант ответа';
          return res;
        }
      }

    return res;
  }
}

function checkMultiVarsRights(vars) {
  for (var i = 0; i < vars.length; i++) {
    if (vars[i].isRight) return true;
  }

  return false;
}

function checkMultiVarsText(vars) {
  for (var i = 0; i < vars.length; i++) {
    vars[i].text.length;

    if (vars[i].text.length === 0 || vars[i].text.length > 500) {
      return false;
    }
  }

  return true;
}

/***/ }),
/* 82 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "newtest-page" },
    [
      _c("side-menu"),
      _vm._v(" "),
      _c("section", { staticClass: "content" }, [
        _c("nav", { staticClass: "new-test-nav" }, [
          _c("ul", [
            _c("li", [
              _c(
                "a",
                {
                  attrs: { href: "save" },
                  on: {
                    click: function($event) {
                      $event.preventDefault()
                      _vm.saveTest(0)
                    }
                  }
                },
                [_vm._v("Сохранить")]
              )
            ]),
            _vm._v(" "),
            _c("li", [
              _c(
                "a",
                {
                  attrs: { href: "publish" },
                  on: {
                    click: function($event) {
                      $event.preventDefault()
                      _vm.saveTest(1)
                    }
                  }
                },
                [_vm._v("Опубликовать")]
              )
            ])
          ])
        ]),
        _vm._v(" "),
        _c(
          "form",
          { staticClass: "new-test-form" },
          [
            _c("div", { staticClass: "new-test-form__options" }, [
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.testTitle,
                    expression: "testTitle"
                  }
                ],
                staticClass: "new-test-form__title",
                attrs: { type: "text", placeholder: "Название теста" },
                domProps: { value: _vm.testTitle },
                on: {
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.testTitle = $event.target.value
                  }
                }
              }),
              _vm._v(" "),
              _c("h3", [_vm._v("Описание:")]),
              _vm._v(" "),
              _c("textarea", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.testDescription,
                    expression: "testDescription"
                  }
                ],
                staticClass: "new-test-form__description",
                attrs: { name: "test_description" },
                domProps: { value: _vm.testDescription },
                on: {
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.testDescription = $event.target.value
                  }
                }
              }),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "new-test-form__inputs" },
                [
                  _c("img", { attrs: { src: _vm.timeToggle, alt: "" } }),
                  _vm._v(" "),
                  _c(
                    "label",
                    { class: _vm.labelTime, attrs: { for: "time_limit" } },
                    [_vm._v("Лимит по времени")]
                  ),
                  _vm._v(" "),
                  _c("input", {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.testOptions.timeLimit,
                        expression: "testOptions.timeLimit"
                      }
                    ],
                    attrs: {
                      type: "checkbox",
                      name: "time_limit",
                      id: "time_limit"
                    },
                    domProps: {
                      checked: Array.isArray(_vm.testOptions.timeLimit)
                        ? _vm._i(_vm.testOptions.timeLimit, null) > -1
                        : _vm.testOptions.timeLimit
                    },
                    on: {
                      change: function($event) {
                        var $$a = _vm.testOptions.timeLimit,
                          $$el = $event.target,
                          $$c = $$el.checked ? true : false
                        if (Array.isArray($$a)) {
                          var $$v = null,
                            $$i = _vm._i($$a, $$v)
                          if ($$el.checked) {
                            $$i < 0 &&
                              (_vm.testOptions.timeLimit = $$a.concat([$$v]))
                          } else {
                            $$i > -1 &&
                              (_vm.testOptions.timeLimit = $$a
                                .slice(0, $$i)
                                .concat($$a.slice($$i + 1)))
                          }
                        } else {
                          _vm.$set(_vm.testOptions, "timeLimit", $$c)
                        }
                      }
                    }
                  }),
                  _vm._v(" "),
                  _c("transition", { attrs: { name: "fade" } }, [
                    _vm.testOptions.timeLimit
                      ? _c("img", {
                          attrs: { src: "img/stopwatch.svg", alt: "" }
                        })
                      : _vm._e()
                  ]),
                  _vm._v(" "),
                  _c("transition", { attrs: { name: "fade" } }, [
                    _vm.testOptions.timeLimit
                      ? _c(
                          "label",
                          { staticClass: "active", attrs: { for: "time" } },
                          [_vm._v("Время в мин.:")]
                        )
                      : _vm._e()
                  ]),
                  _vm._v(" "),
                  _c("transition", { attrs: { name: "fade" } }, [
                    _vm.testOptions.timeLimit
                      ? _c("input", {
                          attrs: {
                            type: "text",
                            name: "time",
                            id: "time",
                            value: "60"
                          },
                          on: { change: _vm.validTimeLimit }
                        })
                      : _vm._e()
                  ]),
                  _vm._v(" "),
                  _c("img", { attrs: { src: _vm.anonymToggle, alt: "" } }),
                  _vm._v(" "),
                  _c(
                    "label",
                    { class: _vm.labelAnonym, attrs: { for: "anonym" } },
                    [_vm._v("Анонимное прохождение")]
                  ),
                  _vm._v(" "),
                  _c("input", {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.testOptions.anonym,
                        expression: "testOptions.anonym"
                      }
                    ],
                    attrs: { type: "checkbox", name: "anonym", id: "anonym" },
                    domProps: {
                      checked: Array.isArray(_vm.testOptions.anonym)
                        ? _vm._i(_vm.testOptions.anonym, null) > -1
                        : _vm.testOptions.anonym
                    },
                    on: {
                      change: function($event) {
                        var $$a = _vm.testOptions.anonym,
                          $$el = $event.target,
                          $$c = $$el.checked ? true : false
                        if (Array.isArray($$a)) {
                          var $$v = null,
                            $$i = _vm._i($$a, $$v)
                          if ($$el.checked) {
                            $$i < 0 &&
                              (_vm.testOptions.anonym = $$a.concat([$$v]))
                          } else {
                            $$i > -1 &&
                              (_vm.testOptions.anonym = $$a
                                .slice(0, $$i)
                                .concat($$a.slice($$i + 1)))
                          }
                        } else {
                          _vm.$set(_vm.testOptions, "anonym", $$c)
                        }
                      }
                    }
                  })
                ],
                1
              )
            ]),
            _vm._v(" "),
            _vm._l(_vm.questions, function(question) {
              return _c("new-question", {
                key: question.id,
                attrs: {
                  questiontype: question.type,
                  questiontext: question.text,
                  questionid: question.id,
                  questiondbid: question.db_id,
                  questionvars: question.vars
                },
                on: {
                  "delete-question": _vm.deleteQuestionHandler,
                  "udpate-question": _vm.updateQuestionInfo
                }
              })
            }),
            _vm._v(" "),
            _c(
              "button",
              {
                staticClass: "new-test__add-question",
                attrs: { type: "button", name: "button" },
                on: { click: _vm.addQuestion }
              },
              [_vm._v("\n            добавить вопрос")]
            ),
            _vm._v(" "),
            _c(
              "transition",
              { attrs: { name: "fade" } },
              [
                _vm.flashMsg.text.length > 0
                  ? _c("flash-message", {
                      attrs: {
                        code: _vm.flashMsg.status,
                        text: _vm.flashMsg.text
                      }
                    })
                  : _vm._e()
              ],
              1
            )
          ],
          2
        )
      ])
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-1d6eb5e2", esExports)
  }
}

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(84);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("3cead1cc", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-9bbc88b4\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./loading.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-9bbc88b4\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./loading.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n:root{font-family:Marta;font-size:16px;line-height:1.4\n}\n.loading-indicator{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;width:100px;height:100px;height:auto;opacity:1\n}\nspan[class^=loading-indicator]{width:45px;height:45px;transform:scale(1);background-color:#656695\n}\n.loading-indicator__1{animation:a 1.5s ease-in-out infinite\n}\n.loading-indicator__1,.loading-indicator__2{-webkit-animation:a 1.5s ease-in-out infinite\n}\n.loading-indicator__2{animation:a 2s ease-in-out infinite;animation-delay:.1s\n}\n.loading-indicator__3{-webkit-animation:a 1.5s ease-in-out infinite;animation:a 1.5s ease-in-out infinite;animation-delay:.2s\n}\n.loading-indicator__4{-webkit-animation:a 1.5s ease-in-out infinite;animation:a 1.5s ease-in-out infinite;animation-delay:.3s\n}\n@-webkit-keyframes a{\n0%{transform:scale(1);opacity:1\n}\n50%{transform:scale(.1);opacity:.2\n}\nto{transform:scale(1);opacity:1\n}\n}\n@keyframes a{\n0%{transform:scale(1);opacity:1\n}\n50%{transform:scale(.1);opacity:.2\n}\nto{transform:scale(1);opacity:1\n}\n}", "", {"version":3,"sources":["/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/css/variables.css","/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/vue-comp/interface/src/vue-comp/interface/loading.vue"],"names":[],"mappings":";AAAA,MACI,kBAAqB,eACL,eACC;CAapB;ACGD,mBACA,aAAA,eACA,uBACA,mBACA,YACA,aACA,YACA,SACA;CACA;AAEA,+BACA,WAAA,YACA,mBACA,wBACA;CAEA;AAEA,sBAEA,qCAAA;CAEA;AAEA,4CALA,6CAAA;CASA;AAJA,sBAEA,oCAAA,mBACA;CACA;AAEA,sBACA,8CAAA,sCACA,mBACA;CACA;AAEA,sBACA,8CAAA,sCACA,mBACA;CACA;AAEA;AACA,GAAA,mBAAA,SAAA;CAAA;AACA,IAAA,oBAAA,UAAA;CAAA;AACA,GAAA,mBAAA,SAAA;CAAA;CACA;AAWA;AACA,GAAA,mBAAA,SAAA;CAAA;AACA,IAAA,oBAAA,UAAA;CAAA;AACA,GAAA,mBAAA,SAAA;CAAA;CACA","file":"loading.vue","sourcesContent":[":root {\n    font-family: 'Marta';\n    font-size: 16px;\n    line-height: 1.4;\n    --blue: #092E64;\n    --purple: #656695;\n    --darkpurple: #313149;\n    --marine: #3493A8;\n    --yellow: #EFDA7B;\n    --green: #9DBE87;\n    --red: #c74545;\n    --background: #e6e5e5;\n    --column: calc(100vw / 24);\n    --row: calc(100vh / 12);\n    --column-mobile: calc(100vw / 12);\n    --row-mobile: calc(100vh / 24);\n}\n","<template lang=\"html\">\n\n    <div class=\"loading-indicator\">\n        <span class=\"loading-indicator__1\"></span>\n        <span class=\"loading-indicator__2\"></span>\n        <span class=\"loading-indicator__3\"></span>\n        <span class=\"loading-indicator__4\"></span>\n    </div>\n\n</template>\n\n<script>\nexport default {\n}\n</script>\n\n<style lang=\"css\">\n\n    @import './../../css/variables.css';\n\n    .loading-indicator {\n        display: flex;\n        flex-wrap: wrap;\n        justify-content: center;\n        align-items: center;\n        width: 100px;\n        height: 100px;\n        height: auto;\n        opacity: 1;\n    }\n\n    span[class^=\"loading-indicator\"] {\n        width: 45px;\n        height: 45px;\n        transform: scale(1);\n        background-color: var(--purple);\n\n    }\n\n    .loading-indicator__1 {\n        -webkit-animation: load 1.5s ease-in-out infinite;\n        animation: load 1.5s ease-in-out infinite;\n        /* animation-delay: .5s; */\n    }\n\n    .loading-indicator__2 {\n        -webkit-animation: load 1.5s ease-in-out infinite;\n        animation: load 2s ease-in-out infinite;\n        animation-delay: .1s;\n    }\n\n    .loading-indicator__3 {\n        -webkit-animation: load 1.5s ease-in-out infinite;\n        animation: load 1.5s ease-in-out infinite;\n        animation-delay: .2s;\n    }\n\n    .loading-indicator__4 {\n        -webkit-animation: load 1.5s ease-in-out infinite;\n        animation: load 1.5s ease-in-out infinite;\n        animation-delay: .3s;\n    }\n\n    @-webkit-keyframes load {\n        0% { transform: scale(1); opacity: 1;}\n        50% { transform: scale(.1); opacity: .2;}\n        100% { transform: scale(1); opacity: 1;}\n    }\n    @-o-keyframes load {\n        0% { transform: scale(1); opacity: 1;}\n        50% { transform: scale(.1); opacity: .2;}\n        100% { transform: scale(1); opacity: 1;}\n    }\n    @-moz-keyframes load {\n        0% { transform: scale(1); opacity: 1;}\n        50% { transform: scale(.1); opacity: .2;}\n        100% { transform: scale(1); opacity: 1;}\n    }\n    @keyframes load {\n        0% { transform: scale(1); opacity: 1;}\n        50% { transform: scale(.1); opacity: .2;}\n        100% { transform: scale(1); opacity: 1;}\n    }\n\n\n\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 85 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm._m(0)
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "loading-indicator" }, [
      _c("span", { staticClass: "loading-indicator__1" }),
      _vm._v(" "),
      _c("span", { staticClass: "loading-indicator__2" }),
      _vm._v(" "),
      _c("span", { staticClass: "loading-indicator__3" }),
      _vm._v(" "),
      _c("span", { staticClass: "loading-indicator__4" })
    ])
  }
]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-9bbc88b4", esExports)
  }
}

/***/ }),
/* 86 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_test_item_vue__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_test_item_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_test_item_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_test_item_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_test_item_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4c1caf50_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_test_item_vue__ = __webpack_require__(89);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(87)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_test_item_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4c1caf50_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_test_item_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/vue-comp/interface/test-item.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4c1caf50", Component.options)
  } else {
    hotAPI.reload("data-v-4c1caf50", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(88);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("35137bbf", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4c1caf50\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./test-item.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4c1caf50\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./test-item.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n:root{font-family:Marta;font-size:16px;line-height:1.4\n}\n.tests-list-item{position:relative;width:calc(4.16667vw * 4);min-height:calc(8.33333vh * 4);margin-bottom:calc(8.33333vh * 1);box-shadow:1px 1px 4px rgba(0,0,0,.1);cursor:pointer;background-color:#fff;transition:all .3s ease-in-out\n}\n.tests-list-item:hover{background-color:#656695;box-shadow:2px 2px 6px rgba(0,0,0,.3)\n}\n.tests-list-item:hover .tests-list-item__img{opacity:0\n}\n.tests-list-item:hover .tests-list-item__desc{top:20px;opacity:1\n}\n.tests-list-item:hover .tests-list-item-info h3{color:#fff\n}\n.tests-list-item:hover .tests-list-item-info h3:before{background-color:#fff\n}\n.tests-list-item:hover .tests-list-item-info__link,.tests-list-item:hover .tests-list-item-info__resp{color:#fff\n}\n.tests-list-item:hover .tests-list-item-info__link svg,.tests-list-item:hover .tests-list-item-info__resp svg{fill:#fff\n}\n.tests-list-item-descr{position:relative;overflow:hidden\n}\n.tests-list-item__img{display:block;width:100%;max-height:200px;transition:opacity .1s ease-in-out\n}\n.tests-list-item__desc{position:absolute;top:-100%;padding:0 20px;opacity:0;color:#fff;font-size:.9rem;transition:all .3s ease-in-out\n}\n.tests-list-item-info{padding:20px;margin-bottom:30px\n}\n.tests-list-item-info h3{position:relative;color:#092e64;min-height:4rem;max-height:4.5rem;overflow:hidden;text-overflow:ellipsis;transition:all .3s ease-in-out\n}\n.tests-list-item-info h3:before{display:block;position:absolute;content:\"\";top:-5px;left:0;width:50px;height:5px;background-color:#656695;transition:all .3s ease-in-out\n}\n.tests-list-item-info__link{position:absolute;bottom:20px;padding-left:30px;display:block;color:#092e64;font-size:.8rem;transition:all .3s ease-in\n}\n.tests-list-item-info__resp{position:absolute;bottom:20px;padding-left:30px;display:block;color:#092e64;font-size:.8rem;transition:all .3s ease-in\n}\n.tests-list-item-info__link{left:20px\n}\n.tests-list-item-info__resp{right:20px\n}\n.tests-list-item-info__link svg{width:20px;position:absolute;top:0;left:0;fill:#656695;padding-right:5px;transition:all .3s ease-in-out\n}\n.tests-list-item-info__resp svg{width:20px;position:absolute;top:0;left:0;fill:#656695;padding-right:5px;transition:all .3s ease-in-out\n}\ninput[class^=testLink]{position:fixed;right:-200%\n}\n@media screen and (max-width:812px){\n.tests-list-item{margin:0;margin-bottom:40px;width:90%\n}\n}", "", {"version":3,"sources":["/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/css/variables.css","/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/vue-comp/interface/src/vue-comp/interface/test-item.vue"],"names":[],"mappings":";AAAA,MACI,kBAAqB,eACL,eACC;CAapB;AC0JD,iBACA,kBAAA,0BACA,+BACA,kCACA,sCAEA,eACA,sBACA,8BAGA;CACA;AAEA,uBACA,yBAAA,qCAEA;CACA;AAEA,6CACA,SAAA;CACA;AAEA,8CACA,SAAA,SACA;CACA;AAEA,gDACA,UAAA;CACA;AAEA,uDACA,qBAAA;CACA;AAEA,sGAEA,UAAA;CACA;AAEA,8GAEA,SAAA;CACA;AAEA,uBACA,kBAAA,eACA;CACA;AAEA,sBACA,cAAA,WACA,iBACA,kCAGA;CACA;AAEA,uBACA,kBAAA,UACA,eACA,UACA,WACA,gBACA,8BAGA;CACA;AAEA,sBACA,aAAA,kBACA;CACA;AAEA,yBACA,kBAAA,cACA,gBACA,kBACA,gBACA,uBACA,8BAGA;CACA;AAEA,gCACA,cAAA,kBACA,WACA,SACA,OACA,WACA,WACA,yBACA,8BAGA;CACA;AAEA,4BAGA,kBAAA,YACA,kBACA,cACA,cACA,gBACA,0BAGA;CACA;AAZA,4BAGA,kBAAA,YACA,kBACA,cACA,cACA,gBACA,0BAGA;CACA;AAEA,4BACA,SAAA;CACA;AAEA,4BACA,UAAA;CACA;AAEA,gCAEA,WAAA,kBACA,MACA,OACA,aACA,kBACA,8BAGA;CACA;AAXA,gCAEA,WAAA,kBACA,MACA,OACA,aACA,kBACA,8BAGA;CACA;AAEA,uBACA,eAAA,WACA;CACA;AAEA;AAEA,iBACA,SAAA,mBACA,SACA;CACA;CAEA","file":"test-item.vue","sourcesContent":[":root {\n    font-family: 'Marta';\n    font-size: 16px;\n    line-height: 1.4;\n    --blue: #092E64;\n    --purple: #656695;\n    --darkpurple: #313149;\n    --marine: #3493A8;\n    --yellow: #EFDA7B;\n    --green: #9DBE87;\n    --red: #c74545;\n    --background: #e6e5e5;\n    --column: calc(100vw / 24);\n    --row: calc(100vh / 12);\n    --column-mobile: calc(100vw / 12);\n    --row-mobile: calc(100vh / 24);\n}\n","<template lang=\"html\">\n\n    <div class=\"tests-list-item\" :id=\"testId + '_tst'\" @click=\"showTest\">\n\n        <div class=\"tests-list-item-descr\">\n            <img class=\"tests-list-item__img\" :src=\"testImage\" alt=\"\">\n            <p class=\"tests-list-item__desc\">{{testDescription}}</p>\n        </div>\n\n        <div class=\"tests-list-item-info\">\n            <h3>{{testTitle}}</h3>\n            <a v-if=\"testStatus == 1\" @click.stop.prevent=\"showLink\" class=\"tests-list-item-info__link\" href=\"link\"><svg version=\"1.1\" id=\"link\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\t viewBox=\"0 0 20 20\" style=\"enable-background:new 0 0 20 20;\" xml:space=\"preserve\">\n<g>\n\t<path class=\"st0\" d=\"M17.3,2.4c-1.6-1.6-4.3-1.6-5.9,0l-3,3C8.2,5.6,8.2,6,8.4,6.2c0.3,0.3,0.7,0.3,0.9,0l3-3\n\t\tc0.5-0.5,1.3-0.8,2.1-0.8c0.8,0,1.5,0.3,2.1,0.8s0.8,1.3,0.8,2.1c0,0.8-0.3,1.5-0.8,2.1l-3.9,3.9c-1.1,1.1-3,1.1-4.1,0\n\t\tc-0.3-0.3-0.7-0.3-0.9,0s-0.3,0.7,0,0.9c0.8,0.8,1.9,1.2,3,1.2s2.1-0.4,3-1.2l3.9-3.9c0.8-0.8,1.2-1.8,1.2-3\n\t\tC18.6,4.2,18.1,3.1,17.3,2.4z\"/>\n\t<path class=\"st0\" d=\"M9.6,14.2l-2.5,2.5c-0.5,0.5-1.3,0.8-2.1,0.8c-0.8,0-1.5-0.3-2.1-0.8c-1.1-1.1-1.1-3,0-4.1L6.6,9\n\t\tc0.5-0.5,1.3-0.8,2.1-0.8c0.8,0,1.5,0.3,2.1,0.8c0.3,0.3,0.7,0.3,0.9,0c0.3-0.3,0.3-0.7,0-0.9c-1.6-1.6-4.3-1.6-5.9,0L2,11.7\n\t\tc-0.8,0.8-1.2,1.8-1.2,3c0,1.1,0.4,2.2,1.2,3c0.8,0.8,1.8,1.2,3,1.2c1.1,0,2.2-0.4,3-1.2l2.5-2.5c0.3-0.3,0.3-0.7,0-0.9\n\t\tC10.2,14,9.8,14,9.6,14.2z\"/>\n</g>\n</svg>Ссылка</a>\n            <a v-if=\"testStatus == 1\" @ckick.stop.prevent=\"showResp\" class=\"tests-list-item-info__resp\" href=\"\"><svg version=\"1.1\" id=\"respondent\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\t viewBox=\"0 0 20 20\" style=\"enable-background:new 0 0 20 20;\" xml:space=\"preserve\">\n<g>\n\t<g>\n\t\t<path class=\"st0\" d=\"M7.9,11.9H4.9c-2.1,0-3.7,1.6-3.8,3.7c-0.1,0.6-0.3,1.7,0.1,2.1c1,1,3.4,1.4,5.2,1.4c1.8,0,4.1-0.4,5.2-1.4\n\t\t\tc0.4-0.4,0.2-1.5,0.1-2.1C11.6,13.5,10,11.9,7.9,11.9z M11.1,17.1c-0.7,0.7-2.5,1.2-4.6,1.2c-2.1,0-3.9-0.5-4.6-1.2\n\t\t\tc-0.1-0.2-0.4-4.3,3.1-4.5c0.8,0,3.1,0,3.1,0C11.4,12.6,11.1,16.9,11.1,17.1L11.1,17.1z\"/>\n\t\t<path class=\"st0\" d=\"M6.4,11.2c1.7,0,3.1-1.4,3-3c0-1.7-1.3-3-3-3c-1.6,0-3,1.4-3,3C3.3,9.8,4.7,11.2,6.4,11.2z M6.4,5.9\n\t\t\tc1.3,0,2.3,1,2.3,2.3s-1,2.3-2.3,2.3s-2.3-1-2.3-2.3S5.1,5.9,6.4,5.9z\"/>\n\t\t<path class=\"st0\" d=\"M9.9,1v5.6h1.2v2.7l2.7-2.7H19V1H9.9z M18.3,5.8h-4.8l-1.7,1.7V5.8h-1.2V1.8h7.6V5.8z\"/>\n\t\t<path class=\"st0\" d=\"M14.4,2.8c0-0.1,0.1-0.1,0.2-0.1c0.1,0,0.2,0,0.2,0c0,0.1,0.1,0.2,0.1,0.2c0,0.1,0,0.2-0.1,0.2l-0.3,0.3\n\t\t\tc-0.1,0.1-0.2,0.2-0.2,0.3c0,0.1,0,0.2,0,0.3v0.3h0.7V4.2c0-0.1,0-0.2,0-0.2c0,0,0.1-0.1,0.2-0.2c0.1-0.1,0.2-0.2,0.2-0.2\n\t\t\tc0,0,0-0.1,0.1-0.1c0,0,0.1-0.1,0.1-0.1c0,0,0,0,0.1-0.1c0,0,0-0.2,0-0.3c0-0.3-0.1-0.5-0.3-0.7c-0.2-0.2-0.4-0.2-0.7-0.2\n\t\t\tc-0.3,0-0.5,0.1-0.7,0.3c-0.2,0.2-0.3,0.4-0.3,0.7h0.8C14.3,3,14.3,2.9,14.4,2.8L14.4,2.8z\"/>\n\t\t<path class=\"st0\" d=\"M14.6,4.6c-0.1,0-0.2,0-0.3,0.1c-0.1,0.1-0.1,0.2-0.1,0.3c0,0.1,0,0.2,0.1,0.3c0.1,0.1,0.2,0.1,0.3,0.1\n\t\t\tc0.1,0,0.2,0,0.3-0.1C14.9,5.3,15,5.2,15,5.1c0-0.1,0-0.2-0.1-0.3S14.7,4.6,14.6,4.6z\"/>\n\t</g>\n</g>\n</svg>{{testRespondents}}</a>\n\n        <a @click.stop.prevent=\"editHandler\" href=\"\" class=\"tests-list-item-info__link\" v-if=\"testStatus == 0\"><svg version=\"1.1\" id=\"Layer_2\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\t viewBox=\"0 0 20 20\" style=\"enable-background:new 0 0 20 20;\" xml:space=\"preserve\">\n<path class=\"st0\" d=\"M18.6,1.4c-1.2-1.2-3.2-1.2-4.4,0L1.8,13.8c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0.1,0,0.1s0,0,0,0l0,0l-1.2,5.1\n\tc0,0,0,0,0,0.1l0,0c0,0,0,0.1,0,0.1c0,0,0,0,0,0s0,0.1,0.1,0.1c0,0,0.1,0.1,0.1,0.1c0,0,0.1,0,0.1,0c0,0,0.1,0,0.1,0L6,18.3h0h0\n\tc0,0,0,0,0.1,0c0,0,0,0,0,0l0,0L18.6,5.8C19.8,4.6,19.8,2.6,18.6,1.4z M18.1,1.9C19,2.7,19,4.1,18.4,5L15,1.6\n\tC15.9,1,17.3,1.1,18.1,1.9z M16.4,7L13,3.6l0.5-0.5l3.4,3.4L16.4,7z M2.2,17.8c-0.1-0.1-0.3-0.1-0.5,0l-0.3,0.2l0.9-3.7l1.5-0.2\n\tL3.7,16v0v0v0c0,0,0,0,0,0.1c0,0,0,0,0,0.1l0,0c0,0,0,0,0.1,0l0,0c0,0,0,0,0.1,0h0h0l0,0l0,0l0,0l0,0h0l1.8-0.2l-0.2,1.5l-3.7,0.9\n\tl0.3-0.3C2.4,18.2,2.4,18,2.2,17.8z M6.5,15.9l7.7-7.7c0.1-0.1,0.1-0.3,0-0.5c-0.1-0.1-0.3-0.1-0.5,0L6,15.4l-1.7,0.2L4.6,14\n\tl7.7-7.7c0.1-0.1,0.1-0.3,0-0.5c-0.1-0.1-0.3-0.1-0.5,0l-7.7,7.7L3,13.6l9.5-9.5l3.4,3.4L6.4,17L6.5,15.9z M17.4,6L14,2.6l0.5-0.5\n\tl3.4,3.4L17.4,6z\"/>\n</svg>редактировать</a>\n        <a v-if=\"testStatus == 0\" @click.stop.prevent=\"deleteHandler\" class=\"tests-list-item-info__resp\" href=\"\"><svg version=\"1.1\" id=\"delete\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\t viewBox=\"0 0 20 20\" style=\"enable-background:new 0 0 20 20;\" xml:space=\"preserve\">\n<g>\n\t<g>\n\t\t<g>\n\t\t\t<path class=\"st0\" d=\"M15.5,6.4c0-0.2,0.1-0.3,0.3-0.3c0.2,0,0.3,0.1,0.3,0.3v10.8c0,0.5-0.2,0.9-0.5,1.2\n\t\t\t\tc-0.3,0.3-0.8,0.5-1.2,0.5H5.5c-0.5,0-0.9-0.2-1.2-0.5c-0.3-0.3-0.5-0.8-0.5-1.2V6.4c0-0.2,0.1-0.3,0.3-0.3s0.3,0.1,0.3,0.3v10.8\n\t\t\t\tc0,0.3,0.1,0.6,0.3,0.8c0.2,0.2,0.5,0.3,0.8,0.3h8.8c0.3,0,0.6-0.1,0.8-0.3s0.3-0.5,0.3-0.8L15.5,6.4L15.5,6.4z\"/>\n\t\t\t<path class=\"st0\" d=\"M7.8,16.5c0,0.2-0.1,0.3-0.3,0.3c-0.2,0-0.3-0.1-0.3-0.3v-10c0-0.2,0.1-0.3,0.3-0.3c0.2,0,0.3,0.1,0.3,0.3\n\t\t\t\tV16.5z\"/>\n\t\t\t<path class=\"st0\" d=\"M10.2,16.5c0,0.2-0.1,0.3-0.3,0.3c-0.2,0-0.3-0.1-0.3-0.3v-10c0-0.2,0.1-0.3,0.3-0.3c0.2,0,0.3,0.1,0.3,0.3\n\t\t\t\tV16.5z\"/>\n\t\t\t<path class=\"st0\" d=\"M12.6,16.5c0,0.2-0.1,0.3-0.3,0.3S12,16.7,12,16.5v-10c0-0.2,0.1-0.3,0.3-0.3s0.3,0.1,0.3,0.3V16.5\n\t\t\t\tL12.6,16.5z\"/>\n\t\t\t<path class=\"st0\" d=\"M7.6,2.6c0,0.2-0.1,0.3-0.3,0.3c-0.2,0-0.3-0.1-0.3-0.3c0-0.5,0.2-0.9,0.5-1.2c0.3-0.3,0.8-0.5,1.2-0.5H11\n\t\t\t\tc0.5,0,0.9,0.2,1.2,0.5c0.3,0.3,0.5,0.8,0.5,1.2c0,0.2-0.1,0.3-0.3,0.3s-0.3-0.1-0.3-0.3c0-0.3-0.1-0.6-0.3-0.8\n\t\t\t\tc-0.2-0.2-0.5-0.3-0.8-0.3H8.8C8.5,1.5,8.2,1.6,8,1.8C7.8,2,7.6,2.3,7.6,2.6z\"/>\n\t\t\t<path class=\"st0\" d=\"M3.3,3.5h13.2c0.3,0,0.5,0.1,0.7,0.3l0,0c0.2,0.2,0.3,0.4,0.3,0.7v0.7c0,0.2-0.1,0.3-0.3,0.3h0H2.6\n\t\t\t\tc-0.2,0-0.3-0.1-0.3-0.3v0V4.5c0-0.3,0.1-0.5,0.3-0.7l0,0C2.8,3.6,3,3.5,3.3,3.5L3.3,3.5z M16.5,4H3.3C3.2,4,3.1,4.1,3,4.2l0,0\n\t\t\t\tC2.9,4.2,2.9,4.3,2.9,4.5v0.4h14V4.5c0-0.1,0-0.2-0.1-0.3l0,0C16.7,4.1,16.6,4,16.5,4z\"/>\n\t\t</g>\n\t</g>\n</g>\n</svg>удалить</a>\n\n\n        </div>\n\n        <input :class=\"[testLink]\"></input>\n\n    </div>\n\n</template>\n\n<script>\n\nimport axios from './../../../node_modules/axios/dist/axios.js';\n\nexport default {\n\n    props: ['description', 'testtitle', 'status', 'imglink', 'testid', 'respondents'],\n\n    data() {\n        return {\n            testTitle: this.testtitle,\n            testDescription: this.description,\n            testStatus: this.status,\n            testId: this.testid,\n            testImage: this.imglink ? this.imglink : 'img/default_test.svg',\n            testRespondents: this.respondents,\n            testLink: 'testLink-' + this.testid\n        }\n    },\n\n    computed: {\n        testLinkText() {\n            return (window.location.origin + '/exec?' + encodeURIComponent(btoa('test_id=' + (+this.testid))));\n        }\n    },\n\n    methods: {\n        // Событие - показать ссылку на тест\n        showLink() {\n            var elem = document.querySelector('.testLink-' + this.testId);\n            elem.value = window.location.origin + '/exec?' + encodeURIComponent(btoa('test_id=' + (+this.testid)));\n            elem.select();\n            document.execCommand('copy');\n            let msg = 'Ссылка скопирована в буфер обмена';\n            this.$emit('copy-link',msg);\n        },\n\n        // Событие - показать респондентов, которые прошли данный тест\n        showResp() {\n            console.log(this.testRespondents)\n        },\n\n        // Событие - редактирование теста\n        editHandler() {\n            this.$emit('edit-test-new', this.testId);\n        },\n\n        // Событие - удаление теста\n        deleteHandler() {\n            if(window.confirm('Вы точто хотите удалить тест?')) {\n                let query = this.testId;\n                axios.get(`php/deletetest.php?test_id=${query}`)\n                .then( (res) => {\n                    console.log('Server response after test deletion');\n                    console.log(res.data);\n                    if(res.data.status) {\n                        let msg = 'Тест успешно удален из базы данных';\n                        this.$emit('delete-info', 3, msg);\n                    }\n                    else {\n                        let msg = 'Ошибка базы данных, попробуйте позже';\n                        this.$emit('delete-info', 1, msg);\n                    }\n                })\n                .catch( (err) => console.log(err));\n            }\n        },\n\n        showTest(e) {\n            this.$emit('show-test', this.testId);\n        }\n    }\n\n\n\n}\n</script>\n\n<style lang=\"css\">\n\n@import './../../css/variables.css';\n\n.tests-list-item {\n    position: relative;\n    width: calc(var(--column) * 4);\n    min-height: calc(var(--row) * 4);\n    margin-bottom: calc(var(--row) * 1);\n    -webkit-box-shadow: 1px 1px 4px rgba(0,0,0,0.1);\n    box-shadow: 1px 1px 4px rgba(0,0,0,0.1);\n    cursor: pointer;\n    background-color: #fff;\n    -webkit-transition: all .3s ease-in-out;\n    -o-transition: all .3s ease-in-out;\n    transition: all .3s ease-in-out;\n}\n\n.tests-list-item:hover {\n    background-color: var(--purple);\n    -webkit-box-shadow: 2px 2px 6px rgba(0,0,0,0.3);\n    box-shadow: 2px 2px 6px rgba(0,0,0,0.3);\n}\n\n.tests-list-item:hover .tests-list-item__img {\n    opacity: 0;\n}\n\n.tests-list-item:hover .tests-list-item__desc {\n    top: 20px;\n    opacity: 1;\n}\n\n.tests-list-item:hover .tests-list-item-info h3 {\n    color: #fff;\n}\n\n.tests-list-item:hover .tests-list-item-info h3:before {\n    background-color: #fff;\n}\n\n.tests-list-item:hover .tests-list-item-info__link,\n.tests-list-item:hover .tests-list-item-info__resp {\n    color: #fff;\n}\n\n.tests-list-item:hover .tests-list-item-info__link svg,\n.tests-list-item:hover .tests-list-item-info__resp svg {\n    fill: #fff;\n}\n\n.tests-list-item-descr {\n    position: relative;\n    overflow: hidden;\n}\n\n.tests-list-item__img {\n    display: block;\n    width: 100%;\n    max-height: 200px;\n    -webkit-transition: opacity .1s ease-in-out;\n    -o-transition: opacity .1s ease-in-out;\n    transition: opacity .1s ease-in-out;\n}\n\n.tests-list-item__desc {\n    position: absolute;\n    top: -100%;\n    padding: 0px 20px;\n    opacity: 0;\n    color: #fff;\n    font-size: .9rem;\n    -webkit-transition: all .3s ease-in-out;\n    -o-transition: all .3s ease-in-out;\n    transition: all .3s ease-in-out;\n}\n\n.tests-list-item-info {\n    padding: 20px;\n    margin-bottom: 30px;\n}\n\n.tests-list-item-info h3{\n    position: relative;\n    color: var(--blue);\n    min-height: 4rem;\n    max-height: 4.5rem;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    -webkit-transition: all .3s ease-in-out;\n    -o-transition: all .3s ease-in-out;\n    transition: all .3s ease-in-out;\n}\n\n.tests-list-item-info h3:before {\n    display: block;\n    position: absolute;\n    content: '';\n    top: -5px;\n    left: 0;\n    width: 50px;\n    height: 5px;\n    background-color: var(--purple);\n    -webkit-transition: all .3s ease-in-out;\n    -o-transition: all .3s ease-in-out;\n    transition: all .3s ease-in-out;\n}\n\n.tests-list-item-info__link,\n.tests-list-item-info__resp\n {\n    position: absolute;\n    bottom: 20px;\n    padding-left: 30px;\n    display: block;\n    color: var(--blue);\n    font-size: .8rem;\n    -webkit-transition: all .3s ease-in;\n    -o-transition: all .3s ease-in;\n    transition: all .3s ease-in;\n}\n\n.tests-list-item-info__link {\n    left: 20px;\n}\n\n.tests-list-item-info__resp {\n    right: 20px;\n}\n\n.tests-list-item-info__link svg,\n.tests-list-item-info__resp svg {\n    width: 20px;\n    position: absolute;\n    top: 0px;\n    left: 0px;\n    fill: var(--purple);\n    padding-right: 5px;\n    -webkit-transition: all .3s ease-in-out;\n    -o-transition: all .3s ease-in-out;\n    transition: all .3s ease-in-out;\n}\n\ninput[class^=\"testLink\"] {\n    position: fixed;\n    right: -200%;\n}\n\n@media screen and (max-width: 812px) {\n\n    .tests-list-item {\n        margin: 0;\n        margin-bottom: 40px;\n        width: 90%;\n    }\n\n}\n\n\n\n\n\n\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 89 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "tests-list-item",
      attrs: { id: _vm.testId + "_tst" },
      on: { click: _vm.showTest }
    },
    [
      _c("div", { staticClass: "tests-list-item-descr" }, [
        _c("img", {
          staticClass: "tests-list-item__img",
          attrs: { src: _vm.testImage, alt: "" }
        }),
        _vm._v(" "),
        _c("p", { staticClass: "tests-list-item__desc" }, [
          _vm._v(_vm._s(_vm.testDescription))
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "tests-list-item-info" }, [
        _c("h3", [_vm._v(_vm._s(_vm.testTitle))]),
        _vm._v(" "),
        _vm.testStatus == 1
          ? _c(
              "a",
              {
                staticClass: "tests-list-item-info__link",
                attrs: { href: "link" },
                on: {
                  click: function($event) {
                    $event.stopPropagation()
                    $event.preventDefault()
                    _vm.showLink($event)
                  }
                }
              },
              [
                _c(
                  "svg",
                  {
                    staticStyle: { "enable-background": "new 0 0 20 20" },
                    attrs: {
                      version: "1.1",
                      id: "link",
                      xmlns: "http://www.w3.org/2000/svg",
                      "xmlns:xlink": "http://www.w3.org/1999/xlink",
                      x: "0px",
                      y: "0px",
                      viewBox: "0 0 20 20",
                      "xml:space": "preserve"
                    }
                  },
                  [
                    _c("g", [
                      _c("path", {
                        staticClass: "st0",
                        attrs: {
                          d:
                            "M17.3,2.4c-1.6-1.6-4.3-1.6-5.9,0l-3,3C8.2,5.6,8.2,6,8.4,6.2c0.3,0.3,0.7,0.3,0.9,0l3-3\n\t\tc0.5-0.5,1.3-0.8,2.1-0.8c0.8,0,1.5,0.3,2.1,0.8s0.8,1.3,0.8,2.1c0,0.8-0.3,1.5-0.8,2.1l-3.9,3.9c-1.1,1.1-3,1.1-4.1,0\n\t\tc-0.3-0.3-0.7-0.3-0.9,0s-0.3,0.7,0,0.9c0.8,0.8,1.9,1.2,3,1.2s2.1-0.4,3-1.2l3.9-3.9c0.8-0.8,1.2-1.8,1.2-3\n\t\tC18.6,4.2,18.1,3.1,17.3,2.4z"
                        }
                      }),
                      _vm._v(" "),
                      _c("path", {
                        staticClass: "st0",
                        attrs: {
                          d:
                            "M9.6,14.2l-2.5,2.5c-0.5,0.5-1.3,0.8-2.1,0.8c-0.8,0-1.5-0.3-2.1-0.8c-1.1-1.1-1.1-3,0-4.1L6.6,9\n\t\tc0.5-0.5,1.3-0.8,2.1-0.8c0.8,0,1.5,0.3,2.1,0.8c0.3,0.3,0.7,0.3,0.9,0c0.3-0.3,0.3-0.7,0-0.9c-1.6-1.6-4.3-1.6-5.9,0L2,11.7\n\t\tc-0.8,0.8-1.2,1.8-1.2,3c0,1.1,0.4,2.2,1.2,3c0.8,0.8,1.8,1.2,3,1.2c1.1,0,2.2-0.4,3-1.2l2.5-2.5c0.3-0.3,0.3-0.7,0-0.9\n\t\tC10.2,14,9.8,14,9.6,14.2z"
                        }
                      })
                    ])
                  ]
                ),
                _vm._v("Ссылка")
              ]
            )
          : _vm._e(),
        _vm._v(" "),
        _vm.testStatus == 1
          ? _c(
              "a",
              {
                staticClass: "tests-list-item-info__resp",
                attrs: { href: "" },
                on: {
                  ckick: function($event) {
                    $event.stopPropagation()
                    $event.preventDefault()
                    _vm.showResp($event)
                  }
                }
              },
              [
                _c(
                  "svg",
                  {
                    staticStyle: { "enable-background": "new 0 0 20 20" },
                    attrs: {
                      version: "1.1",
                      id: "respondent",
                      xmlns: "http://www.w3.org/2000/svg",
                      "xmlns:xlink": "http://www.w3.org/1999/xlink",
                      x: "0px",
                      y: "0px",
                      viewBox: "0 0 20 20",
                      "xml:space": "preserve"
                    }
                  },
                  [
                    _c("g", [
                      _c("g", [
                        _c("path", {
                          staticClass: "st0",
                          attrs: {
                            d:
                              "M7.9,11.9H4.9c-2.1,0-3.7,1.6-3.8,3.7c-0.1,0.6-0.3,1.7,0.1,2.1c1,1,3.4,1.4,5.2,1.4c1.8,0,4.1-0.4,5.2-1.4\n\t\t\tc0.4-0.4,0.2-1.5,0.1-2.1C11.6,13.5,10,11.9,7.9,11.9z M11.1,17.1c-0.7,0.7-2.5,1.2-4.6,1.2c-2.1,0-3.9-0.5-4.6-1.2\n\t\t\tc-0.1-0.2-0.4-4.3,3.1-4.5c0.8,0,3.1,0,3.1,0C11.4,12.6,11.1,16.9,11.1,17.1L11.1,17.1z"
                          }
                        }),
                        _vm._v(" "),
                        _c("path", {
                          staticClass: "st0",
                          attrs: {
                            d:
                              "M6.4,11.2c1.7,0,3.1-1.4,3-3c0-1.7-1.3-3-3-3c-1.6,0-3,1.4-3,3C3.3,9.8,4.7,11.2,6.4,11.2z M6.4,5.9\n\t\t\tc1.3,0,2.3,1,2.3,2.3s-1,2.3-2.3,2.3s-2.3-1-2.3-2.3S5.1,5.9,6.4,5.9z"
                          }
                        }),
                        _vm._v(" "),
                        _c("path", {
                          staticClass: "st0",
                          attrs: {
                            d:
                              "M9.9,1v5.6h1.2v2.7l2.7-2.7H19V1H9.9z M18.3,5.8h-4.8l-1.7,1.7V5.8h-1.2V1.8h7.6V5.8z"
                          }
                        }),
                        _vm._v(" "),
                        _c("path", {
                          staticClass: "st0",
                          attrs: {
                            d:
                              "M14.4,2.8c0-0.1,0.1-0.1,0.2-0.1c0.1,0,0.2,0,0.2,0c0,0.1,0.1,0.2,0.1,0.2c0,0.1,0,0.2-0.1,0.2l-0.3,0.3\n\t\t\tc-0.1,0.1-0.2,0.2-0.2,0.3c0,0.1,0,0.2,0,0.3v0.3h0.7V4.2c0-0.1,0-0.2,0-0.2c0,0,0.1-0.1,0.2-0.2c0.1-0.1,0.2-0.2,0.2-0.2\n\t\t\tc0,0,0-0.1,0.1-0.1c0,0,0.1-0.1,0.1-0.1c0,0,0,0,0.1-0.1c0,0,0-0.2,0-0.3c0-0.3-0.1-0.5-0.3-0.7c-0.2-0.2-0.4-0.2-0.7-0.2\n\t\t\tc-0.3,0-0.5,0.1-0.7,0.3c-0.2,0.2-0.3,0.4-0.3,0.7h0.8C14.3,3,14.3,2.9,14.4,2.8L14.4,2.8z"
                          }
                        }),
                        _vm._v(" "),
                        _c("path", {
                          staticClass: "st0",
                          attrs: {
                            d:
                              "M14.6,4.6c-0.1,0-0.2,0-0.3,0.1c-0.1,0.1-0.1,0.2-0.1,0.3c0,0.1,0,0.2,0.1,0.3c0.1,0.1,0.2,0.1,0.3,0.1\n\t\t\tc0.1,0,0.2,0,0.3-0.1C14.9,5.3,15,5.2,15,5.1c0-0.1,0-0.2-0.1-0.3S14.7,4.6,14.6,4.6z"
                          }
                        })
                      ])
                    ])
                  ]
                ),
                _vm._v(_vm._s(_vm.testRespondents))
              ]
            )
          : _vm._e(),
        _vm._v(" "),
        _vm.testStatus == 0
          ? _c(
              "a",
              {
                staticClass: "tests-list-item-info__link",
                attrs: { href: "" },
                on: {
                  click: function($event) {
                    $event.stopPropagation()
                    $event.preventDefault()
                    _vm.editHandler($event)
                  }
                }
              },
              [
                _c(
                  "svg",
                  {
                    staticStyle: { "enable-background": "new 0 0 20 20" },
                    attrs: {
                      version: "1.1",
                      id: "Layer_2",
                      xmlns: "http://www.w3.org/2000/svg",
                      "xmlns:xlink": "http://www.w3.org/1999/xlink",
                      x: "0px",
                      y: "0px",
                      viewBox: "0 0 20 20",
                      "xml:space": "preserve"
                    }
                  },
                  [
                    _c("path", {
                      staticClass: "st0",
                      attrs: {
                        d:
                          "M18.6,1.4c-1.2-1.2-3.2-1.2-4.4,0L1.8,13.8c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0.1,0,0.1s0,0,0,0l0,0l-1.2,5.1\n\tc0,0,0,0,0,0.1l0,0c0,0,0,0.1,0,0.1c0,0,0,0,0,0s0,0.1,0.1,0.1c0,0,0.1,0.1,0.1,0.1c0,0,0.1,0,0.1,0c0,0,0.1,0,0.1,0L6,18.3h0h0\n\tc0,0,0,0,0.1,0c0,0,0,0,0,0l0,0L18.6,5.8C19.8,4.6,19.8,2.6,18.6,1.4z M18.1,1.9C19,2.7,19,4.1,18.4,5L15,1.6\n\tC15.9,1,17.3,1.1,18.1,1.9z M16.4,7L13,3.6l0.5-0.5l3.4,3.4L16.4,7z M2.2,17.8c-0.1-0.1-0.3-0.1-0.5,0l-0.3,0.2l0.9-3.7l1.5-0.2\n\tL3.7,16v0v0v0c0,0,0,0,0,0.1c0,0,0,0,0,0.1l0,0c0,0,0,0,0.1,0l0,0c0,0,0,0,0.1,0h0h0l0,0l0,0l0,0l0,0h0l1.8-0.2l-0.2,1.5l-3.7,0.9\n\tl0.3-0.3C2.4,18.2,2.4,18,2.2,17.8z M6.5,15.9l7.7-7.7c0.1-0.1,0.1-0.3,0-0.5c-0.1-0.1-0.3-0.1-0.5,0L6,15.4l-1.7,0.2L4.6,14\n\tl7.7-7.7c0.1-0.1,0.1-0.3,0-0.5c-0.1-0.1-0.3-0.1-0.5,0l-7.7,7.7L3,13.6l9.5-9.5l3.4,3.4L6.4,17L6.5,15.9z M17.4,6L14,2.6l0.5-0.5\n\tl3.4,3.4L17.4,6z"
                      }
                    })
                  ]
                ),
                _vm._v("редактировать")
              ]
            )
          : _vm._e(),
        _vm._v(" "),
        _vm.testStatus == 0
          ? _c(
              "a",
              {
                staticClass: "tests-list-item-info__resp",
                attrs: { href: "" },
                on: {
                  click: function($event) {
                    $event.stopPropagation()
                    $event.preventDefault()
                    _vm.deleteHandler($event)
                  }
                }
              },
              [
                _c(
                  "svg",
                  {
                    staticStyle: { "enable-background": "new 0 0 20 20" },
                    attrs: {
                      version: "1.1",
                      id: "delete",
                      xmlns: "http://www.w3.org/2000/svg",
                      "xmlns:xlink": "http://www.w3.org/1999/xlink",
                      x: "0px",
                      y: "0px",
                      viewBox: "0 0 20 20",
                      "xml:space": "preserve"
                    }
                  },
                  [
                    _c("g", [
                      _c("g", [
                        _c("g", [
                          _c("path", {
                            staticClass: "st0",
                            attrs: {
                              d:
                                "M15.5,6.4c0-0.2,0.1-0.3,0.3-0.3c0.2,0,0.3,0.1,0.3,0.3v10.8c0,0.5-0.2,0.9-0.5,1.2\n\t\t\t\tc-0.3,0.3-0.8,0.5-1.2,0.5H5.5c-0.5,0-0.9-0.2-1.2-0.5c-0.3-0.3-0.5-0.8-0.5-1.2V6.4c0-0.2,0.1-0.3,0.3-0.3s0.3,0.1,0.3,0.3v10.8\n\t\t\t\tc0,0.3,0.1,0.6,0.3,0.8c0.2,0.2,0.5,0.3,0.8,0.3h8.8c0.3,0,0.6-0.1,0.8-0.3s0.3-0.5,0.3-0.8L15.5,6.4L15.5,6.4z"
                            }
                          }),
                          _vm._v(" "),
                          _c("path", {
                            staticClass: "st0",
                            attrs: {
                              d:
                                "M7.8,16.5c0,0.2-0.1,0.3-0.3,0.3c-0.2,0-0.3-0.1-0.3-0.3v-10c0-0.2,0.1-0.3,0.3-0.3c0.2,0,0.3,0.1,0.3,0.3\n\t\t\t\tV16.5z"
                            }
                          }),
                          _vm._v(" "),
                          _c("path", {
                            staticClass: "st0",
                            attrs: {
                              d:
                                "M10.2,16.5c0,0.2-0.1,0.3-0.3,0.3c-0.2,0-0.3-0.1-0.3-0.3v-10c0-0.2,0.1-0.3,0.3-0.3c0.2,0,0.3,0.1,0.3,0.3\n\t\t\t\tV16.5z"
                            }
                          }),
                          _vm._v(" "),
                          _c("path", {
                            staticClass: "st0",
                            attrs: {
                              d:
                                "M12.6,16.5c0,0.2-0.1,0.3-0.3,0.3S12,16.7,12,16.5v-10c0-0.2,0.1-0.3,0.3-0.3s0.3,0.1,0.3,0.3V16.5\n\t\t\t\tL12.6,16.5z"
                            }
                          }),
                          _vm._v(" "),
                          _c("path", {
                            staticClass: "st0",
                            attrs: {
                              d:
                                "M7.6,2.6c0,0.2-0.1,0.3-0.3,0.3c-0.2,0-0.3-0.1-0.3-0.3c0-0.5,0.2-0.9,0.5-1.2c0.3-0.3,0.8-0.5,1.2-0.5H11\n\t\t\t\tc0.5,0,0.9,0.2,1.2,0.5c0.3,0.3,0.5,0.8,0.5,1.2c0,0.2-0.1,0.3-0.3,0.3s-0.3-0.1-0.3-0.3c0-0.3-0.1-0.6-0.3-0.8\n\t\t\t\tc-0.2-0.2-0.5-0.3-0.8-0.3H8.8C8.5,1.5,8.2,1.6,8,1.8C7.8,2,7.6,2.3,7.6,2.6z"
                            }
                          }),
                          _vm._v(" "),
                          _c("path", {
                            staticClass: "st0",
                            attrs: {
                              d:
                                "M3.3,3.5h13.2c0.3,0,0.5,0.1,0.7,0.3l0,0c0.2,0.2,0.3,0.4,0.3,0.7v0.7c0,0.2-0.1,0.3-0.3,0.3h0H2.6\n\t\t\t\tc-0.2,0-0.3-0.1-0.3-0.3v0V4.5c0-0.3,0.1-0.5,0.3-0.7l0,0C2.8,3.6,3,3.5,3.3,3.5L3.3,3.5z M16.5,4H3.3C3.2,4,3.1,4.1,3,4.2l0,0\n\t\t\t\tC2.9,4.2,2.9,4.3,2.9,4.5v0.4h14V4.5c0-0.1,0-0.2-0.1-0.3l0,0C16.7,4.1,16.6,4,16.5,4z"
                            }
                          })
                        ])
                      ])
                    ])
                  ]
                ),
                _vm._v("удалить")
              ]
            )
          : _vm._e()
      ]),
      _vm._v(" "),
      _c("input", { class: [_vm.testLink] })
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-4c1caf50", esExports)
  }
}

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(91);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("1411493b", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-151a5f1c\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./pop-up-test.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-151a5f1c\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./pop-up-test.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(5);
exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n:root{font-family:Marta;font-size:16px;line-height:1.4\n}\n.pop-up{z-index:105;position:fixed;top:0;left:0;width:100vw;height:100%;background-color:rgba(0,0,0,.8)\n}\n.pop-up,.pop-up>div{overflow-y:scroll\n}\n.pop-up-controls{position:fixed;display:flex;flex-wrap:wrap;max-width:50px;top:0;left:calc(25% - 60px);background-color:#fff\n}\n.pop-up-controls button{display:block;cursor:pointer;width:50px;height:50px;border:none;margin:10px 5px;background-color:#fff;background-repeat:no-repeat;background-position:50%;opacity:.5;transition:opacity .3s ease-in-out\n}\n.pop-up-controls button:hover{opacity:1\n}\n.pop-up-controls__publish{background-image:url(" + escape(__webpack_require__(92)) + ")\n}\n.pop-up-controls__edit{background-image:url(" + escape(__webpack_require__(93)) + ")\n}\n.pop-up-controls__delete{background-image:url(" + escape(__webpack_require__(94)) + ")\n}\n.pop-up-window{width:50%;background-color:#fff;margin:0 auto;padding:40px;position:relative\n}\n.pop-up-general{text-align:center;color:#092e64;padding-top:calc(4.16667vw * 2)\n}\n.pop-up-window img{display:block;margin:0 auto;margin-bottom:40px;max-height:300px\n}\n.link{position:absolute;background-color:#656695;color:#fff;margin:0;padding:23px;left:0;top:0\n}\n@media screen and (max-width:812px){\n.pop-up{z-index:111\n}\n.pop-up-window{width:80%;padding:10px;margin-bottom:40px\n}\n.pop-up-window h2{font-size:1.2rem\n}\n.pop-up-window h3{font-size:1rem\n}\n.pop-up-general{padding-top:calc(4.16667vh * 6)\n}\n.pop-up-controls{top:90%;left:10%;z-index:111;min-width:80%;max-width:0;height:10%;background-color:#fff;box-shadow:0 -2px 4px rgba(0,0,0,.1);z-index:112;justify-content:center\n}\n.pop-up-controls button{width:30px;height:30px\n}\n}", "", {"version":3,"sources":["/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/css/variables.css","/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/vue-comp/interface/src/vue-comp/interface/pop-up-test.vue"],"names":[],"mappings":";AAAA,MACI,kBAAqB,eACL,eACC;CAapB;AC+HD,QACA,YAAA,eACA,MACA,OACA,YACA,YACA,+BACA;CAIA;AAEA,oBAHA,iBAAA;CAKA;AAEA,iBACA,eAAA,aACA,eACA,eACA,MACA,sBACA,qBACA;CACA;AAEA,wBACA,cAAA,eACA,WACA,YACA,YACA,gBACA,sBACA,4BACA,wBACA,WACA,kCAGA;CACA;AAEA,8BACA,SAAA;CACA;AAEA,0BACA,8CAAA;CACA;AAEA,uBACA,8CAAA;CACA;AAEA,yBACA,8CAAA;CACA;AAGA,eACA,UAAA,sBACA,cACA,aACA,iBACA;CACA;AAEA,gBACA,kBAAA,cACA,+BACA;CACA;AAEA,mBACA,cAAA,cACA,mBACA,gBACA;CACA;AAEA,MACA,kBAAA,yBACA,WACA,SACA,aACA,OACA,KACA;CACA;AAEA;AAEA,QACA,WAAA;CACA;AAEA,eACA,UAAA,aACA,kBACA;CACA;AAEA,kBACA,gBAAA;CACA;AAEA,kBACA,cAAA;CACA;AAEA,gBACA,+BAAA;CACA;AAEA,iBACA,QAAA,SACA,YACA,cACA,YACA,WACA,sBACA,qCACA,YACA,sBACA;CACA;AAEA,wBACA,WAAA,WACA;CACA;CACA","file":"pop-up-test.vue","sourcesContent":[":root {\n    font-family: 'Marta';\n    font-size: 16px;\n    line-height: 1.4;\n    --blue: #092E64;\n    --purple: #656695;\n    --darkpurple: #313149;\n    --marine: #3493A8;\n    --yellow: #EFDA7B;\n    --green: #9DBE87;\n    --red: #c74545;\n    --background: #e6e5e5;\n    --column: calc(100vw / 24);\n    --row: calc(100vh / 12);\n    --column-mobile: calc(100vw / 12);\n    --row-mobile: calc(100vh / 24);\n}\n","<template lang=\"html\">\n\n    <div class=\"pop-up\" @click=\"closeWindow\">\n        <div>\n                <div class=\"pop-up-window\" @click.stop>\n                    <div class=\"pop-up-controls\">\n                        <button class=\"pop-up-controls__publish\" v-if=\"!testStatus\" type=\"button\" name=\"button\" title=\"опубликовать\" @click=\"publish\"></button>\n                        <button class=\"pop-up-controls__edit\" v-if=\"!testStatus\" type=\"button\" name=\"button\" title=\"редактировать\" @click=\"edit\"></button>\n                        <button class=\"pop-up-controls__delete\" type=\"button\" name=\"button\" title=\"удалить\" @click=\"deleteTest\"></button>\n\n\n                    </div>\n\n                    <div class=\"pop-up-general\">\n                        <p v-if=\"testStatus == 1\" class=\"link\">Ссылка на тест: {{testLink}}</p>\n                        <h2>{{testTitle}}</h2>\n                        <p>{{testDescription}}</p>\n                        <img :src=\"testImage\" alt=\"\">\n                    </div>\n\n                    <question-item\n                    v-for=\"question in questions\"\n                    :key=\"question.question_id\"\n                    :qsttitle=\"question.question_description\"\n                    :vars=\"question.vars\"\n                    :answer=\"question.question_answer\"\n                    :qsttype=\"question.question_type_id\"\n                    :useranswer=\"question.user_answer\"\n                    :checkstatus=\"question.check_status\"\n                    >\n\n                </question-item>\n\n            </div>\n        </div>\n    </div>\n\n</template>\n\n<script>\n\nimport questionItem from './pop-up-question.vue';\nimport axios from './../../../node_modules/axios/dist/axios.js';\n\nexport default {\n\n    props: [\n        'testtite',\n        'description',\n        'imglink',\n        'anonym',\n        'time',\n        'status',\n        'testquestions',\n        'testid'\n    ],\n\n    components: {\n        'question-item': questionItem\n    },\n\n    data() {\n        return {\n            testTitle: this.testtite,\n            testDescription: this.description,\n            testImage: this.imglink ? this.imglink : 'img/default_test.svg',\n            testStatus: +this.status ? true : false,\n            testId: this.testid,\n            testLink: window.location.origin + '/exec?' + encodeURIComponent(btoa('test_id=' + (+this.testid))), //кодируем запрос в формат base64\n            testOptions: {\n                timeLimit: +this.time !== 0 ? true : false,\n                time: +this.time,\n                anonym: +this.status ? true : false\n            },\n            questions: this.testquestions\n        }\n    },\n\n    methods: {\n        closeWindow() {\n            // console.log(this.testId);\n            this.$emit('close-window');\n        },\n        edit() {\n            this.$emit('edit-test', this.testId);\n        },\n        //Удаляем тест\n        deleteTest() {\n\n            if(window.confirm('Вы точто хотите удалить тест?')) {\n                let query = this.testId;\n                axios.get(`php/deletetest.php?test_id=${query}`)\n                .then( (res) => {\n                    if(res.data.success) {\n                        let msg = 'Тест успешно удален из базы данных';\n                        this.$emit('delete-test', 3, msg);\n                        this.closeWindow();\n                    }\n                    else {\n                        let msg = 'Ошибка базы данных, попробуйте позже';\n                        this.$emit('delete-test', 3, msg);\n                        this.closeWindow();\n                    }\n                })\n                .catch( (err) => console.log(err));\n            }\n        },\n\n        //Публикуем тест\n        publish() {\n            let query = this.testId;\n            axios.get(`php/changeteststatus.php?test_id=${query}`)\n            .then( (res) => {\n                if(res.data.success) {\n                    let msg = 'Тест успешно опубликован';\n                    this.$emit('update-test', 3, msg);\n                    this.closeWindow();\n                }\n                else {\n                    let msg = 'Ошибка базы данных, попробуйте позже';\n                    this.$emit('update-test', 1, msg);\n                    this.closeWindow();\n                }\n            })\n            .catch( (err) => console.log(err));\n        }\n\n    },\n\n    created () {\n        document.body.style.overflow = 'hidden';\n    },\n\n    destroyed () {\n        document.body.style.overflow = 'auto';\n    }\n\n}\n</script>\n\n<style lang=\"css\">\n\n    @import './../../css/variables.css';\n\n    .pop-up {\n        z-index: 105;\n        position: fixed;\n        top: 0;\n        left: 0;\n        width: 100vw;\n        height: 100%;\n        background-color: rgba(0, 0, 0, 0.8);\n        /* padding-top: calc(var(--row) * 2);\n        padding-bottom: calc(var(--row) * 2); */\n        overflow-y: scroll;\n    }\n\n    .pop-up > div {\n        overflow-y: scroll;\n    }\n\n    .pop-up-controls {\n        position: fixed;\n        display: flex;\n        flex-wrap: wrap;\n        max-width: 50px;\n        top: 0;\n        left: calc(25% - 60px);\n        background-color: #fff;\n    }\n\n    .pop-up-controls button {\n        display: block;\n        cursor: pointer;\n        width: 50px;\n        height: 50px;\n        border: none;\n        margin: 10px 5px;\n        background-color: #fff;\n        background-repeat: no-repeat;\n        background-position: center;\n        opacity: .5;\n        -webkit-transition: opacity .3s ease-in-out;\n        -o-transition: opacity .3s ease-in-out;\n        transition: opacity .3s ease-in-out;\n    }\n\n    .pop-up-controls button:hover {\n        opacity: 1;\n    }\n\n    .pop-up-controls__publish {\n        background-image: url('./../../img/success.svg');\n    }\n\n    .pop-up-controls__edit {\n        background-image: url('./../../img/edit.svg');\n    }\n\n    .pop-up-controls__delete {\n        background-image: url('./../../img/dustbin.svg');\n    }\n\n\n    .pop-up-window {\n        width: 50%;\n        background-color: #fff;\n        margin: 0 auto;\n        padding: 40px;\n        position: relative;\n    }\n\n    .pop-up-general {\n        text-align: center;\n        color: var(--blue);\n        padding-top: calc(var(--column) * 2);\n    }\n\n    .pop-up-window img {\n        display: block;\n        margin: 0 auto;\n        margin-bottom: 40px;\n        max-height: 300px;\n    }\n\n    .link {\n        position: absolute;\n        background-color: var(--purple);\n        color: #fff;\n        margin: 0;\n        padding: 23px;\n        left: 0;\n        top: 0;\n    }\n\n    @media screen and (max-width: 812px) {\n\n        .pop-up {\n            z-index: 111;\n        }\n\n        .pop-up-window {\n            width: 80%;\n            padding: 10px;\n            margin-bottom: 40px;\n        }\n\n        .pop-up-window h2 {\n            font-size: 1.2rem;\n        }\n\n        .pop-up-window h3 {\n            font-size: 1rem;\n        }\n\n        .pop-up-general {\n            padding-top: calc(var(--row-mobile) * 6);\n        }\n\n        .pop-up-controls {\n            top: 90%;\n            left: 10%;\n            z-index: 111;\n            min-width: 80%;\n            max-width: 0;\n            height: 10%;\n            background-color: #fff;\n            box-shadow: 0px -2px 4px rgba(0,0,0,.1);\n            z-index: 112;\n            justify-content: center;\n        }\n\n        .pop-up-controls button {\n            width: 30px;\n            height: 30px;\n        }\n    }\n\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 92 */
/***/ (function(module, exports) {

module.exports = "img/../img/success.svg";

/***/ }),
/* 93 */
/***/ (function(module, exports) {

module.exports = "img/../img/edit.svg";

/***/ }),
/* 94 */
/***/ (function(module, exports) {

module.exports = "img/../img/dustbin.svg";

/***/ }),
/* 95 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_pop_up_question_vue__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_pop_up_question_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_pop_up_question_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_pop_up_question_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_pop_up_question_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5af899c6_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_pop_up_question_vue__ = __webpack_require__(98);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(96)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_pop_up_question_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5af899c6_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_pop_up_question_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/vue-comp/interface/pop-up-question.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5af899c6", Component.options)
  } else {
    hotAPI.reload("data-v-5af899c6", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(97);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("52a6eac1", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-5af899c6\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./pop-up-question.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-5af899c6\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./pop-up-question.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n:root{font-family:Marta;font-size:16px;line-height:1.4\n}\n.pop-up-question{display:flex;flex-wrap:wrap;margin-bottom:20px;padding:20px;box-shadow:0 0 4px rgba(101,102,149,.3);border-bottom:6px solid rgba(101,102,149,.5);border-right:3px solid rgba(101,102,149,.5);border-radius:20px\n}\n.pop-up-question h3{width:100%;position:relative;text-align:left;margin-bottom:20px;color:#092e64;padding-top:20px;text-align:center\n}\n.pop-up-question h3:after{position:absolute;display:block;height:3px;background-color:#656695;content:\"\";left:45%;bottom:-10px;width:10%\n}\n.pop-up-question ul{width:100%;margin:40px 0;list-style:none;display:flex;justify-content:space-between;flex-wrap:wrap\n}\n.pop-up-question li{display:block;text-align:left;color:#656695;opacity:.5;padding:5px\n}\n.pop-up-question li.right{opacity:1;color:#9dbe87;text-decoration:underline\n}\n.string_right{color:#656695\n}\n.pop-up-question li.right.userCheck{background-color:#9dbe87;color:#fff;box-shadow:1px 1px 4px rgba(0,0,0,.1)\n}\n.false.userCheck{background-color:#c74545;color:#fff;box-shadow:1px 1px 4px rgba(0,0,0,.1)\n}", "", {"version":3,"sources":["/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/css/variables.css","/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/vue-comp/interface/src/vue-comp/interface/pop-up-question.vue"],"names":[],"mappings":";AAAA,MACI,kBAAqB,eACL,eACC;CAapB;ACsCD,iBACA,aAAA,eACA,mBACA,aACA,wCAEA,6CACA,4CACA,kBACA;CACA;AAEA,oBACA,WAAA,kBACA,gBACA,mBACA,cACA,iBACA,iBACA;CACA;AAEA,0BACA,kBAAA,cACA,WACA,yBACA,WACA,SACA,aACA,SACA;CACA;AAEA,oBACA,WAAA,cACA,gBACA,aACA,8BACA,cACA;CACA;AAEA,oBACA,cAAA,gBACA,cACA,WACA,WACA;CACA;AAEA,0BACA,UAAA,cACA,yBACA;CACA;AAEA,cACA,aAAA;CAEA;AAEA,oCACA,yBAAA,WACA,qCAEA;CACA;AAEA,iBACA,yBAAA,WACA,qCAEA;CACA","file":"pop-up-question.vue","sourcesContent":[":root {\n    font-family: 'Marta';\n    font-size: 16px;\n    line-height: 1.4;\n    --blue: #092E64;\n    --purple: #656695;\n    --darkpurple: #313149;\n    --marine: #3493A8;\n    --yellow: #EFDA7B;\n    --green: #9DBE87;\n    --red: #c74545;\n    --background: #e6e5e5;\n    --column: calc(100vw / 24);\n    --row: calc(100vh / 12);\n    --column-mobile: calc(100vw / 12);\n    --row-mobile: calc(100vh / 24);\n}\n","<template lang=\"html\">\n\n    <div class=\"pop-up-question\">\n        <h3>{{title}}</h3>\n        <ul\n            v-if=\"type == 1 || type == 2\"\n        >\n            <li\n                v-for=\"item in variants\"\n                :key=\"item.var_bd_id\"\n                :class=\"[right.indexOf(item.question_client_id) >= 0 ? 'right' : 'false', !userAnswers ? '' : userAnswers.indexOf(item.question_client_id) >=0 ? 'userCheck' : '']\"\n            >{{item.var_text}}</li>\n        </ul>\n        <p class=\"string_right\" v-else>{{right}}</p>\n    </div>\n\n</template>\n\n<script>\nexport default {\n\n    props: [\n        'qsttitle',\n        'vars',\n        'answer',\n        'qsttype',\n        'useranswer',\n        'checkstatus'\n\n    ],\n\n    data() {\n        return {\n            title: this.qsttitle,\n            variants: this.vars,\n            right: this.answer,\n            type: +this.qsttype,\n            check: this.checkstatus,\n            userAnswers: this.useranswer\n        }\n    },\n\n    created() {\n        if(this.type == 1 || this.type == 2) {\n            this.right = this.answer.length > 0 ? this.answer.split(',') : [this.anwer];\n        }\n    }\n\n}\n</script>\n\n<style lang=\"css\">\n\n    @import './../../css/variables.css';\n\n    .pop-up-question {\n        display: flex;\n        flex-wrap: wrap;\n        margin-bottom: 20px;\n        padding: 20px;\n        -webkit-box-shadow: 0px 0px 4px rgba(101, 102, 149,0.3);\n        box-shadow: 0px 0px 4px rgba(101, 102, 149,0.3);\n        border-bottom: 6px solid rgba(101, 102, 149, .5);\n        border-right: 3px solid rgba(101, 102, 149, .5);\n        border-radius: 20px;\n    }\n\n    .pop-up-question h3 {\n        width: 100%;\n        position: relative;\n        text-align: left;\n        margin-bottom: 20px;\n        color: var(--blue);\n        padding-top: 20px;\n        text-align: center;\n    }\n\n    .pop-up-question h3:after {\n        position: absolute;\n        display: block;\n        height: 3px;\n        background-color: var(--purple);\n        content: '';\n        left: 45%;\n        bottom: -10px;\n        width: 10%;\n    }\n\n    .pop-up-question ul {\n        width: 100%;\n        margin: 40px 0px;\n        list-style: none;\n        display: flex;\n        justify-content: space-between;\n        flex-wrap: wrap;\n    }\n\n    .pop-up-question li {\n        display: block;\n        text-align: left;\n        color: var(--purple);\n        opacity: .5;\n        padding: 5px;\n    }\n\n    .pop-up-question li.right {\n        opacity: 1;\n        color: var(--green);\n        text-decoration: underline;\n    }\n\n    .string_right {\n        color: var(--purple);\n        /* text-decoration: underline; */\n    }\n\n    .pop-up-question li.right.userCheck {\n        background-color: var(--green);\n        color: #fff;\n        -webkit-box-shadow: 1px 1px 4px rgba(0,0,0,0.1);\n        box-shadow: 1px 1px 4px rgba(0,0,0,0.1);\n    }\n\n    .false.userCheck  {\n        background-color: var(--red);\n        color: #fff;\n        -webkit-box-shadow: 1px 1px 4px rgba(0,0,0,0.1);\n        box-shadow: 1px 1px 4px rgba(0,0,0,0.1);\n    }\n\n\n\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 98 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "pop-up-question" }, [
    _c("h3", [_vm._v(_vm._s(_vm.title))]),
    _vm._v(" "),
    _vm.type == 1 || _vm.type == 2
      ? _c(
          "ul",
          _vm._l(_vm.variants, function(item) {
            return _c(
              "li",
              {
                key: item.var_bd_id,
                class: [
                  _vm.right.indexOf(item.question_client_id) >= 0
                    ? "right"
                    : "false",
                  !_vm.userAnswers
                    ? ""
                    : _vm.userAnswers.indexOf(item.question_client_id) >= 0
                      ? "userCheck"
                      : ""
                ]
              },
              [_vm._v(_vm._s(item.var_text))]
            )
          })
        )
      : _c("p", { staticClass: "string_right" }, [_vm._v(_vm._s(_vm.right))])
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-5af899c6", esExports)
  }
}

/***/ }),
/* 99 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "pop-up", on: { click: _vm.closeWindow } }, [
    _c("div", [
      _c(
        "div",
        {
          staticClass: "pop-up-window",
          on: {
            click: function($event) {
              $event.stopPropagation()
            }
          }
        },
        [
          _c("div", { staticClass: "pop-up-controls" }, [
            !_vm.testStatus
              ? _c("button", {
                  staticClass: "pop-up-controls__publish",
                  attrs: {
                    type: "button",
                    name: "button",
                    title: "опубликовать"
                  },
                  on: { click: _vm.publish }
                })
              : _vm._e(),
            _vm._v(" "),
            !_vm.testStatus
              ? _c("button", {
                  staticClass: "pop-up-controls__edit",
                  attrs: {
                    type: "button",
                    name: "button",
                    title: "редактировать"
                  },
                  on: { click: _vm.edit }
                })
              : _vm._e(),
            _vm._v(" "),
            _c("button", {
              staticClass: "pop-up-controls__delete",
              attrs: { type: "button", name: "button", title: "удалить" },
              on: { click: _vm.deleteTest }
            })
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "pop-up-general" }, [
            _vm.testStatus == 1
              ? _c("p", { staticClass: "link" }, [
                  _vm._v("Ссылка на тест: " + _vm._s(_vm.testLink))
                ])
              : _vm._e(),
            _vm._v(" "),
            _c("h2", [_vm._v(_vm._s(_vm.testTitle))]),
            _vm._v(" "),
            _c("p", [_vm._v(_vm._s(_vm.testDescription))]),
            _vm._v(" "),
            _c("img", { attrs: { src: _vm.testImage, alt: "" } })
          ]),
          _vm._v(" "),
          _vm._l(_vm.questions, function(question) {
            return _c("question-item", {
              key: question.question_id,
              attrs: {
                qsttitle: question.question_description,
                vars: question.vars,
                answer: question.question_answer,
                qsttype: question.question_type_id,
                useranswer: question.user_answer,
                checkstatus: question.check_status
              }
            })
          })
        ],
        2
      )
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-151a5f1c", esExports)
  }
}

/***/ }),
/* 100 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "tester-page" },
    [
      _c("side-menu"),
      _vm._v(" "),
      _c(
        "section",
        { staticClass: "content" },
        [
          _c(
            "transition",
            { attrs: { name: "fade" } },
            [
              _vm.popUp
                ? _c("pop-up", {
                    attrs: {
                      testtite: _vm.currentTest.test_name,
                      description: _vm.currentTest.test_description,
                      imglink: _vm.currentTest.test_image,
                      anonym: _vm.currentTest.test_anonym,
                      time: _vm.currentTest.test_time,
                      status: _vm.currentTest.test_status,
                      testquestions: _vm.currentTest.questions,
                      testid: _vm.currentTest.test_id
                    },
                    on: {
                      "close-window": _vm.closePopUp,
                      "edit-test": _vm.editTestHandler,
                      "update-test": _vm.updateTestHandler,
                      "delete-test": _vm.deleteTestHandler
                    }
                  })
                : _vm._e()
            ],
            1
          ),
          _vm._v(" "),
          _c("nav", { staticClass: "new-test-nav" }, [
            _c("ul", [
              _c("li", [
                _c(
                  "a",
                  {
                    attrs: { href: "save" },
                    on: {
                      click: function($event) {
                        $event.preventDefault()
                        _vm.showPublished($event)
                      }
                    }
                  },
                  [_vm._v("Опубликованные")]
                )
              ]),
              _vm._v(" "),
              _c("li", [
                _c(
                  "a",
                  {
                    attrs: { href: "publish" },
                    on: {
                      click: function($event) {
                        $event.preventDefault()
                        _vm.showDrafts($event)
                      }
                    }
                  },
                  [_vm._v("Черновики")]
                )
              ])
            ])
          ]),
          _vm._v(" "),
          _vm.loading
            ? _c(
                "div",
                { staticClass: "loading" },
                [_c("loading-indicator")],
                1
              )
            : _c("div", { staticClass: "tests-list-main" }, [
                _vm.currentSection
                  ? _c(
                      "div",
                      { key: _vm.sectionOne, staticClass: "tests-list" },
                      [
                        _vm._l(_vm.tests.published, function(test) {
                          return _c("test-item", {
                            key: test.test_id,
                            attrs: {
                              description: test.test_description,
                              testtitle: test.test_name,
                              testid: test.test_id,
                              imglink: test.test_img,
                              status: test.test_status,
                              respondents: test.respondents
                            },
                            on: {
                              "show-test": _vm.showTestHandler,
                              "delete-info": _vm.deleteTest,
                              "copy-link": _vm.copyLinkHander
                            }
                          })
                        }),
                        _vm._v(" "),
                        _c(
                          "button",
                          {
                            staticClass: "add-new-test",
                            attrs: { type: "button", name: "button" },
                            on: { click: _vm.newTest }
                          },
                          [
                            _c("img", {
                              attrs: { src: "img/add.svg", alt: "" }
                            })
                          ]
                        )
                      ],
                      2
                    )
                  : _c(
                      "div",
                      { key: _vm.sectionTwo, staticClass: "tests-list" },
                      [
                        _vm._l(_vm.tests.drafts, function(test) {
                          return _c("test-item", {
                            key: test.test_id,
                            attrs: {
                              description: test.test_description,
                              testtitle: test.test_name,
                              testid: test.test_id,
                              imglink: test.test_img,
                              status: test.test_status
                            },
                            on: {
                              "show-test": _vm.showTestHandler,
                              "delete-info": _vm.deleteTest,
                              "edit-test-new": _vm.editNewTestHandler
                            }
                          })
                        }),
                        _vm._v(" "),
                        _c(
                          "button",
                          {
                            staticClass: "add-new-test",
                            attrs: { type: "button", name: "button" },
                            on: { click: _vm.newTest }
                          },
                          [
                            _c("img", {
                              attrs: { src: "img/add.svg", alt: "" }
                            })
                          ]
                        )
                      ],
                      2
                    )
              ]),
          _vm._v(" "),
          _c(
            "transition",
            { attrs: { name: "fade" } },
            [
              _vm.flashMsg.text.length > 0
                ? _c("flash-message", {
                    attrs: {
                      code: _vm.flashMsg.status,
                      text: _vm.flashMsg.text
                    }
                  })
                : _vm._e()
            ],
            1
          )
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-7f9081a2", esExports)
  }
}

/***/ }),
/* 101 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_exec_vue__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_exec_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_exec_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_exec_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_exec_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6f51c001_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_exec_vue__ = __webpack_require__(118);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(102)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_exec_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6f51c001_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_exec_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/vue-comp/exec.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6f51c001", Component.options)
  } else {
    hotAPI.reload("data-v-6f51c001", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(103);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("408a9644", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6f51c001\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./exec.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6f51c001\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./exec.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(5);
exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n:root{font-family:Marta;font-size:16px;line-height:1.4\n}\n.mobile-nav{display:none\n}\n.exec-page{width:100%;display:flex\n}\n.exec-page .content{margin-left:calc(4.16667vw * 2);margin-right:calc(4.16667vw * 2);width:calc(4.16667vw * 16);display:flex\n}\n.exec-page>div{display:flex\n}\n.content>div{width:100%;padding-top:calc(8.33333vh * 2);color:#092e64\n}\n.test-descr,.test-title{text-align:center\n}\n.test-title{position:relative\n}\n.test-title:after{position:absolute;left:30%;bottom:-10px;display:block;content:\"\";width:40%;height:3px;background-color:#656695\n}\n.warning{align-self:center\n}\n.test-nav{position:fixed;padding-bottom:40px;width:calc(4.16667vw * 20);z-index:102;bottom:0;right:0;background-color:#fff\n}\n.test-nav,.test-nav ul{display:flex;justify-content:center\n}\n.test-nav ul{position:relative;width:calc(4.16667vw * 16);min-height:0 20px;list-style:none;margin:0 auto\n}\n.test-nav li{position:relative;display:block;cursor:pointer;width:20px;height:20px;margin:0 20px;text-align:center;border:1px solid #656695;background-color:#656695;color:#fff;border-radius:20px;transition:all .3s ease-in-out\n}\n.test-nav li:after{width:40px;position:absolute;content:\"\";display:block;height:3px;background-color:#656695\n}\n.test-nav li:before{width:40px;position:absolute;content:\"\";display:block;height:3px;background-color:#656695\n}\n.test-nav li:before{top:9px;left:-41px\n}\n.test-nav li:after{top:9px;right:-41px\n}\n.test-nav li:first-child{margin-left:0\n}\n.test-nav li:first-child:before{display:none\n}\n.test-nav li:last-child{margin-right:0\n}\n.test-nav li:last-child:after{display:none\n}\n.test-nav li.active{background-color:#fff;color:#656695\n}\n.test-info{max-width:100%;padding-top:20px;padding-right:40px;display:flex;justify-content:flex-end;align-items:center\n}\n.test-info li{display:block;position:relative;margin-left:50px;font-size:1.2rem\n}\n.test-info li img{position:absolute;top:-10px;left:-5px\n}\n.time-limit img{width:40px\n}\n.time-limit{padding-left:0\n}\n.test-info .question{opacity:1;color:#092e64\n}\n.test-info .question span:last-child{opacity:.5;color:#656695\n}\n@media screen and (max-width:812px){\n.exec-page>div{width:100%\n}\n.exec-page .content{width:100%;padding-top:calc(4.16667vh * 3);margin:0\n}\n.exec-page .menu{display:none\n}\n.new-test-nav{padding:10px\n}\n.test-info{width:100%;padding-right:0;max-width:none;display:flex;justify-content:space-between\n}\n.new-test-nav li:last-child{padding:0;font-size:.8rem\n}\n.test-info li{margin:0\n}\n.test-info li img{max-width:25px;left:-25px\n}\n.test-info .question{width:50%;font-size:.9rem\n}\n.variants .variant-item label{font-size:.8rem\n}\n.test-nav{opacity:0;bottom:-100%\n}\n.mobile-nav{position:fixed;bottom:0;left:0;padding-bottom:10px;width:100%;display:flex;justify-content:space-around\n}\n.mobile-nav .back,.mobile-nav .forward{width:30px;height:30px;display:block;background-color:#fff;border:none\n}\n.send{display:block\n}\n.mobile-nav .back{background-image:url(" + escape(__webpack_require__(104)) + ")\n}\n.mobile-nav .forward{background-image:url(" + escape(__webpack_require__(105)) + ")\n}\n}", "", {"version":3,"sources":["/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/css/variables.css","/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/vue-comp/src/vue-comp/exec.vue"],"names":[],"mappings":";AAAA,MACI,kBAAqB,eACL,eACC;CAapB;ACuTD,YACA,YAAA;CACA;AAEA,WACA,WAAA,YACA;CACA;AAEA,oBACA,gCAAA,iCACA,2BACA,YACA;CACA;AAEA,eACA,YAAA;CACA;AAEA,aACA,WAAA,gCACA,aACA;CACA;AAEA,wBACA,iBAAA;CACA;AAEA,YACA,iBAAA;CACA;AAEA,kBACA,kBAAA,SACA,aACA,cACA,WACA,UACA,WACA,wBACA;CACA;AAGA,SACA,iBAAA;CACA;AAEA,UACA,eAAA,oBAEA,2BAEA,YACA,SACA,QACA,qBACA;CACA;AAEA,uBAVA,aAAA,sBAEA;CAgBA;AARA,aACA,kBAAA,2BAGA,kBACA,gBACA,aACA;CACA;AAEA,aACA,kBAAA,cACA,eACA,WACA,YACA,cACA,kBACA,yBACA,yBACA,WACA,mBACA,8BAGA;CACA;AAEA,mBAEA,WAAA,kBACA,WACA,cACA,WACA,wBACA;CACA;AARA,oBAEA,WAAA,kBACA,WACA,cACA,WACA,wBACA;CACA;AAEA,oBACA,QAAA,UACA;CACA;AAEA,mBACA,QAAA,WACA;CACA;AAEA,yBACA,aAAA;CACA;AAEA,gCACA,YAAA;CACA;AAEA,wBACA,cAAA;CACA;AAEA,8BACA,YAAA;CACA;AAEA,oBACA,sBAAA,aACA;CACA;AAEA,WACA,eAAA,iBACA,mBACA,aACA,yBACA,kBACA;CAEA;AAEA,cACA,cAAA,kBACA,iBACA,gBACA;CAEA;AAEA,kBACA,kBAAA,UACA,SACA;CACA;AAEA,gBACA,UAAA;CACA;AAEA,YACA,cAAA;CACA;AACA,qBACA,UAAA,aACA;CACA;AAEA,qCACA,WAAA,aACA;CACA;AAEA;AAEA,eACA,UAAA;CACA;AAEA,oBACA,WAAA,gCACA,QACA;CACA;AAEA,iBACA,YAAA;CACA;AAEA,cACA,YAAA;CACA;AAEA,WACA,WAAA,gBACA,eACA,aACA,6BACA;CACA;AAEA,4BACA,UAAA,eACA;CACA;AAEA,cACA,QAAA;CACA;AAEA,kBACA,eAAA,UACA;CACA;AAEA,qBACA,UAAA,eACA;CACA;AAEA,8BACA,eAAA;CACA;AAEA,UACA,UAAA,YACA;CACA;AAEA,YACA,eAAA,SACA,OACA,oBACA,WACA,aACA,4BACA;CACA;AAEA,uCAEA,WAAA,YACA,cACA,sBACA,WACA;CACA;AAEA,MACA,aAAA;CACA;AAIA,kBAEA,8CAAA;CACA;AAEA,qBACA,8CAAA;CACA;CACA","file":"exec.vue","sourcesContent":[":root {\n    font-family: 'Marta';\n    font-size: 16px;\n    line-height: 1.4;\n    --blue: #092E64;\n    --purple: #656695;\n    --darkpurple: #313149;\n    --marine: #3493A8;\n    --yellow: #EFDA7B;\n    --green: #9DBE87;\n    --red: #c74545;\n    --background: #e6e5e5;\n    --column: calc(100vw / 24);\n    --row: calc(100vh / 12);\n    --column-mobile: calc(100vw / 12);\n    --row-mobile: calc(100vh / 24);\n}\n","<template lang=\"html\">\n\n    <div class=\"exec-page\">\n\n        <div v-if=\"!loaded\">\n\n            <loading></loading>\n\n        </div>\n\n        <div v-else>\n\n            <test-menu\n                :testname=\"test.test_name\"\n                :testdescription=\"test.test_description\"\n                @send-test=\"sendTestHander(false)\"\n            >\n\n            </test-menu>\n\n            <section class=\"content\">\n\n                <nav class=\"new-test-nav\">\n                    <ul class=\"test-info\">\n                        <li class=\"question\">Вы ответили на <span>{{answers.length}}</span><span>/</span><span>{{questions.length}}</span></li>\n                        <li class=\"time-limit\" v-if=\"timeLimit\"><img src=\"img/stopwatch.svg\" alt=\"\">{{timeLeft}}:00</li>\n                    </ul>\n                </nav>\n\n                    <div v-if=\"!authorized\" class=\"warning\">\n                        <loading></loading>\n                        <p> Данный тест доступен только зарегистрированным пользователям. Сейчас вы будете перенаправленны на страницу авторизации и регистрации. После входа в систему вы автоматически вернетесь к прохождению теста</p>\n                    </div>\n\n                    <div v-else>\n\n                        <h2 class=\"test-title\">{{test.questions[userProgress.currentQstId].question_description}}</h2>\n                        <p class=\"test-descr\">{{questionDescr}}</p>\n                        <variants\n                            :type=\"currentQstType\"\n                            :questions=\"questions\"\n                            :answersarr=\"answers\"\n                            :currentqst=\"userProgress.currentQstId\"\n                            @update-answer=\"updateAnswerHandler\"\n\n                        ></variants>\n\n                        <div class=\"test-nav\">\n                            <ul>\n                                <li\n                                v-for=\"n in test.questions.length\"\n                                :id=\"'qst_'+n\"\n                                :class=\"{active: n==1}\"\n                                @click=\"changeQst\"\n                                >{{n}}</li>\n                            </ul>\n                        </div>\n                    </div>\n\n                    <div class=\"mobile-nav\">\n                        <button class=\"back\" @click=\"mobileNavQst(-1)\"></button>\n                        <button class=\"send\" @click=\"sendTestHander(false)\">Готово</button>\n                        <button class=\"forward\" @click=\"mobileNavQst(1)\"></button>\n                    </div>\n\n                    <pop-up v-if=\"popUp\"\n                        :results=\"testResults\"\n                        :timestart=\"timeStart\"\n                    ></pop-up>\n\n            </section>\n\n        </div>\n\n    </div>\n\n</template>\n\n<script>\n\nimport testMenu from './interface/test-menu.vue';\nimport loadingElem from './interface/loading.vue';\nimport variantsElem from './interface/variants.vue';\nimport popUpExec from './interface/pop-up-exec.vue';\nimport axios from './../../node_modules/axios/dist/axios.js';\nimport Auth from './../js/auth.js';\n\nexport default {\n\n    components: {\n        'test-menu': testMenu,\n        'loading': loadingElem,\n        'variants': variantsElem,\n        'pop-up': popUpExec\n    },\n\n    // Когда компонент создан, получаем тест, проверяем, аторизацию пользвателя\n    created() {\n        this.fetchData();\n    },\n\n    data() {\n        return {\n\n            test: null,\n            questions: null,\n            authorized: false,\n            loaded: false,\n            userProgress: {\n                currentQstId: 0\n            },\n            currentQstType: 1,\n            answers: [],\n            timeStart: 0,\n            time: 60,\n            timeLimit: false,\n            timeLeft: 60,\n            popUp: false,\n            testResults: {}\n        }\n    },\n\n    computed: {\n\n        //Описание вопроса в зависимости от типа\n        questionDescr() {\n            switch (+this.questions[this.userProgress.currentQstId].question_type_id) {\n                case 1:\n                    return 'Выберите один вариант ответа';\n                    break;\n                case 2:\n                    return 'Выберите несколько вариантов';\n                    break;\n                case 3:\n                    return 'Напишите вариант ответа';\n                    break;\n                default:\n\n            }\n        }\n    },\n\n    methods: {\n        //Получаем данные с сервер, сверяем авторизацию пользователя и возможность анонимного прохождения\n        fetchData() {\n            let query = \"?\" + atob(decodeURIComponent(window.location.search.slice(1)));\n            Auth.checkUser()\n            .then( (res) => {\n                let auth = res;\n                //Если тест уже есть в localStorage берем данные от туда, в противном случае, загружаем их с сервера\n                axios.get(`php/getexectest.php${query}`)\n                .then( (res) => {\n                    console.log(res);\n                    let date = new Date();\n                    let testId = +query.slice(9);\n                    let testData = JSON.parse(localStorage.getItem('current_test'));\n\n                    // Устанавливани все параметры теста\n                    this.test = res.data.test;\n                    this.questions = res.data.test.questions;\n\n                    this.timeStart = testData && +testData.test_db_id == testId? testData.time_start : date.getTime();\n                    this.answers = testData && +testData.test_db_id == testId? testData.answers : [];\n                    this.currentQstType = testData && +testData.test_db_id == testId? testData.currentQstType : +res.data.test.questions[0].question_type_id;\n                    this.currentQstId = testData && +testData.test_db_id == testId? testData.currentQstId : 0;\n                    this.loaded = true;\n\n                    setTimeout( () => {\n                        let id = this.currentQstId + 1;\n                        let elem = document.getElementById(`qst_${id}`);\n                        elem.click();\n                    }, 0);\n\n                    if(+res.data.test.test_anonym == 0 && !auth) {\n                        console.log('Просим авторизоваться');\n                        this.authorized = false;\n                        window.localStorage.setItem('query', window.location.search.slice(1));\n                        setTimeout( () => {\n                            this.$router.replace('/auth');\n                        },8000)\n                    }\n                    else {\n                        console.log('Показываем тест');\n                        this.authorized = true;\n\n                        // Если тест на время, то будет отсчитывать время\n                        if(+res.data.test.test_time > 0) {\n                            console.log('Это тест на время');\n                            this.timeLimit = true;\n                            this.time = res.data.test.test_time;\n                            let date = new Date(this.timeStart);\n\n                            //Проверка времени\n                            let timeStart = date.getMinutes();\n                            let interval = setInterval( () => {\n                                let newDate = new Date();\n                                let timeNow = newDate.getMinutes();\n                                let timeDifference = timeNow - timeStart;\n                                let minutes = new Date(timeDifference * 1000);\n                                this.timeLeft = this.time - timeDifference;\n                                if(this.timeLeft <= 0) {\n                                    console.log('Время теста истекло, ваши данные отправлены на сервер');\n                                    window.alert('Время теста истекло, ваши данные отправлены на сервер');\n                                    this.sendTestHander(true);\n                                    clearInterval(interval);\n                                }\n\n                            }, 1000);\n                        }\n                    }\n                })\n                .catch( (err) => console.log(err));\n\n            })\n            .catch( (err) => console.log(err));\n        },\n\n        //Навигация по вопросам\n        changeQst(e) {\n            let elemId = e.target.id;\n            let children = e.target.parentElement.children;\n            e.target.classList.contains('active') ? false : e.target.classList.add('active');\n            for(let i = 0; i < children.length; i++) {\n                if(children[i].id !== elemId) {\n                    children[i].classList.contains('active') ? children[i].classList.remove('active') : false;\n                }\n            }\n            this.userProgress.currentQstId = +e.target.id.slice(4) - 1;\n            this.currentQstType = +this.test.questions[this.userProgress.currentQstId].question_type_id;\n            this.saveLocalStorage();\n            console.log(this.answers);\n        },\n\n        mobileNavQst(ind) {\n\n            if(ind < 0) {\n                let elem = document.querySelector('.active').previousSibling;\n                if(elem) {\n                    elem.click();\n                }\n            }\n            else {\n                let elem = document.querySelector('.active').nextSibling;\n                if(elem) {\n                    elem.click();\n                }\n            }\n        },\n\n        //Обновляем информацию ответов и сохраняем объект теста в localStorage\n        updateAnswerHandler(answers) {\n            this.answers = answers;\n            this.saveLocalStorage();\n        },\n\n        saveLocalStorage() {\n            let date = new Date();\n            let test = {\n                test_db_id: this.test.test_id,\n                test: this.test,\n                anonym:  this.test.test_anonym,\n                token: this.test.token ? this.test.token : btoa(date.getTime()),\n                answers: this.answers,\n                time_start: this.timeStart,\n                currentQstType: this.currentQstType,\n                currentQstId: this.userProgress.currentQstId\n            };\n\n            localStorage.setItem('current_test', JSON.stringify(test));\n        },\n\n        // Отправляем тест\n        sendTestHander(autoEnd) {\n            localStorage.removeItem('current_test');\n            let date = new Date();\n            let test = {\n                test_db_id: this.test.test_id,\n                anonym:  this.test.test_anonym,\n                token: this.token ? this.token : btoa(date.getTime()),\n                answers: this.answers\n            };\n            console.log('test');\n            console.log(test);\n            // return test;\n            if(!autoEnd && window.confirm('Вы готовы отправить ответы на проверку?')) {\n                axios.post('php/saveexectest.php', test)\n                .then( (res) => {\n                    console.log(res);\n                    this.testResults = res.data;\n                    this.popUp = true;\n                })\n                .catch( (err) => {\n                    console.log(err);\n                });\n            }\n            else {\n                axios.post('php/saveexectest.php', test)\n                .then( (res) => {\n                    console.log(res);\n                    this.testResults = res.data;\n                    this.popUp = true;\n                })\n                .catch( (err) => {\n                    console.log(err);\n                });\n            }\n        }\n    },\n\n    // Перед тем, как пользователь попадет на страницу, проверим, установлено ли id вопроса\n    beforeRouteEnter (to, from, next) {\n        let check = decodeURIComponent(window.location.search.slice(1));\n        if(/test_id/.test(atob(check))) {\n            next();\n        }\n        else {\n            window.location.pathname = '/tester';\n        }\n    }\n\n}\n\n</script>\n\n<style lang=\"css\">\n\n@import './../css/variables.css';\n\n    .mobile-nav {\n        display: none;\n    }\n\n    .exec-page{\n        width: 100%;\n        display: flex;\n    }\n\n    .exec-page .content {\n        margin-left: calc(var(--column) * 2);\n        margin-right: calc(var(--column) * 2);\n        width: calc(var(--column) * 16);\n        display: flex;\n    }\n\n    .exec-page > div {\n        display: flex;\n    }\n\n    .content > div {\n        width: 100%;\n        padding-top: calc(var(--row) * 2);\n        color: var(--blue);\n    }\n\n    .test-title, .test-descr {\n        text-align: center;\n    }\n\n    .test-title {\n        position: relative;\n    }\n\n    .test-title:after {\n        position: absolute;\n        left: 30%;\n        bottom: -10px;\n        display: block;\n        content: '';\n        width: 40%;\n        height: 3px;\n        background-color: var(--purple);\n    }\n\n\n    .warning {\n        align-self: center;\n    }\n\n    .test-nav {\n        position: fixed;\n        display: flex;\n        padding-bottom: 40px;\n        justify-content: center;\n        width: calc(var(--column) * 20);\n        z-index: 102;\n        bottom: 0;\n        right: 0;\n        background-color: #fff;\n    }\n\n    .test-nav ul {\n        position: relative;\n        display: flex;\n        justify-content: center;\n        width: calc(var(--column) * 16);\n        min-height: 0 20px;\n        list-style: none;\n        margin: 0 auto;\n    }\n\n    .test-nav li {\n        position: relative;\n        display: block;\n        cursor: pointer;\n        width: 20px;\n        height: 20px;\n        margin: 0px 20px;\n        text-align: center;\n        border: 1px solid var(--purple);\n        background-color: var(--purple);\n        color: #fff;\n        border-radius: 20px;\n        -webkit-transition: all .3s ease-in-out;\n        -o-transition: all .3s ease-in-out;\n        transition: all .3s ease-in-out;\n    }\n\n    .test-nav li:before,\n    .test-nav li:after {\n        width: 40px;\n        position: absolute;\n        content: '';\n        display: block;\n        height: 3px;\n        background-color: var(--purple);\n    }\n\n    .test-nav li:before {\n        top: 9px;\n        left: -41px;\n    }\n\n    .test-nav li:after {\n        top: 9px;\n        right: -41px;\n    }\n\n    .test-nav li:first-child {\n        margin-left: 0;\n    }\n\n    .test-nav li:first-child:before {\n        display: none;\n    }\n\n    .test-nav li:last-child {\n        margin-right: 0;\n    }\n\n    .test-nav li:last-child:after {\n        display: none;\n    }\n\n    .test-nav li.active {\n        background-color: #fff;\n        color: var(--purple);\n    }\n\n    .test-info {\n        max-width: 100%;\n        padding-top: 20px;\n        padding-right: 40px;\n        display: flex;\n        justify-content: flex-end;\n        align-items: center;\n\n    }\n\n    .test-info li {\n        display: block;\n        position: relative;\n        margin-left: 50px;\n        font-size: 1.2rem;\n\n    }\n\n    .test-info li img {\n        position: absolute;\n        top: -10px;\n        left: -5px;\n    }\n\n    .time-limit img {\n        width: 40px;\n    }\n\n    .time-limit {\n        padding-left: 0px;\n    }\n    .test-info .question {\n        opacity: 1;\n        color: var(--blue);\n    }\n\n    .test-info .question span:last-child {\n        opacity: .5;\n        color: var(--purple);\n    }\n\n    @media screen and (max-width: 812px) {\n\n        .exec-page > div {\n            width: 100%;\n        }\n\n        .exec-page .content {\n            width: 100%;\n            padding-top: calc(var(--row-mobile) * 3);\n            margin: 0;\n        }\n\n        .exec-page .menu{\n            display: none;\n        }\n\n        .new-test-nav {\n            padding: 10px;\n        }\n\n        .test-info {\n            width: 100%;\n            padding-right: 0px;\n            max-width: none;\n            display: flex;\n            justify-content: space-between;\n        }\n\n        .new-test-nav li:last-child {\n            padding: 0px;\n            font-size: .8rem;\n        }\n\n        .test-info li {\n            margin: 0;\n        }\n\n        .test-info li img {\n            max-width: 25px;\n            left: -25px;\n        }\n\n        .test-info .question {\n            width: 50%;\n            font-size: .9rem;\n        }\n\n        .variants .variant-item label{\n            font-size: .8rem;\n        }\n\n        .test-nav {\n            opacity: 0;\n            bottom: -100%;\n        }\n\n        .mobile-nav {\n            position: fixed;\n            bottom: 0;\n            left: 0;\n            padding-bottom: 10px;\n            width: 100%;\n            display: flex;\n            justify-content: space-around;\n        }\n\n        .mobile-nav .forward,\n        .mobile-nav .back {\n            width: 30px;\n            height: 30px;\n            display: block;\n            background-color: #fff;\n            border: none;\n        }\n\n        .send {\n            display: block;\n        }\n\n\n\n        .mobile-nav .back {\n\n            background-image: url('./../img/arrow-right.svg');\n        }\n\n        .mobile-nav .forward {\n            background-image: url('./../img/arrow-left.svg');\n        }\n    }\n\n\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 104 */
/***/ (function(module, exports) {

module.exports = "img/../img/arrow-right.svg";

/***/ }),
/* 105 */
/***/ (function(module, exports) {

module.exports = "img/../img/arrow-left.svg";

/***/ }),
/* 106 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_test_menu_vue__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_test_menu_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_test_menu_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_test_menu_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_test_menu_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6fc53ca4_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_test_menu_vue__ = __webpack_require__(109);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(107)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_test_menu_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6fc53ca4_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_test_menu_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/vue-comp/interface/test-menu.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6fc53ca4", Component.options)
  } else {
    hotAPI.reload("data-v-6fc53ca4", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(108);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("a6eadd52", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6fc53ca4\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./test-menu.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6fc53ca4\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./test-menu.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n:root{font-family:Marta;font-size:16px;line-height:1.4\n}\n.menu{width:calc(4.16667vw * 4);height:100vh\n}\n.side-menu-test{width:calc(4.16667vw * 4);height:100vh\n}\n.side-menu-test{z-index:102;position:fixed;top:0;left:0;background-color:#656695;color:#fff\n}\n.side-menu-test h2{padding:20px 10px;text-align:center;position:relative\n}\n.side-menu-test h2:after{position:absolute;left:25%;width:50%;height:3px;bottom:-10px;display:block;content:\"\";background-color:#fff\n}\n.side-menu-test p{padding:20px 10px;text-align:center\n}\n.side-menu-test button{font-family:marta,sans-serif;position:absolute;width:40%;left:30%;bottom:40px;background-color:#656695;border:3px solid #fff;padding:10px;color:#fff\n}", "", {"version":3,"sources":["/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/css/variables.css","/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/vue-comp/interface/src/vue-comp/interface/test-menu.vue"],"names":[],"mappings":";AAAA,MACI,kBAAqB,eACL,eACC;CAapB;AC6BD,MAJA,0BAAA,YACA;CAYA;AATA,gBAJA,0BAAA,YACA;CAYA;AATA,gBACA,YAAA,eACA,MACA,OACA,yBAGA,UACA;CACA;AAEA,mBACA,kBAAA,kBACA,iBACA;CACA;AAEA,yBACA,kBAAA,SACA,UACA,WACA,aACA,cACA,WACA,qBACA;CAEA;AAEA,kBACA,kBAAA,iBACA;CACA;AAEA,uBACA,6BAAA,kBACA,UACA,SACA,YACA,yBACA,sBACA,aACA,UACA;CACA","file":"test-menu.vue","sourcesContent":[":root {\n    font-family: 'Marta';\n    font-size: 16px;\n    line-height: 1.4;\n    --blue: #092E64;\n    --purple: #656695;\n    --darkpurple: #313149;\n    --marine: #3493A8;\n    --yellow: #EFDA7B;\n    --green: #9DBE87;\n    --red: #c74545;\n    --background: #e6e5e5;\n    --column: calc(100vw / 24);\n    --row: calc(100vh / 12);\n    --column-mobile: calc(100vw / 12);\n    --row-mobile: calc(100vh / 24);\n}\n","<template lang=\"html\">\n\n    <div class=\"menu\">\n\n        <aside class=\"side-menu-test\">\n\n            <h2>{{title}}</h2>\n            <p>{{description}}</p>\n            <button @click=\"sendTest\" type=\"button\" name=\"button\">Готово</button>\n\n\n        </aside>\n    </div>\n\n</template>\n\n<script>\nexport default {\n\n    props: ['testname', 'testdescription'],\n\n    data() {\n        return {\n            title: this.testname,\n            description: this.testdescription\n        }\n    },\n\n    methods: {\n        sendTest() {\n            this.$emit('send-test');\n        }\n    }\n\n}\n</script>\n\n<style lang=\"css\">\n\n@import './../../css/variables.css';\n\n    .menu {\n        width: calc(var(--column) * 4);\n        height: 100vh;\n    }\n\n    .side-menu-test {\n        z-index: 102;\n        position: fixed;\n        top: 0;\n        left: 0;\n        width: calc(var(--column) * 4);\n        height: 100vh;\n        background-color: var(--purple);\n        color: #fff;\n    }\n\n    .side-menu-test h2 {\n        padding: 20px 10px;\n        text-align: center;\n        position: relative;\n    }\n\n    .side-menu-test h2:after {\n        position: absolute;\n        left: 25%;\n        width: 50%;\n        height: 3px;\n        bottom: -10px;\n        display: block;\n        content: '';\n        background-color: #fff;\n\n    }\n\n    .side-menu-test p{\n        padding: 20px 10px;\n        text-align: center;\n    }\n\n    .side-menu-test button {\n        font-family: 'marta', sans-serif;\n        position: absolute;\n        width: 40%;\n        left: 30%;\n        bottom: 40px;\n        background-color: var(--purple);\n        border: 3px solid #fff;\n        padding: 10px;\n        color: #fff;\n    }\n\n\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 109 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "menu" }, [
    _c("aside", { staticClass: "side-menu-test" }, [
      _c("h2", [_vm._v(_vm._s(_vm.title))]),
      _vm._v(" "),
      _c("p", [_vm._v(_vm._s(_vm.description))]),
      _vm._v(" "),
      _c(
        "button",
        {
          attrs: { type: "button", name: "button" },
          on: { click: _vm.sendTest }
        },
        [_vm._v("Готово")]
      )
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-6fc53ca4", esExports)
  }
}

/***/ }),
/* 110 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_variants_vue__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_variants_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_variants_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_variants_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_variants_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_98e75ed8_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_variants_vue__ = __webpack_require__(113);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(111)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_variants_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_98e75ed8_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_variants_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/vue-comp/interface/variants.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-98e75ed8", Component.options)
  } else {
    hotAPI.reload("data-v-98e75ed8", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(112);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("0362b5c5", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-98e75ed8\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./variants.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-98e75ed8\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./variants.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n:root{font-family:Marta;font-size:16px;line-height:1.4\n}\n.variant-item input[type=checkbox],.variant-item input[type=radio]{display:none\n}\n.variant-item label{cursor:pointer;text-decoration:none;color:#656695;opacity:.5;transition:all .3s ease-in-out\n}\n.variant-item input[type=checkbox]:checked~label{opacity:1;text-decoration-color:#656695;text-decoration:underline\n}\n.variant-item input[type=radio]:checked~label{opacity:1;text-decoration-color:#656695;text-decoration:underline\n}\n.variant-item{width:100%;display:flex;flex-wrap:wrap;justify-content:space-between\n}\n.variant-item>div{width:50%;text-align:center;margin:20px 0\n}\n.variant-item label{font-size:1.3rem\n}\n.variant-item .variant-item__string{display:block;width:90%;margin:20px auto;text-align:center;border:none;border-bottom:1px solid #092e64;font-size:1.3rem\n}", "", {"version":3,"sources":["/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/css/variables.css","/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/vue-comp/interface/src/vue-comp/interface/variants.vue"],"names":[],"mappings":";AAAA,MACI,kBAAqB,eACL,eACC;CAapB;ACuJD,mEAEA,YAAA;CACA;AAEA,oBACA,eAAA,qBACA,cACA,WACA,8BAGA;CACA;AAEA,iDAEA,UAAA,8BACA,yBACA;CACA;AALA,8CAEA,UAAA,8BACA,yBACA;CACA;AAEA,cACA,WAAA,aACA,eACA,6BACA;CACA;AAEA,kBACA,UAAA,kBACA,aACA;CACA;AAEA,oBACA,gBAAA;CACA;AAEA,oCACA,cAAA,UACA,iBACA,kBACA,YACA,gCACA,gBACA;CACA","file":"variants.vue","sourcesContent":[":root {\n    font-family: 'Marta';\n    font-size: 16px;\n    line-height: 1.4;\n    --blue: #092E64;\n    --purple: #656695;\n    --darkpurple: #313149;\n    --marine: #3493A8;\n    --yellow: #EFDA7B;\n    --green: #9DBE87;\n    --red: #c74545;\n    --background: #e6e5e5;\n    --column: calc(100vw / 24);\n    --row: calc(100vh / 12);\n    --column-mobile: calc(100vw / 12);\n    --row-mobile: calc(100vh / 24);\n}\n","<template lang=\"html\">\n\n<div class=\"variants\">\n\n    <div class=\"variant-item\"\n        v-if=\"qstType == 1\"\n    >\n        <div v-for=\"variant in qstVars\" :key=\"variant.var_bd_id\">\n            <input :value=\"variant.question_client_id\" :data-questionid=\"variant.question_db_id\"  @change=\"updateAnswer\" type=\"radio\" :name=\"'single_var_'+variant.question_db_id\" :id=\"variant.question_client_id\">\n            <label :for=\"variant.question_client_id\">{{variant.var_text}}</label>\n        </div>\n    </div>\n\n    <div class=\"variant-item\"\n        v-else-if=\"qstType == 2\"\n    >\n        <div v-for=\"variant in qstVars\"\n        :key=\"variant.var_bd_id\">\n            <input :value=\"variant.question_client_id\" :data-questionid=\"variant.question_db_id\" @change=\"updateAnswer\" type=\"checkbox\" :name=\"'multiple_var_'+variant.question_db_id\" :id=\"variant.question_client_id\">\n            <label :for=\"variant.question_client_id\">{{variant.var_text}}</label>\n        </div>\n    </div>\n\n    <div v-else class=\"variant-item\">\n        <input :data-questionid=\"qstId\" @change=\"updateAnswer\" class=\"variant-item__string\" type=\"text\" placeholder=\"Напишите ваш ответ\">\n    </div>\n\n\n</div>\n\n\n\n\n\n</template>\n\n<script>\nexport default {\n\n    props: ['type', 'questions', 'currentqst', 'answersarr'],\n\n    data() {\n        return {\n            qstType: this.type,\n            navId: this.currentqst,\n            qstVars: this.questions[this.currentqst].vars,\n            questionsArr: this.questions,\n            answers: this.answersarr,\n            qstId: undefined\n        }\n    },\n\n    // mounted() {\n    //     this.answers.forEach( (v,i,a) => {\n    //         let dbIndex = v.questionDbId;\n    //         let elements = document.querySelectorAll(`input[type=\"checkbox\"][data-questionid=\"${dbIndex}\"]`) || document.querySelectorAll(`input[type=\"radio\"][data-questionid=\"${dbIndex}\"]`);\n    //         console.log(elements);\n    //     });\n    // },\n\n    methods: {\n\n        getMultipleAnswers(id) {\n            let answer = '';\n            let vars = document.querySelectorAll(`input[name=\"multiple_var_${id}\"]`);\n            for(let i = 0; i < vars.length; i++) {\n                if(vars[i].checked) {\n                    answer.length == 0 ? answer += vars[i].value : answer += (',' + vars[i].value);\n                }\n            }\n            return answer;\n        },\n\n        // Обновляем информацию о вопросе\n        updateAnswer(e) {\n            let check = true;\n            let answer = {\n                answer: this.qstType !== 2 ? e.target.value : this.getMultipleAnswers(+e.target.getAttribute('data-questionid')),\n                questionDbId: +e.target.getAttribute('data-questionid')\n            };\n            this.answers.forEach( (v,i,a) => {\n                if(v.questionDbId == answer.questionDbId) {\n                    a[i] = answer;\n                    check = false;\n                }\n            });\n            check ? this.answers.push(answer) : false;\n            this.$emit('update-answer', this.answers);\n        },\n\n        //Устанавливани значение чекд в зависимости от типа вопроса\n        updateInputs() {\n            switch (this.qstType) {\n                case 1:\n                    setTimeout( () => {\n                        var elements;\n                        var answer;\n                        this.answers.forEach( (v, i, a) => {\n                            if(document.querySelectorAll([`input[type=\"radio\"][data-questionid=\"${v.questionDbId}\"]`]).length > 0) {\n                                elements = document.querySelectorAll([`input[type=\"radio\"][data-questionid=\"${v.questionDbId}\"]`]);\n                                answer = v.answer;\n                            }\n                        });\n                        if(elements && elements.length > 0) {\n                            for(let i = 0; i < elements.length; i++) {\n                                elements[i].value == answer ? elements[i].checked = true : elements[i].checked = false;\n                            }\n                        }\n                    } ,100)\n                    break;\n                    case 2:\n                        setTimeout( () => {\n                            var elements;\n                            var answer;\n                            this.answers.forEach( (v, i, a) => {\n                                if(document.querySelectorAll([`input[type=\"checkbox\"][data-questionid=\"${v.questionDbId}\"]`]).length > 0) {\n                                    elements = document.querySelectorAll([`input[type=\"checkbox\"][data-questionid=\"${v.questionDbId}\"]`]);\n                                    answer = v.answer;\n                                }\n                            });\n                            if(elements && elements.length > 0) {\n                                for(let i = 0; i < elements.length; i++) {\n                                     answer.indexOf(elements[i].value) >= 0 ? elements[i].checked = true : elements[i].checked = false;\n                                }\n                            }\n                        } ,100)\n                        break;\n\n                        case 3:\n                            setTimeout( () => {\n                                var elements;\n                                var answer;\n                                this.answers.forEach( (v, i, a) => {\n                                    if(document.querySelectorAll(`input[type=\"text\"][data-questionid=\"${v.questionDbId}\"]`).length > 0) {\n                                        elements = document.querySelectorAll(`input[type=\"text\"][data-questionid=\"${v.questionDbId}\"]`);\n                                        elements[0].value = v.answer;\n                                    }\n                                });\n                            } ,100)\n                            break;\n                default:\n\n            }\n        }\n    },\n\n\n    // эта функция запускается при любом изменении навинации\n    watch: {\n        type: function (data) {\n                this.qstType = data;\n                this.updateInputs();\n        },\n        currentqst: function (data) {\n            this.qstVars = this.questionsArr[data].vars;\n            this.qstId = this.questionsArr[data].question_id;\n            this.updateInputs();\n        }\n    }\n\n}\n\n</script>\n\n<style lang=\"css\">\n\n    @import './../../css/variables.css';\n\n    .variant-item input[type=\"checkbox\"],\n    .variant-item input[type=\"radio\"] {\n        display: none;\n    }\n\n    .variant-item label {\n        cursor: pointer;\n        text-decoration: none;\n        color: var(--purple);\n        opacity: .5;\n        -webkit-transition: all .3s ease-in-out;\n        -o-transition: all .3s ease-in-out;\n        transition: all .3s ease-in-out;\n    }\n\n    .variant-item input[type=\"checkbox\"]:checked ~ label,\n    .variant-item input[type=\"radio\"]:checked ~ label {\n        opacity: 1;\n        text-decoration-color: var(--purple);\n        text-decoration: underline;\n    }\n\n    .variant-item {\n        width: 100%;\n        display: flex;\n        flex-wrap: wrap;\n        justify-content: space-between;\n    }\n\n    .variant-item > div {\n        width: 50%;\n        text-align: center;\n        margin: 20px 0px;\n    }\n\n    .variant-item label {\n        font-size: 1.3rem;\n    }\n\n    .variant-item .variant-item__string {\n        display: block;\n        width: 90%;\n        margin: 20px auto;\n        text-align: center;\n        border: none;\n        border-bottom: 1px solid var(--blue);\n        font-size: 1.3rem;\n    }\n\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 113 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "variants" }, [
    _vm.qstType == 1
      ? _c(
          "div",
          { staticClass: "variant-item" },
          _vm._l(_vm.qstVars, function(variant) {
            return _c("div", { key: variant.var_bd_id }, [
              _c("input", {
                attrs: {
                  "data-questionid": variant.question_db_id,
                  type: "radio",
                  name: "single_var_" + variant.question_db_id,
                  id: variant.question_client_id
                },
                domProps: { value: variant.question_client_id },
                on: { change: _vm.updateAnswer }
              }),
              _vm._v(" "),
              _c("label", { attrs: { for: variant.question_client_id } }, [
                _vm._v(_vm._s(variant.var_text))
              ])
            ])
          })
        )
      : _vm.qstType == 2
        ? _c(
            "div",
            { staticClass: "variant-item" },
            _vm._l(_vm.qstVars, function(variant) {
              return _c("div", { key: variant.var_bd_id }, [
                _c("input", {
                  attrs: {
                    "data-questionid": variant.question_db_id,
                    type: "checkbox",
                    name: "multiple_var_" + variant.question_db_id,
                    id: variant.question_client_id
                  },
                  domProps: { value: variant.question_client_id },
                  on: { change: _vm.updateAnswer }
                }),
                _vm._v(" "),
                _c("label", { attrs: { for: variant.question_client_id } }, [
                  _vm._v(_vm._s(variant.var_text))
                ])
              ])
            })
          )
        : _c("div", { staticClass: "variant-item" }, [
            _c("input", {
              staticClass: "variant-item__string",
              attrs: {
                "data-questionid": _vm.qstId,
                type: "text",
                placeholder: "Напишите ваш ответ"
              },
              on: { change: _vm.updateAnswer }
            })
          ])
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-98e75ed8", esExports)
  }
}

/***/ }),
/* 114 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_pop_up_exec_vue__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_pop_up_exec_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_pop_up_exec_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_pop_up_exec_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_pop_up_exec_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_98f7a61e_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_pop_up_exec_vue__ = __webpack_require__(117);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(115)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_pop_up_exec_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_98f7a61e_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_pop_up_exec_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/vue-comp/interface/pop-up-exec.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-98f7a61e", Component.options)
  } else {
    hotAPI.reload("data-v-98f7a61e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(116);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("4ec7bdbe", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-98f7a61e\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./pop-up-exec.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-98f7a61e\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./pop-up-exec.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n:root{font-family:Marta;font-size:16px;line-height:1.4\n}\n.pop-up-exec{left:0;top:0;width:calc(4.16667vw * 15);min-height:100vh;min-width:100vw;background-image:linear-gradient(0deg,#313149,#656695 95%);z-index:200\n}\n.pop-up-exec,.pop-up-exec-container{position:fixed;background-color:#fff\n}\n.pop-up-exec-container{width:50%;min-height:50%;top:25%;left:25%;box-shadow:1px 1px 4px rgba(0,0,0,.1);z-index:202\n}\n.pop-up-info{padding:40px;text-align:center;color:#092e64;margin:20px 0\n}\n.pop-up-info p{font-size:1.2rem;font-weight:700;margin-bottom:20px\n}\n.pop-up-info button{text-align:center;padding:5px;background-color:#fff;border:3px solid #656695;cursor:pointer;font-family:marta,sans-serif;font-weight:700\n}", "", {"version":3,"sources":["/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/css/variables.css","/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/vue-comp/interface/src/vue-comp/interface/pop-up-exec.vue"],"names":[],"mappings":";AAAA,MACI,kBAAqB,eACL,eACC;CAapB;AC2DD,aAEA,OAAA,MACA,2BACA,iBACA,gBACA,2DAEA,WACA;CACA;AAEA,oCAXA,eAAA,qBAMA;CAeA;AAVA,uBACA,UAAA,eACA,QAEA,SACA,sCAGA,WACA;CACA;AAEA,aACA,aAAA,kBACA,cACA,aAIA;CAHA;AAMA,eACA,iBAAA,gBACA,kBACA;CACA;AAEA,oBACA,kBAAA,YACA,sBACA,yBACA,eACA,6BACA,eACA;CACA","file":"pop-up-exec.vue","sourcesContent":[":root {\n    font-family: 'Marta';\n    font-size: 16px;\n    line-height: 1.4;\n    --blue: #092E64;\n    --purple: #656695;\n    --darkpurple: #313149;\n    --marine: #3493A8;\n    --yellow: #EFDA7B;\n    --green: #9DBE87;\n    --red: #c74545;\n    --background: #e6e5e5;\n    --column: calc(100vw / 24);\n    --row: calc(100vh / 12);\n    --column-mobile: calc(100vw / 12);\n    --row-mobile: calc(100vh / 24);\n}\n","<template lang=\"html\">\n\n\n    <div class=\"pop-up-exec\">\n\n        <div class=\"pop-up-exec-container\">\n            <div class=\"pop-up-info\">\n                <h2>Результаты вашейго теста</h2>\n                <p>Количество правильных ответов: {{right}}</p>\n                <p>Количество неправильных ответов: {{wrong}}</p>\n                <!-- <p>Время затраченое на прохождение: {{timeLeft}}</p> -->\n                <button type=\"button\" name=\"button\" @click=\"endTest\">Завершить тестирование</button>\n            </div>\n\n        </div>\n</div>\n\n\n</template>\n\n<script>\nexport default {\n\n    props: ['results', 'timestart'],\n\n    data() {\n        return {\n            res: this.results,\n            time: this.timestart\n        }\n    },\n\n    computed: {\n        right() {\n            let right = 0;\n            this.res.result.answers.forEach( (v,i,a) => {\n                if(v.result) right++;\n            });\n            return right;\n        },\n\n        wrong() {\n            let wrong = 0;\n            this.res.result.answers.forEach( (v,i,a) => {\n                if(!v.result) wrong++;\n            });\n            return wrong;\n        },\n\n        timeLeft() {\n            let end = new Date(+this.res.time_end);\n            let start = new Date(this.time)\n            return end.getMinutes() - start.getMinutes();\n        }\n\n    },\n\n    methods: {\n        endTest() {\n            localStorage.clear();\n            this.$router.replace('/tester');\n        }\n    },\n\n    mounted() {\n        console.log('mounted');\n        console.log(this.res);\n    }\n\n}\n</script>\n\n<style lang=\"css\">\n\n    @import './../../css/variables.css';\n\n    .pop-up-exec {\n        position: fixed;\n        left: 0px;\n        top: 0;\n        width: calc(var(--column) * 15);\n        min-height: 100vh;\n        min-width: 100vw;\n        background-color: #fff;\n        background-image: linear-gradient(to top, var(--darkpurple), var(--purple) 95%);\n        z-index: 200;\n    }\n\n    .pop-up-exec-container {\n        width: 50%;\n        min-height: 50%;\n        position: fixed;\n        top: 25%;\n        left: 25%;\n        background-color: #fff;\n        -webkit-box-shadow: 1px 1px 4px rgba(0,0,0,0.1);\n        box-shadow: 1px 1px 4px rgba(0,0,0,0.1);\n        z-index: 202;\n    }\n\n    .pop-up-info {\n        padding: 40px;\n        text-align: center;\n        color: var(--blue);\n    }\n\n    .pop-up-info {\n        margin: 20px 0px;\n    }\n\n    .pop-up-info p {\n        font-size: 1.2rem;\n        font-weight: bold;\n        margin-bottom: 20px;\n    }\n\n    .pop-up-info button{\n        text-align: center;\n        padding: 5px;\n        background-color: #fff;\n        border: 3px solid var(--purple);\n        cursor: pointer;\n        font-family: 'marta', sans-serif;\n        font-weight: bold;\n    }\n\n    @-webkit-keyframes bgMove {\n        0% { left: -60%; top: -60%;}\n        25% { left: 0%; top: 0%; }\n        50% { left: -0%; top: -50%}\n        100% { left: -50%; top: -50%;}\n    }\n    @-o-keyframes bgMove {\n        0% { left: -60%; top: -60%;}\n        25% { left: 0%; top: 0%; }\n        50% { left: -0%; top: -50%}\n        100% { left: -50%; top: -50%;}\n    }\n    @-moz-keyframes bgMove {\n        0% { left: -60%; top: -60%;}\n        25% { left: 0%; top: 0%; }\n        50% { left: -0%; top: -50%}\n        100% { left: -50%; top: -50%;}\n    }\n    @keyframes bgMove {\n        0% { left: -60%; top: -60%;}\n        25% { left: 0%; top: 0%; }\n        50% { left: -0%; top: -50%}\n        100% { left: -50%; top: -50%;}\n    }\n\n\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 117 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "pop-up-exec" }, [
    _c("div", { staticClass: "pop-up-exec-container" }, [
      _c("div", { staticClass: "pop-up-info" }, [
        _c("h2", [_vm._v("Результаты вашейго теста")]),
        _vm._v(" "),
        _c("p", [
          _vm._v("Количество правильных ответов: " + _vm._s(_vm.right))
        ]),
        _vm._v(" "),
        _c("p", [
          _vm._v("Количество неправильных ответов: " + _vm._s(_vm.wrong))
        ]),
        _vm._v(" "),
        _c(
          "button",
          {
            attrs: { type: "button", name: "button" },
            on: { click: _vm.endTest }
          },
          [_vm._v("Завершить тестирование")]
        )
      ])
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-98f7a61e", esExports)
  }
}

/***/ }),
/* 118 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "exec-page" }, [
    !_vm.loaded
      ? _c("div", [_c("loading")], 1)
      : _c(
          "div",
          [
            _c("test-menu", {
              attrs: {
                testname: _vm.test.test_name,
                testdescription: _vm.test.test_description
              },
              on: {
                "send-test": function($event) {
                  _vm.sendTestHander(false)
                }
              }
            }),
            _vm._v(" "),
            _c(
              "section",
              { staticClass: "content" },
              [
                _c("nav", { staticClass: "new-test-nav" }, [
                  _c("ul", { staticClass: "test-info" }, [
                    _c("li", { staticClass: "question" }, [
                      _vm._v("Вы ответили на "),
                      _c("span", [_vm._v(_vm._s(_vm.answers.length))]),
                      _c("span", [_vm._v("/")]),
                      _c("span", [_vm._v(_vm._s(_vm.questions.length))])
                    ]),
                    _vm._v(" "),
                    _vm.timeLimit
                      ? _c("li", { staticClass: "time-limit" }, [
                          _c("img", {
                            attrs: { src: "img/stopwatch.svg", alt: "" }
                          }),
                          _vm._v(_vm._s(_vm.timeLeft) + ":00")
                        ])
                      : _vm._e()
                  ])
                ]),
                _vm._v(" "),
                !_vm.authorized
                  ? _c(
                      "div",
                      { staticClass: "warning" },
                      [
                        _c("loading"),
                        _vm._v(" "),
                        _c("p", [
                          _vm._v(
                            " Данный тест доступен только зарегистрированным пользователям. Сейчас вы будете перенаправленны на страницу авторизации и регистрации. После входа в систему вы автоматически вернетесь к прохождению теста"
                          )
                        ])
                      ],
                      1
                    )
                  : _c(
                      "div",
                      [
                        _c("h2", { staticClass: "test-title" }, [
                          _vm._v(
                            _vm._s(
                              _vm.test.questions[_vm.userProgress.currentQstId]
                                .question_description
                            )
                          )
                        ]),
                        _vm._v(" "),
                        _c("p", { staticClass: "test-descr" }, [
                          _vm._v(_vm._s(_vm.questionDescr))
                        ]),
                        _vm._v(" "),
                        _c("variants", {
                          attrs: {
                            type: _vm.currentQstType,
                            questions: _vm.questions,
                            answersarr: _vm.answers,
                            currentqst: _vm.userProgress.currentQstId
                          },
                          on: { "update-answer": _vm.updateAnswerHandler }
                        }),
                        _vm._v(" "),
                        _c("div", { staticClass: "test-nav" }, [
                          _c(
                            "ul",
                            _vm._l(_vm.test.questions.length, function(n) {
                              return _c(
                                "li",
                                {
                                  class: { active: n == 1 },
                                  attrs: { id: "qst_" + n },
                                  on: { click: _vm.changeQst }
                                },
                                [_vm._v(_vm._s(n))]
                              )
                            })
                          )
                        ])
                      ],
                      1
                    ),
                _vm._v(" "),
                _c("div", { staticClass: "mobile-nav" }, [
                  _c("button", {
                    staticClass: "back",
                    on: {
                      click: function($event) {
                        _vm.mobileNavQst(-1)
                      }
                    }
                  }),
                  _vm._v(" "),
                  _c(
                    "button",
                    {
                      staticClass: "send",
                      on: {
                        click: function($event) {
                          _vm.sendTestHander(false)
                        }
                      }
                    },
                    [_vm._v("Готово")]
                  ),
                  _vm._v(" "),
                  _c("button", {
                    staticClass: "forward",
                    on: {
                      click: function($event) {
                        _vm.mobileNavQst(1)
                      }
                    }
                  })
                ]),
                _vm._v(" "),
                _vm.popUp
                  ? _c("pop-up", {
                      attrs: {
                        results: _vm.testResults,
                        timestart: _vm.timeStart
                      }
                    })
                  : _vm._e()
              ],
              1
            )
          ],
          1
        )
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-6f51c001", esExports)
  }
}

/***/ }),
/* 119 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_respondents_vue__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_respondents_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_respondents_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_respondents_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_respondents_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_437af6bd_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_respondents_vue__ = __webpack_require__(126);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(120)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_respondents_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_437af6bd_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_respondents_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/vue-comp/respondents.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-437af6bd", Component.options)
  } else {
    hotAPI.reload("data-v-437af6bd", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(121);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("05c94661", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-437af6bd\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./respondents.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-437af6bd\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./respondents.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n:root{font-family:Marta;font-size:16px;line-height:1.4\n}\n.content{margin-left:calc(4.16667vw * 2);margin-right:calc(4.16667vw * 2);width:calc(4.16667vw * 16)\n}\n.respondents-page{width:100%;position:relative;padding-top:calc(8.33333vh * 2);display:flex;background-color:#e6e5e5\n}\n.respondents-search{position:absolute;top:20px;width:calc(4.16667vw * 16);background-color:#e6e5e5;font-size:2rem;border:none;border-bottom:3px solid rgba(0,0,0,.1)\n}\n.respondents-list{width:100%;display:flex;flex-flow:column;justify-content:center\n}\n.resondents-test-item{max-height:calc(8.33333vh * 4);overflow:hidden;position:relative;margin-bottom:40px;padding:20px;box-shadow:1px 1px 4px rgba(0,0,0,.1);cursor:pointer;background-color:#fff;transition:all 1s ease-in-out\n}\n.resondents-test-item__active{max-height:10000px\n}\n.resondents-test-item__hide{max-height:0;overflow:hidden;opacity:0;visibility:hidden;padding:0;margin:0\n}\n.resondents-test-item__active.resondents-test-item__active:after{opacity:0;visibility:hidden;top:none;bottom:0\n}\n.resondents-test-item h2{margin-bottom:20px;color:#092e64\n}\n.resondents-test-item:after{display:block;position:absolute;content:\"\";width:100%;height:100px;top:calc(8.33333vh * 4 - 100px);background-image:linear-gradient(0deg,#fff,hsla(0,0%,100%,.6));transition:all 1s ease-in-out\n}\n.resondents-test-item__show{color:#656695;font-size:.9rem;font-weight:700;position:absolute;padding-left:30px;right:20px;top:20px\n}\n.resondents-test-item__show.active img{transform:rotate(180deg)\n}\n.resondents-test-item__show img{max-width:20px;position:absolute;top:2px;left:0;transform:rotate(0deg);transition:all .5s ease-in-out\n}\n.fade-enter-active,.fade-leave-active{transition:opacity .5s\n}\n.fade-enter,.fade-leave-to{opacity:0\n}\n@media screen and (max-width:812px){\n.respondents-page .content{width:100%;margin:0\n}\n.respondents-list{justify-content:center;align-items:center\n}\n.resondents-test-item{max-height:calc(4.16667vh * 16)\n}\n.resondents-test-item__hide{max-height:0;overflow:hidden;opacity:0;visibility:hidden;padding:0;margin:0\n}\n.resondents-test-item__active{max-height:10000px\n}\n.resondents-test-item__show{right:40%\n}\n.resondents-test-item:after{top:calc(4.16667vh * 16 - 100px)\n}\n.resondents-test-item h2{font-size:1.1rem;padding-top:40px\n}\n}", "", {"version":3,"sources":["/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/css/variables.css","/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/vue-comp/src/vue-comp/respondents.vue"],"names":[],"mappings":";AAAA,MACI,kBAAqB,eACL,eACC;CAapB;ACwJD,SACA,gCAAA,iCACA,0BACA;CACA;AAEA,kBACA,WAAA,kBACA,gCACA,aACA,wBACA;CACA;AAEA,oBACA,kBAAA,SACA,2BACA,yBACA,eACA,YACA,sCACA;CACA;AAEA,kBACA,WAAA,aACA,iBACA,sBACA;CACA;AAEA,sBACA,+BAAA,gBACA,kBACA,mBACA,aACA,sCAEA,eACA,sBACA,6BAGA;CACA;AAEA,8BACA,kBAAA;CAEA;AAEA,4BACA,aAAA,gBACA,UACA,kBACA,UACA,QACA;CACA;AAEA,iEACA,UAAA,kBACA,SACA,QACA;CACA;AAEA,yBACA,mBAAA,aACA;CACA;AAEA,4BACA,cAAA,kBACA,WACA,WACA,aACA,gCACA,+DACA,6BAGA;CACA;AAEA,4BACA,cAAA,gBACA,gBACA,kBACA,kBACA,WACA,QACA;CACA;AAEA,uCACA,wBAAA;CACA;AAEA,gCACA,eAAA,kBACA,QACA,OACA,uBACA,8BAGA;CACA;AAEA,sCACA,sBAAA;CACA;AACA,2BACA,SAAA;CACA;AAEA;AAEA,2BACA,WAAA,QACA;CACA;AAEA,kBACA,uBAAA,kBACA;CACA;AAGA,sBACA,+BAAA;CACA;AAEA,4BACA,aAAA,gBACA,UACA,kBACA,UACA,QACA;CACA;AACA,8BACA,kBAAA;CACA;AAEA,4BACA,SAAA;CACA;AAEA,4BACA,gCAAA;CACA;AAEA,yBACA,iBAAA,gBACA;CACA;CAEA","file":"respondents.vue","sourcesContent":[":root {\n    font-family: 'Marta';\n    font-size: 16px;\n    line-height: 1.4;\n    --blue: #092E64;\n    --purple: #656695;\n    --darkpurple: #313149;\n    --marine: #3493A8;\n    --yellow: #EFDA7B;\n    --green: #9DBE87;\n    --red: #c74545;\n    --background: #e6e5e5;\n    --column: calc(100vw / 24);\n    --row: calc(100vh / 12);\n    --column-mobile: calc(100vw / 12);\n    --row-mobile: calc(100vh / 24);\n}\n","<template lang=\"html\">\n\n    <div class=\"respondents-page\">\n\n        <side-menu></side-menu>\n        <section class=\"content\">\n\n            <transition name=\"fade\">\n              <pop-up\n                  v-if=\"popUp\"\n                  :testtite=\"currentTest.test_name\"\n                  :description=\"currentTest.test_description\"\n                  :imglink=\"currentTest.test_image\"\n                  :anonym=\"currentTest.test_anonym\"\n                  :time=\"currentTest.test_time\"\n                  :status=\"currentTest.test_status\"\n                  :testquestions=\"currentTest.questions\"\n                  :testid=\"currentTest.test_id\"\n                  @close-window=\"closePopUp\"\n              >\n\n              </pop-up>\n          </transition>\n\n            <div class=\"loading\" v-if=\"loading\">\n\n                <loading-indicator></loading-indicator>\n\n            </div>\n\n            <div class=\"respondents-list\">\n\n                <input type=\"text\" class=\"respondents-search\" @input=\"searchTest\" placeholder=\"Введите название теста\">\n\n                <div\n                    class=\"resondents-test-item\"\n                    v-for=\"test in testsArr\"\n                    :key=\"test.test_id\"\n                >\n\n                    <a class=\"resondents-test-item__show\" @click.prevent=\"showListHandler\" href=\"\">список <img src=\"img/arrow-down.svg\" alt=\"\"></a>\n                    <h2>{{test.test_name}}</h2>\n                    <respondent-item\n                        v-for=\"singleTry in test.tries\"\n                        :key=\"singleTry.test_answer_id\"\n                        :result=\"singleTry\"\n                        @show-info=\"showTryInfo\"\n                    >\n                    </respondent-item>\n\n\n                </div>\n\n            </div>\n\n\n        </section>\n\n    </div>\n\n</template>\n\n<script>\n\nimport sideMenu from './side-menu.vue';\nimport loadingIndicator from './interface/loading.vue';\nimport respondentItem from './interface/respondent-item.vue';\nimport popUpElem from './interface/pop-up-test.vue';\nimport axios from './../../node_modules/axios/dist/axios.js';\n\nexport default {\n\n    components: {\n        'side-menu': sideMenu,\n        'loading-indicator': loadingIndicator,\n        'respondent-item': respondentItem,\n        'pop-up': popUpElem\n    },\n\n    data() {\n        return {\n            loading: false,\n            testsArr: null,\n            currentTest: null,\n            popUp: false\n        }\n    },\n\n    methods: {\n        fetchData() {\n            this.loading = true;\n            axios.get('php/getstats.php')\n            .then( (res) => {\n                // console.log(res);\n                this.loading = false;\n                this.testsArr = res.data.tests;\n                // console.log(this.testsArr);\n\n            })\n            .catch( (err) => {\n                this.loading = false;\n                console.log(err);\n            });\n        },\n\n\n        //Поиск по тесту\n        searchTest(e) {\n            console.log(e.target.value);\n            let pattern = new RegExp(e.target.value, 'i');\n            let elemList = document.querySelectorAll('.resondents-test-item h2');\n            for(let i = 0; i < elemList.length; i++) {\n                console.log(elemList[i].innerHTML);\n                console.log(i);\n                if(!pattern.test(elemList[i].innerHTML)) {\n                    elemList[i].parentNode.classList.contains('resondents-test-item__hide') ? false : elemList[i].parentNode.classList.add('resondents-test-item__hide');\n                }\n                else {\n                    elemList[i].parentNode.classList.contains('resondents-test-item__hide') ? elemList[i].parentNode.classList.remove('resondents-test-item__hide') : false;\n                }\n            }\n        },\n\n        //Разворачиваем список респондентов\n        showListHandler(e) {\n            e.target.parentNode.classList.toggle('resondents-test-item__active');\n            e.target.classList.toggle('active');\n        },\n\n        //Показываем всплывающее окно с подробностями о результатах пользователя\n        showTryInfo(id, answers){\n            // console.log(id);\n            // console.log(answers);\n            axios.get(`php/gettest.php?test_id=${id}`)\n            .then( (res) => {\n                let data = res.data.test;\n                data.questions.forEach( (val,ind,arr) => {\n                    answers.forEach( (v,i,a) => {\n                        if(val.question_id === v.question_id) {\n                            data.questions[ind].user_answer = v.user_answer;\n                            data.questions[ind].check_status = v.result;\n                        }\n                    });\n                });\n                this.currentTest = data;\n                this.popUp = true;\n                console.log(data);\n            })\n            .catch( (err) => console.log(err));\n        },\n\n        //Закрываем всплывающее окно\n        closePopUp() {\n            this.popUp = false;\n        }\n\n    },\n\n    created() {\n        this.fetchData();\n    }\n\n}\n</script>\n\n<style lang=\"css\">\n\n@import './../css/variables.css';\n\n    .content {\n        margin-left: calc(var(--column) * 2);\n        margin-right: calc(var(--column) * 2);\n        width: calc(var(--column) * 16);\n    }\n\n    .respondents-page {\n        width: 100%;\n        position: relative;\n        padding-top: calc(var(--row) * 2);\n        display: flex;\n        background-color: var(--background);\n    }\n\n    .respondents-search {\n        position: absolute;\n        top: 20px;\n        width: calc(var(--column) * 16);\n        background-color: var(--background);\n        font-size: 2rem;\n        border:none;\n        border-bottom: 3px solid rgba(0,0,0,.1);\n    }\n\n    .respondents-list {\n        width: 100%;\n        display: flex;\n        flex-flow: column;\n        justify-content: center;\n    }\n\n    .resondents-test-item {\n        max-height: calc(var(--row) * 4);\n        overflow: hidden;\n        position: relative;\n        margin-bottom: 40px;\n        padding: 20px;\n        -webkit-box-shadow: 1px 1px 4px rgba(0,0,0,0.1);\n        box-shadow: 1px 1px 4px rgba(0,0,0,0.1);\n        cursor: pointer;\n        background-color: #fff;\n        -webkit-transition: all 1s ease-in-out;\n        -o-transition: all 1s ease-in-out;\n        transition: all 1s ease-in-out;\n    }\n\n    .resondents-test-item__active {\n        max-height: 10000px;\n        /* height: auto; */\n    }\n\n    .resondents-test-item__hide {\n        max-height: 0px;\n        overflow: hidden;\n        opacity: 0;\n        visibility: hidden;\n        padding: 0;\n        margin: 0;\n    }\n\n    .resondents-test-item__active.resondents-test-item__active:after {\n        opacity: 0;\n        visibility: hidden;\n        top: none;\n        bottom: 0px;\n    }\n\n    .resondents-test-item h2 {\n        margin-bottom: 20px;\n        color: var(--blue);\n    }\n\n    .resondents-test-item:after {\n        display: block;\n        position: absolute;\n        content: '';\n        width: 100%;\n        height: 100px;\n        top: calc(var(--row) * 4 - 100px);\n        background-image: linear-gradient(to top, #fff, rgba(255,255,255,0.6));\n        -webkit-transition: all 1s ease-in-out;\n        -o-transition: all 1s ease-in-out;\n        transition: all 1s ease-in-out;\n    }\n\n    .resondents-test-item__show {\n        color: var(--purple);\n        font-size: .9rem;\n        font-weight: bold;\n        position: absolute;\n        padding-left: 30px;\n        right: 20px;\n        top: 20px;\n    }\n\n    .resondents-test-item__show.active img{\n        transform: rotate(180deg);\n    }\n\n    .resondents-test-item__show img {\n        max-width: 20px;\n        position: absolute;\n        top: 2px;\n        left: 0;\n        transform: rotate(0deg);\n        -webkit-transition: all .5s ease-in-out;\n        -o-transition: all .5s ease-in-out;\n        transition: all .5s ease-in-out;\n    }\n\n    .fade-enter-active, .fade-leave-active {\n      transition: opacity .5s;\n    }\n    .fade-enter, .fade-leave-to {\n      opacity: 0;\n    }\n\n    @media screen and (max-width: 812px) {\n\n        .respondents-page .content {\n            width: 100%;\n            margin: 0;\n        }\n\n        .respondents-list {\n            justify-content: center;\n            align-items: center;\n        }\n\n\n        .resondents-test-item {\n            max-height: calc(var(--row-mobile) * 16);\n        }\n\n        .resondents-test-item__hide {\n            max-height: 0px;\n            overflow: hidden;\n            opacity: 0;\n            visibility: hidden;\n            padding: 0;\n            margin: 0;\n        }\n        .resondents-test-item__active {\n            max-height: 10000px;\n        }\n\n        .resondents-test-item__show {\n            right: 40%;\n        }\n\n        .resondents-test-item:after {\n            top: calc(var(--row-mobile) * 16 - 100px);\n        }\n\n        .resondents-test-item h2 {\n            font-size: 1.1rem;\n            padding-top: 40px;\n        }\n\n    }\n\n\n\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 122 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_respondent_item_vue__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_respondent_item_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_respondent_item_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_respondent_item_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_respondent_item_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_8fb18898_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_respondent_item_vue__ = __webpack_require__(125);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(123)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_respondent_item_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_8fb18898_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_respondent_item_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/vue-comp/interface/respondent-item.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-8fb18898", Component.options)
  } else {
    hotAPI.reload("data-v-8fb18898", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(124);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("6695e77e", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-8fb18898\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./respondent-item.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-8fb18898\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./respondent-item.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n:root{font-family:Marta;font-size:16px;line-height:1.4\n}\n.user-try{display:flex;justify-content:space-around;box-shadow:0 0 4px rgba(0,0,0,.1);border-radius:10px;cursor:pointer;background-color:#fff;margin-bottom:20px;transform:scale(.95);transition:all .3s ease-in-out\n}\n.user-try:hover{box-shadow:0 0 6px rgba(0,0,0,.3);transform:scale(1)\n}\n.user-try__false,.user-try__right{width:30px;height:30px;text-align:center;border-radius:20px;padding:3px 9px;font-weight:700;color:#fff\n}\n.user-try__right{background-color:#9dbe87\n}\n.user-try__false{background-color:#c74545\n}\n.user-try__email{max-width:none;min-width:30%\n}\n@media screen and (max-width:812px){\n.resondents-test-item{width:90%;padding:10px\n}\n.user-try{font-size:.6rem\n}\n.user-try__false,.user-try__right{width:15px;height:15px;padding:1px\n}\n.user-try__id{display:none\n}\n.user-try__email{min-width:60%\n}\n}", "", {"version":3,"sources":["/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/css/variables.css","/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/vue-comp/interface/src/vue-comp/interface/respondent-item.vue"],"names":[],"mappings":";AAAA,MACI,kBAAqB,eACL,eACC;CAapB;ACsDD,UACA,aAAA,6BACA,kCAEA,mBACA,eACA,sBACA,mBACA,qBACA,8BAGA;CACA;AAEA,gBAEA,kCAAA,kBACA;CACA;AAEA,kCAEA,WAAA,YACA,kBACA,mBACA,gBACA,gBACA,UACA;CACA;AAEA,iBACA,wBAAA;CACA;AAEA,iBACA,wBAAA;CACA;AAEA,iBACA,eAAA,aACA;CACA;AAEA;AAEA,sBACA,UAAA,YACA;CACA;AAEA,UACA,eAAA;CACA;AAEA,kCACA,WAAA,YACA,WACA;CACA;AAEA,cACA,YAAA;CACA;AAEA,iBACA,aAAA;CACA;CACA","file":"respondent-item.vue","sourcesContent":[":root {\n    font-family: 'Marta';\n    font-size: 16px;\n    line-height: 1.4;\n    --blue: #092E64;\n    --purple: #656695;\n    --darkpurple: #313149;\n    --marine: #3493A8;\n    --yellow: #EFDA7B;\n    --green: #9DBE87;\n    --red: #c74545;\n    --background: #e6e5e5;\n    --column: calc(100vw / 24);\n    --row: calc(100vh / 12);\n    --column-mobile: calc(100vw / 12);\n    --row-mobile: calc(100vh / 24);\n}\n","<template lang=\"html\">\n\n    <div class=\"user-try\" @click=\"showTestHander\">\n\n\n            <p class=\"user-try__id\">{{results.test_answer_id}}</p>\n            <p class=\"user-try__email\">{{userEmail}}</p>\n            <p class=\"user-try__total\">{{percents}}%</p>\n            <p class=\"user-try__right\">{{rightAnswers}}</p>\n            <p class=\"user-try__false\">{{falseAnswers}}</p>\n\n    </div>\n\n</template>\n\n<script>\nexport default {\n\n    props: ['result'],\n\n    data() {\n        return {\n            results: this.result,\n            rightAnswers: 0,\n            falseAnswers: 0,\n            percents: 0,\n            testAnswerId: this.result.test_answer_id,\n            testId: this.result.test_answer_test_id,\n            answers: this.result.result.answers\n\n        }\n    },\n\n    computed: {\n\n        //Email пользователя\n        userEmail() {\n            return this.results.user_email ? this.results.user_email : 'Anonym';\n        },\n\n    },\n\n    methods: {\n\n        //показываем окно с информацией о тесте\n        showTestHander() {\n            // console.log(this.testAnswerId + ' - testAnswerId');\n            // console.log(this.testId + ' - testId');\n            // console.log(this.answers);\n            this.$emit('show-info', this.testId, this.answers);\n\n        }\n\n    },\n\n    created() {\n        // console.log(this.results.result);\n        for(let i = 0; i < this.results.result.answers.length; i++) {\n            this.results.result.answers[i].result ? this.rightAnswers++ : this.falseAnswers++;\n        }\n        this.percents = Math.round(this.rightAnswers / this.results.result.answers.length * 100);\n\n    }\n\n}\n</script>\n\n<style lang=\"css\">\n\n    @import './../../css/variables.css';\n\n    .user-try {\n        display: flex;\n        justify-content: space-around;\n        -webkit-box-shadow: 0px 0px 4px rgba(0,0,0,0.1);\n        box-shadow: 0px 0px 4px rgba(0,0,0,0.1);\n        border-radius: 10px;\n        cursor: pointer;\n        background-color: #fff;\n        margin-bottom: 20px;\n        transform: scale(.95);\n        -webkit-transition: all .3s ease-in-out;\n        -o-transition: all .3s ease-in-out;\n        transition: all .3s ease-in-out;\n    }\n\n    .user-try:hover {\n        -webkit-box-shadow: 0px 0px 6px rgba(0,0,0,0.3);\n        box-shadow: 0px 0px 6px rgba(0,0,0,0.3);\n        transform: scale(1);\n    }\n\n    .user-try__right,\n    .user-try__false {\n        width: 30px;\n        height: 30px;\n        text-align: center;\n        border-radius: 20px;\n        padding: 3px 9px;\n        font-weight: bold;\n        color: #fff;\n    }\n\n    .user-try__right {\n        background-color: var(--green);\n    }\n\n    .user-try__false {\n        background-color: var(--red);\n    }\n\n    .user-try__email {\n        max-width: none;\n        min-width: 30%;\n    }\n\n    @media screen and (max-width: 812px) {\n\n        .resondents-test-item {\n            width: 90%;\n            padding: 10px;\n        }\n\n        .user-try {\n            font-size: .6rem;\n        }\n\n        .user-try__false, .user-try__right {\n            width: 15px;\n            height: 15px;\n            padding: 1px;\n        }\n\n        .user-try__id {\n            display: none;\n        }\n\n        .user-try__email {\n            min-width: 60%;\n        }\n    }\n\n\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 125 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "user-try", on: { click: _vm.showTestHander } },
    [
      _c("p", { staticClass: "user-try__id" }, [
        _vm._v(_vm._s(_vm.results.test_answer_id))
      ]),
      _vm._v(" "),
      _c("p", { staticClass: "user-try__email" }, [
        _vm._v(_vm._s(_vm.userEmail))
      ]),
      _vm._v(" "),
      _c("p", { staticClass: "user-try__total" }, [
        _vm._v(_vm._s(_vm.percents) + "%")
      ]),
      _vm._v(" "),
      _c("p", { staticClass: "user-try__right" }, [
        _vm._v(_vm._s(_vm.rightAnswers))
      ]),
      _vm._v(" "),
      _c("p", { staticClass: "user-try__false" }, [
        _vm._v(_vm._s(_vm.falseAnswers))
      ])
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-8fb18898", esExports)
  }
}

/***/ }),
/* 126 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "respondents-page" },
    [
      _c("side-menu"),
      _vm._v(" "),
      _c(
        "section",
        { staticClass: "content" },
        [
          _c(
            "transition",
            { attrs: { name: "fade" } },
            [
              _vm.popUp
                ? _c("pop-up", {
                    attrs: {
                      testtite: _vm.currentTest.test_name,
                      description: _vm.currentTest.test_description,
                      imglink: _vm.currentTest.test_image,
                      anonym: _vm.currentTest.test_anonym,
                      time: _vm.currentTest.test_time,
                      status: _vm.currentTest.test_status,
                      testquestions: _vm.currentTest.questions,
                      testid: _vm.currentTest.test_id
                    },
                    on: { "close-window": _vm.closePopUp }
                  })
                : _vm._e()
            ],
            1
          ),
          _vm._v(" "),
          _vm.loading
            ? _c(
                "div",
                { staticClass: "loading" },
                [_c("loading-indicator")],
                1
              )
            : _vm._e(),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "respondents-list" },
            [
              _c("input", {
                staticClass: "respondents-search",
                attrs: { type: "text", placeholder: "Введите название теста" },
                on: { input: _vm.searchTest }
              }),
              _vm._v(" "),
              _vm._l(_vm.testsArr, function(test) {
                return _c(
                  "div",
                  { key: test.test_id, staticClass: "resondents-test-item" },
                  [
                    _c(
                      "a",
                      {
                        staticClass: "resondents-test-item__show",
                        attrs: { href: "" },
                        on: {
                          click: function($event) {
                            $event.preventDefault()
                            _vm.showListHandler($event)
                          }
                        }
                      },
                      [
                        _vm._v("список "),
                        _c("img", {
                          attrs: { src: "img/arrow-down.svg", alt: "" }
                        })
                      ]
                    ),
                    _vm._v(" "),
                    _c("h2", [_vm._v(_vm._s(test.test_name))]),
                    _vm._v(" "),
                    _vm._l(test.tries, function(singleTry) {
                      return _c("respondent-item", {
                        key: singleTry.test_answer_id,
                        attrs: { result: singleTry },
                        on: { "show-info": _vm.showTryInfo }
                      })
                    })
                  ],
                  2
                )
              })
            ],
            2
          )
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-437af6bd", esExports)
  }
}

/***/ }),
/* 127 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_stats_vue__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_stats_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_stats_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_stats_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_stats_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4434b55f_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_stats_vue__ = __webpack_require__(134);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(128)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_stats_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4434b55f_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_stats_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/vue-comp/stats.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4434b55f", Component.options)
  } else {
    hotAPI.reload("data-v-4434b55f", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(129);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("b0668656", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4434b55f\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./stats.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4434b55f\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./stats.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n:root{font-family:Marta;font-size:16px;line-height:1.4\n}\n.content{margin-left:calc(4.16667vw * 2);margin-right:calc(4.16667vw * 2);width:calc(4.16667vw * 16)\n}\n.stats-page{width:100%;padding-top:calc(8.33333vh * 2);display:flex;background-color:#e6e5e5\n}\n.stats-list{width:100%;display:flex;flex-flow:column;justify-content:center\n}\n@media screen and (max-width:812px){\n.stats-page .content{width:100%;margin:0\n}\n.stats-list{justify-content:center;align-items:center\n}\n}", "", {"version":3,"sources":["/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/css/variables.css","/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/vue-comp/src/vue-comp/stats.vue"],"names":[],"mappings":";AAAA,MACI,kBAAqB,eACL,eACC;CAapB;AC8DD,SACA,gCAAA,iCACA,0BACA;CACA;AAEA,YACA,WAAA,gCACA,aACA,wBACA;CACA;AAEA,YACA,WAAA,aACA,iBACA,sBACA;CACA;AAEA;AAEA,qBACA,WAAA,QACA;CACA;AAEA,YACA,uBAAA,kBACA;CACA;CACA","file":"stats.vue","sourcesContent":[":root {\n    font-family: 'Marta';\n    font-size: 16px;\n    line-height: 1.4;\n    --blue: #092E64;\n    --purple: #656695;\n    --darkpurple: #313149;\n    --marine: #3493A8;\n    --yellow: #EFDA7B;\n    --green: #9DBE87;\n    --red: #c74545;\n    --background: #e6e5e5;\n    --column: calc(100vw / 24);\n    --row: calc(100vh / 12);\n    --column-mobile: calc(100vw / 12);\n    --row-mobile: calc(100vh / 24);\n}\n","<template lang=\"html\">\n\n    <div class=\"stats-page\">\n\n        <side-menu></side-menu>\n        <section class=\"content\">\n\n            <div class=\"loading\" v-if=\"loading\">\n\n                <loading-indicator></loading-indicator>\n\n            </div>\n\n            <div v-else class=\"stats-list\">\n\n                <stat-item\n                    v-for=\"answer in testsArr\"\n                    :tries=\"answer\"\n                ></stat-item>\n\n            </div>\n\n\n        </section>\n\n    </div>\n\n</template>\n\n<script>\n\nimport sideMenu from './side-menu.vue';\nimport loadingIndicator from './interface/loading.vue';\nimport statItem from './interface/stat-item.vue';\nimport axios from './../../node_modules/axios/dist/axios.js';\n\nexport default {\n\n    components: {\n        'side-menu': sideMenu,\n        'loading-indicator': loadingIndicator,\n        'stat-item': statItem\n    },\n\n    data() {\n        return {\n            loading: false,\n            testsArr: null\n        }\n    },\n\n    methods: {\n        fetchData() {\n            this.loading = true;\n            axios.get('php/getstats.php')\n            .then( (res) => {\n                this.loading = false;\n                this.testsArr = res.data.tests;\n                console.log(res);\n\n            })\n            .catch( (err) => {\n                this.loading = false;\n                console.log(err);\n            });\n        }\n    },\n\n    created() {\n        this.fetchData();\n    }\n\n}\n</script>\n\n<style lang=\"css\">\n\n@import './../css/variables.css';\n\n.content {\n    margin-left: calc(var(--column) * 2);\n    margin-right: calc(var(--column) * 2);\n    width: calc(var(--column) * 16);\n}\n\n.stats-page {\n    width: 100%;\n    padding-top: calc(var(--row) * 2);\n    display: flex;\n    background-color: var(--background);\n}\n\n.stats-list {\n    width: 100%;\n    display: flex;\n    flex-flow: column;\n    justify-content: center;\n}\n\n@media screen and (max-width: 812px) {\n\n    .stats-page .content {\n        width: 100%;\n        margin: 0;\n    }\n\n    .stats-list {\n        justify-content: center;\n        align-items: center;\n    }\n}\n\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 130 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_stat_item_vue__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_stat_item_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_stat_item_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_stat_item_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_stat_item_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_327a7e54_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_stat_item_vue__ = __webpack_require__(133);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(131)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_stat_item_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_327a7e54_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_stat_item_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/vue-comp/interface/stat-item.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-327a7e54", Component.options)
  } else {
    hotAPI.reload("data-v-327a7e54", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(132);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("5d7fd596", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-327a7e54\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./stat-item.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-327a7e54\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./stat-item.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n:root{font-family:Marta;font-size:16px;line-height:1.4\n}\n.stat-item{display:flex;width:90%;margin-bottom:40px;box-shadow:1px 1px 4px rgba(0,0,0,.1);cursor:pointer;background-color:#fff;font-weight:700;transition:all .3s ease-in-out\n}\n.stat-item:hover .stat-item-title:before{left:0\n}\n.stat-item:hover .stat-item-title h3{color:#fff\n}\n.stat-item:hover .stat-item-title h3:after{left:0\n}\n.stat-item:hover .stat-item-stat ul{color:#656695\n}\n.stat-item-title{padding:40px;width:50%;position:relative;overflow:hidden\n}\n.stat-item-title h3{color:#092e64;z-index:100;position:relative;transition:all .3s ease-in-out\n}\n.stat-item-title h3:after{bottom:-10px;width:40px;height:3px;background-color:#fff;transition:all .3s ease-in-out .1s\n}\n.stat-item-title:before,.stat-item-title h3:after{display:block;position:absolute;content:\"\";left:-100%\n}\n.stat-item-title:before{z-index:99;top:0;background-color:#656695;width:100%;height:100%;transition:all .3s ease-in-out\n}\n.stat-item-stat{padding:40px;width:50%\n}\n.stat-item-stat ul{list-style:none;display:flex;justify-content:space-around;flex-wrap:wrap;color:#092e64\n}\n.stat-item-stat li{display:block;width:30%;text-align:center;font-size:.8rem\n}\nli[class^=stat-item-stat]{font-size:2rem\n}\n@media screen and (max-width:812px){\n.stat-item{flex-direction:column\n}\n.stat-item-stat,.stat-item-title{width:100%\n}\n.stat-item-stat{padding:10px\n}\n.stat-item-stat li{font-size:.6rem\n}\n.stat-item:hover .stat-item-title h3:after{left:40%\n}\n.stat-item-title h3:after{width:20%\n}\nli[class^=stat-item-stat]{font-size:1.2rem\n}\n}", "", {"version":3,"sources":["/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/css/variables.css","/Applications/XAMPP/xamppfiles/htdocs/tester-avalon/src/vue-comp/interface/src/vue-comp/interface/stat-item.vue"],"names":[],"mappings":";AAAA,MACI,kBAAqB,eACL,eACC;CAapB;ACkDD,WACA,aAAA,UACA,mBACA,sCAEA,eACA,sBACA,gBACA,8BAGA;CACA;AAEA,yCACA,MAAA;CACA;AAEA,qCACA,UAAA;CACA;AAEA,2CACA,MAAA;CACA;AAEA,oCACA,aAAA;CACA;AAEA,iBACA,aAAA,UACA,kBACA,eACA;CACA;AAEA,oBACA,cAAA,YACA,kBACA,8BAGA;CACA;AAEA,0BAKA,aAAA,WACA,WACA,sBACA,kCAGA;CAEA;AAEA,kDAdA,cAAA,kBACA,WACA,UACA;CAwBA;AAbA,wBAGA,WAAA,MAEA,yBACA,WAEA,YACA,8BAGA;CACA;AAEA,gBACA,aAAA,SACA;CACA;AAEA,mBACA,gBAAA,aACA,6BACA,eACA,aACA;CACA;AAEA,mBACA,cAAA,UACA,kBACA,eACA;CACA;AAEA,0BACA,cAAA;CACA;AAEA;AAEA,WACA,qBAAA;CACA;AAEA,iCAEA,UAAA;CACA;AAEA,gBACA,YAAA;CACA;AAEA,mBACA,eAAA;CACA;AAEA,2CACA,QAAA;CACA;AAEA,0BACA,SAAA;CACA;AAEA,0BACA,gBAAA;CACA;CAGA","file":"stat-item.vue","sourcesContent":[":root {\n    font-family: 'Marta';\n    font-size: 16px;\n    line-height: 1.4;\n    --blue: #092E64;\n    --purple: #656695;\n    --darkpurple: #313149;\n    --marine: #3493A8;\n    --yellow: #EFDA7B;\n    --green: #9DBE87;\n    --red: #c74545;\n    --background: #e6e5e5;\n    --column: calc(100vw / 24);\n    --row: calc(100vh / 12);\n    --column-mobile: calc(100vw / 12);\n    --row-mobile: calc(100vh / 24);\n}\n","<template lang=\"html\">\n\n    <div class=\"stat-item\">\n\n        <div class=\"stat-item-title\">\n            <h3>{{testTitle}}</h3>\n        </div>\n        <div class=\"stat-item-stat\">\n            <ul>\n                <li class=\"stat-item-stat__1\">{{respondentsNum}}</li>\n                <li class=\"stat-item-stat__2\">{{rightAnswers}}</li>\n                <li class=\"stat-item-stat__3\">{{wrongAnswers}}</li>\n                <li>Респондентов</li>\n                <li>Правильных</li>\n                <li>Неправильных</li>\n            </ul>\n        </div>\n\n    </div>\n\n</template>\n\n<script>\nexport default {\n\n    props: ['tries'],\n\n    data() {\n        return {\n            respondents: this.tries,\n            testTitle: this.tries.test_name\n        }\n    },\n\n    computed: {\n        respondentsNum() {\n            return this.respondents.tries.length\n        },\n\n        rightAnswers() {\n            let right = 0;\n            this.respondents.tries.forEach( (val,ind,arr) => {\n                val.result.answers.forEach((v,i,a) => {\n                    if(v.result) right++;\n                });\n            });\n            return right;\n        },\n\n        wrongAnswers() {\n            let wrong = 0;\n            this.respondents.tries.forEach( (val,ind,arr) => {\n                val.result.answers.forEach((v,i,a) => {\n                    if(!v.result) wrong++;\n                });\n            });\n            return wrong;\n        }\n    }\n\n}\n</script>\n\n<style lang=\"css\">\n\n    @import './../../css/variables.css';\n\n    .stat-item {\n        display: flex;\n        width: 90%;\n        margin-bottom: 40px;\n        -webkit-box-shadow: 1px 1px 4px rgba(0,0,0,0.1);\n        box-shadow: 1px 1px 4px rgba(0,0,0,0.1);\n        cursor: pointer;\n        background-color: #fff;\n        font-weight: bold;\n        -webkit-transition: all .3s ease-in-out;\n        -o-transition: all .3s ease-in-out;\n        transition: all .3s ease-in-out;\n    }\n\n    .stat-item:hover .stat-item-title:before {\n        left: 0;\n    }\n\n    .stat-item:hover .stat-item-title h3 {\n        color: #fff;\n    }\n\n    .stat-item:hover .stat-item-title h3:after {\n        left: 0;\n    }\n\n    .stat-item:hover .stat-item-stat ul {\n        color: var(--purple);\n    }\n\n    .stat-item-title {\n        padding: 40px;\n        width: 50%;\n        position: relative;\n        overflow: hidden;\n    }\n\n    .stat-item-title h3 {\n        color: var(--blue);\n        z-index: 100;\n        position: relative;\n        -webkit-transition: all .3s ease-in-out;\n        -o-transition: all .3s ease-in-out;\n        transition: all .3s ease-in-out;\n    }\n\n    .stat-item-title h3:after {\n        display: block;\n        position: absolute;\n        content: '';\n        left: -100%;\n        bottom: -10px;\n        width: 40px;\n        height: 3px;\n        background-color: #fff;\n        -webkit-transition: all .3s ease-in-out .1s;\n        -o-transition: all .3s ease-in-out .1s;\n        transition: all .3s ease-in-out .1s;\n\n    }\n\n    .stat-item-title:before {\n        display: block;\n        position: absolute;\n        z-index: 99;\n        left: -100%;\n        top: 0px;\n        background-color: var(--purple);\n        content: '';\n        width: 100%;\n        height: 100%;\n        -webkit-transition: all .3s ease-in-out;\n        -o-transition: all .3s ease-in-out;\n        transition: all .3s ease-in-out;\n    }\n\n    .stat-item-stat {\n        padding: 40px;\n        width: 50%;\n    }\n\n    .stat-item-stat ul{\n        list-style: none;\n        display: flex;\n        justify-content: space-around;\n        flex-wrap: wrap;\n        color: var(--blue);\n    }\n\n    .stat-item-stat li {\n        display: block;\n        width: 30%;\n        text-align: center;\n        font-size: .8rem;\n    }\n\n    li[class^=\"stat-item-stat\"] {\n        font-size: 2rem;\n    }\n\n    @media screen and (max-width: 812px) {\n\n        .stat-item {\n            flex-direction: column;\n        }\n\n        .stat-item-title,\n        .stat-item-stat {\n            width: 100%;\n        }\n\n        .stat-item-stat {\n            padding: 10px;\n        }\n\n        .stat-item-stat li {\n            font-size: .6rem;\n        }\n\n        .stat-item:hover .stat-item-title h3:after {\n            left: 40%;\n        }\n\n        .stat-item-title h3:after {\n            width: 20%;\n        }\n\n        li[class^=stat-item-stat] {\n            font-size: 1.2rem;\n        }\n\n\n    }\n\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 133 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "stat-item" }, [
    _c("div", { staticClass: "stat-item-title" }, [
      _c("h3", [_vm._v(_vm._s(_vm.testTitle))])
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "stat-item-stat" }, [
      _c("ul", [
        _c("li", { staticClass: "stat-item-stat__1" }, [
          _vm._v(_vm._s(_vm.respondentsNum))
        ]),
        _vm._v(" "),
        _c("li", { staticClass: "stat-item-stat__2" }, [
          _vm._v(_vm._s(_vm.rightAnswers))
        ]),
        _vm._v(" "),
        _c("li", { staticClass: "stat-item-stat__3" }, [
          _vm._v(_vm._s(_vm.wrongAnswers))
        ]),
        _vm._v(" "),
        _c("li", [_vm._v("Респондентов")]),
        _vm._v(" "),
        _c("li", [_vm._v("Правильных")]),
        _vm._v(" "),
        _c("li", [_vm._v("Неправильных")])
      ])
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-327a7e54", esExports)
  }
}

/***/ }),
/* 134 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "stats-page" },
    [
      _c("side-menu"),
      _vm._v(" "),
      _c("section", { staticClass: "content" }, [
        _vm.loading
          ? _c("div", { staticClass: "loading" }, [_c("loading-indicator")], 1)
          : _c(
              "div",
              { staticClass: "stats-list" },
              _vm._l(_vm.testsArr, function(answer) {
                return _c("stat-item", { attrs: { tries: answer } })
              })
            )
      ])
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-4434b55f", esExports)
  }
}

/***/ })
/******/ ]);
//# sourceMappingURL=build.js.map