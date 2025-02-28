import Verification from "./components/Verification";
import { Shield } from 'lucide-react';

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col">
      <header className="bg-white shadow-soft">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Shield className="h-6 w-6 text-primary-600" />
            <h1 className="text-xl font-bold text-primary-600">VeriTrust</h1>
          </div>
          <p className="text-center text-gray-600 text-sm">Verify product claims with confidence</p>
        </div>
      </header>
      
      <main className="flex-grow flex items-start justify-center p-6">
        <Verification />
      </main>
      
      <footer className="bg-white py-3 text-center text-gray-500 text-xs border-t border-gray-100">
        <p>© 2025 VeriTrust. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
