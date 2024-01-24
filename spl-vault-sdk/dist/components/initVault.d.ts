import { PublicKey } from '@solana/web3.js';
import React from 'react';
import { AnchorProvider } from '@project-serum/anchor';
export declare function initializeVault(provider: AnchorProvider, allowedToken: PublicKey, lockupDurationOptions: number[], lockupMultiplierOptions: number[]): Promise<void>;
export declare const InitializeVaultButton: React.FC<{
    provider: AnchorProvider;
}>;
