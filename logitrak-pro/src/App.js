import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Upload, X, LogOut, CheckCircle, Activity, Package, Truck, Ship, Plane, 
  MapPin, FileText, Eye, ArrowRight, Download, Thermometer, Wind, ShieldCheck, 
  Settings, UserPlus, User, Briefcase, Mail, Lock, Building, ChevronRight, 
  Radio, AlertTriangle, CloudLightning, FileUp, Trash2, Save, Train, Search, Filter, 
  Layers, Users, ShieldAlert, Zap, BarChart3, Globe, Share2, MoreHorizontal, MousePointer2,
  Navigation, RefreshCw, Database, FileWarning, Check, TrendingUp, Shield, Smartphone,
  Edit, Key, UserCog, MonitorPlay, LockKeyhole
} from 'lucide-react';

/**
 * LOGITRAK.PRO - ENTERPRISE RESOURCE PLANNING & LOGISTICS HUD
 * VERSION: 6.0.0 (MASTER BUILD)
 * ARCHITECTURE: MONOLITHIC REACT APPLICATION
 */

// ==========================================
// 1. CORE UTILITIES & MOCK DATA
// ==========================================

const generateSmartID = () => {
  const segment1 = Math.random().toString(36).substr(2, 5).toUpperCase();
  const segment2 = Math.floor(Math.random() * 900 + 100);
  return `LT-${segment1}-${segment2}`;
};

const formatCurrency = (val, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(val);
};

const getCurrentTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// --- INITIAL DATABASE STATES ---

const INITIAL_USERS = [
  { 
    id: 'U-001', 
    name: 'SAM BOND', 
    email: 'sambond0000@gmail.com', 
    password: 'admin 123', 
    company: 'LOGITRAK HQ', 
    role: 'OWNER',
    permissions: 'ROOT_ADMIN',
    lastLogin: '2025-12-23 14:20',
    status: 'ACTIVE'
  },
  { 
    id: 'U-002', 
    name: 'OPERATIONS MANAGER', 
    email: 'user@logitrak.com', 
    password: '123', 
    company: 'NEXUS LOGISTICS', 
    role: 'USER', 
    permissions: 'VIEW_EDIT',
    lastLogin: '2025-12-22 09:15',
    status: 'ACTIVE'
  }
];

const INITIAL_SHIPMENTS = [
  {
    id: "LT-X82A1-902",
    consignor: "SAMSUNG GLOBAL LTD",
    product: "GALAXY S24 ULTRA",
    hsnCode: "851713",
    invoiceType: "Commercial Invoice",
    docType: "Air Waybill",
    docNumber: "AWB-772819",
    consignee: "AMAZON INDIA PVT",
    transportName: "BLUE DART CARGO",
    contactNumber: "+91 98765 43210",
    vehicleNumber: "BOEING 747-F",
    location: "Mumbai Port (BOM)",
    status: "In Transit",
    progress: 68,
    mode: "Air",
    value: "450000",
    currency: "USD",
    aiRisk: "Low",
    priority: "High",
    tempRequirement: "18°C - 24°C",
    pressureFactors: ["Corridor Volatility: 12%", "Terminal Delay: Minimal", "Weather: Optimal"],
    geminiSummary: "Operational corridor clear. Asset vectoring 14 mins ahead of schedule. Fuel consumption optimized at 92%.",
    lat: 19.076, lng: 72.877,
    history: [
      { time: "08:00 AM", event: "Manifest Uploaded", status: "Done" },
      { time: "10:30 AM", event: "Cleared Customs", status: "Done" },
      { time: "01:45 PM", event: "In Transit - Airborne", status: "Active" }
    ]
  },
  {
    id: "LT-M99Q2-101",
    consignor: "TESLA MOTORS INC",
    product: "MODEL Y BATTERY PACKS",
    hsnCode: "850760",
    invoiceType: "Proforma Invoice",
    docType: "Bill of Lading",
    docNumber: "BL-992811",
    consignee: "GIGAFACTORY BERLIN",
    transportName: "MAERSK LINE",
    contactNumber: "+1 555 0199 22",
    vehicleNumber: "MS-VESSEL-TITAN",
    location: "Suez Canal",
    status: "Delayed",
    progress: 45,
    mode: "Marine",
    value: "1250000",
    currency: "EUR",
    aiRisk: "High",
    priority: "Critical",
    tempRequirement: "15°C - 20°C",
    pressureFactors: ["Red Sea Conflict Zone", "Port Congestion: High", "Weather: Storm Warning"],
    geminiSummary: "CRITICAL ALERT: Vessel rerouted via Cape of Good Hope due to regional instability. +4 Days ETA.",
    lat: 30.585, lng: 32.265,
    history: [
      { time: "06:00 AM", event: "Port Loading Complete", status: "Done" },
      { time: "02:00 PM", event: "Route Deviation Alert", status: "Warning" }
    ]
  }
];

// ==========================================
// 2. SUB-COMPONENTS (FIXED FOCUS ARCHITECTURE)
// ==========================================

