# Leasehold Hub

[![Build Status](https://jenkins.lisk.io/buildStatus/icon?job=lisk-hub/development)](https://jenkins.lisk.io/job/lisk-hub/job/development)
[![Coverage Status](https://coveralls.io/repos/github/LiskHQ/lisk-hub/badge.svg?branch=development)](https://coveralls.io/github/LiskHQ/lisk-hub?branch=development)
[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](http://www.gnu.org/licenses/gpl-3.0)
[![Join the chat at https://gitter.im/LiskHQ/lisk](https://badges.gitter.im/LiskHQ/lisk.svg)](https://gitter.im/LiskHQ/lisk?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Dependencies Status](https://david-dm.org/liskHQ/lisk-hub/status.svg)](https://david-dm.org/liskHQ/lisk-hub)
[![devDependencies Status](https://david-dm.org/liskHQ/lisk-hub/dev-status.svg)](https://david-dm.org/liskHQ/lisk-hub?type=dev)

## For Contributors
Please see [CONTRIBUTING.md](/CONTRIBUTING.md) for more information.
## Development

```
git clone https://github.com/Leasehold/leasehold-desktop
cd leasehold-desktop
npm install
npm run dev
```

Open http://localhost:8080

For ease of development, you can set the following query string to see network options in login page:
```
http://localhost:8080/#/?showNetwork=true
```

If you are actively developing in a specific route, and want to be autologged in everytime you reload the page, please add the following to localStorage:

```
localStorage.setItem('liskCoreUrl', 'http://localhost:4000') // desired node to log in into
localStorage.setItem('loginKey', 'wagon stock borrow episode laundry kitten salute link globe zero feed marble') // desired account passphrase
```

When developing with hardware wallet, this will log you into to first account on the first connected hardware wallet:
```
localStorage.setItem('liskCoreUrl', 'http://localhost:4000') // desired node to log in into
localStorage.setItem('hwWalletAutoLogin', true);
```

#### Build

```
npm run build
```

#### Using Commercial Fonts
Since some of the fonts used in the production version are commercial, this repository only contains open source fonts and uses `Open Sans` as a replacement for the commercial ones.

If you have licensed copies of `Basier Circle` and `Gilroy`, you can add them to [fonts folder](./src/assets/fonts) to replace the empty files that are there so that webpack build doesn't fail if the fonts are not present.

## Electron

#### Start


Start the Electron client. Before staring you need to make sure the application is built. If you need to build the entire application, run

```
npm run build
```

as mentioned before. And if you want to solely build electron app, run

```
npm run build-electron
```

Then, in order to launch electron, you can run

```
npm run start
```

Then, in order to launch version with hardware wallet, you can run

```
npm run dev-hardware-wallet
```

In order to launch electron that gets live updates from already running webpack-dev-server on port 8080 and with react/redux dev tools, you can run

```
LISK_HUB_URL="http://localhost:8080" DEBUG=true npm run start
```

#### Windows

Build package for Windows (on Windows in [Git BASH](https://git-for-windows.github.io/)).

```
npm run pack:win
```

#### macOS

Build package for macOS (on macOs)

```
npm run pack 
```

#### Linux

Build package for Linux (on Linux).

```
npm run pack 
```

## Run unit tests

#### Single run
```
npm run test
```

#### Run each time a file changes
```
npm run test-live
```

#### Run each time a file changes without generating test coverage report (it's faster)
```
NO_COV=true npm run test-live
```

## Run end-to-end tests
In order to run e2e tests you need to install [lisk-core](https://github.com/LiskHQ/lisk)

#### Setup core

Setup a lisk test node as described in [https://github.com/LiskHQ/lisk#tests](https://github.com/LiskHQ/lisk#tests)

Run lisk test node with [pm2](http://pm2.keymetrics.io/)  on `localhost:4000`

#### Run

Start the development version of lisk-hub:
```
npm run dev
```
Apply blockchain snapshot
 
```
./test/e2e-test-setup.sh ~/git/lisk/
```

(replace `~/git/lisk/` with your path to lisk core)

Run e2e tests
```
npm run cypress:run
```

## Launch React Storybook

To launch storybook sandbox with components run
```
npm run storybook
```
and navigate to

http://localhost:6006/



## Contributors
See [contributors section](https://github.com/LiskHQ/lisk-hub/graphs/contributors).

## License

Copyright © 2016-2018 Lisk Foundation

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the [GNU General Public License](https://github.com/Leasehold/leasehold-desktop/tree/master/LICENSE) along with this program.  If not, see <http://www.gnu.org/licenses/>.

