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
    var attrs = "";
    var inputs = $(".tlwForm").find("[data-prop]");

    $.each(inputs, function(i, input) {
      var $input = $(input);
      var val = $input.val();
      if (!val || val.length == 0) return true;
      attrs += 'data-' + $input.data('prop') + '="' + val + '" ';
    });

    loadCodeSample(attrs);
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