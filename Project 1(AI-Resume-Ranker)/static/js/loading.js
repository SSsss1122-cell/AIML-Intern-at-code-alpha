class LoadingScreen {
    constructor() {
        this.statusEl = document.getElementById('statusMessage');
        this.progressFill = document.getElementById('progressFill');
        this.progressPercentage = document.getElementById('progressPercentage');
        this.errorContainer = document.getElementById('errorContainer');
        this.errorMessage = document.getElementById('errorMessage');
        this.retryBtn = document.getElementById('retryBtn');

        this.messages = [
            'Extracting Resume...',
            'Reading PDF...',
            'Finding Skills...',
            'Checking ATS Compatibility...',
            'Analyzing Projects...',
            'Generating Suggestions...',
            'Calculating Resume Score...',
            'Preparing Dashboard...',
            'Almost Done...'
        ];
        this.messageIndex = 0;
        this.interval = null;
        this.fetchCompleted = false;
        this.progress = 0;

        this.init();
    }

    init() {
        this.startMessageCycle();
        this.startAnalysis();
        this.retryBtn.addEventListener('click', () => {
            this.hideError();
            this.startAnalysis();
        });
    }

    startMessageCycle() {
        this.statusEl.textContent = this.messages[0];
        this.interval = setInterval(() => {
            if (!this.fetchCompleted) {
                this.messageIndex = (this.messageIndex + 1) % this.messages.length;
                this.statusEl.textContent = this.messages[this.messageIndex];
                this.updateProgress();
            }
        }, 1200);
    }

    updateProgress() {
        // Simulate progress increment based on time (fake visual)
        this.progress = Math.min(95, this.progress + 5);
        this.progressFill.style.setProperty('--progress', `${this.progress}%`);
        this.progressPercentage.textContent = `${this.progress}%`;
    }

    startAnalysis() {
        this.fetchCompleted = false;
        this.progress = 0;
        this.progressFill.style.setProperty('--progress', '0%');
        this.progressPercentage.textContent = '0%';
        this.statusEl.textContent = 'Initializing...';

        fetch('/process-analysis')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    this.fetchCompleted = true;
                    this.finishLoading();
                } else {
                    this.showError(data.message || 'Analysis failed.');
                }
            })
            .catch(err => {
                this.showError('Network error. Please try again.');
            });
    }

    finishLoading() {
        clearInterval(this.interval);
        this.statusEl.textContent = 'Analysis complete! Redirecting...';
        this.progress = 100;
        this.progressFill.style.setProperty('--progress', '100%');
        this.progressPercentage.textContent = '100%';

        setTimeout(() => {
            window.location.href = '/results';
        }, 1000);
    }

    showError(message) {
        clearInterval(this.interval);
        this.statusEl.textContent = 'Error occurred.';
        this.errorMessage.textContent = message;
        this.errorContainer.style.display = 'block';
    }

    hideError() {
        this.errorContainer.style.display = 'none';
        this.statusEl.textContent = 'Retrying...';
    }
}

document.addEventListener('DOMContentLoaded', () => new LoadingScreen());