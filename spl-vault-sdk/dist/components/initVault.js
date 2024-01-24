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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitializeVaultButton = exports.initializeVault = void 0;
var web3_js_1 = require("@solana/web3.js");
var react_1 = __importDefault(require("react"));
var react_2 = require("react");
var anchor_1 = require("@project-serum/anchor");
var spl_vault_idl_json_1 = __importDefault(require("../../public/spl-vault-idl.json"));
var config_1 = require("../utils/config");
function initializeVault(provider, allowedToken, lockupDurationOptions, lockupMultiplierOptions) {
    return __awaiter(this, void 0, void 0, function () {
        var program, vaultRef, vaultRefDone, _a, vault, _bump, _b, vaultTokenAccount, _bump2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    program = new anchor_1.Program(spl_vault_idl_json_1.default, config_1.programId, provider);
                    vaultRef = anchor_1.web3.Keypair.generate();
                    vaultRefDone = vaultRef.publicKey;
                    return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddressSync([
                            Buffer.from("spl_vault"), vaultRefDone.toBuffer()
                        ], config_1.programId)];
                case 1:
                    _a = _c.sent(), vault = _a[0], _bump = _a[1];
                    return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddressSync([
                            vault.toBuffer(), Buffer.from("vault_tokens")
                        ], config_1.programId)];
                case 2:
                    _b = _c.sent(), vaultTokenAccount = _b[0], _bump2 = _b[1];
                    console.log("Vault ID:", vault.toBase58());
                    return [4 /*yield*/, program.methods.initializeVault(allowedToken, lockupDurationOptions, lockupMultiplierOptions)
                            .accounts({
                            vault: vault,
                            vaultRef: vaultRef.publicKey.toBase58(),
                            vaultTokenAccount: vaultTokenAccount,
                            allowedToken: allowedToken,
                            owner: provider.wallet.publicKey,
                            feeAccount: config_1.feeAccount,
                            systemProgram: web3_js_1.SystemProgram.programId,
                        })
                            .signers([])
                            .rpc()];
                case 3:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.initializeVault = initializeVault;
var InitializeVaultButton = function (_a) {
    var provider = _a.provider;
    var _b = (0, react_2.useState)(''), allowedToken = _b[0], setAllowedToken = _b[1];
    var _c = (0, react_2.useState)([new anchor_1.BN(1), new anchor_1.BN(1), new anchor_1.BN(1), new anchor_1.BN(1)]), lockupDurationOptions = _c[0], setLockupDurationOptions = _c[1];
    var _d = (0, react_2.useState)([0, 0, 0, 0]), lockupMultiplierOptions = _d[0], setLockupMultiplierOptions = _d[1];
    var _e = (0, react_2.useState)([0, 0, 0, 0]), displayLockupDurationOptions = _e[0], setDisplayLockupDurationOptions = _e[1];
    var handleLockupDurationChange = function (index, value) {
        var updatedOptions = __spreadArray([], lockupDurationOptions, true);
        var updatedDisplayOptions = __spreadArray([], displayLockupDurationOptions, true);
        var numericValue = Number(value);
        updatedOptions[index] = numericValue === 0 ? new anchor_1.BN(1) : new anchor_1.BN(numericValue * 60 * 60 * 24);
        updatedDisplayOptions[index] = Math.floor(numericValue);
        setLockupDurationOptions(updatedOptions);
        setDisplayLockupDurationOptions(updatedDisplayOptions);
    };
    var handleLockupMultiplierChange = function (index, value) {
        var updatedOptions = __spreadArray([], lockupMultiplierOptions, true);
        updatedOptions[index] = new anchor_1.BN(value);
        setLockupMultiplierOptions(updatedOptions);
    };
    var handleClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, initializeVault(provider, new web3_js_1.PublicKey(allowedToken), lockupDurationOptions, lockupMultiplierOptions)];
                case 1:
                    _a.sent();
                    console.log("Vault initialized successfully.");
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error("Error initializing vault:", error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (react_1.default.createElement("div", { className: 'createVaultContainer' },
        react_1.default.createElement("h1", null, "Create Vault"),
        react_1.default.createElement("input", { type: "text", placeholder: "Allowed Token", className: 'allowedTokenInput', onChange: function (e) { return setAllowedToken(e.target.value); } }),
        react_1.default.createElement("div", { className: 'lockupDurationOptionsContainer' },
            react_1.default.createElement("p", null, "Lockup Duration (in days)"),
            react_1.default.createElement("div", { className: 'lockupDurationOptions' }, displayLockupDurationOptions.map(function (option, index) { return (react_1.default.createElement("input", { key: index, type: "number", placeholder: "Lockup Duration Option ".concat(index + 1), value: option, onChange: function (e) { return handleLockupDurationChange(index, e.target.value); } })); }))),
        react_1.default.createElement("div", { className: 'multiplierOptionsContainer' },
            react_1.default.createElement("p", null, "Multiplier (Read Docs)"),
            react_1.default.createElement("div", { className: 'multiplierOptions' }, lockupMultiplierOptions.map(function (option, index) { return (react_1.default.createElement("input", { key: index, type: "number", placeholder: "Lockup Multiplier Option ".concat(index + 1), value: option, onChange: function (e) { return handleLockupMultiplierChange(index, e.target.value); } })); }))),
        react_1.default.createElement("button", { className: 'initVaultButton', onClick: handleClick }, "Initialize Vault")));
};
exports.InitializeVaultButton = InitializeVaultButton;
