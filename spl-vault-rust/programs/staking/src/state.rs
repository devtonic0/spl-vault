use anchor_lang::prelude::*;

#[account]
pub struct StakingAccount {
    pub owner: Pubkey,
    pub vault: Pubkey,
    pub staked_amount: u64,
    pub unlock_timestamp: i64,
    pub lockup_option: u8,
    pub timestamp: i64,
    pub rewards: Vec<Reward>,
}

#[derive(Clone, Debug, AnchorSerialize, AnchorDeserialize)]
pub struct Reward {
    pub reward_token_mint: Pubkey,
    pub amount: u64,
}

#[account]
pub struct Vault {
    pub vault_owner: Pubkey,
    pub allowed_token: Pubkey,
    pub vault_token_account: Pubkey,
    pub lockup_duration_option1: i64,
    pub lockup_duration_option2: i64,
    pub lockup_duration_option3: i64,
    pub lockup_duration_option4: i64,
    pub lockup_multiplier_option1: i64,
    pub lockup_multiplier_option2: i64,
    pub lockup_multiplier_option3: i64,
    pub lockup_multiplier_option4: i64,
    pub vault_ref: Pubkey,
    pub rewards: Vec<TimedReward>,
}

#[derive(Clone, Debug, AnchorSerialize, AnchorDeserialize)]
pub struct TimedReward {
    pub reward_token_mint: Pubkey,
    pub schedule: u64,
    pub timestamp: i64,
}
