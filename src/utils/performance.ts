'use client'

// Step 5.7: Performance Monitoring Utility
// Tracks Web Vitals, custom metrics, memory usage, and bundle analysis

interface PerformanceMetrics {
  // Web Vitals
  LCP?: number // Largest Contentful Paint
  FID?: number // First Input Delay
  CLS?: number // Cumulative Layout Shift
  FCP?: number // First Contentful Paint
  TTFB?: number // Time to First Byte
  INP?: number // Interaction to Next Paint
  
  // Custom metrics
  pageLoadTime?: number
  domInteractive?: number
  domComplete?: number
  firstPaint?: number
  
  // Memory (if available)
  memory?: {
    usedJSHeapSize: number
    totalJSHeapSize: number
    jsHeapSizeLimit: number
  }
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {}
  private observers: PerformanceObserver[] = []
  private isMonitoring = false

  startMonitoring() {
    if (this.isMonitoring || typeof window === 'undefined') return
    this.isMonitoring = true

    // Monitor Web Vitals
    this.observeLCP()
    this.observeCLS()
    this.observeFCP()
    this.observeINP()
    
    // Get initial navigation timing
    this.recordNavigationTiming()
    
    // Monitor memory (Chrome only)
    this.recordMemoryUsage()
    
    // Log initial metrics to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 Performance monitoring started')
    }
  }

  stopMonitoring() {
    this.observers.forEach(obs => obs.disconnect())
    this.observers = []
    this.isMonitoring = false
  }

  // Largest Contentful Paint
  private observeLCP() {
    if (!('PerformanceObserver' in window)) return
    
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        this.metrics.LCP = lastEntry.startTime
        
        // Log in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`📊 LCP: ${lastEntry.startTime.toFixed(2)}ms`)
        }
      })
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] as const as unknown as string[] })
      this.observers.push(observer)
    } catch {
      // LCP not supported
    }
  }

  // Cumulative Layout Shift
  private observeCLS() {
    if (!('PerformanceObserver' in window)) return
    
    let clsValue = 0
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry as { hadRecentInput?: boolean; value?: number }
          if (!layoutShiftEntry.hadRecentInput && layoutShiftEntry.value) {
            clsValue += layoutShiftEntry.value
          }
        }
        this.metrics.CLS = clsValue
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`📊 CLS: ${clsValue.toFixed(4)}`)
        }
      })
      
      observer.observe({ entryTypes: ['layout-shift'] as const as unknown as string[] })
      this.observers.push(observer)
    } catch {
      // CLS not supported
    }
  }

  // First Contentful Paint
  private observeFCP() {
    if (!('PerformanceObserver' in window)) return
    
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint')
        if (fcpEntry) {
          this.metrics.FCP = fcpEntry.startTime
          
          if (process.env.NODE_ENV === 'development') {
            console.log(`📊 FCP: ${fcpEntry.startTime.toFixed(2)}ms`)
          }
        }
      })
      
      observer.observe({ entryTypes: ['paint'] as const as unknown as string[] })
      this.observers.push(observer)
    } catch {
      // FCP not supported
    }
  }

  // Interaction to Next Paint
  private observeINP() {
    if (!('PerformanceObserver' in window)) return
    
    let maxDuration = 0
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const duration = (entry as PerformanceEntry).duration
          if (duration > maxDuration) {
            maxDuration = duration
            this.metrics.INP = maxDuration
          }
        }
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`📊 INP: ${maxDuration.toFixed(2)}ms`)
        }
      })
      
      observer.observe({ entryTypes: ['event'] as const as unknown as string[], buffered: true })
      this.observers.push(observer)
    } catch {
      // INP not supported
    }
  }

  // Navigation Timing API
  private recordNavigationTiming() {
    if (typeof window === 'undefined') return
    
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        
        if (navEntry) {
          this.metrics.TTFB = navEntry.responseStart - navEntry.startTime
          this.metrics.domInteractive = navEntry.domInteractive - navEntry.startTime
          this.metrics.domComplete = navEntry.domComplete - navEntry.startTime
          this.metrics.pageLoadTime = navEntry.loadEventEnd - navEntry.startTime
          
          if (process.env.NODE_ENV === 'development') {
            console.log('📊 Navigation Timing:')
            console.log(`  TTFB: ${this.metrics.TTFB.toFixed(2)}ms`)
            console.log(`  DOM Interactive: ${this.metrics.domInteractive?.toFixed(2)}ms`)
            console.log(`  DOM Complete: ${this.metrics.domComplete?.toFixed(2)}ms`)
            console.log(`  Page Load: ${this.metrics.pageLoadTime?.toFixed(2)}ms`)
          }
        }
      }, 0)
    })
  }

  // Memory Usage (Chrome only)
  private recordMemoryUsage() {
    if (typeof window === 'undefined') return
    
    const memory = (performance as { memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory
    if (memory) {
      this.metrics.memory = {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
      }
      
      if (process.env.NODE_ENV === 'development') {
        const usedMB = (memory.usedJSHeapSize / 1048576).toFixed(2)
        const totalMB = (memory.totalJSHeapSize / 1048576).toFixed(2)
        console.log(`📊 Memory: ${usedMB}MB / ${totalMB}MB`)
      }
    }
  }

  // Get current metrics
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  // Report metrics to console or analytics
  reportMetrics() {
    const metrics = this.getMetrics()
    
    // Grade performance
    const grades = this.gradePerformance(metrics)
    
    console.group('🎯 Performance Report')
    console.table({
      'LCP (Largest Contentful Paint)': `${metrics.LCP?.toFixed(2) || 'N/A'}ms ${grades.LCP}`,
      'FCP (First Contentful Paint)': `${metrics.FCP?.toFixed(2) || 'N/A'}ms ${grades.FCP}`,
      'CLS (Cumulative Layout Shift)': `${metrics.CLS?.toFixed(4) || 'N/A'} ${grades.CLS}`,
      'INP (Interaction to Next Paint)': `${metrics.INP?.toFixed(2) || 'N/A'}ms ${grades.INP}`,
      'TTFB (Time to First Byte)': `${metrics.TTFB?.toFixed(2) || 'N/A'}ms ${grades.TTFB}`,
      'Page Load Time': `${metrics.pageLoadTime?.toFixed(2) || 'N/A'}ms`,
    })
    console.groupEnd()
    
    return metrics
  }

  // Grade performance based on thresholds
  private gradePerformance(metrics: PerformanceMetrics) {
    return {
      LCP: metrics.LCP ? (metrics.LCP < 2500 ? '✅ Good' : metrics.LCP < 4000 ? '⚠️ Needs Improvement' : '❌ Poor') : 'N/A',
      FCP: metrics.FCP ? (metrics.FCP < 1800 ? '✅ Good' : metrics.FCP < 3000 ? '⚠️ Needs Improvement' : '❌ Poor') : 'N/A',
      CLS: metrics.CLS ? (metrics.CLS < 0.1 ? '✅ Good' : metrics.CLS < 0.25 ? '⚠️ Needs Improvement' : '❌ Poor') : 'N/A',
      INP: metrics.INP ? (metrics.INP < 200 ? '✅ Good' : metrics.INP < 500 ? '⚠️ Needs Improvement' : '❌ Poor') : 'N/A',
      TTFB: metrics.TTFB ? (metrics.TTFB < 800 ? '✅ Good' : metrics.TTFB < 1800 ? '⚠️ Needs Improvement' : '❌ Poor') : 'N/A',
    }
  }

  // Measure custom operation
  measureOperation(name: string, fn: () => void) {
    const start = performance.now()
    fn()
    const end = performance.now()
    const duration = end - start
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`)
    }
    
    return duration
  }

  // Async measure
  async measureAsyncOperation<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now()
    const result = await fn()
    const end = performance.now()
    const duration = end - start
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`)
    }
    
    return result
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor()

// React hook for using performance monitor
export function usePerformanceMonitor() {
  if (typeof window !== 'undefined') {
    performanceMonitor.startMonitoring()
    
    // Report metrics after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        performanceMonitor.reportMetrics()
      }, 3000)
    })
  }
  
  return performanceMonitor
}

export default performanceMonitor
