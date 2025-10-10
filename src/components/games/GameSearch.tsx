import React, { useState } from 'react';
import { Input, Button } from '../ui';

interface GameSearchProps {
  onSearch: (query: string) => void;
  loading?: boolean;
}

const GameSearch: React.FC<GameSearchProps> = ({ onSearch, loading = false }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Encontre o Melhor Preço
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Pesquise por jogos na Steam e descubra quando é o melhor momento para comprar com nossa análise de preços inteligente
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Digite o nome do jogo (ex: Counter-Strike, Portal, Dota 2)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-lg py-3"
            />
          </div>
          <Button
            type="submit"
            size="lg"
            loading={loading}
            disabled={!searchQuery.trim() || loading}
            className="px-8"
          >
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
            Buscar
          </Button>
        </div>
      </form>

      {/* Sugestões populares */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 mb-3">Jogos populares:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            'Counter-Strike',
            'Portal',
            'Half-Life',
            'Dota 2',
            'Team Fortress 2',
            'Garry\'s Mod',
            'Cities: Skylines',
            'Left 4 Dead 2'
          ].map((game) => (
            <button
              key={game}
              onClick={() => {
                setSearchQuery(game);
                onSearch(game);
              }}
              className="px-3 py-1 text-sm bg-white border border-gray-200 rounded-full hover:border-primary-300 hover:bg-primary-50 transition-colors"
              disabled={loading}
            >
              {game}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameSearch;