---
layout: page
title: Contributing Tests
order: -1
---

Save the Web, Write Some Tests!

Absolutely everyone is welcome (and even encouraged) to contribute to test
development, under the licensing requirements detailed in the
[Contributing Guidelines][]. No test is too small or too simple, especially if
it corresponds to something for which you've noted an interoperability bug in a
browser.

[GitHub][] is used both for [issue tracking][] and [test submissions][].

[Contributing Guidelines]: https://github.com/w3c/web-platform-tests/blob/master/CONTRIBUTING.md
[GitHub]: https://github.com/w3c/web-platform-tests/
[issue tracking]: https://github.com/w3c/web-platform-tests/issues
[test submissions]: https://github.com/w3c/web-platform-tests/pulls


## Issues with web-platform-tests

If you spot an issue with a test, you're very welcome to
[submit a pull request][] to fix it. If you're not comfortable doing that,
please [file a new issue][]. Thank you!

[submit a pull request]: #submitting-a-pull-request
[file a new issue]: https://github.com/w3c/web-platform-tests/issues/new


## GitHub and git

We provide [a limited introduction][] to both git and GitHub.

[a limited introduction]: {{ site.baseurl }}{% link _contributing/github-intro.md %}

### Submitting a pull request

The way to contribute is just as usual:

* Fork this repository (and make sure you're still relatively in sync
  with it if you forked a while ago).
* Create a branch for your changes:
  `git checkout -b topic`.
* Make your changes.
* Run the lint script described below.
* Commit locally and push that to your repo.
* Send in a pull request based on the above.

### Labels and notifications

Pull Requests are automatically labeled based on the directory the
files they change are in; there are also comments added automatically
to notify a number of people: this list of people comes from OWNERS
files in those same directories and their parents (i.e., they work
recursively: `a/OWNERS` will get notified for `a/foo.html` and
`a/b/bar.html`).

If you want to be notified about changes to tests in a directory, feel
free to add yourself to the OWNERS file: there's no requirement to own
anything as a result!

### Windows Notes

Please set `git config core.autocrlf false` in your working tree to ensure git
does not automatically convert line endings, as it will cause lint errors.

### Branches

In the vast majority of cases the **only** upstream branch that you
should need to care about is `master`. If you see other branches in
the repository, you can generally safely ignore them.

Note: because of the frequent creation and deletion of branches in this
repo, it is recommended to "prune" stale branches when fetching updates,
i.e. use `git pull --prune` (or `git fetch -p && git merge`).

### Submodules

Some optional components of web-platform-tests (test components from
third party software and pieces of the CSS build system) are included
as submodules. To obtain these components run the following in the
root of your checkout:

```
git submodule update --init --recursive
```

Prior to commit `39d07eb01fab607ab1ffd092051cded1bdd64d78` submodules
were requried for basic functionality. If you are working with an
older checkout, the above command is required in all cases.

When moving between a commit prior to `39d07eb` and one after it git
may complain

```
$ git checkout master
error: The following untracked working tree files would be overwritten by checkout:
[…]
```

followed by a long list of files. To avoid this error remove
the `resources` and `tools` directories before switching branches:

```
$ rm -r resources/ tools/
$ git checkout master
Switched to branch 'master'
Your branch is up-to-date with 'origin/master'
```

When moving in the opposite direction, i.e. to a commit that does have
submodules, you will need to `git submodule update`, as above. If git
throws an error like:

```
fatal: No url found for submodule path 'resources/webidl2/test/widlproc' in .gitmodules
Failed to recurse into submodule path 'resources/webidl2'
fatal: No url found for submodule path 'tools/html5lib' in .gitmodules
Failed to recurse into submodule path 'resources'
Failed to recurse into submodule path 'tools'
```

then remove the `tools` and `resources` directories, as above.


## Publication

The master branch is automatically synchronized to [w3c-test.org][].

Pull requests are [automatically mirrored](http://w3c-test.org/submissions/)
except those that modify sensitive resources (such as `.py` files). The latter
require someone with merge access to comment with "LGTM" or "w3c-test:mirror" to
indicate the pull request has been checked.

[w3c-test.org]: http://w3c-test.org/


## Test Review Policy

In order to encourage a high level of quality in the W3C test suites, test
contributions must be reviewed by a peer, and pass the automated tests (in
particular the [lint tool][]).

The reviewer can be anyone (other than the original test author) that
has the required experience with both the spec under test and with
the [general test guidelines][general guidelines].

The review must happen in public, but there is no requirement for it
to happen in any specific location. In particular if a vendor is
submitting tests that have already been publicly reviewed in their own
review system, that review may be carried forward. For other tests, we
strongly recommend using either Reviewable or GitHub's built-in review
tools.

Regardless of what review tool is used, the review must be clearly
linked in the pull request.

In general, we tend on the side of merging things with nits (i.e.,
anything sub-optimal that isn't absolutely required to be right) and
then opening issues to leaving pull requests open indefinitely waiting
on the original submitter to fix them; when tests are being upstreamed
from vendors it is frequently the case that the author has moved on to
working on other things as tests frequently only get pushed upstream
once the code lands in their implementation.

To assist with test reviews, a [review checklist][] is available.

[lint tool]: {{ site.baseurl }}{% link _writing-tests/lint-tool.md %}
[general guidelines]: {{ site.baseurl }}{% link _writing-tests/general-guidelines.md %}
[review checklist]: {{ site.baseurl }}{% link _contributing/checklist.md %}
