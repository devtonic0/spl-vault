use crate::errors::*;
use crate::fees::*;
use crate::state::*;
use anchor_lang::prelude::*;
use std::str::FromStr;
use anchor_lang::solana_program::{program::invoke, system_instruction};

#[derive(Accounts)]
pub struct InitializeAccount<'info> {
    #[account(init, payer = owner, space = 332)]
    pub staking_account: Account<'info, StakingAccount>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    /// CHECK: The `fee_account` is used to collect fees and does not require any specific constraints.
    /// It is safe because it is only used to transfer SOL to a predefined fee account address.
    pub fee_account: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

pub fn initialize_account(ctx: Context<InitializeAccount>, vault: Pubkey) -> Result<()> {
    let fee_account_pubkey = Pubkey::from_str(FEE_ACCOUNT_PUBKEY).expect("Invalid fee account pubkey");
    require!(
        ctx.accounts.fee_account.key() == fee_account_pubkey,
        VaultError::WrongFeeAccount
    );
    let transfer_instruction = system_instruction::transfer(
        ctx.accounts.owner.to_account_info().key,
        ctx.accounts.fee_account.to_account_info().key,
        ACCOUNT_FEE,
    );
    invoke(
        &transfer_instruction,
        &[
            ctx.accounts.owner.to_account_info(),
            ctx.accounts.fee_account.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
    )?;
    let staking_account = &mut ctx.accounts.staking_account;
    staking_account.owner = *ctx.accounts.owner.key;
    staking_account.vault = vault;

    Ok(())
}
