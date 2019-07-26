/* ────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  COPYRIGHT (C) 2019 Mihai Baneu                                              │
│                                                                              │
|  Permission is hereby  granted,  free of charge,  to any person obtaining a  |
|  copy of this software and associated documentation files (the "Software"),  |
|  to deal in the Software without restriction,  including without limitation  |
|  the rights to  use, copy, modify, merge, publish, distribute,  sublicense,  |
|  and/or sell copies  of  the Software, and to permit  persons to  whom  the  |
|  Software is furnished to do so, subject to the following conditions:        |
|                                                                              |
|  The above  copyright notice  and this permission notice  shall be included  |
|  in all copies or substantial portions of the Software.                      |
|                                                                              |
|  THE SOFTWARE IS PROVIDED  "AS IS",  WITHOUT WARRANTY OF ANY KIND,  EXPRESS  |
|  OR   IMPLIED,   INCLUDING   BUT   NOT   LIMITED   TO   THE  WARRANTIES  OF  |
|  MERCHANTABILITY,  FITNESS FOR  A  PARTICULAR  PURPOSE AND NONINFRINGEMENT.  |
|  IN NO  EVENT SHALL  THE AUTHORS  OR  COPYRIGHT  HOLDERS  BE LIABLE FOR ANY  |
|  CLAIM, DAMAGES OR OTHER LIABILITY,  WHETHER IN AN ACTION OF CONTRACT, TORT  |
|  OR OTHERWISE, ARISING FROM,  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR   |
|  THE USE OR OTHER DEALINGS IN THE SOFTWARE.                                  |
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Author: Mihai Baneu                             Last modified: 07.Jan.2019  │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────── */

'use strict';

// required modules
var axios   = require('axios'),
    ipify   = require('ipify');

// base modules
var log    = require('./lib/utils/log'),
    config = require('./config');

var lastKnownIp;

log.info('Starting ip management service');
setInterval(function() {
  // get my own ip from the internet
  ipify().then(function(ip) {
    log.info('Found ip: ' + ip);
    if (lastKnownIp !== ip) {
      log.info('Renewing ip information');
      axios.get(config.service.updateLink, { params: { 'content-type': 'json' } }).then(function(response) {
        log.info('Status: ' + response.statusText);
        log.info('Headers: ' + JSON.stringify(response.headers));
        log.info('Data: ' + JSON.stringify(response.data));
        lastKnownIp = ip;
      }).catch(function(ex) {
        log.warn(ex);
      });
    }
  }).catch(function(ex) {
    log.warn(ex);
  });
}, config.service.refreshInterval);
