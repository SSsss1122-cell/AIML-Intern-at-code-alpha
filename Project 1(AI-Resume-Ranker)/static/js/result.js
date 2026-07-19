/**
 * ResumeAI Pro — Results Dashboard Controller
 * Premium AI SaaS analytics: animated counters, ATS ring, scroll reveal, charts, toasts.
 * Dependencies: Chart.js (loaded externally, gracefully skips if missing).
 * Production-ready, modular ES6 class.
 */
class ResultsDashboard {
    constructor() {
        // DOM elements cache
        this.atsCanvas = document.getElementById('atsScoreRing');
        this.atsValueEl = document.getElementById('atsScoreValue');
        this.atsTarget = 87; // default, will read from DOM

        // Initialize all modules
        this.init();
    }

    init() {
        this.parseATSScore();
        this.animateATSRing();
        this.animateCounters();
        this.initScrollReveal();
        this.initCharts();
        this.initButtonListeners();
    }

    /* ---------- ATS Score Parsing ---------- */
    parseATSScore() {
        if (this.atsValueEl) {
            const raw = this.atsValueEl.textContent.replace('%', '').trim();
            const parsed = parseInt(raw, 10);
            if (!isNaN(parsed)) this.atsTarget = Math.min(100, Math.max(0, parsed));
        }
    }

    /* ---------- ATS Score Ring Animation (Canvas) ---------- */
    animateATSRing() {
        if (!this.atsCanvas) return;
        const canvas = this.atsCanvas;
        const ctx = canvas.getContext('2d');

        // Retina scaling
        const dpr = window.devicePixelRatio || 1;
        const size = 180; // logical size
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        canvas.style.width = size + 'px';
        canvas.style.height = size + 'px';
        ctx.scale(dpr, dpr);

        const centerX = size / 2;
        const centerY = size / 2;
        const radius = 70;
        const lineWidth = 10;

        // Color based on score
        const getColor = (percent) => {
            if (percent >= 80) return '#22C55E';
            if (percent >= 60) return '#F59E0B';
            return '#EF4444';
        };
        const strokeColor = getColor(this.atsTarget);

        let currentPercent = 0;
        const speed = 1.2; // percent per frame
        const animation = () => {
            currentPercent += speed;
            if (currentPercent >= this.atsTarget) {
                currentPercent = this.atsTarget;
            }

            // Clear
            ctx.clearRect(0, 0, size, size);

            // Background track
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.strokeStyle = 'rgba(255,255,255,0.08)';
            ctx.lineWidth = lineWidth;
            ctx.stroke();

            // Progress arc
            const startAngle = -Math.PI / 2;
            const endAngle = startAngle + (currentPercent / 100) * (2 * Math.PI);
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = lineWidth;
            ctx.lineCap = 'round';
            ctx.stroke();

            // Glow effect
            ctx.save();
            ctx.shadowColor = strokeColor;
            ctx.shadowBlur = 12;
            ctx.stroke();
            ctx.restore();

            // Percentage text (optional, but we have overlay)
            if (currentPercent < this.atsTarget) {
                requestAnimationFrame(animation);
            }
        };
        requestAnimationFrame(animation);
    }

    /* ---------- Counter Animation ---------- */
    animateCounters() {
        const counters = [
            { id: 'resumeScore', value: 82 },
            { id: 'jobMatch', value: 73, suffix: '%' },
            { id: 'skillsFound', value: 28 },
            { id: 'missingSkills', value: 5 }
        ];
        counters.forEach(c => this.animateCounter(c));
    }

    animateCounter({ id, value, suffix = '' }) {
        const el = document.getElementById(id);
        if (!el) return;
        const target = value;
        const duration = 1500;
        const stepTime = 16;
        const totalSteps = duration / stepTime;
        let currentStep = 0;

        const update = () => {
            currentStep++;
            const progress = currentStep / totalSteps;
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            const current = Math.round(target * eased);
            el.textContent = current + suffix;
            if (progress < 1) {
                requestAnimationFrame(() => setTimeout(update, stepTime));
            } else {
                el.textContent = target + suffix;
            }
        };
        update();
    }

    /* ---------- Scroll Reveal (Intersection Observer) ---------- */
    initScrollReveal() {
        const revealElements = document.querySelectorAll(
            '.glass-card, .metric-card, .skill-chip, .timeline-item, .roadmap-step'
        );
        if (!revealElements.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('scroll-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -20px 0px' }
        );

        revealElements.forEach(el => {
            el.classList.add('scroll-hidden');
            observer.observe(el);
        });
    }

    /* ---------- Charts (Chart.js) ---------- */
    initCharts() {
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded. Skipping chart rendering.');
            return;
        }

        // Common options for dark theme
        const darkGrid = {
            color: 'rgba(255,255,255,0.06)',
            tickColor: 'rgba(255,255,255,0.1)',
            borderDash: [3, 3]
        };

