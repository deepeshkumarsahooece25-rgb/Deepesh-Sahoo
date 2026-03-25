import { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { MapPin, Search, Navigation } from "lucide-react";

export default function DoctorLocator() {
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState("");

  const searchDoctors = async () => {
    if (!location) return;
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Find pediatricians or children's hospitals near ${location}.`,
        config: {
          tools: [{ googleMaps: {} }],
        },
      });

      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        const places = chunks
          .filter(chunk => chunk.maps?.uri)
          .map(chunk => ({
            title: chunk.maps.title || "Medical Center",
            uri: chunk.maps.uri,
          }));
        setResults(places);
      } else {
        setError("No nearby doctors found. Try a different location.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to search. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Nearby Doctors</h2>
      
      <Card className="shadow-sm border-slate-100">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter city or zip code"
                className="pl-10 rounded-xl bg-slate-50 border-slate-200"
                onKeyDown={(e) => e.key === "Enter" && searchDoctors()}
              />
            </div>
            <Button onClick={searchDoctors} disabled={loading} className="rounded-xl bg-blue-500 hover:bg-blue-600 text-white">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Search className="w-5 h-5" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <div className="space-y-4">
        {results.map((place, index) => (
          <Card key={index} className="shadow-sm border-slate-100 hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 line-clamp-1">{place.title}</h3>
                  <p className="text-sm text-slate-500">Pediatric Care</p>
                </div>
              </div>
              <Button asChild variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-full">
                <a href={place.uri} target="_blank" rel="noopener noreferrer">
                  <Navigation className="w-5 h-5" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
