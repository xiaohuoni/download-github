"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = download;
exports.DownloadError = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _createSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/createSuper"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));

var _asyncRetry = _interopRequireDefault(require("async-retry"));

var _chalk = _interopRequireDefault(require("chalk"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _path = _interopRequireDefault(require("path"));

var _rimraf = _interopRequireDefault(require("rimraf"));

var _prettier = _interopRequireDefault(require("prettier"));

var _sortPackageJson = _interopRequireDefault(require("sort-package-json"));

var _glob = _interopRequireDefault(require("glob"));

var _examples = require("./helpers/examples");

var _makeDir = require("./helpers/make-dir");

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var DownloadError = /*#__PURE__*/function (_Error) {
  (0, _inherits2.default)(DownloadError, _Error);

  var _super = (0, _createSuper2.default)(DownloadError);

  function DownloadError() {
    (0, _classCallCheck2.default)(this, DownloadError);
    return _super.apply(this, arguments);
  }

  return DownloadError;
}( /*#__PURE__*/(0, _wrapNativeSuper2.default)(Error));

exports.DownloadError = DownloadError;

function globList(patternList, options) {
  var fileList = [];
  patternList.forEach(function (pattern) {
    fileList = [].concat((0, _toConsumableArray2.default)(fileList), (0, _toConsumableArray2.default)(_glob.default.sync(pattern, options)));
  });
  return fileList;
}

var filterPkg = function filterPkg() {
  var pkgObject = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var ignoreList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var devObj = {};
  Object.keys(pkgObject).forEach(function (key) {
    var isIgnore = ignoreList.some(function (reg) {
      return new RegExp(reg).test(key);
    });

    if (isIgnore) {
      return;
    }

    devObj[key] = pkgObject[key];
  });
  return devObj;
};

function download(base, temp) {
  return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee() {
    var gitUrl, pathUrl, name, projectPath, root, envOptions, repoUrl, repoInfo, repoInfo2, packageJsonPath, pkg, _pkg$createUmi, _pkg$createUmi$ignore, ignoreScript, _pkg$createUmi$ignore2, ignoreDependencies, projectPkg, ignoreFiles, fileList;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            gitUrl = temp.url, pathUrl = temp.path, name = temp.name;
            projectPath = _path.default.join(base, name);
            root = _path.default.resolve(projectPath);

            _rimraf.default.sync(projectPath);

            envOptions = {
              cwd: projectPath
            };
            console.log("Creating a new Templates in ".concat(_chalk.default.green(root), "."));
            console.log();
            _context.next = 9;
            return (0, _makeDir.makeDir)(root);

          case 9:
            process.chdir(root);
            repoUrl = new URL(gitUrl);

            if (!(repoUrl.origin !== "https://github.com")) {
              _context.next = 14;
              break;
            }

            console.error("Invalid URL: ".concat(_chalk.default.red("\"".concat(gitUrl, "\"")), ". Only GitHub repositories are supported. Please use a GitHub URL and try again."));
            return _context.abrupt("return");

          case 14:
            _context.next = 16;
            return (0, _examples.getRepoInfo)(repoUrl, pathUrl);

          case 16:
            repoInfo = _context.sent;
            _context.prev = 17;

            if (!repoInfo) {
              _context.next = 26;
              break;
            }

            repoInfo2 = repoInfo;
            console.log("Downloading files from repo ".concat(_chalk.default.cyan(gitUrl), ". This might take a moment."));
            console.log();
            _context.next = 24;
            return (0, _asyncRetry.default)(function () {
              return (0, _examples.downloadAndExtractRepo)(root, repoInfo2);
            }, {
              retries: 3
            });

          case 24:
            _context.next = 30;
            break;

          case 26:
            console.log("Downloading files for example ".concat(_chalk.default.cyan(gitUrl), ". This might take a moment."));
            console.log();
            _context.next = 30;
            return (0, _asyncRetry.default)(function () {
              return (0, _examples.downloadAndExtractExample)(root, gitUrl);
            }, {
              retries: 3
            });

          case 30:
            _context.next = 35;
            break;

          case 32:
            _context.prev = 32;
            _context.t0 = _context["catch"](17);
            throw new DownloadError(_context.t0);

          case 35:
            packageJsonPath = _path.default.resolve(projectPath, "package.json");

            if (_fsExtra.default.existsSync(packageJsonPath)) {
              _context.next = 39;
              break;
            }

            console.log("".concat(packageJsonPath, " is no find"));
            return _context.abrupt("return");

          case 39:
            pkg = require(packageJsonPath); // gen package.json

            if (pkg["create-umi"]) {
              _pkg$createUmi = pkg["create-umi"], _pkg$createUmi$ignore = _pkg$createUmi.ignoreScript, ignoreScript = _pkg$createUmi$ignore === void 0 ? [] : _pkg$createUmi$ignore, _pkg$createUmi$ignore2 = _pkg$createUmi.ignoreDependencies, ignoreDependencies = _pkg$createUmi$ignore2 === void 0 ? [] : _pkg$createUmi$ignore2; // filter scripts and devDependencies

              projectPkg = Object.assign(Object.assign({}, pkg), {
                scripts: filterPkg(pkg.scripts, ignoreScript),
                devDependencies: filterPkg(pkg.devDependencies, ignoreDependencies)
              }); // remove create-umi config
              // delete projectPkg["create-umi"];

              _fsExtra.default.writeFileSync(_path.default.resolve(projectPath, "package.json"), // 删除一个包之后 json会多了一些空行。sortPackage 可以删除掉并且排序
              // prettier 会容忍一个空行
              _prettier.default.format(JSON.stringify((0, _sortPackageJson.default)(projectPkg)), {
                parser: "json"
              }));
            } // Clean up useless files


            if (pkg["create-umi"] && pkg["create-umi"].ignore) {
              console.log("Clean up...");
              ignoreFiles = pkg["create-umi"].ignore;
              fileList = globList(ignoreFiles, envOptions);
              fileList.forEach(function (filePath) {
                var targetPath = _path.default.resolve(projectPath, filePath);

                console.log("Remove ".concat(targetPath, " Success!"));

                _fsExtra.default.removeSync(targetPath);
              });
              console.log("Download ".concat(gitUrl, " Success!"));
            }

            return _context.abrupt("return", Object.assign(Object.assign({}, pkg), {
              temp: temp
            }));

          case 43:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[17, 32]]);
  }));
}