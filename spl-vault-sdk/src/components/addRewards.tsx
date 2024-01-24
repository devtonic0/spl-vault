import React, { useState } from 'react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { AnchorProvider, Program, Idl, BN } from '@project-serum/anchor';
import idl from '../../public/spl-vault-idl.json';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, getMint } from '@solana/spl-token';
import { feeAccount, programId } from '../utils/config';



export const DepositRewards: React.FC<{ provider: AnchorProvider, vault: PublicKey }> = ({ provider, vault }) => {
    const [tokenMint, setTokenMint] = useState('');
    const [amount, setAmount] = useState(0);


            const handleDepositRewards = async () => {
                try {
                    const program = new Program(idl as Idl, programId, provider);
                    const tokenMintAddress = new PublicKey(tokenMint);
                    const owner = provider.wallet.publicKey;
                    const mintInfo = await getMint(provider.connection, new PublicKey(tokenMint));
                    const decimals = mintInfo.decimals;
                    const decimalsAmount = amount*Math.pow(10, decimals)

                    const rewardTokenAccount = await getAssociatedTokenAddress(tokenMintAddress, provider.wallet.publicKey);
            
                    const [vaultTokenAccount, _bump2] = await PublicKey.findProgramAddressSync(
                        [
                         Buffer.from("spl_rewards"), vault.toBuffer(), tokenMintAddress.toBuffer()
                        ],
                        programId
                    );
                    
                    
            
                    await program.methods.addRewards(new BN(decimalsAmount))
                        .accounts({
                            vault: vault,
                            rewardTokenAccount: rewardTokenAccount,
                            vaultRewardTokenAccount: vaultTokenAccount,
                            rewardTokenMint: tokenMintAddress,
                            tokenProgram: TOKEN_PROGRAM_ID,
                            owner: owner,
                            feeAccount: feeAccount,
                            systemProgram: SystemProgram.programId,
                        })
                        .signers([])
                        .rpc();
            
                    console.log("Rewards deposited successfully.");
                } catch (error) {
                    console.error("Error depositing rewards:", error);
                }
            };

    return (
        <div className="depositRewardsContainer">
            <h1>Add Rewards</h1>
            <input 
                type="text" 
                placeholder="Token Mint Address" 
                value={tokenMint} 
                onChange={(e) => setTokenMint(e.target.value)} 
            />
            <p>Amount</p>
            <input 
                type="number" 
                placeholder="Amount to Deposit" 
                value={amount} 
                onChange={(e) => setAmount(Number(e.target.value))} 
            />
          

            <button className="depositButton" onClick={handleDepositRewards}>
                Deposit Rewards
            </button>
        </div>
    );
};
