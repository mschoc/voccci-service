export const getVoccciFromImage = async (imageBuffer: Buffer): Promise<any> => {
  try {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
          throw new Error("OPENAI_API_KEY is missing in environment variables!");
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [
                  {
                      role: "system",
                      content: "You are an AI that extracts word pairs from images."
                  },
                  {
                      role: "user",
                      content: [
                          { type: "text", text: "Extract vocabulary word pairs from this image. 'baseWord' MUST be the German word, and 'translatedWord' MUST be the Italian word. Always return JSON like this: [{ \"baseWord\": \"German word\", \"translatedWord\": \"Italian word\" }]. NO explanations, NO markdown, ONLY JSON." },
                          { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBuffer.toString("base64")}` } }
                      ]
                  }
              ],
              max_tokens: 2000
          })
      });

      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`OpenAI API error: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content || "";
      const cleanContent = content.replace(/```json\n?/, "").replace(/```$/, "").trim();
      const jsonData = JSON.parse(cleanContent);

      return jsonData;
  } catch (error) {
      console.error("Error processing image with OpenAI:", error);
      throw new Error("Failed to extract vocabulary from image.");
  }
};
