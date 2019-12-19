contract EtherStore {

    uint256 public withdrawalLimit = 1 ether;
    mapping(address => uint256) public lastWithdrawTime;
    mapping(address => uint256) public balances;

    function depositFunds() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdrawFunds (uint256 _weiToWithdraw) public {
        require(balances[msg.sender] >= _weiToWithdraw);
        // limit the withdrawal
        require(_weiToWithdraw <= withdrawalLimit);
        // limit the time allowed to withdraw
        require(now >= lastWithdrawTime[msg.sender] + 1 weeks);
        require(msg.sender.call.value(_weiToWithdraw)());
        balances[msg.sender] -= _weiToWithdraw;
        lastWithdrawTime[msg.sender] = now;
    }

    function withdrawFundsByTransfer (uint256 _weiToWithdraw) public {
        require(balances[msg.sender] >= _weiToWithdraw);
        msg.sender.transfer(_weiToWithdraw);                // transfer: no need handle error.
        balances[msg.sender] -= _weiToWithdraw;
    }

    function withdrawFundsBySend (uint256 _weiToWithdraw) public {
        require(balances[msg.sender] >= _weiToWithdraw);
        require(msg.sender.send(_weiToWithdraw),"Send failure");    // return true or false
        balances[msg.sender] -= _weiToWithdraw;
    }
}