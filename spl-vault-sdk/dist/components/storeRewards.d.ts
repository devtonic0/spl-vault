import React from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorProvider } from '@project-serum/anchor';
export declare const StoreRewards: React.FC<{
    provider: AnchorProvider;
    vault: PublicKey;
    connection: Connection;
}>;
