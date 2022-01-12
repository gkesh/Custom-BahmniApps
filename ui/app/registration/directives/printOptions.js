'use strict';

angular.module('bahmni.registration')
    .directive('printOptions', ['$rootScope', 'registrationCardPrinter', 'spinner', 'appService', '$filter',
        function ($rootScope, registrationCardPrinter, spinner, appService, $filter) {
            var controller = function ($scope) {
                $scope.printOptions = appService.getAppDescriptor().getConfigValue("printOptions");
                $scope.defaultPrint = $scope.printOptions && $scope.printOptions[0];

                var mapRegistrationObservations = function () {
                    var obs = {};
                    $scope.observations = $scope.observations || [];
                    var getValue = function (observation) {
                        obs[observation.concept.name] = obs[observation.concept.name] || [];
                        observation.value && obs[observation.concept.name].push(observation.value);
                        observation.groupMembers.forEach(getValue);
                    };

                    $scope.observations.forEach(getValue);
                    return obs;
                };

                // Trihuli Implementation
                var getObservationData = function () {
                    var visitDetails = $scope.observations.filter((observation) => observation.label === "Visit Details")[0];
                    // Setting Visit Type
                    $scope.visitType = visitDetails.groupMembers.filter((concept) => concept.label === "Visit Type")[0].value.value;
                    $scope.visitCharge = $scope.defaultPrint.prices[$scope.visitType];
                };
                // Trihuli Implementation End

                $scope.print = function (option) {
                    getObservationData();
                    return registrationCardPrinter.print(option.templateUrl, $scope.patient, $rootScope.currentUser.username, $scope.visitDepartment, $scope.visitCharge, $scope.visitType, mapRegistrationObservations(), $scope.encounterDateTime);
                };

                $scope.buttonText = function (option, type) {
                    var printHtml = "";
                    var optionValue = option && $filter('titleTranslate')(option);
                    if (type) {
                        printHtml = '<i class="fa fa-print"></i>';
                    }
                    return '<span>' + optionValue + '</span>' + printHtml;
                };
            };

            return {
                restrict: 'A',
                templateUrl: 'views/printOptions.html',
                controller: controller
            };
        }]);
