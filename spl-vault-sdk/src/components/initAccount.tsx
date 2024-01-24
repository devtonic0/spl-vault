import { PublicKey, SystemProgram } from '@solana/web3.js';
import { Program, web3, AnchorProvider, Idl } from '@project-serum/anchor';
import idl from '../../public/spl-vault-idl.json';
import React from 'react';
import { feeAccount, programId } from '../utils/config';


export async function initializeAccount(
    provider: AnchorProvider,
    vaultPublicKey: PublicKey
): Promise<void> {
    const program = new Program(idl as Idl, programId, provider);
    const stakingAccount = web3.Keypair.generate();

    try {
        await program.methods.initializeAccount(
          vaultPublicKey
        )
            .accounts({
                stakingAccount: stakingAccount.publicKey,
                owner: provider.wallet.publicKey,
                vault: vaultPublicKey,
                feeAccount: feeAccount,
                systemProgram: SystemProgram.programId,
            })
            .signers([stakingAccount])
            .rpc();
        console.log("Account initialized successfully.");
    } catch (error) {
        console.error("Error initializing account:", error);
        throw error; 
    }
}


export const InitializeAccountButton: React.FC<{provider: AnchorProvider, vault: PublicKey}> = ({ provider, vault }) => {
    const handleClick = async () => {
        try {
            console.log("Initializing account for farm:", vault.toString());
            await initializeAccount(provider, vault);
        } catch (error) {
            console.error("Error in account initialization button:", error);
            
        }
    };

    return (
        <div className='initAccount'>
        <h1>Create Account</h1>
        <button className='initAccountButton' onClick={handleClick}>
            Initialize Account
        </button>
        </div>
    );
};
