'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// googleAnalytics events from a node server environment.
// This allows us to convert the analytics custom dimension syntax
// into the one we need for universal-analytics.
// analytics uses {customDimension[N]: <value>}
// while universal-analytics uses {cd[N]: <value>}
var univeralAnalyticsRosettaStone = {
  dimension1: "cd1",
  dimension2: "cd2",
  dimension3: "cd3",
  dimension4: "cd4",
  dimension5: "cd5",
  dimension6: "cd6",
  dimension7: "cd7",
  dimension8: "cd8",
  dimension9: "cd9",
  dimension10: "cd10",
  dimension11: "cd11",
  dimension12: "cd12",
  dimension13: "cd13",
  dimension14: "cd14",
  dimension15: "cd15",
  dimension16: "cd16",
  dimension17: "cd17",
  dimension18: "cd18",
  dimension19: "cd19",
  dimension20: "cd20",
  ipAddress: "uip",
  userAgent: "ua",
  geoLocation: "geoid",
  appName: "an",
  appId: "aid",
  appVersion: "av",
  appInstallerId: "aiid"
};
var universalAnalytics;

{
  universalAnalytics = require('universal-analytics');
}
/**
 * Serverside Google Analytics plugin
 * @param {object} pluginConfig - Plugin settings
 * @param {string} pluginConfig.trackingId - Google Analytics site tracking Id
 * @return {*}
 * @example
 *
 * googleAnalytics({
 *   trackingId: '123-xyz'
 * })
 */


function googleAnalytics() {
  var pluginConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var client = initialize(pluginConfig);
  var customDimensions = pluginConfig.customDimensions || {};
  return {
    name: 'google-analytics',
    config: pluginConfig,
    // page view
    page: function page(_ref) {
      var payload = _ref.payload,
          config = _ref.config;
      var properties = payload.properties;
      var path = properties.path,
          href = properties.href,
          title = properties.title;
      pageView({
        path: path,
        href: href,
        title: title
      }, client);
    },
    // track event
    track: function track(_ref2) {
      var payload = _ref2.payload,
          config = _ref2.config;
      var event = payload.event,
          properties = payload.properties;
      var category = properties.category || 'All';
      var label = properties.label || 'NA';
      var value = properties.value;
      trackEvent({
        category: category,
        event: event,
        label: label,
        value: value,
        properties: properties
      }, client, customDimensions);
    },

    /* identify user */
    identify: function identify(_ref3) {
      var payload = _ref3.payload;
      return identifyVisitor(payload.userId, client);
    }
  };
}
function initialize(config) {
  if (!config.trackingId) throw new Error('No google analytics trackingId defined');
  return universalAnalytics(config.trackingId);
}
function pageView(_ref4, client) {
  var path = _ref4.path,
      href = _ref4.href,
      title = _ref4.title;

  if (!path || !href || !title) {
    throw new Error('Missing path, href or title in page call for GA');
  }

  client.pageview(path, href, title).send();
}
function trackEvent(_ref5, client, customDimensions) {
  var category = _ref5.category,
      event = _ref5.event,
      label = _ref5.label,
      value = _ref5.value,
      properties = _ref5.properties;
  // Prepare Custom Dimensions to be Reported.
  var dimensions = formatObjectIntoDimensions(properties, customDimensions); // Send Event.

  client.event(category, event, label, value, dimensions).send();
}
/**
 * Identify a visitor by Id
 * @param  {string} id - unique visitor ID
 * @param  {object} client - initialized GA client
 */

function identifyVisitor(id, client) {
  client.set('uid', id);
} // Prep Custom Dimensions to be Reported.

function formatObjectIntoDimensions(properties, opts) {
  var customDimensions = opts; // TODO map opts.customMetrics; Object.keys(customMetrics) { key: 'metric1' }
  // TODO map opts.contentGroupings; Object.keys(contentGroupings) { key: 'contentGroup1' }

  /* Map values from payload to any defined custom dimensions */

  return Object.keys(customDimensions).reduce(function (acc, key) {
    var dimensionKey = customDimensions[key];
    var value = get(properties, key) || properties[key];

    if (typeof value === 'boolean') {
      value = value.toString();
    }

    if (value || value === 0) {
      if (univeralAnalyticsRosettaStone[dimensionKey]) {
        acc[univeralAnalyticsRosettaStone[dimensionKey]] = value;
        return acc;
      } else {
        throw new Error('Invalid custom dimension. Should be "dimension[n]" where [n] is an integer inclusively between 1-20.');
      }
    }

    return acc;
  }, {});
}

function get(obj, key, def, p, undef) {
  key = key.split ? key.split('.') : key;

  for (p = 0; p < key.length; p++) {
    obj = obj ? obj[key[p]] : undef;
  }

  return obj === undef ? def : obj;
}

/* This module will shake out unused code + work in browser and node 🎉 */

var index =  googleAnalytics;
/* init for CDN usage. globalName.init() */

var init =  googleAnalytics;
/* Standalone API */

var initialize$1 =  initialize;
var page =  pageView;
var track =  trackEvent;
var identify =  identifyVisitor;

exports.default = index;
exports.identify = identify;
exports.init = init;
exports.initialize = initialize$1;
exports.page = page;
exports.track = track;
