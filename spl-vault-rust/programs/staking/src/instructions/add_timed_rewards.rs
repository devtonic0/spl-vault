use crate::errors::*;
use crate::fees::*;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token::Mint;
use std::str::FromStr;
use anchor_lang::solana_program::{program::invoke, system_instruction};

#[derive(Accounts)]
pub struct AddTimedRewards<'info> {
    #[account(mut, has_one =vault_owner)]
    pub vault: Account<'info, Vault>,
    pub reward_token_mint: Account<'info, Mint>,
    #[account(mut)]
    pub vault_owner: Signer<'info>,
    #[account(mut)]
    /// CHECK: The `fee_account` is used to collect fees and does not require any specific constraints.
    /// It is safe because it is only used to transfer SOL to a predefined fee account address.
    pub fee_account: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

pub fn add_timed_rewards(ctx: Context<AddTimedRewards>, schedule: u64) -> Result<()> {
    let clock = Clock::get()?;
    let fee_account_pubkey = Pubkey::from_str(FEE_ACCOUNT_PUBKEY).expect("Invalid fee account pubkey");
    require!(
        ctx.accounts.fee_account.key() == fee_account_pubkey,
        VaultError::WrongFeeAccount
    );
    let transfer_instruction = system_instruction::transfer(
        ctx.accounts.vault_owner.to_account_info().key,
        ctx.accounts.fee_account.to_account_info().key,
        FEE_AMOUNT,
    );
    invoke(
        &transfer_instruction,
        &[
            ctx.accounts.vault_owner.to_account_info(),
            ctx.accounts.fee_account.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
    )?;
    let vault = &mut ctx.accounts.vault;
    require!(
        vault.vault_owner == ctx.accounts.vault_owner.key(),
        VaultError::Unauthorized
    );

    let reward_token_mint_key = ctx.accounts.reward_token_mint.key();
    if let Some(existing_reward) = vault
        .rewards
        .iter_mut()
        .find(|reward| reward.reward_token_mint == reward_token_mint_key)
    {
        existing_reward.schedule = schedule;
    } else {
        require!(vault.rewards.len() < 5, VaultError::RewardsLimitReached);
        vault.rewards.push(TimedReward {
            reward_token_mint: reward_token_mint_key,
            schedule,
            timestamp: clock.unix_timestamp,
        });
    }

    Ok(())
}
