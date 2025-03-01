let isRunning = false; // Tracks the state of the metronome
let timer = null; // Stores the timer for the metronome

// Select HTML elements
const tempoInput = document.getElementById('tempo'); // Input field for BPM
const startStopButton = document.getElementById('startStopButton'); // Start/Stop button
const statusText = document.getElementById('status'); // Status text display

// Load the click sound from the "audio" directory
const clickSound = new Audio('audio/click.wav');

// Function to start the metronome
function startMetronome() {
  const bpm = parseInt(tempoInput.value, 10); // Get BPM value from input
  if (isNaN(bpm) || bpm <= 0 || bpm > 240) {
    alert('Please enter a tempo between 0.1 and 240 BPM.'); // Validation
    return;
  }

  const interval = 60000 / bpm; // Calculate milliseconds per beat
  timer = setInterval(() => {
    playClick();
  }, interval); // Set a repeating interval to play the sound
  statusText.textContent = 'Status: Running'; // Update status text
}

// Function to stop the metronome
function stopMetronome() {
  clearInterval(timer); // Clear the timer
  timer = null; // Reset the timer variable
  statusText.textContent = 'Status: Stopped'; // Update status text
}

// Function to play the click sound
function playClick() {
  clickSound.currentTime = 0; // Reset the sound to the beginning
  clickSound.play().catch((error) => {
    console.error('Error playing sound:', error); // Log any playback errors
  });
}

// Event listener for the Start/Stop button
startStopButton.addEventListener('click', () => {
  if (isRunning) {
    stopMetronome(); // Stop the metronome if it's running
    startStopButton.textContent = 'Start'; // Update button text
  } else {
    startMetronome(); // Start the metronome if it's stopped
    startStopButton.textContent = 'Stop'; // Update button text
  }
  isRunning = !isRunning; // Toggle the running state
});
