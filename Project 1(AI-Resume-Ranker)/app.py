import os
import logging
from flask import Flask, request, render_template, flash, redirect, url_for, session, jsonify
from werkzeug.utils import secure_filename

# Import your existing utilities
from utils.pdf_reader import extract_text_from_pdf
from utils.preprocess import clean_text
from utils.skill_extractor import SkillExtractor
from utils.scorer import calculate_ats_score, calculate_similarity, score_experience, score_education
from utils.report_generator import generate_report

# Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)
app.secret_key = 'your-unique-and-secret-key'
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10 MB

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# spaCy (optional)
import spacy
try:
    nlp = spacy.load('en_core_web_sm')
except OSError:
    logging.warning("spaCy model missing. Install: python -m spacy download en_core_web_sm")

skill_extractor = SkillExtractor()

# ---------------- Routes ----------------
@app.route('/')
def index():
    return redirect(url_for('wizard'))

@app.route('/wizard')
def wizard():
    # Clear any previous analysis data
    session.pop('resume_filepath', None)
    session.pop('form_data', None)
    session.pop('analysis_results', None)
    return render_template('wizard.html')

@app.route('/save-upload', methods=['POST'])
def save_upload():
    """Save uploaded resume and form fields, then redirect to loading."""
    if 'resume' not in request.files or request.files['resume'].filename == '':
        flash('Please upload your resume.', 'danger')
        return redirect(url_for('wizard'))

    file = request.files['resume']
    job_description = request.form.get('job_description', '').strip()
    if not job_description:
        flash('Job description is required.', 'danger')
        return redirect(url_for('wizard'))

    # Save file temporarily
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    try:
        file.save(filepath)
    except Exception as e:
        logging.error(f"File save failed: {e}")
        flash('Could not save uploaded file.', 'danger')
        return redirect(url_for('wizard'))

    # Store in session
    session['resume_filepath'] = filepath
    session['form_data'] = {
        'full_name': request.form.get('full_name', 'Candidate'),
        'target_company': request.form.get('target_company', 'Not specified'),
        'target_role': request.form.get('target_role', 'Not specified'),
        'job_description': job_description,
    }

    logging.info(f"Resume saved to {filepath}, redirecting to loading.")
    return redirect(url_for('loading'))

@app.route('/loading')
def loading():
    """Serve the loading animation page."""
    if 'resume_filepath' not in session:
        flash('No resume found. Please start again.', 'warning')
        return redirect(url_for('wizard'))
    return render_template('loading.html')

@app.route('/process-analysis')
def process_analysis():
    """
    Run the AI analysis pipeline asynchronously.
    Returns JSON success/error.
    """
    filepath = session.get('resume_filepath')
    form_data = session.get('form_data')

    if not filepath or not os.path.exists(filepath):
        return jsonify({'status': 'error', 'message': 'Resume file not found. Please re-upload.'})

    try:
        resume_text = extract_text_from_pdf(filepath)
    except Exception as e:
        logging.error(f"PDF extraction error: {e}")
        return jsonify({'status': 'error', 'message': 'Failed to read PDF. Please upload a valid file.'})
    finally:
        # Clean up the uploaded file
        if os.path.exists(filepath):
            os.remove(filepath)

    if not resume_text.strip():
        return jsonify({'status': 'error', 'message': 'The PDF appears to be empty.'})

    job_description = form_data.get('job_description', '')
    clean_resume = clean_text(resume_text)
    clean_job = clean_text(job_description)

    resume_skills = skill_extractor.extract_skills(clean_resume)
    job_keywords = skill_extractor.extract_keywords(clean_job)

    ats_score = calculate_ats_score(resume_skills, job_keywords, resume_text)
    similarity = calculate_similarity(clean_resume, clean_job)

    matched_skills = [s for s in resume_skills if s in job_keywords]
    missing_skills = [s for s in job_keywords if s not in resume_skills]

    experience_score = score_experience(resume_text)
    education_score = score_education(resume_text)

    report = generate_report(
        resume_text=resume_text,
        job_text=job_description,
        resume_skills=resume_skills,
        job_keywords=job_keywords,
        ats_score=ats_score,
        similarity=similarity,
        experience_score=experience_score,
        education_score=education_score,
        matched_skills=matched_skills,
        missing_skills=missing_skills,
    )

    # Add user-provided info
    report['candidate_name'] = form_data.get('full_name', 'Candidate')
    report['target_company'] = form_data.get('target_company', 'Not specified')
    report['target_role'] = form_data.get('target_role', 'Not specified')
    report['analysis_date'] = 'July 19, 2026'

    # Store results in session
    session['analysis_results'] = report

    # Clear file reference
    session.pop('resume_filepath', None)
    session.pop('form_data', None)

    return jsonify({'status': 'success'})

@app.route('/results')
def results():
    """Display the analysis results."""
    results_data = session.get('analysis_results')
    if not results_data:
        flash('No analysis results found. Please run a new analysis.', 'warning')
        return redirect(url_for('wizard'))

    return render_template('results.html', **results_data)

if __name__ == '__main__':
    app.run(debug=True)