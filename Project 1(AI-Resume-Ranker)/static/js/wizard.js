/**
 * ResumeAI Pro — Advanced Wizard Controller
 * Production-ready, modular ES6 class handling form steps, validation,
 * file upload, progress tracking, and final submission.
 */
class ResumeWizard {
    constructor() {
        // Core state
        this.currentStep = 1;
        this.totalSteps = 4;
        this.isLoading = false;

        // DOM references
        this.form = document.getElementById('wizardForm');
        this.stepPanels = [
            document.getElementById('stepPanel1'),
            document.getElementById('stepPanel2'),
            document.getElementById('stepPanel3'),
            document.getElementById('stepPanel4')
        ];
        this.nextBtn = document.getElementById('nextBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.analyzeBtn = document.getElementById('analyzeBtn');
        this.progressFill = document.getElementById('progressFill');
        this.stepItems = document.querySelectorAll('.step-item');
        this.wizardDots = document.querySelectorAll('.dot');

        // Upload
        this.uploadZone = document.getElementById('uploadZone');
        this.fileInput = document.getElementById('resumeInput');
        this.uploadedFileInfo = document.getElementById('uploadedFileInfo');
        this.changeFileBtn = document.getElementById('changeFileBtn');
        this.fileNameDisplay = document.getElementById('fileNameDisplay');
        this.fileSizeDisplay = document.getElementById('fileSizeDisplay');

        // Job description
        this.jobDescTextarea = document.getElementById('jobDescription');
        this.charCountSpan = document.getElementById('charCount');

        // Review elements
        this.reviewCandidateBody = document.getElementById('reviewCandidateBody');
        this.reviewResumeBody = document.getElementById('reviewResumeBody');
        this.reviewJobBody = document.getElementById('reviewJobBody');
        this.checkCandidate = document.getElementById('checkCandidate');
        this.checkResume = document.getElementById('checkResume');
        this.checkJobDesc = document.getElementById('checkJobDesc');

        // Toast
        this.toastContainer = document.getElementById('toastContainer');

        // Init
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateUIForStep(1);
    }

    /* ------------------ Event Listeners ------------------ */
    setupEventListeners() {
        // Navigation buttons
        this.nextBtn.addEventListener('click', () => this.handleNext());
        this.prevBtn.addEventListener('click', () => this.handlePrevious());
        this.analyzeBtn.addEventListener('click', (e) => this.handleAnalyze(e));

        // Step sidebar clicks (allow navigation only after a step is completed? 
        // For simplicity, we'll just allow navigation if not disabled.)
        this.stepItems.forEach(item => {
            const trigger = item.querySelector('.step-trigger');
            if (trigger) {
                trigger.addEventListener('click', () => {
                    const targetStep = parseInt(trigger.dataset.stepTarget, 10);
                    if (targetStep && !trigger.disabled) {
                        this.goToStep(targetStep);
                    }
                });
            }
        });

        // Upload zone: drag & drop
        this.uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadZone.classList.add('upload-zone--active');
        });
        this.uploadZone.addEventListener('dragleave', () => {
            this.uploadZone.classList.remove('upload-zone--active');
        });
        this.uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadZone.classList.remove('upload-zone--active');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.fileInput.files = files;
                this.handleFileChange();
            }
        });

        // Click to open file dialog
        this.uploadZone.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', () => this.handleFileChange());

        // Change file button
        this.changeFileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.fileInput.click();
        });

        // Job description character counter
        this.jobDescTextarea.addEventListener('input', () => this.updateCharCounter());
    }

    /* ------------------ Navigation ------------------ */
    goToStep(step) {
        if (step < 1 || step > this.totalSteps || this.isLoading) return;
        if (step > this.currentStep && !this.validateCurrentStep()) return;

        this.currentStep = step;
        this.updateUIForStep(step);
    }

    handleNext() {
        if (this.currentStep < this.totalSteps) {
            this.goToStep(this.currentStep + 1);
        }
    }

    handlePrevious() {
        if (this.currentStep > 1) {
            this.goToStep(this.currentStep - 1);
        }
    }

    /* ------------------ UI Update ------------------ */
    updateUIForStep(step) {
        // Update step panels
        this.stepPanels.forEach((panel, index) => {
            const isActive = index + 1 === step;
            panel.classList.toggle('step-panel--active', isActive);
            // Enable/disable fieldsets (keep other step inputs disabled when not active)
            panel.disabled = !isActive;
        });

        // Update buttons visibility
        this.prevBtn.disabled = step === 1;
        this.analyzeBtn.hidden = step !== this.totalSteps;
        this.nextBtn.hidden = step === this.totalSteps;

        // Update progress bar
        this.updateProgressBar(step);

        // Update sidebar step indicators
        this.updateStepIndicators(step);

        // Update mobile dots
        this.wizardDots.forEach((dot, index) => {
            dot.classList.toggle('dot--active', index + 1 === step);
        });

        // If we just arrived at review step, refresh the summary
        if (step === this.totalSteps) {
            this.updateReview();
        }

        // Scroll to top of content (smooth)
        const content = document.querySelector('.wizard-content');
        if (content) content.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateProgressBar(activeStep) {
        const percent = ((activeStep - 1) / (this.totalSteps - 1)) * 100;
        this.progressFill.style.height = `${percent}%`;
    }

    updateStepIndicators(activeStep) {
        this.stepItems.forEach(item => {
            const step = parseInt(item.dataset.step, 10);
            item.classList.remove('step-item--active', 'step-item--completed');

            // Determine if this step is completed (i.e. step < activeStep and can be considered valid)
            // For visual feedback, we'll mark completed only if step < activeStep AND the required data is present.
            // We'll use a simple approach: step < activeStep -> completed; step === activeStep -> active.
            if (step < activeStep) {
                item.classList.add('step-item--completed');
                item.setAttribute('data-step-completed', '');
            } else if (step === activeStep) {
                item.classList.add('step-item--active');
                item.removeAttribute('data-step-completed');
            } else {
                item.removeAttribute('data-step-completed');
            }

            // Enable/disable step triggers based on whether we've been there
            const trigger = item.querySelector('.step-trigger');
            if (trigger) {
                // Allow clicking on completed steps to go back
                trigger.disabled = step > activeStep;
            }
        });
    }

    /* ------------------ Validation ------------------ */
    validateCurrentStep() {
        this.clearErrors();

        switch (this.currentStep) {
            case 1: return this.validateStep1();
            case 2: return this.validateStep2();
            case 3: return this.validateStep3();
            default: return true;
        }
    }

    validateStep1() {
        const fullName = document.getElementById('fullName');
        const email = document.getElementById('email');
        const experienceLevel = document.getElementById('experienceLevel');

        let isValid = true;
        if (!fullName.value.trim()) {
            this.showFieldError(fullName, 'Full name is required.');
            isValid = false;
        }
        if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            this.showFieldError(email, 'Please enter a valid email address.');
            isValid = false;
        }
        if (!experienceLevel.value) {
            this.showFieldError(experienceLevel, 'Please select your experience level.');
            isValid = false;
        }
        return isValid;
    }

    validateStep2() {
        if (!this.fileInput.files || this.fileInput.files.length === 0) {
            this.showToast('Please upload your resume file.', 'warning');
            return false;
        }
        return true;
    }

    validateStep3() {
        const targetCompany = document.getElementById('targetCompany');
        const targetRole = document.getElementById('targetRole');
        const jobType = document.getElementById('jobType');
        const jobDesc = this.jobDescTextarea;

        let isValid = true;
        if (!targetCompany.value.trim()) {
            this.showFieldError(targetCompany, 'Target company is required.');
            isValid = false;
        }
        if (!targetRole.value.trim()) {
            this.showFieldError(targetRole, 'Target role is required.');
            isValid = false;
        }
        if (!jobType.value) {
            this.showFieldError(jobType, 'Please select job type.');
            isValid = false;
        }
        if (jobDesc.value.trim().length < 20) {
            this.showFieldError(jobDesc, 'Job description must be at least 20 characters.');
            isValid = false;
        }
        return isValid;
    }

    showFieldError(input, message) {
        const wrapper = input.closest('.input-wrapper');
        if (wrapper) {
            input.classList.add('input-error');
            const errorEl = wrapper.querySelector('.input-error-msg');
            if (errorEl) {
                errorEl.textContent = message;
                errorEl.style.display = 'block';
            }
        }
    }

    clearErrors() {
        document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
        document.querySelectorAll('.input-error-msg').forEach(el => {
            el.textContent = '';
            el.style.display = 'none';
        });
    }

    /* ------------------ File Handling ------------------ */
    handleFileChange() {
        const files = this.fileInput.files;
        if (!files || files.length === 0) {
            this.hideFileInfo();
            return;
        }

        const file = files[0];
        const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'
        ];
        const allowedExtensions = ['.pdf', '.docx', '.txt'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

        if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
            this.showToast('Unsupported file type. Please upload PDF, DOCX, or TXT.', 'danger');
            this.fileInput.value = ''; // reset
            this.hideFileInfo();
            return;
        }

        if (file.size > 10 * 1024 * 1024) { // 10 MB
            this.showToast('File size exceeds 10 MB limit.', 'danger');
            this.fileInput.value = '';
            this.hideFileInfo();
            return;
        }

        this.showFileInfo(file);
    }

    showFileInfo(file) {
        this.fileNameDisplay.textContent = file.name;
        this.fileSizeDisplay.textContent = this.formatFileSize(file.size);
        this.uploadedFileInfo.hidden = false;
        this.uploadZone.style.display = 'none'; // hide upload zone, show file card
    }

    hideFileInfo() {
        this.uploadedFileInfo.hidden = true;
        this.uploadZone.style.display = 'flex'; // restore upload zone
        this.fileInput.value = '';
    }

    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    }

    /* ------------------ Character Counter ------------------ */
    updateCharCounter() {
        const length = this.jobDescTextarea.value.length;
        this.charCountSpan.textContent = length;
    }

    /* ------------------ Review & Checklist ------------------ */
    updateReview() {
        // Candidate info
        const fullName = document.getElementById('fullName').value.trim() || '—';
        const email = document.getElementById('email').value.trim() || '—';
        const phone = document.getElementById('phone').value.trim() || '—';
        const location = document.getElementById('currentLocation').value.trim() || '—';
        const experience = document.getElementById('experienceLevel').options[document.getElementById('experienceLevel').selectedIndex]?.text || '—';

        this.reviewCandidateBody.innerHTML = `
            <div><strong>${fullName}</strong></div>
            <div>${email}</div>
            <div>${phone}</div>
            <div>${location}</div>
            <div>${experience}</div>
        `;

        // Resume info
        const resumeFile = this.fileInput.files?.[0];
        if (resumeFile) {
            this.reviewResumeBody.innerHTML = `
                <div><strong>${resumeFile.name}</strong></div>
                <div>${this.formatFileSize(resumeFile.size)}</div>
            `;
        } else {
            this.reviewResumeBody.innerHTML = '<p class="review-card-placeholder">No resume uploaded.</p>';
        }

        // Job info
        const company = document.getElementById('targetCompany').value.trim() || '—';
        const role = document.getElementById('targetRole').value.trim() || '—';
        this.reviewJobBody.innerHTML = `
            <div><strong>${company}</strong></div>
            <div>${role}</div>
        `;

        // Checklist icons
        this.toggleCheckIcon(this.checkCandidate, !!fullName && fullName !== '—');
        this.toggleCheckIcon(this.checkResume, !!resumeFile);
        this.toggleCheckIcon(this.checkJobDesc, this.jobDescTextarea.value.trim().length >= 20);
    }

    toggleCheckIcon(checkItem, isComplete) {
        const pendingIcon = checkItem.querySelector('.icon-pending');
        const successIcon = checkItem.querySelector('.icon-success');
        if (pendingIcon && successIcon) {
            pendingIcon.hidden = isComplete;
            successIcon.hidden = !isComplete;
        }
    }

    // Inside the handleAnalyze method (or wherever the button click is captured)
