// Example comments list
const comments = [
  "I can't believe this is what we've come to.",
  "Another day, another pointless scroll.",
  "Has anyone else noticed the algorithm is broken?",
  "Life used to be simple. Now it's just endless noise.",
  "Does anyone even care anymore?",
  "The signal has faded, but we're still here.",
  "Echoes of better times... lost in the noise.",
  "This place feels like a dream, but a fading one.",
  "Where did everyone go? It's like a ghost town.",
  "Endless scrolling, and yet, nothing to find."
];

const feed = document.getElementById('feed');
let commentIndex = 0;
const maxComments = 10; // Maximum number of comments before deleting old ones

// Example comments list remains the same

function addComment() {
  if (commentIndex >= comments.length) {
    commentIndex = 0; // Reset the index if we've shown all comments
  }

  const commentElement = document.createElement('div');
  commentElement.className = 'comment';

  // Add comment text
  const commentText = document.createElement('p');
  commentText.textContent = comments[commentIndex];
  commentElement.appendChild(commentText);

  // Add upvotes with thumbs up icon
  const upvotes = document.createElement('span');
  upvotes.className = 'upvotes';
  upvotes.innerHTML = `<i class="fas fa-thumbs-up"></i> ${Math.floor(Math.random() * 1000)}`;
  commentElement.appendChild(upvotes);

  // Add random comments count with speech bubble icon
  const commentsBubble = document.createElement('span');
  commentsBubble.className = 'commentsBubble';
  commentsBubble.innerHTML = `<i class="fas fa-comment"></i> ${Math.floor(Math.random() * 200)}`; // Random comments count
  commentElement.appendChild(commentsBubble);

  // Add the comment to the feed
  feed.appendChild(commentElement);

  // Scroll to the bottom of the feed
  feed.scrollTop = feed.scrollHeight;

  // Check if there are too many comments
  if (feed.children.length > maxComments) {
    // Fade out the oldest comment before removing it
    const oldestComment = feed.children[0];
    oldestComment.classList.add('fadeOut');
    setTimeout(() => {
      oldestComment.remove();
    }, 1000); // Wait for the fade-out animation to complete
  }

  commentIndex++;
}


// Add a new comment every 3 seconds
setInterval(addComment, 3000);


document.getElementById('bg-music').volume = 0.5; // Adjust volume (0.0 to 1.0)
audioElement.play();
