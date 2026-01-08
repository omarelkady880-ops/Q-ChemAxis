const sendMessage = async (messages, options = {}) => {
  const apiUrl = options.apiUrl || import.meta.env.VITE_API_URL || 'http://localhost:3001/api/mistral';
  const model = options.model || 'mistral-tiny';
  const max_tokens = options.max_tokens; // Don't set a default, let backend handle it
  const temperature = options.temperature || 0.7;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        ...(max_tokens && { max_tokens }), // Only include max_tokens if explicitly provided
        temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      text: data.choices?.[0]?.message?.content || 'No response received',
      raw: data,
      apiUrl
    };
  } catch (error) {
    console.error('Mistral API error:', error);
    return {
      text: 'Error: Unable to connect to the AI service.',
      error: error.message,
      apiUrl
    };
  }
};

export { sendMessage };
