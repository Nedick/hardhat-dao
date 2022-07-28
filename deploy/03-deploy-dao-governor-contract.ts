import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../helper-functions"
import {
    networkConfig,
    developmentChains,
    QUORUM_PERCENTAGE,
    VOTING_PERIOD,
    VOTING_DELAY,
  } from "../helper-hardhat-config"

const deployDaoGovernorContract: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const daoGovernanceToken = await get("DaoGovernanceToken")
    const daoTimeLock = await get("DaoTimeLock")
    log("Deploying DaoGovernorContract and waiting for confirmations...")
    const daoGovernorContract = await deploy("DaoGovernorContract", {
        from: deployer,
        args: [daoGovernanceToken.address, daoTimeLock.address, VOTING_DELAY, VOTING_PERIOD, QUORUM_PERCENTAGE],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })
    log(`GovernorContract deployed at ${daoGovernorContract.address}`)

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(daoGovernorContract.address, [])
    }
}

export default deployDaoGovernorContract
deployDaoGovernorContract.tags = ["all", "governor"]