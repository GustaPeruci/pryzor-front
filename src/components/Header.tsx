import React from 'react';

interface HeaderProps {
  onOpenMetricsModal?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenMetricsModal }) => {
  return (
    <header style={{backgroundColor: '#d4e3ee'}} className="border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 justify-between">
          {/* Logo e Nome */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg shadow-md">
              <svg 
                className="w-6 h-6 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" 
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Pryzor</h1>
              <p className="text-xs text-gray-500">Análise de Preços Steam</p>
            </div>
          </div>
          {/* Botão de métricas do modelo */}
          <button
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition"
            onClick={onOpenMetricsModal}
          >
            Ver Métricas do Modelo
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;