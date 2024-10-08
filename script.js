// Variables
let comments = [];
const maxComments = 10;
let zalgoIntensity = 0; // Start with no Zalgo effect
let markovEffect = false;
let commentCount = 0;
let zalgoIncreaseRate = 0.005; // Gradual increase rate
let markovStartAfter = 15;

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
  if (commentCount > 10) { // Start Zalgo effect after 10 comments
    zalgoIntensity = Math.min(0.5, zalgoIntensity + zalgoIncreaseRate); // Cap at 0.5 for subtlety
  }
  if (commentCount > markovStartAfter) { // Start Markov after more comments
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
    newComment = markov.generate(randomStartWord, 15); // Slightly shorter for visual pacing
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




  // Create an upvotes span to hold the like button and count
const upvotes = document.createElement('span');
upvotes.className = 'upvotes';

// Create a like count element
const likeCount = document.createElement('span');
likeCount.className = 'likeCount'; // Class for styling if needed
likeCount.textContent = Math.floor(Math.random() * 9); // Random like count between 0 and 8

// Create the thumbs-up icon
const thumbsUpIcon = document.createElement('i');
thumbsUpIcon.className = 'fas fa-thumbs-up';

// Create a like button element to wrap the icon and count
const likeBtn = document.createElement('span');
likeBtn.className = 'like-btn'; // Ensure it has the class for event handling
likeBtn.appendChild(thumbsUpIcon);
likeBtn.appendChild(likeCount);

// Append the like button to the upvotes span
upvotes.appendChild(likeBtn);

// Now append the upvotes span to your comment element
commentElement.appendChild(upvotes);



// Use existing event listener for dynamic comments
document.addEventListener('click', (event) => {
  // Like functionality
  if (event.target.closest('.like-btn')) {
    const likeBtn = event.target.closest('.like-btn');
    const likeIcon = likeBtn.querySelector('i'); // Select the thumbs-up icon
    const likeCountElement = likeBtn.querySelector('.likeCount'); // Select the like count element
    let likeCountValue = parseInt(likeCountElement.textContent);

    // Parse the like count safely
    if (isNaN(likeCountValue)) {
      likeCountValue = 0; // Default to 0 if parsing fails
    }

    // Toggle the liked state and add/remove the class on the button
    if (likeBtn.classList.contains('liked')) {
      likeBtn.classList.remove('liked'); // Remove the class if already liked
      likeCountValue -= 1; // Decrease the like count
    } else {
      likeBtn.classList.add('liked'); // Add the class if not liked
      likeCountValue += 1; // Increase the like count
    }

    // Update the like count display
    likeCountElement.textContent = likeCountValue; // Update the count text
  }
});








// Make sure to attach the comment button properly
const commentsBubble = document.createElement('span');
commentsBubble.className = 'commentsBubble comment-btn';
commentsBubble.innerHTML = `<i class="fas fa-comment"></i> ${Math.floor(Math.random() * 4)}`; // Icon + random number

// Create an input field for user comments
const commentInput = document.createElement('input');
commentInput.className = 'comment-input'; // Assign the correct class for styling
commentInput.type = 'text';
commentInput.placeholder = 'In the silence, I wonder...';
commentInput.style.display = 'none'; // Hidden initially

// Append the input to the comments bubble
commentElement.appendChild(commentsBubble); // Append comment icon to the comment element
commentElement.appendChild(commentInput); // Append the comment input box

// Click event to show the input when the comments bubble is clicked
commentsBubble.onclick = function() {
  if (commentInput.style.display === 'none') {
    commentInput.style.display = 'block'; // Show the input
  } else {
    commentInput.style.display = 'none'; // Hide the input if clicked again
  }
  commentInput.focus(); // Automatically focus the input
};


// Keydown event to handle submitting the comment on Enter
// Keydown event to handle submitting the comment on Enter

// function updateCommentCount(element, count) {
//  element.innerHTML = `<i class="fas fa-comment"></i> ${count}`;
// }




// Update the addUserComment function to place comments under their parent comment
// Function to add user comments under the parent comment
function addUserComment(userComment, parentCommentElement) {
  const userCommentElement = document.createElement('div');
  userCommentElement.className = 'child-comment'; // Use the child-comment class instead

  const userCommentText = document.createElement('p');
  userCommentText.textContent = userComment;

  userCommentElement.appendChild(userCommentText);
  
  // Append the user's comment under the parent comment
  parentCommentElement.appendChild(userCommentElement);

  // Find the comments bubble to update its count
  const commentsBubble = parentCommentElement.querySelector('.commentsBubble');

  // Update the count in the comments bubble
  let currentCount = parseInt(commentsBubble.innerText.match(/\d+/)[0]) || 0; // Get the current count
  commentsBubble.innerHTML = `<i class="fas fa-comment"></i> ${currentCount + 1}`; // Increment the count
}

// Keydown event to handle submitting the comment on Enter
commentInput.onkeydown = function(event) {
  if (event.key === 'Enter') {
    const userComment = commentInput.value.trim(); // Get user comment
    if (userComment) {
      addUserComment(userComment, commentElement); // Call a function to add the user's comment
      commentInput.value = ''; // Clear the input
      commentInput.style.display = 'none'; // Hide the input after submission
    }
  }
};




  const feed = document.getElementById('feed');
  feed.appendChild(commentElement);

  feed.scrollTop = feed.scrollHeight;

function increaseLikes(element) {
  const likeCountElement = element.nextElementSibling; // Get the like count span
  let currentCount = parseInt(likeCountElement.textContent); // Get current like count
  currentCount++; // Increase the count by 1
  likeCountElement.textContent = currentCount; // Update the displayed count
  }



  // Fade out older comments at a slower rate for better pacing
  if (feed.children.length > maxComments) {
    const oldestComment = feed.children[0];
    oldestComment.classList.add('fadeOut');
    setTimeout(() => {
      oldestComment.remove();
    }, 1100); // Slightly longer fade duration for a smoother exit
  }
}

