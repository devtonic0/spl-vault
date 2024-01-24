use crate::errors::*;
use crate::fees::*;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};
use std::str::FromStr;
use anchor_lang::solana_program::{program::invoke, system_instruction};

#[derive(Accounts)]
pub struct AddRewards<'info> {
    #[account(mut, has_one = vault_owner)]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub reward_token_account: Account<'info, TokenAccount>,
    #[account(
        init_if_needed,
        seeds = [b"spl_rewards".as_ref(), vault.key().as_ref(), reward_token_mint.key().as_ref()],
        bump,
        payer = vault_owner,
        token::mint = reward_token_mint,
        token::authority = vault,
    )]
    pub vault_reward_token_account: Account<'info, TokenAccount>,
    pub reward_token_mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    #[account(mut)]
    pub vault_owner: Signer<'info>,
    #[account(mut)]
    /// CHECK: The `fee_account` is used to collect fees and does not require any specific constraints.
    /// It is safe because it is only used to transfer SOL to a predefined fee account address.
    pub fee_account: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

pub fn add_rewards(ctx: Context<AddRewards>, reward_amount: u64) -> Result<()> {
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

    let transfer_cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.reward_token_account.to_account_info(),
            to: ctx.accounts.vault_reward_token_account.to_account_info(),
            authority: ctx.accounts.vault_owner.to_account_info(),
        },
    );
    token::transfer(transfer_cpi_ctx, reward_amount)?;

    Ok(())
}
