# Manual Testing

This file provides instructions for manual testing. I intend to go through
these instructions before each release.

## Blocks sites even if a filter is malformed

This test prevents [this
regression](https://github.com/gregorias/grzegorzssiteblocker/issues/1).

Add and enable the following filters:

* `www.google.com/*`
* `obviouslywrong`

Go to www.google.com and verify that it's blocked.
