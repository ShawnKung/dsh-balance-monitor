window.__ModuleLoader__.load({
  id: "@shawnkung/dsh-balance-monitor",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    var __create = Object.create;
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
      // If the importer is in node compatibility mode or this is not an ESM
      // file that has been converted to a CommonJS file using a Babel-
      // compatible transform (i.e. "__esModule" has not been set), then set
      // "default" to the CommonJS "module.exports" for node compatibility.
      isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
      mod
    ));
    var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

    // src/client.js
    var client_exports = {};
    __export(client_exports, {
      apply: () => apply,
      inject: () => inject
    });
    module.exports = __toCommonJS(client_exports);
    var import_react = __toESM(require("react"), 1);

    // node_modules/sortablejs/modular/sortable.esm.js
    function _defineProperty(e, r, t) {
      return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
        value: t,
        enumerable: true,
        configurable: true,
        writable: true
      }) : e[r] = t, e;
    }
    function _extends() {
      return _extends = Object.assign ? Object.assign.bind() : function(n) {
        for (var e = 1; e < arguments.length; e++) {
          var t = arguments[e];
          for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
        }
        return n;
      }, _extends.apply(null, arguments);
    }
    function ownKeys(e, r) {
      var t = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function(r2) {
          return Object.getOwnPropertyDescriptor(e, r2).enumerable;
        })), t.push.apply(t, o);
      }
      return t;
    }
    function _objectSpread2(e) {
      for (var r = 1; r < arguments.length; r++) {
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
          _defineProperty(e, r2, t[r2]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
          Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
        });
      }
      return e;
    }
    function _objectWithoutProperties(e, t) {
      if (null == e) return {};
      var o, r, i = _objectWithoutPropertiesLoose(e, t);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
      }
      return i;
    }
    function _objectWithoutPropertiesLoose(r, e) {
      if (null == r) return {};
      var t = {};
      for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
        if (-1 !== e.indexOf(n)) continue;
        t[n] = r[n];
      }
      return t;
    }
    function _toPrimitive(t, r) {
      if ("object" != typeof t || !t) return t;
      var e = t[Symbol.toPrimitive];
      if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === r ? String : Number)(t);
    }
    function _toPropertyKey(t) {
      var i = _toPrimitive(t, "string");
      return "symbol" == typeof i ? i : i + "";
    }
    function _typeof(o) {
      "@babel/helpers - typeof";
      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
        return typeof o2;
      } : function(o2) {
        return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
      }, _typeof(o);
    }
    var version = "1.15.7";
    function userAgent(pattern) {
      if (typeof window !== "undefined" && window.navigator) {
        return !!/* @__PURE__ */ navigator.userAgent.match(pattern);
      }
    }
    var IE11OrLess = userAgent(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i);
    var Edge = userAgent(/Edge/i);
    var FireFox = userAgent(/firefox/i);
    var Safari = userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);
    var IOS = userAgent(/iP(ad|od|hone)/i);
    var ChromeForAndroid = userAgent(/chrome/i) && userAgent(/android/i);
    var captureMode = {
      capture: false,
      passive: false
    };
    function on(el, event, fn) {
      el.addEventListener(event, fn, !IE11OrLess && captureMode);
    }
    function off(el, event, fn) {
      el.removeEventListener(event, fn, !IE11OrLess && captureMode);
    }
    function matches(el, selector) {
      if (!selector) return;
      selector[0] === ">" && (selector = selector.substring(1));
      if (el) {
        try {
          if (el.matches) {
            return el.matches(selector);
          } else if (el.msMatchesSelector) {
            return el.msMatchesSelector(selector);
          } else if (el.webkitMatchesSelector) {
            return el.webkitMatchesSelector(selector);
          }
        } catch (_) {
          return false;
        }
      }
      return false;
    }
    function getParentOrHost(el) {
      return el.host && el !== document && el.host.nodeType && el.host !== el ? el.host : el.parentNode;
    }
    function closest(el, selector, ctx, includeCTX) {
      if (el) {
        ctx = ctx || document;
        do {
          if (selector != null && (selector[0] === ">" ? el.parentNode === ctx && matches(el, selector) : matches(el, selector)) || includeCTX && el === ctx) {
            return el;
          }
          if (el === ctx) break;
        } while (el = getParentOrHost(el));
      }
      return null;
    }
    var R_SPACE = /\s+/g;
    function toggleClass(el, name, state) {
      if (el && name) {
        if (el.classList) {
          el.classList[state ? "add" : "remove"](name);
        } else {
          var className = (" " + el.className + " ").replace(R_SPACE, " ").replace(" " + name + " ", " ");
          el.className = (className + (state ? " " + name : "")).replace(R_SPACE, " ");
        }
      }
    }
    function css(el, prop, val) {
      var style = el && el.style;
      if (style) {
        if (val === void 0) {
          if (document.defaultView && document.defaultView.getComputedStyle) {
            val = document.defaultView.getComputedStyle(el, "");
          } else if (el.currentStyle) {
            val = el.currentStyle;
          }
          return prop === void 0 ? val : val[prop];
        } else {
          if (!(prop in style) && prop.indexOf("webkit") === -1) {
            prop = "-webkit-" + prop;
          }
          style[prop] = val + (typeof val === "string" ? "" : "px");
        }
      }
    }
    function matrix(el, selfOnly) {
      var appliedTransforms = "";
      if (typeof el === "string") {
        appliedTransforms = el;
      } else {
        do {
          var transform = css(el, "transform");
          if (transform && transform !== "none") {
            appliedTransforms = transform + " " + appliedTransforms;
          }
        } while (!selfOnly && (el = el.parentNode));
      }
      var matrixFn = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
      return matrixFn && new matrixFn(appliedTransforms);
    }
    function find(ctx, tagName, iterator) {
      if (ctx) {
        var list = ctx.getElementsByTagName(tagName), i = 0, n = list.length;
        if (iterator) {
          for (; i < n; i++) {
            iterator(list[i], i);
          }
        }
        return list;
      }
      return [];
    }
    function getWindowScrollingElement() {
      var scrollingElement = document.scrollingElement;
      if (scrollingElement) {
        return scrollingElement;
      } else {
        return document.documentElement;
      }
    }
    function getRect(el, relativeToContainingBlock, relativeToNonStaticParent, undoScale, container) {
      if (!el.getBoundingClientRect && el !== window) return;
      var elRect, top, left, bottom, right, height, width;
      if (el !== window && el.parentNode && el !== getWindowScrollingElement()) {
        elRect = el.getBoundingClientRect();
        top = elRect.top;
        left = elRect.left;
        bottom = elRect.bottom;
        right = elRect.right;
        height = elRect.height;
        width = elRect.width;
      } else {
        top = 0;
        left = 0;
        bottom = window.innerHeight;
        right = window.innerWidth;
        height = window.innerHeight;
        width = window.innerWidth;
      }
      if ((relativeToContainingBlock || relativeToNonStaticParent) && el !== window) {
        container = container || el.parentNode;
        if (!IE11OrLess) {
          do {
            if (container && container.getBoundingClientRect && (css(container, "transform") !== "none" || relativeToNonStaticParent && css(container, "position") !== "static")) {
              var containerRect = container.getBoundingClientRect();
              top -= containerRect.top + parseInt(css(container, "border-top-width"));
              left -= containerRect.left + parseInt(css(container, "border-left-width"));
              bottom = top + elRect.height;
              right = left + elRect.width;
              break;
            }
          } while (container = container.parentNode);
        }
      }
      if (undoScale && el !== window) {
        var elMatrix = matrix(container || el), scaleX = elMatrix && elMatrix.a, scaleY = elMatrix && elMatrix.d;
        if (elMatrix) {
          top /= scaleY;
          left /= scaleX;
          width /= scaleX;
          height /= scaleY;
          bottom = top + height;
          right = left + width;
        }
      }
      return {
        top,
        left,
        bottom,
        right,
        width,
        height
      };
    }
    function isScrolledPast(el, elSide, parentSide) {
      var parent = getParentAutoScrollElement(el, true), elSideVal = getRect(el)[elSide];
      while (parent) {
        var parentSideVal = getRect(parent)[parentSide], visible = void 0;
        if (parentSide === "top" || parentSide === "left") {
          visible = elSideVal >= parentSideVal;
        } else {
          visible = elSideVal <= parentSideVal;
        }
        if (!visible) return parent;
        if (parent === getWindowScrollingElement()) break;
        parent = getParentAutoScrollElement(parent, false);
      }
      return false;
    }
    function getChild(el, childNum, options, includeDragEl) {
      var currentChild = 0, i = 0, children = el.children;
      while (i < children.length) {
        if (children[i].style.display !== "none" && children[i] !== Sortable.ghost && (includeDragEl || children[i] !== Sortable.dragged) && closest(children[i], options.draggable, el, false)) {
          if (currentChild === childNum) {
            return children[i];
          }
          currentChild++;
        }
        i++;
      }
      return null;
    }
    function lastChild(el, selector) {
      var last = el.lastElementChild;
      while (last && (last === Sortable.ghost || css(last, "display") === "none" || selector && !matches(last, selector))) {
        last = last.previousElementSibling;
      }
      return last || null;
    }
    function index(el, selector) {
      var index2 = 0;
      if (!el || !el.parentNode) {
        return -1;
      }
      while (el = el.previousElementSibling) {
        if (el.nodeName.toUpperCase() !== "TEMPLATE" && el !== Sortable.clone && (!selector || matches(el, selector))) {
          index2++;
        }
      }
      return index2;
    }
    function getRelativeScrollOffset(el) {
      var offsetLeft = 0, offsetTop = 0, winScroller = getWindowScrollingElement();
      if (el) {
        do {
          var elMatrix = matrix(el), scaleX = elMatrix.a, scaleY = elMatrix.d;
          offsetLeft += el.scrollLeft * scaleX;
          offsetTop += el.scrollTop * scaleY;
        } while (el !== winScroller && (el = el.parentNode));
      }
      return [offsetLeft, offsetTop];
    }
    function indexOfObject(arr, obj) {
      for (var i in arr) {
        if (!arr.hasOwnProperty(i)) continue;
        for (var key in obj) {
          if (obj.hasOwnProperty(key) && obj[key] === arr[i][key]) return Number(i);
        }
      }
      return -1;
    }
    function getParentAutoScrollElement(el, includeSelf) {
      if (!el || !el.getBoundingClientRect) return getWindowScrollingElement();
      var elem = el;
      var gotSelf = false;
      do {
        if (elem.clientWidth < elem.scrollWidth || elem.clientHeight < elem.scrollHeight) {
          var elemCSS = css(elem);
          if (elem.clientWidth < elem.scrollWidth && (elemCSS.overflowX == "auto" || elemCSS.overflowX == "scroll") || elem.clientHeight < elem.scrollHeight && (elemCSS.overflowY == "auto" || elemCSS.overflowY == "scroll")) {
            if (!elem.getBoundingClientRect || elem === document.body) return getWindowScrollingElement();
            if (gotSelf || includeSelf) return elem;
            gotSelf = true;
          }
        }
      } while (elem = elem.parentNode);
      return getWindowScrollingElement();
    }
    function extend(dst, src) {
      if (dst && src) {
        for (var key in src) {
          if (src.hasOwnProperty(key)) {
            dst[key] = src[key];
          }
        }
      }
      return dst;
    }
    function isRectEqual(rect1, rect2) {
      return Math.round(rect1.top) === Math.round(rect2.top) && Math.round(rect1.left) === Math.round(rect2.left) && Math.round(rect1.height) === Math.round(rect2.height) && Math.round(rect1.width) === Math.round(rect2.width);
    }
    var _throttleTimeout;
    function throttle(callback, ms) {
      return function() {
        if (!_throttleTimeout) {
          var args = arguments, _this = this;
          if (args.length === 1) {
            callback.call(_this, args[0]);
          } else {
            callback.apply(_this, args);
          }
          _throttleTimeout = setTimeout(function() {
            _throttleTimeout = void 0;
          }, ms);
        }
      };
    }
    function cancelThrottle() {
      clearTimeout(_throttleTimeout);
      _throttleTimeout = void 0;
    }
    function scrollBy(el, x, y) {
      el.scrollLeft += x;
      el.scrollTop += y;
    }
    function clone(el) {
      var Polymer = window.Polymer;
      var $ = window.jQuery || window.Zepto;
      if (Polymer && Polymer.dom) {
        return Polymer.dom(el).cloneNode(true);
      } else if ($) {
        return $(el).clone(true)[0];
      } else {
        return el.cloneNode(true);
      }
    }
    function getChildContainingRectFromElement(container, options, ghostEl2) {
      var rect = {};
      Array.from(container.children).forEach(function(child) {
        var _rect$left, _rect$top, _rect$right, _rect$bottom;
        if (!closest(child, options.draggable, container, false) || child.animated || child === ghostEl2) return;
        var childRect = getRect(child);
        rect.left = Math.min((_rect$left = rect.left) !== null && _rect$left !== void 0 ? _rect$left : Infinity, childRect.left);
        rect.top = Math.min((_rect$top = rect.top) !== null && _rect$top !== void 0 ? _rect$top : Infinity, childRect.top);
        rect.right = Math.max((_rect$right = rect.right) !== null && _rect$right !== void 0 ? _rect$right : -Infinity, childRect.right);
        rect.bottom = Math.max((_rect$bottom = rect.bottom) !== null && _rect$bottom !== void 0 ? _rect$bottom : -Infinity, childRect.bottom);
      });
      rect.width = rect.right - rect.left;
      rect.height = rect.bottom - rect.top;
      rect.x = rect.left;
      rect.y = rect.top;
      return rect;
    }
    var expando = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
    function AnimationStateManager() {
      var animationStates = [], animationCallbackId;
      return {
        captureAnimationState: function captureAnimationState() {
          animationStates = [];
          if (!this.options.animation) return;
          var children = [].slice.call(this.el.children);
          children.forEach(function(child) {
            if (css(child, "display") === "none" || child === Sortable.ghost) return;
            animationStates.push({
              target: child,
              rect: getRect(child)
            });
            var fromRect = _objectSpread2({}, animationStates[animationStates.length - 1].rect);
            if (child.thisAnimationDuration) {
              var childMatrix = matrix(child, true);
              if (childMatrix) {
                fromRect.top -= childMatrix.f;
                fromRect.left -= childMatrix.e;
              }
            }
            child.fromRect = fromRect;
          });
        },
        addAnimationState: function addAnimationState(state) {
          animationStates.push(state);
        },
        removeAnimationState: function removeAnimationState(target) {
          animationStates.splice(indexOfObject(animationStates, {
            target
          }), 1);
        },
        animateAll: function animateAll(callback) {
          var _this = this;
          if (!this.options.animation) {
            clearTimeout(animationCallbackId);
            if (typeof callback === "function") callback();
            return;
          }
          var animating = false, animationTime = 0;
          animationStates.forEach(function(state) {
            var time = 0, target = state.target, fromRect = target.fromRect, toRect = getRect(target), prevFromRect = target.prevFromRect, prevToRect = target.prevToRect, animatingRect = state.rect, targetMatrix = matrix(target, true);
            if (targetMatrix) {
              toRect.top -= targetMatrix.f;
              toRect.left -= targetMatrix.e;
            }
            target.toRect = toRect;
            if (target.thisAnimationDuration) {
              if (isRectEqual(prevFromRect, toRect) && !isRectEqual(fromRect, toRect) && // Make sure animatingRect is on line between toRect & fromRect
              (animatingRect.top - toRect.top) / (animatingRect.left - toRect.left) === (fromRect.top - toRect.top) / (fromRect.left - toRect.left)) {
                time = calculateRealTime(animatingRect, prevFromRect, prevToRect, _this.options);
              }
            }
            if (!isRectEqual(toRect, fromRect)) {
              target.prevFromRect = fromRect;
              target.prevToRect = toRect;
              if (!time) {
                time = _this.options.animation;
              }
              _this.animate(target, animatingRect, toRect, time);
            }
            if (time) {
              animating = true;
              animationTime = Math.max(animationTime, time);
              clearTimeout(target.animationResetTimer);
              target.animationResetTimer = setTimeout(function() {
                target.animationTime = 0;
                target.prevFromRect = null;
                target.fromRect = null;
                target.prevToRect = null;
                target.thisAnimationDuration = null;
              }, time);
              target.thisAnimationDuration = time;
            }
          });
          clearTimeout(animationCallbackId);
          if (!animating) {
            if (typeof callback === "function") callback();
          } else {
            animationCallbackId = setTimeout(function() {
              if (typeof callback === "function") callback();
            }, animationTime);
          }
          animationStates = [];
        },
        animate: function animate(target, currentRect, toRect, duration) {
          if (duration) {
            css(target, "transition", "");
            css(target, "transform", "");
            var elMatrix = matrix(this.el), scaleX = elMatrix && elMatrix.a, scaleY = elMatrix && elMatrix.d, translateX = (currentRect.left - toRect.left) / (scaleX || 1), translateY = (currentRect.top - toRect.top) / (scaleY || 1);
            target.animatingX = !!translateX;
            target.animatingY = !!translateY;
            css(target, "transform", "translate3d(" + translateX + "px," + translateY + "px,0)");
            this.forRepaintDummy = repaint(target);
            css(target, "transition", "transform " + duration + "ms" + (this.options.easing ? " " + this.options.easing : ""));
            css(target, "transform", "translate3d(0,0,0)");
            typeof target.animated === "number" && clearTimeout(target.animated);
            target.animated = setTimeout(function() {
              css(target, "transition", "");
              css(target, "transform", "");
              target.animated = false;
              target.animatingX = false;
              target.animatingY = false;
            }, duration);
          }
        }
      };
    }
    function repaint(target) {
      return target.offsetWidth;
    }
    function calculateRealTime(animatingRect, fromRect, toRect, options) {
      return Math.sqrt(Math.pow(fromRect.top - animatingRect.top, 2) + Math.pow(fromRect.left - animatingRect.left, 2)) / Math.sqrt(Math.pow(fromRect.top - toRect.top, 2) + Math.pow(fromRect.left - toRect.left, 2)) * options.animation;
    }
    var plugins = [];
    var defaults = {
      initializeByDefault: true
    };
    var PluginManager = {
      mount: function mount(plugin) {
        for (var option2 in defaults) {
          if (defaults.hasOwnProperty(option2) && !(option2 in plugin)) {
            plugin[option2] = defaults[option2];
          }
        }
        plugins.forEach(function(p) {
          if (p.pluginName === plugin.pluginName) {
            throw "Sortable: Cannot mount plugin ".concat(plugin.pluginName, " more than once");
          }
        });
        plugins.push(plugin);
      },
      pluginEvent: function pluginEvent(eventName, sortable, evt) {
        var _this = this;
        this.eventCanceled = false;
        evt.cancel = function() {
          _this.eventCanceled = true;
        };
        var eventNameGlobal = eventName + "Global";
        plugins.forEach(function(plugin) {
          if (!sortable[plugin.pluginName]) return;
          if (sortable[plugin.pluginName][eventNameGlobal]) {
            sortable[plugin.pluginName][eventNameGlobal](_objectSpread2({
              sortable
            }, evt));
          }
          if (sortable.options[plugin.pluginName] && sortable[plugin.pluginName][eventName]) {
            sortable[plugin.pluginName][eventName](_objectSpread2({
              sortable
            }, evt));
          }
        });
      },
      initializePlugins: function initializePlugins(sortable, el, defaults2, options) {
        plugins.forEach(function(plugin) {
          var pluginName = plugin.pluginName;
          if (!sortable.options[pluginName] && !plugin.initializeByDefault) return;
          var initialized = new plugin(sortable, el, sortable.options);
          initialized.sortable = sortable;
          initialized.options = sortable.options;
          sortable[pluginName] = initialized;
          _extends(defaults2, initialized.defaults);
        });
        for (var option2 in sortable.options) {
          if (!sortable.options.hasOwnProperty(option2)) continue;
          var modified = this.modifyOption(sortable, option2, sortable.options[option2]);
          if (typeof modified !== "undefined") {
            sortable.options[option2] = modified;
          }
        }
      },
      getEventProperties: function getEventProperties(name, sortable) {
        var eventProperties = {};
        plugins.forEach(function(plugin) {
          if (typeof plugin.eventProperties !== "function") return;
          _extends(eventProperties, plugin.eventProperties.call(sortable[plugin.pluginName], name));
        });
        return eventProperties;
      },
      modifyOption: function modifyOption(sortable, name, value) {
        var modifiedValue;
        plugins.forEach(function(plugin) {
          if (!sortable[plugin.pluginName]) return;
          if (plugin.optionListeners && typeof plugin.optionListeners[name] === "function") {
            modifiedValue = plugin.optionListeners[name].call(sortable[plugin.pluginName], value);
          }
        });
        return modifiedValue;
      }
    };
    function dispatchEvent(_ref) {
      var sortable = _ref.sortable, rootEl2 = _ref.rootEl, name = _ref.name, targetEl = _ref.targetEl, cloneEl2 = _ref.cloneEl, toEl = _ref.toEl, fromEl = _ref.fromEl, oldIndex2 = _ref.oldIndex, newIndex2 = _ref.newIndex, oldDraggableIndex2 = _ref.oldDraggableIndex, newDraggableIndex2 = _ref.newDraggableIndex, originalEvent = _ref.originalEvent, putSortable2 = _ref.putSortable, extraEventProperties = _ref.extraEventProperties;
      sortable = sortable || rootEl2 && rootEl2[expando];
      if (!sortable) return;
      var evt, options = sortable.options, onName = "on" + name.charAt(0).toUpperCase() + name.substr(1);
      if (window.CustomEvent && !IE11OrLess && !Edge) {
        evt = new CustomEvent(name, {
          bubbles: true,
          cancelable: true
        });
      } else {
        evt = document.createEvent("Event");
        evt.initEvent(name, true, true);
      }
      evt.to = toEl || rootEl2;
      evt.from = fromEl || rootEl2;
      evt.item = targetEl || rootEl2;
      evt.clone = cloneEl2;
      evt.oldIndex = oldIndex2;
      evt.newIndex = newIndex2;
      evt.oldDraggableIndex = oldDraggableIndex2;
      evt.newDraggableIndex = newDraggableIndex2;
      evt.originalEvent = originalEvent;
      evt.pullMode = putSortable2 ? putSortable2.lastPutMode : void 0;
      var allEventProperties = _objectSpread2(_objectSpread2({}, extraEventProperties), PluginManager.getEventProperties(name, sortable));
      for (var option2 in allEventProperties) {
        evt[option2] = allEventProperties[option2];
      }
      if (rootEl2) {
        rootEl2.dispatchEvent(evt);
      }
      if (options[onName]) {
        options[onName].call(sortable, evt);
      }
    }
    var _excluded = ["evt"];
    var pluginEvent2 = function pluginEvent3(eventName, sortable) {
      var _ref = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, originalEvent = _ref.evt, data = _objectWithoutProperties(_ref, _excluded);
      PluginManager.pluginEvent.bind(Sortable)(eventName, sortable, _objectSpread2({
        dragEl,
        parentEl,
        ghostEl,
        rootEl,
        nextEl,
        lastDownEl,
        cloneEl,
        cloneHidden,
        dragStarted: moved,
        putSortable,
        activeSortable: Sortable.active,
        originalEvent,
        oldIndex,
        oldDraggableIndex,
        newIndex,
        newDraggableIndex,
        hideGhostForTarget: _hideGhostForTarget,
        unhideGhostForTarget: _unhideGhostForTarget,
        cloneNowHidden: function cloneNowHidden() {
          cloneHidden = true;
        },
        cloneNowShown: function cloneNowShown() {
          cloneHidden = false;
        },
        dispatchSortableEvent: function dispatchSortableEvent(name) {
          _dispatchEvent({
            sortable,
            name,
            originalEvent
          });
        }
      }, data));
    };
    function _dispatchEvent(info) {
      dispatchEvent(_objectSpread2({
        putSortable,
        cloneEl,
        targetEl: dragEl,
        rootEl,
        oldIndex,
        oldDraggableIndex,
        newIndex,
        newDraggableIndex
      }, info));
    }
    var dragEl;
    var parentEl;
    var ghostEl;
    var rootEl;
    var nextEl;
    var lastDownEl;
    var cloneEl;
    var cloneHidden;
    var oldIndex;
    var newIndex;
    var oldDraggableIndex;
    var newDraggableIndex;
    var activeGroup;
    var putSortable;
    var awaitingDragStarted = false;
    var ignoreNextClick = false;
    var sortables = [];
    var tapEvt;
    var touchEvt;
    var lastDx;
    var lastDy;
    var tapDistanceLeft;
    var tapDistanceTop;
    var moved;
    var lastTarget;
    var lastDirection;
    var pastFirstInvertThresh = false;
    var isCircumstantialInvert = false;
    var targetMoveDistance;
    var ghostRelativeParent;
    var ghostRelativeParentInitialScroll = [];
    var _silent = false;
    var savedInputChecked = [];
    var documentExists = typeof document !== "undefined";
    var PositionGhostAbsolutely = IOS;
    var CSSFloatProperty = Edge || IE11OrLess ? "cssFloat" : "float";
    var supportDraggable = documentExists && !ChromeForAndroid && !IOS && "draggable" in document.createElement("div");
    var supportCssPointerEvents = (function() {
      if (!documentExists) return;
      if (IE11OrLess) {
        return false;
      }
      var el = document.createElement("x");
      el.style.cssText = "pointer-events:auto";
      return el.style.pointerEvents === "auto";
    })();
    var _detectDirection = function _detectDirection2(el, options) {
      var elCSS = css(el), elWidth = parseInt(elCSS.width) - parseInt(elCSS.paddingLeft) - parseInt(elCSS.paddingRight) - parseInt(elCSS.borderLeftWidth) - parseInt(elCSS.borderRightWidth), child1 = getChild(el, 0, options), child2 = getChild(el, 1, options), firstChildCSS = child1 && css(child1), secondChildCSS = child2 && css(child2), firstChildWidth = firstChildCSS && parseInt(firstChildCSS.marginLeft) + parseInt(firstChildCSS.marginRight) + getRect(child1).width, secondChildWidth = secondChildCSS && parseInt(secondChildCSS.marginLeft) + parseInt(secondChildCSS.marginRight) + getRect(child2).width;
      if (elCSS.display === "flex") {
        return elCSS.flexDirection === "column" || elCSS.flexDirection === "column-reverse" ? "vertical" : "horizontal";
      }
      if (elCSS.display === "grid") {
        return elCSS.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
      }
      if (child1 && firstChildCSS["float"] && firstChildCSS["float"] !== "none") {
        var touchingSideChild2 = firstChildCSS["float"] === "left" ? "left" : "right";
        return child2 && (secondChildCSS.clear === "both" || secondChildCSS.clear === touchingSideChild2) ? "vertical" : "horizontal";
      }
      return child1 && (firstChildCSS.display === "block" || firstChildCSS.display === "flex" || firstChildCSS.display === "table" || firstChildCSS.display === "grid" || firstChildWidth >= elWidth && elCSS[CSSFloatProperty] === "none" || child2 && elCSS[CSSFloatProperty] === "none" && firstChildWidth + secondChildWidth > elWidth) ? "vertical" : "horizontal";
    };
    var _dragElInRowColumn = function _dragElInRowColumn2(dragRect, targetRect, vertical) {
      var dragElS1Opp = vertical ? dragRect.left : dragRect.top, dragElS2Opp = vertical ? dragRect.right : dragRect.bottom, dragElOppLength = vertical ? dragRect.width : dragRect.height, targetS1Opp = vertical ? targetRect.left : targetRect.top, targetS2Opp = vertical ? targetRect.right : targetRect.bottom, targetOppLength = vertical ? targetRect.width : targetRect.height;
      return dragElS1Opp === targetS1Opp || dragElS2Opp === targetS2Opp || dragElS1Opp + dragElOppLength / 2 === targetS1Opp + targetOppLength / 2;
    };
    var _detectNearestEmptySortable = function _detectNearestEmptySortable2(x, y) {
      var ret;
      sortables.some(function(sortable) {
        var threshold = sortable[expando].options.emptyInsertThreshold;
        if (!threshold || lastChild(sortable)) return;
        var rect = getRect(sortable), insideHorizontally = x >= rect.left - threshold && x <= rect.right + threshold, insideVertically = y >= rect.top - threshold && y <= rect.bottom + threshold;
        if (insideHorizontally && insideVertically) {
          return ret = sortable;
        }
      });
      return ret;
    };
    var _prepareGroup = function _prepareGroup2(options) {
      function toFn(value, pull) {
        return function(to, from, dragEl2, evt) {
          var sameGroup = to.options.group.name && from.options.group.name && to.options.group.name === from.options.group.name;
          if (value == null && (pull || sameGroup)) {
            return true;
          } else if (value == null || value === false) {
            return false;
          } else if (pull && value === "clone") {
            return value;
          } else if (typeof value === "function") {
            return toFn(value(to, from, dragEl2, evt), pull)(to, from, dragEl2, evt);
          } else {
            var otherGroup = (pull ? to : from).options.group.name;
            return value === true || typeof value === "string" && value === otherGroup || value.join && value.indexOf(otherGroup) > -1;
          }
        };
      }
      var group = {};
      var originalGroup = options.group;
      if (!originalGroup || _typeof(originalGroup) != "object") {
        originalGroup = {
          name: originalGroup
        };
      }
      group.name = originalGroup.name;
      group.checkPull = toFn(originalGroup.pull, true);
      group.checkPut = toFn(originalGroup.put);
      group.revertClone = originalGroup.revertClone;
      options.group = group;
    };
    var _hideGhostForTarget = function _hideGhostForTarget2() {
      if (!supportCssPointerEvents && ghostEl) {
        css(ghostEl, "display", "none");
      }
    };
    var _unhideGhostForTarget = function _unhideGhostForTarget2() {
      if (!supportCssPointerEvents && ghostEl) {
        css(ghostEl, "display", "");
      }
    };
    if (documentExists && !ChromeForAndroid) {
      document.addEventListener("click", function(evt) {
        if (ignoreNextClick) {
          evt.preventDefault();
          evt.stopPropagation && evt.stopPropagation();
          evt.stopImmediatePropagation && evt.stopImmediatePropagation();
          ignoreNextClick = false;
          return false;
        }
      }, true);
    }
    var nearestEmptyInsertDetectEvent = function nearestEmptyInsertDetectEvent2(evt) {
      if (dragEl) {
        evt = evt.touches ? evt.touches[0] : evt;
        var nearest = _detectNearestEmptySortable(evt.clientX, evt.clientY);
        if (nearest) {
          var event = {};
          for (var i in evt) {
            if (evt.hasOwnProperty(i)) {
              event[i] = evt[i];
            }
          }
          event.target = event.rootEl = nearest;
          event.preventDefault = void 0;
          event.stopPropagation = void 0;
          nearest[expando]._onDragOver(event);
        }
      }
    };
    var _checkOutsideTargetEl = function _checkOutsideTargetEl2(evt) {
      if (dragEl) {
        dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
      }
    };
    function Sortable(el, options) {
      if (!(el && el.nodeType && el.nodeType === 1)) {
        throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(el));
      }
      this.el = el;
      this.options = options = _extends({}, options);
      el[expando] = this;
      var defaults2 = {
        group: null,
        sort: true,
        disabled: false,
        store: null,
        handle: null,
        draggable: /^[uo]l$/i.test(el.nodeName) ? ">li" : ">*",
        swapThreshold: 1,
        // percentage; 0 <= x <= 1
        invertSwap: false,
        // invert always
        invertedSwapThreshold: null,
        // will be set to same as swapThreshold if default
        removeCloneOnHide: true,
        direction: function direction() {
          return _detectDirection(el, this.options);
        },
        ghostClass: "sortable-ghost",
        chosenClass: "sortable-chosen",
        dragClass: "sortable-drag",
        ignore: "a, img",
        filter: null,
        preventOnFilter: true,
        animation: 0,
        easing: null,
        setData: function setData(dataTransfer, dragEl2) {
          dataTransfer.setData("Text", dragEl2.textContent);
        },
        dropBubble: false,
        dragoverBubble: false,
        dataIdAttr: "data-id",
        delay: 0,
        delayOnTouchOnly: false,
        touchStartThreshold: (Number.parseInt ? Number : window).parseInt(window.devicePixelRatio, 10) || 1,
        forceFallback: false,
        fallbackClass: "sortable-fallback",
        fallbackOnBody: false,
        fallbackTolerance: 0,
        fallbackOffset: {
          x: 0,
          y: 0
        },
        // Disabled on Safari: #1571; Enabled on Safari IOS: #2244
        supportPointer: Sortable.supportPointer !== false && "PointerEvent" in window && (!Safari || IOS),
        emptyInsertThreshold: 5
      };
      PluginManager.initializePlugins(this, el, defaults2);
      for (var name in defaults2) {
        !(name in options) && (options[name] = defaults2[name]);
      }
      _prepareGroup(options);
      for (var fn in this) {
        if (fn.charAt(0) === "_" && typeof this[fn] === "function") {
          this[fn] = this[fn].bind(this);
        }
      }
      this.nativeDraggable = options.forceFallback ? false : supportDraggable;
      if (this.nativeDraggable) {
        this.options.touchStartThreshold = 1;
      }
      if (options.supportPointer) {
        on(el, "pointerdown", this._onTapStart);
      } else {
        on(el, "mousedown", this._onTapStart);
        on(el, "touchstart", this._onTapStart);
      }
      if (this.nativeDraggable) {
        on(el, "dragover", this);
        on(el, "dragenter", this);
      }
      sortables.push(this.el);
      options.store && options.store.get && this.sort(options.store.get(this) || []);
      _extends(this, AnimationStateManager());
    }
    Sortable.prototype = /** @lends Sortable.prototype */
    {
      constructor: Sortable,
      _isOutsideThisEl: function _isOutsideThisEl(target) {
        if (!this.el.contains(target) && target !== this.el) {
          lastTarget = null;
        }
      },
      _getDirection: function _getDirection(evt, target) {
        return typeof this.options.direction === "function" ? this.options.direction.call(this, evt, target, dragEl) : this.options.direction;
      },
      _onTapStart: function _onTapStart(evt) {
        if (!evt.cancelable) return;
        var _this = this, el = this.el, options = this.options, preventOnFilter = options.preventOnFilter, type = evt.type, touch = evt.touches && evt.touches[0] || evt.pointerType && evt.pointerType === "touch" && evt, target = (touch || evt).target, originalTarget = evt.target.shadowRoot && (evt.path && evt.path[0] || evt.composedPath && evt.composedPath()[0]) || target, filter = options.filter;
        _saveInputCheckedState(el);
        if (dragEl) {
          return;
        }
        if (/mousedown|pointerdown/.test(type) && evt.button !== 0 || options.disabled) {
          return;
        }
        if (originalTarget.isContentEditable) {
          return;
        }
        if (!this.nativeDraggable && Safari && target && target.tagName.toUpperCase() === "SELECT") {
          return;
        }
        target = closest(target, options.draggable, el, false);
        if (target && target.animated) {
          return;
        }
        if (lastDownEl === target) {
          return;
        }
        oldIndex = index(target);
        oldDraggableIndex = index(target, options.draggable);
        if (typeof filter === "function") {
          if (filter.call(this, evt, target, this)) {
            _dispatchEvent({
              sortable: _this,
              rootEl: originalTarget,
              name: "filter",
              targetEl: target,
              toEl: el,
              fromEl: el
            });
            pluginEvent2("filter", _this, {
              evt
            });
            preventOnFilter && evt.preventDefault();
            return;
          }
        } else if (filter) {
          filter = filter.split(",").some(function(criteria) {
            criteria = closest(originalTarget, criteria.trim(), el, false);
            if (criteria) {
              _dispatchEvent({
                sortable: _this,
                rootEl: criteria,
                name: "filter",
                targetEl: target,
                fromEl: el,
                toEl: el
              });
              pluginEvent2("filter", _this, {
                evt
              });
              return true;
            }
          });
          if (filter) {
            preventOnFilter && evt.preventDefault();
            return;
          }
        }
        if (options.handle && !closest(originalTarget, options.handle, el, false)) {
          return;
        }
        this._prepareDragStart(evt, touch, target);
      },
      _prepareDragStart: function _prepareDragStart(evt, touch, target) {
        var _this = this, el = _this.el, options = _this.options, ownerDocument = el.ownerDocument, dragStartFn;
        if (target && !dragEl && target.parentNode === el) {
          var dragRect = getRect(target);
          rootEl = el;
          dragEl = target;
          parentEl = dragEl.parentNode;
          nextEl = dragEl.nextSibling;
          lastDownEl = target;
          activeGroup = options.group;
          Sortable.dragged = dragEl;
          tapEvt = {
            target: dragEl,
            clientX: (touch || evt).clientX,
            clientY: (touch || evt).clientY
          };
          tapDistanceLeft = tapEvt.clientX - dragRect.left;
          tapDistanceTop = tapEvt.clientY - dragRect.top;
          this._lastX = (touch || evt).clientX;
          this._lastY = (touch || evt).clientY;
          dragEl.style["will-change"] = "all";
          dragStartFn = function dragStartFn2() {
            pluginEvent2("delayEnded", _this, {
              evt
            });
            if (Sortable.eventCanceled) {
              _this._onDrop();
              return;
            }
            _this._disableDelayedDragEvents();
            if (!FireFox && _this.nativeDraggable) {
              dragEl.draggable = true;
            }
            _this._triggerDragStart(evt, touch);
            _dispatchEvent({
              sortable: _this,
              name: "choose",
              originalEvent: evt
            });
            toggleClass(dragEl, options.chosenClass, true);
          };
          options.ignore.split(",").forEach(function(criteria) {
            find(dragEl, criteria.trim(), _disableDraggable);
          });
          on(ownerDocument, "dragover", nearestEmptyInsertDetectEvent);
          on(ownerDocument, "mousemove", nearestEmptyInsertDetectEvent);
          on(ownerDocument, "touchmove", nearestEmptyInsertDetectEvent);
          if (options.supportPointer) {
            on(ownerDocument, "pointerup", _this._onDrop);
            !this.nativeDraggable && on(ownerDocument, "pointercancel", _this._onDrop);
          } else {
            on(ownerDocument, "mouseup", _this._onDrop);
            on(ownerDocument, "touchend", _this._onDrop);
            on(ownerDocument, "touchcancel", _this._onDrop);
          }
          if (FireFox && this.nativeDraggable) {
            this.options.touchStartThreshold = 4;
            dragEl.draggable = true;
          }
          pluginEvent2("delayStart", this, {
            evt
          });
          if (options.delay && (!options.delayOnTouchOnly || touch) && (!this.nativeDraggable || !(Edge || IE11OrLess))) {
            if (Sortable.eventCanceled) {
              this._onDrop();
              return;
            }
            if (options.supportPointer) {
              on(ownerDocument, "pointerup", _this._disableDelayedDrag);
              on(ownerDocument, "pointercancel", _this._disableDelayedDrag);
            } else {
              on(ownerDocument, "mouseup", _this._disableDelayedDrag);
              on(ownerDocument, "touchend", _this._disableDelayedDrag);
              on(ownerDocument, "touchcancel", _this._disableDelayedDrag);
            }
            on(ownerDocument, "mousemove", _this._delayedDragTouchMoveHandler);
            on(ownerDocument, "touchmove", _this._delayedDragTouchMoveHandler);
            options.supportPointer && on(ownerDocument, "pointermove", _this._delayedDragTouchMoveHandler);
            _this._dragStartTimer = setTimeout(dragStartFn, options.delay);
          } else {
            dragStartFn();
          }
        }
      },
      _delayedDragTouchMoveHandler: function _delayedDragTouchMoveHandler(e) {
        var touch = e.touches ? e.touches[0] : e;
        if (Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1))) {
          this._disableDelayedDrag();
        }
      },
      _disableDelayedDrag: function _disableDelayedDrag() {
        dragEl && _disableDraggable(dragEl);
        clearTimeout(this._dragStartTimer);
        this._disableDelayedDragEvents();
      },
      _disableDelayedDragEvents: function _disableDelayedDragEvents() {
        var ownerDocument = this.el.ownerDocument;
        off(ownerDocument, "mouseup", this._disableDelayedDrag);
        off(ownerDocument, "touchend", this._disableDelayedDrag);
        off(ownerDocument, "touchcancel", this._disableDelayedDrag);
        off(ownerDocument, "pointerup", this._disableDelayedDrag);
        off(ownerDocument, "pointercancel", this._disableDelayedDrag);
        off(ownerDocument, "mousemove", this._delayedDragTouchMoveHandler);
        off(ownerDocument, "touchmove", this._delayedDragTouchMoveHandler);
        off(ownerDocument, "pointermove", this._delayedDragTouchMoveHandler);
      },
      _triggerDragStart: function _triggerDragStart(evt, touch) {
        touch = touch || evt.pointerType == "touch" && evt;
        if (!this.nativeDraggable || touch) {
          if (this.options.supportPointer) {
            on(document, "pointermove", this._onTouchMove);
          } else if (touch) {
            on(document, "touchmove", this._onTouchMove);
          } else {
            on(document, "mousemove", this._onTouchMove);
          }
        } else {
          on(dragEl, "dragend", this);
          on(rootEl, "dragstart", this._onDragStart);
        }
        try {
          if (document.selection) {
            _nextTick(function() {
              document.selection.empty();
            });
          } else {
            window.getSelection().removeAllRanges();
          }
        } catch (err) {
        }
      },
      _dragStarted: function _dragStarted(fallback, evt) {
        awaitingDragStarted = false;
        if (rootEl && dragEl) {
          pluginEvent2("dragStarted", this, {
            evt
          });
          if (this.nativeDraggable) {
            on(document, "dragover", _checkOutsideTargetEl);
          }
          var options = this.options;
          !fallback && toggleClass(dragEl, options.dragClass, false);
          toggleClass(dragEl, options.ghostClass, true);
          Sortable.active = this;
          fallback && this._appendGhost();
          _dispatchEvent({
            sortable: this,
            name: "start",
            originalEvent: evt
          });
        } else {
          this._nulling();
        }
      },
      _emulateDragOver: function _emulateDragOver() {
        if (touchEvt) {
          this._lastX = touchEvt.clientX;
          this._lastY = touchEvt.clientY;
          _hideGhostForTarget();
          var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
          var parent = target;
          while (target && target.shadowRoot) {
            target = target.shadowRoot.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
            if (target === parent) break;
            parent = target;
          }
          dragEl.parentNode[expando]._isOutsideThisEl(target);
          if (parent) {
            do {
              if (parent[expando]) {
                var inserted = void 0;
                inserted = parent[expando]._onDragOver({
                  clientX: touchEvt.clientX,
                  clientY: touchEvt.clientY,
                  target,
                  rootEl: parent
                });
                if (inserted && !this.options.dragoverBubble) {
                  break;
                }
              }
              target = parent;
            } while (parent = getParentOrHost(parent));
          }
          _unhideGhostForTarget();
        }
      },
      _onTouchMove: function _onTouchMove(evt) {
        if (tapEvt) {
          var options = this.options, fallbackTolerance = options.fallbackTolerance, fallbackOffset = options.fallbackOffset, touch = evt.touches ? evt.touches[0] : evt, ghostMatrix = ghostEl && matrix(ghostEl, true), scaleX = ghostEl && ghostMatrix && ghostMatrix.a, scaleY = ghostEl && ghostMatrix && ghostMatrix.d, relativeScrollOffset = PositionGhostAbsolutely && ghostRelativeParent && getRelativeScrollOffset(ghostRelativeParent), dx = (touch.clientX - tapEvt.clientX + fallbackOffset.x) / (scaleX || 1) + (relativeScrollOffset ? relativeScrollOffset[0] - ghostRelativeParentInitialScroll[0] : 0) / (scaleX || 1), dy = (touch.clientY - tapEvt.clientY + fallbackOffset.y) / (scaleY || 1) + (relativeScrollOffset ? relativeScrollOffset[1] - ghostRelativeParentInitialScroll[1] : 0) / (scaleY || 1);
          if (!Sortable.active && !awaitingDragStarted) {
            if (fallbackTolerance && Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) < fallbackTolerance) {
              return;
            }
            this._onDragStart(evt, true);
          }
          if (ghostEl) {
            if (ghostMatrix) {
              ghostMatrix.e += dx - (lastDx || 0);
              ghostMatrix.f += dy - (lastDy || 0);
            } else {
              ghostMatrix = {
                a: 1,
                b: 0,
                c: 0,
                d: 1,
                e: dx,
                f: dy
              };
            }
            var cssMatrix = "matrix(".concat(ghostMatrix.a, ",").concat(ghostMatrix.b, ",").concat(ghostMatrix.c, ",").concat(ghostMatrix.d, ",").concat(ghostMatrix.e, ",").concat(ghostMatrix.f, ")");
            css(ghostEl, "webkitTransform", cssMatrix);
            css(ghostEl, "mozTransform", cssMatrix);
            css(ghostEl, "msTransform", cssMatrix);
            css(ghostEl, "transform", cssMatrix);
            lastDx = dx;
            lastDy = dy;
            touchEvt = touch;
          }
          evt.cancelable && evt.preventDefault();
        }
      },
      _appendGhost: function _appendGhost() {
        if (!ghostEl) {
          var container = this.options.fallbackOnBody ? document.body : rootEl, rect = getRect(dragEl, true, PositionGhostAbsolutely, true, container), options = this.options;
          if (PositionGhostAbsolutely) {
            ghostRelativeParent = container;
            while (css(ghostRelativeParent, "position") === "static" && css(ghostRelativeParent, "transform") === "none" && ghostRelativeParent !== document) {
              ghostRelativeParent = ghostRelativeParent.parentNode;
            }
            if (ghostRelativeParent !== document.body && ghostRelativeParent !== document.documentElement) {
              if (ghostRelativeParent === document) ghostRelativeParent = getWindowScrollingElement();
              rect.top += ghostRelativeParent.scrollTop;
              rect.left += ghostRelativeParent.scrollLeft;
            } else {
              ghostRelativeParent = getWindowScrollingElement();
            }
            ghostRelativeParentInitialScroll = getRelativeScrollOffset(ghostRelativeParent);
          }
          ghostEl = dragEl.cloneNode(true);
          toggleClass(ghostEl, options.ghostClass, false);
          toggleClass(ghostEl, options.fallbackClass, true);
          toggleClass(ghostEl, options.dragClass, true);
          css(ghostEl, "transition", "");
          css(ghostEl, "transform", "");
          css(ghostEl, "box-sizing", "border-box");
          css(ghostEl, "margin", 0);
          css(ghostEl, "top", rect.top);
          css(ghostEl, "left", rect.left);
          css(ghostEl, "width", rect.width);
          css(ghostEl, "height", rect.height);
          css(ghostEl, "opacity", "0.8");
          css(ghostEl, "position", PositionGhostAbsolutely ? "absolute" : "fixed");
          css(ghostEl, "zIndex", "100000");
          css(ghostEl, "pointerEvents", "none");
          Sortable.ghost = ghostEl;
          container.appendChild(ghostEl);
          css(ghostEl, "transform-origin", tapDistanceLeft / parseInt(ghostEl.style.width) * 100 + "% " + tapDistanceTop / parseInt(ghostEl.style.height) * 100 + "%");
        }
      },
      _onDragStart: function _onDragStart(evt, fallback) {
        var _this = this;
        var dataTransfer = evt.dataTransfer;
        var options = _this.options;
        pluginEvent2("dragStart", this, {
          evt
        });
        if (Sortable.eventCanceled) {
          this._onDrop();
          return;
        }
        pluginEvent2("setupClone", this);
        if (!Sortable.eventCanceled) {
          cloneEl = clone(dragEl);
          cloneEl.removeAttribute("id");
          cloneEl.draggable = false;
          cloneEl.style["will-change"] = "";
          this._hideClone();
          toggleClass(cloneEl, this.options.chosenClass, false);
          Sortable.clone = cloneEl;
        }
        _this.cloneId = _nextTick(function() {
          pluginEvent2("clone", _this);
          if (Sortable.eventCanceled) return;
          if (!_this.options.removeCloneOnHide) {
            rootEl.insertBefore(cloneEl, dragEl);
          }
          _this._hideClone();
          _dispatchEvent({
            sortable: _this,
            name: "clone"
          });
        });
        !fallback && toggleClass(dragEl, options.dragClass, true);
        if (fallback) {
          ignoreNextClick = true;
          _this._loopId = setInterval(_this._emulateDragOver, 50);
        } else {
          off(document, "mouseup", _this._onDrop);
          off(document, "touchend", _this._onDrop);
          off(document, "touchcancel", _this._onDrop);
          if (dataTransfer) {
            dataTransfer.effectAllowed = "move";
            options.setData && options.setData.call(_this, dataTransfer, dragEl);
          }
          on(document, "drop", _this);
          css(dragEl, "transform", "translateZ(0)");
        }
        awaitingDragStarted = true;
        _this._dragStartId = _nextTick(_this._dragStarted.bind(_this, fallback, evt));
        on(document, "selectstart", _this);
        moved = true;
        window.getSelection().removeAllRanges();
        if (Safari) {
          css(document.body, "user-select", "none");
        }
      },
      // Returns true - if no further action is needed (either inserted or another condition)
      _onDragOver: function _onDragOver(evt) {
        var el = this.el, target = evt.target, dragRect, targetRect, revert, options = this.options, group = options.group, activeSortable = Sortable.active, isOwner = activeGroup === group, canSort = options.sort, fromSortable = putSortable || activeSortable, vertical, _this = this, completedFired = false;
        if (_silent) return;
        function dragOverEvent(name, extra) {
          pluginEvent2(name, _this, _objectSpread2({
            evt,
            isOwner,
            axis: vertical ? "vertical" : "horizontal",
            revert,
            dragRect,
            targetRect,
            canSort,
            fromSortable,
            target,
            completed,
            onMove: function onMove(target2, after2) {
              return _onMove(rootEl, el, dragEl, dragRect, target2, getRect(target2), evt, after2);
            },
            changed
          }, extra));
        }
        function capture() {
          dragOverEvent("dragOverAnimationCapture");
          _this.captureAnimationState();
          if (_this !== fromSortable) {
            fromSortable.captureAnimationState();
          }
        }
        function completed(insertion) {
          dragOverEvent("dragOverCompleted", {
            insertion
          });
          if (insertion) {
            if (isOwner) {
              activeSortable._hideClone();
            } else {
              activeSortable._showClone(_this);
            }
            if (_this !== fromSortable) {
              toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : activeSortable.options.ghostClass, false);
              toggleClass(dragEl, options.ghostClass, true);
            }
            if (putSortable !== _this && _this !== Sortable.active) {
              putSortable = _this;
            } else if (_this === Sortable.active && putSortable) {
              putSortable = null;
            }
            if (fromSortable === _this) {
              _this._ignoreWhileAnimating = target;
            }
            _this.animateAll(function() {
              dragOverEvent("dragOverAnimationComplete");
              _this._ignoreWhileAnimating = null;
            });
            if (_this !== fromSortable) {
              fromSortable.animateAll();
              fromSortable._ignoreWhileAnimating = null;
            }
          }
          if (target === dragEl && !dragEl.animated || target === el && !target.animated) {
            lastTarget = null;
          }
          if (!options.dragoverBubble && !evt.rootEl && target !== document) {
            dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
            !insertion && nearestEmptyInsertDetectEvent(evt);
          }
          !options.dragoverBubble && evt.stopPropagation && evt.stopPropagation();
          return completedFired = true;
        }
        function changed() {
          newIndex = index(dragEl);
          newDraggableIndex = index(dragEl, options.draggable);
          _dispatchEvent({
            sortable: _this,
            name: "change",
            toEl: el,
            newIndex,
            newDraggableIndex,
            originalEvent: evt
          });
        }
        if (evt.preventDefault !== void 0) {
          evt.cancelable && evt.preventDefault();
        }
        target = closest(target, options.draggable, el, true);
        dragOverEvent("dragOver");
        if (Sortable.eventCanceled) return completedFired;
        if (dragEl.contains(evt.target) || target.animated && target.animatingX && target.animatingY || _this._ignoreWhileAnimating === target) {
          return completed(false);
        }
        ignoreNextClick = false;
        if (activeSortable && !options.disabled && (isOwner ? canSort || (revert = parentEl !== rootEl) : putSortable === this || (this.lastPutMode = activeGroup.checkPull(this, activeSortable, dragEl, evt)) && group.checkPut(this, activeSortable, dragEl, evt))) {
          vertical = this._getDirection(evt, target) === "vertical";
          dragRect = getRect(dragEl);
          dragOverEvent("dragOverValid");
          if (Sortable.eventCanceled) return completedFired;
          if (revert) {
            parentEl = rootEl;
            capture();
            this._hideClone();
            dragOverEvent("revert");
            if (!Sortable.eventCanceled) {
              if (nextEl) {
                rootEl.insertBefore(dragEl, nextEl);
              } else {
                rootEl.appendChild(dragEl);
              }
            }
            return completed(true);
          }
          var elLastChild = lastChild(el, options.draggable);
          if (!elLastChild || _ghostIsLast(evt, vertical, this) && !elLastChild.animated) {
            if (elLastChild === dragEl) {
              return completed(false);
            }
            if (elLastChild && el === evt.target) {
              target = elLastChild;
            }
            if (target) {
              targetRect = getRect(target);
            }
            if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, !!target) !== false) {
              capture();
              if (elLastChild && elLastChild.nextSibling) {
                el.insertBefore(dragEl, elLastChild.nextSibling);
              } else {
                el.appendChild(dragEl);
              }
              parentEl = el;
              changed();
              return completed(true);
            }
          } else if (elLastChild && _ghostIsFirst(evt, vertical, this)) {
            var firstChild = getChild(el, 0, options, true);
            if (firstChild === dragEl) {
              return completed(false);
            }
            target = firstChild;
            targetRect = getRect(target);
            if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, false) !== false) {
              capture();
              el.insertBefore(dragEl, firstChild);
              parentEl = el;
              changed();
              return completed(true);
            }
          } else if (target.parentNode === el) {
            targetRect = getRect(target);
            var direction = 0, targetBeforeFirstSwap, differentLevel = dragEl.parentNode !== el, differentRowCol = !_dragElInRowColumn(dragEl.animated && dragEl.toRect || dragRect, target.animated && target.toRect || targetRect, vertical), side1 = vertical ? "top" : "left", scrolledPastTop = isScrolledPast(target, "top", "top") || isScrolledPast(dragEl, "top", "top"), scrollBefore = scrolledPastTop ? scrolledPastTop.scrollTop : void 0;
            if (lastTarget !== target) {
              targetBeforeFirstSwap = targetRect[side1];
              pastFirstInvertThresh = false;
              isCircumstantialInvert = !differentRowCol && options.invertSwap || differentLevel;
            }
            direction = _getSwapDirection(evt, target, targetRect, vertical, differentRowCol ? 1 : options.swapThreshold, options.invertedSwapThreshold == null ? options.swapThreshold : options.invertedSwapThreshold, isCircumstantialInvert, lastTarget === target);
            var sibling;
            if (direction !== 0) {
              var dragIndex = index(dragEl);
              do {
                dragIndex -= direction;
                sibling = parentEl.children[dragIndex];
              } while (sibling && (css(sibling, "display") === "none" || sibling === ghostEl));
            }
            if (direction === 0 || sibling === target) {
              return completed(false);
            }
            lastTarget = target;
            lastDirection = direction;
            var nextSibling = target.nextElementSibling, after = false;
            after = direction === 1;
            var moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, after);
            if (moveVector !== false) {
              if (moveVector === 1 || moveVector === -1) {
                after = moveVector === 1;
              }
              _silent = true;
              setTimeout(_unsilent, 30);
              capture();
              if (after && !nextSibling) {
                el.appendChild(dragEl);
              } else {
                target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
              }
              if (scrolledPastTop) {
                scrollBy(scrolledPastTop, 0, scrollBefore - scrolledPastTop.scrollTop);
              }
              parentEl = dragEl.parentNode;
              if (targetBeforeFirstSwap !== void 0 && !isCircumstantialInvert) {
                targetMoveDistance = Math.abs(targetBeforeFirstSwap - getRect(target)[side1]);
              }
              changed();
              return completed(true);
            }
          }
          if (el.contains(dragEl)) {
            return completed(false);
          }
        }
        return false;
      },
      _ignoreWhileAnimating: null,
      _offMoveEvents: function _offMoveEvents() {
        off(document, "mousemove", this._onTouchMove);
        off(document, "touchmove", this._onTouchMove);
        off(document, "pointermove", this._onTouchMove);
        off(document, "dragover", nearestEmptyInsertDetectEvent);
        off(document, "mousemove", nearestEmptyInsertDetectEvent);
        off(document, "touchmove", nearestEmptyInsertDetectEvent);
      },
      _offUpEvents: function _offUpEvents() {
        var ownerDocument = this.el.ownerDocument;
        off(ownerDocument, "mouseup", this._onDrop);
        off(ownerDocument, "touchend", this._onDrop);
        off(ownerDocument, "pointerup", this._onDrop);
        off(ownerDocument, "pointercancel", this._onDrop);
        off(ownerDocument, "touchcancel", this._onDrop);
        off(document, "selectstart", this);
      },
      _onDrop: function _onDrop(evt) {
        var el = this.el, options = this.options;
        newIndex = index(dragEl);
        newDraggableIndex = index(dragEl, options.draggable);
        pluginEvent2("drop", this, {
          evt
        });
        parentEl = dragEl && dragEl.parentNode;
        newIndex = index(dragEl);
        newDraggableIndex = index(dragEl, options.draggable);
        if (Sortable.eventCanceled) {
          this._nulling();
          return;
        }
        awaitingDragStarted = false;
        isCircumstantialInvert = false;
        pastFirstInvertThresh = false;
        clearInterval(this._loopId);
        clearTimeout(this._dragStartTimer);
        _cancelNextTick(this.cloneId);
        _cancelNextTick(this._dragStartId);
        if (this.nativeDraggable) {
          off(document, "drop", this);
          off(el, "dragstart", this._onDragStart);
        }
        this._offMoveEvents();
        this._offUpEvents();
        if (Safari) {
          css(document.body, "user-select", "");
        }
        css(dragEl, "transform", "");
        if (evt) {
          if (moved) {
            evt.cancelable && evt.preventDefault();
            !options.dropBubble && evt.stopPropagation();
          }
          ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);
          if (rootEl === parentEl || putSortable && putSortable.lastPutMode !== "clone") {
            cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
          }
          if (dragEl) {
            if (this.nativeDraggable) {
              off(dragEl, "dragend", this);
            }
            _disableDraggable(dragEl);
            dragEl.style["will-change"] = "";
            if (moved && !awaitingDragStarted) {
              toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : this.options.ghostClass, false);
            }
            toggleClass(dragEl, this.options.chosenClass, false);
            _dispatchEvent({
              sortable: this,
              name: "unchoose",
              toEl: parentEl,
              newIndex: null,
              newDraggableIndex: null,
              originalEvent: evt
            });
            if (rootEl !== parentEl) {
              if (newIndex >= 0) {
                _dispatchEvent({
                  rootEl: parentEl,
                  name: "add",
                  toEl: parentEl,
                  fromEl: rootEl,
                  originalEvent: evt
                });
                _dispatchEvent({
                  sortable: this,
                  name: "remove",
                  toEl: parentEl,
                  originalEvent: evt
                });
                _dispatchEvent({
                  rootEl: parentEl,
                  name: "sort",
                  toEl: parentEl,
                  fromEl: rootEl,
                  originalEvent: evt
                });
                _dispatchEvent({
                  sortable: this,
                  name: "sort",
                  toEl: parentEl,
                  originalEvent: evt
                });
              }
              putSortable && putSortable.save();
            } else {
              if (newIndex !== oldIndex) {
                if (newIndex >= 0) {
                  _dispatchEvent({
                    sortable: this,
                    name: "update",
                    toEl: parentEl,
                    originalEvent: evt
                  });
                  _dispatchEvent({
                    sortable: this,
                    name: "sort",
                    toEl: parentEl,
                    originalEvent: evt
                  });
                }
              }
            }
            if (Sortable.active) {
              if (newIndex == null || newIndex === -1) {
                newIndex = oldIndex;
                newDraggableIndex = oldDraggableIndex;
              }
              _dispatchEvent({
                sortable: this,
                name: "end",
                toEl: parentEl,
                originalEvent: evt
              });
              this.save();
            }
          }
        }
        this._nulling();
      },
      _nulling: function _nulling() {
        pluginEvent2("nulling", this);
        rootEl = dragEl = parentEl = ghostEl = nextEl = cloneEl = lastDownEl = cloneHidden = tapEvt = touchEvt = moved = newIndex = newDraggableIndex = oldIndex = oldDraggableIndex = lastTarget = lastDirection = putSortable = activeGroup = Sortable.dragged = Sortable.ghost = Sortable.clone = Sortable.active = null;
        var el = this.el;
        savedInputChecked.forEach(function(checkEl) {
          if (el.contains(checkEl)) {
            checkEl.checked = true;
          }
        });
        savedInputChecked.length = lastDx = lastDy = 0;
      },
      handleEvent: function handleEvent(evt) {
        switch (evt.type) {
          case "drop":
          case "dragend":
            this._onDrop(evt);
            break;
          case "dragenter":
          case "dragover":
            if (dragEl) {
              this._onDragOver(evt);
              _globalDragOver(evt);
            }
            break;
          case "selectstart":
            evt.preventDefault();
            break;
        }
      },
      /**
       * Serializes the item into an array of string.
       * @returns {String[]}
       */
      toArray: function toArray() {
        var order = [], el, children = this.el.children, i = 0, n = children.length, options = this.options;
        for (; i < n; i++) {
          el = children[i];
          if (closest(el, options.draggable, this.el, false)) {
            order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
          }
        }
        return order;
      },
      /**
       * Sorts the elements according to the array.
       * @param  {String[]}  order  order of the items
       */
      sort: function sort(order, useAnimation) {
        var items = {}, rootEl2 = this.el;
        this.toArray().forEach(function(id, i) {
          var el = rootEl2.children[i];
          if (closest(el, this.options.draggable, rootEl2, false)) {
            items[id] = el;
          }
        }, this);
        useAnimation && this.captureAnimationState();
        order.forEach(function(id) {
          if (items[id]) {
            rootEl2.removeChild(items[id]);
            rootEl2.appendChild(items[id]);
          }
        });
        useAnimation && this.animateAll();
      },
      /**
       * Save the current sorting
       */
      save: function save() {
        var store = this.options.store;
        store && store.set && store.set(this);
      },
      /**
       * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
       * @param   {HTMLElement}  el
       * @param   {String}       [selector]  default: `options.draggable`
       * @returns {HTMLElement|null}
       */
      closest: function closest$1(el, selector) {
        return closest(el, selector || this.options.draggable, this.el, false);
      },
      /**
       * Set/get option
       * @param   {string} name
       * @param   {*}      [value]
       * @returns {*}
       */
      option: function option(name, value) {
        var options = this.options;
        if (value === void 0) {
          return options[name];
        } else {
          var modifiedValue = PluginManager.modifyOption(this, name, value);
          if (typeof modifiedValue !== "undefined") {
            options[name] = modifiedValue;
          } else {
            options[name] = value;
          }
          if (name === "group") {
            _prepareGroup(options);
          }
        }
      },
      /**
       * Destroy
       */
      destroy: function destroy() {
        pluginEvent2("destroy", this);
        var el = this.el;
        el[expando] = null;
        off(el, "mousedown", this._onTapStart);
        off(el, "touchstart", this._onTapStart);
        off(el, "pointerdown", this._onTapStart);
        if (this.nativeDraggable) {
          off(el, "dragover", this);
          off(el, "dragenter", this);
        }
        Array.prototype.forEach.call(el.querySelectorAll("[draggable]"), function(el2) {
          el2.removeAttribute("draggable");
        });
        this._onDrop();
        this._disableDelayedDragEvents();
        sortables.splice(sortables.indexOf(this.el), 1);
        this.el = el = null;
      },
      _hideClone: function _hideClone() {
        if (!cloneHidden) {
          pluginEvent2("hideClone", this);
          if (Sortable.eventCanceled) return;
          css(cloneEl, "display", "none");
          if (this.options.removeCloneOnHide && cloneEl.parentNode) {
            cloneEl.parentNode.removeChild(cloneEl);
          }
          cloneHidden = true;
        }
      },
      _showClone: function _showClone(putSortable2) {
        if (putSortable2.lastPutMode !== "clone") {
          this._hideClone();
          return;
        }
        if (cloneHidden) {
          pluginEvent2("showClone", this);
          if (Sortable.eventCanceled) return;
          if (dragEl.parentNode == rootEl && !this.options.group.revertClone) {
            rootEl.insertBefore(cloneEl, dragEl);
          } else if (nextEl) {
            rootEl.insertBefore(cloneEl, nextEl);
          } else {
            rootEl.appendChild(cloneEl);
          }
          if (this.options.group.revertClone) {
            this.animate(dragEl, cloneEl);
          }
          css(cloneEl, "display", "");
          cloneHidden = false;
        }
      }
    };
    function _globalDragOver(evt) {
      if (evt.dataTransfer) {
        evt.dataTransfer.dropEffect = "move";
      }
      evt.cancelable && evt.preventDefault();
    }
    function _onMove(fromEl, toEl, dragEl2, dragRect, targetEl, targetRect, originalEvent, willInsertAfter) {
      var evt, sortable = fromEl[expando], onMoveFn = sortable.options.onMove, retVal;
      if (window.CustomEvent && !IE11OrLess && !Edge) {
        evt = new CustomEvent("move", {
          bubbles: true,
          cancelable: true
        });
      } else {
        evt = document.createEvent("Event");
        evt.initEvent("move", true, true);
      }
      evt.to = toEl;
      evt.from = fromEl;
      evt.dragged = dragEl2;
      evt.draggedRect = dragRect;
      evt.related = targetEl || toEl;
      evt.relatedRect = targetRect || getRect(toEl);
      evt.willInsertAfter = willInsertAfter;
      evt.originalEvent = originalEvent;
      fromEl.dispatchEvent(evt);
      if (onMoveFn) {
        retVal = onMoveFn.call(sortable, evt, originalEvent);
      }
      return retVal;
    }
    function _disableDraggable(el) {
      el.draggable = false;
    }
    function _unsilent() {
      _silent = false;
    }
    function _ghostIsFirst(evt, vertical, sortable) {
      var firstElRect = getRect(getChild(sortable.el, 0, sortable.options, true));
      var childContainingRect = getChildContainingRectFromElement(sortable.el, sortable.options, ghostEl);
      var spacer = 10;
      return vertical ? evt.clientX < childContainingRect.left - spacer || evt.clientY < firstElRect.top && evt.clientX < firstElRect.right : evt.clientY < childContainingRect.top - spacer || evt.clientY < firstElRect.bottom && evt.clientX < firstElRect.left;
    }
    function _ghostIsLast(evt, vertical, sortable) {
      var lastElRect = getRect(lastChild(sortable.el, sortable.options.draggable));
      var childContainingRect = getChildContainingRectFromElement(sortable.el, sortable.options, ghostEl);
      var spacer = 10;
      return vertical ? evt.clientX > childContainingRect.right + spacer || evt.clientY > lastElRect.bottom && evt.clientX > lastElRect.left : evt.clientY > childContainingRect.bottom + spacer || evt.clientX > lastElRect.right && evt.clientY > lastElRect.top;
    }
    function _getSwapDirection(evt, target, targetRect, vertical, swapThreshold, invertedSwapThreshold, invertSwap, isLastTarget) {
      var mouseOnAxis = vertical ? evt.clientY : evt.clientX, targetLength = vertical ? targetRect.height : targetRect.width, targetS1 = vertical ? targetRect.top : targetRect.left, targetS2 = vertical ? targetRect.bottom : targetRect.right, invert = false;
      if (!invertSwap) {
        if (isLastTarget && targetMoveDistance < targetLength * swapThreshold) {
          if (!pastFirstInvertThresh && (lastDirection === 1 ? mouseOnAxis > targetS1 + targetLength * invertedSwapThreshold / 2 : mouseOnAxis < targetS2 - targetLength * invertedSwapThreshold / 2)) {
            pastFirstInvertThresh = true;
          }
          if (!pastFirstInvertThresh) {
            if (lastDirection === 1 ? mouseOnAxis < targetS1 + targetMoveDistance : mouseOnAxis > targetS2 - targetMoveDistance) {
              return -lastDirection;
            }
          } else {
            invert = true;
          }
        } else {
          if (mouseOnAxis > targetS1 + targetLength * (1 - swapThreshold) / 2 && mouseOnAxis < targetS2 - targetLength * (1 - swapThreshold) / 2) {
            return _getInsertDirection(target);
          }
        }
      }
      invert = invert || invertSwap;
      if (invert) {
        if (mouseOnAxis < targetS1 + targetLength * invertedSwapThreshold / 2 || mouseOnAxis > targetS2 - targetLength * invertedSwapThreshold / 2) {
          return mouseOnAxis > targetS1 + targetLength / 2 ? 1 : -1;
        }
      }
      return 0;
    }
    function _getInsertDirection(target) {
      if (index(dragEl) < index(target)) {
        return 1;
      } else {
        return -1;
      }
    }
    function _generateId(el) {
      var str = el.tagName + el.className + el.src + el.href + el.textContent, i = str.length, sum = 0;
      while (i--) {
        sum += str.charCodeAt(i);
      }
      return sum.toString(36);
    }
    function _saveInputCheckedState(root) {
      savedInputChecked.length = 0;
      var inputs = root.getElementsByTagName("input");
      var idx = inputs.length;
      while (idx--) {
        var el = inputs[idx];
        el.checked && savedInputChecked.push(el);
      }
    }
    function _nextTick(fn) {
      return setTimeout(fn, 0);
    }
    function _cancelNextTick(id) {
      return clearTimeout(id);
    }
    if (documentExists) {
      on(document, "touchmove", function(evt) {
        if ((Sortable.active || awaitingDragStarted) && evt.cancelable) {
          evt.preventDefault();
        }
      });
    }
    Sortable.utils = {
      on,
      off,
      css,
      find,
      is: function is(el, selector) {
        return !!closest(el, selector, el, false);
      },
      extend,
      throttle,
      closest,
      toggleClass,
      clone,
      index,
      nextTick: _nextTick,
      cancelNextTick: _cancelNextTick,
      detectDirection: _detectDirection,
      getChild,
      expando
    };
    Sortable.get = function(element) {
      return element[expando];
    };
    Sortable.mount = function() {
      for (var _len = arguments.length, plugins2 = new Array(_len), _key = 0; _key < _len; _key++) {
        plugins2[_key] = arguments[_key];
      }
      if (plugins2[0].constructor === Array) plugins2 = plugins2[0];
      plugins2.forEach(function(plugin) {
        if (!plugin.prototype || !plugin.prototype.constructor) {
          throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(plugin));
        }
        if (plugin.utils) Sortable.utils = _objectSpread2(_objectSpread2({}, Sortable.utils), plugin.utils);
        PluginManager.mount(plugin);
      });
    };
    Sortable.create = function(el, options) {
      return new Sortable(el, options);
    };
    Sortable.version = version;
    var autoScrolls = [];
    var scrollEl;
    var scrollRootEl;
    var scrolling = false;
    var lastAutoScrollX;
    var lastAutoScrollY;
    var touchEvt$1;
    var pointerElemChangedInterval;
    function AutoScrollPlugin() {
      function AutoScroll() {
        this.defaults = {
          scroll: true,
          forceAutoScrollFallback: false,
          scrollSensitivity: 30,
          scrollSpeed: 10,
          bubbleScroll: true
        };
        for (var fn in this) {
          if (fn.charAt(0) === "_" && typeof this[fn] === "function") {
            this[fn] = this[fn].bind(this);
          }
        }
      }
      AutoScroll.prototype = {
        dragStarted: function dragStarted(_ref) {
          var originalEvent = _ref.originalEvent;
          if (this.sortable.nativeDraggable) {
            on(document, "dragover", this._handleAutoScroll);
          } else {
            if (this.options.supportPointer) {
              on(document, "pointermove", this._handleFallbackAutoScroll);
            } else if (originalEvent.touches) {
              on(document, "touchmove", this._handleFallbackAutoScroll);
            } else {
              on(document, "mousemove", this._handleFallbackAutoScroll);
            }
          }
        },
        dragOverCompleted: function dragOverCompleted(_ref2) {
          var originalEvent = _ref2.originalEvent;
          if (!this.options.dragOverBubble && !originalEvent.rootEl) {
            this._handleAutoScroll(originalEvent);
          }
        },
        drop: function drop3() {
          if (this.sortable.nativeDraggable) {
            off(document, "dragover", this._handleAutoScroll);
          } else {
            off(document, "pointermove", this._handleFallbackAutoScroll);
            off(document, "touchmove", this._handleFallbackAutoScroll);
            off(document, "mousemove", this._handleFallbackAutoScroll);
          }
          clearPointerElemChangedInterval();
          clearAutoScrolls();
          cancelThrottle();
        },
        nulling: function nulling() {
          touchEvt$1 = scrollRootEl = scrollEl = scrolling = pointerElemChangedInterval = lastAutoScrollX = lastAutoScrollY = null;
          autoScrolls.length = 0;
        },
        _handleFallbackAutoScroll: function _handleFallbackAutoScroll(evt) {
          this._handleAutoScroll(evt, true);
        },
        _handleAutoScroll: function _handleAutoScroll(evt, fallback) {
          var _this = this;
          var x = (evt.touches ? evt.touches[0] : evt).clientX, y = (evt.touches ? evt.touches[0] : evt).clientY, elem = document.elementFromPoint(x, y);
          touchEvt$1 = evt;
          if (fallback || this.options.forceAutoScrollFallback || Edge || IE11OrLess || Safari) {
            autoScroll(evt, this.options, elem, fallback);
            var ogElemScroller = getParentAutoScrollElement(elem, true);
            if (scrolling && (!pointerElemChangedInterval || x !== lastAutoScrollX || y !== lastAutoScrollY)) {
              pointerElemChangedInterval && clearPointerElemChangedInterval();
              pointerElemChangedInterval = setInterval(function() {
                var newElem = getParentAutoScrollElement(document.elementFromPoint(x, y), true);
                if (newElem !== ogElemScroller) {
                  ogElemScroller = newElem;
                  clearAutoScrolls();
                }
                autoScroll(evt, _this.options, newElem, fallback);
              }, 10);
              lastAutoScrollX = x;
              lastAutoScrollY = y;
            }
          } else {
            if (!this.options.bubbleScroll || getParentAutoScrollElement(elem, true) === getWindowScrollingElement()) {
              clearAutoScrolls();
              return;
            }
            autoScroll(evt, this.options, getParentAutoScrollElement(elem, false), false);
          }
        }
      };
      return _extends(AutoScroll, {
        pluginName: "scroll",
        initializeByDefault: true
      });
    }
    function clearAutoScrolls() {
      autoScrolls.forEach(function(autoScroll2) {
        clearInterval(autoScroll2.pid);
      });
      autoScrolls = [];
    }
    function clearPointerElemChangedInterval() {
      clearInterval(pointerElemChangedInterval);
    }
    var autoScroll = throttle(function(evt, options, rootEl2, isFallback) {
      if (!options.scroll) return;
      var x = (evt.touches ? evt.touches[0] : evt).clientX, y = (evt.touches ? evt.touches[0] : evt).clientY, sens = options.scrollSensitivity, speed = options.scrollSpeed, winScroller = getWindowScrollingElement();
      var scrollThisInstance = false, scrollCustomFn;
      if (scrollRootEl !== rootEl2) {
        scrollRootEl = rootEl2;
        clearAutoScrolls();
        scrollEl = options.scroll;
        scrollCustomFn = options.scrollFn;
        if (scrollEl === true) {
          scrollEl = getParentAutoScrollElement(rootEl2, true);
        }
      }
      var layersOut = 0;
      var currentParent = scrollEl;
      do {
        var el = currentParent, rect = getRect(el), top = rect.top, bottom = rect.bottom, left = rect.left, right = rect.right, width = rect.width, height = rect.height, canScrollX = void 0, canScrollY = void 0, scrollWidth = el.scrollWidth, scrollHeight = el.scrollHeight, elCSS = css(el), scrollPosX = el.scrollLeft, scrollPosY = el.scrollTop;
        if (el === winScroller) {
          canScrollX = width < scrollWidth && (elCSS.overflowX === "auto" || elCSS.overflowX === "scroll" || elCSS.overflowX === "visible");
          canScrollY = height < scrollHeight && (elCSS.overflowY === "auto" || elCSS.overflowY === "scroll" || elCSS.overflowY === "visible");
        } else {
          canScrollX = width < scrollWidth && (elCSS.overflowX === "auto" || elCSS.overflowX === "scroll");
          canScrollY = height < scrollHeight && (elCSS.overflowY === "auto" || elCSS.overflowY === "scroll");
        }
        var vx = canScrollX && (Math.abs(right - x) <= sens && scrollPosX + width < scrollWidth) - (Math.abs(left - x) <= sens && !!scrollPosX);
        var vy = canScrollY && (Math.abs(bottom - y) <= sens && scrollPosY + height < scrollHeight) - (Math.abs(top - y) <= sens && !!scrollPosY);
        if (!autoScrolls[layersOut]) {
          for (var i = 0; i <= layersOut; i++) {
            if (!autoScrolls[i]) {
              autoScrolls[i] = {};
            }
          }
        }
        if (autoScrolls[layersOut].vx != vx || autoScrolls[layersOut].vy != vy || autoScrolls[layersOut].el !== el) {
          autoScrolls[layersOut].el = el;
          autoScrolls[layersOut].vx = vx;
          autoScrolls[layersOut].vy = vy;
          clearInterval(autoScrolls[layersOut].pid);
          if (vx != 0 || vy != 0) {
            scrollThisInstance = true;
            autoScrolls[layersOut].pid = setInterval(function() {
              if (isFallback && this.layer === 0) {
                Sortable.active._onTouchMove(touchEvt$1);
              }
              var scrollOffsetY = autoScrolls[this.layer].vy ? autoScrolls[this.layer].vy * speed : 0;
              var scrollOffsetX = autoScrolls[this.layer].vx ? autoScrolls[this.layer].vx * speed : 0;
              if (typeof scrollCustomFn === "function") {
                if (scrollCustomFn.call(Sortable.dragged.parentNode[expando], scrollOffsetX, scrollOffsetY, evt, touchEvt$1, autoScrolls[this.layer].el) !== "continue") {
                  return;
                }
              }
              scrollBy(autoScrolls[this.layer].el, scrollOffsetX, scrollOffsetY);
            }.bind({
              layer: layersOut
            }), 24);
          }
        }
        layersOut++;
      } while (options.bubbleScroll && currentParent !== winScroller && (currentParent = getParentAutoScrollElement(currentParent, false)));
      scrolling = scrollThisInstance;
    }, 30);
    var drop = function drop2(_ref) {
      var originalEvent = _ref.originalEvent, putSortable2 = _ref.putSortable, dragEl2 = _ref.dragEl, activeSortable = _ref.activeSortable, dispatchSortableEvent = _ref.dispatchSortableEvent, hideGhostForTarget = _ref.hideGhostForTarget, unhideGhostForTarget = _ref.unhideGhostForTarget;
      if (!originalEvent) return;
      var toSortable = putSortable2 || activeSortable;
      hideGhostForTarget();
      var touch = originalEvent.changedTouches && originalEvent.changedTouches.length ? originalEvent.changedTouches[0] : originalEvent;
      var target = document.elementFromPoint(touch.clientX, touch.clientY);
      unhideGhostForTarget();
      if (toSortable && !toSortable.el.contains(target)) {
        dispatchSortableEvent("spill");
        this.onSpill({
          dragEl: dragEl2,
          putSortable: putSortable2
        });
      }
    };
    function Revert() {
    }
    Revert.prototype = {
      startIndex: null,
      dragStart: function dragStart(_ref2) {
        var oldDraggableIndex2 = _ref2.oldDraggableIndex;
        this.startIndex = oldDraggableIndex2;
      },
      onSpill: function onSpill(_ref3) {
        var dragEl2 = _ref3.dragEl, putSortable2 = _ref3.putSortable;
        this.sortable.captureAnimationState();
        if (putSortable2) {
          putSortable2.captureAnimationState();
        }
        var nextSibling = getChild(this.sortable.el, this.startIndex, this.options);
        if (nextSibling) {
          this.sortable.el.insertBefore(dragEl2, nextSibling);
        } else {
          this.sortable.el.appendChild(dragEl2);
        }
        this.sortable.animateAll();
        if (putSortable2) {
          putSortable2.animateAll();
        }
      },
      drop
    };
    _extends(Revert, {
      pluginName: "revertOnSpill"
    });
    function Remove() {
    }
    Remove.prototype = {
      onSpill: function onSpill2(_ref4) {
        var dragEl2 = _ref4.dragEl, putSortable2 = _ref4.putSortable;
        var parentSortable = putSortable2 || this.sortable;
        parentSortable.captureAnimationState();
        dragEl2.parentNode && dragEl2.parentNode.removeChild(dragEl2);
        parentSortable.animateAll();
      },
      drop
    };
    _extends(Remove, {
      pluginName: "removeOnSpill"
    });
    Sortable.mount(new AutoScrollPlugin());
    Sortable.mount(Remove, Revert);
    var sortable_esm_default = Sortable;

    // src/client.js
    var inject = ["slots", "settingsScope"];
    var NS = "dsh-balance-monitor";
    var VERSION = "v0.1.10";
    var FEEDBACK_DURATION_MS = 2400;
    var POPOVER_EXIT_MS = 160;
    var MAX_SIDEBAR_CHANNELS = 3;
    var CHANNEL_OPTIONS = Object.freeze([
      { id: "deepseek", label: "DeepSeek \u5B98\u65B9" },
      { id: "kimi", label: "Kimi \u5B98\u65B9" },
      { id: "zhipu", label: "\u667A\u8C31 GLM" },
      { id: "teamo", label: "TeamoRouter" }
    ]);
    var CHANNEL_IDS = CHANNEL_OPTIONS.map((channel) => channel.id);
    var WALLET_ICON = '<svg viewBox="0 0 16 16" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 4.75h10.25a.75.75 0 0 1 .75.75v7a1 1 0 0 1-1 1h-9a1.5 1.5 0 0 1-1.5-1.5V4a1.5 1.5 0 0 1 1.5-1.5h8"/><path d="M10.25 8h3.25v2.5h-3.25a1.25 1.25 0 0 1 0-2.5Z"/></svg>';
    var REFRESH_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 4v5h5"/><path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 20v-5h-5"/></svg>';
    function normalizeChannelOrder(value) {
      const requested = Array.isArray(value) ? value : [];
      return [.../* @__PURE__ */ new Set([...requested.filter((id) => CHANNEL_IDS.includes(id)), ...CHANNEL_IDS])];
    }
    var STYLE = `
    [data-dsh-balance-monitor-entry][hidden]{display:none}
    .bm-checkbox-field{display:flex;align-items:center;gap:8px;padding-top:8px;font-size:12px;font-weight:550}.bm-checkbox-field input{width:14px!important;height:14px!important;flex:none!important;margin:0;cursor:pointer}
    .bm-sortable-ghost{opacity:.28;background:var(--dsw-alias-interactive-bg-active,rgba(127,127,127,.16))}.bm-sortable-chosen{background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.1))}.bm-sortable-drag{opacity:.96;background:var(--dsw-specific-menu,var(--dsw-alias-bg-layer-3,#fff));box-shadow:var(--dsw-elevation-panel,0 8px 24px rgba(0,0,0,.16))}
    body{--bm-feedback-success:#15803d;--bm-feedback-error:var(--dsw-alias-state-error-primary,#dc2626)}
    body[data-ds-dark-theme]{--bm-feedback-success:var(--dsw-alias-state-success-primary,#22c55e);--bm-feedback-error:var(--dsw-alias-state-error-primary,#f25a5a)}
    [data-dsh-balance-monitor-entry]{box-sizing:border-box;width:100%;border:0;border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary,#d6d9df);display:flex;align-items:center;gap:8px;min-height:36px;padding:5px 10px;cursor:pointer;font:inherit;text-align:left}
    [data-dsh-balance-monitor-entry]:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.12));color:var(--dsw-alias-label-primary,#eef0f3)}[data-dsh-balance-monitor-entry][data-active]{background:var(--dsw-alias-interactive-bg-active,rgba(127,127,127,.16));color:var(--dsw-alias-label-primary,#eef0f3);font-weight:600}
    [data-dsh-balance-monitor-entry] .bm-icon{width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;flex:none}
    [data-dsh-balance-monitor-entry] .bm-icon svg{display:block;width:18px;height:18px}.bm-icon-button svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
    [data-dsh-balance-monitor-entry] .bm-summary{display:grid;gap:1px;min-width:0;flex:1}
    [data-dsh-balance-monitor-entry] .bm-line{display:flex;justify-content:space-between;gap:8px;min-width:0;font-size:12px;line-height:17px}
    [data-dsh-balance-monitor-entry] .bm-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:inherit}
    [data-dsh-balance-monitor-entry] .bm-value{--bm-feedback-rest:var(--dsw-alias-label-secondary,#61666b);white-space:nowrap;font-variant-numeric:tabular-nums}[data-dsh-balance-monitor-entry]:hover .bm-value,[data-dsh-balance-monitor-entry][data-active] .bm-value{--bm-feedback-rest:var(--dsw-alias-label-primary,#0f1115)}
    [data-dsh-frame][data-sidebar-collapsed] [data-dsh-balance-monitor-entry],[data-sidebar-collapsed] [data-dsh-balance-monitor-entry]{justify-content:center;padding:0;width:36px;height:36px;min-height:36px;margin:0 auto 12px;border-radius:50%}
    [data-dsh-frame][data-sidebar-collapsed] [data-dsh-balance-monitor-entry] .bm-summary,[data-sidebar-collapsed] [data-dsh-balance-monitor-entry] .bm-summary{display:none}
    .bm-popover{position:fixed;z-index:10000;width:min(390px,calc(100vw - 24px));max-height:min(620px,calc(100vh - 24px));overflow:auto;border:.5px solid var(--dsw-alias-border-l2,rgba(127,127,127,.25));border-radius:8px;background:var(--dsw-alias-bg-layer-2,#fff);color:var(--dsw-alias-label-primary,#0f1115);box-shadow:var(--dsw-elevation-prominent,0 12px 32px rgba(0,0,0,.14));font-family:inherit;transform-origin:left top;animation:bm-popover-in .18s var(--ds-ease-out,cubic-bezier(0,0,.2,1))}
    .bm-popover[hidden]{display:none}.bm-popover-header{position:sticky;top:0;z-index:1;display:flex;align-items:center;padding:12px 14px;border-bottom:.5px solid var(--dsw-alias-border-l2,rgba(127,127,127,.16));background:inherit}
    .bm-popover[data-closing=true]{pointer-events:none;animation:bm-popover-out .16s var(--ds-ease-in,cubic-bezier(.4,0,1,1)) forwards}
    .bm-popover-heading{display:flex;align-items:center;gap:6px;min-width:0;flex:1}.bm-popover-title{font-size:14px;font-weight:600}.bm-version{font-size:10px;font-weight:400;line-height:1;color:var(--dsw-alias-label-tertiary,#9ca3af);white-space:nowrap}.bm-update-pill{-webkit-appearance:none;appearance:none;box-sizing:border-box;height:20px;border:0;border-radius:5px;outline:0;background:#d09a00;box-shadow:none;color:#fff;padding:3px 8px;font:inherit;font-size:10px;font-weight:600;line-height:14px;white-space:nowrap}.bm-update-pill:not(span){cursor:pointer}.bm-update-pill:not(span):hover{background:#b98200}.bm-update-pill:focus-visible{outline:2px solid var(--dsw-alias-focus-ring,#4d6bfe);outline-offset:2px}.bm-update-pill:disabled{cursor:wait;opacity:.72}.bm-update-pill[data-state=restart-required]{background:#16803d}.bm-update-pill[data-state=error]{background:#b42318}.bm-actions{display:flex;gap:4px}.bm-icon-button{--bm-feedback-rest:var(--dsw-alias-label-primary,#0f1115);width:30px;height:30px;border:0;border-radius:6px;background:transparent;color:inherit;display:grid;place-items:center;cursor:pointer}
    .bm-icon-button{transition:color .35s ease,background .12s ease}.bm-icon-button:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.12))}.bm-icon-button:disabled{opacity:.45;cursor:default}.bm-spinning svg{animation:bm-spin 1.1s linear infinite}.bm-refresh-success{animation:bm-success-feedback 2.4s cubic-bezier(.4,0,.2,1)}.bm-refresh-error{animation:bm-error-feedback 2.4s cubic-bezier(.4,0,.2,1)}.bm-refresh-success svg,.bm-refresh-error svg{animation:bm-stroke-feedback 2.4s cubic-bezier(.4,0,.2,1)}
    .bm-channel{padding:14px}.bm-channel+.bm-channel{border-top:.5px solid var(--dsw-alias-border-l2,rgba(127,127,127,.16))}.bm-channel-head{display:flex;align-items:center;gap:8px;margin-bottom:12px}
    .bm-channel-name{font-size:13px;font-weight:600;flex:1}.bm-status{font-size:11px;color:var(--dsw-alias-label-tertiary,#9ca3af)}.bm-balance{--bm-feedback-rest:var(--dsw-alias-label-primary,#0f1115);font-size:24px;line-height:1.2;font-weight:650;font-variant-numeric:tabular-nums;margin-bottom:12px}.bm-value-success,.bm-balance-success{animation:bm-success-feedback 2.4s cubic-bezier(.4,0,.2,1)}.bm-value-error,.bm-balance-error{animation:bm-error-feedback 2.4s cubic-bezier(.4,0,.2,1)}
    .bm-periods{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-bottom:12px}.bm-period{padding:9px;background:var(--dsw-alias-bg-multi-select,rgba(127,127,127,.08));border-radius:6px}
    .bm-period-label,.bm-detail-label{font-size:11px;color:var(--dsw-alias-label-tertiary,#9ca3af)}.bm-period-value{font-size:14px;font-weight:600;margin-top:3px}.bm-period-meta{font-size:10px;color:var(--dsw-alias-label-tertiary,#9ca3af);margin-top:2px}
    .bm-details{display:grid;gap:7px}.bm-detail{display:flex;justify-content:space-between;gap:14px;font-size:12px}.bm-detail-value{text-align:right;font-variant-numeric:tabular-nums}.bm-error{color:var(--dsw-alias-state-error-primary,#ef4444)}
    .bm-note{font-size:11px;color:var(--dsw-alias-label-tertiary,#9ca3af);margin-top:10px}.bm-empty{padding:16px;font-size:12px;color:var(--dsw-alias-label-tertiary,#9ca3af)}
    .bm-settings{list-style:none;border:1px solid var(--dsw-alias-border-l2,rgba(127,127,127,.25));border-radius:12px;background:var(--dsw-alias-bg-layer-3,transparent);color:inherit;transition:border-color .16s,background .16s}.bm-settings:hover{border-color:var(--dsw-alias-label-dimmed,rgba(127,127,127,.45))}.bm-settings[data-open=true]{background:var(--dsw-alias-bg-layer-2,transparent);border-color:var(--dsw-alias-label-dimmed,rgba(127,127,127,.45))}
    .bm-settings-header{appearance:none;box-sizing:border-box;width:100%;border:0;border-radius:12px;background:transparent;color:inherit;display:flex;align-items:center;gap:12px;padding:14px 16px;text-align:left;font:inherit;cursor:pointer}.bm-settings-head{display:flex;flex:1;min-width:0;flex-direction:column;gap:4px}.bm-settings-title-row{display:flex;align-items:baseline;gap:6px;min-width:0}.bm-settings-title{font-size:15px;font-weight:600;line-height:1.4}.bm-settings-description{font-size:13px;line-height:1.5;color:var(--dsw-alias-label-secondary,#9ca3af)}.bm-chevron{width:14px;height:14px;flex:none;fill:none;stroke:currentColor;stroke-width:1.5;transition:transform .16s}.bm-settings[data-open=true] .bm-card-chevron,.bm-multi[data-open=true] .bm-chevron{transform:rotate(180deg)}.bm-settings-body{border-top:1px solid var(--dsw-alias-border-l2,rgba(127,127,127,.2));margin:0 16px;padding:4px 0 8px}.bm-settings-update{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 0 2px;font-size:12px;color:var(--dsw-alias-label-secondary,#9ca3af)}
    .bm-form{display:grid;gap:14px}.bm-field{display:grid;gap:6px;padding-top:8px}.bm-field-label{position:relative;display:flex;align-items:center;min-height:28px;gap:8px}.bm-field-label>label{display:flex;align-items:center;gap:7px;font-size:12px;font-weight:550}.bm-field-row{display:flex;gap:8px;align-items:center}.bm-field input,.bm-field select{box-sizing:border-box;min-width:0;flex:1;height:34px;border:1px solid var(--dsw-alias-border-l3,rgba(127,127,127,.28));border-radius:6px;background:var(--dsw-alias-bg-layer-1,#fff);color:inherit;padding:0 10px;font:inherit;font-size:12px}.bm-credential-control{position:relative;display:flex;min-width:0;flex:1}.bm-credential-control>input{width:100%;padding-right:34px}.bm-secret-input{-webkit-text-security:disc}.bm-credential-clear{position:absolute;top:4px;right:4px;width:26px;height:26px;border:0;border-radius:5px;background:transparent;color:var(--dsw-alias-label-tertiary,#9ca3af);display:grid;place-items:center;padding:0;font:inherit;font-size:18px;line-height:1;cursor:pointer}.bm-credential-clear:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.12));color:var(--dsw-alias-label-primary,#111827)}.bm-field-refresh{box-sizing:border-box;width:34px;height:34px;flex:none;border:1px solid var(--dsw-alias-border-l3,rgba(127,127,127,.28));border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary,#6b7280);display:grid;place-items:center;padding:0;cursor:pointer}.bm-field-refresh:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.12));color:var(--dsw-alias-label-primary,#111827)}.bm-field-refresh:disabled,.bm-credential-clear:disabled{opacity:.45;cursor:default}.bm-field-refresh svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
    .bm-credential-readonly{box-sizing:border-box;min-width:0;flex:1;height:34px;border:1px solid var(--dsw-alias-border-l3,rgba(127,127,127,.18));border-radius:6px;background:var(--dsw-alias-bg-disabled,rgba(127,127,127,.06));color:var(--dsw-alias-label-tertiary,#9ca3af);padding:0 10px;display:flex;align-items:center;font-size:12px}
    .bm-source-settings{position:relative;margin-left:auto}.bm-source-settings-trigger{box-sizing:border-box;width:28px;height:28px;border:0;border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary,#6b7280);display:grid;place-items:center;padding:0;cursor:pointer}.bm-source-settings-trigger:hover,.bm-source-settings-trigger[data-open=true]{background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.12));color:var(--dsw-alias-label-primary,#111827)}.bm-source-settings-trigger svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}.bm-source-popover{position:absolute;z-index:20;top:calc(100% + 5px);right:0;width:min(340px,calc(100vw - 64px));padding:14px;border:1px solid var(--dsw-alias-border-l2,rgba(127,127,127,.25));border-radius:8px;background:var(--dsw-specific-menu,var(--dsw-alias-bg-layer-3,#fff));box-shadow:var(--dsw-elevation-panel,0 10px 30px rgba(0,0,0,.16));display:grid;gap:12px;animation:bm-popover-in .18s var(--ds-ease-out,cubic-bezier(0,0,.2,1))}.bm-source-popover-title{font-size:13px;font-weight:600}.bm-source-popover-field{display:grid;gap:6px}.bm-source-popover-field label{font-size:11px;color:var(--dsw-alias-label-secondary,#6b7280)}.bm-source-popover-field input{width:100%}.bm-source-popover-actions{display:flex;justify-content:flex-end;gap:8px}
    .bm-multi{position:relative;width:min(504px,100%);max-width:100%;flex:none}.bm-multi-trigger{box-sizing:border-box;width:100%;height:34px;border:1px solid var(--dsw-alias-border-l3,rgba(127,127,127,.28));border-radius:6px;background:var(--dsw-alias-bg-layer-1,#fff);color:inherit;padding:0 10px;display:flex;align-items:center;gap:8px;font:inherit;font-size:12px;cursor:pointer}.bm-multi-value{min-width:0;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left}.bm-multi-count{font-size:10px;color:var(--dsw-alias-label-tertiary,#9ca3af)}.bm-multi-menu{position:absolute;z-index:5;top:calc(100% + 5px);left:0;right:0;padding:5px;border:1px solid var(--dsw-alias-border-l2,rgba(127,127,127,.25));border-radius:6px;background:var(--dsw-specific-menu,var(--dsw-alias-bg-layer-3,#fff));box-shadow:var(--dsw-elevation-panel,0 8px 24px rgba(0,0,0,.14))}.bm-multi-option{display:flex;align-items:center;gap:8px;padding:7px 8px;border-radius:5px}.bm-multi-option:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.1))}.bm-multi-option-select{display:flex;align-items:center;gap:8px;min-width:0;flex:1;font-weight:400;cursor:pointer}.bm-multi-option input{width:14px!important;height:14px!important;flex:none!important;margin:0}.bm-multi-option[data-disabled=true]{position:relative}.bm-multi-option[data-disabled=true]>.bm-multi-option-select,.bm-multi-option[data-disabled=true]>.bm-drag-handle{opacity:.45}.bm-limit-tooltip{position:fixed;z-index:10001;padding:5px 7px;border-radius:5px;background:var(--dsw-alias-bg-tooltip,#1f2937);color:var(--dsw-alias-label-primary-foreground,#fff);box-shadow:0 4px 12px rgba(0,0,0,.18);font-size:11px;font-weight:400;line-height:16px;white-space:nowrap;pointer-events:none}.bm-drag-handle{width:24px;height:24px;flex:none;border:0;border-radius:4px;background:transparent;color:var(--dsw-alias-label-tertiary,#9ca3af);display:grid;place-items:center;padding:0;cursor:grab;touch-action:none;user-select:none}.bm-drag-handle:active{cursor:grabbing}.bm-drag-handle:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(127,127,127,.12));color:var(--dsw-alias-label-primary,#111827)}.bm-drag-handle svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round}
    .bm-credential-dot{width:7px;height:7px;border-radius:50%;flex:none}.bm-credential-dot[data-status=success]{background:var(--dsw-alias-state-success-primary,#16a34a)}.bm-credential-dot[data-status=error]{background:var(--dsw-alias-state-error-primary,#dc2626)}
    .bm-buttons{display:flex;justify-content:flex-end;gap:8px}.bm-button{height:34px;border:1px solid var(--dsw-alias-border-l3,rgba(127,127,127,.25));border-radius:6px;padding:0 12px;background:transparent;color:inherit;font:inherit;font-size:12px;cursor:pointer}.bm-button-primary{background:var(--dsw-alias-button-info-fill,#2563eb);border-color:transparent;color:var(--dsw-alias-label-primary-foreground,#fff)}.bm-button:disabled{opacity:.5;cursor:default}.bm-message{font-size:11px}.bm-message[data-error=true]{color:var(--dsw-alias-state-error-primary,#ef4444)}
    @keyframes bm-spin{to{transform:rotate(360deg)}}@keyframes bm-popover-in{from{opacity:0;transform:translateY(-4px) scale(.985)}to{opacity:1;transform:none}}@keyframes bm-popover-out{from{opacity:1;transform:none}to{opacity:0;transform:translateY(-4px) scale(.985)}}@keyframes bm-success-feedback{0%,100%{color:var(--bm-feedback-rest,var(--dsw-alias-label-primary,#eef0f3))}35%,65%{color:var(--bm-feedback-success)}}@keyframes bm-error-feedback{0%,100%{color:var(--bm-feedback-rest,var(--dsw-alias-label-primary,#eef0f3))}35%,65%{color:var(--bm-feedback-error)}}@keyframes bm-stroke-feedback{0%,100%{stroke-width:1.8}35%,65%{stroke-width:3}}@media(prefers-reduced-motion:reduce){.bm-popover{animation:none}}`;
    function installStyle() {
      if (document.querySelector("style[data-dsh-balance-monitor-style]")) return;
      const style = document.createElement("style");
      style.dataset.dshBalanceMonitorStyle = "";
      style.textContent = STYLE;
      document.head.append(style);
    }
    function formatBalance(channel) {
      if (channel.status === "unconfigured") return "\u672A\u914D\u7F6E";
      if (channel.status === "loading" && channel.balance === void 0) return "\u52A0\u8F7D\u4E2D";
      if (channel.balance === void 0) return "--";
      try {
        if (channel.currency === "USD") {
          return `$${new Intl.NumberFormat("zh-CN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4
          }).format(channel.balance)}`;
        }
        return new Intl.NumberFormat("zh-CN", {
          style: "currency",
          currency: channel.currency || "CNY",
          minimumFractionDigits: 2,
          maximumFractionDigits: 4
        }).format(channel.balance);
      } catch {
        return `${channel.balance} ${channel.currency || ""}`.trim();
      }
    }
    async function api(path, options) {
      const response = await fetch(path, {
        ...options,
        headers: { "Content-Type": "application/json", ...options?.headers ?? {} }
      });
      const body = await response.json();
      if (!response.ok || !body.ok) throw new Error(body.error || `HTTP ${response.status}`);
      return body;
    }
    function installUpdate() {
      return api("/api/dsh-balance-monitor/update", {
        method: "POST",
        body: JSON.stringify({ action: "install" })
      });
    }
    function triggerUpdate() {
      void installUpdate().catch(() => {
      });
    }
    function subscribeUpdateState(listener) {
      let active = true;
      api("/api/dsh-balance-monitor/update").then((snapshot) => {
        if (active) listener(snapshot);
      }).catch((error) => console.error("[dsh-balance-monitor] update state failed:", error));
      const events = new EventSource("/api/dsh-balance-monitor/update/events");
      events.onmessage = (event) => {
        try {
          listener(JSON.parse(event.data));
        } catch (error) {
          console.error("[dsh-balance-monitor] update event decode failed:", error);
        }
      };
      return () => {
        active = false;
        events.close();
      };
    }
    var balanceStateStore = /* @__PURE__ */ (() => {
      const listeners = /* @__PURE__ */ new Set();
      let snapshot;
      let revision = -1;
      let events;
      let starting;
      const publish = (next, channel = null) => {
        if (!next || !Array.isArray(next.channels)) return;
        const nextRevision = Number(next.revision);
        if (Number.isFinite(nextRevision) && nextRevision < revision) return;
        if (Number.isFinite(nextRevision)) revision = nextRevision;
        snapshot = next;
        for (const listener of listeners) listener({ snapshot, channel });
      };
      const start = () => {
        if (starting || events) return;
        starting = api("/api/dsh-balance-monitor/state").then((next) => publish(next)).catch((error) => console.error("[dsh-balance-monitor] state failed:", error)).finally(() => {
          starting = void 0;
          if (listeners.size > 0 && !events) start();
        });
        events = new EventSource("/api/dsh-balance-monitor/events");
        events.onmessage = (event) => {
          try {
            const payload = JSON.parse(event.data);
            publish(payload.snapshot, payload.channel);
          } catch (error) {
            console.error("[dsh-balance-monitor] state event decode failed:", error);
          }
        };
      };
      return {
        subscribe(listener) {
          listeners.add(listener);
          if (snapshot) listener({ snapshot, channel: null });
          start();
          return () => {
            listeners.delete(listener);
            if (listeners.size > 0) return;
            events?.close();
            events = void 0;
          };
        }
      };
    })();
    function subscribeBalanceState(listener) {
      return balanceStateStore.subscribe(listener);
    }
    function updatePresentation(update) {
      if (!update) return void 0;
      if (update.status === "restart-required") {
        return { label: "\u91CD\u542F\u540E\u751F\u6548", state: "restart-required", disabled: true };
      }
      if (update.status === "updating") {
        return { label: "\u6B63\u5728\u66F4\u65B0", state: "updating", disabled: true };
      }
      if (update.status === "error" && update.updateAvailable) {
        return {
          label: "\u66F4\u65B0\u5931\u8D25",
          state: "error",
          disabled: false,
          title: update.error || "\u70B9\u51FB\u91CD\u8BD5"
        };
      }
      if (update.status === "available") {
        return {
          label: "\u53D1\u73B0\u65B0\u7248\u672C",
          state: "available",
          disabled: false,
          title: update.error || `\u66F4\u65B0\u81F3 v${update.latestVersion}`
        };
      }
      return void 0;
    }
    function updateButton(update, onInstall) {
      const presentation = updatePresentation(update);
      if (!presentation) return void 0;
      const control = document.createElement(
        presentation.state === "restart-required" ? "span" : "button"
      );
      control.className = "bm-update-pill";
      control.dataset.state = presentation.state;
      control.textContent = presentation.label;
      control.title = presentation.title ?? presentation.label;
      if (control instanceof HTMLButtonElement) {
        control.type = "button";
        control.disabled = presentation.disabled;
        control.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          void onInstall();
        });
      }
      return control;
    }
    function sidebarRoot() {
      const column = document.querySelector('[data-pane="sidebar"], [class*="sidebarCol"]');
      if (!column) return void 0;
      return column.querySelector('[class*="logoRow"]')?.parentElement ?? column.firstElementChild ?? void 0;
    }
    function newSessionRow(root) {
      const button = root.querySelector('button[class*="newSession"]');
      if (!button) return void 0;
      const row = button.closest('[class*="logoRow"]');
      return row?.parentElement === root ? row : button;
    }
    function placeEntry(root, entry) {
      const base = newSessionRow(root);
      if (!base) return false;
      if (entry.parentElement === root) return true;
      const siblings = Array.from(root.children).filter((element) => element.matches(
        "[data-dsh-taskboard-entry],[data-dsh-ssh-entry],[data-dsh-better-sidebar-entry],[data-dsh-balance-monitor-entry]"
      ));
      const anchor = siblings.length ? siblings.at(-1).nextElementSibling : base.nextElementSibling;
      root.insertBefore(entry, anchor);
      return true;
    }
    function setButtonIcon(button, icon) {
      button.innerHTML = icon;
    }
    function iconButton(icon, label, action) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "bm-icon-button";
      button.title = label;
      button.setAttribute("aria-label", label);
      setButtonIcon(button, icon);
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        action(event);
      });
      return button;
    }
    function detailRow(item) {
      const row = document.createElement("div");
      row.className = "bm-detail";
      const label = document.createElement("span");
      label.className = "bm-detail-label";
      label.textContent = item.label;
      const value = document.createElement("span");
      value.className = `bm-detail-value${item.tone === "error" ? " bm-error" : ""}`;
      value.textContent = item.value;
      row.append(label, value);
      return row;
    }
    function channelView(channel, refresh, feedback, loading) {
      const section = document.createElement("section");
      section.className = "bm-channel";
      const header = document.createElement("div");
      header.className = "bm-channel-head";
      const name = document.createElement("span");
      name.className = "bm-channel-name";
      name.textContent = channel.label;
      const status = document.createElement("span");
      status.className = `bm-status${channel.status === "error" ? " bm-error" : ""}`;
      status.textContent = channel.status === "error" ? "\u5237\u65B0\u5931\u8D25" : channel.updatedAt ? new Date(channel.updatedAt).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }) : "";
      const refreshButton = iconButton(REFRESH_ICON, `\u5237\u65B0 ${channel.label}`, refresh);
      refreshButton.disabled = loading || channel.status === "loading";
      if (loading || channel.status === "loading") refreshButton.classList.add("bm-spinning");
      if (feedback) refreshButton.classList.add(`bm-refresh-${feedback}`);
      header.append(name, status, refreshButton);
      section.append(header);
      if (channel.status === "unconfigured") {
        const empty = document.createElement("div");
        empty.className = "bm-empty";
        empty.textContent = "\u5C1A\u672A\u914D\u7F6E API Key";
        section.append(empty);
        return section;
      }
      if (channel.balance !== void 0) {
        const balance = document.createElement("div");
        balance.className = `bm-balance${feedback ? ` bm-balance-${feedback}` : ""}`;
        balance.textContent = formatBalance(channel);
        section.append(balance);
      }
      if (channel.periods?.length) {
        const periods = document.createElement("div");
        periods.className = "bm-periods";
        for (const item of channel.periods) {
          const box = document.createElement("div");
          box.className = "bm-period";
          const label = document.createElement("div");
          label.className = "bm-period-label";
          label.textContent = item.label;
          const value = document.createElement("div");
          value.className = "bm-period-value";
          value.textContent = item.cost;
          const meta = document.createElement("div");
          meta.className = "bm-period-meta";
          meta.textContent = `${item.requests} \u6B21\u8BF7\u6C42`;
          box.append(label, value, meta);
          periods.append(box);
        }
        section.append(periods);
      }
      if (channel.detail?.length) {
        const details = document.createElement("div");
        details.className = "bm-details";
        for (const item of channel.detail) details.append(detailRow(item));
        section.append(details);
      }
      if (channel.error) section.append(detailRow({ label: "\u9519\u8BEF", value: channel.error, tone: "error" }));
      if (channel.note) {
        const note = document.createElement("div");
        note.className = "bm-note";
        note.textContent = channel.note;
        section.append(note);
      }
      return section;
    }
    function mountMonitor(scope) {
      installStyle();
      const entry = document.createElement("button");
      entry.type = "button";
      entry.dataset.dshBalanceMonitorEntry = "";
      entry.dataset.dshPlugin = "dsh-balance-monitor";
      entry.dataset.dshPart = "sidebar-entry";
      entry.setAttribute("aria-label", "\u4F59\u989D\u76D1\u63A7");
      const icon = document.createElement("span");
      icon.className = "bm-icon";
      icon.innerHTML = WALLET_ICON;
      const summary = document.createElement("span");
      summary.className = "bm-summary";
      entry.append(icon, summary);
      const popup = document.createElement("div");
      popup.className = "bm-popover";
      popup.hidden = true;
      popup.setAttribute("role", "dialog");
      popup.setAttribute("aria-label", "\u4F59\u989D\u8BE6\u60C5");
      document.body.append(popup);
      let snapshot = { revision: -1, channels: [] };
      let updateSnapshot;
      let root;
      let popupCloseTimer;
      const refreshing = /* @__PURE__ */ new Set();
      const feedback = /* @__PURE__ */ new Map();
      const feedbackTimers = /* @__PURE__ */ new Map();
      const feedbackStarted = /* @__PURE__ */ new Map();
      const pendingFeedback = /* @__PURE__ */ new Map();
      const selectedChannels = () => {
        const settings = scope.getSnapshot();
        const selected = settings.status === "ready" ? settings.value?.sidebarChannels : void 0;
        const selectedSet = new Set(
          Array.isArray(selected) && selected.length ? selected.slice(0, MAX_SIDEBAR_CHANNELS) : CHANNEL_IDS
        );
        const order = normalizeChannelOrder(
          settings.status === "ready" ? settings.value?.channelOrder : void 0
        );
        return order.filter((id) => selectedSet.has(id));
      };
      const sidebarVisible = () => {
        const settings = scope.getSnapshot();
        return settings.status !== "ready" || settings.value?.showSidebar !== false;
      };
      const orderedChannels = () => {
        const settings = scope.getSnapshot();
        const order = normalizeChannelOrder(
          settings.status === "ready" ? settings.value?.channelOrder : void 0
        );
        const byId = new Map(snapshot.channels.map((channel) => [channel.id, channel]));
        return order.map((id) => byId.get(id)).filter(Boolean);
      };
      const acceptSnapshot = (next) => {
        if (!next || !Array.isArray(next.channels)) return false;
        const currentRevision = Number(snapshot.revision);
        const nextRevision = Number(next.revision);
        if (Number.isFinite(currentRevision) && Number.isFinite(nextRevision) && nextRevision < currentRevision) return false;
        snapshot = next;
        return true;
      };
      const renderSummary = () => {
        summary.replaceChildren();
        const visible = sidebarVisible();
        entry.hidden = !visible;
        if (!visible) {
          popup.hidden = true;
          delete popup.dataset.closing;
          delete entry.dataset.active;
          return;
        }
        const byId = new Map(snapshot.channels.map((channel) => [channel.id, channel]));
        const channels = selectedChannels().map((id) => byId.get(id)).filter(Boolean);
        for (const channel of channels) {
          const row = document.createElement("span");
          row.className = "bm-line";
          const label = document.createElement("span");
          label.className = "bm-label";
          label.textContent = channel.label;
          const value = document.createElement("span");
          const result = feedback.get(channel.id);
          value.className = `bm-value${result ? ` bm-value-${result}` : ""}`;
          value.textContent = formatBalance(channel);
          row.append(label, value);
          summary.append(row);
        }
        if (!channels.length) summary.textContent = "\u4F59\u989D\u76D1\u63A7";
      };
      const positionPopup = () => {
        if (popup.hidden) return;
        const rect = entry.getBoundingClientRect();
        const width = Math.min(390, window.innerWidth - 24);
        const left = Math.min(window.innerWidth - width - 12, Math.max(12, rect.right + 10));
        const top = Math.min(window.innerHeight - popup.offsetHeight - 12, Math.max(12, rect.top));
        popup.style.left = `${left}px`;
        popup.style.top = `${top}px`;
      };
      const setFeedback = (key, result) => {
        const now = Date.now();
        if (feedback.get(key) === result && now - (feedbackStarted.get(key) ?? 0) < 300) {
          return false;
        }
        feedback.set(key, result);
        feedbackStarted.set(key, now);
        window.clearTimeout(feedbackTimers.get(key));
        feedbackTimers.set(key, window.setTimeout(() => {
          feedback.delete(key);
          feedbackStarted.delete(key);
          feedbackTimers.delete(key);
          render();
        }, FEEDBACK_DURATION_MS));
        return true;
      };
      const showFeedback = (key, result) => {
        if (setFeedback(key, result)) render();
      };
      const refresh = async (channel) => {
        const key = channel ?? "all";
        if (refreshing.has(key)) return;
        refreshing.add(key);
        render();
        let result = "error";
        try {
          const next = await api("/api/dsh-balance-monitor/refresh", {
            method: "POST",
            body: JSON.stringify(channel ? { channel } : {})
          });
          acceptSnapshot(next);
          const selected = channel ? snapshot.channels.filter((item) => item.id === channel) : snapshot.channels;
          const succeeded = selected.length > 0 && selected.every((item) => item.status !== "error");
          result = succeeded ? "success" : "error";
        } catch (error) {
          console.error("[dsh-balance-monitor] refresh failed:", error);
        }
        refreshing.delete(key);
        if (channel) {
          setFeedback(channel, pendingFeedback.get(channel) ?? result);
          pendingFeedback.delete(channel);
        } else {
          for (const [channelId, channelResult] of pendingFeedback) {
            setFeedback(channelId, channelResult);
          }
          pendingFeedback.clear();
          setFeedback("all", result);
        }
        render();
      };
      const renderPopup = () => {
        popup.replaceChildren();
        const header = document.createElement("header");
        header.className = "bm-popover-header";
        const heading = document.createElement("span");
        heading.className = "bm-popover-heading";
        const title = document.createElement("span");
        title.className = "bm-popover-title";
        title.textContent = "\u4F59\u989D\u8BE6\u60C5";
        const version2 = document.createElement("span");
        version2.className = "bm-version";
        version2.textContent = VERSION;
        heading.append(title, version2);
        const update = updateButton(updateSnapshot, triggerUpdate);
        if (update) heading.append(update);
        const actions = document.createElement("span");
        actions.className = "bm-actions";
        const refreshAll = iconButton(REFRESH_ICON, "\u5237\u65B0\u5168\u90E8", () => {
          void refresh();
        });
        refreshAll.disabled = refreshing.has("all");
        if (refreshing.has("all")) refreshAll.classList.add("bm-spinning");
        if (feedback.has("all")) refreshAll.classList.add(`bm-refresh-${feedback.get("all")}`);
        actions.append(refreshAll);
        header.append(heading, actions);
        popup.append(header);
        if (!snapshot.channels.length) {
          const empty = document.createElement("div");
          empty.className = "bm-empty";
          empty.textContent = "\u6B63\u5728\u52A0\u8F7D\u4F59\u989D";
          popup.append(empty);
        }
        for (const channel of orderedChannels()) {
          popup.append(channelView(
            channel,
            () => void refresh(channel.id),
            feedback.get(channel.id),
            refreshing.has(channel.id) || refreshing.has("all")
          ));
        }
        requestAnimationFrame(positionPopup);
      };
      const render = () => {
        renderSummary();
        if (!popup.hidden) renderPopup();
      };
      const openPopup = () => {
        window.clearTimeout(popupCloseTimer);
        popupCloseTimer = void 0;
        delete popup.dataset.closing;
        popup.hidden = false;
        entry.dataset.active = "true";
        renderPopup();
      };
      const closePopup = () => {
        if (popup.hidden || popup.dataset.closing) return;
        delete entry.dataset.active;
        popup.dataset.closing = "true";
        window.clearTimeout(popupCloseTimer);
        popupCloseTimer = window.setTimeout(() => {
          popup.hidden = true;
          delete popup.dataset.closing;
          popupCloseTimer = void 0;
        }, POPOVER_EXIT_MS);
      };
      entry.addEventListener("click", () => {
        if (popup.hidden || popup.dataset.closing) openPopup();
        else closePopup();
      });
      const place = () => {
        if (root && !root.isConnected) root = void 0;
        root ??= sidebarRoot();
        if (root) placeEntry(root, entry);
      };
      const observer = new MutationObserver(place);
      observer.observe(document.body, { childList: true, subtree: true });
      const unsubscribe = scope.subscribe(renderSummary);
      const unsubscribeUpdates = subscribeUpdateState((next) => {
        updateSnapshot = next;
        if (next.status === "updating" || next.status === "restart-required") {
          openPopup();
          return;
        }
        render();
      });
      const outside = (event) => {
        if (!popup.hidden && !popup.contains(event.target) && !entry.contains(event.target)) {
          closePopup();
        }
      };
      const escape = (event) => {
        if (event.key === "Escape") closePopup();
      };
      document.addEventListener("pointerdown", outside);
      document.addEventListener("keydown", escape);
      window.addEventListener("resize", positionPopup);
      place();
      const unsubscribeBalance = subscribeBalanceState((payload) => {
        if (!acceptSnapshot(payload.snapshot)) return;
        if (payload.channel) {
          const channel = snapshot.channels.find((item) => item.id === payload.channel);
          const result = channel?.status === "error" ? "error" : "success";
          if (refreshing.has(payload.channel) || refreshing.has("all")) {
            pendingFeedback.set(payload.channel, result);
          } else {
            showFeedback(payload.channel, result);
          }
        }
        render();
      });
      return () => {
        observer.disconnect();
        unsubscribeBalance();
        unsubscribe();
        unsubscribeUpdates();
        window.clearTimeout(popupCloseTimer);
        for (const timeout of feedbackTimers.values()) window.clearTimeout(timeout);
        document.removeEventListener("pointerdown", outside);
        document.removeEventListener("keydown", escape);
        window.removeEventListener("resize", positionPopup);
        entry.remove();
        popup.remove();
      };
    }
    function credentialPresentation(snapshot, channelId) {
      const channel = snapshot?.channels?.find((candidate) => candidate.id === channelId);
      const credential = channel?.credential;
      const indicator = credential?.configured && channel.status === "ready" ? "success" : credential?.configured && channel.status === "error" ? "error" : void 0;
      if (credential?.origin === "environment") {
        return { kind: "environment", indicator, readonly: "\u6765\u81EA\u73AF\u5883\u53D8\u91CF\uFF08\u53EA\u8BFB\uFF09" };
      }
      if (credential?.origin === "model") {
        return { kind: "model", indicator, readonly: "\u6765\u81EA\u6A21\u578B\u914D\u7F6E\uFF08\u53EA\u8BFB\uFF09" };
      }
      if (credential?.origin === "user") {
        return { kind: "user", indicator, configured: true };
      }
      if (credential?.origin === "none") {
        return { kind: "none", configured: false };
      }
      return { kind: "loading", readonly: "\u6B63\u5728\u68C0\u6D4B\u51ED\u636E\u6765\u6E90" };
    }
    function SettingsIcon() {
      return import_react.default.createElement(
        "svg",
        { viewBox: "0 0 24 24", "aria-hidden": true },
        import_react.default.createElement("path", {
          d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.09a2 2 0 0 1 1 1.74v.5a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z"
        }),
        import_react.default.createElement("circle", { cx: 12, cy: 12, r: 3 })
      );
    }
    function RefreshIcon() {
      return import_react.default.createElement(
        "svg",
        { viewBox: "0 0 24 24", "aria-hidden": true },
        import_react.default.createElement("path", { d: "M20 11a8.1 8.1 0 0 0-15.5-2M4 4v5h5" }),
        import_react.default.createElement("path", { d: "M4 13a8.1 8.1 0 0 0 15.5 2M20 20v-5h-5" })
      );
    }
    function DragHandleIcon() {
      return import_react.default.createElement(
        "svg",
        { viewBox: "0 0 18 18", "aria-hidden": true },
        import_react.default.createElement("path", { d: "M4 5h10M4 9h10M4 13h10" })
      );
    }
    function createSettingsCard(scope) {
      return function DshBalanceMonitorSettings() {
        const snapshot = (0, import_react.useSyncExternalStore)(
          (listener) => scope.subscribe(listener),
          () => scope.getSnapshot()
        );
        const [update, setUpdate] = (0, import_react.useState)();
        const values = snapshot.status === "ready" ? snapshot.value ?? {} : {};
        const [open, setOpen] = (0, import_react.useState)(false);
        const [pickerOpen, setPickerOpen] = (0, import_react.useState)(false);
        const [sourceSettingsOpen, setSourceSettingsOpen] = (0, import_react.useState)(false);
        const [showSidebar, setShowSidebar] = (0, import_react.useState)(values.showSidebar ?? true);
        const [sidebarChannels, setSidebarChannels] = (0, import_react.useState)(
          values.sidebarChannels ?? CHANNEL_IDS
        );
        const [channelOrder, setChannelOrder] = (0, import_react.useState)(() => normalizeChannelOrder(values.channelOrder));
        const pickerMenu = (0, import_react.useRef)();
        const limitTooltip = (0, import_react.useRef)();
        const [teamoRangeDays, setTeamoRangeDays] = (0, import_react.useState)(values.teamoRangeDays ?? 7);
        const [deepseekKey, setDeepseekKey] = (0, import_react.useState)("");
        const [kimiKey, setKimiKey] = (0, import_react.useState)("");
        const [zhipuKey, setZhipuKey] = (0, import_react.useState)("");
        const [teamoKey, setTeamoKey] = (0, import_react.useState)("");
        const [balanceSnapshot, setBalanceSnapshot] = (0, import_react.useState)();
        const [saving, setSaving] = (0, import_react.useState)(false);
        const [refreshingChannels, setRefreshingChannels] = (0, import_react.useState)(() => /* @__PURE__ */ new Set());
        const [message, setMessage] = (0, import_react.useState)("");
        const [failed, setFailed] = (0, import_react.useState)(false);
        const settingsWrites = (0, import_react.useRef)(Promise.resolve());
        (0, import_react.useEffect)(() => {
          if (snapshot.status !== "ready") return;
          setShowSidebar(values.showSidebar ?? true);
          setSidebarChannels(values.sidebarChannels ?? CHANNEL_IDS);
          setChannelOrder(normalizeChannelOrder(values.channelOrder));
          setTeamoRangeDays(values.teamoRangeDays ?? 7);
        }, [snapshot.revision]);
        (0, import_react.useEffect)(() => {
          if (!open) {
            setPickerOpen(false);
            setSourceSettingsOpen(false);
          }
        }, [open]);
        (0, import_react.useEffect)(() => {
          if (!pickerOpen) return void 0;
          const closeOutside = (event) => {
            if (!(event.target instanceof Element) || !event.target.closest(".bm-multi")) {
              setPickerOpen(false);
            }
          };
          const closeOnEscape = (event) => {
            if (event.key === "Escape") setPickerOpen(false);
          };
          document.addEventListener("pointerdown", closeOutside);
          document.addEventListener("keydown", closeOnEscape);
          return () => {
            document.removeEventListener("pointerdown", closeOutside);
            document.removeEventListener("keydown", closeOnEscape);
          };
        }, [pickerOpen]);
        (0, import_react.useEffect)(() => {
          if (!sourceSettingsOpen) return void 0;
          const closeOutside = (event) => {
            if (!event.target.closest("[data-bm-source-settings]")) setSourceSettingsOpen(false);
          };
          const closeOnEscape = (event) => {
            if (event.key === "Escape") setSourceSettingsOpen(false);
          };
          document.addEventListener("pointerdown", closeOutside);
          document.addEventListener("keydown", closeOnEscape);
          return () => {
            document.removeEventListener("pointerdown", closeOutside);
            document.removeEventListener("keydown", closeOnEscape);
          };
        }, [sourceSettingsOpen]);
        (0, import_react.useEffect)(() => subscribeUpdateState(setUpdate), []);
        (0, import_react.useEffect)(() => subscribeBalanceState(({ snapshot: next }) => {
          setBalanceSnapshot(next);
        }), []);
        const persistSetting = (path, value) => {
          setFailed(false);
          setMessage("");
          settingsWrites.current = settingsWrites.current.then(async () => {
            const current = scope.getSnapshot();
            if (current.status !== "ready" || !current.writable) {
              throw new Error("\u8BBE\u7F6E\u6682\u4E0D\u53EF\u4FDD\u5B58");
            }
            await scope.mutate([
              { op: "set", path: [path], value }
            ], current.revision);
          }).catch((error) => {
            setFailed(true);
            setMessage(error.message);
          });
          return settingsWrites.current;
        };
        (0, import_react.useEffect)(() => {
          if (!pickerOpen || !pickerMenu.current) return void 0;
          const sortable = sortable_esm_default.create(pickerMenu.current, {
            animation: 180,
            easing: "cubic-bezier(0.2, 0, 0, 1)",
            handle: ".bm-drag-handle",
            draggable: ".bm-multi-option",
            dataIdAttr: "data-channel-id",
            direction: "vertical",
            forceFallback: true,
            fallbackOnBody: true,
            fallbackTolerance: 3,
            swapThreshold: 0.65,
            ghostClass: "bm-sortable-ghost",
            chosenClass: "bm-sortable-chosen",
            dragClass: "bm-sortable-drag",
            onEnd: (event) => {
              const from = event.oldDraggableIndex;
              const to = event.newDraggableIndex;
              if (!Number.isInteger(from) || !Number.isInteger(to) || from === to) return;
              const next = normalizeChannelOrder(channelOrder);
              next.splice(to, 0, next.splice(from, 1)[0]);
              setChannelOrder(next);
              void persistSetting("channelOrder", next);
            }
          });
          return () => sortable.destroy();
        }, [pickerOpen, channelOrder]);
        const saveTeamoSettings = async () => {
          setSaving(true);
          setFailed(false);
          setMessage("");
          try {
            const rangeDays = Number(teamoRangeDays);
            if (!Number.isInteger(rangeDays) || rangeDays < 2 || rangeDays > 90) {
              throw new Error("\u7EDF\u8BA1\u5929\u6570\u5FC5\u987B\u662F 2 \u5230 90 \u7684\u6574\u6570");
            }
            await scope.mutate([
              { op: "set", path: ["teamoRangeDays"], value: rangeDays }
            ], snapshot.revision);
            await api("/api/dsh-balance-monitor/refresh", {
              method: "POST",
              body: JSON.stringify({ channel: "teamo" })
            });
            setSourceSettingsOpen(false);
            setMessage("TeamoRouter \u8BBE\u7F6E\u5DF2\u4FDD\u5B58");
          } catch (error) {
            setFailed(true);
            setMessage(error.message);
          } finally {
            setSaving(false);
          }
        };
        const removeCredential = async (channel, clearValue) => {
          setSaving(true);
          setFailed(false);
          setMessage("");
          try {
            await api("/api/dsh-balance-monitor/credential", {
              method: "POST",
              body: JSON.stringify({ action: "unset", channel })
            });
            clearValue();
            setMessage("\u5DF2\u79FB\u9664");
          } catch (error) {
            setFailed(true);
            setMessage(error.message);
          } finally {
            setSaving(false);
          }
        };
        const refreshCredential = async (channel, value, clearValue) => {
          if (refreshingChannels.has(channel)) return;
          setRefreshingChannels((current) => new Set(current).add(channel));
          setFailed(false);
          setMessage("");
          try {
            const credential = value.trim();
            const next = credential ? await api("/api/dsh-balance-monitor/credential", {
              method: "POST",
              body: JSON.stringify({ action: "set", channel, value: credential })
            }) : await api("/api/dsh-balance-monitor/refresh", {
              method: "POST",
              body: JSON.stringify({ channel })
            });
            if (credential) {
              clearValue();
              setMessage("\u5DF2\u4FDD\u5B58\u5E76\u5237\u65B0");
            }
            setBalanceSnapshot(next);
          } catch (error) {
            setFailed(true);
            setMessage(error.message);
          } finally {
            setRefreshingChannels((current) => {
              const next = new Set(current);
              next.delete(channel);
              return next;
            });
          }
        };
        const field = (label, control, indicator, action, refresh) => import_react.default.createElement(
          "div",
          { className: "bm-field" },
          import_react.default.createElement(
            "div",
            { className: "bm-field-label" },
            import_react.default.createElement(
              "label",
              null,
              label,
              indicator === void 0 ? null : import_react.default.createElement(
                "span",
                {
                  className: "bm-credential-dot",
                  "data-status": indicator,
                  role: "img",
                  "aria-label": indicator === "success" ? "\u6570\u636E\u83B7\u53D6\u6B63\u5E38" : "\u6570\u636E\u83B7\u53D6\u5931\u8D25",
                  title: indicator === "success" ? "\u6570\u636E\u83B7\u53D6\u6B63\u5E38" : "\u6570\u636E\u83B7\u53D6\u5931\u8D25"
                }
              )
            ),
            action
          ),
          import_react.default.createElement(
            "div",
            { className: "bm-field-row" },
            control,
            refresh ? import_react.default.createElement(
              "button",
              {
                className: `bm-field-refresh${refreshingChannels.has(refresh.channel) ? " bm-spinning" : ""}`,
                type: "button",
                title: `\u5237\u65B0 ${label}`,
                "aria-label": `\u5237\u65B0 ${label}`,
                disabled: saving || refreshingChannels.has(refresh.channel),
                onClick: () => void refreshCredential(refresh.channel, refresh.value, refresh.clearValue)
              },
              import_react.default.createElement(RefreshIcon)
            ) : null
          )
        );
        const toggleSidebarChannel = (id) => {
          const next = sidebarChannels.includes(id) ? sidebarChannels.length > 1 ? sidebarChannels.filter((value) => value !== id) : sidebarChannels : sidebarChannels.length >= MAX_SIDEBAR_CHANNELS ? sidebarChannels : [...sidebarChannels, id];
          if (next === sidebarChannels) return;
          setSidebarChannels(next);
          void persistSetting("sidebarChannels", next);
        };
        const optionsById = new Map(CHANNEL_OPTIONS.map((channel) => [channel.id, channel]));
        const orderedOptions = channelOrder.map((id) => optionsById.get(id)).filter(Boolean);
        const selectedLabels = orderedOptions.filter((channel) => sidebarChannels.includes(channel.id)).map((channel) => channel.label).join("\u3001");
        const moveLimitTooltip = (event) => {
          const tooltip = limitTooltip.current;
          if (!tooltip) return;
          tooltip.textContent = event.currentTarget.dataset.limitMessage ?? "";
          tooltip.hidden = false;
          const gap = 12;
          const edge = 8;
          const rect = tooltip.getBoundingClientRect();
          let left = event.clientX + gap;
          let top = event.clientY + gap;
          if (left + rect.width > window.innerWidth - edge) {
            left = event.clientX - rect.width - gap;
          }
          if (top + rect.height > window.innerHeight - edge) {
            top = event.clientY - rect.height - gap;
          }
          tooltip.style.left = `${Math.max(edge, left)}px`;
          tooltip.style.top = `${Math.max(edge, top)}px`;
        };
        const hideLimitTooltip = () => {
          if (limitTooltip.current) limitTooltip.current.hidden = true;
        };
        const channelPicker = import_react.default.createElement(
          "div",
          { className: "bm-multi", "data-open": String(pickerOpen) },
          import_react.default.createElement(
            "button",
            {
              type: "button",
              className: "bm-multi-trigger",
              "aria-expanded": pickerOpen,
              "aria-haspopup": "listbox",
              onClick: () => setPickerOpen((value) => !value)
            },
            import_react.default.createElement("span", { className: "bm-multi-value" }, selectedLabels),
            import_react.default.createElement(
              "span",
              { className: "bm-multi-count" },
              `${sidebarChannels.length}/${MAX_SIDEBAR_CHANNELS}`
            ),
            import_react.default.createElement(
              "svg",
              { className: "bm-chevron", viewBox: "0 0 14 14", "aria-hidden": true },
              import_react.default.createElement("path", { d: "m3 5.25 4 4 4-4" })
            )
          ),
          pickerOpen ? import_react.default.createElement(
            "div",
            {
              className: "bm-multi-menu",
              ref: pickerMenu,
              role: "listbox",
              "aria-multiselectable": true
            },
            ...orderedOptions.map((channel) => {
              const checked = sidebarChannels.includes(channel.id);
              const disabled = !checked && sidebarChannels.length >= MAX_SIDEBAR_CHANNELS;
              return import_react.default.createElement(
                "div",
                {
                  key: channel.id,
                  className: "bm-multi-option",
                  "data-channel-id": channel.id,
                  "data-disabled": String(disabled),
                  "aria-disabled": disabled,
                  "data-limit-message": disabled ? "\u4FA7\u8FB9\u680F\u6700\u591A\u4EC5\u5C55\u793A 3 \u4E2A" : void 0,
                  onPointerMove: disabled ? moveLimitTooltip : void 0,
                  onPointerLeave: disabled ? hideLimitTooltip : void 0
                },
                import_react.default.createElement(
                  "label",
                  { className: "bm-multi-option-select" },
                  import_react.default.createElement("input", {
                    type: "checkbox",
                    checked,
                    disabled,
                    onChange: () => toggleSidebarChannel(channel.id)
                  }),
                  import_react.default.createElement("span", null, channel.label)
                ),
                import_react.default.createElement(
                  "button",
                  {
                    className: "bm-drag-handle",
                    type: "button",
                    title: `\u62D6\u52A8\u8C03\u6574 ${channel.label} \u987A\u5E8F`,
                    "aria-label": `\u62D6\u52A8\u8C03\u6574 ${channel.label} \u987A\u5E8F`
                  },
                  import_react.default.createElement(DragHandleIcon)
                )
              );
            })
          ) : null,
          pickerOpen ? import_react.default.createElement("div", {
            className: "bm-limit-tooltip",
            ref: limitTooltip,
            role: "tooltip",
            hidden: true
          }) : null
        );
        const teamoSettings = import_react.default.createElement(
          "div",
          { className: "bm-source-settings", "data-bm-source-settings": "" },
          import_react.default.createElement(
            "button",
            {
              type: "button",
              className: "bm-source-settings-trigger",
              title: "TeamoRouter \u8BBE\u7F6E",
              "aria-label": "TeamoRouter \u8BBE\u7F6E",
              "aria-expanded": sourceSettingsOpen,
              "data-open": String(sourceSettingsOpen),
              disabled: saving,
              onClick: () => setSourceSettingsOpen((value) => !value)
            },
            import_react.default.createElement(SettingsIcon)
          ),
          sourceSettingsOpen ? import_react.default.createElement(
            "div",
            { className: "bm-source-popover", role: "dialog", "aria-label": "TeamoRouter \u8BBE\u7F6E" },
            import_react.default.createElement("div", { className: "bm-source-popover-title" }, "TeamoRouter \u8BBE\u7F6E"),
            import_react.default.createElement(
              "div",
              { className: "bm-source-popover-field" },
              import_react.default.createElement("label", null, "\u7EDF\u8BA1\u5929\u6570"),
              import_react.default.createElement("input", {
                type: "number",
                min: 2,
                max: 90,
                step: 1,
                value: teamoRangeDays,
                disabled: saving,
                onChange: (event) => setTeamoRangeDays(event.target.value)
              })
            ),
            import_react.default.createElement(
              "div",
              { className: "bm-source-popover-actions" },
              import_react.default.createElement(
                "button",
                {
                  className: "bm-button",
                  type: "button",
                  disabled: saving,
                  onClick: () => setSourceSettingsOpen(false)
                },
                "\u53D6\u6D88"
              ),
              import_react.default.createElement(
                "button",
                {
                  className: "bm-button bm-button-primary",
                  type: "button",
                  disabled: saving || snapshot.status !== "ready" || !snapshot.writable,
                  onClick: () => void saveTeamoSettings()
                },
                saving ? "\u4FDD\u5B58\u4E2D" : "\u4FDD\u5B58"
              )
            )
          ) : null
        );
        const credentialField = ({
          channel,
          label,
          placeholder,
          value,
          setValue
        }) => {
          const presentation = credentialPresentation(balanceSnapshot, channel);
          const editable = presentation.kind === "user" || presentation.kind === "none";
          const control = editable ? import_react.default.createElement(
            "div",
            { className: "bm-credential-control" },
            import_react.default.createElement("input", {
              type: "text",
              className: "bm-secret-input",
              name: `dsh-balance-monitor-${channel}-credential`,
              value,
              autoComplete: "off",
              spellCheck: false,
              "data-form-type": "other",
              "data-1p-ignore": true,
              "data-lpignore": "true",
              placeholder: presentation.configured ? "\u5DF2\u914D\u7F6E\u2014\u2014\u8F93\u5165\u65B0\u503C\u53EF\u66FF\u6362" : placeholder,
              disabled: saving,
              onChange: (event) => setValue(event.target.value)
            }),
            presentation.kind === "user" ? import_react.default.createElement(
              "button",
              {
                className: "bm-credential-clear",
                type: "button",
                title: `\u79FB\u9664 ${label}`,
                "aria-label": `\u79FB\u9664 ${label}`,
                disabled: saving,
                onClick: () => void removeCredential(channel, () => setValue(""))
              },
              import_react.default.createElement("span", { "aria-hidden": true }, "\xD7")
            ) : null
          ) : import_react.default.createElement(
            "div",
            { className: "bm-credential-readonly", "aria-disabled": true },
            presentation.readonly
          );
          return field(
            label,
            control,
            presentation.indicator,
            channel === "teamo" ? teamoSettings : void 0,
            { channel, value, clearValue: () => setValue("") }
          );
        };
        const form = import_react.default.createElement(
          "div",
          { className: "bm-form" },
          import_react.default.createElement(
            "div",
            { className: "bm-checkbox-field" },
            import_react.default.createElement("input", {
              type: "checkbox",
              checked: showSidebar,
              "aria-label": "\u5C55\u793A\u4FA7\u8FB9\u680F",
              onChange: (event) => {
                const next = event.target.checked;
                setShowSidebar(next);
                void persistSetting("showSidebar", next);
              }
            }),
            import_react.default.createElement("span", null, "\u5C55\u793A\u4FA7\u8FB9\u680F")
          ),
          field("\u4FA7\u8FB9\u680F\u6E20\u9053", channelPicker),
          credentialField({
            channel: "deepseek",
            label: "DeepSeek API Key",
            placeholder: "sk-...",
            value: deepseekKey,
            setValue: setDeepseekKey
          }),
          credentialField({
            channel: "kimi",
            label: "Kimi API Key",
            placeholder: "sk-...",
            value: kimiKey,
            setValue: setKimiKey
          }),
          credentialField({
            channel: "zhipu",
            label: "\u667A\u8C31 GLM API Key",
            placeholder: "\u8BF7\u8F93\u5165 API Key",
            value: zhipuKey,
            setValue: setZhipuKey
          }),
          credentialField({
            channel: "teamo",
            label: "TeamoRouter API Key",
            placeholder: "sk-teamo-...",
            value: teamoKey,
            setValue: setTeamoKey
          }),
          message ? import_react.default.createElement(
            "div",
            { className: "bm-message", "data-error": String(failed) },
            message
          ) : null
        );
        const updateStatus = updatePresentation(update);
        const updateNotice = updateStatus ? import_react.default.createElement(
          "div",
          { className: "bm-settings-update" },
          import_react.default.createElement("span", null, `\u5F53\u524D\u7248\u672C ${VERSION}`),
          updateStatus.state === "restart-required" ? import_react.default.createElement(
            "span",
            {
              className: "bm-update-pill",
              "data-state": updateStatus.state,
              title: updateStatus.title ?? updateStatus.label
            },
            updateStatus.label
          ) : import_react.default.createElement(
            "button",
            {
              type: "button",
              className: "bm-update-pill",
              "data-state": updateStatus.state,
              disabled: updateStatus.disabled,
              title: updateStatus.title ?? updateStatus.label,
              onClick: triggerUpdate
            },
            updateStatus.label
          )
        ) : null;
        return import_react.default.createElement(
          "li",
          {
            className: "bm-settings",
            "data-open": String(open),
            "data-dsh-plugin": NS,
            "data-dsh-part": "settings-card"
          },
          import_react.default.createElement(
            "button",
            {
              type: "button",
              className: "bm-settings-header",
              "aria-expanded": open,
              onClick: () => setOpen((value) => !value)
            },
            import_react.default.createElement(
              "span",
              { className: "bm-settings-head" },
              import_react.default.createElement(
                "span",
                { className: "bm-settings-title-row" },
                import_react.default.createElement("span", { className: "bm-settings-title" }, "\u4F59\u989D\u76D1\u63A7"),
                import_react.default.createElement("span", { className: "bm-version" }, VERSION)
              ),
              import_react.default.createElement(
                "span",
                { className: "bm-settings-description" },
                "\u67E5\u770B\u4F59\u989D\u6E20\u9053\u3001\u51ED\u636E\u4E0E\u7528\u91CF\u8BBE\u7F6E\u3002"
              )
            ),
            import_react.default.createElement(
              "svg",
              { className: "bm-chevron bm-card-chevron", viewBox: "0 0 14 14", "aria-hidden": true },
              import_react.default.createElement("path", { d: "m3 5.25 4 4 4-4" })
            )
          ),
          open ? import_react.default.createElement(
            "div",
            { className: "bm-settings-body" },
            updateNotice,
            form
          ) : null
        );
      };
    }
    function apply(ctx) {
      installStyle();
      const scope = ctx.settingsScope.bind({ namespace: NS });
      const SettingsCard = createSettingsCard(scope);
      ctx.slots.inject("settings.plugin.item", () => ctx.slots.register({
        name: "settings.plugin.item",
        key: NS,
        order: 1e3
      }, SettingsCard));
      ctx.effect(() => mountMonitor(scope), "dsh-balance-monitor: sidebar");
    }

    return module.exports;
  }
});
