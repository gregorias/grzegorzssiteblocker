# 🛠️ Developer documentation

This is the documentation file for developers.

## Dev environment setup

This section describes how to setup your development environment.

1. Install Lefthook:

    ```shell
    lefthook install
    ```

## Directory structure

- `public/` contains non-JavaScript files that Webpack copies directly into the
  distribution folder, `dist/`.
- `src/` contains the JavaScript source files. They are processed by Webpack
  during the build process.

## Testing

1. Run `just test` to run automated tests.

## Building

1. Run `just build` to create an unpacked bundle in `dist/`.
2. Run `dev/bin/package` to produce the Chrome extension zip file in `build/`.

## Release & distribution

Upload the built zip file on
[Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).
