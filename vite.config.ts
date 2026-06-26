import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    // Prioritize actual process.env keys first to prevent placeholders in local files from overriding them
    const keysToTry = [
      process.env.API_KEY,
      process.env.VITE_API_KEY,
      process.env.GEMINI_API_KEY,
      process.env.VITE_GEMINI_API_KEY,
      env.API_KEY,
      env.VITE_API_KEY,
      env.GEMINI_API_KEY,
      env.VITE_GEMINI_API_KEY
    ];
    
    let geminiKey = '';
    for (const key of keysToTry) {
      if (key) {
        const cleaned = key.trim().replace(/^["']|["']$/g, '');
        if (
          cleaned && 
          cleaned !== 'PLACEHOLDER_API_KEY' && 
          cleaned !== 'your_gemini_api_key_here' && 
          cleaned !== 'your_api_key_here' &&
          !cleaned.toLowerCase().includes('placeholder')
        ) {
          geminiKey = cleaned;
          break;
        }
      }
    }

    // Fallback to whatever is available if no valid key was found
    if (!geminiKey) {
      const rawFallback = 
        env.API_KEY || 
        env.VITE_API_KEY || 
        env.GEMINI_API_KEY || 
        env.VITE_GEMINI_API_KEY || 
        process.env.API_KEY || 
        process.env.VITE_API_KEY || 
        process.env.GEMINI_API_KEY || 
        process.env.VITE_GEMINI_API_KEY || 
        '';
      geminiKey = rawFallback.trim().replace(/^["']|["']$/g, '');
    }
    
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(geminiKey),
        'process.env.GEMINI_API_KEY': JSON.stringify(geminiKey),
        'process.env.VITE_GEMINI_API_KEY': JSON.stringify(geminiKey),
        'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(geminiKey),
        'import.meta.env.VITE_API_KEY': JSON.stringify(geminiKey)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
