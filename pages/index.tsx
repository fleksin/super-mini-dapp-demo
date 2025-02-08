export const runtime = 'experimental-edge';

import { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import BN, { BigNumber } from 'bignumber.js';
import {
  chainIdNameMap,
  getAccount,
  getBalance,
  getNextNonce,
  sendTransaction,
  switchChain,
  useAccount,
  useChainId,
  useMetaMaskAvailable,
} from "../app/hooks";
import { TxButton } from "../app/TxButton";
import { ethers } from "ethers";
import { AwesomeButton } from "react-awesome-button";


declare global {
  interface Window {
    ethereum: any;
  }
}

let toastPendingId = 0;


export async function getServerSideProps() {
  // 在这里获取数据
  const data = await fetch('https://catfact.ninja/fact').then(res => res.json());

  return {
    props: {
      data,
    },
  };
}


// async function checkTx(hash: string): Promise<boolean> {
//   return new Promise(resolve => {
//     const interval = setInterval(async () => {
//       const result = await window.ethereum?.request({
//         method: "eth_getTransactionReceipt",
//         params: [hash]
//       });
//       if (result?.status) {
//         clearInterval(interval);
//         toast.done(toastPendingId);
//         if (+result.status === 0) {
//           toast.error("transaction reverted")
//         } else if (+result.status === 1) {
//           toast.success("transaction finished")
//         }
//         resolve(true);
//       }
//     }, 1000)
//   })

// }

export default function Home({ data }: { data: any }) {

  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-2 p-24">
      <h1>
        Fun Fact About Cat:
      </h1>
      <h4>{data?.fact || 'nothing yet'}</h4>
    </main>
  );
}
// export default function Home({ data }: { data: any }) {
//   const [destAddr, setDestAddr] = useState("");
//   const [nonce, setNonce] = useState("");
//   const [balance, setBalance] = useState("");
//   const [nonceInput, setNonceInput] = useState("");
//   const [amount, setAmount] = useState("");
//   const [account, setAccount] = useAccount(true);
//   const isMetaMaskAvailable = useMetaMaskAvailable();
//   const chain = useChainId(account);
//   const [txHash, setTxHash] = useState('');

//   console.log('data', data)

//   useEffect(() => {
//     if (account) {
//       console.log('getting nonce');
//       getNextNonce(account).then((nonce) => {
//         setNonce(nonce);
//       });
//       getBalance(account).then((balance) => {
//         setBalance(balance)
//       })
//     }
//   }, [account, chain, txHash]);

//   const txFn = useCallback(async () => {
//     if (!account) return toast.error('please connect wallet');
//     if (!destAddr) return toast.error('please enter a destination address');
//     if (!amount) return toast.error('please enter amount');
//     if (new BigNumber(amount).isGreaterThanOrEqualTo(balance)) return toast.error('insufficient balance');
//     try {
//       let param: Parameters<typeof sendTransaction>[0] = {
//         from: account,
//         to: destAddr,
//         value: new BN(amount).multipliedBy(10 ** 18).toString(),
//       };
//       if (nonceInput) param.nonce = +nonceInput
//       const hash = await sendTransaction(param);
//       if (hash) {
//         toast("transaction pending", {
//           isLoading: true,
//           toastId: ++toastPendingId
//         });
//         await checkTx(hash);
//         setTxHash(hash);
//       }
//     } catch (e: any) {
//       if ((e as ethers.ActionRejectedError).code == "ACTION_REJECTED")
//         toast.error("user rejected")
//       else
//         throw e;
//     }

//   }, [account, amount, balance, destAddr, nonceInput]);

//   return (
//     <main className="flex min-h-screen flex-col items-center justify-start gap-2 p-24">
//       <h1>
//         Fun Fact About Cat:
//       </h1>
//       <h4>{data?.fact || 'nothing yet'}</h4>
//       <div>Account: {account}</div>
//       <div>Current Chain Id: {+chain} &nbsp;
//       </div>
//       <div>Balance: {balance}</div>

//       <h3>to address</h3>
//       <input
//         className="p-5"
//         placeholder="destination address"
//         value={destAddr}
//         onChange={(e) => setDestAddr(e.target.value)}
//       />
//       <h3>amount</h3>
//       <input
//         type="number"
//         className="p-5"
//         placeholder="amount"
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//       />
//       <h3>nonce</h3>
//       <input
//         type="number"
//         className="p-5"
//         /* @ts-ignore */
//         placeholder={nonce ? +nonce : "next nonce"}
//         value={nonceInput}
//         onChange={(e) => setNonceInput(e.target.value)}
//       />
//       <TxButton
//         isMetaMaskAvailable={isMetaMaskAvailable}
//         account={account}
//         amount={amount}
//         destAddr={destAddr}
//         connectFn={async () => {
//           const account = await getAccount();
//           setAccount(account);
//         }}
//         txFn={txFn}
//       />
//       <AwesomeButton onPress={() => switchChain(1)}> Switch to Ethereum </AwesomeButton>
//       <AwesomeButton onPress={() => switchChain(56)}> Switch to BSC </AwesomeButton>
//       <ToastContainer />
//     </main>
//   );
// }
