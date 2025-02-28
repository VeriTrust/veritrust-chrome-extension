import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, ArrowLeft, Loader2, HelpCircle, Info } from 'lucide-react';

const PreviewResponse = ({ isLoading, result, onSearchAgain }) => {
  const getTrustabilityColor = (score) => {
    if (!score && score !== 0) return 'text-gray-600';
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrustabilityBg = (score) => {
    if (!score && score !== 0) return 'bg-gray-50 border-gray-100';
    if (score >= 70) return 'bg-green-50 border-green-100';
    if (score >= 40) return 'bg-yellow-50 border-yellow-100';
    return 'bg-red-50 border-red-100';
  };

  const getVerdictIcon = (verdict) => {
    if (!verdict) {
      return <HelpCircle className="h-6 w-6 text-gray-500" />;
    }
    
    // Use a neutral Info icon instead of XCircle
    return <Info className="h-6 w-6 text-blue-500" />;
  };

  if (isLoading && !result) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-soft overflow-hidden p-6 animate-in fade-in duration-300">
        <div className="flex flex-col items-center justify-center space-y-5">
          <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
          <h3 className="text-lg font-medium text-gray-800">Verifying Claims...</h3>
          <p className="text-gray-600 text-center text-sm">
            We're analyzing your product claims and ingredients. This may take a few moments.
          </p>
          <div className="animate-pulse space-y-3 w-full mt-2">
            <div className="h-3 bg-gray-200 rounded-full w-3/4 mx-auto"></div>
            <div className="h-3 bg-gray-200 rounded-full w-1/2 mx-auto"></div>
            <div className="h-3 bg-gray-200 rounded-full w-5/6 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    // Ensure result has all the expected fields with fallbacks
    const safeResult = {
      verdict: result.verdict || 'Unknown',
      trustability_score: result.trustability_score || 0,
      why: result.why || 'No explanation provided',
      detailed_explanation: result.detailed_explanation || 'No detailed explanation available'
    };
    
    const scoreClass = getTrustabilityColor(safeResult.trustability_score);
    const bgClass = getTrustabilityBg(safeResult.trustability_score);
    
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-soft overflow-hidden p-6 animate-in fade-in duration-300">
        <div className="space-y-5">
          <div className={`p-4 rounded-xl ${bgClass}`}>
            <div className="flex items-start gap-3">
              {getVerdictIcon(safeResult.verdict)}
              <div className="space-y-2 w-full">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Verdict: <span className="capitalize">{safeResult.verdict}</span></h3>
                  <span className={`font-bold ${scoreClass} text-sm px-2 py-1 rounded-full bg-white`}>
                    {safeResult.trustability_score}/100
                  </span>
                </div>
                <p className="font-medium text-gray-800">{safeResult.why}</p>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-700 leading-relaxed">
            <h4 className="font-medium mb-2 text-gray-900">Detailed Analysis:</h4>
            <p>{safeResult.detailed_explanation}</p>
          </div>
          
          <button 
            className="w-full mt-2 bg-primary-50 hover:bg-primary-100 text-primary-700 font-medium py-2.5 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            onClick={onSearchAgain}
          >
            <ArrowLeft className="h-4 w-4" />
            Check Another Product
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default PreviewResponse; 