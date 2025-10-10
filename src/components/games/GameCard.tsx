import React from 'react';
import { Game } from '../../services/api';
import { Card, Badge, Button } from '../ui';

interface GameCardProps {
  game: Game;
  onAnalyze: (gameId: number) => void;
  analyzing?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ game, onAnalyze, analyzing = false }) => {
  const formatPrice = (price?: number) => {
    if (game.freetoplay === 1) return 'Gratuito';
    if (price === undefined || price === null) return 'Ver Preço';
    if (price === 0) return 'Ver Preço';
    return `R$ ${price.toFixed(2)}`;
  };

  const formatDate = (dateString?: string) => {
    const date = dateString || game.releasedate;
    if (!date) return 'Data não disponível';
    try {
      const parsedDate = new Date(date);
      return parsedDate.toLocaleDateString('pt-BR');
    } catch {
      return 'Data não disponível';
    }
  };

  return (
    <Card>
      <Card.Header>
        {/* Preço badge */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <Badge variant={
              game.freetoplay === 1 ? 'success' : 
              (game.price === undefined || game.price === null || game.price === 0) ? 'info' : 
              'info'
            }>
              {formatPrice(game.price)}
            </Badge>
          </div>
        </div>
      </Card.Header>

      <Card.Content>
        {/* Nome do jogo */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {game.name}
        </h3>

        {/* Descrição */}
        {game.short_description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {game.short_description}
          </p>
        )}

        {/* Informações adicionais */}
        <div className="space-y-2 mb-4">
          {game.developers && game.developers.length > 0 && (
            <div className="text-sm">
              <span className="text-gray-500">Desenvolvedor:</span>
              <span className="ml-1 text-gray-700">{game.developers[0]}</span>
            </div>
          )}
          
          {game.release_date && (
            <div className="text-sm">
              <span className="text-gray-500">Lançamento:</span>
              <span className="ml-1 text-gray-700">{formatDate(game.release_date)}</span>
            </div>
          )}

          {game.metacritic?.score && (
            <div className="text-sm">
              <span className="text-gray-500">Metacritic:</span>
              <Badge 
                variant={game.metacritic.score >= 80 ? 'success' : game.metacritic.score >= 60 ? 'warning' : 'error'}
                className="ml-1"
              >
                {game.metacritic.score}
              </Badge>
            </div>
          )}
        </div>

        {/* Gêneros */}
        {game.genres && game.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {game.genres.slice(0, 3).map((genre) => (
              <Badge key={genre} variant="info" className="text-xs">
                {genre}
              </Badge>
            ))}
            {game.genres.length > 3 && (
              <Badge variant="info" className="text-xs">
                +{game.genres.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Plataformas */}
        {game.platforms && (
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-sm text-gray-500">Plataformas:</span>
            <div className="flex space-x-1">
              {game.platforms.windows && (
                <div className="w-5 h-5 text-gray-600" title="Windows">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.351"/>
                  </svg>
                </div>
              )}
              {game.platforms.mac && (
                <div className="w-5 h-5 text-gray-600" title="Mac">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </div>
              )}
              {game.platforms.linux && (
                <div className="w-5 h-5 text-gray-600" title="Linux">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.504 0c-.155 0-.315.008-.480.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602.006.199.08.4.249.569.17.17.382.248.6.246.26-.004.45-.102.623-.27.096-.095.184-.208.264-.32.028-.04.034-.092.062-.134a.556.556 0 00.096-.288c0-.085-.016-.171-.014-.256.002-.16.03-.57.013-.836-.006-.23-.08-.447-.136-.65-.044-.016-.088-.08-.1-.134-.18-.723-.024-1.464.287-2.17.18-.42.48-.8.168-1.222-.497-.67-1.255-.336-1.889-.268-.397.04-.72.193-.897.533-.199.380-.222.84-.199 1.18.03.46.199.94.269 1.401.18 1.086-.18 2.15-.18 3.02 0 .36.18.72.36 1.08.18.36.36.72.36 1.08 0 .36-.18.72-.36 1.08-.18.36-.36.72-.36 1.08 0 .36.18.72.36 1.08.18.36.36.72.36 1.08 0 .36-.18.72-.36 1.08-.18.36-.36.72-.36 1.08 0 .36.18.72.36 1.08.18.36.36.72.36 1.08z"/>
                  </svg>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Botão de análise */}
        <Button
          onClick={() => onAnalyze(game.id || game.appid || 0)}
          loading={analyzing}
          className="w-full"
          disabled={game.freetoplay === 1}
        >
          {game.freetoplay === 1 ? 'Jogo Gratuito' : 'Analisar Preço'}
        </Button>
      </Card.Content>
    </Card>
  );
};

export default GameCard;