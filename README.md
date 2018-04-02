The web-platform-tests Project [![IRC chat](https://goo.gl/6nCIks)](http://irc.w3.org/?channels=testing)
==============================

web-platform-tests is a cross-browser testsuite for the
[web platform][web-platform].

Documentation is available on [web-platform-tests.org][].

If you get stuck or want clarification about anything, feel free to ask on
either the [mailing list][public-test-infra] or [IRC][] ([webclient][web irc]);
IRC is generally busiest during the European working day but frequently has
people on it at all times and should probably be the general first port of call
for any help.

[web-platform]: https://platform.html5.org
[web-platform-tests.org]: http://web-platform-tests.org/
[public-test-infra]: https://lists.w3.org/Archives/Public/public-test-infra/
[IRC]: irc://irc.w3.org:6667/testing
[web irc]: http://irc.w3.org/?channels=testing

Setting Up the Repo
===================

Clone or otherwise get https://github.com/w3c/web-platform-tests.

Running the Tests
=================

The tests are designed to be run from your local computer. The test
environment requires [Python 2.7+](http://www.python.org/downloads) (but not Python 3.x).

On Windows, be sure to add the Python directory (`c:\python2x`, by default) to
your `%Path%` [Environment Variable](http://www.computerhope.com/issues/ch000549.htm),
and read the [Windows Notes](#windows-notes) section below.

To get the tests running, you need to set up the test domains in your
[`hosts` file](http://en.wikipedia.org/wiki/Hosts_%28file%29%23Location_in_the_file_system).

The necessary content can be generated with `./wpt make-hosts-file`; on
Windows, you will need to preceed the prior command with `python` or
the path to the Python binary (`python wpt make-hosts-file`).

For example, on most UNIX-like systems, you can setup the hosts file with:

```bash
./wpt make-hosts-file | sudo tee -a /etc/hosts
```

And on Windows (note this requires an Administrator privileged shell):

```bash
python wpt make-hosts-file >> %SystemRoot%\System32\drivers\etc\hosts
```

If you are behind a proxy, you also need to make sure the domains above are
excluded from your proxy lookups.


Running Tests Manually
======================

The test server can be started using
```
./wpt serve
```

**On Windows**: You will need to preceed the prior command with
`python` or the path to the python binary.
```bash
python wpt serve
```

This will start HTTP servers on two ports and a websockets server on
one port. By default the web servers start on ports 8000 and 8443 and the other
ports are randomly-chosen free ports. Tests must be loaded from the
*first* HTTP server in the output. To change the ports, copy the
`config.default.json` file to `config.json` and edit the new file,
replacing the part that reads:

```
"http": [8000, "auto"],
"https":[8443]
```

to some ports of your choice e.g.

```
"http": [1234, "auto"],
"https":[5678]
```

After your `hosts` file is configured, the servers will be locally accessible at:

http://web-platform.test:8000/<br>
https://web-platform.test:8443/ *

\**See [Trusting Root CA](#trusting-root-ca)*

Running Tests Automatically
---------------------------

Tests can be run automatically in a browser using the `run` command of
the `wpt` script in the root of the checkout. This requires the hosts
file setup documented above, but you must *not* have the
test server already running when calling `wpt run`. The basic command
line syntax is:

```bash
./wpt run product [tests]
```

**On Windows**: You will need to preceed the prior command with
`python` or the path to the python binary.
```bash
python wpt product [tests]
```

where `product` is currently `firefox` or `chrome` and `[tests]` is a
list of paths to tests. This will attempt to automatically locate a
browser instance and install required dependencies. The command is
very configurable; for example to specify a particular binary use
`wpt run --binary=path product`. The full range of options can be see
with `wpt run --help` and `wpt run --wptrunner-help`.

Not all dependencies can be automatically installed; in particular the
`certutil` tool required to run https tests with Firefox must be
installed using a system package manager or similar.

On Debian/Ubuntu certutil may be installed using:

```
sudo apt install libnss3-tools
```

And on macOS with homebrew using:

```
brew install nss
```

On other platforms, download the firefox archive and common.tests.zip
archive for your platform from
[Mozilla CI](https://archive.mozilla.org/pub/firefox/nightly/latest-mozilla-central/).

Then extract `certutil[.exe]` from the tests.zip package and
`libnss3[.so|.dll|.dynlib]` and put the former on your path and the latter on
your library path.


Command Line Tools
==================

The `wpt` command provides a frontend to a variety of tools for
working with and running web-platform-tests. Some of the most useful
commands are:

* `wpt serve` - For starting the wpt http server
* `wpt run` - For running tests in a browser
* `wpt lint` - For running the lint against all tests
* `wpt manifest` - For updating or generating a `MANIFEST.json` test manifest
* `wpt install` - For installing the latest release of a browser or
  webdriver server on the local machine.


<span id="windows-notes">Windows Notes</span>
=============================================

On Windows `wpt` commands must be prefixed with `python` or the path
to the python binary (if `python` is not in your `%PATH%`).

```bash
python wpt [command]
```

Alternatively, you may also use
[Bash on Ubuntu on Windows](https://msdn.microsoft.com/en-us/commandline/wsl/about)
in the Windows 10 Anniversary Update build, then access your windows
partition from there to launch `wpt` commands.

Certificates
============

By default pregenerated certificates for the web-platform.test domain
are provided in [`tools/certs`](tools/certs). If you wish to generate new
certificates for any reason it's possible to use OpenSSL when starting
the server, or starting a test run, by providing the
`--ssl-type=openssl` argument to the `wpt serve` or `wpt run`
commands.

If you installed OpenSSL in such a way that running `openssl` at a
command line doesn't work, you also need to adjust the path to the
OpenSSL binary. This can be done by adding a section to `config.json`
like:

```
"ssl": {"openssl": {"binary": "/path/to/openssl"}}
```

On Windows using OpenSSL typically requires installing an OpenSSL distribution.
[Shining Light](https://slproweb.com/products/Win32OpenSSL.html)
provide a convenient installer that is known to work, but requires a
little extra setup, i.e.:

Run the installer for Win32_OpenSSL_v1.1.0b (30MB). During installation,
change the default location for where to Copy OpenSSL Dlls from the
System directory to the /bin directory.

After installation, ensure that the path to OpenSSL (typically,
this will be `C:\OpenSSL-Win32\bin`) is in your `%Path%`
[Environment Variable](http://www.computerhope.com/issues/ch000549.htm).
If you forget to do this part, you will most likely see a 'File Not Found'
error when you start wptserve.

Finally, set the path value in the server configuration file to the
default OpenSSL configuration file location. To do this,
copy `config.default.json` in the web-platform-tests root to `config.json`.
Then edit the JSON so that the key `ssl/openssl/base_conf_path` has a
value that is the path to the OpenSSL config file (typically this
will be `C:\\OpenSSL-Win32\\bin\\openssl.cfg`).

### Trusting Root CA

To prevent browser SSL warnings when running HTTPS tests locally, the
web-platform-tests Root CA file `cacert.pem` in [tools/certs](tools/certs)
must be added as a trusted certificate in your OS/browser.

Finding Things
==============

Each top-level directory matches the shortname used by a standard, with
some exceptions. (Typically the shortname is from the standard's
corresponding GitHub repository.)

For some of the specifications, the tree under the top-level directory
represents the sections of the respective documents, using the section
IDs for directory names, with a maximum of three levels deep.

So if you're looking for tests in HTML for "The History interface",
they will be under `html/browsers/history/the-history-interface/`.

Various resources that tests depend on are in `common`, `images`, and
`fonts`.

Contributing
============

Save the Web, Write Some Tests!

Absolutely everyone is welcome (and even encouraged) to contribute to
test development, so long as you fulfill the contribution requirements
detailed in the [Contributing Guidelines][contributing]. No test is
too small or too simple, especially if it corresponds to something for
which you've noted an interoperability bug in a browser.

The way to contribute is just as usual:

* Fork this repository (and make sure you're still relatively in sync
  with it if you forked a while ago).
* Create a branch for your changes:
  `git checkout -b topic`.
* Make your changes.
* Run the lint script described below.
* Commit locally and push that to your repo.
* Send in a pull request based on the above.


Adding command-line scripts ("tools" subdirs)
---------------------------------------------

Sometimes you may want to add a script to the repository that's meant
to be used from the command line, not from a browser (e.g., a script
for generating test files). If you want to ensure (e.g., for security
reasons) that such scripts won't be handled by the HTTP server, but
will instead only be usable from the command line, then place them in
either:

* the `tools` subdir at the root of the repository, or

* the `tools` subdir at the root of any top-level directory in the
  repository which contains the tests the script is meant to be used
  with

Any files in those `tools` directories won't be handled by the HTTP
server; instead the server will return a 404 if a user navigates to
the URL for a file within them.

If you want to add a script for use with a particular set of tests but
there isn't yet any `tools` subdir at the root of a top-level
directory in the repository containing those tests, you can create a
`tools` subdir at the root of that top-level directory and place your
scripts there.

For example, if you wanted to add a script for use with tests in the
`notifications` directory, create the `notifications/tools` subdir and
put your script there.

Test Review
===========

We can sometimes take a little while to go through pull requests
because we have to go through all the tests and ensure that they match
the specification correctly. But we look at all of them, and take
everything that we can.

OWNERS files are used only to indicate who should be notified of pull
requests.  If you are interested in receiving notifications of proposed
changes to tests in a given directory, feel free to add yourself to the
OWNERS file. Anyone with expertise in the specification under test can
approve a pull request.  In particular, if a test change has already
been adequately reviewed "upstream" in another repository, it can be
pushed here without any further review by supplying a link to the
upstream review.

Getting Involved
================

If you wish to contribute actively, you're very welcome to join the
public-test-infra@w3.org mailing list (low traffic) by
[signing up to our mailing list](mailto:public-test-infra-request@w3.org?subject=subscribe).
The mailing list is [archived][mailarchive].

Join us on irc #testing ([irc.w3.org][ircw3org], port 6665). The channel
is [archived][ircarchive].

[contributing]: https://github.com/w3c/web-platform-tests/blob/master/CONTRIBUTING.md
[ircw3org]: https://www.w3.org/wiki/IRC
[ircarchive]: https://w3.logbot.info/testing
[mailarchive]: https://lists.w3.org/Archives/Public/public-test-infra/

Documentation
=============

* [How to write and review tests](http://web-platform-tests.org/)
* [Documentation for the wptserve server](http://wptserve.readthedocs.org/en/latest/)
