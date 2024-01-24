use crate::errors::VaultError;
use crate::fees::*;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};
use std::str::FromStr;
use anchor_lang::solana_program::{program::invoke, system_instruction};

#[derive(Accounts)]
pub struct WithdrawRewards<'info> {
    #[account(mut, has_one = owner)]
    pub staking_account: Account<'info, StakingAccount>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub token_mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut)]
    /// CHECK: The `fee_account` is used to collect fees and does not require any specific constraints.
    /// It is safe because it is only used to transfer SOL to a predefined fee account address.
    pub fee_account: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

pub fn withdraw_rewards(ctx: Context<WithdrawRewards>) -> Result<()> {
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

    let staking_account = &mut ctx.accounts.staking_account;

    require!(
        staking_account.owner == ctx.accounts.owner.key(),
        VaultError::Unauthorized
    );

    let reward_index = staking_account
        .rewards
        .iter()
        .position(|reward| reward.reward_token_mint == ctx.accounts.token_mint.key());

    match reward_index {
        Some(index) => {
            let current_reward_amount = staking_account.rewards[index].amount;
            let amount = current_reward_amount;

            staking_account.rewards[index].amount = current_reward_amount
                .checked_sub(amount)
                .ok_or(VaultError::Overflow)?;

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

            token::transfer(transfer_cpi_ctx, amount)?;

            if staking_account.rewards[index].amount < 5 {
                staking_account.rewards.remove(index);
            }
        }
        None => return Err(VaultError::RewardNotFound.into()),
    }

    Ok(())
}
