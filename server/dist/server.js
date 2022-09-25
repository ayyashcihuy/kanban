"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var app = (0, express_1["default"])();
var port = process.env.PORT || 8080;
app.get("/", function (req, res) {
    res.send("Hello World");
});
app.listen(port, function () {
    console.log("Server is running on http://localhost:".concat(port));
});
//# sourceMappingURL=server.js.map