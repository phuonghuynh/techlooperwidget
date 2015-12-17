if (typeof define === "function" && define.amd && define.amd.jQuery) {
  define(["jquery", "ractive", "rv!templates/salaryReview", "text!css/embed.min.css", "app/translate"],
    function ($, Ractive, mainTemplate, css, translate) {
      "use strict";
      $.noConflict(true);

      var widget = {};
      widget.$container = $("#tlw");

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

      var lang = (widget.$container.data('lang') == "vi" ? "vi" : "en");
      var translation = translate[lang];

      $.extend(true, widget, {
        render: function (salaryReview, config) {
          config.$arrowPosition = ((widget.$container.width() * salaryReview.salaryReport.percentRank) / 100) - 40;

          config.$meterPosition = 0;
          var position = (180 * salaryReview.salaryReport.percentRank / 100);
          $.each(preferMeterValues, function (i, preferValue) {
            if (position >= preferValue) {
              config.$meterPosition = preferMeterValues.length - i;
              return false;
            }
          });
          config.$meterPosition = Math.max(config.$meterPosition, 1);

          salaryReview.salaryMin = "" + salaryReview.salaryMin;
          salaryReview.salaryMax = "" + salaryReview.salaryMax;
          var min = ($.isNumeric(salaryReview.salaryMin) && salaryReview.salaryMin != "0") ? "min" : "nmin";
          var max = ($.isNumeric(salaryReview.salaryMax) && salaryReview.salaryMax != "0") ? "max" : "nmax";
          config.$salaryLabel = translation.salaryLabel[min + "_" + max].replace("%min", salaryReview.salaryMin).replace("%max", salaryReview.salaryMax);

          this.ractive = new Ractive({
            el: widget.$container.attr("id"),
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

        init: function () {
          Ractive.DEBUG = false;
          var $style = $("<style></style>", {type: "text/css"});
          $style.text(css);
          $("head").append($style);

          var config = widget.$container.data();
          if (!config) {return false;}

          for (var prop in mapProperties) {
            var mapProp = mapProperties[prop];
            $.isFunction(mapProp) ? (config[prop] = mapProp(config[prop])) : (config[mapProp] = config[prop]);
          }
          //console.log(config);

          $.ajax({
            type: "POST",
            url: "@@backendUrl" + "/widget/salaryReview",
            headers: {"Accept": "application/json", "Content-Type": "application/json"},
            data: JSON.stringify(config),
            dataType: "json",
            timeout: 30000,
            success: function (salaryReview) {
              if ($.isNumeric(salaryReview.salaryReport.percentRank)) {
                return widget.render(salaryReview, config);
              }
              widget.$container.html("");
              widget.$container.append("<p>" + translation.noDataChart + ' <strong>'+salaryReview.jobTitle + "</strong></p>")
            }
          }).done(function() {

          });
        }
      });

      return widget;
    });
}
