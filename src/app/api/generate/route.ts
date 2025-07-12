import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { prompt, language } = await request.json();

    // Input validation
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Construct prompt with language context
    const fullPrompt = `Generate code in ${language}. Here's what I want to do:\n${prompt}\nProvide only the code without any explanations.`;

    // Get Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Generate code
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const generatedCode = response.text();

    return NextResponse.json({ code: generatedCode });
  } catch (error) {
    console.error('Code generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate code' },
      { status: 500 }
    );
  }
}