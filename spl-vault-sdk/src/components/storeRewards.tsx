import React, { useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, Idl } from '@project-serum/anchor';
import idl from '../../public/spl-vault-idl.json';
import { fetchStakingAccounts, fetchVaultData } from '../utils/helpers';

const programId = new PublicKey("vaULtyRDJpUm1BfD7SzUYJ4GhmUE3FPEstRZSUquBxf");

export const StoreRewards: React.FC<{
  provider: AnchorProvider,
  vault: PublicKey,
  connection: Connection

}> = ({ provider, vault, connection }) => {
    const [stakingData, setStakingData] = useState(null);
    const [vaultData, setVaultData] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const triggerUpdate = () => {
        setRefreshTrigger(prev => prev + 1); 
      };

    useEffect(() => {
    
        const fetchData = async () => {
            const owner = provider.wallet.publicKey
            const vaultData = await fetchVaultData(vault, connection);
            const stakingData = await fetchStakingAccounts(programId, owner, vault, connection);
            if (stakingData.length > 0) {
                setStakingData(stakingData[0]);
                setVaultData(vaultData);
            }
        };
    
        fetchData().catch(console.error);
    }, [provider, vault, refreshTrigger]);


    useEffect(() => {
        const storeRewards = async () => {
          if (stakingData) {
            const timestampMilliseconds = stakingData.timestamp * 1000;
            const currentTimeMilliseconds = Date.now();
            const tenMinutesInMilliseconds = 10 * 60 * 1000; 
            if (currentTimeMilliseconds - timestampMilliseconds >= tenMinutesInMilliseconds) {
              try {
                const program = new Program(idl as Idl, programId, provider);
                await program.methods.storeRewards()
                  .accounts({
                    stakingAccount: new PublicKey(stakingData.accountId),
                    vault: vault,
                    stakingMint: new PublicKey(vaultData.AllowedToken),
                    owner: provider.wallet.publicKey,
                  })
                  .rpc();
                  triggerUpdate();
                console.log("Rewards stored successfully.");
              } catch (error) {
                console.error("Error storing rewards:", error);
              }
            } else {
              console.log("Timestamp is less than 10 minutes old. Skipping transaction.");
            }
          }
        };
      
        storeRewards();
      }, [provider, vault, stakingData]);
      
  return null; 
};
