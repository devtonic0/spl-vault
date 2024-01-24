import React from 'react';
import { PublicKey } from '@solana/web3.js';
import { AnchorProvider } from '@project-serum/anchor';
export declare const CreateTimedRewards: React.FC<{
    provider: AnchorProvider;
    vault: PublicKey;
}>;
