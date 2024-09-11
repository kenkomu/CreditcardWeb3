import HeaderBox from '@/components/HeaderBox';
import RightSidebar from "@/components/RightSIdebar";
import TotalBalanceBox from '@/components/TotalBalanceBox';
import TransactionHistory from "@/components/transaction_history"
import { Web3 } from 'web3';
const Home = () => {
  const loggedIn = { firstName: 'ken', lastName: 'Komu', email: 'contact@kenkomu.pro' };

  // Instantiate a web3 object by passing the RPC URL of Lisk Sepolia.
  const web3 = new Web3('https://rpc.sepolia-api.lisk.com');

  // Retrieve data from blockchain
  async function getLatestBlock() {
    const latestBlock = await web3.eth.getBlockNumber()
    console.log("The latest block's number is:", latestBlock);
  }

  getLatestBlock();
  return (
    <section className="home">
      <div className="home-content">
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
          <TransactionHistory>

          </TransactionHistory>
        </div>
      </div>

      <RightSidebar
        user={loggedIn}
        transactions={[]}
        banks={[{ currentBalance: 123.50 }, { currentBalance: 500.50 }]}
      />
    </section>
  )
}

export default Home