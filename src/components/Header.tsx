import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo e Nome */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg">
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

          {/* Espaçamento vazio para manter o layout centralizado */}
          <div></div>

          {/* Espaço reservado */}
          <div></div>
        </div>
      </div>
    </header>
  );
};

export default Header;