        // Skill Distribution (Bar Chart)
        const skillDistCtx = document.getElementById('skillDistributionChart')?.getContext('2d');
        if (skillDistCtx) {
            new Chart(skillDistCtx, {
                type: 'bar',
                data: {
                    labels: ['Python', 'Java', 'SQL', 'ML', 'Flask', 'React', 'Docker'],
                    datasets: [{
                        label: 'Proficiency',
                        data: [92, 85, 88, 78, 80, 72, 35],
                        backgroundColor: ['#2563EB', '#2563EB', '#2563EB', '#60A5FA', '#60A5FA', '#60A5FA', '#EF4444'],
                        borderRadius: 6,
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: darkGrid,
                            ticks: { color: '#94A3B8' }
                        },
                        x: {
                            grid: darkGrid,
                            ticks: { color: '#94A3B8' }
                        }
                    }
                }
            });
        }

        // Keyword Match (Radar)
        const keywordCtx = document.getElementById('keywordMatchChart')?.getContext('2d');
        if (keywordCtx) {
            new Chart(keywordCtx, {
                type: 'radar',
                data: {
                    labels: ['Python', 'AWS', 'Docker', 'CI/CD', 'React', 'SQL', 'TensorFlow'],
                    datasets: [{
                        label: 'Match',
                        data: [100, 30, 20, 10, 90, 100, 5],
                        backgroundColor: 'rgba(37,99,235,0.2)',
                        borderColor: '#2563EB',
                        borderWidth: 2,
                        pointBackgroundColor: '#60A5FA',
                        pointRadius: 3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            grid: { color: 'rgba(255,255,255,0.08)' },
                            angleLines: { color: 'rgba(255,255,255,0.08)' },
                            pointLabels: { color: '#CBD5E1' },
                            ticks: { display: false, stepSize: 20 },
                            min: 0,
                            max: 100
                        }
                    },
                    plugins: { legend: { display: false } }
                }
            });
        }

        // Resume Sections (Polar Area)
        const sectionsCtx = document.getElementById('resumeSectionsChart')?.getContext('2d');
        if (sectionsCtx) {
            new Chart(sectionsCtx, {
                type: 'polarArea',
                data: {
                    labels: ['Summary', 'Experience', 'Education', 'Projects', 'Skills'],
                    datasets: [{
                        data: [55, 92, 85, 78, 88],
                        backgroundColor: [
                            'rgba(239,68,68,0.5)',
                            'rgba(34,197,94,0.5)',
                            'rgba(34,197,94,0.5)',
                            'rgba(96,165,250,0.5)',
                            'rgba(37,99,235,0.5)'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { r: { grid: { color: 'rgba(255,255,255,0.06)' } } },
                    plugins: { legend: { display: false } }
                }
            });
        }

        // Experience vs Education Score (horizontal bar)
        const expEduCtx = document.getElementById('expEduChart')?.getContext('2d');
        if (expEduCtx) {
            new Chart(expEduCtx, {
                type: 'bar',
                data: {
                    labels: ['Experience', 'Education'],
                    datasets: [{
                        label: 'Score',
                        data: [85, 92],
                        backgroundColor: ['#22C55E', '#2563EB'],
                        borderRadius: 8,
                        borderWidth: 0
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { max: 100, grid: darkGrid, ticks: { color: '#94A3B8' } },
                        y: { grid: darkGrid, ticks: { color: '#94A3B8' } }
                    },
                    plugins: { legend: { display: false } }
                }
            });
        }
    }

    /* ---------- Button Handlers ---------- */
    initButtonListeners() {
        // Download Report (Nav & Action)
        document.querySelectorAll('#downloadReportBtn, #downloadFullReportBtn').forEach(btn =>
            btn?.addEventListener('click', () => this.downloadReport())
        );

        // Analyze Another
        document.getElementById('analyzeAnotherBtn')?.addEventListener('click', () => {
            window.location.href = '/wizard';
        });

        // Improve Resume (dummy)
        document.getElementById('improveResumeBtn')?.addEventListener('click', () => {
            this.showToast('AI improvement suggestions have been generated. Check the suggestions card.', 'success');
        });

        // Share Report
        document.getElementById('shareReportBtn')?.addEventListener('click', () => {
            const shareData = {
                title: 'ResumeAI Pro Analysis Report',
                text: 'Check out my resume analysis report by ResumeAI Pro!',
                url: window.location.href
            };
            if (navigator.share) {
                navigator.share(shareData).catch(() => {});
            } else {
                navigator.clipboard.writeText(window.location.href).then(() => {
                    this.showToast('Report link copied to clipboard!', 'success');
                }).catch(() => {
                    this.showToast('Unable to share. Copy the URL manually.', 'warning');
                });
            }
        });

        // Print / Download PDF (print to PDF)
        document.getElementById('downloadReportBtn')?.addEventListener('click', () => window.print());
        document.getElementById('downloadFullReportBtn')?.addEventListener('click', () => window.print());
    }

    downloadReport() {
        window.print(); // Simple print-to-PDF
        this.showToast('Opening print dialog… Save as PDF for report.', 'info');
    }

    /* ---------- Toast Notification ---------- */
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        container.hidden = false;

        setTimeout(() => {
            toast.remove();
            if (container.children.length === 0) container.hidden = true;
        }, 4000);
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    new ResultsDashboard();
});