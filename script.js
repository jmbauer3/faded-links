// Your OpenAI API Key
const apiKey = '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';

// Fetch GPT-generated comments
async function getAIComment() {
  try {
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'text-davinci-003', // You can use 'gpt-4' or another model, depending on your plan
        prompt: "Generate a social media comment about disillusionment with technology.",
        max_tokens: 50,
        temperature: 0.7 // Adjust this value to control randomness
      })
    });

    const data = await response.json();
    
    // Return the generated text from ChatGPT
    return data.choices[0].text.trim();
  } catch (error) {
    console.error("Error fetching AI comment:", error);
    return "Something went wrong... even for an AI!";
  }
}

// Simulate random upvotes
function getRandomUpvotes() {
  return Math.floor(Math.random() * 1000);
}

// Add AI comment to feed
async function addAICommentToFeed() {
  const feed = document.getElementById('feed');
  
  // Fetch AI comment
  const commentText = await getAIComment();
  
  const commentElement = document.createElement('div');
  commentElement.className = 'comment';
  
  const commentTextElement = document.createElement('p');
  commentTextElement.textContent = commentText;
  
  const upvotesElement = document.createElement('span');
  upvotesElement.className = 'upvotes';
  upvotesElement.textContent = `${getRandomUpvotes()} upvotes`;
  
  commentElement.appendChild(commentTextElement);
  commentElement.appendChild(upvotesElement);
  
  feed.appendChild(commentElement);
}

// Load more AI-generated posts when button is clicked
document.getElementById('loadMore').addEventListener('click', () => {
  addAICommentToFeed();
});
