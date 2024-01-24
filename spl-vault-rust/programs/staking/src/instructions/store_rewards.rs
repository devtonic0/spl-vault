use crate::errors::VaultError;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token::Mint;



#[derive(Accounts)]
pub struct StoreRewards<'info> {
    #[account(mut, has_one = owner)]
    pub staking_account: Account<'info, StakingAccount>,
    pub vault: Account<'info, Vault>,
    pub staking_mint: Account<'info, Mint>,
    #[account(mut)]
    pub owner: Signer<'info>,
}

pub fn store_rewards(ctx: Context<StoreRewards>) -> Result<()> {
    const SECONDS_IN_YEAR: u64 = 31_536_000;
    const REWARD_SCALE_FACTOR: u64 = 1_000_000_000;


    let clock = Clock::get()?;
    let staking_account = &mut ctx.accounts.staking_account;
    let vault = &ctx.accounts.vault;
    require!(
        staking_account.owner == ctx.accounts.owner.key(),
        VaultError::Unauthorized
    );

    for (_i, timed_reward) in vault.rewards.iter().enumerate() {

    
        let time_elapsed = clock.unix_timestamp - staking_account.timestamp;
        let staking_decimals = ctx.accounts.staking_mint.decimals as u32;
        let scaled_schedule = timed_reward.schedule as u128
            * REWARD_SCALE_FACTOR as u128;
        let scaled_reward_per_second = scaled_schedule / SECONDS_IN_YEAR as u128;
        let scaled_total_reward = scaled_reward_per_second * time_elapsed as u128;
    
        let multiplier = match staking_account.lockup_option {
            1 => vault.lockup_multiplier_option1,
            2 => vault.lockup_multiplier_option2,
            3 => vault.lockup_multiplier_option3,
            4 => vault.lockup_multiplier_option4,
            _ => return Err(VaultError::InvalidLockupOption.into()),
        };
    
        let reward_amount = ((scaled_total_reward
             as u128 * staking_account.staked_amount as u128 / 10u128.pow(staking_decimals as u32)) / REWARD_SCALE_FACTOR as u128) as u64;
        let reward_amount_with_multiplier: f64 = (reward_amount as i64 * multiplier / 100) as f64;
        let reward_amount_rounding: f64 = reward_amount_with_multiplier.floor() as f64;
        let reward_amount_final: i64 = reward_amount_rounding as i64;
        let reward_amount_rounded = reward_amount_final as u64;
    
        if let Some(existing_reward) = staking_account.rewards.iter_mut().find(|reward| reward.reward_token_mint == timed_reward.reward_token_mint) {
            existing_reward.amount = existing_reward.amount.checked_add(reward_amount_rounded).ok_or(VaultError::Overflow)?;
        } else {
            if staking_account.rewards.len() >= 5 {
                staking_account.rewards.remove(0);
            }
            staking_account.rewards.push(Reward {
                reward_token_mint: timed_reward.reward_token_mint,
                amount: reward_amount_rounded,
            });
        }
    }
    
    staking_account.timestamp = clock.unix_timestamp;
    

    Ok(())
}
