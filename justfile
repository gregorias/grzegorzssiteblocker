# Builds the package into an unpacked extension in dist/.
build:
  npx webpack

# Tests the package.
test: build
  npx playwright test
