import { useState } from 'react';
import { ClientsManager } from './components/ClientsManager';
import { ChargesManager } from './components/ChargesManager';
import { DashboardView } from './components/DashboardView';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'clients' | 'charges'>('dashboard');

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <header style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>
        <button
          onClick={() => setActiveTab('dashboard')}
          style={{
            padding: '10px 20px',
            fontWeight: activeTab === 'dashboard' ? 'bold' : 'normal',
            cursor: 'pointer',
          }}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('clients')}
          style={{
            padding: '10px 20px',
            fontWeight: activeTab === 'clients' ? 'bold' : 'normal',
            cursor: 'pointer',
          }}
        >
          Clientes
        </button>
        <button
          onClick={() => setActiveTab('charges')}
          style={{
            padding: '10px 20px',
            fontWeight: activeTab === 'charges' ? 'bold' : 'normal',
            cursor: 'pointer',
          }}
        >
          Cobranças & Pagamentos
        </button>
      </header>

      <main>
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'clients' && <ClientsManager />}
        {activeTab === 'charges' && <ChargesManager />}
      </main>
    </div>
  );
}

export default App;