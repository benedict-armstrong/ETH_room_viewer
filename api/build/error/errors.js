"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.logErrors = void 0;
function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
}
exports.logErrors = logErrors;
function errorHandler(err, req, res, next) {
    res.status(500).json({ error: err.message });
}
exports.errorHandler = errorHandler;
