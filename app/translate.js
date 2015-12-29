if (typeof define === "function" && define.amd && define.amd.jQuery) {
  define([],
    function () {
      "use strict";
      return {
        en: {
          thisJobIsBetterThan: "This job is better paid than",
          ofJobLikeThis: "of similar jobs",
          baseOn: "Based on",
          jobs: "jobs",
          thisJob: "Salary",
          salaryLabel: {
            min_max: "$%min - $%max", //has min & max
            min_nmax: "From $%min", //has min & not max
            nmin_max: "Up to $%max", //not min & has max
            nmin_nmax: "Negotiable" //not min & not max
          },
          noDataChart : "We could not create a report for",
          moreThan: "more than"
    },

        vi: {
          thisJobIsBetterThan: "Công việc này có mức lương cao hơn",
          ofJobLikeThis: "các công việc tương tự khác",
          baseOn: "Dựa trên",
          jobs: "việc làm",
          thisJob: "Mức lương",
          salaryLabel: {
            min_max: "$%min - $%max", //has min & max
            min_nmax: "Từ $%min", //has min & not max
            nmin_max: "Tới $%max", //not min & has max
            nmin_nmax: "Thương lượng" //not min & not max
          },
          noDataChart: "Chúng tôi không thể tạo ra một báo cáo cho",
          moreThan: "hơn"
        }
      }
    });
}