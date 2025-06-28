/**
 * Zero Point Labs Analytics Tracking Script
 * Version: 1.0.0
 * 
 * Include this script on client websites to track analytics data
 * and form submissions for the Zero Point Labs dashboard.
 */

(function(window, document) {
  'use strict';

  // Configuration
  const config = window.ZPL_CONFIG || {};
  const API_BASE = config.apiBase || window.location.origin;
  const CLIENT_CODE = config.clientCode;
  const TRACK_PAGE_VIEWS = config.trackPageViews !== false;
  const TRACK_FORM_SUBMISSIONS = config.trackFormSubmissions !== false;
  const DEBUG = config.debug === true;

  // Validation
  if (!CLIENT_CODE) {
    console.error('[ZPL Analytics] Missing CLIENT_CODE in ZPL_CONFIG');
    return;
  }

  // Debug logging
  function log(...args) {
    if (DEBUG) {
      console.log('[ZPL Analytics]', ...args);
    }
  }

  // Generate session ID
  function generateSessionId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Get or create session ID
  function getSessionId() {
    let sessionId = sessionStorage.getItem('zpl_session_id');
    if (!sessionId) {
      sessionId = generateSessionId();
      sessionStorage.setItem('zpl_session_id', sessionId);
    }
    return sessionId;
  }

  // Send tracking data to the API
  async function sendTrackingData(type, data) {
    try {
      const payload = {
        clientCode: CLIENT_CODE,
        type: type,
        data: {
          ...data,
          sessionId: getSessionId(),
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          timestamp: new Date().toISOString(),
          url: window.location.href
        }
      };

      log('Sending tracking data:', payload);

      const response = await fetch(`${API_BASE}/api/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        mode: 'cors'
      });

      if (response.ok) {
        log('Tracking data sent successfully');
      } else {
        console.error('[ZPL Analytics] Failed to send tracking data:', response.status);
      }
    } catch (error) {
      console.error('[ZPL Analytics] Error sending tracking data:', error);
    }
  }

  // Track page view
  function trackPageView() {
    if (!TRACK_PAGE_VIEWS) return;
    
    log('Tracking page view');
    sendTrackingData('page_view', {
      page: window.location.pathname,
      title: document.title,
      count: 1
    });
  }

  // Track visitor (first time in session)
  function trackVisitor() {
    const hasTrackedVisitor = sessionStorage.getItem('zpl_visitor_tracked');
    if (hasTrackedVisitor) return;

    log('Tracking new visitor');
    sessionStorage.setItem('zpl_visitor_tracked', 'true');
    sendTrackingData('visitor', {
      count: 1,
      firstPage: window.location.pathname
    });
  }

  // Track form submission
  function trackFormSubmission(formData) {
    if (!TRACK_FORM_SUBMISSIONS) return;

    log('Tracking form submission:', formData);
    sendTrackingData('form_submission', {
      ...formData,
      source_url: window.location.href
    });
  }

  // Extract form data
  function extractFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    // Common field mappings
    const fieldMappings = {
      name: ['name', 'fullname', 'full_name', 'your-name', 'contact-name'],
      email: ['email', 'email-address', 'your-email', 'contact-email'],
      phone: ['phone', 'telephone', 'tel', 'phone-number', 'your-phone'],
      message: ['message', 'comment', 'comments', 'description', 'your-message'],
      service: ['service', 'services', 'service-type', 'inquiry-type', 'project-type'],
      urgency: ['urgency', 'timeline', 'when', 'timeframe']
    };

    // Extract data using field mappings
    for (const [key, possibleNames] of Object.entries(fieldMappings)) {
      for (const name of possibleNames) {
        const value = formData.get(name);
        if (value && value.trim()) {
          data[key] = value.trim();
          break;
        }
      }
    }

    // Fallback: use any field that looks like an email
    if (!data.email) {
      for (const [name, value] of formData.entries()) {
        if (name.toLowerCase().includes('email') && value.includes('@')) {
          data.email = value.trim();
          break;
        }
      }
    }

    // Fallback: use any field that looks like a name
    if (!data.name) {
      for (const [name, value] of formData.entries()) {
        if (name.toLowerCase().includes('name') && value.trim().length > 1) {
          data.name = value.trim();
          break;
        }
      }
    }

    // Set defaults
    data.service = data.service || 'General Inquiry';
    data.urgency = data.urgency || 'flexible';

    return data;
  }

  // Setup form tracking
  function setupFormTracking() {
    if (!TRACK_FORM_SUBMISSIONS) return;

    log('Setting up form tracking');

    // Track form submissions
    document.addEventListener('submit', function(event) {
      const form = event.target;
      
      // Skip if not a form or if it has a data-zpl-ignore attribute
      if (form.tagName !== 'FORM' || form.hasAttribute('data-zpl-ignore')) {
        return;
      }

      try {
        const formData = extractFormData(form);
        
        // Only track if we have at least name and email
        if (formData.name && formData.email) {
          trackFormSubmission(formData);
        } else {
          log('Form submission ignored - missing required fields');
        }
      } catch (error) {
        console.error('[ZPL Analytics] Error tracking form:', error);
      }
    });
  }

  // Initialize tracking
  function init() {
    log('Initializing Zero Point Labs Analytics');
    log('Client Code:', CLIENT_CODE);
    log('API Base:', API_BASE);

    // Track initial page load
    trackVisitor();
    trackPageView();

    // Setup form tracking
    setupFormTracking();

    // Track page changes for SPAs
    let currentUrl = window.location.href;
    const observer = new MutationObserver(function() {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        trackPageView();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    log('Analytics initialization complete');
  }

  // Public API
  window.ZPLTracking = {
    trackPageView: trackPageView,
    trackFormSubmission: trackFormSubmission,
    trackCustomEvent: function(eventName, eventData) {
      log('Tracking custom event:', eventName, eventData);
      sendTrackingData('custom_event', {
        eventName: eventName,
        eventData: eventData
      });
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})(window, document); 