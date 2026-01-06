import { GoogleGenAI } from "@google/genai";
import { Ticket } from "../types";

// Note: In a real production environment, this key should be proxied via backend.
// For this demo, we assume it's available in the environment or user input context.
// Safely check for process to prevent "ReferenceError: process is not defined" in browser.
const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) || ''; 

export const generateExecutiveSummary = async (tickets: Ticket[]): Promise<string> => {
  if (!apiKey) {
    return "API Key not configured. Please ensure process.env.API_KEY is set.";
  }

  const ai = new GoogleGenAI({ apiKey });

  // Prepare data for the model
  const ticketSummary = tickets.map(t => 
    `- [${t.status}] ${t.priority === 'HIGH' ? '(PRIORITY!)' : ''} ${t.company}: ${t.issue} (${t.type}) by ${t.pic} on ${t.date}`
  ).join('\n');

  const prompt = `
    Role: Bertindaklah sebagai IT Supervisor profesional.
    Konteks: Laporan untuk Pimpinan Perusahaan grup (4 perusahaan).
    Data Tiket:
    ${ticketSummary}

    Tugas:
    Buatlah ringkasan eksekutif singkat (maksimal 2 paragraf) dalam Bahasa Indonesia yang formal dan sopan.
    1. Soroti kendala prioritas tinggi yang belum selesai.
    2. Berikan apresiasi singkat untuk pekerjaan yang sudah selesai.
    3. Berikan statistik singkat (Selesai vs Pending).
    
    Jangan gunakan format markdown yang rumit, cukup paragraf teks biasa.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Gagal menghasilkan ringkasan.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Maaf, terjadi kesalahan saat menghubungi asisten AI untuk membuat ringkasan.";
  }
};