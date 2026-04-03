import React, { useState, useEffect } from 'react';
import { Save, Truck, Banknote, Bell, Shield } from 'lucide-react';
import axios from 'axios';

const Settings = () => {
  const [settings, setSettings] = useState({
    deliveryCharge: 10,
    codEnabled: true,
    shopOpen: true
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('/api/settings');
        setSettings(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.put('/api/settings', settings);
      alert('Settings saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-3xl font-black">Shop Settings</h2>
        <p className="text-zinc-500">Configure your business rules and delivery options</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-zinc-100 space-y-8">
          <h3 className="text-xl font-bold flex items-center">
            <Truck className="mr-3 text-red-600" /> Delivery Settings
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-500 uppercase">Home Delivery Charge (₹)</label>
              <input 
                type="number" 
                className="w-full p-4 rounded-2xl border-zinc-200 focus:ring-red-500"
                value={settings.deliveryCharge}
                onChange={(e) => setSettings({...settings, deliveryCharge: parseInt(e.target.value)})}
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50">
              <div className="space-y-1">
                <p className="font-bold">Enable Cash on Delivery</p>
                <p className="text-xs text-zinc-500">Allow customers to pay at their doorstep</p>
              </div>
              <button 
                onClick={() => setSettings({...settings, codEnabled: !settings.codEnabled})}
                className={`w-14 h-8 rounded-full transition-all relative ${settings.codEnabled ? 'bg-red-600' : 'bg-zinc-300'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.codEnabled ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-zinc-100 space-y-8">
          <h3 className="text-xl font-bold flex items-center">
            <Shield className="mr-3 text-red-600" /> Shop Status
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50">
              <div className="space-y-1">
                <p className="font-bold">Shop Open for Orders</p>
                <p className="text-xs text-zinc-500">Temporarily disable online ordering</p>
              </div>
              <button 
                onClick={() => setSettings({...settings, shopOpen: !settings.shopOpen})}
                className={`w-14 h-8 rounded-full transition-all relative ${settings.shopOpen ? 'bg-emerald-500' : 'bg-zinc-300'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.shopOpen ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition-all flex items-center justify-center shadow-lg shadow-red-100 disabled:opacity-50"
            >
              <Save className="w-5 h-5 mr-2" /> {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
