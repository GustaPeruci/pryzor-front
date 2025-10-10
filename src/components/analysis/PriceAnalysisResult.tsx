import React from 'react';
import { PriceAnalysis } from '../../services/api';
import { Card, Badge } from '../ui';

interface PriceAnalysisResultProps {
  analysis: PriceAnalysis;
  gameName: string;
  gameImage?: string;
  onClose?: () => void;
}

const PriceAnalysisResult: React.FC<PriceAnalysisResultProps> = ({
  analysis,
  gameName,
  gameImage,
  onClose
}) => {
  // Debug: verificar dados recebidos
  console.log('🎯 Dados da análise no modal:', {
    analysis,
    gameName,
    details: analysis.details
  });
  const getRecommendationColor = (recommendation: string) => {
    return recommendation === 'BUY-NOW' ? 'success' : 'warning';
  };

  const getRecommendationIcon = (recommendation: string) => {
    if (recommendation === 'BUY-NOW') {
      return (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    } else {
      return (
        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatPrice = (price?: number) => {
    if (price === undefined || price === null || isNaN(price)) return 'N/A';
    return `R$ ${price.toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50 fade-in">
      <div className="bg-white rounded-lg w-80 max-h-[90vh] overflow-y-auto slide-up">
        {/* Header */}
        <div className="relative px-4 py-3 border-b border-gray-200">
          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-900 mb-1">{gameName}</h2>
            <p className="text-sm text-gray-600">Análise de Preço</p>
          </div>
          
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-1 right-1 text-gray-400 hover:text-gray-600 p-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Recomendação principal */}
        <div className="px-4 py-3">
          <div className="text-center mb-4">
            <div className="flex justify-center mb-2">
              {getRecommendationIcon(analysis.recommendation)}
            </div>
            
            <Badge 
              variant={getRecommendationColor(analysis.recommendation)}
              className="text-sm px-3 py-1 mb-2"
            >
              {analysis.recommendation === 'BUY-NOW' ? 'COMPRE AGORA' : 'AGUARDE'}
            </Badge>
            
            <div className="mb-3">
              <span className="text-xs text-gray-500">Confiança da análise:</span>
              <div className={`text-xl font-bold ${getConfidenceColor(analysis.confidence)} mb-1`}>
                {analysis.confidence}%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    analysis.confidence >= 80 ? 'bg-green-500' : 
                    analysis.confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${analysis.confidence}%` }}
                ></div>
              </div>
            </div>

            <p className="text-gray-700 text-sm leading-relaxed">
              {analysis.reason}
            </p>
          </div>

          {/* Detalhes da análise */}
          <Card className="mb-4 mx-1">
            <Card.Header>
              <h3 className="text-sm font-semibold">Detalhes da Análise</h3>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-gray-500">Preço Atual:</span>
                  <div className="text-sm font-semibold text-gray-900">
                    {formatPrice(analysis.details.current_price)}
                  </div>
                </div>
                
                <div>
                  <span className="text-xs text-gray-500">Preço Médio:</span>
                  <div className="text-sm text-gray-700">
                    {formatPrice(analysis.details.average_price)}
                  </div>
                </div>

                <div>
                  <span className="text-xs text-gray-500">Menor Preço:</span>
                  <div className="text-sm text-green-600 font-medium">
                    {formatPrice(analysis.details.min_price)}
                  </div>
                </div>
                
                <div>
                  <span className="text-xs text-gray-500">Maior Preço:</span>
                  <div className="text-sm text-red-600 font-medium">
                    {formatPrice(analysis.details.max_price)}
                  </div>
                </div>
              </div>

              {analysis.current_price_ratio && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <span className="text-xs text-gray-500">Ratio do Preço:</span>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm font-medium">
                      {(analysis.current_price_ratio * 100).toFixed(1)}%
                    </div>
                    <span className="text-xs text-gray-600">
                      {analysis.current_price_ratio < 1 ? 'abaixo' : 'acima'} da média
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-2 pt-2 border-t border-gray-200">
                <span className="text-xs text-gray-500">Variação de Preço:</span>
                <div className="text-sm">
                  {(analysis.details.price_variance * 100).toFixed(1)}%
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Tendência */}
          {analysis.price_trend && (
            <Card className="mx-1">
              <Card.Header>
                <h3 className="text-sm font-semibold">Tendência de Preço</h3>
              </Card.Header>
              <Card.Content>
                <p className="text-xs text-gray-700">{analysis.price_trend}</p>
              </Card.Content>
            </Card>
          )}
        </div>

        {/* Footer com ações */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <div className="flex justify-center">
            {onClose && (
              <button
                onClick={onClose}
                className="btn btn-secondary px-4 text-sm"
              >
                Fechar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceAnalysisResult;