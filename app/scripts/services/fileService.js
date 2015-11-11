'use strict';

/**
 * @ngdoc service
 * @name pisaVisualisationApp.fileService
 * @description
 * # fileService
 * Factory in the pisaVisualisationApp.
 */
angular.module('pisaVisualisationApp')
  .factory('fileService', function ($http, $q) {
    var dir = "data/";

    /* Load Data from Files */
    /* Get the name of CSV files */

    function getFileNameParents() {
      return dir + "parent_answers.csv";
    }

    function getFileNameStudents() {
      return dir + "students_answers.csv";
    }

    function getFileNameAllParentsExpectations() {
      return dir + "all_parents_expectations.csv";
    }

    function getFileNameParentsExpectations() {
      return dir + "parents_expectations.csv"
    }

    function getFileNameTotalParentsExpectations() {
      return dir + "total_parents_expectations.csv";
    }

    function getFileNameTotalParentsQualifications() {
      return dir + "total_parents_qualifications.csv"
    }

    function getFileNameTotalFeelings() {
      return dir + "parents_expectations_vs_feelings.csv"
    }

    function getFileNameSchoolFeelings_l2() {
      return dir + "school_feelings_l2.csv"
    }

    function getFileNameSchoolFeelings_l3() {
      return dir + "school_feelings_l3.csv"
    }

    function getFileNameSchoolFeelings_l3A() {
      return dir + "school_feelings_l3A.csv"
    }

    function getFileNameSchoolFeelings_l4() {
      return dir + "school_feelings_l4.csv"
    }

    function getFileNameSchoolFeelings_l5B() {
      return dir + "school_feelings_l5B.csv"
    }

    function getFileNameSchoolFeelings_l6() {
      return dir + "school_feelings_l6.csv"
    }

    // Public API here
    return {
      getFileNameStudents: getFileNameStudents(),
      getFileNameParents: getFileNameParents(),
      getFileNameAllParentsExpectations: getFileNameAllParentsExpectations(),
      getFileNameTotalParentsExpectations: getFileNameTotalParentsExpectations(),
      getFileNameTotalParentsQualifications: getFileNameTotalParentsQualifications(),
      getFileNameParentsExpectations: getFileNameParentsExpectations(),
      getFileNameTotalFeelings: getFileNameTotalFeelings(),
      getFileNameSchoolFeelings_l2: getFileNameSchoolFeelings_l2(),
      getFileNameSchoolFeelings_l3: getFileNameSchoolFeelings_l3(),
      getFileNameSchoolFeelings_l3A: getFileNameSchoolFeelings_l3A(),
      getFileNameSchoolFeelings_l4: getFileNameSchoolFeelings_l4(),
      getFileNameSchoolFeelings_l5B: getFileNameSchoolFeelings_l5B(),
      getFileNameSchoolFeelings_l6: getFileNameSchoolFeelings_l6()
    };
  });

