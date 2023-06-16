import tokenABI from "../../contract/Token.json";
import vaultABI from "../../contract/Vault.json";
import { useState } from "react";
import { AbiItem } from "web3-utils";
import Web3 from "web3";

export default function Hero(props: any) {
  const { accounts } = props;

  const web3 = new Web3(window.ethereum);
  const WITHDRAWER_ROLE = "0x10dac8c06a04bec0b551627dad28bc00d6516b0caacd1c7b345fcdb5211334e4";
  const tokenAddress = "0x3A54a26f812A163113C298090aa35Ef084aE5ad7";
  const vaultAddress = "0xa290F006A25393FCC958B7f2d6adEEd589fd1C7d";
  const ownerAddress = "0x7C09413b0822216533cf5b3c9a1C6DCBF1E8b7b7";
  const tokenContract = new web3.eth.Contract(tokenABI as AbiItem[], tokenAddress);
  const vaultContract = new web3.eth.Contract(vaultABI as AbiItem[], vaultAddress);

  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("");
  const [index, setIndex] = useState("");

  const handleTransfer = async () => {
    if (!accounts) alert("You need to connect Metamask");
    const confirmation = window.confirm(`Are you sure tranfers ${amount} token in ${address}?`);
    if (confirmation) {
      const value = Web3.utils.toWei(amount.toString());
      await tokenContract.methods.transfer(address, value).send({
        from: accounts,
        to: tokenAddress,
      });
    }
    setAddress("");
    setAmount("");
  };

  const handleApproveDeposit = async () => {
    if (!accounts) alert("You need to connect Metamask");
    const confirmation = window.confirm(`Are you sure deposit ${amount} token in vault?`);
    if (confirmation) {
      const value = Web3.utils.toWei(amount.toString());
      await tokenContract.methods.approve(vaultAddress, value).send({
        from: accounts,
        to: vaultAddress,
      });
      await vaultContract.methods.deposit(value).send({
        from: accounts,
        to: vaultAddress,
      });
    }
  };

  const handleBalanceOfVault = async () => {
    if (!accounts) alert("You need to connect Metamask");
    const balance = Web3.utils.fromWei(await tokenContract.methods.balanceOf(vaultAddress).call());
    setAmount(balance);
  };

  const handleBalanceOfOwner = async () => {
    if (!accounts) alert("You need to connect Metamask");
    const balance = Web3.utils.fromWei(await tokenContract.methods.balanceOf(ownerAddress).call());
    setAmount(balance);
  };

  const handleGetMaxWithdraw = async () => {
    if (!accounts) alert("You need to connect Metamask");
    const amount = await vaultContract.methods.getMaxWithdrawAmount().call();
    setAmount(Web3.utils.fromWei(amount));
  };

  const handleSetMaxWithdraw = async () => {
    if (!accounts) alert("You need to connect Metamask");
    const confirmation = window.confirm(`Are you sure set max withdraw = ${amount}?`);
    if (confirmation) {
      const value = Web3.utils.toWei(amount.toString());
      await vaultContract.methods.setMaxWithdrawAmount(value).send({
        from: accounts,
        to: vaultAddress,
      });
    }
  };

  const handleSetStatusEnable = async () => {
    if (!accounts) alert("You need to connect Metamask");
    let bool = true;
    if (status == "false") bool = false;
    if (status == "true") bool = true;
    const confirmation = window.confirm(`Are you sure set ${bool} withdraw?`);
    if (confirmation) {
      await vaultContract.methods.setWithdrawEnable(bool).send({
        from: accounts,
        to: vaultAddress,
      });
    }
  };

  const handleGetStatusEnable = async () => {
    if (!accounts) alert("You need to connect  Metamask");
    const status = await vaultContract.methods.getStatusWithdraw().call();
    setStatus(status);
  };

  const handleSetWithdrawer = async () => {
    if (!accounts) alert("You need to connect  Metamask");
    const confirmation = window.confirm(`Are you sure set address ${address} withdrawer?`);
    if (confirmation) {
      await vaultContract.methods.grantRole(WITHDRAWER_ROLE, address).send({
        from: accounts,
        to: vaultAddress,
      });
    }
    setAddress("");
  };

  const handleRevokeWithdrawer = async () => {
    if (!accounts) alert("You need to connect  Metamask");
    const confirmation = window.confirm(`Are you sure revoke address ${address} withdrawer?`);
    if (confirmation) {
      await vaultContract.methods.revokeRole(WITHDRAWER_ROLE, address).send({
        from: accounts,
        to: vaultAddress,
      });
    }
    setAddress("");
  };

  const handleWithdraw = async () => {
    if (!accounts) alert("You need to connect  Metamask");
    const confirmation = window.confirm(`Are you sure withdraw ${amount} ?`);
    if (confirmation) {
      const value = Web3.utils.toWei(amount.toString());
      await vaultContract.methods.withdraw(value, ownerAddress).send({
        from: accounts,
        to: vaultAddress,
      });
    }
  };

  const handleWithdrawerMember = async () => {
    if (!accounts) alert("You need to connect  Metamask");
    console.log(index);
    const address = await vaultContract.methods.getRoleMember(WITHDRAWER_ROLE, index).call();
    setAddress(address);
  };
  return (
    <div className=" mx-auto px-4 mt-[40px] mb-20 ">
      <h1 className="text-2xl font-semibold mb-4">Contract Interface</h1>
      <div className="flex">
        <div className="mb-4">
          <label htmlFor="address" className="block mb-2">
            Address:
          </label>
          <input
            type="text"
            id="address"
            className="border rounded px-2 py-1 text-black"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="mb-4 ml-10">
          <label htmlFor="amount" className="block mb-2">
            Amount:
          </label>
          <input
            title="oo"
            type="text"
            id="amount2"
            className="border rounded px-2 py-1 text-black"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="mb-4 ml-10">
          <label htmlFor="amount" className="block mb-2">
            Status:
          </label>
          <input
            type="text"
            id="amount"
            className="border rounded px-2 py-1 text-black"
            value={status}
            onChange={(e) => setAmount(e.target.value)}
          />
          <select
            title="bb"
            name="cars"
            id="cars"
            form="carform"
            className="text-black ml-10"
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
          <select
            title="aa"
            name="cars"
            id="cars"
            form="carform"
            className="text-black ml-10"
            onChange={(e) => setIndex(e.target.value)}
          >
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>
      </div>

      <div className="mb-4 mt-5">
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-4" onClick={handleTransfer}>
          Transfer
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-4"
          onClick={handleBalanceOfVault}
        >
          BalanceOf Vault
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-4 ml-[10px]"
          onClick={handleGetMaxWithdraw}
        >
          Get Max Withdraw
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-4"
          onClick={handleGetStatusEnable}
        >
          Get Status Withdraw
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-4"
          onClick={handleSetWithdrawer}
        >
          Set Withdrawer
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ml-[40px]"
          onClick={handleWithdraw}
        >
          Withdraw
        </button>
      </div>
      <div className="mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-4"
          onClick={handleApproveDeposit}
        >
          Deposit
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-4"
          onClick={handleBalanceOfOwner}
        >
          BalanceOf Owner
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-4"
          onClick={handleSetMaxWithdraw}
        >
          Set Max Withdraw
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-[20px]"
          onClick={handleSetStatusEnable}
        >
          Set Status Withdraw
        </button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={handleRevokeWithdrawer}>
          Revoke Withdrawer
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ml-[20px]"
          onClick={handleWithdrawerMember}
        >
          Withdrawer
        </button>
      </div>
    </div>
  );
}
