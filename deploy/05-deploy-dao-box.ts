import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../helper-functions"
import { networkConfig, developmentChains } from "../helper-hardhat-config"
import { ethers } from "hardhat"

const deployDaoBox: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  log("Deploying DaoBox and waiting for confirmations...")
  const daoBox = await deploy("DaoBox", {
    from: deployer,
    args: [],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  })
  log(`DaoBox deployed at ${daoBox.address}`)
  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verify(daoBox.address, [])
  }
  const daoBoxContract = await ethers.getContractAt("DaoBox", daoBox.address)
  const daoTimeLock = await ethers.getContract("DaoTimeLock")
  const transferTx = await daoBoxContract.transferOwnership(daoTimeLock.address)
  await transferTx.wait(1)
}

export default deployDaoBox
deployDaoBox.tags = ["all", "box"]