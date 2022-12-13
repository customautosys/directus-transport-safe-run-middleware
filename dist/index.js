"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@directus/sdk");
const run_middleware_1 = __importDefault(require("run-middleware"));
class DirectusTransportSafeRunMiddleware extends sdk_1.Transport {
    constructor(url, app) {
        super({ url });
        this.app = app;
        (0, run_middleware_1.default)(app);
    }
    request(method, path, data, options) {
        let params = {
            method,
            body: data,
            headers: {
                remoteAddress: '127.0.0.1',
                origin: '127.0.0.1',
                'content-type': 'application/json',
                'transfer-encoding': 'identity'
            }
        };
        if (options.params)
            params.query = options.params;
        if (options.headers)
            Object.assign(params.headers, options.headers);
        return new Promise(resolve => this.app.runMiddleware(this.url + path, params, (status, data, headers) => {
            console.log(status, data, headers);
            resolve({
                headers,
                raw: data,
                data: data === null || data === void 0 ? void 0 : data.data,
                status
            });
        }));
    }
}
exports.default = DirectusTransportSafeRunMiddleware;
