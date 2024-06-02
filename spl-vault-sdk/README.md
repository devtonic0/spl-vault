----THIS PROGRAM HAS BEEN CLOSED DUE TO LACK OF USAGE I WILL BE BUILDING AN UPGRADED VERSION IN THE FUTURE----

SPL-Vault SDK
Overview

The SPL-Vault SDK provides a set of React components for easy integration and interaction with the SPL-Vault Solana program. These components allow users to interact with the vault for staking tokens, managing rewards, and configuring vault settings.
Components
WithdrawRewards

Allows users to withdraw their accumulated rewards from the vault.
UpdateVault

Enables updating the vault's settings, including allowed tokens, lockup durations, multipliers, and reward management.
StoreRewards

(Optional) For projects with multiple timed rewards, this component allows bypassing the claim timed rewards step and directly using withdraw rewards. It signs a transaction with a zero balance change to update account rewards.
TokensStaking

The primary component used for staking and unstaking tokens in the vault.
InitializeVaultButton

Used to create a new vault with specified allowed tokens, lockup duration options, and multiplier options. Multipliers are done similar to seller fee basis points. 100 multiplier = 1x 200 multiplier = 2x and so on. 
CreateTimedRewards

Allows the addition of timed rewards to the vault using a token mint address and a schedule.
TimedRewards

Enables users to claim timed rewards without storing the reward on the account. It's more efficient when used with only one timed reward.
DepositRewards

Facilitates depositing rewards into the vault, a prerequisite for creating timed rewards or adding instant rewards.
Usage

To use these components, import them into your React project and pass the necessary props, such as provider, vault, and connection. Each component has specific functionalities and interacts with the SPL-Vault Solana program to perform actions like staking, unstaking, managing rewards, and updating vault settings.
Development

Developers looking to integrate or extend these components can refer to the provided source code. The components are designed to be modular and easy to integrate into existing React applications.
Conclusion

The SPL-Vault SDK offers a comprehensive set of React components for interacting with the SPL-Vault Solana program. It simplifies the process of staking tokens, managing rewards, and configuring vault settings, making it accessible for both developers and non-technical users. More documentation coming soon
