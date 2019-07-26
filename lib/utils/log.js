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
│  Author: Mihai Baneu                             Last modified: 06.Jan.2019  │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────── */

var winston = require('winston'),
    config  = require('../../config.js');

const LEVEL = Symbol.for('level');
const MESSAGE = Symbol.for('message');

// add the loggers
module.exports = winston.createLogger({
  level: config.logging.level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      log(info, callback) {
        setImmediate(() => this.emit('logged', info));

        if (this.stderrLevels[info[LEVEL]]) {
          console.error(info[MESSAGE]);

          if (callback) {
            callback();
          }
          return;
        }

        console.log(info[MESSAGE]);

        if (callback) {
          callback();
        }
      }
    }),
    new winston.transports.File({ filename: config.logging.filename })
  ]
});
