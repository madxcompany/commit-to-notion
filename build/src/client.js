"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instance = void 0;
const axios_1 = require("axios");
const instance = (token) => axios_1.default.create({
    baseURL: 'https://api.notion.com/',
    timeout: 15000,
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2021-08-16',
    },
});
exports.instance = instance;
//# sourceMappingURL=client.js.map