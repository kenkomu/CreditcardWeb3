"use client"
import { useState } from 'react';
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import BankCard from './BankCard'
import Web3 from 'web3';
import abi from '@/app/(root)/MyContractAbi.json'; // Import ABI

const RightSidebar = ({ user, transactions, banks }: RightSidebarProps) => {

  const [account, setAccount] = useState<string | null>(null); // Store the connected account
  const [isCardActive, setIsCardActive] = useState<boolean | null>(null); // Store card status

  const loggedIn = { firstName: 'ken', lastName: 'Komu', email: 'contact@kenkomu.pro' };

  // Instantiate a web3 object by passing the RPC URL of Sepolia.
  const web3 = new Web3(Web3.givenProvider || 'https://rpc.sepolia-api.lisk.com');

  // Address of the contract
  const address = '0x539A45407Fd3183088D4C3DEb4662dd2d5e4a7DE';

  // Instantiate the contract object
  const myContract = new web3.eth.Contract(abi, address);

  // Function to connect wallet (MetaMask)
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        console.log("Connected account: ", accounts[0]);
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    } else {
      console.error("MetaMask not detected");
    }
  };

  // Function to interact with contract methods
  const issueCard = async () => {
    if (account) {
      try {
        const result = await myContract.methods.issueCard('123456789', 30).send({ from: account });
        console.log("Card issued: ", result);
      } catch (error) {
        console.error("Error issuing card: ", error);
      }
    } else {
      console.error("Connect MetaMask first");
    }
  };

  const checkCardActive = async () => {
    if (account) {
      try {
        const result = await myContract.methods.isCardActive(account).call();
        setIsCardActive(result);
        console.log("Is card active: ", result);
      } catch (error) {
        console.error("Error checking card status: ", error);
      }
    } else {
      console.error("Connect MetaMask first");
    }
  };
  return (
    <aside className="right-sidebar">
      <section className="flex flex-col pb-8">

        <div className="profile-banner" />

        <div className="profile">

          <div className="profile-img">
            <span className="text-5xl font-bold text-blue-500">{user.firstName[0]}</span>
          </div>

          <div className="profile-details">
            <h1 className='profile-name'>
              {user.firstName} {user.lastName}
            </h1>
            <p className="profile-email">
              {user.email}
            </p>
          </div>
        </div>
      </section>

      <section className="banks">
        <div className="flex w-full justify-between">
          <button onClick={connectWallet}>
            {account ? `Connected: ${account}` : "Connect Wallet"}
          </button>
          <Link href="/" className="flex gap-2">

            <Image
              src="/icons/plus.svg"
              width={20}
              height={20}
              alt="plus"
            />
            <button onClick={issueCard} disabled={!account}>
              Issue Card
            </button>
          </Link>
        </div>

        {banks?.length > 0 && (
          <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
            <div className='relative z-10'>
              <BankCard
                key={banks[0].$id}
                account={banks[0]}
                userName={`${user.firstName} ${user.lastName}`}
                showBalance={false}
              />
            </div>
            {banks[1] && (
              <div className="absolute right-0 top-8 z-0 w-[90%]">
                <BankCard
                  key={banks[1].$id}
                  account={banks[1]}
                  userName={`${user.firstName} ${user.lastName}`}
                  showBalance={false}
                />
              </div>


            )}
            <div className="flex w-full justify-between" style={{ marginTop: '40px' }}> {/* Adjust margin value as needed */}
              <button onClick={checkCardActive} disabled={!account}>
                Check Card Active Status
              </button>
              <Link href="/" className="flex gap-2">
                {/* Other content goes here */}
              </Link>
            </div>
          </div>

        )}
      </section>
    </aside>
  )
}

export default RightSidebar