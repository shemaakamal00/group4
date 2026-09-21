import { useEffect, useState } from 'react';
import HomePage from './pages/HomePage/HomePage'; 

export default function App() {
    // TODO: Tillfällig deploy test, kommer tas bort
    const [status, setStatus] = useState ('Testar backend');

    useEffect(() =>{
        fetch (`${import.meta.env.VITE_API_URL}/api/health`)
        .then ((r) => r.json())
        .then((d) => setStatus(` ${d.message} (${d.levels} nivåer i DB)`))
        .catch(() => setStatus('Kan inte nå backend'));
    }, []);
  return (
    <HomePage />
  );
}