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
