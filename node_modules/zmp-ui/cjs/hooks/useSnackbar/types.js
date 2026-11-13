"use strict";

exports.__esModule = true;
exports.SnackbarType = exports.SnackbarPosition = void 0;
var SnackbarPosition = exports.SnackbarPosition = /*#__PURE__*/function (SnackbarPosition) {
  SnackbarPosition["top"] = "top";
  SnackbarPosition["bottom"] = "bottom";
  return SnackbarPosition;
}({});
var SnackbarType = exports.SnackbarType = /*#__PURE__*/function (SnackbarType) {
  SnackbarType["default"] = "default";
  SnackbarType["success"] = "success";
  SnackbarType["info"] = "info";
  SnackbarType["error"] = "error";
  SnackbarType["warning"] = "warning";
  SnackbarType["loading"] = "loading";
  SnackbarType["download"] = "download";
  SnackbarType["countdown"] = "countdown";
  SnackbarType["wifi-connected"] = "wifi-connected";
  SnackbarType["wifi-disconnected"] = "wifi-disconnected";
  return SnackbarType;
}({});