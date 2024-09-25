let zalgoIntensity = 0; // Start with no Zalgo effect
let maxZalgoIntensity = 0.5; // Cap the intensity to something reasonable
let zalgoStep = 0.01; // Small step for each comment added

// Function to gradually increase the effects
function increaseEffects() {
  if (zalgoIntensity < maxZalgoIntensity) {
    zalgoIntensity += zalgoStep; // Gradually increase Zalgo effect
  }
}

// Zalgo function with intensity control
function zalgo(text, intensity) {
  const zalgoChars = ['̷', '̵', '̶', '̷', '͜', '͢', '͞', '͟', '͠', '͡'];
  return text.split('').map((char) => {
    if (Math.random() < intensity) {
      // Add Zalgo characters based on intensity
      return char + zalgoChars[Math.floor(Math.random() * zalgoChars.length)];
    }
    return char; // Return the normal character
  }).join('');
}

// Function to add a comment to the feed
function addComment() {
  increaseEffects(); // Gradually apply effects

  let newComment;
  if (markovEffect) {
    // Use Markov chain to generate new comment
    const randomIndex = Math.floor(Math.random() * comments.length);
    const randomStartWord = comments[randomIndex].split(' ')[0]; // Pick first word of a random comment
    newComment = markov.generate(randomStartWord, 20); // Generate new comment
  } else {
    // Select a random comment from the CSV
    const randomIndex = Math.floor(Math.random() * comments.length);
    newComment = comments[randomIndex].trim(); // Trim to remove extra spaces
  }

  // Apply Zalgo effect if applicable
  let zalgifiedComment = zalgoIntensity > 0 ? zalgo(newComment, zalgoIntensity) : newComment;

  const commentElement = document.createElement('div');
  commentElement.className = 'comment';

  // Add comment text
  const commentText = document.createElement('p');
  commentText.textContent = zalgifiedComment;
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

// YouTube API part
let player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    videoId: getRandomVideoID(),
    playerVars: {
      autoplay: 1,
      controls: 0,
      mute: 1,
      loop: 1,
      playlist: getRandomVideoID()
    },
    events: {
      onReady: onPlayerReady
    }
  });
}

function onPlayerReady(event) {
  event.target.mute();
  startAtRandomTime();
  changeVideo();
}

function getRandomVideoID() {
  const videoIDs = 
  [
  'yb6vArLA9cA',
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
  'VcfIsVNp4js',
];
  return videoIDs[Math.floor(Math.random() * videoIDs.length)];
}

function startAtRandomTime() {
  const videoDuration = player.getDuration();
  const bufferZone = 40; // Increase buffer zone from the end (in seconds)
  const maxStartTime = videoDuration - bufferZone;
  const randomStartTime = Math.floor(Math.random() * maxStartTime);
  player.seekTo(randomStartTime, true);
}


function changeVideo() {
  setInterval(() => {
    const randomVideoID = getRandomVideoID();
    const videoDuration = player.getDuration();
    const maxStartTime = videoDuration - 20;
    const randomStartTime = Math.floor(Math.random() * maxStartTime);
    player.loadVideoById({ videoId: randomVideoID, startSeconds: randomStartTime });
  }, Math.random() * (15000 - 5000) + 5000);
}
