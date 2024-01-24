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
exports.TokensStaking = void 0;
var react_1 = __importStar(require("react"));
var web3_js_1 = require("@solana/web3.js");
var anchor_1 = require("@project-serum/anchor");
var spl_vault_idl_json_1 = __importDefault(require("../../public/spl-vault-idl.json"));
var spl_token_1 = require("@solana/spl-token");
var helpers_1 = require("../utils/helpers");
var config_1 = require("../utils/config");
var initAccount_1 = require("./initAccount");
var TokensStaking = function (_a) {
    var provider = _a.provider, vault = _a.vault, connection = _a.connection;
    var _b = (0, react_1.useState)(0), amount = _b[0], setAmount = _b[1];
    var _c = (0, react_1.useState)(1), lockupOption = _c[0], setLockupOption = _c[1];
    var _d = (0, react_1.useState)(null), stakingData = _d[0], setStakingData = _d[1];
    var _e = (0, react_1.useState)(null), vaultData = _e[0], setVaultData = _e[1];
    var _f = (0, react_1.useState)(0), decimals = _f[0], setDecimals = _f[1];
    var amountStaked = Number(stakingData === null || stakingData === void 0 ? void 0 : stakingData.stakedAmount) / decimals || 0;
    var unlockTimestamp = (stakingData === null || stakingData === void 0 ? void 0 : stakingData.unlockTimestamp) || 0;
    var unlockTime = (0, helpers_1.countdownToUnlock)(unlockTimestamp);
    var _g = (0, react_1.useState)(0), updateTrigger = _g[0], setUpdateTrigger = _g[1];
    var _h = (0, react_1.useState)(""), countdown = _h[0], setCountdown = _h[1];
    (0, react_1.useEffect)(function () {
        var updateCountdown = function () {
            if (stakingData === null || stakingData === void 0 ? void 0 : stakingData.unlockTimestamp) {
                setCountdown((0, helpers_1.countdownToUnlock)(stakingData.unlockTimestamp));
            }
        };
        var intervalId = setInterval(updateCountdown, 1000);
        return function () { return clearInterval(intervalId); };
    }, [provider, stakingData === null || stakingData === void 0 ? void 0 : stakingData.unlockTimestamp]);
    (0, react_1.useEffect)(function () {
        if (!provider) {
            return;
        }
        var fetchData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var owner, vaultData, mintInfo, stakingData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        owner = provider.wallet.publicKey;
                        return [4 /*yield*/, (0, helpers_1.fetchVaultData)(vault, connection)];
                    case 1:
                        vaultData = _a.sent();
                        return [4 /*yield*/, (0, spl_token_1.getMint)(provider.connection, new web3_js_1.PublicKey(vaultData.AllowedToken))];
                    case 2:
                        mintInfo = _a.sent();
                        setDecimals(Math.pow(10, Number(mintInfo.decimals)));
                        return [4 /*yield*/, (0, helpers_1.fetchStakingAccounts)(config_1.programId, owner, vault, connection)];
                    case 3:
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
    }, [provider, updateTrigger]);
    var triggerUpdate = function () {
        setUpdateTrigger(function (prev) { return prev + 1; });
    };
    var handleStake = function () { return __awaiter(void 0, void 0, void 0, function () {
        var program, owner, vaultData_1, tokenMintAddress, stakingData_1, stakingAccountAddress, userTokenAccount, _a, vaultTokenAccount, _bump2, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 6, , 7]);
                    program = new anchor_1.Program(spl_vault_idl_json_1.default, config_1.programId, provider);
                    owner = provider.wallet.publicKey;
                    return [4 /*yield*/, (0, helpers_1.fetchVaultData)(vault, connection)];
                case 1:
                    vaultData_1 = _b.sent();
                    tokenMintAddress = new web3_js_1.PublicKey(vaultData_1.AllowedToken);
                    return [4 /*yield*/, (0, helpers_1.fetchStakingAccounts)(config_1.programId, owner, vault, connection)];
                case 2:
                    stakingData_1 = _b.sent();
                    stakingAccountAddress = new web3_js_1.PublicKey(stakingData_1[0].accountId);
                    return [4 /*yield*/, (0, spl_token_1.getAssociatedTokenAddress)(tokenMintAddress, provider.wallet.publicKey)];
                case 3:
                    userTokenAccount = _b.sent();
                    return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddressSync([
                            vault.toBuffer(), Buffer.from("vault_tokens")
                        ], config_1.programId)];
                case 4:
                    _a = _b.sent(), vaultTokenAccount = _a[0], _bump2 = _a[1];
                    return [4 /*yield*/, program.methods.stakeTokens(new anchor_1.BN(amount), new anchor_1.BN(lockupOption))
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
                            .signers([])
                            .rpc()];
                case 5:
                    _b.sent();
                    triggerUpdate();
                    console.log("Tokens staked successfully.");
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _b.sent();
                    console.error("Error staking tokens:", error_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var handleUnstake = function () { return __awaiter(void 0, void 0, void 0, function () {
        var program, owner, vaultData_2, tokenMintAddress, stakingData_2, stakingAccountAddress, userTokenAccount, _a, vaultTokenAccount, _bump2, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 6, , 7]);
                    program = new anchor_1.Program(spl_vault_idl_json_1.default, config_1.programId, provider);
                    owner = provider.wallet.publicKey;
                    return [4 /*yield*/, (0, helpers_1.fetchVaultData)(vault, connection)];
                case 1:
                    vaultData_2 = _b.sent();
                    tokenMintAddress = new web3_js_1.PublicKey(vaultData_2.AllowedToken);
                    return [4 /*yield*/, (0, helpers_1.fetchStakingAccounts)(config_1.programId, owner, vault, connection)];
                case 2:
                    stakingData_2 = _b.sent();
                    stakingAccountAddress = new web3_js_1.PublicKey(stakingData_2[0].accountId);
                    return [4 /*yield*/, (0, spl_token_1.getAssociatedTokenAddress)(tokenMintAddress, provider.wallet.publicKey)];
                case 3:
                    userTokenAccount = _b.sent();
                    return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddressSync([
                            vault.toBuffer(), Buffer.from("vault_tokens")
                        ], config_1.programId)];
                case 4:
                    _a = _b.sent(), vaultTokenAccount = _a[0], _bump2 = _a[1];
                    return [4 /*yield*/, program.methods.withdrawTokens(new anchor_1.BN(amount))
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
                            .signers([])
                            .rpc()];
                case 5:
                    _b.sent();
                    console.log("Tokens unstaked successfully.");
                    return [3 /*break*/, 7];
                case 6:
                    error_2 = _b.sent();
                    console.error("Error unstaking tokens:", error_2);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var lockupOptions = vaultData ? [
        { value: 1, label: "".concat(Math.floor(vaultData.lockupDuration1 / 60 / 60 / 24), " Days ").concat(vaultData.lockupMultiplier1 / 100, "X") },
        { value: 2, label: "".concat(Math.floor(vaultData.lockupDuration2 / 60 / 60 / 24), " Days ").concat(vaultData.lockupMultiplier2 / 100, "X") },
        { value: 3, label: "".concat(Math.floor(vaultData.lockupDuration3 / 60 / 60 / 24), " Days ").concat(vaultData.lockupMultiplier3 / 100, "X") },
        { value: 4, label: "".concat(Math.floor(vaultData.lockupDuration4 / 60 / 60 / 24), " Days ").concat(vaultData.lockupMultiplier4 / 100, "X") }
    ] : [];
    if (stakingData) {
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("div", { className: 'stakeTokenContainer' },
                react_1.default.createElement("div", { className: 'tokenInputContainer' },
                    react_1.default.createElement("input", { type: "number", placeholder: "Amount to Stake/Unstake", onChange: function (e) { return setAmount(new anchor_1.BN(Math.floor(Number(e.target.value) * decimals))); } }),
                    react_1.default.createElement("select", { onChange: function (e) { return setLockupOption(Number(e.target.value)); } }, lockupOptions.map(function (option, index) { return (react_1.default.createElement("option", { key: index, value: option.value }, option.label)); }))),
                react_1.default.createElement("div", { className: 'stakeButtons' },
                    react_1.default.createElement("button", { className: 'stakeButton', onClick: handleUnstake }, "Unstake Tokens"),
                    react_1.default.createElement("button", { className: 'stakeButton', onClick: handleStake }, "Stake Tokens")),
                react_1.default.createElement("h1", null,
                    "Staked: ",
                    amountStaked),
                react_1.default.createElement("h1", null,
                    "Unlocks in: ",
                    unlockTime))));
    }
    else {
        return (react_1.default.createElement(initAccount_1.InitializeAccountButton, { provider: provider, vault: vault }));
    }
};
exports.TokensStaking = TokensStaking;
