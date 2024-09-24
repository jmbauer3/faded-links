// Load comments from CSV file
async function loadComments() {
  const response = await fetch('comments.csv');
  const text = await response.text();

  // Split comments into an array
  const commentsArray = text.split('\n').map(line => line.replace(/"/g, '').trim()).filter(line => line);

  return commentsArray;
}

// Get a random upvote count
function getRandomUpvotes() {
  return Math.floor(Math.random() * 1000);
}

// Randomly fluctuate the upvotes
function fluctuateUpvotes(element) {
  setInterval(() => {
    const currentUpvotes = parseInt(element.textContent);
    const randomFluctuation = Math.floor(Math.random() * 10) - 5; // Random +/- fluctuation
    element.textContent = currentUpvotes + randomFluctuation;
  }, 2000); // Change every 2 seconds
}

// Add comments to the feed
async function populateFeed() {
  const feed = document.getElementById('feed');
  const comments = await loadComments();

  comments.forEach(comment => {
    const commentElement = document.createElement('div');
    commentElement.className = 'comment';

    const commentText = document.createElement('p');
    commentText.textContent = comment;

    const upvotes = document.createElement('span');
    upvotes.className = 'upvotes';
    upvotes.textContent = getRandomUpvotes();

    fluctuateUpvotes(upvotes); // Fluctuate the upvotes over time

    commentElement.appendChild(commentText);
    commentElement.appendChild(upvotes);
    feed.appendChild(commentElement);
  });
}

// Run the function to populate the feed
populateFeed();
