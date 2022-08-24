import React from 'react';
import 'regenerator-runtime/runtime';

import './assets/global.css';

import { getGreetingFromContract, setGreetingOnContract } from './near-api';
import { SignInPrompt, SignOutButton } from './ui-components';


export default function App() {
  const [valueFromBlockchain, setValueFromBlockchain] = React.useState();

  const [uiPleaseWait, setUiPleaseWait] = React.useState(true);

  // Get blockchian state once on component load
  React.useEffect(() => {
    getGreetingFromContract()
      .then(setValueFromBlockchain)
      .catch(alert)
      .finally(() => {
        setUiPleaseWait(false);
      });
  }, []);

  /// If user not signed-in with wallet - show prompt
  if (!window.walletConnection.isSignedIn()) {
    // Sign-in flow will reload the page later
    return <SignInPrompt greeting={valueFromBlockchain}/>;
  }

  function changeGreeting(e) {
    e.preventDefault();
    setUiPleaseWait(true);
    const { greetingInput } = e.target.elements;
    setGreetingOnContract(greetingInput.value)
      .then(getGreetingFromContract)
      .then(setValueFromBlockchain)
      .catch(alert)
      .finally(() => {
        setUiPleaseWait(false);
      });
  }

  return (
    <>
      <SignOutButton accountId={window.accountId}/>
      <main className={uiPleaseWait ? 'please-wait' : ''}>
        <h1>
          Todo list: <span className="greeting">{valueFromBlockchain}</span>
        </h1>
        <form onSubmit={changeGreeting} className="change">
          <label>Todo:</label>
          <div>
            <input
              autoComplete="off"
              defaultValue={valueFromBlockchain}
              id="greetingInput"
            />
            <button>
              <span>Add</span>
              <div className="loader"></div>
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
