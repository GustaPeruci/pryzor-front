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

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'Alta';
    if (confidence >= 0.5) return 'Média';
    return 'Baixa';
  };

  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) return 'N/A';
    return `$ ${price.toFixed(2)}`;
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4"
      style={{ background: 'rgba(0, 0, 0, 0.1)' }}
    >
      <Card className="max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header moderno com gradiente */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4 sm:p-6 text-white relative">
          <div className="flex items-center justify-between gap-4">
            {/* Título à esquerda */}
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold mb-2 break-words">
                {game.name}
              </h2>
            </div>

            {/* Direita: recomendação + probabilidade + botão */}
            <div className="flex items-center gap-4">

              {/* Centralizar recomendação */}
              <div className="flex justify-center flex-1">
                <Badge
                  variant={getRecommendationColor(prediction.recommendation)}
                  className="text-sm sm:text-base font-bold px-4 py-2 whitespace-nowrap"
                >
                  {prediction.recommendation === 'BUY' ? 'COMPRE AGORA' : 'AGUARDE'}
                </Badge>
              </div>

              {/* Probabilidade */}
              <div className="text-right bg-white bg-opacity-90 px-3 py-2 rounded-lg">
                <div className="text-sm sm:text-base font-bold text-gray-600 whitespace-nowrap">
                  {(prediction.probability * 100).toFixed(0)}% de probabilidade
                </div>
              </div>

              {/* Botão fechar */}
              <button
                onClick={onClose}
                className="flex items-center justify-center 
      w-9 h-9 sm:w-10 sm:h-10 rounded-xl
      text-white/90 hover:text-white 
      hover:bg-white/20 active:bg-white/30 
      transition-all backdrop-blur-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

            </div>

          </div>

        </div>


        <Card.Content className="pt-6 px-4 sm:px-6 pb-6">
          {/* Cards de métricas principais lado a lado */}
          <div className="flex flex-row gap-4 mb-6 justify-center" style={{ backgroundColor: '#d4e3ee', borderRadius: '8px', padding: '10px' }}>
            <div className="flex-1 bg-white border-2 border-gray-200 rounded-lg p-4 text-center" style={{ backgroundColor: '#d4e3ee' }}>
              <div className="text-xs text-gray-600 font-medium mb-2">Confiança</div>
              <div className="text-2xl font-bold text-gray-900">
                {getConfidenceText(prediction.confidence)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {(prediction.confidence * 100).toFixed(0)}%
              </div>
            </div>

            <div className="flex-1 bg-white border-2 border-gray-200 rounded-lg p-4 text-center" style={{ backgroundColor: '#d4e3ee' }}>
              <div className="text-xs text-gray-600 font-medium mb-2">Previsão</div>
              <div className="text-lg font-bold text-gray-900 leading-tight">
                {prediction.will_have_discount ? 'Sem desconto' : 'Desconto >20%'}
              </div>
            </div>

            <div className="flex-1 bg-white border-2 border-gray-200 rounded-lg p-4 text-center" style={{ backgroundColor: '#d4e3ee' }}>
              <div className="text-xs text-gray-600 font-medium mb-2">Preço Atual</div>
              <div className="text-2xl font-bold text-gray-900">
                {game.freetoplay === 1 ? 'Free' : formatPrice(game.current_price)}
              </div>
              {prediction.current_discount > 0 && (
                <div className="text-xs text-gray-600 font-semibold mt-1">
                  -{prediction.current_discount}% OFF
                </div>
              )}
            </div>
          </div>

          {/* Justificativas com design melhorado */}
          {prediction.reasoning && prediction.reasoning.length > 0 && (
            <div className="bg-white border-2 border-gray-200 rounded-lg p-4 sm:p-5 mb-5">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Por que essa recomendação?</h3>
              <ul className="space-y-3">
                {prediction.reasoning.map((reason, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
                    <div className="w-6 h-6 rounded bg-gray-200 text-gray-700 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                      {index + 1}
                    </div>
                    <span className="break-words leading-relaxed">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Informações técnicas e modelo */}
          {/* <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
              <div className="text-xs text-gray-600 font-medium mb-1">Modelo ML</div>
              <div className="font-bold text-gray-900">v{prediction.model_version}</div>
              <div className="text-xs text-gray-500 mt-1">Random Forest</div>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
              <div className="text-xs text-gray-600 font-medium mb-1">Precisão</div>
              <div className="font-bold text-gray-900">90.46%</div>
              <div className="text-xs text-gray-500 mt-1">Validação temporal</div>
            </div>
          </div> */}

          {/* Footer com info adicional */}
          <div className="bg-gray-50 border-2 rounded-lg p-4 text-center" style={{ backgroundColor: '#d4e3ee' }}>
            <p className="text-xs text-gray-600">
              <strong className="text-gray-900">Como funciona:</strong> Analisamos o histórico de preços e padrões de desconto para prever descontos maiores que 20% nos próximos 30 dias.
            </p>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default PriceAnalysisResult;
