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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var fs_1 = require("fs");
var utils_1 = require("./utils");
var prompts_1 = require("@clack/prompts");
var child_process_1 = require("child_process");
var process_1 = require("process");
var map = new Map([['dash', { project: 'aoh', url: '@mssfoobar/dash@0.0.1' }]]);
var program = new commander_1.Command();
program
    .name('CLI')
    .version('1.0.0')
    .description('This is the CLI to install modules onto your web-base framework')
    .command('package')
    .action(function (_) { return __awaiter(void 0, void 0, void 0, function () {
    var module, libPath, publicRoutePath, privateRoutePath, org, s, packageFile, s1, process;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, utils_1.promptPackageRoutes)()];
            case 1:
                module = _a.sent();
                libPath = "".concat(module.lib);
                publicRoutePath = "".concat(module.public);
                privateRoutePath = "".concat(module.private);
                org = 'mssfoobar';
                s = (0, prompts_1.spinner)();
                s.start('Copying files...');
                (0, fs_1.rmSync)("".concat(module.web, "/mod"), { recursive: true, force: true });
                //make a directory
                return [4 /*yield*/, (0, fs_1.mkdir)("".concat(module.web, "/mod"), function (_) { return (_ ? console.error(_) : null); })];
            case 2:
                //make a directory
                _a.sent();
                //copy the necessary files over
                return [4 /*yield*/, (0, fs_1.cp)(libPath, "".concat(module.web, "/mod/src/lib/").concat(module.project, "/").concat(module.name), { recursive: true }, function (_) { return (_ ? console.error(_) : null); })];
            case 3:
                //copy the necessary files over
                _a.sent();
                return [4 /*yield*/, (0, fs_1.cp)(publicRoutePath, "".concat(module.web, "/mod/src/routes/(public)/").concat(module.project, "/").concat(module.name), { recursive: true }, function (_) { return (_ ? console.error(_) : null); })];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, fs_1.cp)(privateRoutePath, "".concat(module.web, "/mod/src/routes/(private)/").concat(module.project, "/").concat(module.name), { recursive: true }, function (_) { return (_ ? console.error(_) : null); })];
            case 5:
                _a.sent();
                s.stop();
                packageFile = require("".concat(module.package));
                if (!!packageFile.repository) return [3 /*break*/, 7];
                return [4 /*yield*/, (0, prompts_1.text)({
                        message: 'Repository not found. Please enter a repository url',
                        defaultValue: '',
                        validate: function (value) {
                            if (!value)
                                return 'Please enter a repository url';
                            packageFile.repository = {
                                type: 'git',
                                url: value
                            };
                        }
                    })];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7:
                s1 = (0, prompts_1.spinner)();
                s1.start('initializing package.json');
                return [4 /*yield*/, setTimeout(function () { }, 100)];
            case 8:
                _a.sent();
                delete packageFile['devDependencies'];
                delete packageFile['scripts'];
                packageFile.name = "@".concat(org, "/").concat(module.name);
                packageFile.private = false;
                packageFile.publishConfig = {};
                packageFile.publishConfig["@".concat(org, ":registry")] = 'https://npm.pkg.github.com';
                (0, fs_1.writeFile)("".concat(module.web, "/mod/package.json"), JSON.stringify(packageFile, null, 2), function (_) {
                    return _ ? console.error(_) : null;
                });
                s1.message('publishing package...');
                return [4 /*yield*/, (0, child_process_1.exec)("npm publish ".concat(module.web, "/mod"), function (_) {
                        if (_) {
                            console.error(_);
                            (0, process_1.exit)(0);
                        }
                    })];
            case 9:
                process = _a.sent();
                process.on('close', function (code) {
                    s1.stop("Package \"".concat(module.name, "\" published to github successfully. You may now install using `cli install ").concat(module.name, "`"));
                });
                return [2 /*return*/];
        }
    });
}); });
program
    .command('install')
    .argument('<module>')
    .action(function (module) { return __awaiter(void 0, void 0, void 0, function () {
    var root, project, s, process;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!map.has(module)) {
                    console.error("Error: ".concat(module, " not found in the list of modules"));
                    (0, process_1.exit)(0);
                }
                return [4 /*yield*/, (0, utils_1.getWorkingDirectory)()];
            case 1:
                root = _a.sent();
                return [4 /*yield*/, (0, prompts_1.text)({ message: 'Please enter the path to your root folder', initialValue: "".concat(root) })];
            case 2:
                _a.sent();
                project = map.get(module).project;
                s = (0, prompts_1.spinner)();
                s.start('installing module...');
                setTimeout(function () { }, 5000);
                s.stop();
                s = (0, prompts_1.spinner)();
                s.start('installing dependencies...');
                return [4 /*yield*/, (0, child_process_1.exec)("npm install ".concat(map.get(module).url), function (exec) {
                        if (exec)
                            console.log(exec);
                        (0, fs_1.cp)("".concat(root, "/node_modules/@mssfoobar/").concat(module, "/src"), "".concat(root, "/src"), { recursive: true }, function (err) {
                            if (err)
                                console.log(err);
                        });
                    })];
            case 3:
                process = _a.sent();
                process.on('close', function (code) {
                    s.stop("installing ".concat(module, " completed"));
                });
                return [2 /*return*/];
        }
    });
}); });
program.parse();
