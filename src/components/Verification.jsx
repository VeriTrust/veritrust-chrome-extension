import { useState, useEffect } from 'react';
import { verifyManually } from '../api/api';
import PreviewResponse from './PreviewResponse';
import { ClipboardCheck, X, Info, AlertCircle } from 'lucide-react';

const Verification = () => {
  const [claims, setClaims] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Load saved values from Chrome storage when component mounts
  useEffect(() => {
    // Check if Chrome API is available (in extension environment)
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['claim', 'ingredients'], (result) => {
        if (result.claim) setClaims(result.claim);
        if (result.ingredients) setIngredients(result.ingredients);
      });
    } else {
      // Fallback to localStorage for development environment
      const savedClaims = localStorage.getItem('claims');
      const savedIngredients = localStorage.getItem('ingredients');
      
      if (savedClaims) setClaims(savedClaims);
      if (savedIngredients) setIngredients(savedIngredients);
    }
  }, []);

  // Save claims to storage when it changes
  const handleClaimsChange = (e) => {
    const newClaims = e.target.value;
    setClaims(newClaims);
    
    // Save to Chrome storage if available
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ claim: newClaims });
    } else {
      // Fallback to localStorage for development
      localStorage.setItem('claims', newClaims);
    }
  };

  // Save ingredients to storage when it changes
  const handleIngredientsChange = (e) => {
    const newIngredients = e.target.value;
    setIngredients(newIngredients);
    
    // Save to Chrome storage if available
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ ingredients: newIngredients });
    } else {
      // Fallback to localStorage for development
      localStorage.setItem('ingredients', newIngredients);
    }
  };

  // Clear input fields and storage
  const handleClear = () => {
    setClaims('');
    setIngredients('');
    setError(null);
    
    // Clear Chrome storage if available
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ claim: '', ingredients: '' });
    } else {
      // Fallback to localStorage for development
      localStorage.setItem('claims', '');
      localStorage.setItem('ingredients', '');
    }
  };

  const handleVerify = async () => {
    if (!claims.trim() || !ingredients.trim()) {
      setError('Please enter both claims and ingredients');
      return;
    }

    try {
      // Show loading state immediately
      console.log("Starting verification process");
      setIsLoading(true);
      setError(null);
      setResult(null);
      
      // Perform the verification
      console.log("Calling verifyManually API");
      const verificationResult = await verifyManually(claims, ingredients);
      
      // Set the result and turn off loading
      console.log("Verification complete, setting result:", verificationResult);
      setResult(verificationResult);
      setIsLoading(false);
      console.log("Loading state set to false");
    } catch (err) {
      console.error("Verification error:", err);
      // Create a more user-friendly error message
      let errorMessage = 'An error occurred during verification';
      
      if (err instanceof Error) {
        // If it's a specific error with a message, use that
        errorMessage = err.message;
        
        // Make the error message more user-friendly
        if (errorMessage.includes('Failed to parse')) {
          errorMessage = 'The server returned an invalid response. Please try again later.';
        } else if (errorMessage.includes('timeout')) {
          errorMessage = 'The verification request timed out. Please try again later.';
        } else if (errorMessage.includes('Network Error') || errorMessage.includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        }
      }
      
      setError(errorMessage);
      setIsLoading(false);
      console.log("Loading state set to false due to error");
    }
  };

  const handleSearchAgain = () => {
    // Clear the result to show the form again
    console.log("Search again clicked");
    setResult(null);
    setIsLoading(false);
    
    // Clear input fields
    setClaims('');
    setIngredients('');
    
    // Clear storage
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ claim: '', ingredients: '' });
    } else {
      // Fallback to localStorage for development
      localStorage.setItem('claims', '');
      localStorage.setItem('ingredients', '');
    }
    
    // Clear any previous errors
    setError(null);
    console.log("Form reset for new search and storage cleared");
  };

  // Log current state for debugging
  console.log("Current state:", { isLoading, result, error });

  // If we're loading or have a result, show the PreviewResponse component
  if (isLoading || result) {
    console.log("Rendering PreviewResponse with:", { isLoading, result });
    return (
      <PreviewResponse 
        isLoading={isLoading} 
        result={result} 
        onSearchAgain={handleSearchAgain}
      />
    );
  }

  // Otherwise, show the verification form
  console.log("Rendering verification form");
  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-soft overflow-hidden p-6 animate-in fade-in duration-500">
      <h2 className="text-xl font-bold mb-2 text-primary-700 flex items-center gap-2">
        <ClipboardCheck className="h-5 w-5" />
        Verification
      </h2>
      <p className="text-gray-600 mb-5 text-sm">
        Enter product claims and ingredients to verify their authenticity.
      </p>
      
      <div className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="claims" className="block text-sm font-medium text-gray-700 mb-1">
            Product Claims
          </label>
          <textarea 
            id="claims"
            value={claims}
            onChange={handleClaimsChange}
            placeholder="Enter product claims (e.g., 'Organic', 'Gluten-Free', 'No Artificial Flavors')"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            rows="3"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-1">
            Product Ingredients
          </label>
          <textarea 
            id="ingredients"
            value={ingredients}
            onChange={handleIngredientsChange}
            placeholder="Enter product ingredients list"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            rows="5"
          />
        </div>
        
        <div className="flex space-x-3 pt-2">
          <button 
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-sm"
            onClick={handleVerify}
            disabled={isLoading || !claims.trim() || !ingredients.trim()}
          >
            <ClipboardCheck className="h-4 w-4" />
            Verify Claims
          </button>
          
          <button
            onClick={handleClear}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative mt-4 flex items-start gap-2 animate-in slide-in-from-top duration-300">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          </div>
        )}
        
        <div className="mt-4 p-4 border rounded-lg bg-primary-50 border-primary-100">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-sm mb-1 text-primary-700">Example</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>Claims:</strong> "100% Organic, Non-GMO, No Artificial Preservatives, Sustainably Sourced"</p>
                <p><strong>Ingredients:</strong> "Organic rolled oats, organic honey, organic almonds, organic coconut oil, organic cinnamon, sea salt"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification; 