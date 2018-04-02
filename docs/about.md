---
layout: page
title: About
---

web-platform-tests is a cross-browser testsuite for the
[web platform][web-platform].

It is developed and maintained by community members, browser vendors, and the
W3C.

## Goals

The project attempts to increase the interoperability between implementations
of features of the web platform, and web browsers in particular, by providing
a cross-browser testsuite and necessary infrastructure around it.

Writing tests in a way that allows them to be run in all browsers gives browser
projects confidence that they are shipping software that is compatible with
other implementations, and that later implementations will be compatible with
their implementations. This in turn gives Web authors/developers confidence that
they can actually rely on the Web platform to deliver on the promise of working
across browsers and devices without needing extra layers of abstraction to paper
over the gaps left by specification editors and implementors.


## Related infrastructure

* wpt.fyi
* web-platform-tests.org
* testthewebforward.org
* built css test suites
* css wiki?


## Other test suites

Currently, there are two important parts of the web platform that do not share
tests as part of this project: ECMAScript (whose testsuite lives in [test262][])
and WebGL (whose testsuite lives in [WebGL][]).


[web-platform]: https://platform.html5.org
[test262]: https://github.com/tc39/test262
[webgl]: https://github.com/KhronosGroup/WebGL
