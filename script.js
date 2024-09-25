let comments = []; // Empty array to store comments from the CSV
const maxComments = 10; // Maximum number of comments before deleting old ones
let markov;

// Fetch comments from the CSV file
fetch('comments.csv')
  .then(response => response.text())
  .then(data => {
    comments = data.split('\n'); // Split CSV data by newlines
    createMarkovChain(); // Create the Markov Chain when comments are loaded
    startCommentFeed(); // Start showing comments once the CSV is loaded
  })
  .catch(error => console.error('Error loading comments:', error));

// Function to start adding comments after CSV is loaded
function startCommentFeed() {
  setInterval(addComment, 3000); // Add a new comment every 3 seconds
}

// Zalgo text function
function zalgo(text, intensity = 1) {
  const zalgoChars = {
    up: ['̍', '̎', '̄', /*...*/ '̏', '̽', '̾', '͛', '͆', '̚'],
    down: ['̖', '̗', '̘', /*...*/ '͙', '͚', '̣'],
    mid: ['̕', '̛', '̀', /*...*/ '҉']
  };
  return text.split('').map(char => {
    if (Math.random() < intensity) {
      let zalgified = char;
      zalgified += zalgoChars.up[Math.floor(Math.random() * zalgoChars.up.length)];
      zalgified += zalgoChars.down[Math.floor(Math.random() * zalgoChars.down.length)];
      zalgified += zalgoChars.mid[Math.floor(Math.random() * zalgoChars.mid.length)];
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
    for (let comment of this.data) {
      let words = comment.split(' ');
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
      if (!nextWords || nextWords.length === 0) break;
      currentWord = nextWords[Math.floor(Math.random() * nextWords.length)];
      result.push(currentWord);
    }
    return result.join(' ');
  }
}

// Create the Markov chain instance once comments are loaded
function createMarkovChain() {
  markov = new MarkovChain(comments);
}

// Function to add a comment to the feed
function addComment() {
  if (!markov) return; // Ensure Markov is initialized
  const randomIndex = Math.floor(Math.random() * comments.length);
  const randomStartWord = comments[randomIndex].split(' ')[0];
  let newComment = markov.generate(randomStartWord, 20);
  let zalgifiedComment = zalgo(newComment, 0.5); // Apply Zalgo effect

  const commentElement = document.createElement('div');
  commentElement.className = 'comment';

  // Add comment text
  const commentText = document.createElement('p');
  commentText.textContent = zalgifiedComment;
  commentElement.appendChild(commentText);

  // Add upvotes and comments bubble
  const upvotes = document.createElement('span');
  upvotes.className = 'upvotes';
  upvotes.innerHTML = `<i class="fas fa-thumbs-up"></i> ${Math.floor(Math.random() * 8)}`;
  commentElement.appendChild(upvotes);

  const commentsBubble = document.createElement('span');
  commentsBubble.className = 'commentsBubble';
  commentsBubble.innerHTML = `<i class="fas fa-comment"></i> ${Math.floor(Math.random() * 4)}`;
  commentElement.appendChild(commentsBubble);

  // Add the comment to the feed
  const feed = document.getElementById('feed');
  feed.appendChild(commentElement);

  // Scroll to the bottom
  feed.scrollTop = feed.scrollHeight;

  // Remove oldest comment if too many
  if (feed.children.length > maxComments) {
    const oldestComment = feed.children[0];
    oldestComment.classList.add('fadeOut');
    setTimeout(() => oldestComment.remove(), 1000); // Wait for fade out
  }
}

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
  const videoIDs = ['yb6vArLA9cA', 'eD81CsAFmDU', 'coRWtkRpNhw', 'f7nPA1oEbqg', /*...*/];
  return videoIDs[Math.floor(Math.random() * videoIDs.length)];
}

function startAtRandomTime() {
  const videoDuration = player.getDuration();
  const maxStartTime = videoDuration - 20;
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
