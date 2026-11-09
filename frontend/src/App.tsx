import { useState, useEffect } from 'react';
import { ClientsManager } from './components/ClientsManager';
import { ChargesManager } from './components/ChargesManager';
import { DashboardView } from './components/DashboardView';
import { LoginView } from './components/LoginView';

function App() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'clients' | 'charges'>('dashboard');

  useEffect(() => {
    const savedUser = localStorage.getItem('korpis_user');
    const token = localStorage.getItem('korpis_token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('korpis_token');
    localStorage.removeItem('korpis_user');
    setUser(null);
  };

  if (!user) {
    return <LoginView onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} />;
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
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
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '14px', color: '#555' }}>Olá, <strong>{user.name}</strong></span>
          <button
            onClick={handleLogout}
            style={{ padding: '6px 12px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Sair
          </button>
        </div>
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