"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@directus/sdk");
class DirectusTransportSafeRunMiddleware extends sdk_1.Transport {
    constructor(url, req, res) {
        super({ url });
        this.req = req;
        this.res = res;
    }
    request(method, path, data, options) {
        return new Promise(resolve => {
            let req = Object.assign({}, this.req);
            let params = {
                ip: '127.0.0.1',
                method,
                url: path,
                body: data,
                headers: {
                    remoteAddress: '127.0.0.1',
                    origin: '127.0.0.1',
                    'content-type': 'application/json',
                    'transfer-encoding': 'identity'
                },
                connection: {},
                original_req: this.req
            };
            if (options.params)
                params.query = options.params;
            if (options.headers)
                Object.assign(params.headers, options.headers);
            Object.assign(req, params);
            let headers = {};
            let status = 200;
            let res = {
                _removedHeader: {},
                _statusCode: 200,
                statusMessage: 'OK',
                get statusCode() {
                    return this._statusCode;
                },
                set statusCode(status) {
                    this._statusCode = status;
                    this.status(status);
                }
            };
            res.set = res.header = ((x, y) => {
                if (x && typeof x === 'object') {
                    for (let key in x) {
                        res.setHeader(key, x[key]);
                    }
                }
                else {
                    res.setHeader(x, y !== null && y !== void 0 ? y : '');
                }
                return res;
            });
            res.setHeader = (x, y) => {
                headers[x] = y;
                headers[x.toLowerCase()] = y;
                return res;
            };
            res.getHeader = x => { var _a; return (_a = headers[x]) !== null && _a !== void 0 ? _a : null; };
            res.redirect = function (code, url) {
                if (typeof code !== 'number') {
                    status = 301;
                    url = code;
                }
                else {
                    status = code;
                }
                res.setHeader('Location', url);
                res.end();
            };
            res.status = res.sendStatus = function (code) {
                status = code;
                return res;
            };
            res.end = res.send = res.write = (raw => {
                let response = {
                    status,
                    headers,
                    raw
                };
                try {
                    response.data = JSON.parse(raw);
                }
                catch (error) { }
                resolve(response);
            });
            this.req.app(req, res);
        });
    }
}
exports.default = DirectusTransportSafeRunMiddleware;
