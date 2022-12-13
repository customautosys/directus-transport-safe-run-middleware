"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@directus/sdk");
const safe_run_middleware_1 = __importDefault(require("safe-run-middleware"));
class DirectusTransportSafeRunMiddleware extends sdk_1.Transport {
    constructor(app) {
        super({ url: '' });
        this.app = (0, safe_run_middleware_1.default)(app);
    }
    request(method, path, data, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.app.runMiddleware(path, {
                method,
                query: options.params,
                body: data,
                headers: options.headers
            });
            return {
                headers: response.headers,
                raw: response.data,
                data: (_a = response.data) === null || _a === void 0 ? void 0 : _a.data,
                status: response.statusCode
            };
        });
    }
}
exports.default = DirectusTransportSafeRunMiddleware;
