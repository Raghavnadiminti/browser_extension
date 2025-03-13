
document.body.style.display = 'none';  
  


const pageContent = document.documentElement.outerHTML; 

console.log(pageContent)

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
    
   
    if (toxicityScore >= 0.8) {
      console.log("Warning: This content may be toxic!");
      prompt("content is not safe not allowed") 

    } else {
      console.log("Content is safe.");
       alert("content is safe")
      document.body.style.display = 'block';
      document.body.style.display = 'none';  
    }

    return data;
  } catch (error) {
    console.error('Error analyzing content for toxicity:', error);
  }
}

analyzeToxicity(pageCleanedText)


