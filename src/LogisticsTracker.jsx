import React, { useState, useEffect } from 'react';
import { 
  Package, Truck, MapPin, Clock, CheckCircle, 
  AlertCircle, RefreshCw, Bell, Camera, Search, 
  Download, X, Smartphone, Plus, Trash2 
} from 'lucide-react';

const LogisticsTracker = () => {
  // --- STATE MANAGEMENT ---
  const [shipments, setShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  // --- INITIAL DATA ---
  useEffect(() => {
    const initialData = [
      { id: 'TRK001234', customer: 'Acme Corporation', origin: 'Dubai, UAE', destination: 'Abu Dhabi, UAE', status: 'in_transit', progress: 65, estimatedDelivery: '2024-12-17T14:30:00', weight: '2500 kg', items: 25, driver: 'Ahmed Hassan', updates: [{ time: '2024-12-16T10:30:00', status: 'in_transit', location: 'Jebel Ali Port' }] },
      { id: 'TRK001235', customer: 'Global Trading LLC', origin: 'Sharjah, UAE', destination: 'Dubai, UAE', status: 'delivered', progress: 100, estimatedDelivery: '2024-12-16T16:00:00', weight: '850 kg', items: 12, driver: 'Mohammed Ali', updates: [{ time: '2024-12-16T15:45:00', status: 'delivered', location: 'Dubai Marina' }] },
      { id: 'TRK001236', customer: 'Tech Solutions Inc', origin: 'Abu Dhabi, UAE', destination: 'Al Ain, UAE', status: 'pending', progress: 10, estimatedDelivery: '2024-12-18T10:00:00', weight: '1200 kg', items: 18, driver: 'TBA', updates: [{ time: '2024-12-16T14:00:00', status: 'pending', location: 'Abu Dhabi Warehouse' }] },
    ];
    setShipments(initialData);
  }, []);

  // --- LOGIC FUNCTIONS ---
  const handleExportCSV = () => {
    const headers = "Tracking ID,Customer,Origin,Destination,Status,Progress\n";
    const rows = shipments.map(s => `${s.id},${s.customer},${s.origin},${s.destination},${s.status},${s.progress}%`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'LogiTrack_Report.csv';
    link.click();
  };

  const deleteShipment = (id, e) => {
    e.stopPropagation(); // Prevents opening details when clicking delete
    if(window.confirm("Permanent delete this shipment record?")) {
      setShipments(shipments.filter(s => s.id !== id));
      if(selectedShipment?.id === id) setSelectedShipment(null);
    }
  };

  const addNewShipment = () => {
    const newEntry = {
      id: `TRK${Math.floor(100000 + Math.random() * 900000)}`,
      customer: 'New Client Port',
      origin: 'Dubai Hub',
      destination: 'Global Port',
      status: 'pending',
      progress: 0,
      estimatedDelivery: new Date().toISOString(),
      weight: '500 kg',
      items: 1,
      driver: 'Unassigned',
      updates: [{ time: new Date().toISOString(), status: 'pending', location: 'Origin Hub' }]
    };
    setShipments([newEntry, ...shipments]);
    setIsAddPanelOpen(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'bg-emerald-500';
      case 'in_transit': return 'bg-blue-500';
      case 'pending': return 'bg-amber-500';
      case 'delayed': return 'bg-rose-500';
      default: return 'bg-slate-500';
    }
  };

  const filteredShipments = shipments.filter(s => 
    (s.id.toLowerCase().includes(searchQuery.toLowerCase()) || s.customer.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filterStatus === 'all' || s.status === filterStatus)
  );

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* 1. SLIDE-OVER PANEL */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-slate-900 border-l border-slate-800 shadow-2xl z-[100] transform transition-transform duration-500 ease-in-out ${isAddPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><Plus className="text-blue-500" /> New Shipment</h2>
            <button onClick={() => setIsAddPanelOpen(false)} className="p-2 hover:bg-slate-800 rounded-full transition-colors"><X /></button>
          </div>
          <div className="flex-1 space-y-6">
            <p className="text-slate-400 text-sm italic">Enter shipment details to generate a new tracking ID in the system.</p>
            <div className="space-y-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <div><label>Customer Name</label><input type="text" className="w-full mt-2 bg-slate-950 border border-slate-800 p-3 rounded-lg text-white" placeholder="SpaceX / NASA" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label>Origin</label><input type="text" className="w-full mt-2 bg-slate-950 border border-slate-800 p-3 rounded-lg text-white" placeholder="Dubai" /></div>
                  <div><label>Destination</label><input type="text" className="w-full mt-2 bg-slate-950 border border-slate-800 p-3 rounded-lg text-white" placeholder="London" /></div>
                </div>
            </div>
          </div>
          <button onClick={addNewShipment} className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold text-white shadow-lg shadow-blue-600/20 transition-all">Create Tracking Record</button>
        </div>
      </div>

      {/* 2. HEADER */}
      <header className="sticky top-0 z-50 bg-[#0b0f1a]/80 backdrop-blur-md border-b border-slate-800/50 p-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20"><Truck className="text-white w-6 h-6" /></div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white uppercase italic">LogiTrack<span className="text-blue-500">.hq</span></h1>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold tracking-widest">
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`}></span>
                {isOnline ? 'SYSTEMS ONLINE' : 'OFFLINE MODE'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" placeholder="Search ID or Customer..." 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:border-blue-500 transition-all"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button onClick={handleExportCSV} title="Export CSV" className="p-2 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors"><Download className="w-5 h-5 text-slate-400" /></button>
            <button onClick={() => setIsAddPanelOpen(true)} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-sm font-bold text-white shadow-lg transition-all">+ NEW</button>
          </div>
        </div>
      </header>

      {/* 3. DASHBOARD CONTENT */}
      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: LIST */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex justify-between items-end">
            <h2 className="text-xs font-black text-slate-500 tracking-[0.2em] uppercase">Active Shipments ({filteredShipments.length})</h2>
            <select className="bg-transparent text-xs font-bold text-blue-500 outline-none" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">ALL STATUS</option>
              <option value="in_transit">IN TRANSIT</option>
              <option value="delivered">DELIVERED</option>
              <option value="pending">PENDING</option>
            </select>
          </div>

          <div className="grid gap-4">
            {filteredShipments.map(shipment => (
              <div 
                key={shipment.id} onClick={() => setSelectedShipment(shipment)}
                className={`group bg-slate-900/40 border transition-all duration-300 p-5 rounded-2xl cursor-pointer hover:bg-slate-900/60 ${selectedShipment?.id === shipment.id ? 'border-blue-500 bg-slate-900/80' : 'border-slate-800/50 hover:border-slate-700'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-black text-blue-500 tracking-tighter uppercase mb-1 block">Tracking Unit</span>
                    <h3 className="text-lg font-mono font-bold text-white leading-none">{shipment.id}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${getStatusColor(shipment.status)} text-white`}>{shipment.status.replace('_', ' ')}</span>
                    <button onClick={(e) => deleteShipment(shipment.id, e)} className="p-1.5 opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                   <div className="space-y-1 text-xs text-slate-400">
                      <p className="font-bold text-slate-200 italic">{shipment.customer}</p>
                      <p className="flex items-center gap-1"><MapPin className="w-3 h-3 text-blue-500" /> {shipment.origin} → {shipment.destination}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Load Progress</p>
                      <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full ${getStatusColor(shipment.status)}`} style={{width: `${shipment.progress}%`}}></div>
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILS & COMMAND MAP */}
        <div className="lg:col-span-5">
           {selectedShipment ? (
             <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 sticky top-28 backdrop-blur-xl shadow-2xl">
                <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
                  <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Command Detail</h2>
                  <button onClick={() => setSelectedShipment(null)} className="text-slate-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                </div>

                <div className="space-y-6">
                  {/* LIVE PULSE MAP */}
                  <div className="h-48 bg-slate-950 rounded-2xl relative overflow-hidden border border-slate-800 group">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                       <div className="w-8 h-8 bg-blue-500/20 rounded-full animate-ping flex items-center justify-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                       </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 p-3 rounded-lg border border-white/5 backdrop-blur-sm">
                       <p className="text-[10px] font-black text-blue-500 tracking-widest uppercase mb-1">Live Telemetry</p>
                       <p className="text-xs text-slate-300 font-mono">COORD: 25.27698° N, 55.29624° E</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/30 p-4 rounded-2xl border border-white/5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Payload Weight</p>
                      <p className="text-lg font-bold text-white">{selectedShipment.weight}</p>
                    </div>
                    <div className="bg-slate-800/30 p-4 rounded-2xl border border-white/5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Designated Driver</p>
                      <p className="text-lg font-bold text-white leading-tight">{selectedShipment.driver}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-500 tracking-[0.3em] uppercase">Tracking History</h4>
                    <div className="space-y-4 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
                      {selectedShipment.updates.map((upd, i) => (
                        <div key={i} className="flex gap-4 relative pl-6">
                          <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-slate-900 ${getStatusColor(upd.status)}`}></div>
                          <div>
                            <p className="text-sm font-bold text-white uppercase tracking-tighter leading-none">{upd.status.replace('_', ' ')}</p>
                            <p className="text-xs text-slate-500 mt-1">{upd.location} • {new Date(upd.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
             </div>
           ) : (
             <div className="h-[500px] bg-slate-900/20 border border-slate-800/50 border-dashed rounded-3xl flex flex-col items-center justify-center p-12 text-center text-slate-600">
                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-4"><Package className="w-8 h-8 opacity-20" /></div>
                <p className="text-sm font-bold uppercase tracking-widest">Select an active unit<br/>to monitor live telemetry</p>
             </div>
           )}
        </div>
      </main>

      {/* PWA ALERT */}
      {!isOnline && (
        <div className="fixed bottom-6 left-6 right-6 bg-rose-600 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 z-[150] animate-bounce">
          <AlertCircle className="w-6 h-6" />
          <p className="font-bold text-sm tracking-tighter">OFFLINE MODE: Sync will resume automatically when connection restored.</p>
        </div>
      )}

    </div>
  );
};

export default LogisticsTracker;