import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useContract } from "./hooks/useContract";
import { useTonConnect } from "./hooks/useTonConnect";
import { fromNano } from "ton-core";
import WebApp from "@twa-dev/sdk";
import { useCallback, useEffect, useState } from "react";
import eruda from "eruda";
import qs from "qs";
import { ITelegramUser } from "./types/User";

function App() {
  const [tgUser, setTgUser] = useState<ITelegramUser | undefined>(undefined);
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

  const lounchTools = useCallback(() => {
    if (!WebApp.isExpanded) {
      WebApp.expand();
    }
  }, []);

  const lounchDevTools = useCallback(() => {
    const el = document.getElementById("dev-console");
    if (el) {
      eruda.init({
        container: el,
      });
    }
  }, []);

  const getUserData = useCallback((initData: string) => {
    console.log("getUserData");
    const mainData = qs.parse(initData);
    if (mainData) {
      const user = JSON.parse(mainData.user as string) as ITelegramUser;
      if (user.username) {
        setTgUser(user);
      }
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (!import.meta.env.PROD) {
        lounchDevTools();
      }
      lounchTools();
      getUserData(WebApp.initData);
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="Container">
      <b style={{ marginBottom: 20 }}>{`Hi @${tgUser?.username}`}</b>
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
      <div id="dev-console" />
    </div>
  );
}

export default App;
