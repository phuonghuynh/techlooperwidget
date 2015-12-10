if (typeof define === "function" && define.amd && define.amd.jQuery) {
  define([],
    function () {
      "use strict";
      return {
        en: {
          thisJobIsBetterThan: "This job is better paid than",
          ofJobLikeThis: "of jobs like this",
          baseOn: "Based on",
          jobs: "jobs",
          thisJob: "This job"
        },

        vi: {
          thisJobIsBetterThan: "Công việc này có mức lương cao hơn",
          ofJobLikeThis: "các công việc tương tự khác",
          baseOn: "Dựa trên",
          jobs: "việc làm",
          thisJob: "Việc làm này"
        }
      }
    });
}