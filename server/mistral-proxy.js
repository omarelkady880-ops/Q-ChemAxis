// server/mistral-proxy.js
require('dotenv').config();
const express = require("express");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Load knowledge base
let knowledgeBase = [];
try {
  const kbPath = path.join(__dirname, '..', 'src', 'chemistry_knowledge_base.json');
  if (fs.existsSync(kbPath)) {
    knowledgeBase = JSON.parse(fs.readFileSync(kbPath, 'utf8'));
  }
} catch (error) {
  console.warn("⚠️ Knowledge base not found, continuing without it");
}

// API endpoint for Mistral
router.post("/", async (req, res) => {
  const { messages, model: requestedModel, max_tokens: requestedMaxTokens, temperature } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required" });
  }

  try {
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "MISTRAL_API_KEY environment variable not set" });
    }

    // Determine the model to use
    const model = requestedModel || 'mistral-medium';
    
    // Define context window sizes for different Mistral models
    const modelContextWindows = {
      'open-mistral-7b': 32768,
      'open-mixtral-8x7b': 32768,
      'mistral-tiny': 32768,
      'mistral-small': 32768,
      'mistral-medium': 32768,
      'mistral-large-latest': 32768,
      'mistral-large': 32768,
      // Default to safe value if model not recognized
      'default': 32768
    };
    
    const contextWindow = modelContextWindows[model] || modelContextWindows['default'];
    
    // Prepare context from knowledge base (if available)
    let systemMessage = messages.find(m => m.role === 'system');
    if (knowledgeBase.length > 0) {
      const knowledgeContext = knowledgeBase.map(item =>
        `${item.name}: ${item.description}`
      ).join('\n');

      systemMessage = {
        role: "system",
        content: `You are QCHEM AXIS, an advanced quantum-level chemistry intelligence system. You have access to a comprehensive chemistry knowledge base. Use this to provide accurate, detailed answers:

${knowledgeContext}

Provide comprehensive, scientifically accurate answers with clear explanations, balanced equations, formulas, and real-world applications.`
      };
    }

    const messagesWithContext = systemMessage 
      ? [systemMessage, ...messages.filter(m => m.role !== 'system')]
      : messages;
    
    // Calculate total input tokens (approximate)
    // This is a rough estimation - in a real implementation, you would use a proper tokenizer
    const inputContent = messagesWithContext.map(msg => msg.content || '').join(' ');
    const estimatedInputTokens = Math.ceil(inputContent.length / 4); // Rough estimation: 1 token ~ 4 characters
    
    // Define safety buffer (10% of context window or 1000 tokens, whichever is larger)
    const safetyBuffer = Math.max(Math.floor(contextWindow * 0.1), 1000);
    
    // Calculate max_tokens based on available space
    const availableTokens = contextWindow - estimatedInputTokens - safetyBuffer;
    const calculatedMaxTokens = Math.max(100, Math.min(availableTokens, contextWindow - estimatedInputTokens)); // Ensure at least 100 tokens, max is remaining space
    
    // Use the requested max_tokens if provided and within limits, otherwise use calculated value
    const finalMaxTokens = requestedMaxTokens 
      ? Math.min(requestedMaxTokens, calculatedMaxTokens) 
      : calculatedMaxTokens;
      
    // Log for debugging
    console.log('Mistral API Request:', {
      model,
      contextWindow,
      estimatedInputTokens,
      safetyBuffer,
      calculatedMaxTokens,
      finalMaxTokens,
      requestedMaxTokens
    });

    // Call Mistral API
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: messagesWithContext,
        max_tokens: finalMaxTokens,
        temperature: temperature || 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Mistral API error:", data);
      return res.status(response.status).json({
        error: data.error?.message || "Mistral API error"
      });
    }

    // Return standardized response
    res.json({
      choices: data.choices,
      usage: data.usage,
      model: data.model
    });

  } catch (error) {
    console.error("Error calling Mistral API:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

module.exports = router;
