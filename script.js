let comments = []; // Empty array to store comments from the CSV
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
  // Select a random comment from the comments array
  const randomIndex = Math.floor(Math.random() * comments.length);
  const selectedComment = comments[randomIndex].trim(); // Trim to remove extra spaces

  const commentElement = document.createElement('div');
  commentElement.className = 'comment';

  // Add comment text
  const commentText = document.createElement('p');
  commentText.textContent = selectedComment;
  commentElement.appendChild(commentText);

  // Add upvotes with thumbs up icon
  const upvotes = document.createElement('span');
  upvotes.className = 'upvotes';
  upvotes.innerHTML = `<i class="fas fa-thumbs-up"></i> ${Math.floor(Math.random() * 8)}`; // 0-7 upvotes
  commentElement.appendChild(upvotes);

  // Add random comments count with speech bubble icon
  const commentsBubble = document.createElement('span');
  commentsBubble.className = 'commentsBubble';
  commentsBubble.innerHTML = `<i class="fas fa-comment"></i> ${Math.floor(Math.random() * 4)}`; // 0-3 comments
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
}


// Ensure the music starts at half volume
document.querySelector('audio').volume = 0.5;


// List of random YouTube video IDs
const videoIDs = [
  'YQRXJVF8lic', // Replace with your own video IDs
  'eD81CsAFmDU',
  'coRWtkRpNhw',
  'f7nPA1oEbqg',
  'OLS9yCmYfNw',
'0r2x7G0hwCw',
'V6SR4lNqjME',
'nD1f1Ian0kA',
'Mks-Y_PF_7o',
'F7SWoZNpSVw',
'2WcIK_8f7oQ',
'8AHCfZTRGiI',
'FDFqzVy2nI0',
'VYOjWnS4cMY',
'kn2f1AVB9W4',
'ft3b1-Cm-0M',
'6qIYgwebhM',
'PENk6NBEyPs',
'qkNa5xzOe5U',
'kF7DW_mZatA',
'93axfl2xlao',
'zfaOf70M4xs',
'CZRH68Ib1Ko',
'N-aK6JnyFmk',
'Vrs0XgnXsxk',
'VwBIVWX8YtQ',
'K4_Qzx-E2LQ',
'HyHNuVaZJ-k',
'LGQCPOMcYJQ',
'e4QGnppJ-ys',
'gxEPV4kolz0',
'm2uTFF_3MaA',
'TbSm6HsX_ek',
'phfjlcGlT3g',
'JM20K--96BE',
'AfkF30yPfK0',

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