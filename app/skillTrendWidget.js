if (typeof define === "function" && define.amd && define.amd.jQuery) {
  define(["jquery", "ractive", "rv!app/template/skillTrend", "text!app/css/skill-trend.min.css", "app/translate"],
    function ($, Ractive, mainTemplate, css, translate) {
      "use strict";
      $.noConflict(true);

      var defaultCampaign = "skillTrendWidget";

      //var tid = /tid=([^&]+)/.exec(window.location.search); // Value is in [1] ('384' in our case)
      var widget = {};
      widget.$container = $("#tlwst");

      var lang = (widget.$container.data('lang') == "vi" ? "vi" : "en");
      var translation = translate[lang];
      console.log(css);
      $.extend(true, widget, {
        render: function (salaryReview, config) {
          this.ractive = new Ractive({
            el: widget.$container.attr("id"),
            template: mainTemplate,
            data: {
              translation: translation,
              campaign: config.campaign || defaultCampaign
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
        }
      });
      return widget;
    });
}
