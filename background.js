chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "save-note",
    title: "Drop it!",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "save-note") {
    const selectedText = info.selectionText || "";
    const pageTitle = tab?.title || "Web Page";
    const pageUrl = tab?.url || "";

    handleBackgroundCapture(selectedText, pageTitle, pageUrl);
  }
});

async function handleBackgroundCapture(selectedText, pageTitle, pageUrl) {
  // Retrieve settings
  chrome.storage.local.get(["geminiApiKey", "geminiModel", "notes"], async (res) => {
    const apiKey = res.geminiApiKey;
    const model = res.geminiModel || "gemini-2.5-flash";
    const currentNotes = res.notes || [];

    let tags = [];
    let errorOccurred = false;
    let errorMessage = "";

    if (apiKey && apiKey.trim().length > 0) {
      try {
        tags = await requestAiTags(selectedText, apiKey, model);
      } catch (err) {
        errorOccurred = true;
        errorMessage = err.message;
        tags = ["Uncategorized"];
      }
    } else {
      tags = ["Uncategorized"];
    }

    // Create the note
    const newNote = {
      id: Date.now(),
      note: selectedText,
      source: pageTitle,
      sourceUrl: pageUrl,
      tags: tags,
      createdAt: new Date().toISOString()
    };

    const updatedNotes = [newNote, ...currentNotes];

    chrome.storage.local.set({ notes: updatedNotes }, () => {
      // Notify the user of the result
      if (errorOccurred) {
        showNotification(
          "DropIt | AI Tagging Failed",
          `Saved to Uncategorized. (AI Error: ${errorMessage})`
        );
      } else if (!apiKey) {
        showNotification(
          "DropIt | Note Saved",
          "Saved to Uncategorized. Configure your Gemini API key in settings for auto-tagging."
        );
      } else {
        showNotification(
          "DropIt | Note Saved & Tagged",
          `Saved with tags: ${tags.join(", ")}`
        );
      }

      // Briefly update the badge
      chrome.action.setBadgeText({ text: "+" + tags.length });
      chrome.action.setBadgeBackgroundColor({ color: "#8b5cf6" });
      setTimeout(() => {
        chrome.action.setBadgeText({ text: "" });
      }, 3000);
    });
  });
}

async function requestAiTags(text, apiKey, model) {
  const promptText = `Analyze the following text captured by a user.
Generate 1 to 3 relevant tags (topics, categories, or keywords) for this text.
The tags should be simple and concise (1-2 words each) and in the same language as the text (English or Persian/Farsi).
Respond ONLY with a valid JSON array of strings containing the tags, e.g. ["tag1", "tag2"]. Do not include markdown code block formatting, backticks, or any other text outside the JSON array.

Text:
${text}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: promptText
        }]
      }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    throw new Error(`API ${response.status}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error("Empty response");
  }

  // Parse tags safely
  let tags = [];
  const cleanedText = rawText.trim();
  try {
    tags = JSON.parse(cleanedText);
  } catch (e) {
    // Attempt regex match for JSON array in case model returned markdown wrapping
    const match = cleanedText.match(/\[\s*".*?"\s*(?:,\s*".*?"\s*)*\]/s);
    if (match) {
      try {
        tags = JSON.parse(match[0]);
      } catch (innerErr) {
        // Fallback
      }
    }
  }

  // Fallback if not an array
  if (!Array.isArray(tags)) {
    tags = cleanedText.replace(/[\[\]"]/g, '').split(',').map(t => t.trim()).filter(Boolean);
  }

  // Clean tags
  tags = tags
    .map(t => typeof t === 'string' ? t.trim() : "")
    .filter(t => t.length > 0 && t.length < 30);

  return tags.length > 0 ? tags : ["Uncategorized"];
}

function showNotification(title, message) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "public/favicon.svg",
    title: title,
    message: message,
    priority: 1
  });
}