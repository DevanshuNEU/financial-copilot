import { ReportHandler } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

// Enhanced performance logging for EXPENSESINK optimization
export const logWebVitals = () => {
  reportWebVitals((metric) => {
    console.log(`🚀 EXPENSESINK Performance - ${metric.name}:`, metric.value);
    
    // Performance targets for Phase 8
    const targets = {
      CLS: 0.1,
      FID: 100,
      FCP: 1200,
      LCP: 2000,
      TTFB: 600
    };
    
    const target = targets[metric.name as keyof typeof targets];
    const status = metric.value <= target ? '✅ EXCELLENT' : '🔥 NEEDS OPTIMIZATION';
    
    console.log(`Target: ${target}ms | Status: ${status}`);
  });
};

export default reportWebVitals;
