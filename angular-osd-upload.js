(function() {
    var osdResource = angular.module('osdUpload', [
        'angularFileUpload'
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
    function Upload($rootScope, $q, $upload, UploadConfig) {
        var self = this;

        /* Returns true if the file size is greater than max. */
        function sizeExceeded($file) {
            return $file.size > UploadConfig.maxSize;
        }

        /* Returns true if the file type is in the list of supported types. */
        function supportedType($file) {
            var fileTypeRegex = UploadConfig.supportedFileTypes.join('|');

            var pattern = new RegExp(fileTypeRegex, "g");

            return pattern.test($file.type);
        }

        self.post = function ($file, data) {

            /* Emit event if upload size was exceeded. */
            if (sizeExceeded($file)) {
                $rootScope.$broadcast('osdUploadSizeExceeded', $file);
                return;
            }

            /* Emit event if file type is not supported. */
            if (!supportedType($file)) {
                $rootScope.$broadcast('osdUploadUnsupportedType', $file);
                return;
            }

            /* Build data to be posted to upload route. */
            var params = {
                url: UploadConfig.uploadUrl,
                file: $file,
                data: data,
                fileName: 'file',
            };

            /* Send ajax request and return a promise. */
            var defer = $q.defer();

            $upload.upload(params)
                .progress(function(event) {
                    defer.notify(event);
                })
                .success(function(response) {
                    defer.resolve(response);
                })
                .error(function(error) {
                    defer.reject(error);
                });

            return defer.promise;
        };

        return self;
    }

    angular.module('osdUpload')
        .factory('Upload', Upload);
})();
