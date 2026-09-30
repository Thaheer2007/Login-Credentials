import React, { useState } from 'react';
import { Modal } from './Modal';
import {
  saveFirebaseConfigToStorage,
  clearStoredFirebaseConfig,
  isFirebaseConfigured,
  FirebaseConfig
} from '../../services/firebase';
import { ShieldCheck, Flame, Key, ExternalLink, CheckCircle2, RotateCcw, AlertCircle } from 'lucide-react';

interface FirebaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const FirebaseConfigModal: React.FC<FirebaseConfigModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [apiKey, setApiKey] = useState('');
  const [authDomain, setAuthDomain] = useState('');
  const [projectId, setProjectId] = useState('');
  const [storageBucket, setStorageBucket] = useState('');
  const [messagingSenderId, setMessagingSenderId] = useState('');
  const [appId, setAppId] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [mode, setMode] = useState<'json' | 'fields'>('json');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleJsonPaste = (text: string) => {
    setJsonInput(text);
    setErrorMsg('');
    try {
      // Allow pasting raw JS object or JSON
      const cleanJson = text
        .replace(/^[^{]*/, '')
        .replace(/[^}]*$/, '')
        .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":')
        .replace(/'/g, '"');
      const parsed = JSON.parse(cleanJson);
      if (parsed.apiKey) setApiKey(parsed.apiKey);
      if (parsed.authDomain) setAuthDomain(parsed.authDomain);
      if (parsed.projectId) setProjectId(parsed.projectId);
      if (parsed.storageBucket) setStorageBucket(parsed.storageBucket);
      if (parsed.messagingSenderId) setMessagingSenderId(parsed.messagingSenderId);
      if (parsed.appId) setAppId(parsed.appId);
    } catch (e) {
      // user will click save to validate
    }
  };

  const handleSave = () => {
    let finalKey = apiKey.trim();
    let finalAuth = authDomain.trim();
    let finalProject = projectId.trim();
    let finalStorage = storageBucket.trim();
    let finalSender = messagingSenderId.trim();
    let finalApp = appId.trim();

    if (mode === 'json' && jsonInput.trim()) {
      try {
        const clean = jsonInput
          .replace(/const firebaseConfig\s*=\s*/, '')
          .replace(/;?\s*$/, '')
          .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":')
          .replace(/'/g, '"');
        const parsed = JSON.parse(clean);
        finalKey = parsed.apiKey || finalKey;
        finalAuth = parsed.authDomain || finalAuth;
        finalProject = parsed.projectId || finalProject;
        finalStorage = parsed.storageBucket || finalStorage;
        finalSender = parsed.messagingSenderId || finalSender;
        finalApp = parsed.appId || finalApp;
      } catch (err) {
        setErrorMsg('Invalid JSON format. Please check the pasted snippet or use Manual Fields.');
        return;
      }
    }

    if (!finalKey || !finalProject) {
      setErrorMsg('API Key and Project ID are required.');
      return;
    }

    const config: FirebaseConfig = {
      apiKey: finalKey,
      authDomain: finalAuth || `${finalProject}.firebaseapp.com`,
      projectId: finalProject,
      storageBucket: finalStorage || `${finalProject}.appspot.com`,
      messagingSenderId: finalSender || '123456789',
      appId: finalApp || '1:123456789:web:abcdef'
    };

    saveFirebaseConfigToStorage(config);
    setSavedSuccess(true);
    setErrorMsg('');

    setTimeout(() => {
      setSavedSuccess(false);
      if (onSuccess) onSuccess();
      onClose();
      window.location.reload(); // Refresh to bind new Firebase app instance
    }, 1200);
  };

  const handleResetToDemo = () => {
    clearStoredFirebaseConfig();
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
      window.location.reload();
    }, 800);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Firebase Project Setup" maxWidth="md">
      <div className="space-y-4 text-slate-800">
        <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200/80 flex items-start gap-3">
          <Flame className="w-6 h-6 text-mechnik-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="font-bold text-slate-900 text-sm">Connect your own Firebase Project</h4>
            <p className="text-slate-600 mt-1 leading-relaxed">
              Enable <strong>Email/Password Authentication</strong> and <strong>Cloud Firestore</strong> in your Firebase Console. Passwords will be handled securely by Firebase Auth and never stored in Firestore.
            </p>
            <a
              href="https://console.firebase.google.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-mechnik-600 font-bold mt-2 hover:underline"
            >
              <span>Open Firebase Console</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Tab switch between Paste JSON and Fields */}
        <div className="flex border-b border-slate-200 gap-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode('json')}
            className={`pb-2 transition-colors ${
              mode === 'json'
                ? 'border-b-2 border-mechnik-500 text-mechnik-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Paste firebaseConfig JSON
          </button>
          <button
            type="button"
            onClick={() => setMode('fields')}
            className={`pb-2 transition-colors ${
              mode === 'fields'
                ? 'border-b-2 border-mechnik-500 text-mechnik-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Manual Fields
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Configuration saved! Reloading Firebase instance...</span>
          </div>
        )}

        {mode === 'json' ? (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Paste the <code className="bg-slate-100 px-1 py-0.5 rounded text-mechnik-600">const firebaseConfig = &#123; ... &#125;</code> object from Project Settings:
            </label>
            <textarea
              rows={6}
              value={jsonInput}
              onChange={(e) => handleJsonPaste(e.target.value)}
              placeholder={`{\n  "apiKey": "AIzaSy...",\n  "authDomain": "my-mechnik.firebaseapp.com",\n  "projectId": "my-mechnik",\n  "storageBucket": "my-mechnik.appspot.com",\n  "messagingSenderId": "123456789",\n  "appId": "1:123456789:web:..."\n}`}
              className="w-full p-3 font-mono text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-mechnik-500"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">apiKey *</label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-mechnik-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">projectId *</label>
              <input
                type="text"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="mechnik-prod"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-mechnik-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">authDomain</label>
              <input
                type="text"
                value={authDomain}
                onChange={(e) => setAuthDomain(e.target.value)}
                placeholder="mechnik-prod.firebaseapp.com"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-mechnik-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">appId</label>
              <input
                type="text"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                placeholder="1:123456789:web:..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-mechnik-500"
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleResetToDemo}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Sandbox Mode</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="btn-primary px-5 py-2 text-xs font-bold shadow-mechnik"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
