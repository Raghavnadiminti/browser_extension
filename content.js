document.body.style.display = 'none';  

const pageContent = document.documentElement.outerHTML; 
console.log(pageContent);

function extractCleanTextFromHTML() {
    let tempElement = document.createElement("div");
    tempElement.innerHTML = document.documentElement.outerHTML;

    let scriptTags = tempElement.getElementsByTagName("script");
    let styleTags = tempElement.getElementsByTagName("style");

    while (scriptTags.length > 0) {
        scriptTags[0].remove();
    }
    while (styleTags.length > 0) {
      
        styleTags[0].remove();
    }

    let cleanedText = tempElement.textContent || tempElement.innerText || "";
    return cleanedText.trim(); 
}

let pageCleanedText = extractCleanTextFromHTML();
console.log("Cleaned Text Content: ", pageCleanedText);

const PERSPECTIVE_API_URL = 'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=AIzaSyD1OWTbfgy6tOlRMVn3mhmwh-MnbzE8H6s';

const MAX_TEXT_BYTES = 20480; 

async function analyzeToxicity(text) {
  const requestBody = {
    comment: { text: text },
    languages: ["en"],
    requestedAttributes: {
      TOXICITY: {},
      SEVERE_TOXICITY: {},
      INSULT: {},
      PROFANITY: {}
    }
  };

  try {
    const response = await fetch(PERSPECTIVE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    console.log('Toxicity Analysis Results:', data);
    const toxicityScore = data.attributeScores.TOXICITY.summaryScore.value;

    if (toxicityScore >= 0.3) {
      console.log("Warning: This content may be toxic!");
      prompt("Content is not safe, not allowed");
      document.body.style.display = 'none';  

      const meta = document.createElement('meta');
      meta.httpEquiv = "Content-Security-Policy";
      meta.content = "script-src 'none'";
      document.getElementsByTagName('head')[0].appendChild(meta);
      alert("JavaScript Disabled.");




    } else {
      console.log("Content is safe.");
      alert("Content is safe");
      document.body.style.display = 'block';
    }

    return data;
  } catch (error) {
    console.error('Error analyzing content for toxicity:', error);
  }
}


function splitTextIntoChunks(text, maxBytes) {
  const encoder = new TextEncoder();
  let textChunks = [];
  let currentChunk = '';
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const newChunk = currentChunk + char;
    const byteSize = encoder.encode(newChunk).length;

    if (byteSize > maxBytes) {
      textChunks.push(currentChunk);
      currentChunk = char; 
    } else {
      currentChunk = newChunk;
    }
  }
  
  if (currentChunk.length > 0) {
    textChunks.push(currentChunk);
  }

  return textChunks;
}


const textChunks = splitTextIntoChunks(pageCleanedText, MAX_TEXT_BYTES);


async function analyzeAllChunks(chunks) {
  for (const chunk of chunks) {
    await analyzeToxicity(chunk);
  }
}


analyzeAllChunks(textChunks);
