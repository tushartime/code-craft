'use client';

import { useCodeEditorStore } from '@/store/useCodeEditorStore';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function AICodeGenButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { language, editor } = useCodeEditorStore();

  const handleGenerate = async () => {
    if (!prompt) return;
    
    try {
      setIsLoading(true);
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, language }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      if (editor && data.code) {
        editor.setValue(data.code);
        setIsOpen(false);
        setPrompt('');
      }
    } catch (error) {
      console.error('Failed to generate code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-[#313244] hover:text-purple-400 transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <Sparkles className="w-5 h-5" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-[#1e1e2e] border-[#313244] text-white">
          <DialogHeader>
            <DialogTitle>Generate Code with AI</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Describe what you want to create..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="bg-[#313244] border-[#45475a] text-white"
            />
            <Button
              onClick={handleGenerate}
              disabled={!prompt || isLoading}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white"
            >
              {isLoading ? 'Generating...' : 'Generate Code'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}