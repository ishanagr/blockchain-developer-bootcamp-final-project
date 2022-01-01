# Final project - Registry of Marriages on Ethereum

## Deployed version url:

https://ishanagr.github.io/blockchain-developer-bootcamp-final-project/

## How to run this project locally:

### Prerequisites

- Node.js >= v14
- Truffle and Ganache

### Contracts

- Run `npm install truffle` in project root to install Truffle build and smart contract dependencies
- Run local testnet in port `8545` with an Ethereum client, e.g. Ganache
- `truffle migrate --network development`
- `truffle console --network development`
- Run tests in Truffle console: `test`

### Frontend

- Open `docs/index.html` in your browser of choice


## Screencast link

-

## Public Ethereum wallet for certification:

`0x048DB2a4339de68fe6B1Ba0688F7B88D0C3D8FE5`

## Project description

Traditionally marriages are registered at local government offices, but the same could be done in a decentralized way on the Ethereum blockchain. 

This project allows anyone to create a marriage certificate with their public and encrypted private information. Their partner can then sign the certificate from their Ethereum account.
Finally officiators can verify and officiate the marriage, and issue NFT certificates.

For this to work in the real world, it would need to be integrated with govertment services or other oracles for marriage registry and KYC.

## Simple workflow

1. Login with Metamask
2. Create a marriage certificate (as a proposal) using your Metamask wallet
3. Send the certificate ID to your better half
4. The partner then retrives their marriage ceritificate using the certificate ID
5. The partner signs the marriage certificate using their Metamask wallet 
6. The the officiator (contract owner in this case) officiates the marriage certificate using their Metamask wallet after checking the information submitted 
7. The partners can then retrieve the transactionHash of the marriage certificate, and be able to search it on Etherscan


## Directory structure

- `web`: Project's vanialla html and js frontend.
- `contracts`: Smart contracts that are deployed in the Ropsten testnet.
- `migrations`: Migration files for deploying contracts in `contracts` directory.
- `test`: Tests for smart contracts.

## Environment variables (not needed for running project locally)

```
ROPSTEN_INFURA_PROJECT_ID=
ROPSTEN_MNEMONIC=
```

## TODO features

- Payment to officiator for officiating the certificate 
- Access roles to add more officiators 
- Integrate with a blockchain KYC for user idetity verification
