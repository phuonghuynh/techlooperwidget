//var tlSalaryReviewUrl = "";

if (typeof define === "function" && define.amd && define.amd.jQuery) {
  define(["jquery", "ractive", "rv!templates/template", "text!css/my-widget_embed.css", "app/translate"],
    function ($, Ractive, mainTemplate, css, translate) {
      "use strict";
      $.noConflict(true);

      var app = {};
      app.$container = $("#tlw");

      //const values used to calculate salary-review data
      var preferMeterValues = [170, 162, 148, 135, 112, 90, 67, 45, 31, 18, 8];
      var mapProperties = {
        jobId: "techlooperJobId"
      }

      $.extend(true, app, {
        render: function (salaryReview) {
          var myPositionArrow = (($('.salary-chart').width() * salaryReview.salaryReport.percentRank) / 100) - 40;

          var myPositionMeter = 0;
          var position = (180 * salaryReview.salaryReport.percentRank / 100);
          $.each(preferMeterValues, function(i, preferValue) {
            if (position >= preferValue) {
              myPositionMeter = preferMeterValues.length - i + 1;
              return false;
            }
          });
          myPositionMeter = Math.max(myPositionMeter, 1);

          this.ractive = new Ractive({
            el: app.$container.attr("id"),
            template: mainTemplate,
            data: {
              translation: translate[app.$container.data('lang')],
              salaryReview: salaryReview,
              salaryRanges: salaryReview.salaryReport.salaryRanges,
              myPositionArrow: myPositionArrow,
              myPositionMeter: myPositionMeter
            }
          });
        },

        init: function () {
          Ractive.DEBUG = false;
          var $style = $("<style></style>", {type: "text/css"});
          $style.text(css);
          $("head").append($style);

          var salaryReviewPostData = app.$container.data();
          for (var prop in mapProperties) {
            salaryReviewPostData[mapProperties[prop]] = salaryReviewPostData[prop];
          }

          var url = "http://localhost:8080/salaryReview";
          $.getJSON("js/salaryReviewSample.json", function (salaryReview) {
            app.render(salaryReview);
          });


          //$.ajax({
          //  type: "POST",
          //  url: url,
          //  headers: {
          //    "Accept": "application/json",
          //    "Content-Type": "application/json"
          //  },
          //  data: JSON.stringify(salaryReviewPostData),
          //  dataType: "json",
          //  success: function (salaryReview) {
          //    app.render(salaryReview);
          //  }
          //});
        }
      });

      return app;
    });
}


//define("$tlw", ['jquery', 'ractive', 'rv!templates/template', 'text!css/my-widget_embed.css'],
//  function ($widget, Ractive, mainTemplate, jobListTemplate, css) {
//
//    'use strict';
//    $widget.noConflict(true);
//    var app = {
//      init: function () {
//        Ractive.DEBUG = false;
//        dataJobsList = [];
//        var $style = $widget("<style></style>", {type: "text/css"});
//        $style.text(css);
//        $widget("head").append($style);
//
//        // render our main view
//        this.ractive = new Ractive({
//          el: 'tlw',
//          template: mainTemplate
//        });
//        //this.ractive = new Ractive({
//        //  el: 'tlw',
//        //  template: mainTemplate,
//        //  partials: {
//        //    jobList: jobListTemplate
//        //  }
//        //});
//
//        //var lang = $widget('#tlw').data('vnw-lang');
//        //if (lang == '2') {
//        //  lang = 'en';
//        //}
//        //else {
//        //  lang = 'vn';
//        //}
//
//        //var tranlation = {};
//        //$widget.each(translationData, function (key, value) {
//        //  tranlation[key] = value[lang];
//        //});
//
//        //this.ractive.set("translation", tranlation);
//        this.ractive.set("domain", document.domain);
//        //loadJobListFromVNW($widget, this.ractive, 1);
//
//        //$widget(function () {
//        //  function postDateCheck() {
//        //    if ($widget('.job-list').width() <= 300) {
//        //      $widget('.job-list').addClass('no-date');
//        //    }
//        //    else {
//        //      $widget('.job-list').removeClass('no-date');
//        //    }
//        //  }
//        //
//        //  postDateCheck();
//        //
//        //  $widget(window).resize(function () {
//        //    postDateCheck();
//        //  });
//        //});
//
//      },
//
//      reload: function (jobId, $lang, $height, $width) {
//        //re-set data from agrument
//        //$widget('#tlw').data('job-id', jobId);
//        //$widget('#vietnamworks-jobs').data('vnw-keyword', $job_title);
//        //$widget('#vietnamworks-jobs').data('vnw-industry', $job_category);
//        //$widget('#vietnamworks-jobs').data('vnw-location', $job_location);
//        //$widget('#vietnamworks-jobs').data('vnw-numjobs', $page_size);
//        //$widget('#vietnamworks-jobs').data('vnw-lang', $lang);
//        //$widget('#vietnamworks-jobs').data('vnw-widget-height', $height);
//        //$widget('#vietnamworks-jobs').data('vnw-widget-width', $width);
//        console.log("reload");
//        app.init();
//      }
//    };
//
//    return app;
//  });

