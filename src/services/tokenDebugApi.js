import apiClient from './apiClient'
import { extractApiResponse } from '@/utils/apiUtils'
import { API_ENDPOINTS } from '@/config/constants'

/**
 * Token Debug API - Debug utilities for JWT tokens and Redis
 * WARNING: This should be removed in production!
 */
export const tokenDebugApi = {
    // Debug token information
    async debugToken(token) {
        const response = await apiClient.post(`${API_ENDPOINTS.DEBUG_TOKEN}/info`, { token })
        return extractApiResponse(response)
    },

    // Check Redis connection
    async checkRedisConnection() {
        const response = await apiClient.get(`${API_ENDPOINTS.DEBUG_TOKEN}/redis-check`)
        return extractApiResponse(response)
    },

    // ========== UTILITY METHODS ==========

    // Validate token format (client-side)
    validateTokenFormat(token) {
        if (!token || typeof token !== 'string') {
            return { isValid: false, error: 'Token is required and must be a string' }
        }

        const parts = token.split('.')
        if (parts.length !== 3) {
            return { isValid: false, error: 'Token must have 3 parts separated by dots' }
        }

        // Basic base64 validation
        for (const part of parts) {
            try {
                atob(part.replace(/-/g, '+').replace(/_/g, '/'))
            } catch (err) {
                console.warn('Token validation error:', err)
                return { isValid: false, error: 'Token parts are not valid base64' }
            }
        }

        return { isValid: true }
    },

    // Parse JWT payload (client-side, without verification)
    parseJwtPayload(token) {
        try {
            const validation = this.validateTokenFormat(token)
            if (!validation.isValid) {
                throw new Error(validation.error)
            }

            const parts = token.split('.')
            const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))

            return {
                success: true,
                payload,
                issuedAt: new Date(payload.iat * 1000),
                expiresAt: new Date(payload.exp * 1000),
                timeUntilExpiry: payload.exp * 1000 - Date.now()
            }
        } catch (err) {
            return {
                success: false,
                error: err.message
            }
        }
    },

    // Format debug info for display
    formatDebugInfo(debugInfo) {
        if (!debugInfo) return 'No debug info available'

        const lines = []

        lines.push('=== SERVER TIME ===')
        lines.push(`Server Time: ${debugInfo.currentServerTime}`)
        lines.push(`Local DateTime: ${debugInfo.currentLocalDateTime}`)
        lines.push(`Timezone: ${debugInfo.serverTimeZone}`)
        lines.push('')

        lines.push('=== JWT CONFIG ===')
        lines.push(`Expiration (ms): ${debugInfo.jwtExpirationConfig}`)
        lines.push(`Expiration (hours): ${debugInfo.jwtExpirationHours}`)
        lines.push('')

        if (debugInfo.username) {
            lines.push('=== TOKEN INFO ===')
            lines.push(`Username: ${debugInfo.username}`)
            lines.push(`Token Expiration: ${debugInfo.tokenExpiration}`)
            lines.push(`Is Expired: ${debugInfo.isTokenExpired}`)
            lines.push(`Minutes Until Expiry: ${Math.round(debugInfo.minutesUntilExpiration)}`)
            lines.push(`Is Blacklisted: ${debugInfo.isBlacklisted}`)
            lines.push(`Overall Valid: ${debugInfo.isOverallValid}`)
            lines.push('')
        }

        if (debugInfo.redisConnectionWorking !== undefined) {
            lines.push('=== REDIS STATUS ===')
            lines.push(`Connection Working: ${debugInfo.redisConnectionWorking}`)
            if (debugInfo.message) {
                lines.push(`Message: ${debugInfo.message}`)
            }
            lines.push('')
        }

        if (debugInfo.error) {
            lines.push('=== ERROR ===')
            lines.push(`Error: ${debugInfo.error}`)
            lines.push(`Error Class: ${debugInfo.errorClass}`)
        }

        return lines.join('\n')
    }
}

export default tokenDebugApi
