import React, { useEffect, useState } from 'react';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { AnchorProvider, Program, Idl, BN } from '@project-serum/anchor';
import idl from '../../public/spl-vault-idl.json';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, getMint } from '@solana/spl-token';
import { fetchStakingAccounts, fetchVaultData, countdownToUnlock } from '../utils/helpers';
import { feeAccount, programId } from '../utils/config';
import { InitializeAccountButton } from './initAccount';

export const TokensStaking: React.FC<{
    provider: AnchorProvider,
    vault: PublicKey,
    connection: Connection
}> = ({ provider, vault, connection }) => {
    
    const [amount, setAmount] = useState(0);
    const [lockupOption, setLockupOption] = useState(1); 
    const [stakingData, setStakingData] = useState(null);
    const [vaultData, setVaultData] = useState(null);
    const [decimals, setDecimals] = useState(0); 
    const amountStaked = Number(stakingData?.stakedAmount)/decimals || 0
    const unlockTimestamp = stakingData?.unlockTimestamp || 0
    const unlockTime = countdownToUnlock(unlockTimestamp); 
    const [updateTrigger, setUpdateTrigger] = useState(0);
    const [countdown, setCountdown] = useState(""); 

    useEffect(() => {
      
        const updateCountdown = () => {
            if (stakingData?.unlockTimestamp) {
                setCountdown(countdownToUnlock(stakingData.unlockTimestamp));
            }
        };
        const intervalId = setInterval(updateCountdown, 1000);
        return () => clearInterval(intervalId);
    }, [provider, stakingData?.unlockTimestamp]);

    useEffect(() => {
        if (!provider) {

            return;
        }
    
        const fetchData = async () => {
            const owner = provider.wallet.publicKey
            const vaultData = await fetchVaultData(vault, connection);
            const mintInfo = await getMint(provider.connection, new PublicKey(vaultData.AllowedToken));
            setDecimals(Math.pow(10, Number(mintInfo.decimals)))
            const stakingData = await fetchStakingAccounts(programId, owner, vault, connection);
            if (stakingData.length > 0) {
                setStakingData(stakingData[0]);
                setVaultData(vaultData);
            }
        };
    
        fetchData().catch(console.error);
    }, [provider, updateTrigger]);

    const triggerUpdate = () => {
        setUpdateTrigger(prev => prev + 1);
      };
  

    const handleStake = async () => {
        try {
            const program = new Program(idl as Idl, programId, provider);
            const owner = provider.wallet.publicKey
            const vaultData = await fetchVaultData(vault, connection)
            const tokenMintAddress = new PublicKey(vaultData.AllowedToken)
            const stakingData = await fetchStakingAccounts(programId, owner, vault, connection)
            const stakingAccountAddress = new PublicKey(stakingData[0].accountId)
            const userTokenAccount = await getAssociatedTokenAddress(tokenMintAddress, provider.wallet.publicKey);
            const [vaultTokenAccount, _bump2] = await PublicKey.findProgramAddressSync(
                [
                    vault.toBuffer(), Buffer.from("vault_tokens")
                ],
              
                programId
            );
            
    await program.methods.stakeTokens(new BN(amount), new BN(lockupOption))
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
    .signers([]) 
    .rpc();
            triggerUpdate();
            console.log("Tokens staked successfully.");
        } catch (error) {
            console.error("Error staking tokens:", error);
        }
       
    };

    const handleUnstake = async () => {
        try {
            const program = new Program(idl as Idl, programId, provider);
            const owner = provider.wallet.publicKey
            const vaultData = await fetchVaultData(vault, connection)
            const tokenMintAddress = new PublicKey(vaultData.AllowedToken)
            const stakingData = await fetchStakingAccounts(programId, owner, vault, connection)
            const stakingAccountAddress = new PublicKey(stakingData[0].accountId)
            const userTokenAccount = await getAssociatedTokenAddress(tokenMintAddress, provider.wallet.publicKey);
            const [vaultTokenAccount, _bump2] = await PublicKey.findProgramAddressSync(
                [
                    vault.toBuffer(), Buffer.from("vault_tokens")
                ],
                programId
            );
            
    await program.methods.withdrawTokens(new BN(amount))
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
    .signers([]) 
    .rpc();
   
            console.log("Tokens unstaked successfully.");
        } catch (error) {
            console.error("Error unstaking tokens:", error);
        }
       
    };

    const lockupOptions = vaultData ? [
        { value: 1, label: `${Math.floor(vaultData.lockupDuration1 / 60 / 60 / 24)} Days ${vaultData.lockupMultiplier1 / 100}X`  },
        { value: 2, label: `${Math.floor(vaultData.lockupDuration2 / 60 / 60 / 24)} Days ${vaultData.lockupMultiplier2 / 100}X`  },
        { value: 3, label: `${Math.floor(vaultData.lockupDuration3 / 60 / 60 / 24)} Days ${vaultData.lockupMultiplier3 / 100}X`  },
        { value: 4, label: `${Math.floor(vaultData.lockupDuration4 / 60 / 60 / 24)} Days ${vaultData.lockupMultiplier4 / 100}X`  }
    ] : [];
if (stakingData) {
    return (
        <div>
          <div className='stakeTokenContainer'>
            <div className='tokenInputContainer'>
            <input type="number" placeholder="Amount to Stake/Unstake" onChange={(e) => setAmount(new BN(Math.floor(Number(e.target.value) * decimals)))} />
            <select onChange={(e) => setLockupOption(Number(e.target.value))}>
                        {lockupOptions.map((option, index) => (
                            <option key={index} value={option.value}>{option.label}</option>
                        ))}
                    </select>
            </div>
            <div className='stakeButtons'>
            <button className='stakeButton' onClick={handleUnstake}>
                Unstake Tokens
            </button>      
            <button className='stakeButton' onClick={handleStake}>
                Stake Tokens
            </button>
            </div>
            <h1>Staked: {amountStaked}</h1>
            <h1>Unlocks in: {unlockTime}</h1>
        </div>
        </div>
    );
  } else {
    return (
    <InitializeAccountButton provider={provider} vault={vault}/> 
    );
  }
};
