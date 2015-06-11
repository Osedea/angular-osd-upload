(function() {
    var osdResource = angular.module('osdUpload', [
        'ngFileUpload'
    ]);
})();

(function () {

    'use strict';

    var osdUpload = angular.module('osdUpload');

    // @ngInject
    function UploadConfig() {
        var self = this;

        var config = {
            uploadUrl: '/api/v1/uploads',
            maxSize: 100000000,
            supportedFileTypes: ['png', 'pdf', 'jpeg', 'jpg', 'mp4'],
        };

        self.config = function (data) {
            config = data;

            return self;
        };

        self.$get = function () {
            return config;
        };

        return self;
    }

    angular.module('osdUpload')
        .provider('UploadConfig', UploadConfig);
})();

(function() {
    angular.module('osdUpload')
        .constant('UPLOAD', {
            ERROR: {
                FILE_TYPE: 0,
                SIZE: 1
            }
        });
})();

(function() {

    // @ngInject
    function ImageUploadCtrl($rootScope, $scope, Upload) {

        $scope.onFileSelect = function($files) {
            Upload.post($files[0], data)
                .then(function(response) {
                    $rootScope.$emit('osdUploadSuccess', response);
                    $scope.progress = 0;
                }, function(error) {
                    $rootScope.$emit('osdUploadError', error);
                    $scope.progress = 0;
                }, function(event) {
                    $scope.progress = parseInt(100.0 * event.loaded / event.total);
                });
        };

        $rootScope.$on('osdUploadSizeExceeded', function(event, data) {
            $scope.maxSizeExceeded = true;
        });
    }

    // @ngInject
    function imageUpload() {
        return {
            restrict: 'E',

            replace: true,

            scope: {
                data: '=',
            },

            templateUrl: '/templates/image-upload.html',

            controller: 'ImageUploadCtrl',
        };
    }

    angular.module('osdUpload')
        .controller('ImageUploadCtrl', ImageUploadCtrl)
        .directive('imageUpload', imageUpload);
})();

(function () {

    // @ngInject
    function OsdUpload($q, Upload, UploadConfig, UPLOAD) {
        var self = this;

        /* Returns true if the file size is greater than max. */
        function sizeExceeded($file) {
            return $file.size > UploadConfig.maxSize;
        }

        /* Returns true if the file type is in the list of supported types. */
        function supportedType($file, supportedTypes) {
            var fileTypeRegex = supportedTypes ? supportedTypes.join('|') : UploadConfig.supportedFileTypes.join('|');

            var pattern = new RegExp(fileTypeRegex, "g");

            return pattern.test($file.type);
        }

        /* Send ajax request and return a promise. */
        self.post = function ($file, data, supportedTypes) {
            var defer = $q.defer();

            /* Reject promise if upload size was exceeded. */
            if (sizeExceeded($file)) {
                defer.reject({
                    type: UPLOAD.ERROR.SIZE,
                    message: 'File size exceeded.'
                });

                return defer.promise;
            }

            /* Reject promise if file type is not supported. */
            if (!supportedType($file, supportedTypes)) {
                defer.reject({
                    type: UPLOAD.ERROR.FILE_TYPE,
                    message: 'File type not supported.'
                });

                return defer.promise;
            }

            /* Build data to be posted to upload route. */
            var params = {
                url: UploadConfig.uploadUrl,
                file: $file,
                data: data,
                fileName: 'file'
            };

            Upload.upload(params)
                .progress(function (event) {
                    defer.notify(event);
                })
                .success(function (response) {
                    defer.resolve(response);
                })
                .error(function (error) {
                    defer.reject(error);
                });

            return defer.promise;
        };

        return self;
    }

    angular.module('osdUpload')
        .factory('OsdUpload', OsdUpload);
})();
