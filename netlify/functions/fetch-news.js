// netlify/functions/fetch-news.js
exports.handler = async function(event, context) {
  const KU_NEWS_URL = 'https://ku.edu.np/news-app?search_category=3&search_school=1&search_department=66&search_site_name=kudoai';
  
  try {
    // Server-side fetch (no CORS issues!)
    const response = await fetch(KU_NEWS_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 8000
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      },
      body: html
    };
  } catch (error) {
    console.error('Fetch error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        error: error.message,
        url: KU_NEWS_URL
      })
    };
  }
};