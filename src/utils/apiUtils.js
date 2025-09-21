/**
 * API utility functions
 */

/**
 * Extract data from ApiResponse format
 * @param {Object} response - Axios response
 * @returns {Object} Extracted data
 */
export const extractApiResponse = (response) => {
    if (!response || !response.data) {
        throw new Error('Invalid response format');
    }

    const apiResponse = response.data;

    // Check if response follows ApiResponse format
    if (typeof apiResponse === 'object' && 'success' in apiResponse) {
        if (!apiResponse.success) {
            const error = new Error(apiResponse.message || apiResponse.error || 'API request failed');
            error.response = { data: apiResponse };
            throw error;
        }
        return apiResponse.data;
    }

    // Fallback for responses that don't use ApiResponse wrapper
    return apiResponse;
};
