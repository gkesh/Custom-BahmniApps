'use strict';

angular.module('bahmni.registration')
    .factory('registrationCardPrinter', ['printer', function (printer) {
        var print = function (templatePath, patient, user, department, charge, type, obs, encounterDateTime) {
            templatePath = templatePath || "views/nolayoutfound.html";
            printer.print(templatePath, {patient: patient, user: user, department: department, charge: charge, type: type, today: new Date(), obs: obs || {}, encounterDateTime: encounterDateTime });
        };

        return {
            print: print
        };
    }]);
