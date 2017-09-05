"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("proxy-polyfill");
var intl_messageformat_1 = require("intl-messageformat");
var lodash_1 = require("lodash");
var I18N = (function () {
    function I18N(lang, metas) {
        this.__lang__ = lang;
        this.__metas__ = metas;
        this.__data__ = metas[lang];
    }
    I18N.prototype.setLang = function (lang) {
        this.__lang__ = lang;
        this.__data__ = this.__metas__[lang];
    };
    I18N.prototype.getProp = function (obj, is, value) {
        if (typeof is === 'string') {
            is = is.split('.');
        }
        if (is.length === 1 && value !== undefined) {
            return (obj[is[0]] = value);
        }
        else if (is.length === 0) {
            return obj;
        }
        else {
            var prop = is.shift();
            if (value !== undefined && obj[prop] === undefined) {
                obj[prop] = {};
            }
            return this.getProp(obj[prop], is, value);
        }
    };
    I18N.prototype.template = function (str, args) {
        var _this = this;
        if (!str) {
            return '';
        }
        return str.replace(/\{(.+?)\}/g, function (match, p1) {
            return _this.getProp(__assign({}, args, _this.__data__), p1);
        });
    };
    I18N.prototype.get = function (str, options) {
        var msg = lodash_1.get(this.__data__, str);
        if (options) {
            try {
                msg = new intl_messageformat_1.default(msg, this.__lang__);
                msg = msg.format(options);
                return msg;
            }
            catch (err) {
                console.warn("intl-format format message failed for key='" + str + "'", err);
                return '';
            }
        }
        else {
            return msg;
        }
    };
    return I18N;
}());
var IntlFormat = {
    init: function (lang, metas) {
        var i18n = new I18N(lang, metas);
        var getLang = new Proxy(i18n, {
            get: function (target, property, receiver) {
                if (property === 'setLang' ||
                    property === 'get' ||
                    property === 'template' ||
                    property === 'init') {
                    return function () {
                        return target[property].apply(i18n, arguments);
                    };
                }
                return i18n.get(property);
            }
        });
        return getLang;
    }
};
exports.IntlFormat = IntlFormat;
exports.default = IntlFormat;