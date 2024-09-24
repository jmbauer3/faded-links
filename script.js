let comments = []; // Empty array to store comments from the CSV
let commentIndex = 0;
const maxComments = 10; // Maximum number of comments before deleting old ones

// Fetch comments from the CSV file
fetch('comments.csv')
  .then(response => response.text())
  .then(data => {
    comments = data.split('\n'); // Split CSV data by newlines
    startCommentFeed(); // Start showing comments once the CSV is loaded
  })
  .catch(error => console.error('Error loading comments:', error));

// Function to start adding comments after CSV is loaded
function startCommentFeed() {
  setInterval(addComment, 3000); // Add a new comment every 3 seconds
}

// Function to add a comment to the feed
function addComment() {
  if (commentIndex >= comments.length) {
    commentIndex = 0; // Reset the index if we've shown all comments
  }

  const commentElement = document.createElement('div');
  commentElement.className = 'comment';

  // Add comment text
  const commentText = document.createElement('p');
  commentText.textContent = comments[commentIndex].trim(); // Trim to remove extra spaces
  commentElement.appendChild(commentText);

  // Add upvotes with thumbs up icon
  const upvotes = document.createElement('span');
  upvotes.className = 'upvotes';
  upvotes.innerHTML = `<i class="fas fa-thumbs-up"></i> ${Math.floor(Math.random() * 10)}`; // 0-9 upvotes
  commentElement.appendChild(upvotes);

  // Add random comments count with speech bubble icon
  const commentsBubble = document.createElement('span');
  commentsBubble.className = 'commentsBubble';
  commentsBubble.innerHTML = `<i class="fas fa-comment"></i> ${Math.floor(Math.random() * 5)}`; // 0-4 comments
  commentElement.appendChild(commentsBubble);

  // Add the comment to the feed
  const feed = document.getElementById('feed');
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

// Ensure the music starts at half volume
document.querySelector('audio').volume = 0.5;


// List of random YouTube video IDs
const videoIDs = [
  'dQw4w9WgXcQ', // Replace with your own video IDs
  '3JZ_D3ELwOQ',
  'e-ORhEE9VVg',
  'tVj0ZTS4WF4'
];

// Function to load a YouTube video
let player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    videoId: getRandomVideoID(),
    playerVars: {
      'autoplay': 1,
      'controls': 0,
      'mute': 1,
      'loop': 1,
      'playlist': getRandomVideoID() // Needed to keep looping the video
    },
    events: {
      'onReady': onPlayerReady
    }
  });
}

// When the player is ready
function onPlayerReady(event) {
  event.target.mute(); // Ensure it's muted
  changeVideo(); // Start changing videos randomly
}

// Function to get a random video ID from the list
function getRandomVideoID() {
  return videoIDs[Math.floor(Math.random() * videoIDs.length)];
}

// Function to change the video every 5-15 seconds
function changeVideo() {
  setInterval(() => {
    const randomVideoID = getRandomVideoID();
    player.loadVideoById(randomVideoID);
  }, Math.random() * (15000 - 5000) + 5000); // Random interval between 5-15 seconds
}