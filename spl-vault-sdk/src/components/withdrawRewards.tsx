import React, { useEffect, useState } from 'react';
import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { AnchorProvider, Program, Idl, web3, BN } from '@project-serum/anchor';
import idl from '../../public/spl-vault-idl.json';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, getMint } from '@solana/spl-token';
import { fetchStakingAccounts, fetchVaultData } from '../utils/helpers';
import { feeAccount, programId } from '../utils/config';


export const WithdrawRewards: React.FC<{ provider: AnchorProvider, vault: PublicKey, connection: Connection }> = ({ provider, vault, connection }) => {
    const [stakingData, setStakingData] = useState(null);
    const [selectedReward, setSelectedReward] = useState(null);
    const [rewardDecimals, setRewardDecimals] = useState({});
    

    useEffect(() => {
        if (!provider) {
            return;
        }

        const fetchData = async () => {
            const owner = provider.wallet.publicKey;
            const vaultData = await fetchVaultData(vault, connection);
            const stakingData = await fetchStakingAccounts(programId, owner, vault, connection);
            if (stakingData.length > 0) {
                setStakingData(stakingData[0]);
                const vaultData = await fetchVaultData(vault, connection)
                fetchRewardDecimals(stakingData[0].rewards);
            }
        };

        fetchData().catch(console.error);
    }, [vault]);

    const fetchRewardDecimals = async (rewards) => {
        const decimals = {};
        for (const reward of rewards) {
            const mintInfo = await getMint(provider.connection, new PublicKey(reward.rewardTokenMint));
            decimals[reward.rewardTokenMint] = mintInfo.decimals;
        }
       
        setRewardDecimals(decimals);
    };
    const formatRewardAmount = (reward) => {
        const decimals = rewardDecimals[reward.rewardTokenMint] || 0;
        return (reward.amount / Math.pow(10, decimals)).toFixed(4);
    };

    const handleWithdraw = async () => {
        try {
            const program = new Program(idl as Idl, programId, provider);
            const owner = provider.wallet.publicKey
            const tokenMintAddress = new PublicKey(selectedReward.rewardTokenMint)
            const stakingData = await fetchStakingAccounts(programId, owner, vault, connection)
            const stakingAccountAddress = new PublicKey(stakingData[0].accountId)
            const userTokenAccount = await getAssociatedTokenAddress(tokenMintAddress, provider.wallet.publicKey);
            let instructions = []
            if (userTokenAccount === null) {
                instructions.push(
                    createAssociatedTokenAccountInstruction(provider.wallet.publicKey, userTokenAccount, provider.wallet.publicKey, tokenMintAddress)
                )
            }
                    const [vaultTokenAccount, _bump2] = await PublicKey.findProgramAddressSync(
                        [
                         Buffer.from("spl_rewards"), vault.toBuffer(), tokenMintAddress.toBuffer()
                        ],
                        programId
                    );
            
    await program.methods.withdrawRewards()
    .accounts({
        stakingAccount: stakingAccountAddress, 
        userTokenAccount: userTokenAccount,
        vaultTokenAccount: vaultTokenAccount, 
        vault: vault,
        tokenMint: tokenMintAddress, 
        tokenProgram: TOKEN_PROGRAM_ID, 
        owner: provider.wallet.publicKey,
        feeAccount: feeAccount,
        systemProgram: SystemProgram.programId,
    })
    .preInstructions([...instructions])
    .signers([]) 
    .rpc();
   
            console.log("rewards claimed successfully.");
        } catch (error) {
            console.error("Error unstaking tokens:", error);
        }
       
    };

    
    return (
        <div className='rewardsContainer'>
            <h2>Withdraw Rewards</h2>
            {stakingData && stakingData.rewards.length > 0 ? (
                <select onChange={(e) => setSelectedReward(stakingData.rewards.find(reward => reward.rewardTokenMint === e.target.value))}>
                <option value="">Select Reward</option>
                {stakingData.rewards.map((reward, index) => (
                        <option key={index} value={reward.rewardTokenMint}>
                            {reward.rewardTokenMint} - {formatRewardAmount(reward)}
                        </option>
                    ))}
                </select>
            ) : (
                <p>No rewards available</p>
            )}
            <button onClick={handleWithdraw}>Withdraw Rewards</button>
        </div>
    );
};
