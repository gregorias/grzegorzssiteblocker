# Builds the package into an unpacked extension in dist/.
build:
  npx webpack

# Builds the package into a zip file in build/.
package: build
  ./dev/bin/package

# Tests the package.
test: build
  npx playwright test
