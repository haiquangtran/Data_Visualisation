'use strict';

/**
 ** This is a service that helps discover the meaningful information from the PISA dataset.
 * These are all helper methods to create csv files for the vis etc.
 *
 * @ngdoc service
 * @name pisaVisualisationApp.queryService
 * @description
 * # queryService
 * Factory in the pisaVisualisationApp.
 */
angular.module('pisaVisualisationApp')
  .factory('queryService', function () {

    function addTo(array, arrayIndex, question, d, answer) {
      if (d[question] === answer) {
        array[arrayIndex]++;
      }
    }

    function doesQuestionMatchAnswer(question, d, answer) {
      if (d[question] === answer) {
        return true;
      }
      return false;
    }

    function addToExpectations(array, d, answer) {
      var expectations = ["PA19Q01", "PA19Q02", "PA19Q03", "PA19Q04", "PA19Q05", "PA19Q06"];

      for (var i = array.length-1; i >= 0; i--) {
        if (d[expectations[i]] === answer) {
          array[i]++;
          return;
        }
      }
    }

    function getSalaryIndex(d) {
      var salaryArray = ["Less than <$A>", "<$A> or more but less than <$B>",
        "<$B> or more but less than <$C>","<$C> or more but less than <$D>",
        "<$D> or more but less than <$E>","<$E> or more"];

      for (var i = 0; i < salaryArray.length; i++) {
        if (d["PA07Q01"] == salaryArray[i]) {
          return i;
        }
      }
    }

    function addToHeatMap(array, d, answer) {
      var salaryIndex = getSalaryIndex(d);
      if (salaryIndex == null) { return; }
      var salaryNum = 6;
      var expectationsArray = ["PA19Q01", "PA19Q02", "PA19Q03", "PA19Q04", "PA19Q05", "PA19Q06"];

      for (var i = expectationsArray.length; i >= 0; i--) {
        if (d[expectationsArray[i]] === answer) {
          array[(i * salaryNum) + salaryIndex]++;
          return;
        }
      }
    }

    function getParentsExpectationsBasedOnSalary(data) {
      // To create a csv file:
      // expectation,salary,motherFrequency,fatherFrequency
      var result = [];
      var salaryAnswerArray = ["Less than <$A>", "<$A> or more but less than <$B>",
        "<$B> or more but less than <$C>","<$C> or more but less than <$D>",
        "<$D> or more but less than <$E>","<$E> or more"];
      var expectationsArray = ["ISCED lv2", "ISCED lv3B,C", "ISCED lv3A", "ISCED lv4", "ISCED lv5B", "ISCED lv5A,6"];

      // expectation
      for (var i = 0; i < expectationsArray.length; i++) {
        // salary
        for (var j = 0; j < salaryAnswerArray.length; j++) {
          // expectation
          result.push(expectationsArray[i]);
          // salary
          result.push(salaryAnswerArray[j]);
          // father freq
          result.push(calculateParentsExpectationFrequency(data, expectationsArray[i], salaryAnswerArray[j], "father"));
          // mother freq
          result.push(calculateParentsExpectationFrequency(data, expectationsArray[i], salaryAnswerArray[j], "mother"));
          // other freq
          result.push(calculateParentsExpectationFrequency(data, expectationsArray[i], salaryAnswerArray[j], "other"));
        }
      }
      return result;
    }

    function calculateExpectationFrequency(data, expectationLevel, questionLikert, answerLikert) {
      var tick = "Tick";
      var frequency  = 0;
      data.forEach(function(d) {
        if (getHighestExpectationString(d) === expectationLevel
          && d[questionLikert] === answerLikert) {
          frequency++;
        }
      });
      return frequency;
    }

    function calculateParentsExpectationFrequency(data, expectationLevel, salaryAnswer, optionalParent) {
      // mother, father, other
      var parentQuestionsArray = ["PA01Q01", "PA01Q02", "PA01Q03"];
      var parentOptions = ["mother", "father", "other"];
      var tick = "Tick";

      var parent = optionalParent.toLowerCase();
      var frequency  = 0;
      data.forEach(function(d) {

        for (var i = 0; i < parentOptions.length; i++) {
          if (parent === parentOptions[0]
            || parent === parentOptions[1]
            || parent === parentOptions[2]) {
            if (parentOptions[i] === parent
              && getHighestExpectationString(d) === expectationLevel
              && d["PA07Q01"] === salaryAnswer
              && d[parentQuestionsArray[i]] === tick) {
              frequency++;
            }
          } else {
            // Total overall
            if (getHighestExpectationString(d) === expectationLevel && d["PA07Q01"] === salaryAnswer) {
              frequency++;
            }
          }
        }
      });
      return frequency;
    }

    /**
     * Helpers method for parents data only
     * @param index
     * @returns {*}
     */
    function convertIndexToQualificationString(index) {
      // Should not have 'None' value
      var parentQualifications = ["ISCED lv3A", "ISCED lv4","ISCED lv5B", "ISCED lv5A,6"];
      if (index >= 0) return parentQualifications[index];
    }

    /**
     * Extracts from a row the highest qualification in terms of education completed by a parent
     * @param qualificationsArray
     * @param d
     * @param answer
     * @returns {*}
     */
    function getHighestQualificationString(qualificationsArray, d, answer) {
      // Start looking for highest qualification
      for (var i = qualificationsArray.length-1; i >= 0; i--) {
        if (doesQuestionMatchAnswer(qualificationsArray[i], d, answer)) {
          return convertIndexToQualificationString(i);
        }
      }
      // Else see if they have a qualification (None)
      for (var i = 0; i < qualificationsArray.length; i++) {
        if (doesQuestionMatchAnswer(qualificationsArray[i], d, "No")) {
          return "None";
        }
      }
      return "";
    }

    function getHighestExpectationString(d) {
      var tick = "Tick";
      var expectationsArray = ["PA19Q01", "PA19Q02", "PA19Q03", "PA19Q04", "PA19Q05", "PA19Q06"];
      var expectationsAnswersArray = ["ISCED lv2", "ISCED lv3B,C", "ISCED lv3A", "ISCED lv4", "ISCED lv5B", "ISCED lv5A,6"];

      for (var i = expectationsArray.length-1; i >= 0; i--) {
        if (d[expectationsArray[i]] === tick) {
          return expectationsAnswersArray[i];
        };
      }
      // Missing
      return;
    }

    function getChildrensAnswersBasedOnExpectations(data) {
      // To create a csv file:
      // expectation,question,strongly disagree, disagree, agree, strongly agree
      // where question is the likert scaled rating answer
      var result = [];
      var likertQuestionArray = ["ST87Q01", "ST87Q04", "ST87Q05", "ST87Q06", "ST87Q07"];
      var likertAnswerArray = ["Strongly disagree", "Disagree", "Agree", "Strongly agree"];
      var expectationsArray = ["ISCED lv2", "ISCED lv3B,C", "ISCED lv3A", "ISCED lv4", "ISCED lv5B", "ISCED lv5A,6"];

      // expectation
      for (var i = 0; i < expectationsArray.length; i++) {
        // question
        for (var j = 0; j < likertQuestionArray.length; j++) {
          // expectation
          result.push(expectationsArray[i]);
          // answer
          result.push(likertQuestionArray[j]);
          // likert answer
          for (var answer = 0; answer < likertAnswerArray.length; answer++) {
            // disagree
            result.push(calculateExpectationFrequency(data, expectationsArray[i], likertQuestionArray[j], likertAnswerArray[answer]));
          }
        }
      }
      return result;
    }

    function calculateQualificationFrequency(data, expectationQuestion, salaryAnswer, qualificationAnswer, qualificationsArray) {
      var answer = "Yes";
      var frequency = 0;

      data.forEach(function(d) {
        // Only look at matching salary and expectation
        if (getHighestExpectationString(d) === expectationQuestion && d["PA07Q01"] === salaryAnswer) {
          var highestQualification= getHighestQualificationString(qualificationsArray, d, answer);
          // qualification
          if (qualificationAnswer === highestQualification) {
            frequency++;
          }
        }
      });
      return frequency;
    }

    function getQualifications(data) {
      // Each row should contain expectation, salary, mother qualification, mother frequency, father qualification, father frequency
      var results = [];
      var qualificationAnswers = ["None", "ISCED lv3A", "ISCED lv4", "ISCED lv5B", "ISCED lv5A,6"];
      var fatherQualificationsQuestions = ["PA03Q01", "PA03Q02", "PA03Q03", "PA03Q04"];
      var motherQualificationsQuestions = ["PA05Q01", "PA05Q02", "PA05Q03", "PA05Q04"];
      var salaryArray = ["Less than <$A>", "<$A> or more but less than <$B>",
        "<$B> or more but less than <$C>","<$C> or more but less than <$D>",
        "<$D> or more but less than <$E>","<$E> or more"];
      var expectationsArray = ["ISCED lv2", "ISCED lv3B,C", "ISCED lv3A", "ISCED lv4", "ISCED lv5B", "ISCED lv5A,6"];

      // expectation
      for (var row = 0; row < expectationsArray.length; row++) {
        // salary
        for (var col = 0; col < salaryArray.length; col++) {
          // Mothers qualifications
          //for (var i = 0; i < qualificationAnswers.length; i++) {
          // Fathers qualifications
          for (var j = 0; j < qualificationAnswers.length; j++) {
            //expectation, salary, mother qualification, father qualification
            results.push(expectationsArray[row]);
            results.push(salaryArray[col]);
            // Mother
            results.push(qualificationAnswers[j]);
            results.push(calculateQualificationFrequency(data, expectationsArray[row], salaryArray[col], qualificationAnswers[j], motherQualificationsQuestions));
            // Father
            results.push(qualificationAnswers[j]);
            results.push(calculateQualificationFrequency(data, expectationsArray[row], salaryArray[col], qualificationAnswers[j], fatherQualificationsQuestions));
            //}
          }
        }
      }
      return results;
    }

    function createCsvFile(results, outputFileName, headerInfo, indexCutPoint) {
      var csvContent = "data:text/csv;charset=utf-8,";
      csvContent += headerInfo + "\n";
      results.forEach(function(test, index){
        if ((index + 1) % indexCutPoint == 0) {
          csvContent += test.toString().concat("\n");
        } else {
          csvContent += test.toString().concat(",");
        }
      });
      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", outputFileName + ".csv");

      link.click(); // This will download the data file
    }

    // Public API here
    return {
      // HELPERS
      // Used to discover information from the PISA dataset.
      addTo: function(array, arrayIndex, question, data, answer) {
        return addTo(array, arrayIndex, question, data, answer);
      },
      addToExpectations: function(array, data, answer) {
        return addToExpectations(array, data, answer);
      },
      addToHeatMap: function(array, data, answer) {
        return addToHeatMap(array, data, answer);
      },
      doesQuestionMatchAnswer: function(question, data, answer) {
        return doesQuestionMatchAnswer(question, data, answer);
      },
      getQualifications: function(data) {
        return getQualifications(data);
      },
      getParentsExpectationsBasedOnSalary: function(data) {
        return getParentsExpectationsBasedOnSalary(data);
      },
      createCSVFile: function(results, outputFileName, headerInfo, indexCutPoint) {
        return createCsvFile(results, outputFileName, headerInfo, indexCutPoint);
      },
      getChildrensAnswersBasedOnExpectations: function(data) {
        return getChildrensAnswersBasedOnExpectations(data);
      }
    };
  });

