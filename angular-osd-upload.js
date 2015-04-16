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
            baseUploadUrl: '/api/uploads',
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
                .progress(function(event) {
                    $scope.progress = parseInt(100.0 * event.loaded / event.total);
                })
                .success(function(response) {
                    $rootScope.$emit('osdUploadSuccess', response);
                    $scope.progress = 0;
                })
                .error(function(error) {
                    $rootScope.$emit('osdUploadError', error);
                    $scope.progress = 0;
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
    function Upload($rootScope, $upload, UploadConfig) {
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
                url: UploadConfig.baseUploadUrl,
                file: $file,
                data: data,
                fileName: 'file',
            };

            /* Send ajax request and return a promise. */
            return $upload.upload(params);
        };

        return self;
    }

    angular.module('osdUpload')
        .factory('Upload', Upload);
})();
