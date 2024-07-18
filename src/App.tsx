import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useContract } from "./hooks/useContract";
import { useTonConnect } from "./hooks/useTonConnect";
import { fromNano } from "ton-core";
import WebApp from "@twa-dev/sdk";
function App() {
  const {
    contract_address,
    contract_balance,
    counter_value,
    // recent_sender,
    // owner_address,
    sendIncrement,
    sendDeposite,
    sendWithdrawal,
  } = useContract();
  const { connected } = useTonConnect();
  return (
    <div className="Container">
      <div style={{ marginBottom: 20 }}>
        <TonConnectButton />
      </div>
      <div>
        <div className="Container">
          <b style={{ marginBottom: 20 }}>platform: {WebApp.platform}</b>
          <b>Our contract Address</b>
          <div style={{ marginBottom: 20 }}>
            {contract_address?.slice(0, 30) + "..."}
          </div>
          <b>Our contract Balance</b>
          <div style={{ marginBottom: 10 }}>
            {Number(fromNano(contract_balance)).toFixed(3)} TON
          </div>
        </div>

        <div className="Card" style={{ marginBottom: 20 }}>
          <b>Counter Value</b>
          <div>{counter_value ?? "Loading..."}</div>
        </div>
        <div className="Container">
          <a
            onClick={() => {
              WebApp.showAlert("This is a test alert!");
            }}
            style={{ marginBottom: 10 }}
          >
            Show Alert
          </a>
          {connected && (
            <a
              onClick={() => {
                sendIncrement();
              }}
              style={{ marginBottom: 10 }}
            >
              Increment by 3
            </a>
          )}
          {connected && (
            <a
              onClick={() => {
                sendDeposite(1);
              }}
              style={{ marginBottom: 10 }}
            >
              Request deposite of 1 TON
            </a>
          )}
          {connected && (
            <a
              onClick={() => {
                sendWithdrawal(0.5);
              }}
              style={{ marginBottom: 10 }}
            >
              Request 0.5 TON withdrawal
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
