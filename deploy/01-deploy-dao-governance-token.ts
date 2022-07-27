import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ethers } from "hardhat"
import { networkConfig, developmentChains } from "../helper-hardhat-config"
import verify from "../helper-functions"

const deployDaoGovernanceToken: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    log("Deploying DaoGovernanceToken and waiting for confirmations...")
    const daoGovernanceToken = await deploy("DaoGovernanceToken", {
        from: deployer,
        args: [],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })
    log(`DaoGovernanceToken deployed at ${daoGovernanceToken.address}`)
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(daoGovernanceToken.address, [])
      }
    log(`Delegating to ${deployer}`)
    await delegate(daoGovernanceToken.address, deployer)
    log("Delegated!")
}

const delegate = async (daoGovernanceTokenAddress: string, delegatedAccount: string) => {
    const daoGovernanceToken = await ethers.getContractAt("DaoGovernanceToken", daoGovernanceTokenAddress)
    const transactionResponse = await daoGovernanceToken.delegate(delegatedAccount)
    await transactionResponse.wait(1)
    console.log(`Checkpoints: ${await daoGovernanceToken.numCheckpoints(delegatedAccount)}`)
}

export default deployDaoGovernanceToken
deployDaoGovernanceToken.tags = ["all", "governor"]