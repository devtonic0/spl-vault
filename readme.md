# SPL-Vault - In-Depth Overview

## Introduction

The SPL-Vault SDK is a set of React components designed to facilitate interaction with the SPL-Vault Solana program. It allows developers to integrate staking functionalities into their decentralized applications (DApps) with ease. The SDK is tailored for both developers and non-technical users, providing a seamless experience in managing staking pools, rewards, and vault configurations.

## Key Components

### TokensStaking

The `TokensStaking` component is the centerpiece of the SDK, enabling users to stake and unstake tokens in a vault. It provides an interface for selecting the amount of tokens to stake, choosing a lockup option, and viewing staked amounts and unlock times. The component automatically calculates the staking rewards based on the vault's settings and the user's staked amount.

### InitializeVaultButton

This component is used to create a new staking vault. It allows the specification of allowed tokens, lockup duration options (in days), and multiplier options (where 100 represents 1x, 200 represents 2x, etc.). It's important to note that creating a vault costs 1.5 SOL, which is required to cover the associated transaction and storage fees on the Solana blockchain.

### WithdrawRewards

The `WithdrawRewards` component enables users to withdraw accumulated rewards from the vault. It provides a dropdown list of available rewards based on the user's staked tokens and the reward schedules set in the vault.

### UpdateVault

This component allows vault owners to update the vault's settings, including allowed tokens, lockup durations, multipliers, and managing reward schedules.

### CreateTimedRewards and TimedRewards

`CreateTimedRewards` is used to add timed rewards to a vault, specifying a token mint address and a schedule. The `TimedRewards` component allows users to claim these timed rewards.

### DepositRewards

`DepositRewards` is utilized to deposit rewards into the vault, a necessary step before creating timed rewards or adding instant rewards.

## Integrating Components

To integrate these components into your DApp:

1. **Install the SDK**: Use `npm install spl-vault-sdk` to add the SDK to your project.

2. **Import Components**: Import the necessary components from the SDK into your React components.

3. **Set Up Connection and Provider**: Create a `Connection` object with your RPC endpoint and an `AnchorProvider` using the user's wallet and the connection.

4. **Integrate Components**: Add the SDK components to your React component's render method, passing in the required props such as `provider` and `connection`.

5. **Configure Components**: For components like `InitializeVaultButton`, configure the necessary parameters like allowed tokens and lockup options.

## Upcoming Features

- **CLI Tool**: An upcoming command-line interface (CLI) tool will provide additional functionalities for managing vaults and interacting with the SPL-Vault program.

- **Dedicated Website**: A dedicated website for interacting with the SPL-Vault program is in development, offering a user-friendly interface for managing staking pools and rewards.

## Conclusion

The SPL-Vault SDK offers a robust set of tools for integrating staking functionalities into Solana-based DApps. With its easy-to-use components, developers can create engaging and efficient staking experiences. The upcoming CLI tool and website will further enhance the capabilities and accessibility of the SPL-Vault ecosystem.

Certainly! Below are code snippets demonstrating how to integrate key components of the SPL-Vault SDK into a React application. These examples will give you an idea of how to use the SDK in your projects.

### 1. Initializing a Vault with `InitializeVaultButton`

```javascript
import React from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorProvider } from '@project-serum/anchor';
import { InitializeVaultButton } from 'spl-vault-sdk';

const MyComponent = () => {
  const rpcEndpoint = "<YOUR_RPC_ENDPOINT>";
  const connection = new Connection(rpcEndpoint);
  const wallet = ...; // Initialize your wallet here
  const provider = new AnchorProvider(connection, wallet, {});

  return (
    <div>
      <h1>Create a New Vault</h1>
      <InitializeVaultButton provider={provider} />
    </div>
  );
};

export default MyComponent;
```

### 2. Staking Tokens with `TokensStaking`

```javascript
import React from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorProvider } from '@project-serum/anchor';
import { TokensStaking } from 'spl-vault-sdk';

const MyStakingComponent = ({ vault }) => {
  const rpcEndpoint = "<YOUR_RPC_ENDPOINT>";
  const connection = new Connection(rpcEndpoint);
  const wallet = ...; // Initialize your wallet here
  const provider = new AnchorProvider(connection, wallet, {});

  return (
    <div>
      <h1>Stake Your Tokens</h1>
      <TokensStaking provider={provider} vault={vault} connection={connection} />
    </div>
  );
};

export default MyStakingComponent;
```

### 3. Withdrawing Rewards with `WithdrawRewards`

```javascript
import React from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorProvider } from '@project-serum/anchor';
import { WithdrawRewards } from 'spl-vault-sdk';

const MyRewardsComponent = ({ vault }) => {
  const rpcEndpoint = "<YOUR_RPC_ENDPOINT>";
  const connection = new Connection(rpcEndpoint);
  const wallet = ...; // Initialize your wallet here
  const provider = new AnchorProvider(connection, wallet, {});

  return (
    <div>
      <h1>Withdraw Your Rewards</h1>
      <WithdrawRewards provider={provider} vault={vault} connection={connection} />
    </div>
  );
};

export default MyRewardsComponent;
```

These snippets are basic examples to get you started. You'll need to replace `<YOUR_RPC_ENDPOINT>` with your actual RPC endpoint and initialize your wallet appropriately. Additionally, ensure that the `vault` prop in the `TokensStaking` and `WithdrawRewards` components is set to the PublicKey of the vault you want to interact with.

Remember, these components will render UI elements that allow users to interact with the staking functionalities provided by the SPL-Vault program. You can further customize and style these components according to your application's needs.
