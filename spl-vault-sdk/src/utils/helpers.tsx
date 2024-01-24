import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { BN } from "@project-serum/anchor";




export async function fetchStakingAccounts(programId, owner, vault, connection) {
    const accounts = await connection.getProgramAccounts(
        new PublicKey(programId),
        {
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
        }
    );

    return accounts.map(({ pubkey, account }) => {
        const stakingAccountInfo = deserializeStakingAccount(account.data);
        return {
            accountId: pubkey.toString(),
            ...stakingAccountInfo
        };
    });
}




export async function fetchVaultData(vaultAddress, connection) {
    const accountInfo = await connection.getAccountInfo(new PublicKey(vaultAddress));
    if (accountInfo === null) {
        throw new Error("Vault account not found");
    }

    const vaultData = await deserializeVaultAccount(accountInfo.data);
    return vaultData;
}




function deserializeStakingAccount(data) {
    let offset = 8;
    const owner = new PublicKey(data.slice(offset, offset + 32));
    offset += 32;
    const vault = new PublicKey(data.slice(offset, offset + 32));
    offset += 32;
    const stakedAmount = new BN(data.slice(offset, offset + 8), 'le', 'bn');
    offset += 8;
    const unlockTimestamp = new BN(data.slice(offset, offset + 8), 'le', 'bn');
    offset += 8;
    const lockupOption = new BN(data.slice(offset, offset + 1), 'le', 'bn');
    offset += 1;
    const timestamp = new BN(data.slice(offset, offset + 8), 'le', 'bn');
    offset += 8
    const rewardsLength = new BN(data.slice(offset, offset + 4), 'le', 'bn').toNumber();
    offset += 4;
    const rewards = [];
    for (let i = 0; i < rewardsLength; i++) {
    const rewardTokenMint = new PublicKey(data.slice(offset, offset + 32));
    offset += 32;
    const amount = new BN(data.slice(offset, offset + 8), 'le', 'bn');
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
    rewards
};
}

function deserializeVaultAccount(data) {
    let offset = 8;
    const owner = new PublicKey(data.slice(offset, offset + 32));
    offset += 32;
    const allowedToken = new PublicKey(data.slice(offset, offset + 32));
    offset += 32;
    const vaultTokenAccount = new PublicKey(data.slice(offset, offset + 32));
    offset += 32;
    const lockupDuration1 = new BN(data.slice(offset, offset + 8), 'le', 'bn');
    offset += 8;
    const lockupDuration2 = new BN(data.slice(offset, offset + 8), 'le', 'bn');
    offset += 8;
    const lockupDuration3 = new BN(data.slice(offset, offset + 8), 'le', 'bn');
    offset += 8;
    const lockupDuration4 = new BN(data.slice(offset, offset + 8), 'le', 'bn');
    offset += 8;
    const lockupMultiplier1 = new BN(data.slice(offset, offset + 8), 'le', 'bn');
    offset += 8;
    const lockupMultiplier2 = new BN(data.slice(offset, offset + 8), 'le', 'bn');
    offset += 8;
    const lockupMultiplier3 = new BN(data.slice(offset, offset + 8), 'le', 'bn');
    offset += 8;
    const lockupMultiplier4 = new BN(data.slice(offset, offset + 8), 'le', 'bn');
    offset += 40;
    const rewardsLength = new BN(data.slice(offset, offset + 4), 'le', 'bn').toNumber();
    offset += 4;
    const rewards = [];
    for (let i = 0; i < rewardsLength; i++) {
    const rewardTokenMint = new PublicKey(data.slice(offset, offset + 32));
    offset += 32;
    const schedule = new BN(data.slice(offset, offset + 8), 'le', 'bn');
    offset += 8;
    const timestamp = new BN(data.slice(offset, offset + 8), 'le', 'bn');
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
        rewards
    };
}

export function countdownToUnlock(unlockTimestamp) {
    const unlockDate = new Date(unlockTimestamp * 1000); 
    const currentDate = new Date();
    const timeDiff = Number(unlockDate) - Number(currentDate);

    if (timeDiff <= 0) {
        return "00:00:00:00:00"; 
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}






