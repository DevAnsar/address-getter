import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useContract } from "./hooks/useContract";
import { useTonConnect } from "./hooks/useTonConnect";
import { fromNano } from "ton-core";

function App() {
  const {
    contract_address,
    contract_balance,
    counter_value,
    // recent_sender,
    // owner_address,
    sendIncrement,
    sendDeposite,
  } = useContract();
  const { connected } = useTonConnect();
  return (
    <div>
      <div>
        <TonConnectButton />
      </div>
      <div>
        <div className="Card">
          <b>Our contract Address</b>
          <div className="Hint">{contract_address?.slice(0, 30) + "..."}</div>
          <b>Our contract Balance</b>
          <div className="Hint">
            {Number(fromNano(contract_balance)).toFixed(3)}
          </div>
        </div>

        <div className="Card">
          <b>Counter Value</b>
          <div>{counter_value ?? "Loading..."}</div>
        </div>
        <div className="Container">
          {connected && (
            <a
              onClick={() => {
                sendIncrement();
              }}
            >
              Increment
            </a>
          )}
          {connected && (
            <a
              onClick={() => {
                sendDeposite();
              }}
            >
              Deposite
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
