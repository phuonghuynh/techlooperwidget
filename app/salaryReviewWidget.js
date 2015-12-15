if (typeof define === "function" && define.amd && define.amd.jQuery) {
  define(["jquery", "ractive", "rv!templates/salaryReview", "text!css/embed.min.css", "app/translate"],
    function ($, Ractive, mainTemplate, css, translate) {
      "use strict";
      $.noConflict(true);

      var app = {};
      app.$container = $("#tlw");

      //const values used to calculate salary-review data
      var preferMeterValues = [170, 162, 148, 135, 112, 90, 67, 45, 31, 18, 8];
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

      $.extend(true, app, {
        render: function (salaryReview, config) {
          config.$arrowPosition = ((app.$container.width() * salaryReview.salaryReport.percentRank) / 100) - 40;

          config.$meterPosition = 0;
          var position = (180 * salaryReview.salaryReport.percentRank / 100);
          $.each(preferMeterValues, function (i, preferValue) {
            if (position >= preferValue) {
              config.$meterPosition = preferMeterValues.length - i;
              return false;
            }
          });
          config.$meterPosition = Math.max(config.$meterPosition, 1);

          var lang = (app.$container.data('lang') == "vi" ? "vi" : "en");
          var translation = translate[lang];
          var min = $.isNumeric(salaryReview.salaryMin) ? "min" : "nmin";
          var max = $.isNumeric(salaryReview.salaryMax) ? "max" : "nmax";
          config.$salaryLabel = translation.salaryLabel[min + "_" + max].replace("%min", salaryReview.salaryMin).replace("%max", salaryReview.salaryMax);

          this.ractive = new Ractive({
            el: app.$container.attr("id"),
            template: mainTemplate,
            data: {
              translation: translation,
              salaryReview: salaryReview,
              salaryRanges: salaryReview.salaryReport.salaryRanges,
              visibleSalary: config.salaryVisible || salaryReview.isSalaryVisible,
              widgetFormat: config.widgetFormat,//"arrow" / "meter"
              arrowPosition: config.$arrowPosition,
              meterPosition: config.$meterPosition,
              salaryLabel: config.$salaryLabel
            }
          });
        },
        noData: function(){
          app.$container.html('');
          var lang = (app.$container.data('lang') == "vi" ? "vi" : "en");
          var translation = translate[lang];
          var noDataChart = translation.noDataChart;
          app.$container.append('<p>' + noDataChart + '</p>')
        },
        init: function () {
          Ractive.DEBUG = false;
          var $style = $("<style></style>", {type: "text/css"});
          $style.text(css);
          $("head").append($style);

          var config = app.$container.data();
          if (!config) return false;

          for (var prop in mapProperties) {
            var mapProperty = mapProperties[prop];
            if ($.isFunction(mapProperty)) {
              config[prop] = mapProperty(config[prop]);
            }
            else {
              config[mapProperty] = config[prop];
            }
          }
          //console.log(config);

          $.ajax({
            type: "POST",
            url: "@@backendUrl" + "/widget/salaryReview",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            data: JSON.stringify(config),
            dataType: "json",
            timeout: 30000,
            success: function (salaryReview) {
              if ($.isNumeric(salaryReview.salaryReport.percentRank)) {
                app.render(salaryReview, config);
              }else{
                app.noData();
              }
            }
          });
        }
      });

      return app;
    });
}
