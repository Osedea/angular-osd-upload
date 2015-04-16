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
