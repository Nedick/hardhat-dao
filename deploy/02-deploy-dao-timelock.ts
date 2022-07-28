import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../helper-functions"
import { networkConfig, developmentChains, MIN_DELAY } from "../helper-hardhat-config"

const deployDaoTimelock: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    log("Deploying DaoTimeLock and waiting for confirmations...")

    const daoTimelock = await deploy("DaoTimeLock", {
        from: deployer,
        args: [MIN_DELAY, [], []],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })
    log(`TimeLock deployed at ${daoTimelock.address}`)

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(daoTimelock.address, [])
      }
}

export default deployDaoTimelock
deployDaoTimelock.tags = ["all", "timelock"]