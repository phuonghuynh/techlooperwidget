if (typeof define === "function" && define.amd && define.amd.jQuery) {
  define(["jquery"], function ($) {
    "use strict";

    var mapProperties = {
      jobId: "techlooperJobId",
      jobCategories: function (vals) {
        if (!vals) return [];
        vals = "" + vals;
        return vals.split(",").map(function (v) {return parseInt(v);});
      },
      skills: function (vals) {
        if (!vals) return [];
        return vals.split(",");
      }
    }

    var formatNumber = function (number) {
      if (!$.isNumeric(number)) return number;
      number = "" + Math.round(number);
      return number.split(/(?=(?:\d{3})+(?:\.|$))/g).join(",");
    }

    return {
      refine: function (config) {
        if (config) {
          for (var prop in mapProperties) {
            if (!config[prop]) continue;
            var mapProp = mapProperties[prop];
            $.isFunction(mapProp) ? (config[prop] = mapProp(config[prop])) : (config[mapProp] = config[prop]);
          }

          for (var prop in config) {
            if (config[prop] + "" == "-1") {
              delete config[prop];
            }
          }
        }
        return config;
      },

      formatNumber: function (number) {
        if ($.isArray(number)) {
          var numbers = [];
          $.each(number, function (i, val) {numbers.push(formatNumber(val));});
          return numbers;
        }
        return formatNumber(number);
      }
    }
  });
}