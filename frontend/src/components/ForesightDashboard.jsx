import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Calendar, ShieldAlert } from 'lucide-react';

const ForesightDashboard = ({ riskData, isDarkMode, isEnglish }) => {
    const infectionWindows = riskData?.forecast?.infectionWindows || [];
    const forecast = riskData?.forecast?.forecast || [];

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return isEnglish 
            ? date.toLocaleDateString('en-US', { weekday: 'short', hour: 'numeric', hour12: true })
            : date.toLocaleDateString('mr-IN', { weekday: 'short', hour: 'numeric', hour12: true });
    };

    const translateTarget = (target) => {
        if (!isEnglish) {
            const translations = {
                'fungal': 'बुरशीजन्य',
                'bacterial': 'जिवाणूजन्य',
                'viral': 'विषाणूजन्य',
                'aphids': 'मावा',
                'whiteflies': 'पांढरी माशी',
                'borers': 'अळी',
                'mites': 'कोळी'
            };
            return translations[target] || target;
        }
        return target;
    };

    if (!forecast.length) {
        return (
            <div style={{ padding: '20px', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                {isEnglish ? 'No forecast data available.' : 'अंदाज डेटा उपलब्ध नाही.'}
            </div>
        );
    }

    return (
        <div style={{
            background: isDarkMode ? '#1f2937' : '#ffffff',
            padding: '24px',
            borderRadius: '16px',
            border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`
        }}>
            <h3 style={{ 
                margin: '0 0 20px 0', 
                color: isDarkMode ? '#f3f4f6' : '#1f2937',
                fontSize: '18px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <ShieldAlert size={20} color="#8b5cf6" />
                {isEnglish ? 'Predictive Foresight Engine' : 'अंदाज इंजिन'}
            </h3>

            {infectionWindows.length === 0 ? (
                <div style={{
                    padding: '20px',
                    background: isDarkMode ? '#064e3b20' : '#ecfdf5',
                    borderRadius: '12px',
                    border: `1px solid ${isDarkMode ? '#064e3b' : '#10b98130'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: isDarkMode ? '#34d399' : '#059669'
                }}>
                    <ShieldAlert size={24} />
                    <div>
                        <div style={{ fontWeight: '600', fontSize: '16px' }}>
                            {isEnglish ? 'Clear Horizon' : 'धोका नाही'}
                        </div>
                        <div style={{ fontSize: '14px', opacity: 0.8 }}>
                            {isEnglish 
                                ? 'No prolonged infection or pest windows detected in the 5-day forecast.' 
                                : 'पुढील ५ दिवसांच्या अंदाजात कोणताही सलग रोग किंवा कीड धोका आढळला नाही.'}
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                    <div style={{
                        color: isDarkMode ? '#f3f4f6' : '#1f2937',
                        fontSize: '15px',
                        fontWeight: '500',
                        marginBottom: '8px'
                    }}>
                        {isEnglish ? 'Detected Infection Windows (Action Required):' : 'शोधलेले धोक्याचे टप्पे (कृती आवश्यक):'}
                    </div>

                    {infectionWindows.map((window, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            style={{
                                background: isDarkMode ? '#7f1d1d20' : '#fef2f2',
                                borderLeft: '4px solid #ef4444',
                                padding: '16px',
                                borderRadius: '0 12px 12px 0',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <AlertTriangle size={20} color="#ef4444" />
                                    <span style={{ 
                                        fontWeight: '600', 
                                        color: isDarkMode ? '#fca5a5' : '#991b1b',
                                        fontSize: '16px'
                                    }}>
                                        {translateTarget(window.target)} {isEnglish ? window.type === 'disease' ? 'Disease Risk' : 'Pest Risk' : 'धोका'}
                                    </span>
                                </div>
                                <div style={{ 
                                    background: '#ef444420', 
                                    color: isDarkMode ? '#fca5a5' : '#dc2626',
                                    padding: '4px 10px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}>
                                    <Clock size={12} />
                                    {window.durationHours} {isEnglish ? 'hours duration' : 'तास कालावधी'}
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: isDarkMode ? '#d1d5db' : '#4b5563', fontSize: '14px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Calendar size={14} />
                                    {formatTime(window.startTime)} - {formatTime(window.endTime)}
                                </div>
                            </div>

                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: '1fr 1fr', 
                                gap: '8px',
                                marginTop: '4px'
                            }}>
                                <div style={{ background: isDarkMode ? '#37415160' : '#ffffff60', padding: '8px', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '12px', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>{isEnglish ? 'Peak Humidity' : 'कमाल आर्द्रता'}</div>
                                    <div style={{ fontWeight: '600', color: isDarkMode ? '#f3f4f6' : '#1f2937' }}>{window.maxHumidity}%</div>
                                </div>
                                <div style={{ background: isDarkMode ? '#37415160' : '#ffffff60', padding: '8px', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '12px', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>{isEnglish ? 'Avg Temp' : 'सरासरी तापमान'}</div>
                                    <div style={{ fontWeight: '600', color: isDarkMode ? '#f3f4f6' : '#1f2937' }}>{Math.round(window.avgTemp)}°C</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ForesightDashboard;
