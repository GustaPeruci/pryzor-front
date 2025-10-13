import React, { useEffect, useMemo, useState } from 'react';
import { Game } from '../../services/api';
import { discountApi, Discount30dResult } from '../../services/api';
import GameCard from './GameCard';
import LoadingSpinner from '../ui/LoadingSpinner';

interface GameListProps {
  games: Game[];
  loading?: boolean;
  onAnalyze: (gameId: number) => void;
  analyzingGameId?: number;
}

const GameList: React.FC<GameListProps> = ({
  games,
  loading = false,
  onAnalyze,
  analyzingGameId
}) => {
  const [discounts, setDiscounts] = useState<Record<number, Discount30dResult>>({});

  const appids = useMemo(() =>
    Array.from(new Set(games.map(g => g.id || g.appid).filter(Boolean))) as number[]
  , [games]);

  useEffect(() => {
    let cancelled = false;
    async function fetchDiscounts() {
      if (!appids || appids.length === 0) { setDiscounts({}); return; }
  // loading silencioso para não poluir UI
      try {
        const res = await discountApi.getBatch(appids.slice(0, 50));
        if (cancelled) return;
        const map: Record<number, Discount30dResult> = {};
        Object.entries(res).forEach(([k, v]) => { map[Number(k)] = v as Discount30dResult; });
        setDiscounts(map);
      } catch (e) {
        // silencioso no card, seguimos sem badge
        setDiscounts({});
      } finally { /* noop */ }
    }
    fetchDiscounts();
    return () => { cancelled = true; };
  }, [appids]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-gray-600">Buscando jogos...</p>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 text-gray-300 mb-4">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhum jogo encontrado
        </h3>
        <p className="text-gray-600">
          Tente buscar com um termo diferente ou verifique a ortografia.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {games.map((game) => (
        <GameCard
          key={game.id || game.appid || Math.random()}
          game={game}
          onAnalyze={onAnalyze}
          analyzing={analyzingGameId === (game.id || game.appid)}
          discountProb={discounts[(game.id || game.appid)!]?.prob_discount_30d}
          discountInfo={discounts[(game.id || game.appid)!]}
        />
      ))}
    </div>
  );
};

export default GameList;