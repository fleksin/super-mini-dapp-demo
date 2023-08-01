import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import * as ethers from "ethers";
import { TransactionRequest } from "ethers";
import { toast } from "react-toastify";
import BigNumber from "bignumber.js";

// nonce are not allow to be non-sequential, so I guess manually set nonce is for experimental features
export async function getAccount() {
  const accounts =
    (await window.ethereum
      ?.request({ method: "eth_requestAccounts" })
      .catch((err: any) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          console.log("Please connect to MetaMask.");
        } else {
          console.error(err);
        }
      })) || "";
  const account = accounts[0];
  return account;
}

function onChainChange(fn: (addr: string) => void) {
  window.ethereum?.on("chainChanged", fn);
}

export async function getBalance(account: string) {
    const balanceRaw = await window.ethereum?.request({
        method: "eth_getBalance",
        params: [account, "latest"],
    });
    const balance = new BigNumber(balanceRaw).dividedBy(10 ** 18).toString();
    return balance;
}

export async function getNextNonce(account: string) {
  const nonce = await window.ethereum?.request({
    method: "eth_getTransactionCount",
    params: [account, "latest"],
  });
  return nonce;
}

interface TxParams {
  from: string;
  to: string;
  value: string;
  nonce?: number;
}

export async function sendTransaction({ from, to, value, nonce }: TxParams) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const msg: TransactionRequest = {
    from,
    to,
    value,
  };
  if (nonce) msg.nonce = nonce;
  const rs = await signer.sendTransaction(msg);
  return rs.hash;
}

function onAccountChange(fn: (accounts: string) => void) {
  window.ethereum?.on("accountsChanged", (accounts: string[]) => {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts.
      console.log("Please connect to MetaMask.");
    } else {
      fn(accounts[0]);
    }
  });
}

async function getChainId() {
  return await window.ethereum?.request({ method: "eth_chainId" });
}

export const chainIdNameMap = {
  1: "Ethereum",
  56: "BSC",
};

export async function switchChain(id: 1 | 56) {
  try {
    await window.ethereum?.request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: '0x' + id.toString(16),
        },
      ],
    });
  } catch (e: any) {
    if (e.code === 4902) {
      toast.error(`Your wallet hasn't add chain ${id} - ${chainIdNameMap[id]}`);
    }
  }
}

export function useAccount(
  autoConnect: boolean
): [string, Dispatch<SetStateAction<string>>] {
  const [account, setAccount] = useState("");
  const handleAccountChange = useCallback((account: string) => {
    setAccount(account);
  }, []);
  useEffect(() => {
    if (autoConnect) getAccount().then((acc) => setAccount(acc));
    onAccountChange(handleAccountChange);
  }, []);
  return [account, setAccount];
}

export function useChainId(account: string) {
  const [chain, setChain] = useState("");
  const handleChainChanged = useCallback((chainId: string) => {
    setChain(chainId);
  }, []);
  useEffect(() => {
    if (account) {
      getChainId().then((id) => setChain(id));
      onChainChange(handleChainChanged);
    }
  }, [account]);
  return chain;
}

export function useMetaMaskAvailable() {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    setAvailable(window.ethereum !== undefined);
  }, []);
  return available;
}