handleAnalyze(e) {
    e.preventDefault();
    if (this.isLoading) return;

    if (!this.validateAll()) {
        this.showToast('Please complete all required fields.', 'warning');
        return;
    }

    // ★ Enable all disabled fieldsets so their inputs are submitted
    this.stepPanels.forEach(panel => panel.disabled = false);

    // Optional: show loading on button
    this.analyzeBtn.disabled = true;
    this.analyzeBtn.innerHTML = '<span class="spinner"></span> Analyzing...';

    // Submit the form – goes to /save-upload
    this.form.submit();
}

    validateAll() {
        // Navigate through each step to check (temporarily)
        const originalStep = this.currentStep;
        let valid = true;

        for (let step = 1; step <= 3; step++) {
            this.currentStep = step;
            if (!this.validateCurrentStep()) {
                valid = false;
                break;
            }
        }

        this.currentStep = originalStep; // restore
        return valid;
    }

    startLoading() {
        this.isLoading = true;
        this.analyzeBtn.disabled = true;
        this.analyzeBtn.innerHTML = `
            <span class="spinner"></span> Analyzing...
        `;
        this.prevBtn.disabled = true;
        this.nextBtn.disabled = true;
        document.querySelectorAll('.step-trigger').forEach(btn => btn.disabled = true);
    }

    /* ------------------ Toast Notifications ------------------ */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.textContent = message;
        this.toastContainer.appendChild(toast);
        this.toastContainer.hidden = false;

        setTimeout(() => {
            toast.remove();
            if (this.toastContainer.children.length === 0) {
                this.toastContainer.hidden = true;
            }
        }, 4000);
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    new ResumeWizard();
});