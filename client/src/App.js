import React, { Component, useEffect, useState } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import "./App.css";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import Table from "./component/table";
import axios from "axios";


function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
  });
  const [accounts, setAccounts] = useState(null);
  const [receiverAddress, setReceiverAddress] = useState(null);
  const [transferAmount, setTransferAmount] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);
  const privateKey =
    "041645e89a22df2c17f9b4ef7a6d847fe540ec97380a52c4d6427ababb18905a";

  useEffect(() => {
    loadProvider();
  }, []);

  useEffect(() => {
    const getAccounts = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccounts(accounts[0]);
    };
    web3Api.web3 && getAccounts();
  }, [web3Api.web3]);

  const loadProvider = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
      setWeb3Api({
        web3: new Web3(provider),
        provider,
      });

      console.log("Ethereum successfully detected!");

      // From now on, this should always be true:
      // provider === window.ethereum

      // Access the decentralized web!

      // Legacy providers may only have ethereum.sendAsync
      const chainId = await provider.request({
        method: "eth_chainId",
      });
    } else {
      // if the provider is not detected, detectEthereumProvider resolves to null
      console.log("Please install MetaMask!");
    }
  };
  const transfer = async () => {
    try {
      //Get nonce
      console.log(`accountn`, accounts);

      const nonce = await web3Api.web3.eth.getTransactionCount(
        accounts,
        "latest"
      );
      console.log(nonce);
      const value = web3Api.web3.utils.toWei(
        transferAmount.toString(),
        "Ether"
      );
      console.log(value);

      const transaction = {
        to: receiverAddress,
        value: value,
        gasLimit: 6721975,
        nonce: nonce,
      };
      const signTransaction = await web3Api.web3.eth.accounts.signTransaction(
        transaction,
        privateKey
      );
      console.log("signTransaction", signTransaction);
      //Signed transaction
      web3Api.web3.eth.sendSignedTransaction(
        signTransaction.rawTransaction,
        (err, hash) => {
          if (err) throw new Error(err);
          console.log(err);
          setTransactionHash(hash);
          console.log(`hash`, hash);
          window.alert(`Transaction Complete Success`);
        }
      );
      console.log('saved hash',transactionHash);
      //Save in the Database
      await axios({
        method: "post",
        url: "/api/transactions/",
        baseURL: "http://localhost:9001",
        data : {
          senderAddress : accounts,
          receiverAddress : receiverAddress,
          amount : transferAmount,
          hash : transactionHash 
        }
      })
    } catch (error) {
      console.log(error);
    }
  };




  return (
    <>
      <header className="site-header">
        <div className="site-identity">
          <h1> My Accounts </h1>
        </div>
        <nav className="site-navigation">
          <ul
            className="nav"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <button
              type="button"
              class="btn btn-primary"
              onClick={async () => {
                const accounts = await window.ethereum.request({
                  method: "eth_requestAccounts",
                });
                console.log(`accounts `, accounts);
              }}
            >
              Connect to MetaMask{" "}
            </button>
            <li>Account : {accounts ? accounts : "No Account"}</li>
          </ul>
        </nav>
      </header>
      <body>
        <div>
          <h4 style={{ textAlign: "center" }}> Transfer Money</h4>
          <br />
          <div style={{display:"grid",alignItems:"center",alignContent:"center",gridAutoFlow:"column"}}>
          <h6   style={{paddingLeft:"2rem"}}>Receiver Address :</h6>
          
          <input
          style={{paddingLeft:"0.3rem",marginLeft:"0.5rem"}}
            type="text"
            onChange={(event) => {
              setReceiverAddress(event.target.value);
            }}
            placeholder="0x00000...."
          />
         <h6 style={{marginLeft:"2rem"}}> Amount :</h6>
          <input
          style={{paddingLeft:"0.5rem"}}
            type="text"
            onChange={(event) => {
              setTransferAmount(event.target.value);
            }}
          />
          <h6 style={{marginLeft:"2rem"}}> ETH</h6>
          <button
            type="submit"
            onClick={() => transfer()}
            class="btn btn-success"
          >
            Transfer
          </button>
          </div>
        </div>

        <Table />
      </body>
      <footer style={{ backgroundColor: "#c1c4de", alignContent: "center" }}>
        <center>
          developed By <b>Pro_Major</b>{" "}
        </center>
      </footer>
    </>
  );
}

export default App;
