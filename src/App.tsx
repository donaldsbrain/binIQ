import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { getClient } from './clients/binView';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let connectionState: 1 | 2 | 3 = 1; // 1 = connected, 2 = disconnecting, 3 = disconnected
    getClient('layoutId').then(client => {
      if (connectionState === 1) {
        console.log(`client (${client.id}) connected`)
        
    } else if (connectionState === 2) {
        console.log(`disconnecting client (${client.id})`)
        client.disconnect();        
        connectionState = 3;
    }
    });
    return () => {
      connectionState = 2;
    }
  }, []);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
