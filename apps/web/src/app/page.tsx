import { Building2, Shield, Zap, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-primary-500" />
              <span className="ml-2 text-xl font-bold text-neutral-900">
                Transparent Transaction Ledger
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-neutral-600 hover:text-primary-500">
                Features
              </a>
              <a href="#about" className="text-neutral-600 hover:text-primary-500">
                About
              </a>
              <button className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors">
                Get Started
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
            Revolutionizing Real Estate
            <span className="block text-primary-500">Transactions</span>
          </h1>
          <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto">
            A blockchain-powered platform that brings transparency, automation, and security 
            to residential and commercial real estate transactions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary-500 text-white px-8 py-3 rounded-lg hover:bg-primary-600 transition-colors">
              Start Transaction
            </button>
            <button className="border border-primary-500 text-primary-500 px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors">
              Learn More
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Shield className="h-12 w-12 text-accent-500 mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Immutable Records
            </h3>
            <p className="text-neutral-600">
              Blockchain-based ledger ensures transparent and tamper-proof transaction history.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Zap className="h-12 w-12 text-accent-500 mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Smart Automation
            </h3>
            <p className="text-neutral-600">
              Automated earnest money release and contract execution reduce manual intervention.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Users className="h-12 w-12 text-accent-500 mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Unified Dashboard
            </h3>
            <p className="text-neutral-600">
              Real-time updates and secure communication for all transaction stakeholders.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Building2 className="h-12 w-12 text-accent-500 mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              AI Compliance
            </h3>
            <p className="text-neutral-600">
              AI-powered fraud detection and compliance monitoring for enhanced security.
            </p>
          </div>
        </div>

        {/* Status Section */}
        <div className="mt-20 bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            Platform Status
          </h2>
          <p className="text-neutral-600 mb-6">
            The Transparent Transaction Ledger is currently in development. 
            This is the initial project foundation based on comprehensive requirements analysis.
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-accent-100 text-accent-800 rounded-full">
            <div className="w-2 h-2 bg-accent-500 rounded-full mr-2"></div>
            Development Phase - Foundation Complete
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-neutral-400">
              © 2025 Transparent Transaction Ledger. Built with transparency and security in mind.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
