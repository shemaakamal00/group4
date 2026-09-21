import { useEffect, useState } from 'react';
import HomePage from './pages/HomePage/HomePage';

// TODO: Tillfällig deploy test, kommer tas bort
export default function App() {
  const [status, setStatus] = useState('Testar backend...');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/health`)
      .then((r) => r.json())
      .then((d) => setStatus(` Backend svarar (${d.levels} nivåer i DB)`))
      .catch(() => setStatus(' Kunde inte nå backend'));
  }, []);

  return (
    <>
      <div style={{ padding: '8px', background: '#eee', fontSize: '14px' }}>
        {status}
      </div>
      <HomePage />
    </>
  );
}
