pragma solidity 0.6.12;

import "@rubyswap/ruby-swap-lib/contracts/proxy/TransparentUpgradeableProxy.sol";

contract IGOUpgradeProxy is TransparentUpgradeableProxy {

    constructor(address admin, address logic, bytes memory data) TransparentUpgradeableProxy(logic, admin, data) public {

    }

}
