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
                url: UploadConfig.uploadUrl,
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
