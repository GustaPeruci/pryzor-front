import React, { useState, useEffect, useRef } from 'react';
import { gameApi, Game } from '../../services/api';
import { Input, Button } from '../ui';

interface GameSearchProps {
  onSearch: (query: string) => void;
  loading?: boolean;
}

const GameSearch: React.FC<GameSearchProps> = ({ onSearch, loading = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setShowSuggestions(false);
    }
  };

  const filteredGames = searchQuery.length > 0
    ? allGames.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 10)
    : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
    setHighlightedIndex(-1);
  };

  const handleSuggestionClick = (name: string) => {
    setSearchQuery(name);
    setShowSuggestions(false);
    onSearch(name);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredGames.length === 0) return;
    if (e.key === 'ArrowDown') {
      setHighlightedIndex(idx => Math.min(idx + 1, filteredGames.length - 1));
    } else if (e.key === 'ArrowUp') {
      setHighlightedIndex(idx => Math.max(idx - 1, 0));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      handleSuggestionClick(filteredGames[highlightedIndex].name);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
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

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto relative">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Digite o nome do jogo..."
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              onKeyDown={handleKeyDown}
              className="text-base py-4 w-full border border-gray-300 rounded shadow focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              disabled={loading}
              autoComplete="off"
            />
            {showSuggestions && filteredGames.length > 0 && (
              <ul className="absolute left-0 right-0 mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-xl z-10 max-h-60 overflow-y-auto p-2">
                {filteredGames.map((game, idx) => (
                  <li
                    key={game.appid}
                    className={`px-4 py-3 cursor-pointer rounded-md transition-all duration-200
                      ${highlightedIndex === idx 
                        ? 'bg-primary-600 text-white font-bold border-2 border-primary-700 shadow-md' 
                        : 'bg-white border-2 border-gray-300 hover:bg-primary-600 hover:text-white hover:border-primary-700 hover:shadow-md'
                      }`}
                    onMouseDown={() => handleSuggestionClick(game.name)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                  >
                    {game.name}
                  </li>
                ))}
              </ul>
            )}
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