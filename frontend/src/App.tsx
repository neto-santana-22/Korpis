import { useState } from 'react';
import { ClientsManager } from './components/ClientsManager';
import { ChargesManager } from './components/ChargesManager';

function App() {
  const [activeTab, setActiveTab] = useState<'clients' | 'charges'>('clients');

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <header style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>
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
          Cobrancas & Pagamentos
        </button>
      </header>

      <main>
        {activeTab === 'clients' && <ClientsManager />}
        {activeTab === 'charges' && <ChargesManager />}
      </main>
    </div>
  );
}

export default App;