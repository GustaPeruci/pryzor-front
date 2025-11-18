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
        {/* Header moderno com gradiente */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4 sm:p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white hover:bg-white hover:bg-opacity-20 transition-all rounded-lg p-1.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-xl sm:text-2xl font-bold mb-2 pr-8 break-words">{game.name}</h2>
          <div className="flex items-center gap-4 text-xs sm:text-sm opacity-90">
            <span className="flex items-center gap-1">
              <span>🎮</span>
              <span>AppID {game.appid}</span>
            </span>
            {game.type && (
              <span className="capitalize">{game.type}</span>
            )}
          </div>
        </div>

        <Card.Content>
          {/* Recomendação destacada com ícone grande */}
          <div className={`relative overflow-hidden rounded-xl p-5 sm:p-6 mb-5 ${
            prediction.recommendation === 'BUY' 
              ? 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50' 
              : 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50'
          }`}>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className={`text-4xl ${prediction.recommendation === 'BUY' ? 'text-green-600' : 'text-amber-600'}`}>
                  {prediction.recommendation === 'BUY' ? '✓' : '⏱'}
                </div>
                <div className="flex-1">
                  <Badge 
                    variant={getRecommendationColor(prediction.recommendation)} 
                    className="text-sm sm:text-base font-bold px-3 py-1.5"
                  >
                    {prediction.recommendation === 'BUY' ? 'COMPRE AGORA' : 'AGUARDE'}
                  </Badge>
                  <div className="text-xs sm:text-sm text-gray-600 mt-1">
                    {(prediction.probability * 100).toFixed(0)}% de probabilidade
                  </div>
                </div>
              </div>
              <p className="text-gray-800 text-sm sm:text-base leading-relaxed">
                {getRecommendationText(prediction.recommendation, prediction.recommendation_text)}
              </p>
            </div>
          </div>

          {/* Cards de métricas principais lado a lado */}
          <div className="flex gap-3 mb-5">
            <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-xs text-blue-700 font-medium mb-1">Confiança</div>
              <div className="text-2xl font-bold text-blue-900">
                {getConfidenceText(prediction.confidence)}
              </div>
              <div className="text-xs text-blue-600 mt-1">
                {(prediction.confidence * 100).toFixed(0)}%
              </div>
            </div>

            <div className="flex-1 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-xs text-purple-700 font-medium mb-1">Previsão</div>
              <div className="text-lg font-bold text-purple-900 leading-tight">
                {prediction.will_have_discount ? 'Desconto >20%' : 'Sem desconto'}
              </div>
            </div>

            <div className="flex-1 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">💰</div>
              <div className="text-xs text-green-700 font-medium mb-1">Preço Atual</div>
              <div className="text-2xl font-bold text-green-900">
                {game.freetoplay === 1 ? 'Free' : formatPrice(game.current_price)}
              </div>
              {prediction.current_discount > 0 && (
                <div className="text-xs text-green-700 font-semibold mt-1">
                  -{prediction.current_discount}% OFF
                </div>
              )}
            </div>
          </div>

          {/* Justificativas com design melhorado */}
          {prediction.reasoning && prediction.reasoning.length > 0 && (
            <div className="bg-white border-2 border-gray-100 rounded-xl p-4 sm:p-5 mb-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-xl">💡</div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">Por que essa recomendação?</h3>
              </div>
              <ul className="space-y-3">
                {prediction.reasoning.map((reason, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                      {index + 1}
                    </div>
                    <span className="break-words leading-relaxed">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Informações técnicas e modelo */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Modelo ML</div>
              <div className="font-bold text-gray-900">v{prediction.model_version}</div>
              <div className="text-xs text-gray-600 mt-1">Random Forest</div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Precisão</div>
              <div className="font-bold text-gray-900">90.46%</div>
              <div className="text-xs text-gray-600 mt-1">Validação temporal</div>
            </div>
          </div>

          {/* Footer com info adicional */}
          <div className="bg-primary-50 border border-primary-100 rounded-lg p-3 text-center">
            <p className="text-xs text-primary-700">
              <strong>Como funciona:</strong> Analisamos o histórico de preços e padrões de desconto para prever descontos maiores que 20% nos próximos 30 dias.
            </p>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default PriceAnalysisResult;
