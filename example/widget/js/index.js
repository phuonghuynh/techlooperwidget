$(function () {
  var js_script_escape = "&lt;script&gt;(function (window, document) {  var loader = function () {    var script = document.createElement(&quot;script&quot;), tag = document.getElementsByTagName(&quot;script&quot;)[0];script.src = &quot;http://widget.vietnamworks.com/embed.min.js&quot;;tag.parentNode.insertBefore(script, tag); }; window.addEventListener ? window.addEventListener(&quot;load&quot;, loader, false) : window.attachEvent(&quot;onload&quot;, loader);})(window, document);&lt;/script&gt;";

  function change_config($dataProp) {
    var $code = $("#embedded-container");

    var attrs = "";

    var $attrs = $(".tlwForm").find("[data-prop]");
    $.each($attrs, function(i, attr) {
      if ($dataProp.val().length == 0) return true;
      attrs += 'data-' + $dataProp.data('prop') + '="' + $dataProp.val() + '"';
    });
    loadCodeSample(attrs);

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
    require(["app/app"], function (app) {
      "use strict";
      app.reload();
//                    app.reload($email_val,$keyword_val,$industry_val,$location_val,$numjobs_val,$lang_val,$widget_height_val,$widget_width_val);
    });
  }

  var loadCodeSample = function(attrs) {
    attrs = attrs || "";
    $.get("codeSample.text", function(codeSample) {
      $("#embedded-container").val(codeSample.replace("${attrs}", attrs));
    });
  }

  $(".tlwForm").find("[data-prop]").on("input", function (e) {
    change_config($(e.currentTarget));
  });

  loadCodeSample();

//            $("#lang").change(function () {
//                var $lang_val = $(this).val();
//                $("#vietnamworks-jobs").data("vnw-lang", $lang_val);
//                change_config();
//            });
//            $("#email").change(function () {
//                var $email_val = $(this).val();
//                $("#vietnamworks-jobs").data("vnw-email", $email_val);
//                change_config();
//            });
//            $("#keyword").change(function () {
//                var $keyword_val = $(this).val();
//                $("#vietnamworks-jobs").data("vnw-keyword", $keyword_val);
//                change_config();
//            });
//            $("#industry").change(function () {
//                var $industry_val = $(this).val();
//                if ($industry_val == "-1") {
//                    $industry_val = "";
//                }
//                $("#vietnamworks-jobs").data("vnw-industry", $industry_val);
//                change_config();
//            });
//            $("#location").change(function () {
//                var $location_val = $(this).val();
//                if ($location_val == "-1") {
//                    $location_val = "";
//                }
//                $("#vietnamworks-jobs").data("vnw-location", $location_val);
//                change_config();
//            });
//            $("#numjobs").change(function () {
//                var $numjobs_val = $(this).val();
//                $("#vietnamworks-jobs").data("vnw-numjobs",$numjobs_val);
//                change_config();
//            });
//            $("#widget-height").change(function () {
//                var $widget_height_val = $(this).val();
//                $("#vietnamworks-jobs").data("vnw-widget-height",$widget_height_val);
//                change_config();
//            });
//            $("#widget-width").change(function () {
//                var $widget_width_val = $(this).val();
//                $("#vietnamworks-jobs").data("vnw-widget-width",$widget_width_val);
//                change_config();
//            });
});

$(function () {
  $('#widget select').select2({
    width: '100%'
  });
})