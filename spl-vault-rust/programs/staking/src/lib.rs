use anchor_lang::prelude::*;
use instructions::*;
pub mod errors;
pub mod fees;
pub mod instructions;
pub mod state;

declare_id!("vaULtyRDJpUm1BfD7SzUYJ4GhmUE3FPEstRZSUquBxf");

#[program]
pub mod staking {
    use super::*;

    pub fn initialize_vault(
        ctx: Context<InitializeVault>,
        allowed_token: Pubkey,
        lockup_duration_options: [i64; 4],
        lockup_multiplier_options: [i64; 4],
    ) -> Result<()> {
        instructions::initialize_vault::initialize_vault(
            ctx,
            allowed_token,
            lockup_duration_options,
            lockup_multiplier_options,
        )
    }

    pub fn initialize_account(ctx: Context<InitializeAccount>, vault: Pubkey) -> Result<()> {
        instructions::initialize_account::initialize_account(ctx, vault)
    }

    pub fn update_vault_settings(
        ctx: Context<UpdateVaultSettings>,
        new_allowed_token: Pubkey,
        new_lockup_duration_options: [i64; 4],
        new_lockup_multiplier_options: [i64; 4],
        reward_update_index: u8,
        reward_update_token_id: Pubkey,
        reward_update_amount: u64,
    ) -> Result<()> {
        instructions::update_vault_settings::update_vault_settings(
            ctx,
            new_allowed_token,
            new_lockup_duration_options,
            new_lockup_multiplier_options,
            reward_update_index,
            reward_update_token_id,
            reward_update_amount,
        )
    }

    pub fn stake_tokens(ctx: Context<StakeTokens>, amount: u64, lockup_option: u8) -> Result<()> {
        instructions::stake_tokens::stake_tokens(ctx, amount, lockup_option)
    }

    pub fn withdraw_tokens(ctx: Context<WithdrawTokens>, amount: u64) -> Result<()> {
        instructions::withdraw_tokens::withdraw_tokens(ctx, amount)
    }

    pub fn add_rewards(ctx: Context<AddRewards>, reward_amount: u64) -> Result<()> {
        instructions::add_rewards::add_rewards(ctx, reward_amount)
    }

    pub fn add_instant_rewards(ctx: Context<AddInstantRewards>, reward_amount: u64) -> Result<()> {
        instructions::add_instant_rewards::add_instant_rewards(ctx, reward_amount)
    }

    pub fn withdraw_rewards(ctx: Context<WithdrawRewards>) -> Result<()> {
        instructions::withdraw_rewards::withdraw_rewards(ctx)
    }

    pub fn add_timed_rewards(ctx: Context<AddTimedRewards>, schedule: u64) -> Result<()> {
        instructions::add_timed_rewards::add_timed_rewards(ctx, schedule)
    }

    pub fn withdraw_timed_rewards(ctx: Context<WithdrawTimedRewards>, index: u8) -> Result<()> {
        instructions::withdraw_timed_rewards::withdraw_timed_rewards(ctx, index)
    }

    pub fn store_rewards(ctx: Context<StoreRewards>) -> Result<()> {
        instructions::store_rewards::store_rewards(ctx)
    }
}
