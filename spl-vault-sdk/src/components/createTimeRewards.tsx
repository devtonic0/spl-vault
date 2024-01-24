import React, { useState } from 'react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { AnchorProvider, Program, Idl } from '@project-serum/anchor';
import idl from '../../public/spl-vault-idl.json';
import BN from 'bn.js';
import { feeAccount, programId } from '../utils/config';
import { getMint } from '@solana/spl-token';



export const CreateTimedRewards: React.FC<{ provider: AnchorProvider, vault: PublicKey }> = ({ provider, vault }) => {
    const [tokenMint, setTokenMint] = useState('');
    const [schedule, setSchedule] = useState(0);
    const [decimals, setDecimals] = useState(0);

    const handleAddTimedRewards = async () => {
        try {
            const program = new Program(idl as Idl, programId, provider);
            const tokenMintAddress = new PublicKey(tokenMint);
            const mintInfo = await getMint(provider.connection, new PublicKey(tokenMintAddress));
                const rewardDecimals = mintInfo.decimals;

            await program.methods.addTimedRewards(new BN(Math.pow(10, rewardDecimals) * schedule))
                .accounts({
                    vault: vault,
                    rewardTokenMint: tokenMintAddress,
                    vaultOwner: provider.wallet.publicKey,
                    feeAccount: feeAccount,
                    systemProgram: SystemProgram.programId,
                })
                .signers([])
                .rpc();

            console.log("Timed rewards added successfully.");
        } catch (error) {
            console.error("Error adding timed rewards:", error);
        }
    };

    return (
        <div className='addTimedRewards'>
            <h2>Add Timed Rewards</h2>
            <input
                type="text"
                placeholder="Token Mint Address"
                value={tokenMint}
                onChange={(e) => setTokenMint(e.target.value)}
            />
            <input
                type="number"
                placeholder="Schedule"
                value={schedule}
                onChange={(e) => setSchedule(Number(e.target.value))}
            />

            <button onClick={handleAddTimedRewards}>Add Timed Rewards</button>
        </div>
    );
};
