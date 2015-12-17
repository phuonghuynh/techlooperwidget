var baseUrl = (function () {
  var paths = window.location.pathname.split('/');
  paths.pop();
  return window.location.protocol + '//' + window.location.host + paths.join('/');
})();

var backendUrl = "@@backendUrl";

var tlwFormValidator = undefined;

var updateSampleConfig = function (attrs) {
  attrs = attrs || "";
  $.get("sample/sampleSalaryReview.html", function (codeSample) {
    var wdHtml = codeSample
      .replace("${baseUrl}", baseUrl)
      .replace("${attrs}", attrs);
    $("#embedded-container").val(wdHtml);
    $("#widget-preview > div").html($("#embedded-container").val());
    $.getScript("/embed.min.js");
  });
}

var changeConfig = function () {
  $('.loading-page-time').removeClass('hide-loading');
  var attrs = "";
  var inputs = $(".tlwForm").find("[data-prop]");

  $.each(inputs, function (i, input) {
    var $input = $(input);
    var val = $input.val();

    var ignore = $input.is(":radio") && !$input.is(":checked");
    ignore = ignore || ($input.is("select") && val == "-1");

    if (ignore == true) {
      return true;
    }

    if (!val || val.length == 0) return true;
    attrs += 'data-' + $input.data('prop') + '="' + val + '" ';
  });

  if (tlwFormValidator.form()) {
    updateSampleConfig(attrs);
  }
  else {
    $("#widget-preview > div").html("");
  }
}
var applyData = function(){
  changeConfig();
};
$(function () {
  tlwFormValidator = $("form.tlwForm").validate({
    errorElement: "span",
    rules: {
      jobTitle: {required: true},
      jobSalary: {required: true, number: true}
    },
    errorPlacement: function (error, element) {
      error.appendTo(element.parents('.form-group'));
    }
  });

  //$(".tlwForm").find("[data-prop]").on("input", function (e) {
  //  changeConfig();
  //});
  //
  //$(".tlwForm select[data-prop]").on("change", function (e) {
  //  changeConfig();
  //});
  //
  //$("input[type=radio][data-prop]").change(function () {
  //  changeConfig();
  //});

  $("a.advance").click(function () {
    $("div.advanced-plugin").toggle();
    $(this).toggleClass('arrow-up');
    $(document).scrollTop($(document).height());
  });

  changeConfig();
  $("div.advanced-plugin").toggle();
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

  $("#jobSkill").easyAutocomplete({
    url: function (term) {return backendUrl + "/suggestion/skills/" + term;}
  });

  $("#jobTitle").easyAutocomplete({
    url: function (term) {return backendUrl + "/widget/suggestion/jobTitle/" + term;},
    width: "100%"
  });
});