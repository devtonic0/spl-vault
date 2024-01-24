"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTimedRewards = void 0;
var react_1 = __importStar(require("react"));
var web3_js_1 = require("@solana/web3.js");
var anchor_1 = require("@project-serum/anchor");
var spl_vault_idl_json_1 = __importDefault(require("../../public/spl-vault-idl.json"));
var bn_js_1 = __importDefault(require("bn.js"));
var config_1 = require("../utils/config");
var spl_token_1 = require("@solana/spl-token");
var CreateTimedRewards = function (_a) {
    var provider = _a.provider, vault = _a.vault;
    var _b = (0, react_1.useState)(''), tokenMint = _b[0], setTokenMint = _b[1];
    var _c = (0, react_1.useState)(0), schedule = _c[0], setSchedule = _c[1];
    var _d = (0, react_1.useState)(0), decimals = _d[0], setDecimals = _d[1];
    var handleAddTimedRewards = function () { return __awaiter(void 0, void 0, void 0, function () {
        var program, tokenMintAddress, mintInfo, rewardDecimals, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    program = new anchor_1.Program(spl_vault_idl_json_1.default, config_1.programId, provider);
                    tokenMintAddress = new web3_js_1.PublicKey(tokenMint);
                    return [4 /*yield*/, (0, spl_token_1.getMint)(provider.connection, new web3_js_1.PublicKey(tokenMintAddress))];
                case 1:
                    mintInfo = _a.sent();
                    rewardDecimals = mintInfo.decimals;
                    return [4 /*yield*/, program.methods.addTimedRewards(new bn_js_1.default(Math.pow(10, rewardDecimals) * schedule))
                            .accounts({
                            vault: vault,
                            rewardTokenMint: tokenMintAddress,
                            vaultOwner: provider.wallet.publicKey,
                            feeAccount: config_1.feeAccount,
                            systemProgram: web3_js_1.SystemProgram.programId,
                        })
                            .signers([])
                            .rpc()];
                case 2:
                    _a.sent();
                    console.log("Timed rewards added successfully.");
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error adding timed rewards:", error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (react_1.default.createElement("div", { className: 'addTimedRewards' },
        react_1.default.createElement("h2", null, "Add Timed Rewards"),
        react_1.default.createElement("input", { type: "text", placeholder: "Token Mint Address", value: tokenMint, onChange: function (e) { return setTokenMint(e.target.value); } }),
        react_1.default.createElement("input", { type: "number", placeholder: "Schedule", value: schedule, onChange: function (e) { return setSchedule(Number(e.target.value)); } }),
        react_1.default.createElement("button", { onClick: handleAddTimedRewards }, "Add Timed Rewards")));
};
exports.CreateTimedRewards = CreateTimedRewards;
