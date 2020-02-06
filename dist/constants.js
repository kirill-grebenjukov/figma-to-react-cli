"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TEXT_STORE_NAME = exports.STORE_NAME = exports.USE_INSTEAD = exports.USE_AS_ROOT = exports.WRAP_WITH = void 0;
// wrap original component and its children into this component
const WRAP_WITH = 'wrapWith'; // use this component instead of original and parse/place children inside this component

exports.WRAP_WITH = WRAP_WITH;
const USE_AS_ROOT = 'useAsRoot'; // use this component instead of original, don't parse/place children inside

exports.USE_AS_ROOT = USE_AS_ROOT;
const USE_INSTEAD = 'useInstead';
exports.USE_INSTEAD = USE_INSTEAD;
const STORE_NAME = 'FigmaToReactStore';
exports.STORE_NAME = STORE_NAME;
const TEXT_STORE_NAME = 'JsonStore';
exports.TEXT_STORE_NAME = TEXT_STORE_NAME;