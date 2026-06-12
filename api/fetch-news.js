export default async function handler(request, response) {
  const KU_URL = 'https://ku.edu.np/news-app?search_category=3&search_school=1&search_department=66&search_site_name=kudoai';
  
  try {
    const res = await fetch(KU_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const html = await res.text();
    
    response.setHeader('Content-Type', 'text/html');
    response.setHeader('Access-Control-Allow-Origin', '*');
    return response.status(200).send(html);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}