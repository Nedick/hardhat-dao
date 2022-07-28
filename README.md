<!-- ABOUT THE PROJECT -->
## About

### How to DAO

This repo is meant to give you all the knowledge you need to start a DAO and do governance. There are 2 main kinds of doing governance.

| Feature    | On-Chain Governance | Hybrid Governance             |
| ---------- | ------------------- | ----------------------------- |
| Gas Costs  | More Expensive      | Cheaper                       |
| Components | Just the blockchain | An oracle or trusted multisig |

A typical on-chain governance structure might look like: 
- ERC20 based voting happens on a project like [Tally](https://www.withtally.com/), but could hypothetically be done by users manually calling the vote functions. 
- Anyone can execute a proposal once it has passed
_Examples [Compound](https://compound.finance/governance)_

On-chain governance can be much more expensive, but involves fewer parts, and the tooling is still being developed. 

A typical hybrid governance with an oracle might look like:
- ERC20 based voting happens on a project like [Snapshot](https://snapshot.org/#/)
- An oracle like [Chainlink](https://chain.link/) is used to retreive and execute the answers in a decentralized manner. (hint hint, someone should build this. )

A typical hybrid governance with a trusted multisig might looks like:
- ERC20 based voting happens on a project like [Snapshot](https://snapshot.org/#/)
- A trusted [gnosis multisig](https://gnosis-safe.io/) is used to exectue the results of snapshot.
_Examples: [Snapsafe](https://blog.gnosis.pm/introducing-safesnap-the-first-in-a-decentralized-governance-tool-suite-for-the-gnosis-safe-ea67eb95c34f)_

Hybrid governance is much cheaper, just as secure, but the tooling is still being developed. 

Tools:
- [Snapshot](https://snapshot.org/#/)
  - UI for off-chain voting / sentiment analysis
- [Tally](https://www.withtally.com/)
  - UI for on-chain voting
- [Gnosis Safe](https://gnosis-safe.io/)
  - Multi-sig
- [Openzeppelin](https://docs.openzeppelin.com/contracts/4.x/api/governance)
  - DAO code tools
- [Zodiac](https://github.com/gnosis/zodiac)
  - More DAO code tools
- [Openzeppelin Defender](https://openzeppelin.com/defender/)
  - A tool to propose governance and other contract functions. 


### No Code Tools

The following have tools to help you start a DAO without having to deploy contracts yourself.

- [DAO Stack](https://alchemy.daostack.io/daos/create)
- [Aragon](https://aragon.org/)
- [Colony](https://colony.io/)
- [DAOHaus](https://app.daohaus.club/summon)
- [DAO Leaderboard](https://deepdao.io/#/deepdao/dashboard)

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- GETTING STARTED -->
# Getting Started 

It's recommended that you've gone through the [hardhat getting started documentation](https://hardhat.org/getting-started/) before proceeding here. 

## Requirements

- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Nodejs](https://nodejs.org/en/)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) instead of `npm`

### Installation

1. Clone this repo:
```
git clone https://github.com/Nedick/hardhat-dao.git
cd hardhat-dao
```
2. Install dependencies
```
yarn
```

or 

```
npm i 
```

3. Run the test suite (which also has all the functionality)

```
yarn hardhat test
```
or
```
npx hardhat test
```

If you want to deploy to a testnet:
4. Add a `.env` file with the same contents of `.env.example`, but replaced with your variables.
![WARNING](https://via.placeholder.com/15/f03c15/000000?text=+) **WARNING** ![WARNING](https://via.placeholder.com/15/f03c15/000000?text=+)
> DO NOT PUSH YOUR PRIVATE_KEY TO GITHUB

<!-- USAGE EXAMPLES -->
## Usage
### On-Chain Governance Example

Here is the rundown of what the test suite does. 

1. We will deploy an ERC20 token that we will use to govern our DAO.
2. We will deploy a Timelock contract that we will use to give a buffer between executing proposals.
   1. Note: **The timelock is the contract that will handle all the money, ownerships, etc**
3. We will deploy our Governence contract 
   1. Note: **The Governance contract is in charge of proposals and such, but the Timelock executes!**
4. We will deploy a simple Box contract, which will be owned by our governance process! (aka, our timelock contract).
5. We will propose a new value to be added to our Box contract.
6. We will then vote on that proposal.
7. We will then queue the proposal to be executed.
8. Then, we will execute it!


Additionally, you can do it all manually on your own local network like so:

1. Setup local blockchain 
```
yarn hardhat node
```

2. Propose a new value to be added to our Box contract

In a second terminal (leave your blockchain running)
```
yarn hardhat run scripts/propose.ts --network localhost
```

3. Vote on that proposal

```
yarn hardhat run scripts/vote.ts --network localhost
```

4. Queue & Execute proposal!

```
yarn hardhat run scripts/queue-and-execute.ts --network localhost
```


You can also use the [Openzeppelin contract wizard](https://wizard.openzeppelin.com/#governor) to get other contracts to work with variations of this governance contract.