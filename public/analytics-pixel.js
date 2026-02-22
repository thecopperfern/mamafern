(function() {
  const ANALYTICS_ENDPOINT = 'https://your-app-domain.com/api/analytics/events';
  const SHOP_ID = window.Shopify?.shop || 'unknown';
  
  let sessionId = localStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('analytics_session_id', sessionId);
  }

  const pageStartTime = Date.now();
  let maxScrollDepth = 0;

  function getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  function sendEvent(eventType, data = {}) {
    const event = {
      shop_id: SHOP_ID,
      session_id: sessionId,
      event_type: eventType,
      timestamp: Math.floor(Date.now() / 1000),
      page_url: window.location.href,
      referrer: document.referrer,
      device_type: getDeviceType(),
      user_agent: navigator.userAgent,
      ...data
    };

    navigator.sendBeacon(ANALYTICS_ENDPOINT, JSON.stringify(event));
  }

  // Track page view
  sendEvent('page_view');

  // Track product views
  if (window.location.pathname.includes('/products/')) {
    const productId = window.location.pathname.split('/products/')[1]?.split('/')[0];
    sendEvent('product_view', { product_id: productId });
  }

  // Track scroll depth
  function updateScrollDepth() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);
    maxScrollDepth = Math.max(maxScrollDepth, scrollPercent);
  }

  window.addEventListener('scroll', updateScrollDepth, { passive: true });

  // Track engagement on page leave
  window.addEventListener('beforeunload', function() {
    const timeOnPage = Math.round((Date.now() - pageStartTime) / 1000);
    sendEvent('engagement', {
      scroll_depth: maxScrollDepth,
      time_on_page: timeOnPage
    });
  });

  // Track add to cart
  document.addEventListener('click', function(e) {
    const target = e.target.closest('[name="add"], [type="submit"][value*="Add"]');
    if (target && window.location.pathname.includes('/products/')) {
      const productId = window.location.pathname.split('/products/')[1]?.split('/')[0];
      sendEvent('add_to_cart', { product_id: productId });
    }
  });

  // Track checkout start
  if (window.location.pathname.includes('/checkout') || window.location.pathname.includes('/cart')) {
    if (window.Shopify?.Checkout) {
      sendEvent('checkout_start', {
        cart_value: window.Shopify.Checkout.total_price / 100
      });
    }
  }

  // Track purchase (on thank you page)
  if (window.location.pathname.includes('/thank') || window.location.search.includes('checkout_complete')) {
    sendEvent('purchase', {
      cart_value: window.Shopify?.Checkout?.total_price / 100
    });
  }
})();
