if (typeof define === "function" && define.amd && define.amd.jQuery) {
  define([], function () {
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
      }
    }
  });
}