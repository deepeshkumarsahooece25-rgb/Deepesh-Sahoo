import { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Sparkles, Image as ImageIcon, Video, Play, ArrowLeft } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Link } from "react-router-dom";

export default function MagicLullaby() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState("");
  const [type, setType] = useState<"image" | "video">("image");
  const [error, setError] = useState("");

  const generateMedia = async () => {
    if (!prompt) return;
    setLoading(true);
    setError("");
    setResultUrl("");

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      if (type === "image") {
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-image-preview',
          contents: {
            parts: [{ text: prompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: "16:9",
              imageSize: "1K"
            }
          }
        });
        
        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            setResultUrl(`data:image/png;base64,${part.inlineData.data}`);
            break;
          }
        }
      } else {
        // Video Generation
        let operation = await ai.models.generateVideos({
          model: 'veo-3.1-fast-generate-preview',
          prompt: prompt,
          config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: '16:9'
          }
        });

        while (!operation.done) {
          await new Promise(resolve => setTimeout(resolve, 10000));
          operation = await ai.operations.getVideosOperation({ operation });
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (downloadLink) {
          const response = await fetch(downloadLink, {
            method: 'GET',
            headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY || "" },
          });
          const blob = await response.blob();
          setResultUrl(URL.createObjectURL(blob));
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to generate media. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/" className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Magic Lullaby</h2>
          <p className="text-slate-500 text-sm">Create custom soothing visuals for your baby using AI.</p>
        </div>
      </div>

      <Card className="shadow-sm border-slate-100">
        <CardContent className="p-4 space-y-4">
          <div className="flex gap-2 bg-slate-50 p-1 rounded-xl">
            <button
              onClick={() => setType("image")}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2",
                type === "image" ? "bg-white text-pink-600 shadow-sm" : "text-slate-500"
              )}
            >
              <ImageIcon className="w-4 h-4" /> Image
            </button>
            <button
              onClick={() => setType("video")}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2",
                type === "video" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"
              )}
            >
              <Video className="w-4 h-4" /> Video
            </button>
          </div>

          <div className="space-y-2">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A soft glowing moon over a calm ocean..."
              className="rounded-xl bg-slate-50 border-slate-200"
            />
            <Button 
              onClick={generateMedia} 
              disabled={loading || !prompt}
              className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating {type}...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Generate
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      {resultUrl && (
        <Card className="shadow-sm border-slate-100 overflow-hidden bg-slate-900">
          <div className="aspect-video bg-black flex items-center justify-center relative">
            {type === "image" ? (
              <img src={resultUrl} alt="Generated Lullaby" className="w-full h-full object-cover" />
            ) : (
              <video src={resultUrl} controls autoPlay loop className="w-full h-full object-cover" />
            )}
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-yellow-300" /> AI Generated
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
