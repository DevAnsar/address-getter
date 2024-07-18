import { useEffect, useState } from "react";
import { AddressGetterContract } from "../contracts/AddressGetter";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract, toNano } from "ton-core";
import { useTonConnect } from "./useTonConnect";

export function useContract() {
  const client = useTonClient();
  const { sender } = useTonConnect();
  const [contractData, setContractData] = useState<null | {
    counter_value: number;
    recent_sender: Address;
    owner_address: Address;
  }>();

  const [balance, setBalance] = useState<number>(0);

  const myContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new AddressGetterContract(
      Address.parse("EQA1l08s8rO9a-agRPtPCCHvxwqJcIblaRxlpLD9Kw157qoG")
    );
    return client.open(contract) as OpenedContract<AddressGetterContract>;
  }, [client]);

  const sleep = (time: number) =>
    new Promise((resolve) => setTimeout(resolve, time));

  useEffect(() => {
    async function getValue() {
      if (!myContract) return;
      setContractData(null);
      const val = await myContract.getData();
      const { balance } = await myContract.getBalance();
      setContractData({
        counter_value: val.number,
        recent_sender: val.recent_sender,
        owner_address: val.owner_address,
      });
      setBalance(balance);

      await sleep(5000);
      getValue();
    }
    getValue();
  }, [myContract]);

  return {
    contract_address: myContract?.address.toString(),
    contract_balance: balance,
    ...contractData,
    sendIncrement: () => {
      return myContract?.sendIncrement(sender, {
        value: toNano(0.05),
        incrementBy: 3,
      });
    },
    sendDeposite: () => {
      return myContract?.sendDeploy(sender, toNano(0.1));
    },
  };
}
