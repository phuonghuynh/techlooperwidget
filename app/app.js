if (typeof define === "function" && define.amd && define.amd.jQuery) {
  define(["jquery", "ractive", "rv!templates/template", "text!css/my-widget_embed.css", "app/translate"],
    function ($, Ractive, mainTemplate, css, translate) {
      "use strict";
      $.noConflict(true);

      var app = {};
      app.$container = $("#tlw");

      //const values used to calculate salary-review data
      var preferMeterValues = [170, 162, 148, 135, 112, 90, 67, 45, 31, 18, 8];
      var mapProperties = {
        jobId: "techlooperJobId",
        jobCategories: function(vals) {
          if (!vals) return [];
          return vals.split(",").map(function(v) {return parseInt(v);});
        },
        skills: function(vals) {
          if (!vals) return [];
          return vals.split(",");
        }
      }

      $.extend(true, app, {
        render: function (salaryReview, config) {
          var myPositionArrow = (($('.salary-chart').width() * salaryReview.salaryReport.percentRank) / 100) - 40;

          var myPositionMeter = 0;
          var position = (180 * salaryReview.salaryReport.percentRank / 100);
          $.each(preferMeterValues, function(i, preferValue) {
            if (position >= preferValue) {
              myPositionMeter = preferMeterValues.length - i;
              return false;
            }
          });
          myPositionMeter = Math.max(myPositionMeter, 1);

          this.ractive = new Ractive({
            el: app.$container.attr("id"),
            template: mainTemplate,
            data: {
              translation: translate[app.$container.data('lang')],
              salaryReview: salaryReview,
              salaryRanges: salaryReview.salaryReport.salaryRanges,
              //visibleSalary: true,
              visibleSalary: salaryReview.isSalaryVisible,
              myPositionArrow: myPositionArrow,
              myPositionMeter: myPositionMeter
            }
          });
        },

        init: function () {
          Ractive.DEBUG = false;
          var $style = $("<style></style>", {type: "text/css"});
          $style.text(css);
          $("head").append($style);

          var config = app.$container.data();
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

          //var url = "http://staging.techlooper.com/salaryReview";
          var url = "http://localhost:8080/salaryReview";
          //$.getJSON("js/salaryReviewSample.json", function (salaryReview) {
          //  app.render(salaryReview);
          //});

          $.ajax({
            type: "POST",
            url: url,
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
              }
            }
          });
        }
      });

      return app;
    });
}
