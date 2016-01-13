if (typeof define === "function" && define.amd && define.amd.jQuery) {
  define(["jquery", "ractive", "rv!app/template/skillTrend", "text!app/css/skill-trend.min.css", "app/translate", "app/configure"],
    function ($, Ractive, mainTemplate, css, translate, configure) {
      "use strict";
      $.noConflict(true);
      var defaultCampaign = "skillTrendWidget";

      //var tid = /tid=([^&]+)/.exec(window.location.search); // Value is in [1] ('384' in our case)
      var widget = {};
      widget.$container = $($(".tlwst")[0]);
      widget.$container.removeClass("tlwst");

      var lang = (widget.$container.data('lang') == "vi" ? "vi" : "en");
      var translation = translate[lang];

      $.extend(true, widget, {
        render: function (skillTrend, config) {
          var campaign = config.campaign || defaultCampaign;
          //skillTrend.salaryMin = "" + skillTrend.salaryMin;
          //skillTrend.salaryMax = "" + skillTrend.salaryMax;
          //var min = ($.isNumeric(skillTrend.salaryMin) && skillTrend.salaryMin != "0") ? "min" : "nmin";
          //var max = ($.isNumeric(skillTrend.salaryMax) && skillTrend.salaryMax != "0") ? "max" : "nmax";
          //config.$salaryLabel = translation.salaryLabel[min + "_" + max].replace("%min", skillTrend.salaryMin).replace("%max", skillTrend.salaryMax);
          this.ractive = new Ractive({
            el: widget.$container,
            template: mainTemplate,
            data: {
              config: config,
              skillTrend: skillTrend,
              translation: translation,
              campaign: campaign
            },
            answer: function (utm_medium) {
              widget.$container.find('.valuable-report').hide();
              window.open('http://techlooper.com/#/home?utm_source=salarywidget&utm_medium=' + utm_medium + '&utm_campaign=' + campaign, '_blank');
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
          //console.log(config);

          $.ajax({
            type: "POST",
            url: "@@backendUrl" + "/getPromotedWidget",
            headers: {"Accept": "application/json", "Content-Type": "application/json"},
            data: JSON.stringify(config),
            dataType: "json",
            timeout: 30000,
            success: function (skillTrend) {

              if ($.isNumeric(skillTrend.salaryMin) && $.isNumeric(skillTrend.salaryMax) ) {
                return widget.render(skillTrend, config);
              }
              widget.$container.html("");
              widget.$container.append("<p>" + translation.noDataChart + ' <strong>'+ config.jobTitle + "</strong></p>");
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
