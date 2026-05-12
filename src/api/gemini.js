/**
 * Gemini API client that connects to our proxy server
 * The proxy handles API key management and request formatting
 */
const API_BASE = typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE
  ? import.meta.env.VITE_API_BASE
  : '/api';

export async function queryGemini(prompt, conversationHistory = []) {
  // Create conversation context from history
  const conversationContext = conversationHistory
    .map(msg => `${msg.isBot ? 'Assistant' : 'User'}: ${msg.text}`)
    .join('\n');

  // Format the prompt with conversation history
  const formattedPrompt = `
Kamu adalah asisten AI pembelajaran yang memberikan jawaban dalam format JSON terstruktur, namun mudah diolah untuk tampilan web. 
Hasil akhirnya akan ditampilkan pada antarmuka chatbot edukasi React, sehingga pastikan struktur JSON bersih, jelas, dan dapat langsung di-render.

Format respons yang harus kamu kembalikan:
{
  "section": {
    "question": "<pertanyaan pengguna dalam bentuk kalimat lengkap>",
    "answer": "<penjelasan panjang dan rapi dengan paragraf terpisah>",
    "summary": "<ringkasan singkat dan padat dalam 2–3 kalimat>",
    "resourcesSection": {
      "title": "Sumber & Referensi Belajar",
      "links": [
        { "label": "Nama Situs atau Judul Referensi", "url": "https://tautan-valid.com" },
        { "label": "Nama Referensi Lain", "url": "https://tautan-lain.com" }
      ]
    }
  }
}

Konteks percakapan sebelumnya:
${conversationContext}

Pertanyaan pengguna saat ini: "${prompt}"

Berikan respons yang koheren dengan mempertimbangkan konteks percakapan di atas.
`;

  const url = `${API_BASE}/chat`;
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt: formattedPrompt })
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`API request failed: ${res.status} ${res.statusText}${errorText ? ` - ${errorText}` : ''}`);
    }

    const data = await res.json();
    
    if (!data.text) {
      throw new Error('Invalid response from server');
    }

    // Extract JSON from the response text
    try {
      // If it's already JSON, return as is
      const jsonResponse = JSON.parse(data.text);
      return JSON.stringify(jsonResponse, null, 2);
    } catch (e) {
      // If not valid JSON, try to find JSON in the text
      const jsonMatch = data.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        const parsed = JSON.parse(jsonStr);
        return JSON.stringify(parsed, null, 2);
      }
      
      // If no JSON found, return a formatted error response
      return JSON.stringify({
        question: prompt,
        answer: "Maaf, sistem tidak dapat memformat jawaban dengan benar.",
        summary: "Terjadi kesalahan pemrosesan respons.",
        suggestedResources: []
      }, null, 2);
    }

  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Koneksi ke server gagal. Pastikan server backend sedang berjalan.');
    }
    throw new Error('Could not get a response. Please try again.');
  }
}
