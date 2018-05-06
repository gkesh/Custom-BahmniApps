'use strict';

angular.module('bahmni.registration')
    .directive('npdatepicker', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {
                element.nepaliDatePicker({
                    dateFormat: "%y-%m-%d",
                    closeOnDateSelect: true,
                    minDate: attrs.min !== '' && attrs.min !== 'undefined' ? attrs.min : null,
                    maxDate: attrs.max !== '' && attrs.max !== 'undefined' ? attrs.max : null
                });
                element.on('dateSelect', function (event) {
                    element.trigger('input');
                });
            }
        };
    })