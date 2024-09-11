"use client"
import { useState, useEffect } from 'react';
import HeaderBox from '@/components/HeaderBox';
import RightSidebar from "@/components/RightSIdebar";
import TotalBalanceBox from '@/components/TotalBalanceBox';
import TransactionHistory from "@/components/transaction_history";
import Web3 from 'web3';
import abi from './MyContractAbi.json'; // Import ABI
const Home = () => {

  const [account, setAccount] = useState<string | null>(null);
  const [isCardActive, setIsCardActive] = useState<boolean | null>(null);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any>(null);


  const loggedIn = { firstName: 'ken', lastName: 'Komu', email: 'contact@kenkomu.pro' };

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      const contractAddress = '0x539A45407Fd3183088D4C3DEb4662dd2d5e4a7DE';
      const contractInstance = new web3Instance.eth.Contract(abi, contractAddress);
      setContract(contractInstance);

      // Check if already connected
      web3Instance.eth.getAccounts().then((accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          console.log("Already connected account:", accounts[0]);
        }
      });
    } else {
      console.error("MetaMask not detected");
    }
  }, []);

  const connectWallet = async () => {
    if (web3) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        console.log("Connected account:", accounts[0]);
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    }
  };

  const issueCard = async () => {
    if (account && contract) {
      try {
        console.log("Issuing card with account:", account);
        const result = await contract.methods.issueCard('123456789', 30).send({ from: account });
        console.log("Card issued:", result);
      } catch (error) {
        console.error("Error issuing card:", error);
      }
    } else {
      console.error("Connect MetaMask first or contract not initialized");
    }
  };

  const checkCardActive = async () => {
    if (account && contract) {
      try {
        const result = await contract.methods.isCardActive(account).call();
        setIsCardActive(result);
        console.log("Is card active:", result);
      } catch (error) {
        console.error("Error checking card status:", error);
      }
    } else {
      console.error("Connect MetaMask first or contract not initialized");
    }
  };


  return (
    <section className="home">
      <div className="home-content">
      <button onClick={connectWallet}>
          {account ? `Connected: ${account}` : "Connect Wallet"}
        </button>

        <button onClick={issueCard} disabled={!account}>
          Issue Card
        </button>

        <button onClick={checkCardActive} disabled={!account}>
          Check Card Active Status
        </button>

        {isCardActive !== null && (
          <p>Card Active: {isCardActive ? 'Yes' : 'No'}</p>
        )}
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || 'Guest'}
            subtext="Access and manage your account and transactions efficiently."
          />

          <TotalBalanceBox
            accounts={[]}
            totalBanks={1}
            totalCurrentBalance={1250.35}
          />
        </header>

        <div>
          <TransactionHistory />
        </div>

        
      </div>

      <RightSidebar
        user={loggedIn}
        transactions={[]}
        banks={[{ currentBalance: 123.50 }, { currentBalance: 500.50 }]}
      />
    </section>
  );
}

export default Home;
