import React from "react";
import { AwesomeButton } from "react-awesome-button";
// @ts-ignore
import AwesomeButtonStyles from "react-awesome-button/src/styles/styles.scss";

interface Props {
  isMetaMaskAvailable: boolean;
  account: string;
  amount: string;
  destAddr: string;
  connectFn: () => void;
  txFn: () => void;
}

export function TxButton({
  isMetaMaskAvailable,
  account,
  txFn,
  connectFn,
}: Props) {
  let prompt = "";
  let disabled = true;
  let onClick = () => {};
  if (!isMetaMaskAvailable) {
    disabled = true;
    prompt = "please install MetaMask";
  } else if (!account) {
    disabled = false;
    prompt = "connect wallet";
    onClick = connectFn;
  } else {
    disabled = false;
    prompt = "send transaction";
    onClick = txFn;
  }
  return (
    <AwesomeButton
      cssModule={AwesomeButtonStyles}
      disabled={disabled}
      onPress={onClick}
    >
      {prompt}
    </AwesomeButton>
  );
}
