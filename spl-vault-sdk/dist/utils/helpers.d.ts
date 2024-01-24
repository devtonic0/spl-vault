export declare function fetchStakingAccounts(programId: any, owner: any, vault: any, connection: any): Promise<any>;
export declare function fetchVaultData(vaultAddress: any, connection: any): Promise<{
    owner: string;
    AllowedToken: string;
    vaultTokenAccount: string;
    lockupDuration1: any;
    lockupDuration2: any;
    lockupDuration3: any;
    lockupDuration4: any;
    lockupMultiplier1: any;
    lockupMultiplier2: any;
    lockupMultiplier3: any;
    lockupMultiplier4: any;
    rewards: any[];
}>;
export declare function countdownToUnlock(unlockTimestamp: any): string;
