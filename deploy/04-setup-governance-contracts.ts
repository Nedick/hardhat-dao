import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ethers } from "hardhat"
import { ADDRESS_ZERO } from "../helper-hardhat-config"   

const setupContracts: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    const { getNamedAccounts, deployments, network } = hre
    const { log } = deployments
    const { deployer } = await getNamedAccounts()
    const daoGovernanceToken = await ethers.getContract("DaoGovernanceToken", deployer)
    const daoTimeLock = await ethers.getContract("DaoTimeLock", deployer)
    const daoGovernor = await ethers.getContract("DaoGovernorContract", deployer)
    log("Setting up contracts for roles...")
    // would be great to use multicall here...
    const proposerRole = await daoTimeLock.PROPOSER_ROLE()
    const executorRole = await daoTimeLock.EXECUTOR_ROLE()
    const adminRole = await daoTimeLock.TIMELOCK_ADMIN_ROLE()

    const proposerTx = await daoTimeLock.grantRole(proposerRole, daoGovernor.address)
    await proposerTx.wait(1)
    const executorTx = await daoTimeLock.grantRole(executorRole, ADDRESS_ZERO)
    await executorTx.wait(1)
    const revokeTx = await daoTimeLock.revokeRole(adminRole, deployer)
    await revokeTx.wait(1)
    // Now, anything the timelock wants to do has to go through the governance process!
}

export default setupContracts
setupContracts.tags = ["all", "setup"]