// YouTube API Section
let player;

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
      playlist: randomVideoID // Ensure that the loop works with the playlist
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  event.target.mute();
  startAtRandomTime(event.target);
  changeVideo(); // Start changing videos after the player is ready
}

function onPlayerStateChange(event) {
  // Check if the video ended, and load a new one
  if (event.data === YT.PlayerState.ENDED) {
    loadRandomVideo();
  }
}

function getRandomVideoID() {
  const videoIDs = [
  '2o9SUPgyZRY',
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
  'vmsA4Usj8H4',
  'ft3b1-Cm-0M',
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
  'u8R7fmLYgi4',
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
  '_CLzzUfDjUo',
  'nzUY6Iiur6E',
  'JujtlsiqZ-E',
  'hN2jOHeI5tc',
  '-hT4qJBx8yw',
  'E28JMBKK3WQ',
  'EGuEZ5R21Qc',
  '9Cy__PpiJ_Y',
  'DkFJE8ZdeG8',
  'kes8cFqkHac',
  'sVZpHFXcFJw',
  '0uEOIS_XojU',
  'bFUi7inkAbs',
  'XoHI6Zus2UI',
  'iPD-mvR6C-M',
  'Z303I1nqWZc',
  '15VT_eQGflw',
  ];
  return videoIDs[Math.floor(Math.random() * videoIDs.length)];
}

function startAtRandomTime(player) {
  // Delay seeking to allow video duration to be set
  setTimeout(() => {
    const videoDuration = player.getDuration();
    if (videoDuration > 0) {
      const bufferZone = 40; // seconds
      const maxStartTime = videoDuration - bufferZone;
      const randomStartTime = Math.floor(Math.random() * maxStartTime);
      player.seekTo(randomStartTime, true);
    }
  }, 1000); // Wait for 1 second before seeking
}

function changeVideo() {
  setInterval(() => {
    const randomVideoID = getRandomVideoID();
    player.loadVideoById(randomVideoID);
    startAtRandomTime(player); // Seek to a random time after changing video
  }, Math.random() * (15000 - 5000) + 5000); // Switch every 5-15 seconds
}


// Ensure the music starts at half volume
document.querySelector('audio').volume = 0.5;





// Add event listeners for dynamically created comments
// document.addEventListener('click', (event) => {
//   // Like functionality
//   if (event.target.closest('.like-btn')) {
 //    let upvoteElement = event.target.closest('.like-btn');
 //    let likeIcon = upvoteElement.querySelector('i');
 //    let likeCountText = upvoteElement.textContent.trim().split(' ')[1];

    // Parse the like count safely
 //    let likeCount = parseInt(likeCountText);
 //    if (isNaN(likeCount)) {
//       likeCount = 0; // Default to 0 if parsing fails
//     }

    // Toggle the liked state
//     likeIcon.classList.toggle('liked');
//     if (likeIcon.classList.contains('liked')) {
//       likeCount += 1;
//     } else {
//       likeCount -= 1;
//     }

    // Update the inner HTML correctly, ensuring the icon structure remains
//     upvoteElement.innerHTML = `<i class="fas fa-thumbs-up ${likeIcon.classList.contains('liked') ? 'liked' : ''}"></i> ${likeCount}`;
    // Re-append the like button to keep the structure intact
//     upvoteElement.appendChild(likeIcon);
 //  }

  // Comment functionality (e.g., reply box toggle)
 //  if (event.target.closest('.comment-btn')) {
//     let commentBox = event.target.closest('.comment').querySelector('.reply-box');
//     commentBox.style.display = (commentBox.style.display === 'none' || !commentBox.style.display) ? 'block' : 'none';
//   }

  // Handle reply submission
//   if (event.target.classList.contains('reply-submit')) {
//     const replyBox = event.target.previousElementSibling;
//     const userReply = replyBox.value.trim();
//     if (userReply !== "") {
//       const replyContainer = event.target.closest('.comment').querySelector('.user-reply');
//       replyContainer.innerHTML += `<p>${userReply}</p>`;
//       replyBox.value = ""; // Clear the input field after submission
//     }
//   }
// });
