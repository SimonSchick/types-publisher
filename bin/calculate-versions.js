"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
const common_1 = require("./lib/common");
const packages_1 = require("./lib/packages");
const versions_1 = require("./lib/versions");
const io_1 = require("./util/io");
const logging_1 = require("./util/logging");
const util_1 = require("./util/util");
if (!module.parent) {
    const forceUpdate = yargs.argv.forceUpdate;
    util_1.done(main(forceUpdate, new io_1.Fetcher(), common_1.Options.defaults));
}
function main(forceUpdate, fetcher, options) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("=== Calculating versions ===");
        const { changes, versions } = yield versions_1.default.determineFromNpm(yield packages_1.AllPackages.read(options), logging_1.consoleLogger.info, forceUpdate, fetcher, options);
        yield versions_1.writeChanges(changes);
        yield versions.save();
    });
}
exports.default = main;
//# sourceMappingURL=calculate-versions.js.map