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
          noDataChart : "We could not create a report for in . While we are improving, you could update your information here to get your Salary Report."
    },

        vi: {
          thisJobIsBetterThan: "Công việc này có mức lương cao hơn",
          ofJobLikeThis: "các công việc tương tự khác",
          baseOn: "Dựa trên",
          jobs: "việc làm",
          thisJob: "Mức lương",
          salaryLabel: {
            min_max: "$%s - $%s", //has min & max
            min_nmax: "Từ $%s", //has min & not max
            nmin_max: "Tới $%s", //not min & has max
            nmin_nmax: "Thương lượng" //not min & not max
          },
          noDataChart: "Không có dữ liệu"
        }
      }
    });
}