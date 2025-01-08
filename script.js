// Add constants for time values to avoid magic numbers
const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

// Update the initial state
let timeLeft = WORK_TIME;
let timerId = null;
let isWorkTime = true;
let isPaused = false;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.querySelector('.reset');
const toggleButton = document.getElementById('toggle-mode');
const modeText = document.getElementById('mode-text');

function updateDisplay() {
    try {
        const minutes = Math.floor(Math.max(0, timeLeft) / 60);
        const seconds = Math.max(0, timeLeft) % 60;
        
        // Format the time strings
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update the display elements
        minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        secondsDisplay.textContent = seconds.toString().padStart(2, '0');
        
        // Update the page title
        document.title = `${timeString} - ${isWorkTime ? 'Work' : 'Break'} Timer`;
    } catch (error) {
        console.error('Error updating display:', error);
    }
}

function updateButtonStates() {
    // Update start button text and styles based on timer state
    startButton.textContent = timerId !== null ? 'Pause' : 'Start';
    if (timerId !== null) {
        startButton.classList.add('running');
    } else {
        startButton.classList.remove('running');
    }
}

function startTimer() {
    if (timerId !== null) {
        // Pause functionality
        clearInterval(timerId);
        timerId = null;
        isPaused = true;
        updateButtonStates();
        return;
    }
    
    try {
        if (timeLeft <= 0) {
            timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
        }
        
        isPaused = false;
        timerId = setInterval(() => {
            if (timeLeft <= 0) {
                handleTimerComplete();
                return;
            }
            
            timeLeft--;
            updateDisplay();
        }, 1000);
        
        updateButtonStates();
    } catch (error) {
        console.error('Error starting timer:', error);
    }
}

function handleTimerComplete() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    modeText.textContent = isWorkTime ? 'Work Time' : 'Break Time';
    toggleButton.textContent = isWorkTime ? 'Switch to Break' : 'Switch to Work';
    updateDisplay();
    updateButtonStates();
    
    // Use a more modern notification approach
    try {
        new Audio('notification.mp3').play().catch(() => {
            alert(isWorkTime ? 'Work Time!' : 'Break Time!');
        });
    } catch (error) {
        alert(isWorkTime ? 'Work Time!' : 'Break Time!');
    }
}

function updateToggleButtonStyle() {
    if (isWorkTime) {
        toggleButton.classList.add('work-mode');
        toggleButton.classList.remove('break-mode');
    } else {
        toggleButton.classList.add('break-mode');
        toggleButton.classList.remove('work-mode');
    }
}

function toggleMode() {
    // Clear any running timer
    clearInterval(timerId);
    timerId = null;
    
    // Switch modes and reset time
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    
    // Update UI elements
    modeText.textContent = isWorkTime ? 'Work Time' : 'Break Time';
    toggleButton.textContent = isWorkTime ? 'Rest' : 'Work';
    updateToggleButtonStyle();
    
    // Ensure start button shows correct state
    startButton.classList.remove('running');
    startButton.textContent = 'Start';
    
    // Update display and button states
    updateDisplay();
    updateButtonStates();
}

// Event Listeners
startButton.addEventListener('click', startTimer);

resetButton.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    isPaused = false;
    updateDisplay();
    updateButtonStates();
});

toggleButton.addEventListener('click', toggleMode);

// Initialize the app
function initializeApp() {
    updateDisplay();
    updateButtonStates();
    
    window.addEventListener('beforeunload', (e) => {
        if (timerId !== null) {
            e.preventDefault();
            e.returnValue = '';
            return '';
        }
    });
}

initializeApp();

document.addEventListener('DOMContentLoaded', () => {
    toggleButton.textContent = 'Rest';
    updateDisplay();
    updateToggleButtonStyle();
}); 