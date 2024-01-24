use crate::errors::*;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token::Mint;


#[derive(Accounts)]
pub struct AddInstantRewards<'info> {
    #[account(mut, has_one = vault_owner)]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub staking_account: Account<'info, StakingAccount>,
    pub reward_token_mint: Account<'info, Mint>,
    #[account(mut)]
    pub vault_owner: Signer<'info>,
}

pub fn add_instant_rewards(ctx: Context<AddInstantRewards>, reward_amount: u64) -> Result<()> {
    let staking_account = &mut ctx.accounts.staking_account;
    let vault = &mut ctx.accounts.vault;
    require!(
        vault.vault_owner == ctx.accounts.vault_owner.key(),
        VaultError::Unauthorized
    );
    

    let mut reward_found = false;
    for reward in staking_account.rewards.iter_mut() {
        if reward.reward_token_mint == ctx.accounts.reward_token_mint.key() {
            reward.amount = reward
                .amount
                .checked_add(reward_amount)
                .ok_or(VaultError::Overflow)?;
            reward_found = true;
            break;
        }
    }

    if !reward_found {
        if staking_account.rewards.len() >= 5 {
            staking_account.rewards.remove(0);
        }
        staking_account.rewards.push(Reward {
            reward_token_mint: ctx.accounts.reward_token_mint.key(),
            amount: reward_amount,
        });
    }

    Ok(())
}
