# angular-osd-upload

This module provides a service and directive for file uploads. It allows us to configure the upload path, supported file types, and max file size.

### Version
0.1.0

### Installation and Setup

This package can be installed using bower:
```sh
$ bower install angular-osd-upload
```

Add the module to your app's module list:

```js
angular.module(
            'app',
            [
                ...,
                'osdUpload',
            ]
    )
```

Include a script tag (or add it to whatever you use to compile your js):
```html
<script src="path/to/bower_components/angular-osd-upload/angular-osd-upload.min.js"></script>
```

### Configuring the Service

The upload service can be configured using the `UploadConfigProvider`. Here's an example configuration:

```
(function() {

    // @ngInject
    function resourceConfig(UploadConfigProvider) {

        UploadConfigProvider
            .config({
                uploadUrl: API.base + '/upload',
                maxSize: 1000000
            });

    }

    app.config(resourceConfig);
})();
```

### How To Use It

Here's an example of how to use the upload service in a controller:

```
(function() {

    // @ngInject
    function ExampleCtrl(Upload) {

        Upload.post($files[0])
            .then(function(response) {
                vm.upload = response;
                vm.progress = 0;
            }, function(error) {
                vm.error = error;
            }, function(event) {
                vm.progress = parseInt(100.0 * event.loaded / event.total);
            });
    }

    angular
        .module('app')
        .controller('ExampleCtrl', ExampleCtrl);
});
```

### ERRORS CONSTANTS
Upload constants can be injected into a service using the UPLOAD angular constant. The following error codes can be returned during upload:

`UPLOAD.ERROR.FILE_TYPE`: Returned when an attempt to upload a file with size greater than that specified in `UploadConfig.maxSize`.

`UPLOAD.ERROR.SIZE`: Returned when an attempt to upload a file of type that doesn't match any listed in `UploadConfig.supportedFileTypes`.


#### License

The MIT License (MIT)

Copyright (c) 2015 damacisaac

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


