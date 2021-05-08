"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isUrlOk = isUrlOk;
exports.getRepoInfo = getRepoInfo;
exports.hasRepo = hasRepo;
exports.hasExample = hasExample;
exports.downloadAndExtractRepo = downloadAndExtractRepo;
exports.downloadAndExtractExample = downloadAndExtractExample;

function _toArray2() {
  const data = _interopRequireDefault(require("@babel/runtime/helpers/toArray"));

  _toArray2 = function _toArray2() {
    return data;
  };

  return data;
}

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _got() {
  const data = _interopRequireDefault(require("got"));

  _got = function _got() {
    return data;
  };

  return data;
}

function _tar() {
  const data = _interopRequireDefault(require("tar"));

  _tar = function _tar() {
    return data;
  };

  return data;
}

function _stream() {
  const data = require("stream");

  _stream = function _stream() {
    return data;
  };

  return data;
}

var _mockutil = require("./mockutil");

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
/* eslint-disable import/no-extraneous-dependencies */


const pipeline = (0, _mockutil.promisify)(_stream().Stream.pipeline);

function isUrlOk(url) {
  return __awaiter(this, void 0, void 0, function* () {
    const res = yield _got().default.head(url).catch(e => e);
    return res.statusCode === 200;
  });
}

function getRepoInfo(url, examplePath) {
  return __awaiter(this, void 0, void 0, function* () {
    const _url$pathname$split = url.pathname.split("/"),
          _url$pathname$split2 = (0, _toArray2().default)(_url$pathname$split),
          username = _url$pathname$split2[1],
          name = _url$pathname$split2[2],
          t = _url$pathname$split2[3],
          _branch = _url$pathname$split2[4],
          file = _url$pathname$split2.slice(5);

    const filePath = examplePath ? examplePath.replace(/^\//, "") : file.join("/"); // Support repos whose entire purpose is to be a NextJS example, e.g.
    // https://github.com/:username/:my-cool-nextjs-example-repo-name.

    if (t === undefined) {
      const infoResponse = yield (0, _got().default)(`https://api.github.com/repos/${username}/${name}`).catch(e => e);

      if (infoResponse.statusCode !== 200) {
        return;
      }

      const info = JSON.parse(infoResponse.body);
      return {
        username,
        name,
        branch: info["default_branch"],
        filePath
      };
    } // If examplePath is available, the branch name takes the entire path


    const branch = examplePath ? `${_branch}/${file.join("/")}`.replace(new RegExp(`/${filePath}|/$`), "") : _branch;

    if (username && name && branch && t === "tree") {
      return {
        username,
        name,
        branch,
        filePath
      };
    }

    return;
  });
}

function hasRepo({
  username,
  name,
  branch,
  filePath
}) {
  const contentsUrl = `https://api.github.com/repos/${username}/${name}/contents`;
  const packagePath = `${filePath ? `/${filePath}` : ""}/package.json`;
  return isUrlOk(contentsUrl + packagePath + `?ref=${branch}`);
}

function hasExample(name) {
  return isUrlOk(`https://api.github.com/repos/vercel/next.js/contents/examples/${encodeURIComponent(name)}/package.json`);
}

function downloadAndExtractRepo(root, {
  username,
  name,
  branch,
  filePath
}) {
  return pipeline(_got().default.stream(`https://codeload.github.com/${username}/${name}/tar.gz/${branch}`), _tar().default.extract({
    cwd: root,
    strip: filePath ? filePath.split("/").length + 1 : 1
  }, [`${name}-${branch}${filePath ? `/${filePath}` : ""}`]));
}

function downloadAndExtractExample(root, name) {
  if (name === "__internal-testing-retry") {
    throw new Error("This is an internal example for testing the CLI.");
  }

  return pipeline(_got().default.stream("https://codeload.github.com/vercel/next.js/tar.gz/canary"), _tar().default.extract({
    cwd: root,
    strip: 3
  }, [`next.js-canary/examples/${name}`]));
}