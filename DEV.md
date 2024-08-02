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

1. Run `npm update` to update dependencies. We use `>=` version specifiers to
   not have to manually check for the newest major releases. If things break,
   testing should catch, and we should fix them.

## Building

Run `just build` to create an unpacked bundle in `dist/`.

## Release & distribution

1. Update versions in `public/manifest.json` and `package.json`.
2. Run `just package` to produce the Chrome extension zip file in `build/`.
3. Upload the built zip file on [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).

## ADRs

### Drag & Drop

I couldn’t make drag & drop work of the list work in the popup, so I abandoned
the attempt.
