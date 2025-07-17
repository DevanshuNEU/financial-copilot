/**
 * LIQUID GLASS SVG FILTERS
 * Apple-inspired distortion and refraction effects
 */

import React from 'react';

export const LiquidGlassSVG: React.FC = () => {
  return (
    <svg 
      className="liquid-svg-filters" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}
    >
      <defs>
        {/* Liquid Glass Distortion Filter */}
        <filter id="liquid-distortion" x="0%" y="0%" width="100%" height="100%">
          {/* Generate fractal noise for organic glass texture */}
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.008 0.008" 
            numOctaves="3" 
            seed="92" 
            result="noise" 
          />
          
          {/* Blur the noise for smoother distortion */}
          <feGaussianBlur 
            in="noise" 
            stdDeviation="2" 
            result="blurred" 
          />
          
          {/* Apply displacement mapping for glass-like refraction */}
          <feDisplacementMap 
            in="SourceGraphic" 
            in2="blurred" 
            scale="8" 
            xChannelSelector="R" 
            yChannelSelector="G" 
            result="distorted"
          />
          
          {/* Enhance saturation for Apple-like glass effect */}
          <feColorMatrix 
            in="distorted"
            type="saturate"
            values="1.8"
            result="saturated"
          />
          
          {/* Add subtle brightness adjustment */}
          <feComponentTransfer in="saturated" result="final">
            <feFuncA type="discrete" tableValues="0.95"/>
          </feComponentTransfer>
        </filter>
        
        {/* Subtle Glass Blur for Navigation */}
        <filter id="liquid-nav-blur" x="0%" y="0%" width="100%" height="100%">
          <feGaussianBlur 
            in="SourceGraphic" 
            stdDeviation="0.5" 
            result="blur" 
          />
          <feColorMatrix 
            in="blur"
            type="saturate"
            values="1.6"
          />
        </filter>
        
        {/* Premium Glass Effect with Light Refraction */}
        <filter id="liquid-premium" x="-20%" y="-20%" width="140%" height="140%">
          {/* Create noise pattern */}
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.01 0.01" 
            numOctaves="2" 
            seed="100" 
            result="noise" 
          />
          
          {/* Apply gentle distortion */}
          <feDisplacementMap 
            in="SourceGraphic" 
            in2="noise" 
            scale="4" 
            xChannelSelector="R" 
            yChannelSelector="G" 
            result="distorted"
          />
          
          {/* Enhance colors */}
          <feColorMatrix 
            in="distorted"
            type="saturate"
            values="1.8"
            result="saturated"
          />
          
          {/* Add subtle glow */}
          <feGaussianBlur 
            in="saturated" 
            stdDeviation="1" 
            result="glow" 
          />
          
          {/* Composite the effects */}
          <feComposite 
            in="saturated" 
            in2="glow" 
            operator="over" 
          />
        </filter>
      </defs>
    </svg>
  );
};

export default LiquidGlassSVG;
