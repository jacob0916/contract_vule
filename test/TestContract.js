const Attack = artifacts.require('Attack');
const AttackWithEmptyFB = artifacts.require('AttackWithEmptyFB');
const AttackWithoutFB = artifacts.require('AttackWithoutFB');
const EtherStore = artifacts.require('EtherStore');
const BN = web3.utils.BN;
const v50 = new BN(50).mul(new BN(10).pow(new BN(18)));
const v40 = new BN(40).mul(new BN(10).pow(new BN(18)));
const v1 = new BN(1).mul(new BN(10).pow(new BN(18)));

let deploy;
let atkInst, esInst, atkwefbInst,atkwoutInst;

contract('Test contract', async (accounts) => {
    before("init...   -> success", async () => {
        try {
            deploy = await EtherStore.new();
            console.log("====================deploy1===================");
            console.log("----------------------------------------------");
            console.log(deploy);
            esInst = await EtherStore.at(deploy.address);
            console.log("----------------------------------------------");
            console.log(esInst);

            deploy = await Attack.new(esInst.address,{from:accounts[1]});
            console.log("====================deploy2===================");
            console.log("----------------------------------------------");
            console.log(deploy);
            atkInst = await Attack.at(deploy.address);
            console.log("----------------------------------------------");
            console.log(atkInst);


            deploy = await AttackWithEmptyFB.new(esInst.address,{from:accounts[1]});
            console.log("====================deploy3===================");
            console.log("----------------------------------------------");
            console.log(deploy);
            atkwefbInst = await AttackWithEmptyFB.at(deploy.address);
            console.log("----------------------------------------------");
            console.log(atkwefbInst);

          deploy = await AttackWithoutFB.new(esInst.address,{from:accounts[1]});
          console.log("====================deploy4===================");
          console.log("----------------------------------------------");
          console.log(deploy);
          atkwoutInst = await AttackWithoutFB.at(deploy.address);
          console.log("----------------------------------------------");
          console.log(atkwoutInst);

        } catch (err) {
            assert.fail(err);
        }
    });

    it('Attack reentry', async () => {
        try {
            await esInst.depositFunds({from: accounts[0], value:v50});
            console.log("esInst.address : "+ esInst.address);
            let beforeBalance = await web3.eth.getBalance(esInst.address);
            console.log("beforeBalance contrac Store "+ web3.utils.fromWei(beforeBalance));

            console.log("atkInst.address "+ atkInst.address);
            let beforeBalanceAtk = await web3.eth.getBalance(atkInst.address);
            console.log("beforeBalanceAtk  "+ web3.utils.fromWei(beforeBalanceAtk));

            await atkInst.attackEtherStore({from:accounts[1],value:v1});

            let afterBalance = await web3.eth.getBalance(esInst.address);
            console.log("afterBalance contrac Store "+web3.utils.fromWei(afterBalance));

            let afterBalanceAtk = await web3.eth.getBalance(atkInst.address);
            console.log("afterBalanceAtk  "+web3.utils.fromWei(afterBalanceAtk));

        } catch (err) {
            assert.fail(err.toString());
        }
    });

    it('Attack transfer: no transfer function', async () => {
        try {
            await esInst.depositFunds({from: accounts[0], value:v40});
            console.log("esInst.address : "+ esInst.address);
            let beforeBalance = await web3.eth.getBalance(esInst.address);
            console.log("beforeBalance contrac Store "+ web3.utils.fromWei(beforeBalance));

            console.log("atkwefbInst.address "+ atkwefbInst.address);
            let beforeBalanceAtk = await web3.eth.getBalance(atkwefbInst.address);
            console.log("beforeBalanceAtk  "+ web3.utils.fromWei(beforeBalanceAtk));

            await debug(atkwefbInst.attackEtherStoreForTransfer({from:accounts[1],value:v1}));

            let afterBalance = await web3.eth.getBalance(esInst.address);
            console.log("afterBalance contrac Store "+web3.utils.fromWei(afterBalance));

            let afterBalanceAtk = await web3.eth.getBalance(atkwefbInst.address);
            console.log("afterBalanceAtk  "+web3.utils.fromWei(afterBalanceAtk));

        } catch (err) {
            assert.fail(err.toString());
        }
    });

    it('Attack transfer: using send with empty fallback', async () => {
        try {
            console.log("esInst.address : "+ esInst.address);
            let beforeBalance = await web3.eth.getBalance(esInst.address);
            console.log("beforeBalance contrac Store "+ web3.utils.fromWei(beforeBalance));

            console.log("atkwefbInst.address "+ atkwefbInst.address);
            let beforeBalanceAtk = await web3.eth.getBalance(atkwefbInst.address);
            console.log("beforeBalanceAtk  "+ web3.utils.fromWei(beforeBalanceAtk));

            await debug(atkwefbInst.attackEtherStoreForSend({from:accounts[1],value:v1}));

            let afterBalance = await web3.eth.getBalance(esInst.address);
            console.log("afterBalance contrac Store "+web3.utils.fromWei(afterBalance));

            let afterBalanceAtk = await web3.eth.getBalance(atkwefbInst.address);
            console.log("afterBalanceAtk  "+web3.utils.fromWei(afterBalanceAtk));

        } catch (err) {
            assert.fail(err.toString());
        }
    });

  /**
   * by send
   * without fall back :                  Send failure, can NOT receive coin
   * with empty content fall back(payable):        AttackWithoutFB contract can receive coin
   * with empty content fall back(NOT payable):    AttackWithoutFB contract can NOT receive coin
   * wit fall back(payable), revert:      AttackWithoutFB contract can NOT receive coin
   */
  it('Attack transfer: using send without fallback', async () => {
    try {
      console.log("esInst.address : "+ esInst.address);
      let beforeBalance = await web3.eth.getBalance(esInst.address);
      console.log("beforeBalance contrac Store "+ web3.utils.fromWei(beforeBalance));

      console.log("atkwoutInst.address "+ atkwoutInst.address);
      let beforeBalanceAtk = await web3.eth.getBalance(atkwoutInst.address);
      console.log("beforeBalanceAtk  "+ web3.utils.fromWei(beforeBalanceAtk));

      await debug(atkwoutInst.attackEtherStoreForSend({from:accounts[1],value:v1}));

      let afterBalance = await web3.eth.getBalance(esInst.address);
      console.log("afterBalance contrac Store "+web3.utils.fromWei(afterBalance));

      let afterBalanceAtk = await web3.eth.getBalance(atkwoutInst.address);
      console.log("afterBalanceAtk  "+web3.utils.fromWei(afterBalanceAtk));

    } catch (err) {
      assert.fail(err.toString());
    }
  });

});