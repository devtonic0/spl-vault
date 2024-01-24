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
exports.TimedRewards = void 0;
var react_1 = __importStar(require("react"));
var helpers_1 = require("../utils/helpers");
var web3_js_1 = require("@solana/web3.js");
var anchor_1 = require("@project-serum/anchor");
var spl_vault_idl_json_1 = __importDefault(require("../../public/spl-vault-idl.json"));
var spl_token_1 = require("@solana/spl-token");
var config_1 = require("../utils/config");
var TimedRewards = function (_a) {
    var provider = _a.provider, vault = _a.vault, connection = _a.connection;
    var _b = (0, react_1.useState)(null), stakingData = _b[0], setStakingData = _b[1];
    var _c = (0, react_1.useState)(null), vaultData = _c[0], setVaultData = _c[1];
    var _d = (0, react_1.useState)([]), rewardsList = _d[0], setRewardsList = _d[1];
    var _e = (0, react_1.useState)(''), selectedRewardTokenMint = _e[0], setSelectedRewardTokenMint = _e[1];
    var _f = (0, react_1.useState)(null), stakingAccountAddress = _f[0], setStakingAccountAddress = _f[1];
    var _g = (0, react_1.useState)(null), selectedIndex = _g[0], setSelectedIndex = _g[1];
    var _h = (0, react_1.useState)(0), refreshTrigger = _h[0], setRefreshTrigger = _h[1];
    var triggerUpdate = function () {
        setRefreshTrigger(function (prev) { return prev + 1; });
    };
    var handleRewardChange = function (e) {
        var index = e.target.selectedIndex - 1;
        setSelectedRewardTokenMint(e.target.value);
        setSelectedIndex(index >= 0 ? index : null);
    };
    (0, react_1.useEffect)(function () {
        var fetchData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var owner, vaultData, stakingData;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        owner = provider.wallet.publicKey;
                        return [4 /*yield*/, (0, helpers_1.fetchVaultData)(vault, connection)];
                    case 1:
                        vaultData = _b.sent();
                        return [4 /*yield*/, (0, helpers_1.fetchStakingAccounts)(config_1.programId, owner, vault, connection)];
                    case 2:
                        stakingData = _b.sent();
                        if (stakingData.length > 0) {
                            setStakingData(stakingData[0]);
                            setVaultData(vaultData);
                            calculateRewards(vaultData, stakingData[0]);
                            setStakingAccountAddress(new web3_js_1.PublicKey(new web3_js_1.PublicKey((_a = stakingData[0]) === null || _a === void 0 ? void 0 : _a.accountId)));
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        fetchData().catch(console.error);
    }, [provider, vault, refreshTrigger]);
    (0, react_1.useEffect)(function () {
        var updateRewards = function () {
            if (stakingData && vaultData) {
                calculateRewards(vaultData, stakingData);
            }
        };
        var intervalId = setInterval(updateRewards, 1000);
        return function () { return clearInterval(intervalId); };
    }, [stakingData, vaultData]);
    var calculateRewards = function (vaultData, stakingData) { return __awaiter(void 0, void 0, void 0, function () {
        var rewards, _i, _a, reward, timestamp, currentTime, timeElapsed, mintInfo, rewardDecimals, stakingInfo, stakingDecimals, scaledSchedule, rewardPerSecond, userReward, multiplier, decimalFactor;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    rewards = [];
                    _i = 0, _a = vaultData.rewards;
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    reward = _a[_i];
                    timestamp = stakingData.timestamp;
                    if (timestamp < reward.timestamp) {
                        timestamp = reward.timestamp;
                    }
                    currentTime = Math.floor(Date.now() / 1000);
                    timeElapsed = currentTime - timestamp;
                    return [4 /*yield*/, (0, spl_token_1.getMint)(provider.connection, new web3_js_1.PublicKey(reward.rewardTokenMint))];
                case 2:
                    mintInfo = _b.sent();
                    rewardDecimals = mintInfo.decimals;
                    return [4 /*yield*/, (0, spl_token_1.getMint)(provider.connection, new web3_js_1.PublicKey(vaultData.AllowedToken))];
                case 3:
                    stakingInfo = _b.sent();
                    stakingDecimals = stakingInfo.decimals;
                    scaledSchedule = reward.schedule * 1000000000;
                    rewardPerSecond = scaledSchedule / config_1.SECONDS_IN_YEAR;
                    userReward = (rewardPerSecond * timeElapsed * stakingData.stakedAmount / Math.pow(10, stakingDecimals)) / Math.pow(10, rewardDecimals) / 1000000000;
                    multiplier = getMultiplier(stakingData.lockupOption, vaultData);
                    userReward = userReward * multiplier / 100;
                    decimalFactor = rewardDecimals;
                    if (decimalFactor < 2) {
                        decimalFactor = 2;
                    }
                    rewards.push({
                        tokenMint: reward.rewardTokenMint,
                        amount: userReward.toFixed(decimalFactor)
                    });
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5:
                    setRewardsList(rewards);
                    return [2 /*return*/];
            }
        });
    }); };
    var getMultiplier = function (lockupOption, vaultData) {
        var option = parseInt(lockupOption, 10);
        switch (option) {
            case 1: return vaultData.lockupMultiplier1;
            case 2: return vaultData.lockupMultiplier2;
            case 3: return vaultData.lockupMultiplier3;
            case 4: return vaultData.lockupMultiplier4;
            default: return 0;
        }
    };
    var handleWithdrawTimedRewards = function () { return __awaiter(void 0, void 0, void 0, function () {
        var program, tokenMintAddress, userTokenAccount, stakingMint, instructions, _a, vaultTokenAccount, _bump2, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    program = new anchor_1.Program(spl_vault_idl_json_1.default, config_1.programId, provider);
                    tokenMintAddress = new web3_js_1.PublicKey(selectedRewardTokenMint);
                    return [4 /*yield*/, (0, spl_token_1.getAssociatedTokenAddress)(tokenMintAddress, provider.wallet.publicKey)];
                case 1:
                    userTokenAccount = _b.sent();
                    stakingMint = vaultData.AllowedToken;
                    instructions = [];
                    if (userTokenAccount === null) {
                        instructions.push((0, spl_token_1.createAssociatedTokenAccountInstruction)(provider.wallet.publicKey, userTokenAccount, provider.wallet.publicKey, tokenMintAddress));
                    }
                    return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddressSync([
                            Buffer.from("spl_rewards"), vault.toBuffer(), tokenMintAddress.toBuffer()
                        ], config_1.programId)];
                case 2:
                    _a = _b.sent(), vaultTokenAccount = _a[0], _bump2 = _a[1];
                    return [4 /*yield*/, program.methods.withdrawTimedRewards(selectedIndex)
                            .accounts({
                            stakingAccount: stakingAccountAddress,
                            userTokenAccount: userTokenAccount,
                            vaultTokenAccount: vaultTokenAccount,
                            vault: vault,
                            tokenMint: tokenMintAddress,
                            stakingMint: stakingMint,
                            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                            owner: provider.wallet.publicKey,
                            feeAccount: config_1.feeAccount,
                            systemProgram: web3_js_1.SystemProgram.programId,
                        })
                            .preInstructions(__spreadArray([], instructions, true))
                            .signers([])
                            .rpc()];
                case 3:
                    _b.sent();
                    triggerUpdate();
                    console.log("Timed rewards withdrawn successfully.");
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _b.sent();
                    console.error("Error withdrawing timed rewards:", error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (react_1.default.createElement("div", { className: 'timedRewards' },
        react_1.default.createElement("h2", null, "Timed Rewards"),
        react_1.default.createElement("select", { onChange: handleRewardChange },
            react_1.default.createElement("option", { value: "" }, "Select a reward"),
            rewardsList.map(function (reward, index) { return (react_1.default.createElement("option", { key: index, value: reward.tokenMint },
                reward.tokenMint,
                " - ",
                reward.amount)); })),
        react_1.default.createElement("button", { onClick: handleWithdrawTimedRewards }, "Withdraw Rewards")));
};
exports.TimedRewards = TimedRewards;
