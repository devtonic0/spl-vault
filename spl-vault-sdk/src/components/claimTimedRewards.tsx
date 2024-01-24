    import React, { useEffect, useState } from 'react';
    import { fetchStakingAccounts, fetchVaultData } from '../utils/helpers';
    import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
    import { AnchorProvider, Program, Idl } from '@project-serum/anchor';
    import idl from '../../public/spl-vault-idl.json';
    import { TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, getMint } from '@solana/spl-token';
    import { SECONDS_IN_YEAR, feeAccount, programId } from '../utils/config';
    
  
    
    export const TimedRewards: React.FC<{ provider: AnchorProvider, vault: PublicKey, connection: Connection }> = ({ provider, vault, connection }) => {
        const [stakingData, setStakingData] = useState(null);
        const [vaultData, setVaultData] = useState(null);
        const [rewardsList, setRewardsList] = useState([]);
        const [selectedRewardTokenMint, setSelectedRewardTokenMint] = useState('');
        const [stakingAccountAddress, setStakingAccountAddress] = useState(null)
        const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
        const [refreshTrigger, setRefreshTrigger] = useState(0);

        const triggerUpdate = () => {
            setRefreshTrigger(prev => prev + 1); 
          };
    
        
        const handleRewardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            const index = e.target.selectedIndex - 1;
            setSelectedRewardTokenMint(e.target.value);
            setSelectedIndex(index >= 0 ? index : null);
        };

        useEffect(() => {
            const fetchData = async () => {
                const owner = provider.wallet.publicKey;
                const vaultData = await fetchVaultData(vault, connection);
                const stakingData = await fetchStakingAccounts(programId, owner, vault, connection);
                if (stakingData.length > 0) {
                    setStakingData(stakingData[0]);
                    setVaultData(vaultData);
                    calculateRewards(vaultData, stakingData[0]);
                    setStakingAccountAddress(new PublicKey(new PublicKey(stakingData[0]?.accountId)))
                }
            };
            fetchData().catch(console.error);
        }, [provider, vault, refreshTrigger]);

        useEffect(() => {
      
            const updateRewards = () => {
                if (stakingData && vaultData) {
                    calculateRewards(vaultData, stakingData);
                }
            };
            const intervalId = setInterval(updateRewards, 1000);
            return () => clearInterval(intervalId);
        }, [stakingData, vaultData]);

        const calculateRewards = async (vaultData, stakingData) => {
            let rewards = [];
            
            
            for (const reward of vaultData.rewards) {
                let timestamp = stakingData.timestamp;
            if (timestamp < reward.timestamp) {
                timestamp = reward.timestamp
            }
            const currentTime = Math.floor(Date.now() / 1000); 
            const timeElapsed = currentTime - timestamp;
                const mintInfo = await getMint(provider.connection, new PublicKey(reward.rewardTokenMint));
                const rewardDecimals = mintInfo.decimals;
                const stakingInfo = await getMint(provider.connection, new PublicKey(vaultData.AllowedToken));
                const stakingDecimals = stakingInfo.decimals;
                const scaledSchedule = reward.schedule * 1000000000;
                const rewardPerSecond = scaledSchedule / SECONDS_IN_YEAR;
                let userReward = (rewardPerSecond * timeElapsed * stakingData.stakedAmount / Math.pow(10, stakingDecimals)) / Math.pow(10, rewardDecimals) / 1000000000;
                const multiplier = getMultiplier(stakingData.lockupOption, vaultData); 
                userReward = userReward * multiplier / 100;
                let decimalFactor = rewardDecimals;
                if (decimalFactor < 2) {
                    decimalFactor = 2
                }
                rewards.push({
                    tokenMint: reward.rewardTokenMint,
                    amount: userReward.toFixed(decimalFactor)
                });
            }
        
            setRewardsList(rewards);
        };
        
        const getMultiplier = (lockupOption, vaultData) => {
            const option = parseInt(lockupOption, 10); 
            switch (option) {
                case 1: return vaultData.lockupMultiplier1;
                case 2: return vaultData.lockupMultiplier2;
                case 3: return vaultData.lockupMultiplier3;
                case 4: return vaultData.lockupMultiplier4;
                default: return 0;
            }
        };
        
        
    const handleWithdrawTimedRewards = async () => {
        try {
         
            
            const program = new Program(idl as Idl, programId, provider);
            const tokenMintAddress = new PublicKey(selectedRewardTokenMint);
            const userTokenAccount = await getAssociatedTokenAddress(tokenMintAddress, provider.wallet.publicKey);
            const stakingMint = vaultData.AllowedToken;
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
      
            await program.methods.withdrawTimedRewards(selectedIndex)
                .accounts({
                    stakingAccount: stakingAccountAddress,
                    userTokenAccount: userTokenAccount,
                    vaultTokenAccount: vaultTokenAccount,
                    vault: vault,
                    tokenMint: tokenMintAddress,
                    stakingMint: stakingMint,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    owner: provider.wallet.publicKey,
                    feeAccount: feeAccount,
                    systemProgram: SystemProgram.programId,
                })
                .preInstructions([...instructions])
                .signers([])
                .rpc();
            triggerUpdate();
            console.log("Timed rewards withdrawn successfully.");
        } catch (error) {
            console.error("Error withdrawing timed rewards:", error);
        }
    };


    return (
        <div className='timedRewards'>
            <h2>Timed Rewards</h2>
            <select onChange={handleRewardChange}>
                <option value="">Select a reward</option>
                {rewardsList.map((reward, index) => (
                    <option key={index} value={reward.tokenMint}>
                        {reward.tokenMint} - {reward.amount}
                    </option>
                ))}
            </select>
            <button onClick={handleWithdrawTimedRewards}>Withdraw Rewards</button>
        </div>
    );
};