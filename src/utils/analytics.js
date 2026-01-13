/**
 * Analytics utility for Google Analytics 4
 *
 * Track user behavior and conversion events.
 * GA4 Measurement ID should be set in index.html (G-XXXXXXXXXX)
 */

/**
 * Track a custom event
 * @param {string} action - Event action name
 * @param {string} category - Event category
 * @param {string} label - Event label (optional)
 * @param {number} value - Event value (optional)
 */
export const trackEvent = (action, category, label = null, value = null) => {
  if (typeof window !== 'undefined' && window.gtag) {
    const params = {
      event_category: category,
    }

    if (label) params.event_label = label
    if (value !== null) params.value = value

    window.gtag('event', action, params)
  }
}

/**
 * Track when a user starts using a decision tool
 * @param {string} toolName - Name of the tool (threeps, tententen, etc.)
 */
export const trackToolStarted = (toolName) => {
  trackEvent('tool_started', 'tools', toolName)
}

/**
 * Track when a user completes a decision analysis
 * @param {string} toolName - Name of the tool
 * @param {number} score - The calculated score (if applicable)
 */
export const trackToolCompleted = (toolName, score = null) => {
  trackEvent('tool_completed', 'tools', toolName, score)
}

/**
 * Track when a user requests AI analysis
 * @param {string} toolName - Name of the tool used
 */
export const trackAiAnalysisRequested = (toolName) => {
  trackEvent('ai_analysis_requested', 'premium', toolName)
}

/**
 * Track when a user clicks upgrade
 * @param {string} location - Where the upgrade was clicked (pricing, feature_gate, etc.)
 * @param {string} plan - The plan being upgraded to
 */
export const trackUpgradeClicked = (location, plan = 'premium') => {
  trackEvent('upgrade_clicked', 'conversion', location)
}

/**
 * Track when a user saves a decision to history
 * @param {string} toolName - Name of the tool used
 */
export const trackDecisionSaved = (toolName) => {
  trackEvent('decision_saved', 'engagement', toolName)
}

/**
 * Track page views (automatically handled by GA4, but useful for SPAs)
 * @param {string} pagePath - The page path
 * @param {string} pageTitle - The page title
 */
export const trackPageView = (pagePath, pageTitle) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle,
    })
  }
}

/**
 * Track checkout initiation
 * @param {string} billingPeriod - monthly or yearly
 * @param {number} value - Price value
 */
export const trackCheckoutStarted = (billingPeriod, value) => {
  trackEvent('begin_checkout', 'ecommerce', billingPeriod, value)
}

/**
 * Track successful purchase
 * @param {string} billingPeriod - monthly or yearly
 * @param {number} value - Price value
 */
export const trackPurchaseComplete = (billingPeriod, value) => {
  trackEvent('purchase', 'ecommerce', billingPeriod, value)
}

/**
 * Track email signup
 * @param {string} location - Where the signup occurred (hero, cta, etc.)
 */
export const trackEmailSignup = (location) => {
  trackEvent('email_signup', 'lead_generation', location)
}

/**
 * Track feature gate hit (premium feature blocked)
 * @param {string} feature - The feature that was blocked
 */
export const trackFeatureGateHit = (feature) => {
  trackEvent('feature_gate_hit', 'premium', feature)
}

export default {
  trackEvent,
  trackToolStarted,
  trackToolCompleted,
  trackAiAnalysisRequested,
  trackUpgradeClicked,
  trackDecisionSaved,
  trackPageView,
  trackCheckoutStarted,
  trackPurchaseComplete,
  trackEmailSignup,
  trackFeatureGateHit,
}
