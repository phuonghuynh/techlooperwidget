//var reloadWidget = function() {
//  //require(["jquery"], function ($) {
//  //  "use strict";
//  //  console.log($.TechlooperWidgets);
//  //});
//}

var loadCodeSample = function(attrs) {
  attrs = attrs || "";
  $.get("codeSample.text", function(codeSample) {
    var wdHtml = codeSample.replace("${attrs}", attrs);
    $("#embedded-container").val(wdHtml);
    $("#widget-preview > div").html(wdHtml);
    $.getScript("/embed.min.js");
  });
}

$(function () {

  function change_config() {
    //var $code = $("#embedded-container");

    var attrs = "";
    var inputs = $(".tlwForm").find("[data-prop]");

    $.each(inputs, function(i, input) {
      var $input = $(input);
      var val = $input.val();
      if (!val || val.length == 0) return true;
      attrs += 'data-' + $input.data('prop') + '="' + val + '" ';
    });

    loadCodeSample(attrs);

    //reloadWidget();
    //console.log($dataProp.val());
    //console.log($dataProp.data("prop"));
//        var $lang_val = $("#vietnamworks-jobs").data("vnw-lang");
//        var $email_val = $("#vietnamworks-jobs").data("vnw-email");
//        var $keyword_val = $("#vietnamworks-jobs").data("vnw-keyword");
//        var $location_val = $("#vietnamworks-jobs").data("vnw-location");
//        if ($location_val == "-1") {
//          $location_val = "";
//        }
//        var $industry_val = $("#vietnamworks-jobs").data("vnw-industry");
//        if ($industry_val == "-1") {
//          $industry_val = "";
//        }
//        var $numjobs_val = $("#vietnamworks-jobs").data("vnw-numjobs");
//        if ($numjobs_val == "") {
//          $numjobs_val = 10;
//        }
//        var $widget_height_val = $("#vietnamworks-jobs").data("vnw-widget-height");
//        if ($widget_height_val == "") {
//          $widget_height_val = 500;
//        }
//        var $widget_width_val = $("#vietnamworks-jobs").data("vnw-widget-width");
//        if ($widget_width_val == "") {
//          $widget_width_val = "100%";
//        }

    //var tlwContainer = document.createElement("div");
    //tlwContainer.setAttribute("id", "tlw");
//        tlwContainer.setAttribute("data-vnw-lang", $lang_val);
//        if ($email_val != '') {
//          tlwContainer.setAttribute("data-vnw-email", $email_val);
//        }
//        if ($keyword_val != '') {
//          tlwContainer.setAttribute("data-vnw-keyword", $keyword_val);
//        }
//        if ($location_val != '') {
//          tlwContainer.setAttribute("data-vnw-location", $location_val);
//        }
//        if ($industry_val != '') {
//          tlwContainer.setAttribute("data-vnw-industry", $industry_val);
//        }
//        tlwContainer.setAttribute("data-vnw-numjobs", $numjobs_val);
//        tlwContainer.setAttribute("data-vnw-widget-height", $widget_height_val);
//        tlwContainer.setAttribute("data-vnw-widget-width", $widget_width_val);

//        var strvnwjobscontainer = tlwContainer.outerHTML;
//    $("#embedded-container").html(tlwContainer.outerHTML + js_script_escape);
//    require(["app/app"], function (app) {
//      "use strict";
//      app.reload();
////                    app.reload($email_val,$keyword_val,$industry_val,$location_val,$numjobs_val,$lang_val,$widget_height_val,$widget_width_val);
//    });
  }

  $(".tlwForm").find("[data-prop]").on("input", function (e) {
    change_config();
  });

  $(".tlwForm select[data-prop]").on("change", function (e) {
    change_config();
  });

  loadCodeSample();
  change_config();
});

$(function () {
  $('#widget select:not(.tags)').select2({
    width: '100%'
  });

  $('#widget select.tags').select2({
    tags: true,
    allowClear: true,
    tokenSeparators: [';', " "]
  });
})