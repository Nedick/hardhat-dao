import { ethers, network } from "hardhat"
import {
  FUNC,
  NEW_STORE_VALUE,
  PROPOSAL_DESCRIPTION,
  MIN_DELAY,
  developmentChains,
} from "../helper-hardhat-config"
import { moveBlocks } from "../utils/move-blocks"
import { moveTime } from "../utils/move-time"

export async function queueAndExecute() {
    console.log(`NewStoreValue: ${NEW_STORE_VALUE}, Funk: ${FUNC}, Description: ${PROPOSAL_DESCRIPTION}`)
  const args = [NEW_STORE_VALUE]
  const functionToCall = FUNC
  const daoBox = await ethers.getContract("DaoBox")
  const encodedFunctionCall = daoBox.interface.encodeFunctionData(functionToCall, args)
  const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION))
  // could also use ethers.utils.id(PROPOSAL_DESCRIPTION)

  const daoGovernor = await ethers.getContract("DaoGovernorContract")
  console.log("Queueing...")
  const queueTx = await daoGovernor.queue([daoBox.address], [0], [encodedFunctionCall], descriptionHash)
  await queueTx.wait(1)

  if (developmentChains.includes(network.name)) {
    await moveTime(MIN_DELAY + 1)
    await moveBlocks(1)
  }

  console.log("Executing...")
  // this will fail on a testnet because you need to wait for the MIN_DELAY!
  const executeTx = await daoGovernor.execute(
    [daoBox.address],
    [0],
    [encodedFunctionCall],
    descriptionHash
  )
  await executeTx.wait(1)
  const boxNewValue = await daoBox.retrieve()
  console.log(boxNewValue.toString())
}

queueAndExecute()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })