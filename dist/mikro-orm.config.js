"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Post_1 = require("./entities/Post");
const cosnstants_1 = require("./cosnstants");
const path_1 = __importDefault(require("path"));
const User_1 = require("./entities/User");
exports.default = {
    migrations: {
        path: path_1.default.join(__dirname, './migrations'),
        glob: '!(*.d).{js,ts}',
    },
    dbName: 'lireddit',
    debug: !cosnstants_1.__prod__,
    type: 'postgresql',
    allowGlobalContext: true,
    user: 'postgres',
    password: 'jsmv4183',
    entities: [Post_1.Post, User_1.User],
};
//# sourceMappingURL=mikro-orm.config.js.map