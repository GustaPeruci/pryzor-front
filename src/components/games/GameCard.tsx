import React from 'react';
import { Game } from '../../services/api';
import { Card, Badge, Button } from '../ui';

interface GameCardProps {
  game: Game;
  onAnalyze: (gameId: number) => void;
  analyzing?: boolean;
  onInspect?: (appid: number) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onAnalyze, analyzing = false }) => {
  const formatPrice = (price?: number) => {
    if (game.freetoplay === 1) return 'Gratuito';
    if (price === undefined || price === null || price === 0) return 'Preço não disponível';
    return `$ ${price.toFixed(2)}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Data não disponível';
    try {
      const parsedDate = new Date(dateString);
      return parsedDate.toLocaleDateString('pt-BR');
    } catch {
      return 'Data não disponível';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <Card.Content className="flex-1">
        {/* Nome do jogo */}
        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
          {game.name}
        </h3>

        {/* Informações do jogo */}
        <div className="space-y-2 mb-4">
          {/* Preço atual */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Preço:</span>
            <Badge variant={game.freetoplay === 1 ? 'success' : 'info'}>
              {formatPrice(game.current_price)}
              {typeof game.current_discount === 'number' && game.current_discount > 0 && (
                <span className="ml-1">-{Math.round(game.current_discount)}%</span>
              )}
            </Badge>
          </div>

          {/* Data de lançamento */}
          {game.releasedate && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Lançamento:</span>
              <span className="text-gray-700">{formatDate(game.releasedate)}</span>
            </div>
          )}

          {/* Tipo do jogo */}
          {game.type && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Tipo:</span>
              <span className="text-gray-700">{game.type}</span>
            </div>
          )}

          {/* Número de registros de preço */}
          {game.price_records && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Histórico:</span>
              <span className="text-gray-700">{game.price_records} registros</span>
            </div>
          )}
        </div>

        {/* Botões de ação */}
        <div className="mt-auto">
          <Button
            onClick={() => onAnalyze(game.appid)}
            loading={analyzing}
            className="w-full"
            disabled={game.freetoplay === 1}
          >
            {analyzing ? 'Analisando...' : 'Analisar com ML'}
          </Button>
          {game.freetoplay === 1 && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              Jogos gratuitos não precisam de análise
            </p>
          )}
        </div>
      </Card.Content>
    </Card>
  );
};

export default GameCard;
