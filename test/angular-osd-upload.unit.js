describe('osdUpload', function() {
    var UPLOAD;

    beforeEach(module('osdUpload'));

    describe('UploadConfig', function() {
        var UploadConfig;

        beforeEach(inject(function(_UploadConfig_, _UPLOAD_) {
            UploadConfig = _UploadConfig_;
            UPLOAD= _UPLOAD_;
        }));

        it('should have access to UploadConfig', function() {
            expect(UploadConfig).not.toBe(null);
        });
    });

    describe('Upload', function() {
        var Upload, $upload, $rootScope;

        beforeEach(inject(function (_$rootScope_, _$upload_, _Upload_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $upload = _$upload_;
            Upload = _Upload_;
        }));

        beforeEach(function() {
            spyOn($rootScope, '$broadcast').and.callThrough();
            spyOn($upload, 'upload').and.callThrough();
        });

        it('should have access to Upload service', function() {
            expect(Upload).not.toBe(null);
        });

        describe('posting an unsupported file type', function() {
            var file = {
                size: 10,
                type: 'unsupportedType'
            };

            it('should emit an event and return early if the file type is not in the list of supported types', function() {
                Upload.post(file)
                    .catch(function (error) {
                        expect(error.type).toBe(UPLOAD.ERROR.FILE_TYPE);
                    });

                $scope.$apply();
                expect($upload.upload).not.toHaveBeenCalled();
            });
        });

        describe('posting a file that exceeds the max size', function() {
            var file = {
                size: 100000000000,
                type: 'jpeg'
            };

            it('should should emit and event and return early if the file size is exceeded', function() {
                Upload.post(file)
                    .catch(function (error) {
                        expect(error.type).toBe(UPLOAD.ERROR.SIZE);
                    });

                $scope.$apply();
                expect($upload.upload).not.toHaveBeenCalled();
            });
        });

        describe('posting a valid file', function() {
            var file = {
                size: 100,
                type: 'jpeg'
            };

            it('should call $upload.upload', function() {
                Upload.post(file);

                expect($upload.upload).toHaveBeenCalled();
            });
        });
    });
});
