import { PublicKey, SystemProgram } from '@solana/web3.js';
import React from 'react';
import { useState } from 'react';
import { Program, web3, AnchorProvider, Idl, BN } from '@project-serum/anchor';
import idl from '../../public/spl-vault-idl.json';
import { feeAccount, programId } from '../utils/config';


export async function initializeVault(
    provider: AnchorProvider, 
    allowedToken: PublicKey, 
    lockupDurationOptions: number[],
    lockupMultiplierOptions: number[],
): Promise<void> {
    const program = new Program(idl as Idl, programId, provider);
    const vaultRef = web3.Keypair.generate();
    const vaultRefDone = vaultRef.publicKey

    const [vault, _bump] = await PublicKey.findProgramAddressSync(
        [
            Buffer.from("spl_vault"), vaultRefDone.toBuffer()
        ],
        programId
    );

    const [vaultTokenAccount, _bump2] = await PublicKey.findProgramAddressSync(
        [
            vault.toBuffer(), Buffer.from("vault_tokens")
        ],
        programId
    );



   
    console.log("Vault ID:", vault.toBase58())
    await program.methods.initializeVault(allowedToken, lockupDurationOptions, lockupMultiplierOptions)
    .accounts({
      vault: vault,
      vaultRef: vaultRef.publicKey.toBase58(),
      vaultTokenAccount: vaultTokenAccount,
      allowedToken: allowedToken,
      owner: provider.wallet.publicKey,
      feeAccount: feeAccount,
      systemProgram: SystemProgram.programId,
    })
    .signers([])
    .rpc();
    
}

export const InitializeVaultButton: React.FC<{provider: AnchorProvider}> = ({ provider }) => {
  const [allowedToken, setAllowedToken] = useState('');
  const [lockupDurationOptions, setLockupDurationOptions] = useState([new BN(1), new BN(1), new BN(1), new BN(1)]);
  const [lockupMultiplierOptions, setLockupMultiplierOptions] = useState([0, 0, 0, 0]);
  const [displayLockupDurationOptions, setDisplayLockupDurationOptions] = useState([0, 0, 0, 0]);

  const handleLockupDurationChange = (index, value) => {
    const updatedOptions = [...lockupDurationOptions];
    const updatedDisplayOptions = [...displayLockupDurationOptions];

    const numericValue = Number(value);
    updatedOptions[index] = numericValue === 0 ? new BN(1) : new BN(numericValue * 60 * 60 * 24);
    updatedDisplayOptions[index] = Math.floor(numericValue);

    setLockupDurationOptions(updatedOptions);
    setDisplayLockupDurationOptions(updatedDisplayOptions);
};

  const handleLockupMultiplierChange = (index: number, value: string) => {
      const updatedOptions = [...lockupMultiplierOptions];
      updatedOptions[index] = new BN(value);
      setLockupMultiplierOptions(updatedOptions);
  };

  const handleClick = async () => {
      try {
          await initializeVault(provider, new PublicKey(allowedToken), lockupDurationOptions, lockupMultiplierOptions);
          console.log("Vault initialized successfully.");
      } catch (error) {
          console.error("Error initializing vault:", error);
      }
  };

  return (
      <div className='createVaultContainer'>
        <h1>Create Vault</h1>
          <input type="text" placeholder="Allowed Token" className='allowedTokenInput' onChange={(e) => setAllowedToken(e.target.value)} />
        <div className='lockupDurationOptionsContainer'>
            <p>Lockup Duration (in days)</p>
            <div className='lockupDurationOptions'>
            {displayLockupDurationOptions.map((option, index) => (
    <input 
        key={index}
        type="number" 
        placeholder={`Lockup Duration Option ${index + 1}`} 
        value={option}
        onChange={(e) => handleLockupDurationChange(index, e.target.value)} 
    />
))}
          </div>
          </div>
        <div className='multiplierOptionsContainer'>
            <p>Multiplier (Read Docs)</p>
            <div className='multiplierOptions'>
          {lockupMultiplierOptions.map((option, index) => (
              <input 
                  key={index}
                  type="number" 
                  placeholder={`Lockup Multiplier Option ${index + 1}`} 
                  value={option}
                  onChange={(e) => handleLockupMultiplierChange(index, e.target.value)} 
              />
          ))}
          </div>
</div>
          <button className='initVaultButton' onClick={handleClick}>
              Initialize Vault
          </button>
      </div>
  );
};
