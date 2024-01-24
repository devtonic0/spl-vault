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
exports.UpdateVault = void 0;
var react_1 = __importStar(require("react"));
var web3_js_1 = require("@solana/web3.js");
var anchor_1 = require("@project-serum/anchor");
var spl_vault_idl_json_1 = __importDefault(require("../../public/spl-vault-idl.json"));
var config_1 = require("../utils/config");
var helpers_1 = require("../utils/helpers");
var programId = new web3_js_1.PublicKey("vaULtyRDJpUm1BfD7SzUYJ4GhmUE3FPEstRZSUquBxf");
var UpdateVault = function (_a) {
    var provider = _a.provider, vault = _a.vault, connection = _a.connection;
    var _b = (0, react_1.useState)(null), vaultData = _b[0], setVaultData = _b[1];
    (0, react_1.useEffect)(function () {
        if (!provider) {
            return;
        }
        var fetchData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var owner, vaultData, vaultData_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        owner = provider.wallet.publicKey;
                        return [4 /*yield*/, (0, helpers_1.fetchVaultData)(vault, connection)];
                    case 1:
                        vaultData = _a.sent();
                        if (!vaultData) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, helpers_1.fetchVaultData)(vault, connection)];
                    case 2:
                        vaultData_1 = _a.sent();
                        setVaultData(vaultData_1);
                        setNewAllowedToken(vaultData_1.AllowedToken);
                        setLockupDurations([
                            vaultData_1.lockupDuration1,
                            vaultData_1.lockupDuration2,
                            vaultData_1.lockupDuration3,
                            vaultData_1.lockupDuration4
                        ]);
                        setLockupMultipliers([
                            vaultData_1.lockupMultiplier1,
                            vaultData_1.lockupMultiplier2,
                            vaultData_1.lockupMultiplier3,
                            vaultData_1.lockupMultiplier4
                        ]);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        fetchData().catch(console.error);
    }, [provider, vault]);
    var _c = (0, react_1.useState)(false), isEditing = _c[0], setIsEditing = _c[1];
    var _d = (0, react_1.useState)(null), newAllowedToken = _d[0], setNewAllowedToken = _d[1];
    var _e = (0, react_1.useState)([]), lockupDurations = _e[0], setLockupDurations = _e[1];
    var _f = (0, react_1.useState)([]), lockupMultipliers = _f[0], setLockupMultipliers = _f[1];
    var _g = (0, react_1.useState)(null), selectedRewardIndex = _g[0], setSelectedRewardIndex = _g[1];
    var _h = (0, react_1.useState)(""), rewardUpdateTokenId = _h[0], setRewardUpdateTokenId = _h[1];
    var _j = (0, react_1.useState)(0), rewardUpdateAmount = _j[0], setRewardUpdateAmount = _j[1];
    var _k = (0, react_1.useState)(false), removeReward = _k[0], setRemoveReward = _k[1];
    if (vaultData) {
        var handleEditClick = function () {
            setIsEditing(true);
        };
        var handleRewardEdit_1 = function (index) {
            setSelectedRewardIndex(index);
            setRemoveReward(false);
            setIsEditing(true);
            if (vaultData) {
                var selectedReward = vaultData.rewards[index];
                setRewardUpdateTokenId(selectedReward.rewardTokenMint);
                setRewardUpdateAmount(new anchor_1.BN(selectedReward.schedule));
            }
        };
        var handleRewardRemove_1 = function (index) {
            setSelectedRewardIndex(index);
            setRemoveReward(true);
            setRewardUpdateTokenId(web3_js_1.SystemProgram.programId.toBase58());
            setRewardUpdateAmount(0);
        };
        var bnLockupDurations_1 = lockupDurations.map(function (duration) { return new anchor_1.BN(duration); });
        var bnLockupMultipliers_1 = lockupMultipliers.map(function (multiplier) { return new anchor_1.BN(multiplier); });
        var handleSubmit = function (event) { return __awaiter(void 0, void 0, void 0, function () {
            var program;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        event.preventDefault();
                        program = new anchor_1.Program(spl_vault_idl_json_1.default, programId, provider);
                        return [4 /*yield*/, program.methods.updateVaultSettings(new web3_js_1.PublicKey(newAllowedToken), bnLockupDurations_1, bnLockupMultipliers_1, selectedRewardIndex, new web3_js_1.PublicKey(rewardUpdateTokenId), new anchor_1.BN(rewardUpdateAmount))
                                .accounts({
                                vault: vault,
                                vaultOwner: provider.wallet.publicKey,
                                feeAccount: config_1.feeAccount,
                                systemProgram: web3_js_1.SystemProgram.programId,
                            })
                                .rpc()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        var nonEditableRewardClass_1 = "nonEditableReward";
        return (react_1.default.createElement("div", { className: 'updateFormContainer' },
            react_1.default.createElement("form", { className: 'updateForm', onSubmit: handleSubmit },
                react_1.default.createElement("div", { className: 'lockupUpdateContainer' },
                    react_1.default.createElement("h3", null, "Lockup Durations"),
                    lockupDurations.map(function (duration, index) { return (react_1.default.createElement("div", { key: index, className: 'lockupUpdate' },
                        react_1.default.createElement("label", null,
                            "Lockup Duration ",
                            index + 1,
                            " (days)"),
                        react_1.default.createElement("input", { type: "number", value: duration, onChange: function (e) {
                                var updatedDurations = __spreadArray([], lockupDurations, true);
                                updatedDurations[index] = e.target.value;
                                setLockupDurations(updatedDurations);
                            }, readOnly: !isEditing }))); })),
                react_1.default.createElement("div", { className: 'lockupUpdateContainer' },
                    react_1.default.createElement("h3", null, "Lockup Multipliers"),
                    lockupMultipliers.map(function (multiplier, index) { return (react_1.default.createElement("div", { key: index },
                        react_1.default.createElement("label", null,
                            "Lockup Multiplier ",
                            index + 1),
                        react_1.default.createElement("input", { type: "number", value: multiplier, onChange: function (e) {
                                var updatedMultipliers = __spreadArray([], lockupMultipliers, true);
                                updatedMultipliers[index] = e.target.value;
                                setLockupMultipliers(updatedMultipliers);
                            }, readOnly: !isEditing }))); })),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("button", { type: "button", onClick: handleEditClick }, "Edit Settings")),
                react_1.default.createElement("div", { className: 'rewardsUpdate' },
                    react_1.default.createElement("h3", null, "Rewards"),
                    vaultData.rewards.map(function (reward, index) { return (react_1.default.createElement("div", { key: index, className: selectedRewardIndex === index ? 'rewardsBox' : nonEditableRewardClass_1 },
                        selectedRewardIndex === index && isEditing ? (react_1.default.createElement(react_1.default.Fragment, null,
                            react_1.default.createElement("div", { className: 'rewardMint' },
                                react_1.default.createElement("label", null, "Reward Token Mint:"),
                                react_1.default.createElement("input", { type: "text", value: rewardUpdateTokenId, onChange: function (e) { return setRewardUpdateTokenId(e.target.value); } })),
                            react_1.default.createElement("div", { className: 'schedule' },
                                react_1.default.createElement("label", null, "Schedule:"),
                                react_1.default.createElement("input", { type: "number", value: rewardUpdateAmount, onChange: function (e) { return setRewardUpdateAmount(Number(e.target.value)); } })))) : (react_1.default.createElement(react_1.default.Fragment, null,
                            react_1.default.createElement("p", null,
                                "Reward Token Mint: ",
                                reward.rewardTokenMint),
                            react_1.default.createElement("p", null,
                                "Schedule: ",
                                reward.schedule))),
                        react_1.default.createElement("button", { type: "button", onClick: function () { return handleRewardEdit_1(index); } }, "Edit Reward"),
                        react_1.default.createElement("button", { type: "button", onClick: function () { return handleRewardRemove_1(index); } }, "Remove Reward"))); })),
                react_1.default.createElement("button", { type: "submit" }, "Update Vault Settings"))));
    }
    else {
        return null;
    }
};
exports.UpdateVault = UpdateVault;
