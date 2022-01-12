'use strict';

angular.module('bahmni.registration')
    .controller('QRCodeController', ['$scope', 'patientService', 'openmrsPatientMapper', function ($scope, patientService, openmrsPatientMapper) {
            $scope.qrLoading = false;
            $scope.qrPatient = {};
            $scope.qrPatientLoaded = false;

            // Checking camera connection
            $scope.hasCameraConnected = navigator.mediaDevices && navigator.mediaDevices.getUserMedia;

            // Setting up QR Code Worker
            QrScanner.WORKER_PATH = "../components/qr-scanner/qr-scanner-worker.min.js";
            var qrScanner = null;
            var qrUuid = null;

            // Stopping the scan
            var stopScan = function () {
                if (qrScanner) {
                    qrScanner.stop();
                }
            }

            var getPatientByUuid = function (uuid, callback) {
                patientService.get(uuid)
                    .then(callback)
                    .catch(() => {
                        // Recieved invalid Code Retrying
                        qrPatient = undefined;
                        $scope.qrPatientLoaded = false;
                        $scope.startScan();
                    })
            }

            var getProfileLinkFromUuid = function () {
                if (qrUuid) {
                    var currentHref = location.href;
                    var url = currentHref.substring(0, currentHref.lastIndexOf("/"));
                    location.href = `${url}/patient/${qrUuid}`;
                }
            }

            $scope.resetScan = function () {
                if (qrScanner) {
                    stopScan();
                    $scope.qrLoading = false;
                    $scope.qrPatient = {};
                    $scope.qrPatientLoaded = false;
                    qrUuid = null;
                }
            }

            // Callback to show the user Profile
            var showProfileOnScan = function (result) {
                if (result) {
                    $scope.qrLoading = true;
                    qrUuid = result;
                    stopScan();

                    getPatientByUuid(result, (openMRSPatient) => {
                        var qrOpenMRSPatient = openmrsPatientMapper.map(openMRSPatient);

                        if (qrOpenMRSPatient) {
                            $scope.qrPatient = {
                                id: qrOpenMRSPatient.primaryIdentifier.identifier,
                                name: qrOpenMRSPatient.givenName + " " + qrOpenMRSPatient.familyName,
                                link: getProfileLinkFromUuid,
                                dob: qrOpenMRSPatient.registrationDateBS,
                                gender: qrOpenMRSPatient.gender,
                                address: qrOpenMRSPatient.address.cityVillage + ", " + qrOpenMRSPatient.address.countryDistrict
                            }

                            $scope.qrPatientLoaded = true;
                            $scope.qrLoading = false;
                        }
                    });
                }
            };

            $scope.startScan = function () {
                qrScanner = new QrScanner(document.getElementById("qrcode-live"), showProfileOnScan);

                if (qrScanner) {
                    qrScanner.start();
                }
            }
        }]);