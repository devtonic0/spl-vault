use crate::errors::VaultError;
use crate::fees::*;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};
use std::str::FromStr;
use anchor_lang::solana_program::{program::invoke, system_instruction};


#[derive(Accounts)]
pub struct WithdrawTimedRewards<'info> {
    #[account(mut, has_one = owner)]
    pub staking_account: Account<'info, StakingAccount>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_token_account: Account<'info, TokenAccount>,
    pub vault: Account<'info, Vault>,
    pub token_mint: Account<'info, Mint>,
    pub staking_mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut)]
    /// CHECK: The `fee_account` is used to collect fees and does not require any specific constraints.
    /// It is safe because it is only used to transfer SOL to a predefined fee account address.
    pub fee_account: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

pub fn withdraw_timed_rewards(ctx: Context<WithdrawTimedRewards>, index: u8) -> Result<()> {
    const SECONDS_IN_YEAR: u64 = 31_536_000;
    const REWARD_SCALE_FACTOR: u64 = 1_000_000_000;

    let fee_account_pubkey = Pubkey::from_str(FEE_ACCOUNT_PUBKEY).expect("Invalid fee account pubkey");
    require!(
        ctx.accounts.fee_account.key() == fee_account_pubkey,
        VaultError::WrongFeeAccount
    );
    let transfer_instruction = system_instruction::transfer(
        ctx.accounts.owner.to_account_info().key,
        ctx.accounts.fee_account.to_account_info().key,
        FEE_AMOUNT,
    );
    invoke(
        &transfer_instruction,
        &[
            ctx.accounts.owner.to_account_info(),
            ctx.accounts.fee_account.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
    )?;
    let clock = Clock::get()?;
    let staking_account = &mut ctx.accounts.staking_account;
    let vault = &ctx.accounts.vault;
    require!(
        staking_account.owner == ctx.accounts.owner.key(),
        VaultError::Unauthorized
    );
    require!(
        staking_account.timestamp <= clock.unix_timestamp + 600,
        VaultError::TooSoon
    );

    for (i, timed_reward) in vault.rewards.iter().enumerate() {

        if i == index as usize {
            continue;
        }
    
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
    
    
    if index as usize >= vault.rewards.len() {
        return Err(VaultError::RewardNotFound.into());
    }
    

    if vault.rewards[index as usize].reward_token_mint == ctx.accounts.token_mint.key(){
        let timed_reward = &vault.rewards[index as usize];
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
        staking_account.timestamp = clock.unix_timestamp;

        let (_, bump_seed) = Pubkey::find_program_address(
            &[b"spl_vault", ctx.accounts.vault.vault_ref.as_ref()],
            ctx.program_id,
        );

        let seeds = &[
            &b"spl_vault".as_ref(),
            ctx.accounts.vault.vault_ref.as_ref(),
            &[bump_seed],
        ];
        let signer_seeds = &[&seeds[..]];

        let transfer_cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vault_token_account.to_account_info(),
                to: ctx.accounts.user_token_account.to_account_info(),
                authority: ctx.accounts.vault.to_account_info(),
            },
            signer_seeds,
        );

        token::transfer(transfer_cpi_ctx, reward_amount_rounded)?;
    } else {
        return Err(VaultError::RewardNotFound.into());
    }

    Ok(())
}
