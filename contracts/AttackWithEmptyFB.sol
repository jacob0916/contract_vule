import "./EtherStore.sol";

contract AttackWithEmptyFB {
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
    }

    function collectEther() public {
        msg.sender.transfer(this.balance);
    }

    function transfer(uint amount) public payable {
        require(false, "Enter attack transfer function");
    }

    function send(uint amount) public payable returns(bool){
        require(false, "Enter attack send function");
        return true;
    }

    // fallback function - where the magic happens
    function () payable {
        //require(false, "Entering fallback() function");
        require(etherStore.balance > 2 ether, "etherStore has more than 2 ether");

//        if (etherStore.balance > 2 ether) {
//            etherStore.withdrawFundsByTransfer(1 ether);
//        }
//        revert("Not support");
    }
}