//function loadJobListFromVNW($widget,that,currentPage){
//    pageSize = $widget('#vietnamworks-jobs').data('vnw-numjobs');
//    if(pageSize == ''){
//        pageSize = 5;
//    }
//
//    $widget.ajax({
//        url: "https://api.vietnamworks.com/jobs/search-jsonp/",
//        dataType: "jsonp",
//        data: {
//            'CONTENT-MD5' : "4c443c7e2c515d6b4b4d693c2f63434a7773226a614846733c4c4d4348",
//            'email': $widget('#vietnamworks-jobs').data('vnw-email'),
//            'lang': $widget('#vietnamworks-jobs').data('vnw-lang'),
//            'job_title': $widget('#vietnamworks-jobs').data('vnw-keyword'),
//            'job_category': $widget('#vietnamworks-jobs').data('vnw-industry'),
//            'job_location': $widget('#vietnamworks-jobs').data('vnw-location'),
//            'page_size': pageSize,
//            'current_page': currentPage
//        }
//
//    }).then(function (resp) {
//        //Re-get language
//        var lang = $widget('#vietnamworks-jobs').data('vnw-lang');
//        if(lang == '2'){
//            lang = 'en';
//        }else{
//            lang = 'vn';
//        }
//
//        //resp = $widget.parseJSON(resp);
//        resp=JSON.parse(resp);
//        var rsApiCode=resp.meta.code;
//        if(rsApiCode==200){
//            if(resp.data.jobs ==""){
//                that.set("not_found_job",1);
//            }
//            else{
//                $widget.each( resp.data.jobs, function( key, value ) {
//                    var postedDate=value.posted_date;
//                    var arrPostDate= postedDate.split("/");
//                    value.posted_day=arrPostDate[0];
//                    //translate month
//                    value.posted_month=translationData["month_"+arrPostDate[1]][lang];
//                    dataJobsList.push(value);
//                });
//                var totalDisplayJob = dataJobsList.length;
//                var total = resp.data.total;
//                that.set("jobs",dataJobsList);
//                $widget('#load-more-jobs-from-vnw').off('click');
//                if(total>totalDisplayJob){
//                    $widget('#load-more-jobs-from-vnw').on('click',function(){
//                        var currentPage = totalDisplayJob/pageSize + 1;
//                        //currentPage = currentPage + 1;
//                        loadJobListFromVNW($widget,that,currentPage);
//                    });
//                    $widget('#load-more-jobs-from-vnw').show();
//                }else{
//                    $widget('#load-more-jobs-from-vnw').hide();
//                }
//
//                $widget(function () {
//                    'use strict';
//                    $widget('.show-more').each(function () {
//                        $widget(this).click(function () {
//
//                            var boxIsVisible = $widget(this).parents('li').find('.show-more-info-box').hasClass('in'),
//                                $thisBox = $widget(this).parents('li').find('.show-more-info-box'),
//                                $self = $widget(this);
//                            if (!boxIsVisible) {
//                                $thisBox.removeClass('hide');
//                                $self.html(translationData['show_less'][lang]+' <span class="icon-caret-down"></span>');
//                                $thisBox.addClass('in').removeClass('hide').slideDown(300);
//                                $self.find('.icon-caret-down').removeClass('icon-caret-down').addClass('icon-caret-up');
//                            } else {
//                                $self.html(translationData['show_more'][lang]+' <span class="icon-caret-up"></span>');
//                                $thisBox.removeClass('in').addClass('hide').slideUp(300);
//                                $self.find('.icon-caret-up').removeClass('icon-caret-up').addClass('icon-caret-down');
//
//                            }
//                        })
//                    });
//                    $widget('#vietnamworks-jobs').css("width",$widget('#vietnamworks-jobs').data('vnw-widget-width'));
//                    $widget('.scrollbar-outer').scrollbar();
//                    $widget('.scrollbar-outer').height($widget('#vietnamworks-jobs').data('vnw-widget-height'));
//                });
//            }
//        }else if(rsApiCode==400){
//            that.set("not_found_job",1);
//        }
//
//    }, function (resp) {
//        console.log(resp);
//    });
//}
