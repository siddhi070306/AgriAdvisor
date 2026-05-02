/**
 * Temporal Adapter
 * Standardizes multi-source forecast sequences into a normalized 120-hour timeline.
 * Ensures the risk engine has a consistent data format regardless of the API provider (e.g., OpenWeather, IMD).
 */

class TemporalAdapter {
    /**
     * Normalizes the forecast data into a consistent timeline sequence.
     * @param {Array} rawForecast - Array of forecast data points
     * @param {string} source - Source of the forecast data (e.g., 'openweather')
     * @returns {Array} Normalized timeline
     */
    normalizeTimeline(rawForecast, source = 'openweather') {
        if (!Array.isArray(rawForecast) || rawForecast.length === 0) {
            return [];
        }

        // Sort chronologically
        const sorted = [...rawForecast].sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

        // Normalize each data point
        return sorted.map((point, index) => {
            return {
                id: `seq_${index}`,
                datetime: new Date(point.datetime).toISOString(),
                temperature: point.temperature || 0,
                humidity: point.humidity || 0,
                windSpeed: point.windSpeed || 0,
                rainfall: point.rainfall || 0,
                pressure: point.pressure || 1013,
                description: point.description || 'clear',
                // Calculate duration of this slice (typically 3 hours for OpenWeather)
                durationHours: this._calculateDuration(sorted, index)
            };
        });
    }

    /**
     * Calculates the duration in hours of a specific time slice
     */
    _calculateDuration(timeline, index) {
        if (index === timeline.length - 1) {
            return 3; // Assume 3 hours for the last point
        }
        
        const current = new Date(timeline[index].datetime);
        const next = new Date(timeline[index + 1].datetime);
        const diffMs = next - current;
        const diffHours = diffMs / (1000 * 60 * 60);
        
        return Math.round(diffHours) || 3;
    }
}

module.exports = new TemporalAdapter();
