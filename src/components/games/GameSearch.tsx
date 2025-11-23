import React, { useState, useEffect } from 'react';
import { gameApi, Game } from '../../services/api';
import { Input, Button } from '../ui';

interface GameSearchProps {
  onSearch: (query: string) => void;
  loading?: boolean;
}

const GameSearch: React.FC<GameSearchProps> = ({ onSearch, loading = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allGames, setAllGames] = useState<Game[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  useEffect(() => {
    // Busca todos os jogos ao montar
    (async () => {
      try {
        const result = await gameApi.searchGames({ limit: 1000 });
        setAllGames(result.games);
      } catch (err) {
        // Silencia erro
      }
    })();
  }, []);

  const popularGames = [
    'Counter-Strike',
    'Portal',
    'Dota 2',
    'Cities: Skylines',
    'Left 4 Dead 2'
  ];

  return (
    <div className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-2xl shadow-sm">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Encontre o Melhor Preço
        </h2>
        <p className="text-sm text-gray-600 max-w-2xl mx-auto">
          Pesquise por jogos na Steam e descubra quando é o melhor momento para comprar
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Digite o nome do jogo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-base py-2.5 w-full border border-gray-300 rounded"
              list="games-list"
              disabled={loading}
            />
            <datalist id="games-list">
              {allGames.map((game) => (
                <option key={game.appid} value={game.name} />
              ))}
            </datalist>
          </div>
          <Button
            type="submit"
            size="lg"
            loading={loading}
            disabled={!searchQuery.trim() || loading}
            className="px-6"
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

      {/* Sugestões populares compactas */}
      <div className="mt-5 text-center">
        <p className="text-xs text-gray-500 mb-2">Jogos populares:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {popularGames.map((game) => (
            <button
              key={game}
              onClick={() => {
                setSearchQuery(game);
                onSearch(game);
              }}
              className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-full hover:border-primary-300 hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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