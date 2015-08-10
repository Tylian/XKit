## Prerequisites:

* Download [Node.js](https://nodejs.org/download/) for your platform.
* Ensure you have the `npm` command available.  Test this with `npm --version`.
* Make a clone of the project, or update an existing copy.

## Gulp Tasks:

#### `gulp` (default)

The default task.

See also: [`gulp lint`](#gulp-lint).

#### `gulp watch`

Watches filesystem and lints files on change.

See also: [`gulp lint:scripts`](gulp-lintscripts), [`gulp lint:css`](gulp-lintcss).

#### `gulp clean`

Top-level cleaning task.

See also: [`gulp clean:build`](gulp-cleanbuild).

#### `gulp clean:build`

Cleans the `build/` directory, deleting it and any subfolders.

#### `gulp clean:modules`

Cleans the `node_modules/` directory, deleting it and any subfolders.

#### `gulp clean:chrome`

Cleans the `build/chrome/` directory, deleting the previous build for Chrome.

#### `gulp clean:firefox`

Cleans the `build/firefox/` directory, deleting the previous build for Firefox.

#### `gulp lint`

Top-level linting task.

See also [`gulp lint:scripts`](gulp-lintscripts), [`gulp lint:css`](gulp-lintcss).

#### `gulp lint:scripts`

Lints JavaScript files using JSHint and JSCS, and reports the output.

#### `gulp lint:css`

Lints CSS files using CSSLint and reports the output.

#### `gulp build`

Top-level build task.

See also: [`gulp build:chrome`](gulp-buildchrome), [`gulp build:firefox`](gulp-buildfirefox).

#### `gulp build:chrome`

Builds the Chrome browser extension from source and outputs it to `build/chrome/`.  Also creates an archive, `new-xkit-x.x.x.zip`, and outputs it to `build/chrome/`.

#### `gulp copy:chrome`

Builds the Chrome browser extension from source and outputs it to `build/chrome/`.

See also: [`gulp build`](gulp-build), [`gulp build:chrome`](gulp-buildchrome), [`gulp compress:chrome`](gulp-compresschrome).

#### `gulp compress:chrome`

Creates an archive, `new-xkit-x.x.x.zip`, from an existing Chrome source build and outputs it to `build/chrome/`.

See also: [`gulp build`](gulp-build), [`gulp build:chrome`](gulp-buildchrome), [`gulp copy:chrome`](gulp-copychrome).

#### `gulp build:firefox`

Builds the Firefox browser extension from source and outputs it to `build/firefox/`.  Also creates a [Cross-platform Installer Module](https://developer.mozilla.org/en/docs/XPI), `@new-xkit-x.x.x.xpi`, and outputs it to `build/firefox/`.

See also: [`gulp compress:firefox`](gulp-compressfirefox), [`gulp copy:firefox`](gulp-copyfirefox).

#### `gulp copy:firefox`

Builds the Firefox browser extension from source and outputs it to `build/firefox/`.

See also: [`gulp build`](gulp-build), [`gulp build:firefox`](gulp-buildfirefox), [`gulp compress:firefox`](gulp-compressfirefox).

#### `gulp compress:firefox`

Creates a [Cross-platform Installer Module](https://developer.mozilla.org/en/docs/XPI), `@new-xkit-x.x.x.xpi`, from an existing Firefox source build and outputs it to `build/firefox/`.

See also: [`gulp build`](gulp-build), [`gulp build:firefox`](gulp-buildfirefox), [`gulp copy:firefox`](gulp-copyfirefox).