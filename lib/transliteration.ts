
export type TypingLanguage = "en" | "hi" | "mr";

export const getTransliterationSuggestions = async (
  text: string,
  language: TypingLanguage
): Promise<string[]> => {
  if (language === "en" || !text.trim()) {
    return [];
  }

  const languageCode =
    language === "hi" ? "hi-t-i0-und" : "mr-t-i0-und";

  const params = new URLSearchParams({
    itc: languageCode,
    num: "5",
    cp: "0",
    cs: "1",
    ie: "utf-8",
    oe: "utf-8",
    app: "demopage",
    text,
  });

  try {
    const response = await fetch(
      `https://inputtools.google.com/request?${params}`
    );

    if (!response.ok) return [];

    const result = await response.json();

    if (result[0] !== "SUCCESS") return [];

    return result[1]?.[0]?.[1] ?? [];
  } catch {
    return [];
  }
};
