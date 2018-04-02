---
layout: page
title: Writing Tests
order: -1
---

## Testsuite Design

The vast majority of the testsuite is formed of HTML pages, which can
be loaded in a browser and either programmatically provide a result or
provide a set of steps to run the test and obtain the result.

The tests are, in general, short, cross-platform, and self-contained,
and should be easy to run in any browser.

There's also a load of [general guidelines][] that apply to all tests.

## Test Type

There are four main test types:

* [Reftests][] should be used to test rendering and layout. They
  consist of two or more pages with assertions as to whether they
  render identically or not.

* [testharness.js][] tests should be used (where
  possible!) for testing everything else. They are built with the
  testharness.js unit testing framework, and consist of assertions
  written in JavaScript.

* [Visual tests][visual] should be used for checking rendering where
  there is a large number of conforming renderings such that reftests
  are impractical. They consist of a page that renders to final state
  at which point a screenshot can be taken and compared to an expected
  rendering for that user agent on that platform.

* [Manual tests][manual] are used as a last resort for anything
  that can't be tested using any of the above. They consist of a page
  that needs manual interaction or verification of the final result.

In general, there is a strong preference towards the first two test
types (as they can be easily run without human interaction), so they
should be used in preference to the others even if it results in a
somewhat cumbersome test; there is a far weaker preference between the
first two, and it is at times advisable to use testharness.js tests
for things which would typically be tested using reftests but for
which it would be overly cumbersome.

See [file names][] for test types and features determined by the file names,
and [server features][] for advanced testing features.

In addition to the four main test types, there are also WebDriver
tests, which are used exclusively for testing the WebDriver protocol
itself. There is currently no documentation about these tests,
however.

The testsuite has a few types of tests, outlined below:

* [testharness.js][] tests, which are run
  through a JS harness and report their result back with JS.

* [Reftests][], which render two (or more) web
  pages and combine them with equality assertions about their
  rendering (e.g., `A.html` and `B.html` must render identically), run
  either by the user switching between tabs/windows and trying to
  observe differences or through automated scripts.

* [Visual tests][visual] which display a page where the
  result is determined either by a human looking at it or by comparing
  it with a saved screenshot for that user agent on that platform.

* [Manual tests][manual], which rely on a human to run
  them and determine their result.

* WebDriver tests, which are used for testing the WebDriver protocol
  itself.

## Submitting Tests

Once you've written tests, please submit them using
the [typical GitHub Pull Request workflow][submission-process]; please
make sure you run the [`lint` script][lint-tool] before opening a pull request!

[file names]: {{ site.baseurl }}{% link _writing-tests/file-names.md %}
[general guidelines]: {{ site.baseurl }}{% link _writing-tests/general-guidelines.md %}
[reftests]: {{ site.baseurl }}{% link _writing-tests/reftests.md %}
[server features]: {{ site.baseurl }}{% link _writing-tests/server-features.md %}
[testharness.js]: {{ site.baseurl }}{% link _writing-tests/testharness.md %}
[visual]: {{ site.baseurl }}{% link _writing-tests/visual.md %}
[manual]: {{ site.baseurl }}{% link _writing-tests/manual.md %}
[submission-process]: {{ site.baseurl }}{% link _writing-tests/submission-process.md %}
[lint-tool]: {{ site.baseurl }}{% link _writing-tests/lint-tool.md %}
