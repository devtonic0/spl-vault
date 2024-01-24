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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitializeAccountButton = exports.initializeAccount = void 0;
var web3_js_1 = require("@solana/web3.js");
var anchor_1 = require("@project-serum/anchor");
var spl_vault_idl_json_1 = __importDefault(require("../../public/spl-vault-idl.json"));
var react_1 = __importDefault(require("react"));
var config_1 = require("../utils/config");
function initializeAccount(provider, vaultPublicKey) {
    return __awaiter(this, void 0, void 0, function () {
        var program, stakingAccount, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    program = new anchor_1.Program(spl_vault_idl_json_1.default, config_1.programId, provider);
                    stakingAccount = anchor_1.web3.Keypair.generate();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, program.methods.initializeAccount(vaultPublicKey)
                            .accounts({
                            stakingAccount: stakingAccount.publicKey,
                            owner: provider.wallet.publicKey,
                            vault: vaultPublicKey,
                            feeAccount: config_1.feeAccount,
                            systemProgram: web3_js_1.SystemProgram.programId,
                        })
                            .signers([stakingAccount])
                            .rpc()];
                case 2:
                    _a.sent();
                    console.log("Account initialized successfully.");
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error initializing account:", error_1);
                    throw error_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.initializeAccount = initializeAccount;
var InitializeAccountButton = function (_a) {
    var provider = _a.provider, vault = _a.vault;
    var handleClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log("Initializing account for farm:", vault.toString());
                    return [4 /*yield*/, initializeAccount(provider, vault)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error("Error in account initialization button:", error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (react_1.default.createElement("div", { className: 'initAccount' },
        react_1.default.createElement("h1", null, "Create Account"),
        react_1.default.createElement("button", { className: 'initAccountButton', onClick: handleClick }, "Initialize Account")));
};
exports.InitializeAccountButton = InitializeAccountButton;
