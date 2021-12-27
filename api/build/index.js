"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const rooms_1 = __importDefault(require("./routes/rooms"));
const errors_1 = require("./error/errors");
const app = (0, express_1.default)();
const port = process.env.PORT;
if (!port) {
    throw console.error('Port missing!');
}
// Body parsing Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/v1/rooms', rooms_1.default);
app.get('/api/healthcheck', (req, res) => {
    res.send('OK');
});
app.use(errors_1.logErrors);
app.use(errors_1.errorHandler);
try {
    app.listen(port, () => {
        console.log(`Connected successfully on port ${port}`);
    });
}
catch (error) {
    console.error(`Error occurred: ${error}`);
}
