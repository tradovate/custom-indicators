// VWAP Zones with Bands - Tradovate Community Indicator
// Converted from Pine Script
// Original: VWAP Zones -- Clean Settings (Band 1 + 2)
//
// Description:
// This indicator displays VWAP (Volume Weighted Average Price) with two 
// standard deviation bands and customizable zones around each line.
// Perfect for identifying support/resistance levels and price extremes.
//
// Features:
// - Daily VWAP calculation with automatic session reset
// - Two customizable standard deviation bands
// - Visual zones around VWAP and each band
// - Fully customizable colors and multipliers

const predef = require('./predef');
const meta = require('./meta');

class VWAPZones {
    init() {
        // Initialize VWAP calculation variables
        this.sumPV = 0;      // Sum of price * volume
        this.sumV = 0;       // Sum of volume
        this.sumPV2 = 0;     // Sum of price^2 * volume (for stdev)
        this.lastSessionDay = null;
    }

    map(d, i, history) {
        const { high, low, close, volume, timestamp } = d;
        
        // HLC3 as source (average of high, low, close)
        const src = (high + low + close) / 3;
        
        // Check for daily session change
        const currentDate = new Date(timestamp());
        const currentDay = currentDate.getDate();
        
        if (this.lastSessionDay !== currentDay) {
            // New session - reset all values
            this.sumPV = 0;
            this.sumV = 0;
            this.sumPV2 = 0;
            this.lastSessionDay = currentDay;
        }
        
        // VWAP calculation
        this.sumPV += src * volume;
        this.sumV += volume;
        this.sumPV2 += src * src * volume;
        
        const vwap = this.sumPV / this.sumV;
        
        // Calculate standard deviation
        const variance = (this.sumPV2 / this.sumV) - (vwap * vwap);
        const stdev = Math.sqrt(Math.max(0, variance));
        
        // Get user parameters
        const band1Mult = this.props.band1Mult;
        const band2Mult = this.props.band2Mult;
        const zonePoints = this.props.zonePoints;
        
        // Calculate bands
        const ub1 = vwap + stdev * band1Mult;
        const lb1 = vwap - stdev * band1Mult;
        const ub2 = vwap + stdev * band2Mult;
        const lb2 = vwap - stdev * band2Mult;
        
        // Calculate zone boundaries
        const vwapTop = vwap + zonePoints;
        const vwapBot = vwap - zonePoints;
        const ub1Top = ub1 + zonePoints;
        const ub1Bot = ub1 - zonePoints;
        const lb1Top = lb1 + zonePoints;
        const lb1Bot = lb1 - zonePoints;
        const ub2Top = ub2 + zonePoints;
        const ub2Bot = ub2 - zonePoints;
        const lb2Top = lb2 + zonePoints;
        const lb2Bot = lb2 - zonePoints;
        
        return {
            vwap: vwap,
            ub1: ub1,
            lb1: lb1,
            ub2: ub2,
            lb2: lb2,
            vwapTop: vwapTop,
            vwapBot: vwapBot,
            ub1Top: ub1Top,
            ub1Bot: ub1Bot,
            lb1Top: lb1Top,
            lb1Bot: lb1Bot,
            ub2Top: ub2Top,
            ub2Bot: ub2Bot,
            lb2Top: lb2Top,
            lb2Bot: lb2Bot
        };
    }
}

module.exports = {
    name: 'vwapZones',
    description: 'VWAP with Standard Deviation Bands and Zones',
    calculator: VWAPZones,
    params: {
        band1Mult: predef.paramSpecs.number(1.0, 0.1, 0.1),
        band2Mult: predef.paramSpecs.number(2.0, 0.1, 0.1),
        zonePoints: predef.paramSpecs.number(5.0, 0.1, 0.1)
    },
    inputType: meta.InputType.BARS,
    tags: ['VWAP', 'Bands', 'Zones', 'Volume'],
    schemeStyles: {
        dark: {
            vwap: { color: '#0000FF', lineWidth: 2 },
            ub1: { color: '#00FF00', lineWidth: 1 },
            lb1: { color: '#00FF00', lineWidth: 1 },
            ub2: { color: '#FFA500', lineWidth: 1 },
            lb2: { color: '#FFA500', lineWidth: 1 },
            vwapZone: { color: 'rgba(0, 0, 255, 0.2)' },
            band1ZoneUpper: { color: 'rgba(0, 255, 0, 0.2)' },
            band1ZoneLower: { color: 'rgba(0, 255, 0, 0.2)' },
            band2ZoneUpper: { color: 'rgba(255, 165, 0, 0.2)' },
            band2ZoneLower: { color: 'rgba(255, 165, 0, 0.2)' }
        }
    },
    plots: {
        vwap: { title: 'VWAP' },
        ub1: { title: 'Band 1 Upper' },
        lb1: { title: 'Band 1 Lower' },
        ub2: { title: 'Band 2 Upper' },
        lb2: { title: 'Band 2 Lower' }
    },
    areas: {
        vwapZone: {
            top: 'vwapTop',
            bottom: 'vwapBot',
            title: 'VWAP Zone'
        },
        band1ZoneUpper: {
            top: 'ub1Top',
            bottom: 'ub1Bot',
            title: 'Band 1 Upper Zone'
        },
        band1ZoneLower: {
            top: 'lb1Top',
            bottom: 'lb1Bot',
            title: 'Band 1 Lower Zone'
        },
        band2ZoneUpper: {
            top: 'ub2Top',
            bottom: 'ub2Bot',
            title: 'Band 2 Upper Zone'
        },
        band2ZoneLower: {
            top: 'lb2Top',
            bottom: 'lb2Bot',
            title: 'Band 2 Lower Zone'
        }
    }
};
