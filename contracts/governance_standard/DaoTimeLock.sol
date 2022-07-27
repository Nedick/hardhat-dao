// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract DaoTimeLock is TimelockController {
  // minDelay is how long you have to wait before executing
  // proposers is the list of addresses  that can propose a change
  // executors who can execute when proposal is approved
  constructor(
    uint256 minDelay,
    address[] memory proposers,
    address[] memory executors
  ) TimelockController(minDelay, proposers, executors) {}
}
