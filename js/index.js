var baseUrl = (function () {
  var paths = window.location.pathname.split('/');
  paths.pop();
  return window.location.protocol + '//' + window.location.host + paths.join('/');
})();

var tlwFormValidator = undefined;

var updateSampleConfig = function (attrs) {
  attrs = attrs || "";
  $.get("sample/salaryReview.text", function (codeSample) {
    var wdHtml = codeSample
      .replace("${baseUrl}", baseUrl)
      .replace("${attrs}", attrs);
    $("#embedded-container").val(wdHtml);
  });
}

var preview = function () {
  $("#widget-preview > div").html($("#embedded-container").val());
  $.getScript("/embed.min.js");
}

var changeConfig = function () {
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
}

$(function () {
  tlwFormValidator = $("form.tlwForm").validate({
    errorElement: "span",
    rules: {
      jobTitle: {required: true},
      jobSalary: {required: true}
    },
    errorPlacement: function (error, element) {
      error.appendTo(element.parents('.form-group'));
    }
  });

  $(".tlwForm").find("[data-prop]").on("input", function (e) {
    changeConfig();
  });

  $(".tlwForm select[data-prop]").on("change", function (e) {
    changeConfig();
  });

  $("button.preview").click(function () {
    changeConfig();
    preview();
  });

  $("a.advance").click(function () {
    $("div.advanced-plugin").toggle();
    $(document).scrollTop($(document).height());
  });

  changeConfig();
  preview();
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
});