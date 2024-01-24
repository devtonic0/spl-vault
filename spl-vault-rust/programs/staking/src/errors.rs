use anchor_lang::prelude::*;

#[error_code]
pub enum VaultError {
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Invalid or missing allowed token")]
    InvalidAllowedToken,
    #[msg("Invalid or missing lockup duration")]
    InvalidLockupDuration,
    #[msg("Invalid or missing lockup multiplier (must be above 0)")]
    InvalidLockupMultiplier,
    #[msg("Invalid or missing lockup option (must be one of the 4 objects)")]
    InvalidLockupOption,
    #[msg("The provided token is not allowed for staking.")]
    NotAllowedToken,
    #[msg("Tokens still locked.")]
    LockupDurationNotMet,
    #[msg("Arithmetic overflow occurred")]
    Overflow,
    #[msg("Amount of tokens to withdraw exceeds token balance.")]
    InsufficientFunds,
    #[msg("Lockup option does not match previously used lockup. Please use previous lockup time.")]
    LockupMismatch,
    #[msg("Invalid Rewards token mint")]
    RewardNotFound,
    #[msg("Wrong token, only withdraw vault token using this method. Use withdrawRewards for rewards.")]
    WrongToken,
    #[msg("Vault already initialized")]
    AlreadyInitialized,
    #[msg("Fee account incorrect")]
    WrongFeeAccount,
    #[msg("Youre doing that too soon, stake for longer.")]
    TooSoon,
    #[msg("Rewards limit reached, maximum of 5 rewards per vault.")]
    RewardsLimitReached,
    #[msg("Invalid rewards index")]
    InvalidRewardIndex,
}
