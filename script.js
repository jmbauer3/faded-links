let comments = []; // Empty array to store comments from the CSV
const maxComments = 10; // Maximum number of comments before deleting old ones
let zalgoIntensity = 0; // Start with no Zalgo effect
let markovEffect = false; // Start without using the Markov chain
let commentCount = 0; // Count the number of comments added

// Fetch comments from the CSV file
fetch('comments.csv')
  .then(response => response.text())
  .then(data => {
    comments = data.split('\n'); // Split CSV data by newlines
    createMarkovChain(); // Build the Markov chain once the comments are loaded
    startCommentFeed(); // Start showing comments once the CSV is loaded
  })
  .catch(error => console.error('Error loading comments:', error));

// Function to start adding comments after CSV is loaded
function startCommentFeed() {
  setInterval(addComment, 3000); // Add a new comment every 3 seconds
}

// Zalgo text function
let zalgoIntensity = 0.05; // Start with a very low intensity (5%)
let zalgoIncreaseRate = 0.01; // Increase intensity gradually over time

function zalgo(text, intensity = 1) {
  const zalgoChars = {
    up: ['̍', '̎', '̄', '̅', '̿', '̑', '̆', '̐', '͒', '͗', '͑', '̇', '̈', '̊', '͂', '̓', '̈́', '͊', '͋', '͌', '̃', '̂', '̌', '͐', '̀', '́', '̋', '̏', '̽', '̾', '͛', '͆', '̚'],
    down: ['̖', '̗', '̘', '̙', '̜', '̝', '̞', '̟', '̠', '̤', '̥', '̦', '̩', '̪', '̫', '̬', '̭', '̮', '̯', '̰', '̱', '̲', '̳', '̹', '̺', '̻', '̼', 'ͅ', '͇', '͈', '͉', '͍', '͎', '͓', '͔', '͕', '͖', '͙', '͚', '̣'],
    mid: ['̕', '̛', '̀', '́', '͘', '̡', '̢', '̧', '̨', '̴', '̵', '̶', '͜', '͝', '͞', '͟', '͠', '͢', '̸', '̷', '͡', '҉']
  };
  
  return text.split('').map(char => {
    if (Math.random() < intensity) {
      let zalgified = char;
      if (Math.random() < 0.3) zalgified += zalgoChars.up[Math.floor(Math.random() * zalgoChars.up.length)];
      if (Math.random() < 0.3) zalgified += zalgoChars.down[Math.floor(Math.random() * zalgoChars.down.length)];
      if (Math.random() < 0.2) zalgified += zalgoChars.mid[Math.floor(Math.random() * zalgoChars.mid.length)];
      return zalgified;
    }
    return char;
  }).join('');
}

// Markov Chain for generating new comments
class MarkovChain {
  constructor(data) {
    this.data = data;
    this.chain = {};
    this.buildChain();
  }

  buildChain() {
    for (let i = 0; i < this.data.length; i++) {
      let words = this.data[i].split(' '); // Each comment from the CSV
      for (let j = 0; j < words.length - 1; j++) {
        let word = words[j];
        let nextWord = words[j + 1];
        if (!this.chain[word]) {
          this.chain[word] = [];
        }
        this.chain[word].push(nextWord);
      }
    }
  }

  generate(startWord, length = 20) {
    let result = [startWord];
    let currentWord = startWord;
    for (let i = 0; i < length - 1; i++) {
      let nextWords = this.chain[currentWord];
      if (!nextWords || nextWords.length === 0) {
        break;
      }
      currentWord = nextWords[Math.floor(Math.random() * nextWords.length)];
      result.push(currentWord);
    }
    return result.join(' ');
  }
}

// Create the Markov chain instance once comments are loaded
let markov;
function createMarkovChain() {
  markov = new MarkovChain(comments);
}

// Function to gradually increase the effects
function increaseEffects() {
  commentCount++;
  if (commentCount > 5) {
    zalgoIntensity = Math.min(1, zalgoIntensity + 0.1); // Gradually increase Zalgo intensity
  }
  if (commentCount > 10) {
    markovEffect = true; // Start using Markov chain after 10 comments
  }
}

// Function to add a comment to the feed
function addComment() {
  increaseEffects(); // Gradually apply effects

  // Gradually increase Zalgo intensity
  zalgoIntensity = Math.min(zalgoIntensity + zalgoIncreaseRate, 1); // Cap intensity at 1


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

// Existing code to create comments
  let newComment = markov.generate(randomStartWord, 20);
  let zalgifiedComment = zalgo(newComment, zalgoIntensity); // Zalgo with gradually increasing intensity
  

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
