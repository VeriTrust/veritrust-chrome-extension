// API Base URL
export const API_BASE_URL = "https://veritrust-backend.vercel.app";

// Manual Verification route
export async function verifyManually(claims, ingredients) {
  console.log("Sending verification request with:", { claims, ingredients });
  
  // Create an AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
  
  try {
    // Send request to API
    const apiResponse = await fetch(`${API_BASE_URL}/manual-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({
        claims,
        ingredients
      }),
      signal: controller.signal
    });
    
    // Clear the timeout since the request completed
    clearTimeout(timeoutId);
    
    // Handle errors
    if (!apiResponse.ok) {
      console.error("API error:", apiResponse.status, apiResponse.statusText);
      throw new Error(`API error: ${apiResponse.status} - ${apiResponse.statusText}`);
    }
    
    // Parse response
    const data = await apiResponse.json();
    console.log("API response received:", data);
    
    // Check if the response has the expected format
    if (!data || typeof data !== 'object') {
      console.error("Invalid API response format:", data);
      throw new Error('Invalid API response format');
    }
    
    // Try to parse the JSON string from the extracted-text field
    try {
      // Check if extracted-text exists and is not empty
      const extractedText = data['extracted-text'];
      
      if (!extractedText) {
        console.error("No extracted text in response:", data);
        
        // If there's a message field, use that as the error
        if (data.message) {
          throw new Error(`API error: ${data.message}`);
        }
        
        // If there's a result field, try to use that directly
        if (data.result) {
          return data.result;
        }
        
        throw new Error('No result data found in API response');
      }
      
      console.log("Extracted text:", extractedText);
      
      // Try to parse the JSON string
      try {
        const parsedResult = JSON.parse(extractedText);
        console.log("Parsed result:", parsedResult);
        return parsedResult;
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        
        // If parsing fails but the extracted text is not empty, 
        // create a simple result object with the text
        if (extractedText.trim()) {
          return {
            verdict: "response received",
            trustability_score: 50,
            why: "The API returned a response that couldn't be fully processed",
            detailed_explanation: extractedText
          };
        }
        
        throw new Error('Failed to parse API response');
      }
    } catch (error) {
      console.error("Processing error:", error);
      throw error;
    }
  } catch (error) {
    // Clear the timeout to prevent memory leaks
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      console.error("Request timed out after 30 seconds");
      throw new Error('Request timed out. Please try again.');
    }
    
    throw error;
  }
}
