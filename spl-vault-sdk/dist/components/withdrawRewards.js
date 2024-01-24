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
exports.WithdrawRewards = void 0;
var react_1 = __importStar(require("react"));
var web3_js_1 = require("@solana/web3.js");
var anchor_1 = require("@project-serum/anchor");
var spl_vault_idl_json_1 = __importDefault(require("../../public/spl-vault-idl.json"));
var spl_token_1 = require("@solana/spl-token");
var helpers_1 = require("../utils/helpers");
var config_1 = require("../utils/config");
var WithdrawRewards = function (_a) {
    var provider = _a.provider, vault = _a.vault, connection = _a.connection;
    var _b = (0, react_1.useState)(null), stakingData = _b[0], setStakingData = _b[1];
    var _c = (0, react_1.useState)(null), selectedReward = _c[0], setSelectedReward = _c[1];
    var _d = (0, react_1.useState)({}), rewardDecimals = _d[0], setRewardDecimals = _d[1];
    (0, react_1.useEffect)(function () {
        if (!provider) {
            return;
        }
        var fetchData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var owner, vaultData, stakingData, vaultData_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        owner = provider.wallet.publicKey;
                        return [4 /*yield*/, (0, helpers_1.fetchVaultData)(vault, connection)];
                    case 1:
                        vaultData = _a.sent();
                        return [4 /*yield*/, (0, helpers_1.fetchStakingAccounts)(config_1.programId, owner, vault, connection)];
                    case 2:
                        stakingData = _a.sent();
                        if (!(stakingData.length > 0)) return [3 /*break*/, 4];
                        setStakingData(stakingData[0]);
                        return [4 /*yield*/, (0, helpers_1.fetchVaultData)(vault, connection)];
                    case 3:
                        vaultData_1 = _a.sent();
                        fetchRewardDecimals(stakingData[0].rewards);
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        fetchData().catch(console.error);
    }, [vault]);
    var fetchRewardDecimals = function (rewards) { return __awaiter(void 0, void 0, void 0, function () {
        var decimals, _i, rewards_1, reward, mintInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    decimals = {};
                    _i = 0, rewards_1 = rewards;
                    _a.label = 1;
                case 1:
                    if (!(_i < rewards_1.length)) return [3 /*break*/, 4];
                    reward = rewards_1[_i];
                    return [4 /*yield*/, (0, spl_token_1.getMint)(provider.connection, new web3_js_1.PublicKey(reward.rewardTokenMint))];
                case 2:
                    mintInfo = _a.sent();
                    decimals[reward.rewardTokenMint] = mintInfo.decimals;
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    setRewardDecimals(decimals);
                    return [2 /*return*/];
            }
        });
    }); };
    var formatRewardAmount = function (reward) {
        var decimals = rewardDecimals[reward.rewardTokenMint] || 0;
        return (reward.amount / Math.pow(10, decimals)).toFixed(4);
    };
    var handleWithdraw = function () { return __awaiter(void 0, void 0, void 0, function () {
        var program, owner, tokenMintAddress, stakingData_1, stakingAccountAddress, userTokenAccount, instructions, _a, vaultTokenAccount, _bump2, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    program = new anchor_1.Program(spl_vault_idl_json_1.default, config_1.programId, provider);
                    owner = provider.wallet.publicKey;
                    tokenMintAddress = new web3_js_1.PublicKey(selectedReward.rewardTokenMint);
                    return [4 /*yield*/, (0, helpers_1.fetchStakingAccounts)(config_1.programId, owner, vault, connection)];
                case 1:
                    stakingData_1 = _b.sent();
                    stakingAccountAddress = new web3_js_1.PublicKey(stakingData_1[0].accountId);
                    return [4 /*yield*/, (0, spl_token_1.getAssociatedTokenAddress)(tokenMintAddress, provider.wallet.publicKey)];
                case 2:
                    userTokenAccount = _b.sent();
                    instructions = [];
                    if (userTokenAccount === null) {
                        instructions.push((0, spl_token_1.createAssociatedTokenAccountInstruction)(provider.wallet.publicKey, userTokenAccount, provider.wallet.publicKey, tokenMintAddress));
                    }
                    return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddressSync([
                            Buffer.from("spl_rewards"), vault.toBuffer(), tokenMintAddress.toBuffer()
                        ], config_1.programId)];
                case 3:
                    _a = _b.sent(), vaultTokenAccount = _a[0], _bump2 = _a[1];
                    return [4 /*yield*/, program.methods.withdrawRewards()
                            .accounts({
                            stakingAccount: stakingAccountAddress,
                            userTokenAccount: userTokenAccount,
                            vaultTokenAccount: vaultTokenAccount,
                            vault: vault,
                            tokenMint: tokenMintAddress,
                            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                            owner: provider.wallet.publicKey,
                            feeAccount: config_1.feeAccount,
                            systemProgram: web3_js_1.SystemProgram.programId,
                        })
                            .preInstructions(__spreadArray([], instructions, true))
                            .signers([])
                            .rpc()];
                case 4:
                    _b.sent();
                    console.log("rewards claimed successfully.");
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _b.sent();
                    console.error("Error unstaking tokens:", error_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    return (react_1.default.createElement("div", { className: 'rewardsContainer' },
        react_1.default.createElement("h2", null, "Withdraw Rewards"),
        stakingData && stakingData.rewards.length > 0 ? (react_1.default.createElement("select", { onChange: function (e) { return setSelectedReward(stakingData.rewards.find(function (reward) { return reward.rewardTokenMint === e.target.value; })); } },
            react_1.default.createElement("option", { value: "" }, "Select Reward"),
            stakingData.rewards.map(function (reward, index) { return (react_1.default.createElement("option", { key: index, value: reward.rewardTokenMint },
                reward.rewardTokenMint,
                " - ",
                formatRewardAmount(reward))); }))) : (react_1.default.createElement("p", null, "No rewards available")),
        react_1.default.createElement("button", { onClick: handleWithdraw }, "Withdraw Rewards")));
};
exports.WithdrawRewards = WithdrawRewards;
