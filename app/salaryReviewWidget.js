if (typeof define === "function" && define.amd && define.amd.jQuery) {
  define(["jquery", "ractive", "rv!app/template/salaryReview", "text!app/css/salary-widget.min.css", "app/translate", "app/configure"],
    function ($, Ractive, mainTemplate, css, translate, configure) {
      "use strict";
      $.noConflict(true);

      var defaultCampaign = "salarywidget";

      var widget = {};
      widget.$container = $($(".tlwsrw")[0]);
      widget.$container.removeClass("tlwsrw");

      //const values used to calculate salary-review data
      var preferMeterValues = [170, 162, 148, 135, 112, 90, 67, 45, 31, 18, 8];

      var lang = (widget.$container.data('lang') == "vi" ? "vi" : "en");
      var translation = translate[lang];

      $.extend(true, widget, {
        render: function (salaryReview, config) {
          if (salaryReview.salaryReport.percentRank > 92) {
            $('.current-position').addClass('right-position');
          }
          else {
            if (salaryReview.salaryReport.percentRank < 10) {
              $('.current-position').addClass('left-position');
            }
            else {
              config.$arrowPosition = ((widget.$container.width() * salaryReview.salaryReport.percentRank) / 100) - 65;
            }
          }
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
          config.$salaryLabel = translation.salaryLabel[min + "_" + max]
            .replace("%min", configure.formatNumber(salaryReview.salaryMin))
            .replace("%max", configure.formatNumber(salaryReview.salaryMax));

          var visibleSalary = (salaryReview.isSalaryVisible == false) ? false : config.salaryVisible;
          if (!visibleSalary) config.$salaryLabel = translation.salaryLabel.nmin_nmax;

          var campaign = config.campaign || defaultCampaign;
          $.each(salaryReview.salaryReport.salaryRanges, function (i, salaryRange) {
            salaryRange.percentile = configure.formatNumber(salaryRange.percentile);
          });
          
          this.ractive = new Ractive({
            el: widget.$container,
            template: mainTemplate,
            data: {
              translation: translation,
              salaryReview: salaryReview,
              salaryRanges: salaryReview.salaryReport.salaryRanges,
              visibleSalary: visibleSalary,
              widgetFormat: config.widgetFormat,//"arrow" / "meter"
              arrowPosition: config.$arrowPosition,
              meterPosition: config.$meterPosition,
              salaryLabel: config.$salaryLabel,
              campaign: campaign
            },
            answer: function(utm_medium) {
              widget.$container.find('.valuable-report').hide();
              var utmContent = '';
              if(config.jobId){
                utmContent = '&utm_content=' + config.jobId;
              }
              window.open('http://techlooper.com/#/home?utm_source=salarywidget&utm_medium=' + utm_medium + '&utm_campaign=' + campaign + utmContent);
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

          config = configure.refine(config);

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
              widget.$container.append("<p>" + translation.noDataChart + ' <strong>' + salaryReview.jobTitle + "</strong></p>")
            },
            complete: function () {
              //$('.cssload-wrap').remove();
            }
          });
        }
      });

      return widget;
    });
}
