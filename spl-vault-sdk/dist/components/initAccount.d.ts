import { PublicKey } from '@solana/web3.js';
import { AnchorProvider } from '@project-serum/anchor';
import React from 'react';
export declare function initializeAccount(provider: AnchorProvider, vaultPublicKey: PublicKey): Promise<void>;
export declare const InitializeAccountButton: React.FC<{
    provider: AnchorProvider;
    vault: PublicKey;
}>;
