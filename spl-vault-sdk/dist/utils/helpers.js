"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.countdownToUnlock = exports.fetchVaultData = exports.fetchStakingAccounts = void 0;
var web3_js_1 = require("@solana/web3.js");
var anchor_1 = require("@project-serum/anchor");
function fetchStakingAccounts(programId, owner, vault, connection) {
    return __awaiter(this, void 0, void 0, function () {
        var accounts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connection.getProgramAccounts(new web3_js_1.PublicKey(programId), {
                        filters: [
                            {
                                memcmp: {
                                    offset: 8,
                                    bytes: owner.toBase58()
                                }
                            },
                            {
                                memcmp: {
                                    offset: 40,
                                    bytes: vault.toBase58()
                                }
                            }
                        ]
                    })];
                case 1:
                    accounts = _a.sent();
                    return [2 /*return*/, accounts.map(function (_a) {
                            var pubkey = _a.pubkey, account = _a.account;
                            var stakingAccountInfo = deserializeStakingAccount(account.data);
                            return __assign({ accountId: pubkey.toString() }, stakingAccountInfo);
                        })];
            }
        });
    });
}
exports.fetchStakingAccounts = fetchStakingAccounts;
function fetchVaultData(vaultAddress, connection) {
    return __awaiter(this, void 0, void 0, function () {
        var accountInfo, vaultData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connection.getAccountInfo(new web3_js_1.PublicKey(vaultAddress))];
                case 1:
                    accountInfo = _a.sent();
                    if (accountInfo === null) {
                        throw new Error("Vault account not found");
                    }
                    return [4 /*yield*/, deserializeVaultAccount(accountInfo.data)];
                case 2:
                    vaultData = _a.sent();
                    return [2 /*return*/, vaultData];
            }
        });
    });
}
exports.fetchVaultData = fetchVaultData;
function deserializeStakingAccount(data) {
    var offset = 8;
    var owner = new web3_js_1.PublicKey(data.slice(offset, offset + 32));
    offset += 32;
    var vault = new web3_js_1.PublicKey(data.slice(offset, offset + 32));
    offset += 32;
    var stakedAmount = new anchor_1.BN(data.slice(offset, offset + 8), 'le', 'bn');
    offset += 8;
    var unlockTimestamp = new anchor_1.BN(data.slice(offset, offset + 8), 'le', 'bn');
    offset += 8;
    var lockupOption = new anchor_1.BN(data.slice(offset, offset + 1), 'le', 'bn');
    offset += 1;
    var timestamp = new anchor_1.BN(data.slice(offset, offset + 8), 'le', 'bn');
    offset += 8;
    var rewardsLength = new anchor_1.BN(data.slice(offset, offset + 4), 'le', 'bn').toNumber();
    offset += 4;
    var rewards = [];
    for (var i = 0; i < rewardsLength; i++) {
        var rewardTokenMint = new web3_js_1.PublicKey(data.slice(offset, offset + 32));
        offset += 32;
        var amount = new anchor_1.BN(data.slice(offset, offset + 8), 'le', 'bn');
        offset += 8;
        rewards.push({
            rewardTokenMint: rewardTokenMint.toString(),
            amount: amount.toString(10)
        });
    }
    return {
        owner: owner.toString(),
        vault: vault.toString(),
        stakedAmount: stakedAmount.toString(10),
        unlockTimestamp: unlockTimestamp.toString(10),
        lockupOption: lockupOption.toString(10),
        timestamp: timestamp.toString(),
        rewards: rewards
    };
}
function deserializeVaultAccount(data) {
    var offset = 8;
    var owner = new web3_js_1.PublicKey(data.slice(offset, offset + 32));
    offset += 32;
    var allowedToken = new web3_js_1.PublicKey(data.slice(offset, offset + 32));
    offset += 32;
    var vaultTokenAccount = new web3_js_1.PublicKey(data.slice(offset, offset + 32));
    offset += 32;
    var lockupDuration1 = new anchor_1.BN(data.slice(offset, offset + 8), 'le', 'bn');
    offset += 8;
    var lockupDuration2 = new anchor_1.BN(data.slice(offset, offset + 8), 'le', 'bn');
    offset += 8;
    var lockupDuration3 = new anchor_1.BN(data.slice(offset, offset + 8), 'le', 'bn');
    offset += 8;
    var lockupDuration4 = new anchor_1.BN(data.slice(offset, offset + 8), 'le', 'bn');
    offset += 8;
    var lockupMultiplier1 = new anchor_1.BN(data.slice(offset, offset + 8), 'le', 'bn');
    offset += 8;
    var lockupMultiplier2 = new anchor_1.BN(data.slice(offset, offset + 8), 'le', 'bn');
    offset += 8;
    var lockupMultiplier3 = new anchor_1.BN(data.slice(offset, offset + 8), 'le', 'bn');
    offset += 8;
    var lockupMultiplier4 = new anchor_1.BN(data.slice(offset, offset + 8), 'le', 'bn');
    offset += 40;
    var rewardsLength = new anchor_1.BN(data.slice(offset, offset + 4), 'le', 'bn').toNumber();
    offset += 4;
    var rewards = [];
    for (var i = 0; i < rewardsLength; i++) {
        var rewardTokenMint = new web3_js_1.PublicKey(data.slice(offset, offset + 32));
        offset += 32;
        var schedule = new anchor_1.BN(data.slice(offset, offset + 8), 'le', 'bn');
        offset += 8;
        var timestamp = new anchor_1.BN(data.slice(offset, offset + 8), 'le', 'bn');
        offset += 8;
        rewards.push({
            rewardTokenMint: rewardTokenMint.toString(),
            schedule: schedule.toString(10),
            timestamp: timestamp,
        });
    }
    return {
        owner: owner.toString(),
        AllowedToken: allowedToken.toString(),
        vaultTokenAccount: vaultTokenAccount.toString(),
        lockupDuration1: lockupDuration1.toString(10),
        lockupDuration2: lockupDuration2.toString(10),
        lockupDuration3: lockupDuration3.toString(10),
        lockupDuration4: lockupDuration4.toString(10),
        lockupMultiplier1: lockupMultiplier1.toString(10),
        lockupMultiplier2: lockupMultiplier2.toString(10),
        lockupMultiplier3: lockupMultiplier3.toString(10),
        lockupMultiplier4: lockupMultiplier4.toString(10),
        rewards: rewards
    };
}
function countdownToUnlock(unlockTimestamp) {
    var unlockDate = new Date(unlockTimestamp * 1000);
    var currentDate = new Date();
    var timeDiff = Number(unlockDate) - Number(currentDate);
    if (timeDiff <= 0) {
        return "00:00:00:00:00";
    }
    var days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    return "".concat(days.toString().padStart(2, '0'), ":").concat(hours.toString().padStart(2, '0'), ":").concat(minutes.toString().padStart(2, '0'), ":").concat(seconds.toString().padStart(2, '0'));
}
exports.countdownToUnlock = countdownToUnlock;
