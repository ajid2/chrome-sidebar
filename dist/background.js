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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/******/ 	return __webpack_require__(__webpack_require__.s = 72);
/******/ })
/************************************************************************/
/******/ ({

/***/ 72:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


chrome.browserAction.onClicked.addListener(function (tab) {
  console.log('Browser Action Triggered');
  chrome.tabs.executeScript(tab.id, {
    file: 'entry.js'
  });
});

var host, iframehost;
var overrideFrameOptions = true;

chrome.storage.sync.set({
  baseUrl: 'https://7he61.csb.app',
  paramName: 'contact'
}, function () {
  chrome.storage.sync.get({ baseUrl: '' }, function (items) {
    try {
      var uri = new URL(items.baseUrl);
      host = uri.hostname ? uri.hostname : '*';
      iframehost = uri.origin ? '' + uri.origin : 'https://*/*';
    } catch (e) {
      host = '*';
      iframehost = 'https://*/*';
    }

    chrome.webRequest.onHeadersReceived.addListener(function (details) {
      var responseHeaders = details.responseHeaders.map(function (header) {
        var isCSPHeader = /content-security-policy/i.test(header.name);
        var isFrameHeader = /x-frame-options/i.test(header.name);

        if (isCSPHeader) {
          var csp = header.value;

          console.log('HOST: ' + host, 'IFRAME: ' + iframehost);

          csp = csp.replace('script-src', 'script-src ' + host);
          csp = csp.replace('style-src', 'style-src ' + host);
          csp = csp.replace('frame-src', 'frame-src ' + iframehost);
          csp = csp.replace('child-src', 'child-src ' + host);

          if (overrideFrameOptions) {
            csp = csp.replace(/frame-ancestors (.*?);/ig, '');
          }

          header.value = csp;
        } else if (isFrameHeader && overrideFrameOptions) {
          header.value = 'ALLOWALL';
        }

        return header;
      });

      return { responseHeaders: responseHeaders };
    }, {
      urls: ['http://*/*', 'https://*/*'],
      types: ['main_frame', 'sub_frame']
    }, ['blocking', 'responseHeaders']);
  });
});

/***/ })

/******/ });