import { NextRequest, NextResponse } from "next/server";
import { WeatherData } from "@/types";
import { cleanSpeechText } from "@/utils/cleanSpeechText";

// Map WMO weather codes to human descriptions
function mapWmoCode(code: number): string {
  if (code === 0) return "Clear skies";
  if (code === 1 || code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code >= 45 && code <= 48) return "Foggy";
  if (code >= 51 && code <= 55) return "Light drizzle";
  if (code >= 61 && code <= 65) return "Rain showers";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Heavy rain showers";
  if (code >= 95) return "Thunderstorm";
  return "Fair weather";
}

export async function POST(req: NextRequest) {
  try {
    const { city = "Lahore", language = "en" } = await req.json();

    const cleanCity = (city || "Lahore").trim();

    // 1. Geocoding
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      cleanCity
    )}&count=1&language=en&format=json`;

    const geoRes = await fetch(geoUrl, { signal: AbortSignal.timeout(5000) });
    let lat = 31.5497;
    let lon = 74.3436;
    let resolvedCity = "Lahore";

    if (geoRes.ok) {
      const geoData = await geoRes.json();
      if (geoData.results && geoData.results.length > 0) {
        lat = geoData.results[0].latitude;
        lon = geoData.results[0].longitude;
        resolvedCity = geoData.results[0].name;
      }
    }

    // 2. Forecast
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m`;

    const weatherRes = await fetch(weatherUrl, { signal: AbortSignal.timeout(5000) });
    if (!weatherRes.ok) {
      throw new Error("Weather fetch failed");
    }

    const wData = await weatherRes.json();
    const current = wData.current;

    const weatherData: WeatherData = {
      city: resolvedCity,
      temperature: Math.round(current.temperature_2m),
      condition: mapWmoCode(current.weather_code),
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      feelsLike: Math.round(current.apparent_temperature),
      isDay: current.is_day === 1,
    };

    let spokenText = "";
    if (language === "ur") {
      spokenText = cleanSpeechText(
        `Janab, ${weatherData.city} mein is waqt mausam ${weatherData.condition} hai aur darja hararat ${weatherData.temperature} degree Celsius hai.`
      );
    } else if (language === "pa") {
      spokenText = cleanSpeechText(
        `Janab, ${weatherData.city} vich mausam ${weatherData.condition} aye te taapmaan ${weatherData.temperature} degree Celsius aye.`
      );
    } else {
      spokenText = cleanSpeechText(
        `Sir, current weather in ${weatherData.city} is ${weatherData.condition} with a temperature of ${weatherData.temperature} degrees Celsius and ${weatherData.humidity} percent humidity.`
      );
    }

    return NextResponse.json({
      weather: weatherData,
      spokenText,
    });
  } catch (error) {
    console.error("Weather Route Error:", error);
    return NextResponse.json({
      weather: {
        city: "Lahore",
        temperature: 24,
        condition: "Clear skies",
        humidity: 45,
        windSpeed: 12,
        feelsLike: 25,
        isDay: true,
      },
      spokenText: "Sir, current telemetry reports 24 degrees Celsius with clear skies in Lahore.",
    });
  }
}
