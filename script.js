// Variables
let comments = [];
const maxComments = 10;
let zalgoIntensity = 0; // Start with no Zalgo effect
let markovEffect = false;
let commentCount = 0;
let zalgoIncreaseRate = 0.01; // Gradual increase rate

// Fetch comments from the CSV file
fetch('comments.csv')
  .then(response => response.text())
  .then(data => {
    comments = data.split('\n');
    createMarkovChain(); // Create Markov chain after comments are loaded
    startCommentFeed(); // Start the feed once CSV is loaded
  })
  .catch(error => console.error('Error loading comments:', error));

// Function to start adding comments to the feed
function startCommentFeed() {
  setInterval(addComment, 3000); // Add a comment every 3 seconds
}

// Zalgo text function
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
      let words = this.data[i].split(' ');
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

// Create the Markov chain instance
let markov;
function createMarkovChain() {
  markov = new MarkovChain(comments);
}

// Function to gradually increase effects
function increaseEffects() {
  commentCount++;
  if (commentCount > 5) {
    zalgoIntensity = Math.min(1, zalgoIntensity + 0.01);
  }
  if (commentCount > 10) {
    markovEffect = true;
  }
}

// Function to add a comment to the feed
function addComment() {
  increaseEffects();

  let newComment;
  if (markovEffect) {
    const randomIndex = Math.floor(Math.random() * comments.length);
    const randomStartWord = comments[randomIndex].split(' ')[0];
    newComment = markov.generate(randomStartWord, 20);
  } else {
    const randomIndex = Math.floor(Math.random() * comments.length);
    newComment = comments[randomIndex].trim();
  }

  let zalgifiedComment = zalgo(newComment, zalgoIntensity);

  const commentElement = document.createElement('div');
  commentElement.className = 'comment';

  const commentText = document.createElement('p');
  commentText.textContent = zalgifiedComment;
  commentElement.appendChild(commentText);

  const upvotes = document.createElement('span');
  upvotes.className = 'upvotes';
  upvotes.innerHTML = `<i class="fas fa-thumbs-up"></i> ${Math.floor(Math.random() * 8)}`;
  commentElement.appendChild(upvotes);

  const commentsBubble = document.createElement('span');
  commentsBubble.className = 'commentsBubble';
  commentsBubble.innerHTML = `<i class="fas fa-comment"></i> ${Math.floor(Math.random() * 4)}`;
  commentElement.appendChild(commentsBubble);

  const feed = document.getElementById('feed');
  feed.appendChild(commentElement);

  feed.scrollTop = feed.scrollHeight;

  if (feed.children.length > maxComments) {
    const oldestComment = feed.children[0];
    oldestComment.classList.add('fadeOut');
    setTimeout(() => {
      oldestComment.remove();
    }, 1000);
  }
}

// YouTube API Section
let player;
let isVideoLoaded = false;

function onYouTubeIframeAPIReady() {
  loadRandomVideo();
}

function loadRandomVideo() {
  const randomVideoID = getRandomVideoID();
  player = new YT.Player('player', {
    videoId: randomVideoID,
    playerVars: {
      autoplay: 1,
      controls: 0,
      mute: 1,
      loop: 1,
      playlist: randomVideoID
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  event.target.mute();
  isVideoLoaded = true;
  startAtRandomTime(event.target);
}

function onPlayerStateChange(event) {
  // Check if the video ended, and load a new one
  if (event.data === YT.PlayerState.ENDED) {
    loadRandomVideo();
  }
}

function getRandomVideoID() {
  const videoIDs = [
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
  'u-WTfP3WJc4',
  '4aeETEoNfOg',
  'dKHBVf0z5co',
  'yYTnHjD6GuE',
  'nuncFLIR1Qw',
  'RrzrOyeo5o8',
  '3yk0in7QTHo',
  'KF33eZXLvmU',
  ];
  return videoIDs[Math.floor(Math.random() * videoIDs.length)];
}

function startAtRandomTime(player) {
  const videoDuration = player.getDuration();
  if (videoDuration > 0) {
    const bufferZone = 40; // seconds
    const maxStartTime = videoDuration - bufferZone;
    const randomStartTime = Math.floor(Math.random() * maxStartTime);
    player.seekTo(randomStartTime, true);
  }
}

function changeVideo() {
  setInterval(() => {
    if (isVideoLoaded) {
      loadRandomVideo();
    }
  }, Math.random() * (15000 - 5000) + 5000); // Switch every 5-15 seconds
}

// Start changing videos after the player is ready
setTimeout(changeVideo, 10000); // Delay to ensure player is loaded


// Ensure the music starts at half volume
document.querySelector('audio').volume = 0.5;