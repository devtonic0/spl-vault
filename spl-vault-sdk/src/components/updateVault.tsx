import React, { useEffect, useState } from 'react';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { Program, AnchorProvider, Idl, BN } from '@project-serum/anchor';
import idl from '../../public/spl-vault-idl.json';
import { feeAccount } from '../utils/config';
import { fetchVaultData } from '../utils/helpers';

const programId = new PublicKey("vaULtyRDJpUm1BfD7SzUYJ4GhmUE3FPEstRZSUquBxf");

export const UpdateVault: React.FC<{
  provider: AnchorProvider,
  vault: PublicKey, 
  connection: Connection
}> = ({ provider, vault, connection }) => {
  const [ vaultData, setVaultData ] = useState(null);
  useEffect(() => {
    if (!provider) {
        return;
    }

    const fetchData = async () => {
        const owner = provider.wallet.publicKey;
        const vaultData = await fetchVaultData(vault, connection);
        if (vaultData) {
            const vaultData = await fetchVaultData(vault, connection)
            setVaultData(vaultData)
            setNewAllowedToken(vaultData.AllowedToken)
            setLockupDurations([
              vaultData.lockupDuration1, 
              vaultData.lockupDuration2, 
              vaultData.lockupDuration3, 
              vaultData.lockupDuration4])
            setLockupMultipliers([  
              vaultData.lockupMultiplier1, 
              vaultData.lockupMultiplier2, 
              vaultData.lockupMultiplier3, 
              vaultData.lockupMultiplier4])
        }
    };

    fetchData().catch(console.error);
}, [provider, vault]);

const [isEditing, setIsEditing] = useState(false);
const [newAllowedToken, setNewAllowedToken] = useState(null);
const [lockupDurations, setLockupDurations] = useState([]);
const [lockupMultipliers, setLockupMultipliers] = useState([]);
const [selectedRewardIndex, setSelectedRewardIndex] = useState(null);
const [rewardUpdateTokenId, setRewardUpdateTokenId] = useState("");
const [rewardUpdateAmount, setRewardUpdateAmount] = useState(0);
const [removeReward, setRemoveReward] = useState(false);




if (vaultData) {

  const handleEditClick = () => {
    setIsEditing(true);

  };

  const handleRewardEdit = (index) => {
    setSelectedRewardIndex(index);
    setRemoveReward(false);
    setIsEditing(true);
    if (vaultData) {
      const selectedReward = vaultData.rewards[index];
      setRewardUpdateTokenId(selectedReward.rewardTokenMint);
      setRewardUpdateAmount(new BN(selectedReward.schedule));
    }
  };

  const handleRewardRemove = (index) => {
    setSelectedRewardIndex(index);
    setRemoveReward(true);
    setRewardUpdateTokenId(SystemProgram.programId.toBase58());
    setRewardUpdateAmount(0);
  };

  const bnLockupDurations = lockupDurations.map(duration => new BN(duration));
  const bnLockupMultipliers = lockupMultipliers.map(multiplier => new BN(multiplier));

const handleSubmit = async (event) => {
    event.preventDefault();
    const program = new Program(idl as Idl, programId, provider);
    await program.methods.updateVaultSettings(
      new PublicKey(newAllowedToken),
      bnLockupDurations,
      bnLockupMultipliers,
      selectedRewardIndex,
      new PublicKey(rewardUpdateTokenId),
      new BN(rewardUpdateAmount) 
  )
    .accounts({
        vault: vault,
        vaultOwner: provider.wallet.publicKey,
        feeAccount: feeAccount,
        systemProgram: SystemProgram.programId,
    })
    .rpc();
};
const nonEditableRewardClass = "nonEditableReward";

    return (
      <div className='updateFormContainer'>
        <form className='updateForm' onSubmit={handleSubmit}>               
            <div className='lockupUpdateContainer'>
    <h3>Lockup Durations</h3>
    {lockupDurations.map((duration, index) => (
        <div key={index} className='lockupUpdate'>
            <label>Lockup Duration {index + 1} (days)</label>
            <input
                type="number"
                value={duration}
                onChange={(e) => {
                    const updatedDurations = [...lockupDurations];
                    updatedDurations[index] = e.target.value;
                    setLockupDurations(updatedDurations);
                }}
                readOnly={!isEditing}
            />
        </div>
    ))}
</div>

<div className='lockupUpdateContainer'>
    <h3>Lockup Multipliers</h3>
    {lockupMultipliers.map((multiplier, index) => (
        <div key={index}>
            <label>Lockup Multiplier {index + 1}</label>
            <input
                type="number"
                value={multiplier}
                onChange={(e) => {
                    const updatedMultipliers = [...lockupMultipliers];
                    updatedMultipliers[index] = e.target.value;
                    setLockupMultipliers(updatedMultipliers);
                }}
                readOnly={!isEditing}
            />
        </div>
    ))}
</div>

            <div>
                <button type="button" onClick={handleEditClick}>Edit Settings</button>
            </div>

            <div className='rewardsUpdate'>
            <h3>Rewards</h3>
                {vaultData.rewards.map((reward, index) => (
                    <div key={index} className={selectedRewardIndex === index ? 'rewardsBox' : nonEditableRewardClass}>
                        {selectedRewardIndex === index && isEditing ? (
                            <>
                            <div className='rewardMint'>
                    <label>Reward Token Mint:</label>
                    <input
                        type="text"
                        value={rewardUpdateTokenId}
                        onChange={(e) => setRewardUpdateTokenId(e.target.value)}
                    />
                    </div>
                    <div className='schedule'>
                    <label>Schedule:</label>
                    <input
                        type="number"
                        value={rewardUpdateAmount}
                        onChange={(e) => setRewardUpdateAmount(Number(e.target.value))}
                    />
                    </div>
                </>
            ) : (
              <>
                  <p>Reward Token Mint: {reward.rewardTokenMint}</p>
                  <p>Schedule: {reward.schedule}</p>
              </>
          )}
          <button type="button" onClick={() => handleRewardEdit(index)}>Edit Reward</button>
          <button type="button" onClick={() => handleRewardRemove(index)}>Remove Reward</button>
      </div>
  ))}
</div>

            <button type="submit">Update Vault Settings</button>
        </form>
        </div>
    );
                } else {
                  return null
                }
};