// --- A. LOGIN / AUTH VIEW ---
const LoginView = ({ onLogin, onRegister, onGuestLogin }) => {
  const [mode, setMode] = useState('LOGIN'); // LOGIN, REGISTER, FORGOT
  const [portal, setPortal] = useState('COMMAND'); // COMMAND (Owner), OPERATOR (User)
  const [form, setForm] = useState({ name: '', email: '', password: '', company: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'LOGIN') {
      onLogin(form.email, form.password, portal);
    } else if (mode === 'REGISTER') {
      onRegister(form, portal);
    } else if (mode === 'FORGOT') {
      alert(`Encrypted recovery link sent to: ${form.email}`);
      setMode('LOGIN');
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[4rem] shadow-2xl relative z-10 overflow-hidden">
        
        {/* Left Panel: Brand & Info */}
        <div className="p-16 bg-blue-600/5 flex flex-col justify-between relative border-r border-white/5">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
           <div>
             <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-blue-600/40 mb-8">
               <span className="text-black text-5xl font-black italic">L</span>
             </div>
             <h1 className="text-5xl font-black italic tracking-tighter text-white uppercase leading-none mb-4">LOGITRAK<span className="text-[#2563eb]">.PRO</span></h1>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Enterprise Logistics OS v6.0</p>
           </div>
           
           <div className="space-y-8 relative z-10">
              <div className="flex items-center gap-5">
                 <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20"><ShieldCheck size={28}/></div>
                 <div><h4 className="text-white font-bold uppercase text-xs tracking-widest">Command Center</h4><p className="text-gray-500 text-[10px] mt-1">Admin Control & User Oversight</p></div>
              </div>
              <div className="flex items-center gap-5">
                 <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20"><Globe size={28}/></div>
                 <div><h4 className="text-white font-bold uppercase text-xs tracking-widest">Global Tracking</h4><p className="text-gray-500 text-[10px] mt-1">Real-Time Satellite Feed</p></div>
              </div>
           </div>
        </div>

        {/* Right Panel: Auth Forms */}
        <div className="p-16 flex flex-col justify-center">
           {/* Portal Toggle */}
           {mode !== 'FORGOT' && (
             <div className="flex bg-white/5 p-1 rounded-2xl mb-10 border border-white/5">
               <button onClick={() => setPortal('COMMAND')} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${portal === 'COMMAND' ? 'bg-blue-600 text-white shadow-xl' : 'text-gray-500 hover:text-white'}`}>
                 <LockKeyhole size={14}/> Command Center
               </button>
               <button onClick={() => setPortal('OPERATOR')} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${portal === 'OPERATOR' ? 'bg-white text-black shadow-xl' : 'text-gray-500 hover:text-white'}`}>
                 <UserCog size={14}/> Operator Portal
               </button>
             </div>
           )}

           <div className="mb-8">
             <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">
               {mode === 'LOGIN' ? (portal === 'COMMAND' ? 'Admin Access' : 'Staff Login') : mode === 'REGISTER' ? 'Provision Account' : 'Recovery Mode'}
             </h2>
             <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">Secure Gateway Protocol</p>
           </div>

           <form onSubmit={handleSubmit} className="space-y-5">
             {mode === 'REGISTER' && (
               <>
                 <div className="space-y-2">
                   <label className="text-[9px] font-black uppercase text-gray-600 ml-2">Full Name</label>
                   <input name="name" onChange={handleChange} required placeholder="OFFICER NAME" className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-white text-xs font-bold outline-none focus:border-blue-600 transition-all placeholder:text-gray-800" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[9px] font-black uppercase text-gray-600 ml-2">Organization</label>
                   <input name="company" onChange={handleChange} required placeholder="COMPANY NAME" className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-white text-xs font-bold outline-none focus:border-blue-600 transition-all placeholder:text-gray-800" />
                 </div>
               </>
             )}
             
             <div className="space-y-2">
               <label className="text-[9px] font-black uppercase text-gray-600 ml-2">Email Identity</label>
               <input name="email" type="email" onChange={handleChange} required placeholder="USER@DOMAIN.COM" className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-white text-xs font-bold outline-none focus:border-blue-600 transition-all placeholder:text-gray-800" />
             </div>

             {mode !== 'FORGOT' && (
               <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase text-gray-600 ml-2">Access Key</label>
                 <input name="password" type="password" onChange={handleChange} required placeholder="PASSWORD" className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-white text-xs font-bold outline-none focus:border-blue-600 transition-all placeholder:text-gray-800" />
               </div>
             )}

             <button className="w-full bg-white text-black py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-blue-600 hover:text-white transition-all shadow-xl mt-4 border border-white/20">
               {mode === 'LOGIN' ? 'Initiate Uplink' : mode === 'REGISTER' ? 'Create Credentials' : 'Send Reset Link'}
             </button>
           </form>

           <div className="mt-8 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-gray-500">
             {mode === 'LOGIN' ? (
               <>
                 <button onClick={() => setMode('REGISTER')} className="hover:text-white transition-colors">Create Account</button>
                 <button onClick={() => setMode('FORGOT')} className="hover:text-white transition-colors">Forgot Password?</button>
               </>
             ) : (
               <button onClick={() => setMode('LOGIN')} className="w-full text-center hover:text-white transition-colors">Return to Login</button>
             )}
           </div>

           {/* Guest Tracking */}
           {mode === 'LOGIN' && (
             <div className="mt-10 pt-8 border-t border-white/5">
                <p className="text-[8px] font-black uppercase text-center text-gray-700 mb-4">Public Asset Tracking</p>
                <div className="relative group">
                  <input 
                    onKeyDown={(e) => e.key === 'Enter' && onGuestLogin(e.target.value)} 
                    placeholder="ENTER SMART ID & PRESS ENTER" 
                    className="w-full bg-black border border-white/10 rounded-2xl py-4 px-14 text-center text-[10px] font-black tracking-[0.2em] focus:border-blue-600 outline-none transition-all uppercase placeholder:text-gray-800 text-white shadow-inner" 
                  />
                  <Zap className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-600 group-hover:animate-bounce" size={16}/>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

// --- B. MANUAL REGISTRY MODAL (FIXED FOCUS) ---
const ManualRegistryModal = ({ isOpen, onClose, onSubmit, editingData }) => {
  const [formData, setFormData] = useState({
    consignor: '', product: '', hsnCode: '', invoiceType: 'Commercial Invoice',
    docType: 'Bill of Lading', consignee: '', transportName: '', contactNumber: '',
    vehicleNumber: '', location: '', status: 'Area Port Dispatched', value: '', 
    currency: 'USD', mode: 'Road', customNotes: ''
  });

  // Load data when editing
  useEffect(() => {
    if (editingData) {
      setFormData(editingData);
    } else {
      setFormData({
        consignor: '', product: '', hsnCode: '', invoiceType: 'Commercial Invoice',
        docType: 'Bill of Lading', consignee: '', transportName: '', contactNumber: '',
        vehicleNumber: '', location: '', status: 'Area Port Dispatched', value: '', 
        currency: 'USD', mode: 'Road', customNotes: ''
      });
    }
  }, [editingData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-[6000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
      <div className="bg-[#080808] border border-white/10 w-full max-w-6xl rounded-[4rem] flex flex-col max-h-[90vh] shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="p-10 border-b border-white/5 flex justify-between items-center bg-black/50 shrink-0">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-blue-600 rounded-2xl shadow-xl shadow-blue-600/20"><Plus className="text-white" size={32} /></div>
            <div>
              <h3 className="text-4xl font-black italic text-white uppercase tracking-tighter">{editingData ? 'UPDATE RECORD' : 'NEW ASSET REGISTRY'}</h3>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em]">Manual Entry Protocol</p>
            </div>
          </div>
          <button onClick={onClose} className="p-5 hover:bg-red-500/10 rounded-full text-gray-500 hover:text-red-500 transition-all"><X size={40}/></button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Column 1: Origin */}
            <div className="space-y-8">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block border-b border-white/5 pb-2">ORIGIN DATA</label>
              <div className="space-y-2">
                <p className="text-[9px] font-bold text-blue-500 uppercase">Consignor Entity</p>
                <input name="consignor" value={formData.consignor} onChange={handleChange} placeholder="COMPANY NAME" className="w-full bg-black border border-white/10 p-6 rounded-2xl text-white text-md font-black uppercase outline-none focus:border-blue-600 transition-all" />
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-bold text-gray-500 uppercase">Product Description</p>
                <input name="product" value={formData.product} onChange={handleChange} placeholder="PRODUCT NAME" className="w-full bg-black border border-white/10 p-6 rounded-2xl text-white text-md font-black uppercase outline-none focus:border-blue-600 transition-all" />
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-bold text-gray-500 uppercase">HSN Code</p>
                <input name="hsnCode" value={formData.hsnCode} onChange={handleChange} placeholder="6-DIGIT CODE" className="w-full bg-black border border-white/10 p-6 rounded-2xl text-white font-black outline-none focus:border-blue-600 shadow-inner" />
              </div>
            </div>

            {/* Column 2: Transit */}
            <div className="space-y-8">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block border-b border-white/5 pb-2">TRANSIT SPECS</label>
              <div className="space-y-2">
                <p className="text-[9px] font-bold text-blue-500 uppercase">Mode of Transport</p>
                <select name="mode" value={formData.mode} onChange={handleChange} className="w-full bg-black border border-white/10 p-6 rounded-2xl text-white text-xs font-black outline-none uppercase cursor-pointer hover:border-blue-600">
                  <option>Road</option><option>Air</option><option>Marine</option><option>Rail</option>
                </select>
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-bold text-gray-500 uppercase">Document Type</p>
                <select name="docType" value={formData.docType} onChange={handleChange} className="w-full bg-black border border-white/10 p-6 rounded-2xl text-white text-xs font-black outline-none uppercase cursor-pointer">
                  <option>Bill of Lading</option><option>Airway Bill</option><option>Transport LR</option>
                </select>
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-bold text-gray-500 uppercase">Vehicle / Vessel ID</p>
                <input name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} placeholder="ID NUMBER" className="w-full bg-black border border-white/10 p-6 rounded-2xl text-white font-black uppercase outline-none" />
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-bold text-gray-500 uppercase">Carrier Name</p>
                <input name="transportName" value={formData.transportName} onChange={handleChange} placeholder="CARRIER NAME" className="w-full bg-black border border-white/10 p-6 rounded-2xl text-white font-black uppercase outline-none" />
              </div>
            </div>

            {/* Column 3: Destination */}
            <div className="space-y-8">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block border-b border-white/5 pb-2">FINALITY & VALUE</label>
              <div className="space-y-2">
                <p className="text-[9px] font-bold text-blue-500 uppercase">Consignee Target</p>
                <input name="consignee" value={formData.consignee} onChange={handleChange} placeholder="CONSIGNEE NAME" className="w-full bg-black border border-white/10 p-6 rounded-2xl text-white text-md font-black uppercase outline-none focus:border-blue-600" />
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-bold text-gray-500 uppercase">Asset Valuation</p>
                <div className="flex gap-4">
                  <select name="currency" value={formData.currency} onChange={handleChange} className="bg-black border border-white/10 p-6 rounded-2xl text-blue-500 font-black outline-none uppercase cursor-pointer">
                    <option>USD</option><option>EUR</option><option>INR</option><option>AED</option>
                  </select>
                  <input name="value" value={formData.value} onChange={handleChange} placeholder="0.00" className="flex-1 bg-black border border-white/10 p-6 rounded-2xl text-white text-2xl font-black italic outline-none focus:border-blue-600" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-bold text-gray-500 uppercase">Shipment Status</p>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-black border border-white/10 p-6 rounded-2xl text-white font-black outline-none uppercase">
                  <option>Area Port Dispatched</option><option>In Transit</option><option>Delivered</option>
                  <option>Delayed</option>
                  <option>Customs Hold</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-10 border-t border-white/5 bg-black/50 flex justify-end gap-6 shrink-0">
           <button onClick={onClose} className="px-12 py-6 rounded-2xl text-gray-500 font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all">ABORT ENTRY</button>
           <button onClick={() => onSubmit(formData)} className="px-16 py-6 bg-blue-600 rounded-2xl text-white font-black uppercase text-[10px] tracking-[0.4em] shadow-2xl hover:bg-blue-500 transition-all transform active:scale-95 flex items-center gap-4">
             <Save size={20}/> {editingData ? 'UPDATE DATABASE' : 'INITIALIZE REGISTRY'}
           </button>
        </div>
      </div>
    </div>
  );
};

// --- C. BATCH VALIDATOR MODAL ---
const BatchValidatorModal = ({ isOpen, onClose, batchData, onFinalize }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[5000] bg-black/98 backdrop-blur-5xl flex items-center justify-center p-8 animate-in zoom-in duration-300">
      <div className="bg-[#080808] border border-white/10 w-full max-w-7xl rounded-[5rem] p-20 relative flex flex-col h-[85vh] shadow-[0_0_100px_rgba(0,0,0,1)]">
        <div className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-8">
            <div className="p-6 bg-blue-600 rounded-[2.5rem] shadow-2xl shadow-blue-600/40">
              <Database size={42} className="text-black" />
            </div>
            <div>
              <h3 className="text-6xl font-black italic uppercase tracking-tighter text-white">MANIFEST <span className="text-blue-500">VALIDATOR</span></h3>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 mt-2">AI HEURISTICS: Scanning for compliance errors & HSN anomalies</p>
            </div>
          </div>
          <button onClick={onClose} className="p-6 bg-white/5 rounded-full text-gray-500 hover:text-red-500 transition-all hover:bg-red-500/10"><X size={48}/></button>
        </div>

        <div className="flex-1 overflow-y-auto mb-16 border border-white/5 rounded-[4rem] bg-black shadow-inner custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/[0.02] sticky top-0 border-b border-white/5 backdrop-blur-md">
              <tr>
                <th className="p-10 text-[10px] font-black text-gray-500 uppercase tracking-widest">Entry Entity</th>
                <th className="p-10 text-[10px] font-black text-gray-500 uppercase tracking-widest">Asset Detail</th>
                <th className="p-10 text-[10px] font-black text-gray-500 uppercase tracking-widest">HSN Status</th>
                <th className="p-10 text-[10px] font-black text-gray-500 uppercase tracking-widest">Consignee</th>
                <th className="p-10 text-[10px] font-black text-gray-500 uppercase tracking-widest">Heuristic Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {batchData.map((row, i) => (
                <tr key={i} className={`${row.status === 'Error' ? 'bg-red-500/[0.03]' : row.status === 'Warning' ? 'bg-amber-500/[0.03]' : ''} hover:bg-white/[0.02] transition-colors`}>
                  <td className="p-10">
                    <p className="text-[12px] font-black text-white uppercase">{row.consignor}</p>
                    <p className="text-[9px] text-gray-700 font-black uppercase mt-1">{row.mode} TRANSIT</p>
                  </td>
                  <td className="p-10 text-[12px] font-black text-gray-400 uppercase italic tracking-tighter">{row.product}</td>
                  <td className="p-10">
                    {row.hsnCode ? <span className="text-blue-500 font-black text-[12px]">{row.hsnCode}</span> : <div className="flex items-center gap-2 text-red-500 font-black text-[10px] animate-pulse"><AlertTriangle size={14}/> HSN_REQUIRED</div>}
                  </td>
                  <td className="p-10">{row.consignee ? <p className="text-[12px] font-black text-white uppercase">{row.consignee}</p> : <span className="text-red-500/50 font-black text-[10px] uppercase underline decoration-dotted">Null_Target</span>}</td>
                  <td className="p-10">
                    <div className={`px-5 py-3 rounded-2xl border text-[9px] font-black uppercase inline-flex items-center gap-4 ${row.status === 'Valid' ? 'text-emerald-500 bg-emerald-500/5 border-emerald-500/20' : 'text-red-500 bg-red-500/5 border-red-500/20'}`}>
                      {row.status === 'Valid' ? <CheckCircle size={14}/> : <FileWarning size={14}/>} {row.error || 'Passed Security Protocols'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-10">
          <button onClick={onClose} className="flex-1 py-10 rounded-[3rem] border border-white/10 text-[12px] font-black uppercase tracking-[0.4em] text-gray-600 hover:text-white hover:bg-white/5 transition-all">Purge Manifest</button>
          <button onClick={onFinalize} disabled={!batchData.some(d => d.status === 'Valid')} className="flex-[2] py-10 rounded-[3rem] bg-blue-600 text-white text-[12px] font-black uppercase tracking-[0.5em] flex items-center justify-center gap-6 hover:bg-blue-500 shadow-2xl shadow-blue-600/40 disabled:opacity-50 disabled:cursor-not-allowed group transition-all">
            <ShieldCheck size={28} className="group-hover:rotate-12 transition-transform"/> Finalize & Sync
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. MAIN APPLICATION COMPONENT
// ==========================================

const App = () => {
  // --- Global App State ---
  const [view, setView] = useState('login'); 
  const [authMode, setAuthMode] = useState(null); 
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  // --- Data State ---
  const [shipments, setShipments] = useState(INITIAL_SHIPMENTS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [editingShipment, setEditingShipment] = useState(null);
  const [customColumns, setCustomColumns] = useState([]);
  
  // --- Modal Visibility State ---
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchData, setBatchData] = useState([]);

  // --- Handlers ---

  const handleLogin = (email, pass, portal) => {
    // Case insensitive check
    const normalizedEmail = email.toLowerCase();
    
    // Owner Override
    if (portal === 'COMMAND' && normalizedEmail === 'sambond0000@gmail.com' && pass === 'admin 123') {
      setCurrentUser(INITIAL_USERS[0]); setAuthMode('OWNER'); setView('dashboard'); return;
    }

    // Standard User Check
    const found = users.find(u => u.email.toLowerCase() === normalizedEmail && u.password === pass);
    if (found) {
      if (portal === 'COMMAND' && found.role !== 'OWNER') {
        alert("ACCESS DENIED: COMMAND CENTER PRIVILEGES REQUIRED");
        return;
      }
      setCurrentUser(found); setAuthMode('USER'); setView('dashboard');
    } else {
      alert("AUTHENTICATION FAILED: INVALID CREDENTIALS");
    }
  };

  const handleRegister = (formData, portal) => {
    const newUser = {
      id: `U-${Math.floor(Math.random() * 1000)}`,
      name: formData.name.toUpperCase(),
      email: formData.email,
      password: formData.password,
      role: portal === 'COMMAND' ? 'OWNER' : 'USER',
      company: formData.company.toUpperCase(),
      permissions: 'VIEW_EDIT',
      lastLogin: 'JUST NOW',
      status: 'ACTIVE'
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setAuthMode(portal === 'COMMAND' ? 'OWNER' : 'USER');
    setView('dashboard');
  };

  const handleGuestLogin = (smartID) => {
    const found = shipments.find(s => s.id === smartID?.toUpperCase());
    if (found) { setSelectedShipment(found); setView('tracking'); }
    else alert("INVALID SMART ID: TRACE FAILED");
  };

  const handleManualEntrySubmit = (data) => {
    if (editingShipment) {
      // Edit Mode
      const updatedList = shipments.map(s => s.id === editingShipment.id ? { ...s, ...data } : s);
      setShipments(updatedList);
      setEditingShipment(null);
    } else {
      // Create Mode
      const newEntry = {
        ...data,
        id: generateSmartID(),
        aiRisk: "Low",
        progress: 0,
        priority: "Normal",
        geminiSummary: "Manual Registry Initialized. Pending Satellite Uplink.",
        history: [{ time: getCurrentTime(), event: "Entry Initialized via CRM", status: "Done" }]
      };
      setShipments([newEntry, ...shipments]);
    }
    setIsEntryModalOpen(false);
  };

  const deleteShipment = (id) => {
    if (window.confirm("CONFIRM DELETION: Purge this asset from global ledger?")) {
      setShipments(shipments.filter(s => s.id !== id));
    }
  };

  const openEdit = (shipment) => {
    setEditingShipment(shipment);
    setIsEntryModalOpen(true);
  };

  const handleBatchTrigger = () => {
    const rawSimulation = [
      { consignor: 'APPLE INC', product: 'IPHONE 15 PRO', hsnCode: '8517', consignee: 'RELIANCE RETAIL', vehicle: 'TR-772', mode: 'Road', value: '120000', status: 'Valid' },
      { consignor: 'TESLA ENERGY', product: 'POWERWALL 3', hsnCode: '', consignee: 'SOLAR GRID', vehicle: 'MS-VESSEL', mode: 'Marine', value: '55000', status: 'Error', error: 'HSN_CODE_MISSING' },
      { consignor: 'NASA JPL', product: 'ROVER PARTS', hsnCode: '8803', consignee: 'SPACE X', vehicle: 'FALCON-9', mode: 'Air', value: '1000000', status: 'Valid' }
    ];
    setBatchData(rawSimulation);
    setIsBatchModalOpen(true);
  };

  const finalizeBatchSync = () => {
    const validOnly = batchData.filter(d => d.status === 'Valid').map(d => ({
      ...INITIAL_SHIPMENTS[0], id: generateSmartID(), consignor: d.consignor, product: d.product,
      hsnCode: d.hsnCode, consignee: d.consignee, vehicleNumber: d.vehicle, mode: d.mode, value: d.value,
      progress: 0, status: 'Registry Created', history: [{ time: getCurrentTime(), event: "Batch Import Synced", status: "Done" }]
    }));
    setShipments([...validOnly, ...shipments]);
    setIsBatchModalOpen(false);
  };

  const getTransportIcon = (mode) => {
    switch(mode) {
      case 'Air': return <Plane size={18} />;
      case 'Marine': return <Ship size={18} />;
      case 'Rail': return <Train size={18} />;
      default: return <Truck size={18} />;
    }
  };

  // --- TAB CONTENT RENDERER ---
  const renderTabContent = () => {
    if (activeTab === 'dashboard') {
      return (
        <div className="grid grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
          <div className="bg-[#080808] border border-white/5 p-10 rounded-[3.5rem] hover:border-blue-600 transition-all cursor-default group">
            <div className="flex justify-between items-start mb-6">
              <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Global Inventory</p>
              <Package className="text-blue-500 group-hover:scale-125 transition-transform" size={28}/>
            </div>
            <h4 className="text-6xl font-black italic tracking-tighter uppercase">{shipments.length}</h4>
          </div>
          <div className="bg-[#080808] border border-white/5 p-10 rounded-[3.5rem] hover:border-amber-500 transition-all cursor-default group">
            <div className="flex justify-between items-start mb-6">
              <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Live Transit</p>
              <Truck className="text-amber-500 group-hover:translate-x-2 transition-transform" size={28}/>
            </div>
            <h4 className="text-6xl font-black italic tracking-tighter uppercase">{shipments.filter(s => s.status === 'In Transit').length}</h4>
          </div>
          <div className="col-span-2 bg-[#080808] border border-white/5 p-10 rounded-[3.5rem] hover:border-purple-600 transition-all cursor-default group flex items-center justify-between">
             <div>
                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-4">Total Asset Valuation</p>
                <h4 className="text-6xl font-black italic tracking-tighter uppercase">{formatCurrency(shipments.reduce((acc, s) => acc + parseInt(s.value || 0), 0))}</h4>
             </div>
             <Activity size={60} className="text-purple-600 animate-pulse opacity-50"/>
          </div>
          
          {/* OWNER VIEW: USER MANAGEMENT TABLE */}
          {authMode === 'OWNER' && (
            <div className="col-span-4 bg-blue-900/5 border border-blue-600/10 rounded-[4rem] p-12 mt-8">
               <div className="flex items-center gap-6 mb-8">
                 <ShieldCheck size={32} className="text-blue-500"/>
                 <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">Security & User Protocols</h3>
               </div>
               <table className="w-full text-left">
                 <thead className="text-[9px] font-black text-gray-500 uppercase border-b border-white/5">
                   <tr><th className="pb-4">User Identity</th><th className="pb-4">Role</th><th className="pb-4">Permissions</th><th className="pb-4">Last Login</th><th className="pb-4">Status</th></tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                   {users.map(u => (
                     <tr key={u.id}>
                       <td className="py-4 font-bold text-xs text-white">{u.name} <span className="text-gray-600">({u.email})</span></td>
                       <td className="py-4 text-xs text-blue-400 font-black">{u.role}</td>
                       <td className="py-4 text-xs text-gray-400">{u.permissions}</td>
                       <td className="py-4 text-xs text-gray-400">{u.lastLogin}</td>
                       <td className="py-4"><span className="text-[9px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded font-black">{u.status}</span></td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
          )}

          {/* BATCH UPLOAD */}
          <div onClick={handleBatchTrigger} className="col-span-4 group border-2 border-dashed border-white/10 rounded-[4rem] p-12 flex items-center justify-center gap-8 bg-white/[0.01] hover:bg-blue-600/[0.02] hover:border-blue-600/30 transition-all cursor-pointer relative overflow-hidden mt-8">
              <FileUp size={48} className="text-gray-600 group-hover:text-blue-500" />
              <div><h5 className="text-xl font-black uppercase italic tracking-widest text-white mb-1">Bulk Manifest Ingestion System</h5><p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Drag CSV/Excel File</p></div>
          </div>
        </div>
      );
    }

    if (activeTab === 'ledger') {
      return (
        <div className="bg-[#080808] border border-white/5 rounded-[4rem] overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-10 duration-500">
          <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <div className="flex gap-4">
              <button onClick={() => { setEditingShipment(null); setIsEntryModalOpen(true); }} className="bg-blue-600 px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-blue-500 shadow-2xl shadow-blue-600/20 transition-all active:scale-95">
                <Plus size={18}/> Manual Registry
              </button>
              <button onClick={() => { const n = prompt("Column Name:"); if(n) setCustomColumns([...customColumns, n.toUpperCase()]); }} className="bg-white/5 border border-white/10 px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-white/10 transition-all">
                <Layers size={18}/> Add Custom Attribute
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" size={18}/>
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="FILTER GLOBAL LEDGER..." className="bg-black border border-white/10 rounded-2xl py-5 pl-16 pr-8 text-xs font-black outline-none focus:border-blue-500 w-[400px] uppercase text-white shadow-inner tracking-widest"/>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/[0.03] text-[10px] font-black uppercase text-gray-500 tracking-[0.3em] border-b border-white/5">
                <tr>
                  <th className="p-8">Smart ID</th><th className="p-8">Consignor</th><th className="p-8">Consignee</th><th className="p-8">Transport</th><th className="p-8">Value</th>
                  {customColumns.map(c => <th key={c} className="p-8 text-blue-500">{c}</th>)}
                  <th className="p-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {shipments.filter(s => s.id.includes(searchQuery.toUpperCase()) || s.consignor.includes(searchQuery.toUpperCase())).map((s, idx) => (
                  <tr key={idx} className="hover:bg-blue-600/[0.03] transition-all group">
                    <td className="p-8 font-black text-blue-600 italic text-xl cursor-pointer" onClick={() => setSelectedShipment(s)}>{s.id}</td>
                    <td className="p-8 text-xs font-bold uppercase">{s.consignor}</td>
                    <td className="p-8 text-xs font-bold uppercase">{s.consignee}</td>
                    <td className="p-8"><div className="flex items-center gap-3"><div className="p-2 bg-white/5 rounded-lg text-blue-500">{getTransportIcon(s.mode)}</div><span className="text-xs font-bold">{s.transportName}</span></div></td>
                    <td className="p-8 font-black italic text-lg">{formatCurrency(s.value, s.currency)}</td>
                    {customColumns.map(c => <td key={c} className="p-8 text-[10px] text-gray-500">--</td>)}
                    <td className="p-8 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(s)} className="p-3 bg-white/5 rounded-xl hover:bg-white hover:text-black transition-all"><Edit size={16}/></button>
                        <button onClick={() => deleteShipment(s.id)} className="p-3 bg-white/5 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16}/></button>
                        <button onClick={() => setSelectedShipment(s)} className="p-3 bg-white/5 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"><Eye size={16}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (activeTab === 'map') {
      return (
        <div className="h-[75vh] bg-[#111] rounded-[4rem] border border-white/5 relative overflow-hidden shadow-2xl flex items-center justify-center">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent opacity-50" />
           <div className="text-center space-y-6 relative z-10">
             <div className="relative inline-block">
               <Globe size={120} className="text-blue-600 animate-pulse opacity-80" />
               <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full animate-ping" />
             </div>
             <div>
               <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">Global Asset Map</h3>
               <p className="text-[10px] uppercase tracking-[0.5em] text-gray-500 mt-2">Live Satellite Uplink Active // Tracking {shipments.length} Nodes</p>
             </div>
           </div>
           {/* Simulated Map Markers */}
           {shipments.map((s, i) => (
             <div key={i} className="absolute w-4 h-4 bg-blue-500 rounded-full animate-pulse shadow-[0_0_20px_#2563eb]" style={{ top: `${20 + (i*10)}%`, left: `${30 + (i*15)}%` }} />
           ))}
        </div>
      );
    }

    if (activeTab === 'risk') {
      return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10">
           <div className="p-16 bg-red-600/5 rounded-[4rem] border border-red-600/10 flex items-center gap-12">
              <ShieldAlert size={80} className="text-red-600"/>
              <div>
                  <h3 className="text-4xl font-black italic text-red-500 mb-4 uppercase tracking-tighter">Heuristic Risk Dashboard</h3>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs leading-relaxed max-w-2xl">
                      AI-driven predictive analysis of global shipping corridors. Scan active for South China Sea and Red Sea volatility.
                  </p>
              </div>
           </div>
           <div className="grid grid-cols-3 gap-8">
               {[1,2,3].map(i => (
                   <div key={i} className="bg-[#080808] border border-white/5 p-8 rounded-[3rem]">
                       <div className="flex justify-between mb-4"><span className="text-red-500 font-black text-[10px] uppercase tracking-widest">High Alert</span><span className="text-gray-600 text-[10px]">ZONE {i}</span></div>
                       <p className="text-white font-black uppercase text-lg">Red Sea Corridor</p>
                       <p className="text-gray-500 text-xs mt-2">Rebel activity detected near Bab-el-Mandeb strait. Reroute advised.</p>
                   </div>
               ))}
           </div>
        </div>
      );
    }

    if (activeTab === 'settings') {
      return (
        <div className="bg-[#080808] border border-white/5 rounded-[4rem] p-20 max-w-4xl mx-auto">
           <div className="flex items-center gap-8 mb-12">
               <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center text-4xl font-black text-black">{currentUser?.name[0]}</div>
               <div>
                   <h3 className="text-4xl font-black uppercase italic text-white">{currentUser?.name}</h3>
                   <p className="text-blue-500 font-bold uppercase tracking-widest mt-2">{currentUser?.role} // {currentUser?.company}</p>
               </div>
           </div>
           <div className="space-y-4">
               {['Data Sync', 'MFA Security', 'API Access', 'Audit Logs'].map(setting => (
                 <div key={setting} className="bg-white/5 p-6 rounded-2xl flex justify-between items-center group cursor-pointer hover:bg-white/10 transition-all">
                    <span className="text-xs font-black uppercase text-gray-400 group-hover:text-white">{setting}</span>
                    <ChevronRight size={16} className="text-gray-600 group-hover:text-blue-500"/>
                 </div>
               ))}
           </div>
        </div>
      );
    }
  };

  return (
    <div className="bg-[#020202] min-h-screen selection:bg-blue-600 selection:text-white flex flex-col font-sans">
      {view === 'login' ? (
        <LoginView onLogin={handleLogin} onRegister={handleRegister} onGuestLogin={handleGuestLogin} />
      ) : (
        <>
          <header className="px-12 py-8 border-b border-white/5 bg-black/40 backdrop-blur-3xl sticky top-0 z-[100] flex justify-between items-center">
            <div className="flex items-center gap-8">
              <div className="bg-blue-600 p-2 rounded-lg font-black italic text-black text-xl">L</div>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">LOGITRAK <span className="text-[#2563eb]">.PRO</span></h2>
              <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">Online</span>
              </div>
            </div>

            {view === 'dashboard' && (
              <nav className="flex gap-12">
                {['Dashboard', 'Ledger', 'Map Feed', 'Risk Intelligence', 'Settings'].map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab.split(' ')[0].toLowerCase())} 
                    className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === tab.split(' ')[0].toLowerCase() ? 'text-blue-600' : 'text-gray-500 hover:text-white'}`}
                  >
                    {tab}
                    {activeTab === tab.split(' ')[0].toLowerCase() && <div className="absolute -bottom-10 left-0 w-full h-[2px] bg-blue-600" />}
                  </button>
                ))}
              </nav>
            )}

            <div className="flex items-center gap-6 border-l border-white/10 pl-8">
              {view === 'dashboard' && (
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase leading-none text-white">{currentUser?.name}</p>
                  <p className="text-[8px] text-blue-500 font-bold uppercase tracking-widest mt-1">{currentUser?.role}</p>
                </div>
              )}
              <button onClick={() => setView('login')} className="p-3 bg-red-500/5 text-gray-600 hover:text-red-500 rounded-xl transition-all border border-white/5 hover:border-red-500/50"><LogOut size={20}/></button>
            </div>
          </header>

          <main className="p-12 flex-1">
             {view === 'tracking' && selectedShipment ? (
                // TRACKING VIEW (For Guest or Detail Drilldown)
                <div className="w-full max-w-[1400px] mx-auto bg-[#050505] p-24 rounded-[4rem] border border-white/5 relative shadow-2xl">
                  <button onClick={() => setView(currentUser ? 'dashboard' : 'login')} className="absolute top-16 right-16 text-red-500 hover:scale-125 transition-transform"><X size={72}/></button>
                  <div className="mb-24">
                    <p className="text-[12px] font-black text-blue-600 uppercase tracking-[0.8em] mb-4">Enterprise Tracking active</p>
                    <h2 className="text-[8rem] font-black italic text-white tracking-tighter uppercase leading-none select-none opacity-90">{selectedShipment.id}</h2>
                  </div>
                  <div className="grid grid-cols-12 gap-20">
                    <div className="col-span-8 space-y-20">
                      <div className="bg-[#111] h-[500px] rounded-[3rem] border border-white/5 relative overflow-hidden flex items-center justify-center">
                         <Globe size={150} className="text-blue-600 animate-pulse"/>
                      </div>
                      <div className="bg-white/[0.02] p-20 rounded-[3rem] border border-white/5">
                        <h4 className="text-[16px] font-black text-blue-500 uppercase mb-8 tracking-[0.6em]"><Smartphone size={28} className="inline mr-4"/> GEMINI-ULTRA ANALYSIS</h4>
                        <p className="text-4xl font-black italic text-white/90 leading-[1.2]">"{selectedShipment.geminiSummary}"</p>
                      </div>
                    </div>
                    <div className="col-span-4 space-y-12">
                      <div className="bg-[#080808] border border-white/5 p-16 rounded-[3rem] space-y-10">
                         <h4 className="text-[12px] font-black text-gray-500 uppercase tracking-[0.4em]">ENTITY PROFILES</h4>
                         <div><p className="text-[10px] font-black text-blue-500 uppercase mb-2">Origin</p><p className="text-2xl font-black text-white">{selectedShipment.consignor}</p></div>
                         <div><p className="text-[10px] font-black text-blue-500 uppercase mb-2">Target</p><p className="text-2xl font-black text-white">{selectedShipment.consignee}</p></div>
                      </div>
                    </div>
                  </div>
                </div>
             ) : (
                renderTabContent()
             )}
          </main>
        </>
      )}

      {/* OVERLAYS */}
      <ManualRegistryModal 
        isOpen={isEntryModalOpen} 
        onClose={() => { setIsEntryModalOpen(false); setEditingShipment(null); }} 
        onSubmit={handleManualEntrySubmit} 
        editingData={editingShipment}
      />
      <BatchValidatorModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        batchData={batchData}
        onFinalize={finalizeBatchSync}
      />
      
      {/* Detail Overlay for Dashboard */}
      {(selectedShipment && view === 'dashboard') && (
        <div className="fixed inset-0 z-[6000] bg-black/98 backdrop-blur-5xl flex justify-end animate-in slide-in-from-right duration-500">
          <div className="w-full max-w-[1000px] bg-[#050505] p-20 overflow-y-auto border-l border-white/5 relative shadow-[-50px_0_150px_rgba(0,0,0,0.9)] custom-scrollbar">
            <button onClick={() => setSelectedShipment(null)} className="absolute top-10 right-10 text-red-500 hover:scale-125 transition-transform"><X size={48}/></button>
            <h2 className="text-6xl font-black italic text-white tracking-tighter mb-12">{selectedShipment.id}</h2>
            <div className="space-y-12">
               <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10">
                  <h4 className="text-blue-500 font-black uppercase text-xs mb-6">Live Status</h4>
                  <p className="text-3xl text-white font-bold">{selectedShipment.status}</p>
                  <div className="w-full bg-black h-4 rounded-full mt-6 overflow-hidden"><div className="h-full bg-blue-600" style={{ width: `${selectedShipment.progress}%` }}/></div>
               </div>
               <div className="grid grid-cols-2 gap-8">
                  <div className="bg-white/5 p-8 rounded-[2rem]"><p className="text-gray-500 text-xs font-black uppercase">Cargo</p><p className="text-xl text-white font-bold mt-2">{selectedShipment.product}</p></div>
                  <div className="bg-white/5 p-8 rounded-[2rem]"><p className="text-gray-500 text-xs font-black uppercase">Value</p><p className="text-xl text-emerald-500 font-bold mt-2">{formatCurrency(selectedShipment.value, selectedShipment.currency)}</p></div>
               </div>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #2563eb; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;