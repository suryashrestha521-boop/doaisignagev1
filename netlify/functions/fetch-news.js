exports.handler = async function(event, context) {
  const KU_NEWS_URL = 'https://ku.edu.np/news-app?search_category=3&search_school=1&search_department=66&search_site_name=kudoai';
  
  try {
    const response = await fetch(KU_NEWS_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    
    // Parse HTML to extract news items with images
    const { JSDOM } = require('jsdom');
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    
    const items = [];
    const seen = new Set();
    
    // Find all news articles
    const articles = doc.querySelectorAll('.news-item, .article-item, .post, [class*="news"]');
    
    articles.forEach(article => {
      const titleLink = article.querySelector('h3 a, h2 a, h4 a, .title a');
      if (!titleLink) return;
      
      const title = titleLink.textContent.trim();
      if (!title || title.length < 10 || seen.has(title)) return;
      seen.add(title);
      
      // Extract image
      let imageUrl = null;
      const img = article.querySelector('img');
      if (img) {
        imageUrl = img.src || img.getAttribute('data-src');
        if (imageUrl && imageUrl.startsWith('/')) {
          imageUrl = 'https://ku.edu.np' + imageUrl;
        }
      }
      
      // Extract date
      let dateText = '';
      const dateEl = article.querySelector('.date, .post-date, time');
      if (dateEl) {
        dateText = dateEl.textContent.trim();
      }
      
      // Extract description
      let desc = '';
      const descEl = article.querySelector('p');
      if (descEl) {
        desc = descEl.textContent.trim().substring(0, 200);
      }
      
      items.push({
        title,
        date: dateText,
        description: desc,
        image: imageUrl,
        type: title.toLowerCase().includes('notice') ? 'notice' : 
              title.toLowerCase().includes('event') ? 'event' : 'news'
      });
    });
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300'
      },
      body: JSON.stringify({
        success: true,
        items: items.slice(0, 10),
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        success: false, 
        error: error.message 
      })
    };
  }
};