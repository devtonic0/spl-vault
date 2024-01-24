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
exports.StoreRewards = void 0;
var react_1 = require("react");
var web3_js_1 = require("@solana/web3.js");
var anchor_1 = require("@project-serum/anchor");
var spl_vault_idl_json_1 = __importDefault(require("../../public/spl-vault-idl.json"));
var helpers_1 = require("../utils/helpers");
var programId = new web3_js_1.PublicKey("vaULtyRDJpUm1BfD7SzUYJ4GhmUE3FPEstRZSUquBxf");
var StoreRewards = function (_a) {
    var provider = _a.provider, vault = _a.vault, connection = _a.connection;
    var _b = (0, react_1.useState)(null), stakingData = _b[0], setStakingData = _b[1];
    var _c = (0, react_1.useState)(null), vaultData = _c[0], setVaultData = _c[1];
    var _d = (0, react_1.useState)(0), refreshTrigger = _d[0], setRefreshTrigger = _d[1];
    var triggerUpdate = function () {
        setRefreshTrigger(function (prev) { return prev + 1; });
    };
    (0, react_1.useEffect)(function () {
        var fetchData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var owner, vaultData, stakingData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        owner = provider.wallet.publicKey;
                        return [4 /*yield*/, (0, helpers_1.fetchVaultData)(vault, connection)];
                    case 1:
                        vaultData = _a.sent();
                        return [4 /*yield*/, (0, helpers_1.fetchStakingAccounts)(programId, owner, vault, connection)];
                    case 2:
                        stakingData = _a.sent();
                        if (stakingData.length > 0) {
                            setStakingData(stakingData[0]);
                            setVaultData(vaultData);
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        fetchData().catch(console.error);
    }, [provider, vault, refreshTrigger]);
    (0, react_1.useEffect)(function () {
        var storeRewards = function () { return __awaiter(void 0, void 0, void 0, function () {
            var timestampMilliseconds, currentTimeMilliseconds, tenMinutesInMilliseconds, program, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!stakingData) return [3 /*break*/, 6];
                        timestampMilliseconds = stakingData.timestamp * 1000;
                        currentTimeMilliseconds = Date.now();
                        tenMinutesInMilliseconds = 10 * 60 * 1000;
                        if (!(currentTimeMilliseconds - timestampMilliseconds >= tenMinutesInMilliseconds)) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        program = new anchor_1.Program(spl_vault_idl_json_1.default, programId, provider);
                        return [4 /*yield*/, program.methods.storeRewards()
                                .accounts({
                                stakingAccount: new web3_js_1.PublicKey(stakingData.accountId),
                                vault: vault,
                                stakingMint: new web3_js_1.PublicKey(vaultData.AllowedToken),
                                owner: provider.wallet.publicKey,
                            })
                                .rpc()];
                    case 2:
                        _a.sent();
                        triggerUpdate();
                        console.log("Rewards stored successfully.");
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error("Error storing rewards:", error_1);
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        console.log("Timestamp is less than 10 minutes old. Skipping transaction.");
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        storeRewards();
    }, [provider, vault, stakingData]);
    return null;
};
exports.StoreRewards = StoreRewards;
