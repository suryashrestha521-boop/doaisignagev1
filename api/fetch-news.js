// api/fetch-news.js
export default async function handler(request, response) {
  const KU_URL = 'https://ku.edu.np/news-app?search_category=3&search_school=1&search_department=66&search_site_name=kudoai';
  
  try {
    const res = await fetch(KU_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    
    const html = await res.text();
    
    response.setHeader('Content-Type', 'text/html');
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Cache-Control', 'public, max-age=300');
    
    return response.status(200).send(html);
  } catch (error) {
    console.error('Error:', error);
    return response.status(500).json({ error: error.message });
  }
}