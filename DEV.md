# 🛠️ Developer documentation

This is the documentation file for developers.

## Dev environment setup

This section describes how to setup your development environment.

1. Install Lefthook:

    ```shell
    lefthook install
    ```

1. Initialize NPM:

    ```shell
    npm install
    ```

## Directory structure

- `public/` contains non-JavaScript files that Webpack copies directly into the
  distribution folder, `dist/`.
- `src/` contains the JavaScript source files. They are processed by Webpack
  during the build process.

## Testing

1. Run `just test` to run automated tests.

## Updating dependencies

1. Update version specifiers in `package.json`. We don’t use `>=`, because if
   something breaks, it’s easier to just manually go through dependencies one
   by one. Otherwise, it’s a big hassle to find what breaks.
1. Run `npm update` to update dependencies.

## Building

Run `just build` to create an unpacked bundle in `dist/`.

## Release & distribution

1. Update versions in `public/manifest.json` and `package.json`.
2. Run `npm install` to update the lock file.
3. Run `just package` to produce the Chrome extension zip file in `build/`.
4. Upload the built zip file on [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).

## ADRs

### Drag & Drop

I couldn’t make drag & drop work of the list work in the popup, so I abandoned
the attempt.
