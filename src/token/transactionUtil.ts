import { AVAILABLE_NETWORKS, Network } from "../network/network";
import { ReefAccount, ReefSigner } from "../account/accountModel";
import {
  toTxErrorCodeValue,
  TX_STATUS_ERROR_CODE,
} from "../transaction/txErrorUtil";

export type TxStatusHandler = (status: TxStatusUpdate) => void;

export interface TxStatusUpdate {
  txIdent: string;
  txHash?: string;
  error?: { message: string; code: TX_STATUS_ERROR_CODE };
  isInBlock?: boolean;
  isComplete?: boolean;
  txTypeEvm?: boolean;
  url?: string;
  componentTxType?: string;
  addresses?: string[];
}

/*function toTxErrorCodeValue(e: { message: string } | string) {
  let message = e.message || e;
  let code = TX_STATUS_ERROR_CODE.ERROR_UNDEFINED;
  if (
      message
      && (message.indexOf('-32603: execution revert: 0x') > -1
          || message?.indexOf('InsufficientBalance') > -1)
  ) {
    message = 'You must allow minimum 60 REEF on account for Ethereum VM transaction even if transaction fees will be much lower.';
    code = TX_STATUS_ERROR_CODE.ERROR_MIN_BALANCE_AFTER_TX;
  }
  if (message && message?.startsWith('1010')) {
    message = 'Balance too low.';
    code = TX_STATUS_ERROR_CODE.ERROR_BALANCE_TOO_LOW;
  }
  if (message && message?.startsWith('balances.InsufficientBalance')) {
    message = 'Balance too low for transfer and fees.';
    code = TX_STATUS_ERROR_CODE.ERROR_BALANCE_TOO_LOW;
  }
  if (code === TX_STATUS_ERROR_CODE.ERROR_UNDEFINED) {
    message = `Transaction error: ${message}`;
  }
  return {message, code};
}*/

export const handleErr = (
  e: { message: string } | string,
  txIdent: string,
  txHash: string,
  txHandler: TxStatusHandler,
  signer: ReefAccount
): void => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { message, code } = toTxErrorCodeValue(e);
  txHandler({
    txIdent,
    txHash,
    error: { message, code },
    addresses: [signer.address],
  });
};

/*
export const nativeTransfer = async (amount: string, destinationAddress: string, provider: Provider, signer: ReefSigner): Promise<void> => {
  await provider.api.tx.balances
    .transfer(destinationAddress, amount)
    .signAndSend(signer.address, { signer: signer.signer.signingKey });
};

export const sendToNativeAddress = (
  provider: Provider,
  signer: ReefSigner,
  toAmt: BigNumber,
  to: string,
  txHandler: TxStatusHandler,
): string => {
  const txIdent = Math.random().toString(10);
  const transfer = provider.api.tx.balances.transfer(to, toAmt.toString());
  signer.signer.getSubstrateAddress().then((substrateAddress) => {
    transfer
      .signAndSend(
        substrateAddress,
        { signer: signer.signer.signingKey },
        (res) => {
          const txHash = transfer.hash.toHex();
          txHandler({
            txIdent,
            txHash,
            isInBlock: res.isInBlock,
            isComplete: res.isFinalized,
            addresses: [signer.address, to],
          });
        },
      )
      .catch((e) => {
        console.log('sendToNativeAddress err=', e);
        handleErr(e, txIdent, '', txHandler, signer);
      });
  });

  return txIdent;
};*/

export const getExtrinsicUrl = (
  id: string,
  network: Network = AVAILABLE_NETWORKS.mainnet
): string => `${network.reefscanFrontendUrl}/extrinsic/${id}`;
export const getContractUrl = (
  address: string,
  network: Network = AVAILABLE_NETWORKS.mainnet
): string => `${network.reefscanFrontendUrl}/contract/${address}`;
