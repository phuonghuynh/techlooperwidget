var baseUrl = (function () {
  var paths = window.location.pathname.split('/');
  paths.pop();paths.pop();//remove "demo"
  //if (paths[paths.length - 1] == "demo") paths.pop();
  return window.location.protocol + '//' + window.location.host + paths.join('/');
})();

var backendUrl = "@@backendUrl";

var tlwFormValidator = undefined;

var updateSampleConfig = function (attrs) {
  attrs = attrs || "";
  $.get("sample/sampleSkillTrend.html", function (codeSample) {
    var wdHtml = codeSample
      .replace("${baseUrl}", baseUrl)
      .replace("${attrs}", attrs);
    $("#embedded-container").val(wdHtml);
    $("#widget-preview > div").html($("#embedded-container").val());
    $.getScript("/skill-trend.min.js");
  });
}

var changeConfig = function () {
  $('.loading-page-time').removeClass('hide-loading');

  var param = {};
  window.location.search.substr(1).split("&").forEach(function(item) {param[item.split("=")[0]] = item.split("=")[1]});
  var jobId = param["job-id"] || param["jobId"];
  var campaign = param["campaign"];

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
    jobId && (attrs += 'data-job-id="' + jobId + '"');
    campaign && (attrs += 'data-campaign="' + campaign + '"');
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
  changeConfig();
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