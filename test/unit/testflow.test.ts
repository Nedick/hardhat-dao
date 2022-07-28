import { DaoGovernorContract, DaoGovernanceToken, DaoTimeLock, DaoBox } from "../../typechain-types"
import { deployments, ethers } from "hardhat"
import { assert, expect } from "chai"
import {
  FUNC,
  PROPOSAL_DESCRIPTION,
  NEW_STORE_VALUE,
  VOTING_DELAY,
  VOTING_PERIOD,
  MIN_DELAY,
} from "../../helper-hardhat-config"
import { moveBlocks } from "../../utils/move-blocks"
import { moveTime } from "../../utils/move-time"

describe("DaoGovernor Flow", async () => {
  let daoGovernor: DaoGovernorContract
  let daoGovernanceToken: DaoGovernanceToken
  let daoTimeLock: DaoTimeLock
  let daoBox: DaoBox
  const voteWay = 1 // for
  const reason = "I want that vote to pass"
  beforeEach(async () => {
    await deployments.fixture(["all"])
    daoGovernor = await ethers.getContract("DaoGovernorContract")
    daoTimeLock = await ethers.getContract("DaoTimeLock")
    daoGovernanceToken = await ethers.getContract("DaoGovernanceToken")
    daoBox = await ethers.getContract("DaoBox")
  })

  it("can only be changed through governance", async () => {
    await expect(daoBox.store(55)).to.be.revertedWith("Ownable: caller is not the owner")
  })

  it("proposes, votes, waits, queues, and then executes", async () => {
    // propose
    const encodedFunctionCall = daoBox.interface.encodeFunctionData(FUNC, [NEW_STORE_VALUE])
    const proposeTx = await daoGovernor.propose(
      [daoBox.address],
      [0],
      [encodedFunctionCall],
      PROPOSAL_DESCRIPTION
    )
    const boxStartingValue = await daoBox.retrieve()
    console.log(`DaoBox starting value is: ${boxStartingValue.toString()}`)
    const proposeReceipt = await proposeTx.wait(1)
    const proposalId = proposeReceipt.events![0].args!.proposalId
    let proposalState = await daoGovernor.state(proposalId)
    console.log(`Current Proposal State: ${proposalState}`)

    await moveBlocks(VOTING_DELAY + 1)
    // vote
    const voteTx = await daoGovernor.castVoteWithReason(proposalId, voteWay, reason)
    await voteTx.wait(1)
    proposalState = await daoGovernor.state(proposalId)
    assert.equal(proposalState.toString(), "1")
    console.log(`Current Proposal State: ${proposalState}`)
    await moveBlocks(VOTING_PERIOD + 1)

    // queue & execute
    // const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION))
    const descriptionHash = ethers.utils.id(PROPOSAL_DESCRIPTION)
    const queueTx = await daoGovernor.queue([daoBox.address], [0], [encodedFunctionCall], descriptionHash)
    await queueTx.wait(1)
    await moveTime(MIN_DELAY + 1)
    await moveBlocks(1)

    proposalState = await daoGovernor.state(proposalId)
    console.log(`Current Proposal State: ${proposalState}`)

    console.log("Executing...")
    console.log
    const exTx = await daoGovernor.execute([daoBox.address], [0], [encodedFunctionCall], descriptionHash)
    await exTx.wait(1)
    const daoBoxEndingValue = await daoBox.retrieve()
    console.log(`DaoBox ending value THROUGH GOVERNANCE IS: ${daoBoxEndingValue.toString()}`)
  })
})