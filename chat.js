export default async function handler(req, res) {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Cabeceras CORS para que tu página pueda llamar a esta función
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const { messages } = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,   // ← guardada en Vercel, no en el código
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `Eres un asistente especializado en Base de Datos 2 para el portafolio de Armando Condor de la Cruz, 
estudiante de Ingeniería de Sistemas en la UPLA. 
Ayudas con: SQL Server, modelado relacional, normalización, triggers, stored procedures, vistas, índices, transacciones.
Responde en español, de forma técnica pero clara. Usa ejemplos SQL cuando sea útil. Sé conciso y preciso.`,
        messages
      })
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
