import React, { useState, useEffect } from 'react';
import {
  Camera,
  Package,
  MapPin,
  FileText,
  Award,
  Bell,
  Menu,
  X,
  Download,
  QrCode,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react';

const LogisticsApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [shipments, setShipments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [userScore, setUserScore] = useState(120);

  useEffect(() => {
    setShipments([
      { id: 1, tracking: 'LGX-1001', status: 'in_transit' },
      { id: 2, tracking: 'LGX-1002', status: 'delivered' }
    ]);
  }, []);

  return (
    <div style={{ fontFamily: 'Arial', paddingBottom: '80px' }}>
      {/* HEADER */}
      <header style={{ background: '#2563eb', color: 'white', padding: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Package />
            <h2>Logistics Tracker</h2>
          </div>
          <button onClick={() => setShowMenu(!showMenu)}>
            {showMenu ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <main style={{ padding: '16px' }}>
        {activeTab === 'dashboard' && (
          <>
            <h3>Dashboard</h3>
            <p>Active Shipments: {shipments.length}</p>
            <p>Score: {userScore}</p>
          </>
        )}

        {activeTab === 'shipments' && (
          <>
            <h3>Shipments</h3>
            {shipments.map(s => (
              <div key={s.id}>
                {s.tracking} - {s.status}
              </div>
            ))}
          </>
        )}

        {activeTab === 'profile' && (
          <>
            <h3>Profile</h3>
            <p>User score: {userScore}</p>
          </>
        )}
      </main>

      {/* BOTTOM NAV */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          width: '100%',
          background: '#eee',
          display: 'flex',
          justifyContent: 'space-around',
          padding: '10px'
        }}
      >
        <button onClick={() => setActiveTab('dashboard')}>
          <TrendingUp />
        </button>
        <button onClick={() => setActiveTab('shipments')}>
          <Package />
        </button>
        <button onClick={() => setActiveTab('profile')}>
          <Users />
        </button>
      </nav>
    </div>
  );
};

export default LogisticsApp;
