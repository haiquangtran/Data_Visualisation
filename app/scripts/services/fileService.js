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

    // Public API here
    return {
      getFileNameStudents: getFileNameStudents(),
      getFileNameParents: getFileNameParents(),
      getFileNameAllParentsExpectations: getFileNameAllParentsExpectations(),
      getFileNameTotalParentsExpectations: getFileNameTotalParentsExpectations(),
      getFileNameTotalParentsQualifications: getFileNameTotalParentsQualifications(),
      getFileNameParentsExpectations: getFileNameParentsExpectations(),
      test: dir + "test.csv"
    };
  });

