// ✅ src/pages/admin/Settings.jsx
import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Lock,
  Bell,
  Paintbrush,
  Sliders,
  Save,
  RefreshCw
} from 'lucide-react';
import { currencies } from './data/currencies';
import { timezones } from './data/timezones';


const Settings = () => {
  // Modal toggles
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showSystemModal, setShowSystemModal] = useState(false);

  // General Settings form
  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'Mwanamama Shop',
    currency: 'KES',
    timezone: 'Africa/Nairobi'
  });

  const handleSaveGeneral = () => {
    alert('General settings saved!');
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-white fw-bold d-flex align-items-center gap-2">
          <SettingsIcon size={30} /> Settings
        </h2>
        <button className="btn btn-light btn-sm">
          <RefreshCw size={18} className="me-2" /> Refresh
        </button>
      </div>

      {/* Settings Cards */}
      <div className="row g-4 mb-4">
        {/* Security */}
        <div className="col-md-6 col-lg-3">
          <div
            className="card shadow-sm border-0 h-100"
            style={{background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', cursor:'pointer'}}
            onClick={() => setShowSecurityModal(true)}
          >
            <div className="card-body text-center">
              <Lock size={30} className="text-primary mb-3" />
              <h6 className="fw-bold">Security Settings</h6>
              <small className="text-muted">Password & access controls</small>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="col-md-6 col-lg-3">
          <div
            className="card shadow-sm border-0 h-100"
            style={{background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', cursor:'pointer'}}
            onClick={() => setShowNotificationModal(true)}
          >
            <div className="card-body text-center">
              <Bell size={30} className="text-warning mb-3" />
              <h6 className="fw-bold">Notification Settings</h6>
              <small className="text-muted">Email & alerts</small>
            </div>
          </div>
        </div>

        {/* Theme */}
        <div className="col-md-6 col-lg-3">
          <div
            className="card shadow-sm border-0 h-100"
            style={{background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', cursor:'pointer'}}
            onClick={() => setShowThemeModal(true)}
          >
            <div className="card-body text-center">
              <Paintbrush size={30} className="text-danger mb-3" />
              <h6 className="fw-bold">Theme Settings</h6>
              <small className="text-muted">Dark mode & colors</small>
            </div>
          </div>
        </div>

        {/* System */}
        <div className="col-md-6 col-lg-3">
          <div
            className="card shadow-sm border-0 h-100"
            style={{background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', cursor:'pointer'}}
            onClick={() => setShowSystemModal(true)}
          >
            <div className="card-body text-center">
              <Sliders size={30} className="text-success mb-3" />
              <h6 className="fw-bold">System Settings</h6>
              <small className="text-muted">Date, language, currency</small>
            </div>
          </div>
        </div>
      </div>

      {/* General Settings Form */}
      <div className="card border-0 shadow-sm" style={{background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)'}}>
        <div className="card-body">
          <h5 className="mb-3">General Settings</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Company Name</label>
              <input
                type="text"
                className="form-control"
                value={generalSettings.companyName}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, companyName: e.target.value }))}
              />
            </div>
            <div className="col-md-3">
  <label className="form-label">Currency</label>
  <select
    className="form-select"
    value={generalSettings.currency}
    onChange={(e) => setGeneralSettings(prev => ({ ...prev, currency: e.target.value }))}
  >
    {currencies.map(c => (
      <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
    ))}
  </select>
</div>

<div className="col-md-3">
  <label className="form-label">Timezone</label>
  <select
    className="form-select"
    value={generalSettings.timezone}
    onChange={(e) => setGeneralSettings(prev => ({ ...prev, timezone: e.target.value }))}
  >
    {timezones.map(tz => (
      <option key={tz} value={tz}>{tz}</option>
    ))}
  </select>
</div>

            <div className="col-12 text-end">
              <button className="btn btn-primary" onClick={handleSaveGeneral}>
                <Save size={18} className="me-2" /> Save General Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security Modal */}
      {showSecurityModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Security Settings</h5>
                <button className="btn-close" onClick={() => setShowSecurityModal(false)}></button>
              </div>
              <div className="modal-body">
                <label className="form-label">New Admin Password</label>
                <input type="password" className="form-control" placeholder="********" />
                <div className="form-check mt-3">
                  <input className="form-check-input" type="checkbox" id="2fa" />
                  <label className="form-check-label" htmlFor="2fa">Enable Two-Factor Authentication</label>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowSecurityModal(false)}>Cancel</button>
                <button className="btn btn-primary">Save Security</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Notification Settings</h5>
                <button className="btn-close" onClick={() => setShowNotificationModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="form-check mb-2">
                  <input className="form-check-input" type="checkbox" id="emailOrder" />
                  <label className="form-check-label" htmlFor="emailOrder">Email me when a new order is placed</label>
                </div>
                <div className="form-check mb-2">
                  <input className="form-check-input" type="checkbox" id="emailFail" />
                  <label className="form-check-label" htmlFor="emailFail">Email me on failed transactions</label>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowNotificationModal(false)}>Cancel</button>
                <button className="btn btn-primary">Save Notifications</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Theme Modal */}
      {showThemeModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Theme Settings</h5>
                <button className="btn-close" onClick={() => setShowThemeModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="themeRadio" id="light" defaultChecked />
                  <label className="form-check-label" htmlFor="light">Light Mode</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="themeRadio" id="dark" />
                  <label className="form-check-label" htmlFor="dark">Dark Mode</label>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowThemeModal(false)}>Cancel</button>
                <button className="btn btn-primary">Save Theme</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Settings Modal */}
      {showSystemModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">System Settings</h5>
                <button className="btn-close" onClick={() => setShowSystemModal(false)}></button>
              </div>
              <div className="modal-body">
                <label className="form-label">Date Format</label>
                <select className="form-select mb-3">
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                </select>
                <label className="form-label">Language</label>
                <select className="form-select">
                  <option value="en">English</option>
                  <option value="sw">Swahili</option>
                </select>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowSystemModal(false)}>Cancel</button>
                <button className="btn btn-primary">Save System</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Settings;
