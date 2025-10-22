import React from 'react';
import { MLPrediction, Game } from '../../services/api';
import { Card, Badge } from '../ui';

interface PriceAnalysisResultProps {
  prediction: MLPrediction;
  game: Game;
  onClose: () => void;
}

const PriceAnalysisResult: React.FC<PriceAnalysisResultProps> = ({
  prediction,
  game,
  onClose
}) => {
  const getRecommendationColor = (recommendation: string) => {
    return recommendation === 'BUY' ? 'success' : 'warning';
  };

  const getRecommendationText = (recommendation: string, text?: string) => {
    if (text) return text;
    return recommendation === 'BUY' 
      ? 'Compre agora! O preço está bom.' 
      : 'Aguarde! Provável desconto em breve.';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'Alta';
    if (confidence >= 0.5) return 'Média';
    return 'Baixa';
  };

  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) return 'N/A';
    return `$ ${price.toFixed(2)}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <Card className="max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header com botão fechar */}
        <div className="p-4 sm:p-6 pb-0">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 pr-2">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 break-words">{game.name}</h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Análise de Previsão com Machine Learning</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors ml-2 flex-shrink-0"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Informações do Jogo e Modelo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {/* Coluna Esquerda - Info do Jogo */}
            <div className="bg-blue-50 rounded-lg p-3 space-y-2">
              <div className="text-xs font-semibold text-blue-900 uppercase tracking-wide mb-2">
                Informações do Jogo
              </div>
              <div className="flex items-center justify-between text-xs text-gray-700">
                <div className="flex items-center min-w-0 flex-1">
                  <span className="text-blue-600 mr-2 flex-shrink-0">🎮</span>
                  <span className="text-gray-500 flex-shrink-0">AppID:</span>
                </div>
                <span className="font-mono font-semibold ml-2 flex-shrink-0">{game.appid}</span>
              </div>
              {game.releasedate && (
                <div className="flex items-center justify-between text-xs text-gray-700">
                  <div className="flex items-center min-w-0 flex-1">
                    <span className="text-blue-600 mr-2 flex-shrink-0">📅</span>
                    <span className="text-gray-500 flex-shrink-0">Lançamento:</span>
                  </div>
                  <span className="font-medium ml-2 flex-shrink-0">{formatDate(game.releasedate)}</span>
                </div>
              )}
              {game.type && (
                <div className="flex items-center justify-between text-xs text-gray-700">
                  <div className="flex items-center min-w-0 flex-1">
                    <span className="text-blue-600 mr-2 flex-shrink-0">📦</span>
                    <span className="text-gray-500 flex-shrink-0">Tipo:</span>
                  </div>
                  <span className="font-medium capitalize ml-2 flex-shrink-0">{game.type}</span>
                </div>
              )}
              {prediction.last_price_date && (
                <div className="flex items-center justify-between text-xs text-gray-700">
                  <div className="flex items-center min-w-0 flex-1">
                    <span className="text-blue-600 mr-2 flex-shrink-0">💰</span>
                    <span className="text-gray-500 flex-shrink-0">Último Preço:</span>
                  </div>
                  <span className="font-medium ml-2 flex-shrink-0">{formatDate(prediction.last_price_date)}</span>
                </div>
              )}
              {game.price_records !== undefined && (
                <div className="flex items-center justify-between text-xs text-gray-700">
                  <div className="flex items-center min-w-0 flex-1">
                    <span className="text-blue-600 mr-2 flex-shrink-0">📊</span>
                    <span className="text-gray-500 flex-shrink-0">Histórico:</span>
                  </div>
                  <span className="font-medium ml-2 flex-shrink-0">{game.price_records} registros</span>
                </div>
              )}
            </div>

            {/* Coluna Direita - Info do Modelo */}
            <div className="bg-purple-50 rounded-lg p-3 space-y-2">
              <div className="text-xs font-semibold text-purple-900 uppercase tracking-wide mb-2">
                Informações da Análise
              </div>
              <div className="flex items-center justify-between text-xs text-gray-700">
                <div className="flex items-center min-w-0 flex-1">
                  <span className="text-purple-600 mr-2 flex-shrink-0">🤖</span>
                  <span className="text-gray-500 flex-shrink-0">Modelo:</span>
                </div>
                <span className="font-medium ml-2 flex-shrink-0">{prediction.model_version}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-700">
                <div className="flex items-center min-w-0 flex-1">
                  <span className="text-purple-600 mr-2 flex-shrink-0">🕒</span>
                  <span className="text-gray-500 flex-shrink-0">Data:</span>
                </div>
                <span className="font-medium ml-2 flex-shrink-0">{formatDate(prediction.prediction_date)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-700">
                <div className="flex items-center min-w-0 flex-1">
                  <span className="text-purple-600 mr-2 flex-shrink-0">📈</span>
                  <span className="text-gray-500 flex-shrink-0">Precisão:</span>
                </div>
                <span className="font-medium ml-2 flex-shrink-0">90.46%</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-700">
                <div className="flex items-center min-w-0 flex-1">
                  <span className="text-purple-600 mr-2 flex-shrink-0">✓</span>
                  <span className="text-gray-500 flex-shrink-0">Validação:</span>
                </div>
                <span className="font-medium ml-2 flex-shrink-0">Temporal</span>
              </div>
            </div>
          </div>
        </div>

        <Card.Content>
          {/* Recomendação principal */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-3">
              <Badge 
                variant={getRecommendationColor(prediction.recommendation)} 
                className="text-base sm:text-lg font-semibold px-3 sm:px-4 py-2 w-full sm:w-auto text-center"
              >
                {prediction.recommendation === 'BUY' ? '🎮 COMPRE AGORA' : '⏳ AGUARDE'}
              </Badge>
              <div className="text-left sm:text-right w-full sm:w-auto">
                <div className="text-xs sm:text-sm text-gray-600">Probabilidade</div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  {(prediction.probability * 100).toFixed(0)}%
                </div>
              </div>
            </div>
            <p className="text-gray-700 text-sm sm:text-lg">
              {getRecommendationText(prediction.recommendation, prediction.recommendation_text)}
            </p>
          </div>

          {/* Métricas da previsão */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
            {/* Confiança */}
            <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
              <div className="text-xs sm:text-sm text-gray-500 mb-1">Confiança</div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                {getConfidenceText(prediction.confidence)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {(prediction.confidence * 100).toFixed(0)}%
              </div>
            </div>

            {/* Previsão */}
            <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
              <div className="text-xs sm:text-sm text-gray-500 mb-1">Previsão</div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                {prediction.will_have_discount ? 'Desconto >20%' : 'Sem desconto'}
              </div>
            </div>

            {/* Preço atual */}
            <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
              <div className="text-xs sm:text-sm text-gray-500 mb-1">Preço Atual</div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                {game.freetoplay === 1 ? 'Gratuito' : formatPrice(game.current_price)}
              </div>
              {prediction.current_discount > 0 && (
                <div className="text-xs text-green-600 mt-1">
                  -{prediction.current_discount}% OFF agora
                </div>
              )}
            </div>
          </div>

          {/* Justificativas */}
          {prediction.reasoning && prediction.reasoning.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Por que essa recomendação?</h3>
              <ul className="space-y-2">
                {prediction.reasoning.map((reason, index) => (
                  <li key={index} className="flex items-start text-xs sm:text-sm text-gray-700">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="break-words">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Explicação do modelo */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 rounded mb-4 sm:mb-6">
            <div className="flex items-start">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-blue-800 font-medium mb-1">Modelo v{prediction.model_version}</p>
                <p className="text-xs sm:text-sm text-blue-700 break-words">
                  Nosso modelo usa Random Forest com validação temporal para prever se o jogo terá desconto maior que 20% nos próximos 30 dias.
                  Com precision de 90.46%, quando o modelo diz "vai ter desconto", ele acerta 9 em cada 10 vezes!
                </p>
              </div>
            </div>
          </div>

          {/* Botão fechar */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 sm:px-6 py-2 bg-gray-600 text-white text-sm sm:text-base rounded-lg hover:bg-gray-700 transition-colors w-full sm:w-auto"
            >
              Fechar
            </button>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default PriceAnalysisResult;
