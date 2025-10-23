
// ATS Resume Scanner Pro - JavaScript
// Complete functionality for resume analysis and scoring

// Dynamic Analysis Libraries and Keywords
const STOP_WORDS = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such'];

const TECHNICAL_SKILLS = ['python', 'java', 'javascript', 'react', 'angular', 'vue', 'node', 'nodejs', 'sql', 'mongodb', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'linux', 'git', 'cicd', 'ci/cd', 'devops', 'agile', 'scrum', 'security', 'penetration testing', 'vulnerability', 'network', 'firewall', 'siem', 'nessus', 'metasploit', 'wireshark', 'kali', 'burp suite', 'owasp', 'api', 'rest', 'graphql', 'machine learning', 'data analysis', 'tableau', 'html', 'css', 'typescript', 'terraform', 'ansible', 'jenkins', 'threat detection', 'incident response', 'risk assessment', 'compliance', 'automation', 'scripting'];

const CERTIFICATIONS = ['ceh', 'cissp', 'security+', 'oscp', 'ccna', 'aws certified', 'azure certified', 'pmp', 'comptia', 'certified ethical hacker', 'pci-dss', 'gdpr', 'nist', 'iso 27001'];


// Helper function to escape special regex characters
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
const SOFT_SKILLS = ['leadership', 'communication', 'teamwork', 'problem solving', 'analytical', 'critical thinking', 'collaboration', 'management', 'organization'];

// Sample data for demo purposes
const SAMPLE_DATA = {
    resume: `John Doe
Full Stack Developer | Software Engineer
Email: john.doe@email.com | Phone: (555) 123-4567 | LinkedIn: linkedin.com/in/johndoe

PROFESSIONAL SUMMARY
Experienced Full Stack Developer with 4+ years of expertise in building scalable web applications. Proficient in React, Node.js, Python, and cloud technologies (AWS, Docker). Strong problem-solving skills with a track record of delivering high-quality software solutions.

TECHNICAL SKILLS
- Frontend: React, JavaScript, TypeScript, HTML5, CSS3, Redux
- Backend: Node.js, Express, Python, Django, RESTful APIs
- Databases: MongoDB, PostgreSQL, MySQL
- DevOps: Docker, Kubernetes, CI/CD, Jenkins, Git
- Cloud: AWS (EC2, S3, Lambda), Azure
- Tools: Git, GitHub, VS Code, Postman, Jira

PROFESSIONAL EXPERIENCE

Senior Software Engineer | Tech Solutions Inc | San Francisco, CA | Jan 2022 - Present
- Developed and maintained 10+ React-based web applications serving 50,000+ users
- Built RESTful APIs using Node.js and Express, improving response time by 40%
- Implemented CI/CD pipelines using Jenkins and Docker, reducing deployment time by 60%
- Collaborated with cross-functional teams in Agile/Scrum environment
- Mentored 3 junior developers on best coding practices

Software Developer | Digital Innovations LLC | Remote | Jun 2020 - Dec 2021
- Created responsive web interfaces using React and TypeScript
- Developed backend services with Python and Django framework
- Integrated third-party APIs and payment gateways
- Wrote unit tests achieving 85% code coverage
- Participated in code reviews and sprint planning

EDUCATION
Bachelor of Science in Computer Science | University of California | 2020
GPA: 3.8/4.0

CERTIFICATIONS
- AWS Certified Developer - Associate
- MongoDB Certified Developer

PROJECTS
- E-commerce Platform: Built full-stack application with React, Node.js, and MongoDB
- Task Management App: Developed real-time collaborative tool using WebSocket and Redis`,

    jobDescription: `Senior Full Stack Developer

We are seeking an experienced Full Stack Developer to join our engineering team. The ideal candidate will have strong expertise in modern web technologies and a passion for building scalable applications.

REQUIREMENTS:
- 3+ years of professional software development experience
- Strong proficiency in JavaScript, React, and Node.js
- Experience with TypeScript and modern frontend frameworks
- Backend development experience with RESTful APIs
- Database knowledge: MongoDB, PostgreSQL, or MySQL
- Experience with cloud platforms (AWS or Azure preferred)
- Familiarity with Docker, Kubernetes, and CI/CD practices
- Version control with Git and GitHub
- Understanding of Agile/Scrum methodologies
- Strong problem-solving and analytical skills
- Excellent communication and teamwork abilities
- Bachelor's degree in Computer Science or related field

PREFERRED QUALIFICATIONS:
- Experience with Python or Django
- AWS certification
- Experience with microservices architecture
- Knowledge of Redux for state management
- Familiarity with testing frameworks (Jest, Mocha)

KEY RESPONSIBILITIES:
- Design and develop responsive web applications
- Build and maintain RESTful APIs
- Implement CI/CD pipelines
- Collaborate with product and design teams
- Write clean, maintainable code
- Participate in code reviews
- Mentor junior developers

TECHNICAL STACK:
React, Node.js, TypeScript, Express, MongoDB, PostgreSQL, AWS, Docker, Kubernetes, Jenkins, Git, Redux, RESTful APIs`
};

// Dynamic Analysis Functions
function extractKeywords(text) {
    if (!text || typeof text !== 'string') return [];
    
    // Convert to lowercase and remove extra whitespace
    const cleanText = text.toLowerCase().replace(/\s+/g, ' ').trim();
    
    // Split into words and filter out stop words
    const words = cleanText.split(/[\s,.-]+/)
        .filter(word => word.length > 2 && !STOP_WORDS.includes(word));
    
    // Extract multi-word phrases (2-3 words)
    const phrases = [];
    for (let i = 0; i < words.length - 1; i++) {
        const twoWord = `${words[i]} ${words[i + 1]}`;
        const threeWord = i < words.length - 2 ? `${words[i]} ${words[i + 1]} ${words[i + 2]}` : null;
        
        if (TECHNICAL_SKILLS.includes(twoWord) || CERTIFICATIONS.includes(twoWord) || SOFT_SKILLS.includes(twoWord)) {
            phrases.push(twoWord);
        }
        if (threeWord && (TECHNICAL_SKILLS.includes(threeWord) || CERTIFICATIONS.includes(threeWord))) {
            phrases.push(threeWord);
        }
    }
    
    // Combine single words and phrases
    const allKeywords = [...new Set([...words, ...phrases])];
    
    // Filter to only include relevant keywords
    return allKeywords.filter(keyword => 
        TECHNICAL_SKILLS.includes(keyword) || 
        CERTIFICATIONS.includes(keyword) || 
        SOFT_SKILLS.includes(keyword) ||
        (keyword.length > 3 && !STOP_WORDS.includes(keyword))
    );
}

function categorizeKeywords(keywords) {
    return {
        technical: keywords.filter(k => TECHNICAL_SKILLS.includes(k.toLowerCase())),
        certifications: keywords.filter(k => CERTIFICATIONS.includes(k.toLowerCase())),
        soft: keywords.filter(k => SOFT_SKILLS.includes(k.toLowerCase())),
        other: keywords.filter(k => 
            !TECHNICAL_SKILLS.includes(k.toLowerCase()) &&
            !CERTIFICATIONS.includes(k.toLowerCase()) &&
            !SOFT_SKILLS.includes(k.toLowerCase())
        )
    };
}

function calculateKeywordMatch(resumeKeywords, jdKeywords) {
    const matchedKeywords = resumeKeywords.filter(keyword => 
        jdKeywords.some(jdKeyword => 
            keyword.toLowerCase() === jdKeyword.toLowerCase() ||
            keyword.toLowerCase().includes(jdKeyword.toLowerCase()) ||
            jdKeyword.toLowerCase().includes(keyword.toLowerCase())
        )
    );
    
    return {
        matched: [...new Set(matchedKeywords)],
        total: jdKeywords.length,
        percentage: jdKeywords.length > 0 ? (matchedKeywords.length / jdKeywords.length) * 100 : 0
    };
}

function extractExperienceYears(text) {
    if (!text) return 0;
    
    const yearPatterns = [
        /(\d+)\+?\s*years?/gi,
        /(\d+)\s*-\s*(\d+)\s*years?/gi,
        /\b(\d{4})\s*-\s*(present|current|\d{4})/gi
    ];
    
    let maxYears = 0;
    
    yearPatterns.forEach(pattern => {
        const matches = text.match(pattern);
        if (matches) {
            matches.forEach(match => {
                const numbers = match.match(/\d+/g);
                if (numbers) {
                    if (match.includes('present') || match.includes('current')) {
                        const startYear = parseInt(numbers[0]);
                        const currentYear = new Date().getFullYear();
                        const experience = currentYear - startYear;
                        maxYears = Math.max(maxYears, experience);
                    } else {
                        const years = Math.max(...numbers.map(n => parseInt(n)));
                        maxYears = Math.max(maxYears, years);
                    }
                }
            });
        }
    });
    
    return maxYears;
}

function checkFormattingScore(resumeText) {
    let score = 0;
    
    // Check for standard sections
    const sections = {
        experience: /(experience|work history|employment)/i,
        skills: /(skills|technical skills|competencies)/i,
        education: /(education|qualifications|academic)/i,
        contact: /(@|phone|email|linkedin)/i
    };
    
    Object.values(sections).forEach(pattern => {
        if (pattern.test(resumeText)) score += 2.5;
    });
    
    return Math.min(score, 10);
}

function checkEducationScore(resumeText) {
    const educationKeywords = [
        'bachelor', 'master', 'phd', 'degree', 'university', 
        'college', 'graduate', 'diploma', 'certification'
    ];
    
    const hasEducation = educationKeywords.some(keyword => 
        resumeText.toLowerCase().includes(keyword)
    );
    
    return hasEducation ? 10 : 5;
}

function generateOptimizedSummary(resumeText, matchedKeywords, missingKeywords) {
    const skills = matchedKeywords.technical.slice(0, 3).join(', ');
    const tools = matchedKeywords.other.slice(0, 2).join(', ');
    const experience = extractExperienceYears(resumeText);
    
    let summary = `Professional with ${experience}+ years of experience`;
    
    if (skills) {
        summary += ` in ${skills}`;
    }
    
    if (tools) {
        summary += `. Skilled in ${tools}`;
    }
    
    if (matchedKeywords.soft.length > 0) {
        summary += ` with strong ${matchedKeywords.soft.slice(0, 2).join(' and ')} skills`;
    }
    
    if (missingKeywords.high.length > 0) {
        summary += `. Looking to expand expertise in ${missingKeywords.high.slice(0, 2).join(' and ')}`;
    }
    
    summary += '. Proven track record of delivering results and collaborating effectively in dynamic environments.';
    
    return summary;
}

function generateDynamicFeedback(scores, missingKeywords) {
    const feedback = {
        formatting: [],
        experience: [],
        skills: [],
        summary: []
    };
    
    // Formatting feedback
    if (scores.formatting >= 8) {
        feedback.formatting.push('✓ Resume structure is ATS-friendly with clear sections');
        feedback.formatting.push('✓ Good use of standard section headers');
    } else {
        feedback.formatting.push('⚠ Add clear section headers: Experience, Skills, Education');
        feedback.formatting.push('⚠ Ensure contact information is prominently displayed');
    }
    
    // Experience feedback
    if (scores.experienceMatch < 15) {
        feedback.experience.push('Add specific years of experience in your summary');
        feedback.experience.push('Use action verbs to describe your accomplishments');
        feedback.experience.push('Include quantifiable achievements with numbers and percentages');
    } else {
        feedback.experience.push('✓ Experience section aligns well with job requirements');
    }
    
    // Skills feedback
    if (missingKeywords.high.length > 0) {
        feedback.skills.push(`Add high-priority skills: ${missingKeywords.high.slice(0, 3).join(', ')}`);
    }
    if (missingKeywords.medium.length > 0) {
        feedback.skills.push(`Consider adding: ${missingKeywords.medium.slice(0, 2).join(', ')}`);
    }
    if (scores.skillsRelevance >= 20) {
        feedback.skills.push('✓ Strong technical skills alignment with job requirements');
    }
    
    // Summary feedback
    feedback.summary.push('Incorporate more keywords from the job description');
    feedback.summary.push('Highlight your most relevant achievements upfront');
    if (missingKeywords.high.length > 0) {
        feedback.summary.push(`Emphasize experience with: ${missingKeywords.high[0]}`);
    }
    
    return feedback;
}

// Global State
let currentTheme = 'light';
let analysisResults = null;

// DOM Elements
const elements = {
    // Header
    themeToggle: document.getElementById('themeToggle'),
    newScanBtn: document.getElementById('newScanBtn'),
    
    // Pages
    homePage: document.getElementById('homePage'),
    resultsPage: document.getElementById('resultsPage'),
    
    // Input Section
    resumeTextarea: document.getElementById('resumeTextarea'),
    resumeCharCounter: document.getElementById('resumeCharCounter'),
    jobDescription: document.getElementById('jobDescription'),
    charCounter: document.getElementById('charCounter'),
    analyzeBtn: document.getElementById('analyzeBtn'),
    exampleBtn: document.getElementById('exampleBtn'),
    
    // Loading
    loadingOverlay: document.getElementById('loadingOverlay'),
    loadingStep: document.getElementById('loadingStep'),
    progressBar: document.getElementById('progressBar'),
    
    // Score Section
    scoreGauge: document.getElementById('scoreGauge'),
    gaugeFill: document.getElementById('gaugeFill'),
    gaugeScore: document.getElementById('gaugeScore'),
    statusBadge: document.getElementById('statusBadge'),
    keywordMatch: document.getElementById('keywordMatch'),
    skillsMatch: document.getElementById('skillsMatch'),
    
    // Results Content
    resumeContent: document.getElementById('resumeContent'),
    
    // Tab System
    tabBtns: document.querySelectorAll('.tab-btn'),
    tabPanes: document.querySelectorAll('.tab-pane'),
    
    // Score Breakdown
    keywordScore: document.getElementById('keywordScore'),
    skillsScore: document.getElementById('skillsScore'),
    experienceScore: document.getElementById('experienceScore'),
    formatScore: document.getElementById('formatScore'),
    educationScore: document.getElementById('educationScore'),
    
    // Keywords
    matchedCount: document.getElementById('matchedCount'),
    matchedTechnical: document.getElementById('matchedTechnical'),
    matchedTools: document.getElementById('matchedTools'),
    matchedSoft: document.getElementById('matchedSoft'),
    matchedCerts: document.getElementById('matchedCerts'),
    missingCount: document.getElementById('missingCount'),
    missingHigh: document.getElementById('missingHigh'),
    missingMedium: document.getElementById('missingMedium'),
    missingLow: document.getElementById('missingLow'),
    
    // Feedback
    feedbackSections: document.getElementById('feedbackSections'),
    
    // Summary
    summaryContent: document.getElementById('summaryContent'),
    copyBtn: document.getElementById('copyBtn'),
    summaryCharCount: document.getElementById('summaryCharCount'),
    
    // Action Buttons
    downloadBtn: document.getElementById('downloadBtn'),
    newAnalysisBtn: document.getElementById('newAnalysisBtn'),
    shareBtn: document.getElementById('shareBtn'),
    
    // Modal & Toast
    modal: document.getElementById('modal'),
    modalTitle: document.getElementById('modalTitle'),
    modalMessage: document.getElementById('modalMessage'),
    modalClose: document.getElementById('modalClose'),
    modalBackdrop: document.getElementById('modalBackdrop'),
    modalOk: document.getElementById('modalOk'),
    toast: document.getElementById('toast'),
    toastIcon: document.getElementById('toastIcon'),
    toastMessage: document.getElementById('toastMessage')
};

// Initialize Application
function init() {
    // Load sample data
    loadSampleData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize theme
    initializeTheme();
    
    // Check input status
    checkInputStatus();
    
    console.log('🚀 ATS Resume Scanner Pro initialized successfully!');
}

// Load Sample Data
function loadSampleData() {
    // Initially clear both fields
    elements.resumeTextarea.value = '';
    elements.jobDescription.value = '';
    updateCharCounters();
}

function loadExampleData() {
    elements.resumeTextarea.value = SAMPLE_DATA.resume;
    elements.jobDescription.value = SAMPLE_DATA.jobDescription;
    updateCharCounters();
    checkInputStatus();
    showToast('✅', 'Example resume & job description loaded successfully!');
}

// Setup Event Listeners
function setupEventListeners() {
    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);
    
    // Navigation
    elements.newScanBtn.addEventListener('click', goHome);
    elements.newAnalysisBtn.addEventListener('click', goHome);
    
    // Resume textarea
    elements.resumeTextarea.addEventListener('input', handleResumeTextareaChange);
    
    // Example button
    elements.exampleBtn.addEventListener('click', loadExampleData);
    
    // Job description
    elements.jobDescription.addEventListener('input', handleJobDescriptionChange);
    
    // Analyze button
    elements.analyzeBtn.addEventListener('click', analyzeResume);
    
    // Tabs
    elements.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // Copy button
    elements.copyBtn.addEventListener('click', copyToClipboard);
    
    // Action buttons
    elements.downloadBtn.addEventListener('click', () => showModal('Download Report', 'PDF download feature is coming soon! Stay tuned for updates.'));
    elements.shareBtn.addEventListener('click', () => showModal('Share Results', 'Share functionality is coming soon! You\'ll be able to share your analysis results.'));
    
    // Modal
    elements.modalClose.addEventListener('click', hideModal);
    elements.modalBackdrop.addEventListener('click', hideModal);
    elements.modalOk.addEventListener('click', hideModal);
    
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// Theme Management
function initializeTheme() {
    const savedTheme = 'light'; // Default to light theme
    setTheme(savedTheme);
}

function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    
    const themeIcon = elements.themeToggle.querySelector('.theme-icon');
    themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    
    // Theme preference is maintained in memory during session
    console.log(`Theme changed to: ${theme}`);
}

// Text Input Validation
function validateInput(text, minLength = 100) {
    return text && text.trim().length >= minLength;
}

function getInputValidationMessage(resumeText, jdText) {
    if (!resumeText || resumeText.length < 100) {
        return 'Please enter at least 100 characters for resume text';
    }
    if (!jdText || jdText.length < 100) {
        return 'Please enter at least 100 characters for job description';
    }
    return null;
}

// Input Management
function handleResumeTextareaChange() {
    updateCharCounters();
    checkInputStatus();
}

function handleJobDescriptionChange() {
    updateCharCounters();
    checkInputStatus();
}

function updateCharCounters() {
    const resumeText = elements.resumeTextarea.value;
    const jdText = elements.jobDescription.value;
    
    elements.resumeCharCounter.textContent = `${resumeText.length} characters`;
    elements.charCounter.textContent = `${jdText.length} characters`;
}

// Input Status Check
function checkInputStatus() {
    const hasResumeText = elements.resumeTextarea.value.trim().length >= 100;
    const hasJobDescription = elements.jobDescription.value.trim().length >= 100;
    
    elements.analyzeBtn.disabled = !(hasResumeText && hasJobDescription);
    
    // Update button text based on validation
    const btnText = elements.analyzeBtn.querySelector('.btn-text');
    if (!hasResumeText || !hasJobDescription) {
        btnText.textContent = 'Please enter at least 100 characters in each field';
        elements.analyzeBtn.classList.add('btn-disabled');
    } else {
        btnText.textContent = 'Analyze My Resume Now';
        elements.analyzeBtn.classList.remove('btn-disabled');
    }
}

// Resume Analysis
async function analyzeResume() {
    const resumeText = elements.resumeTextarea.value.trim();
    const jdText = elements.jobDescription.value.trim();
    
    if (resumeText.length < 100 || jdText.length < 100) {
        showToast('❌', 'Please enter at least 100 characters in each field.', 'error');
        return;
    }
    
    // Show loading overlay
    showLoadingOverlay();
    
    // Simulate analysis process
    await simulateAnalysis();
    
    // Generate results
    analysisResults = generateAnalysisResults();
    
    // Hide loading and show results
    hideLoadingOverlay();
    showResultsPage();
}

function showLoadingOverlay() {
    elements.loadingOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function hideLoadingOverlay() {
    elements.loadingOverlay.style.display = 'none';
    document.body.style.overflow = 'auto';
}

async function simulateAnalysis() {
    const steps = [
        { text: 'Parsing resume content...', progress: 20 },
        { text: 'Extracting keywords from job description...', progress: 40 },
        { text: 'Analyzing keyword matches...', progress: 60 },
        { text: 'Calculating ATS compatibility score...', progress: 80 },
        { text: 'Generating optimization suggestions...', progress: 100 }
    ];
    
    for (const step of steps) {
        elements.loadingStep.textContent = step.text;
        elements.progressBar.style.width = `${step.progress}%`;
        await sleep(800); // Simulate processing time
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Results Generation - REAL DYNAMIC ANALYSIS
function generateAnalysisResults() {
    const resumeText = elements.resumeTextarea.value;
    const jobDescriptionText = elements.jobDescription.value;
    
    // Extract keywords from both texts
    const resumeKeywords = extractKeywords(resumeText);
    const jdKeywords = extractKeywords(jobDescriptionText);
    
    // Calculate keyword matching
    const keywordMatch = calculateKeywordMatch(resumeKeywords, jdKeywords);
    
    // Categorize keywords for display
    const categorizedResume = categorizeKeywords(resumeKeywords);
    const categorizedJD = categorizeKeywords(jdKeywords);
    
    // Find matched and missing keywords
    const matchedKeywords = {
        technical: categorizedResume.technical.filter(skill => 
            categorizedJD.technical.some(jdSkill => 
                skill.toLowerCase() === jdSkill.toLowerCase()
            )
        ),
        certifications: categorizedResume.certifications.filter(cert => 
            categorizedJD.certifications.some(jdCert => 
                cert.toLowerCase() === jdCert.toLowerCase()
            )
        ),
        soft: categorizedResume.soft.filter(skill => 
            categorizedJD.soft.some(jdSkill => 
                skill.toLowerCase() === jdSkill.toLowerCase()
            )
        ),
        other: categorizedResume.other.filter(keyword => 
            categorizedJD.other.some(jdKeyword => 
                keyword.toLowerCase() === jdKeyword.toLowerCase()
            )
        )
    };
    
    // Find missing keywords with priority
    const missingTechnical = categorizedJD.technical.filter(skill => 
        !categorizedResume.technical.some(resumeSkill => 
            resumeSkill.toLowerCase() === skill.toLowerCase()
        )
    );
    
    const missingCerts = categorizedJD.certifications.filter(cert => 
        !categorizedResume.certifications.some(resumeCert => 
            resumeCert.toLowerCase() === cert.toLowerCase()
        )
    );
    
    const missingOther = categorizedJD.other.filter(keyword => 
        !categorizedResume.other.some(resumeKeyword => 
            resumeKeyword.toLowerCase() === keyword.toLowerCase()
        )
    );
    
    // Prioritize missing keywords (simplified)
    const allMissing = [...missingTechnical, ...missingCerts, ...missingOther];
    const missingKeywords = {
        high: allMissing.slice(0, Math.ceil(allMissing.length * 0.4)),
        medium: allMissing.slice(Math.ceil(allMissing.length * 0.4), Math.ceil(allMissing.length * 0.7)),
        low: allMissing.slice(Math.ceil(allMissing.length * 0.7))
    };
    
    // Calculate scores dynamically
    const totalJDKeywords = jdKeywords.length || 1;
    const totalMatchedKeywords = Object.values(matchedKeywords).flat().length;
    
    const scores = {
        keywordMatch: Math.min((totalMatchedKeywords / totalJDKeywords) * 35, 35),
        skillsRelevance: Math.min((matchedKeywords.technical.length / Math.max(categorizedJD.technical.length, 1)) * 25, 25),
        experienceMatch: calculateExperienceScore(resumeText, jobDescriptionText),
        formatting: checkFormattingScore(resumeText),
        education: checkEducationScore(resumeText)
    };
    
    scores.total = scores.keywordMatch + scores.skillsRelevance + scores.experienceMatch + scores.formatting + scores.education;
    
    // Generate dynamic summary and feedback
    const optimizedSummary = generateOptimizedSummary(resumeText, matchedKeywords, missingKeywords);
    const feedback = generateDynamicFeedback(scores, missingKeywords);
    
    return {
        score: Math.round(scores.total),
        rating: getScoreRating(scores.total),
        color: getScoreColor(scores.total),
        breakdown: scores,
        matchedKeywords: matchedKeywords,
        missingKeywords: missingKeywords,
        summary: optimizedSummary,
        feedback: feedback,
        resumeContent: resumeText
    };
}

function calculateExperienceScore(resumeText, jobDescriptionText) {
    const resumeExperience = extractExperienceYears(resumeText);
    const requiredExperience = extractExperienceYears(jobDescriptionText);
    
    if (requiredExperience === 0) return 15; // Default if can't determine requirement
    
    if (resumeExperience >= requiredExperience) return 20;
    if (resumeExperience >= requiredExperience - 1) return 15;
    return 10;
}

function getScoreRating(score) {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    return 'Needs Work';
}

function getScoreColor(score) {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
}

// Results Page Display
function showResultsPage() {
    try {
        // Hide home page, show results page
        elements.homePage.style.display = 'none';
        elements.resultsPage.style.display = 'block';
        elements.newScanBtn.style.display = 'inline-flex';
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        // Check if analysisResults exists
        if (!analysisResults) {
            console.error('analysisResults is null or undefined');
            showToast('❌', 'Analysis failed. Please try again.', 'error');
            return;
        }
        
        // Populate results
        populateScoreSection();
        populateResumePreview();
        populateScoreBreakdown();
        populateKeywords();
        populateFeedback();
        populateSummary();
        
        // Animate score gauge
        setTimeout(() => {
            animateScoreGauge();
        }, 500);
    } catch (error) {
        console.error('Error showing results page:', error);
        showToast('❌', 'Error displaying results. Please try again.', 'error');
    }
}

function populateScoreSection() {
    // Update score gauge immediately
    elements.gaugeScore.textContent = analysisResults.score;
    elements.gaugeFill.style.stroke = analysisResults.color;
    
    // Update status badge
    elements.statusBadge.textContent = analysisResults.rating;
    elements.statusBadge.style.background = `${analysisResults.color}20`;
    elements.statusBadge.style.color = analysisResults.color;
    elements.statusBadge.style.borderColor = `${analysisResults.color}50`;
    
    // Update match stats
    const totalMatched = Object.values(analysisResults.matchedKeywords).flat().length;
    const totalMissing = Object.values(analysisResults.missingKeywords).flat().length;
    const totalKeywords = totalMatched + totalMissing;
    
    elements.keywordMatch.textContent = `${totalMatched}/${totalKeywords}`;
    elements.skillsMatch.textContent = `${analysisResults.matchedKeywords.technical.length}/10`;
}

function animateScoreGauge() {
    const score = analysisResults.score;
    
    // Update the score text immediately
    elements.gaugeScore.textContent = score;
    
    // Animate the gauge fill
    const circumference = 2 * Math.PI * 80; // radius = 80
    const offset = circumference - (score / 100) * circumference;
    
    // Update gauge fill
    elements.gaugeFill.style.strokeDashoffset = offset;
    elements.gaugeFill.style.stroke = analysisResults.color;
    
    // Animate score counter (optional visual effect)
    animateCounter(elements.gaugeScore, 0, score, 1500);
}

function animateCounter(element, start, end, duration) {
    const startTime = Date.now();
    const startValue = start;
    const endValue = end;
    
    function updateCounter() {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.round(startValue + (endValue - startValue) * easeOutQuart);
        
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    updateCounter();
}

function populateResumePreview() {
    let content = analysisResults.resumeContent;
    
    // Highlight matched keywords
    const allMatched = Object.values(analysisResults.matchedKeywords).flat();
    allMatched.forEach(keyword => {
        const escapedKeyword = escapeRegex(keyword);
        const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'gi');
        content = content.replace(regex, `<span class="keyword-highlight">${keyword}</span>`);
    });
    
    elements.resumeContent.innerHTML = content;
}

function populateScoreBreakdown() {
    const scores = analysisResults.breakdown;
    
    elements.keywordScore.textContent = `${Math.round(scores.keywordMatch)}/35`;
    elements.skillsScore.textContent = `${Math.round(scores.skillsRelevance)}/25`;
    elements.experienceScore.textContent = `${Math.round(scores.experienceMatch)}/20`;
    elements.formatScore.textContent = `${Math.round(scores.formatting)}/10`;
    elements.educationScore.textContent = `${Math.round(scores.education)}/10`;
    
    // Update progress bars
    setTimeout(() => {
        const bars = document.querySelectorAll('.bar-fill');
        bars[0].style.width = `${(scores.keywordMatch / 35) * 100}%`;
        bars[1].style.width = `${(scores.skillsRelevance / 25) * 100}%`;
        bars[2].style.width = `${(scores.experienceMatch / 20) * 100}%`;
        bars[3].style.width = `${(scores.formatting / 10) * 100}%`;
        bars[4].style.width = `${(scores.education / 10) * 100}%`;
    }, 1000);
}

function populateKeywords() {
    const matched = analysisResults.matchedKeywords;
    const missing = analysisResults.missingKeywords;
    
    // Matched keywords
    elements.matchedTechnical.innerHTML = createKeywordTags(matched.technical, 'matched');
    elements.matchedTools.innerHTML = createKeywordTags(matched.other, 'matched');
    elements.matchedSoft.innerHTML = createKeywordTags(matched.soft, 'matched');
    elements.matchedCerts.innerHTML = createKeywordTags(matched.certifications, 'matched');
    
    const totalMatched = Object.values(matched).flat().length;
    elements.matchedCount.textContent = `(${totalMatched} found)`;
    
    // Missing keywords
    elements.missingHigh.innerHTML = createKeywordTags(missing.high, 'missing');
    elements.missingMedium.innerHTML = createKeywordTags(missing.medium, 'missing-medium');
    elements.missingLow.innerHTML = createKeywordTags(missing.low, 'missing');
    
    const totalMissing = Object.values(missing).flat().length;
    elements.missingCount.textContent = `(${totalMissing} missing)`;
}

function createKeywordTags(keywords, className) {
    return keywords.map(keyword => 
        `<span class="keyword-tag ${className}">${keyword}</span>`
    ).join('');
}

function populateFeedback() {
    const feedback = analysisResults.feedback;
    
    const sections = [
        { title: '📄 Formatting Analysis', items: feedback.formatting, icon: '▼' },
        { title: '💼 Experience Enhancement', items: feedback.experience, icon: '▼' },
        { title: '🔧 Skills Optimization', items: feedback.skills, icon: '▼' },
        { title: '📝 Summary Improvement', items: feedback.summary, icon: '▼' }
    ];
    
    elements.feedbackSections.innerHTML = sections.map((section, index) => `
        <div class="feedback-section" data-section="${index}">
            <div class="feedback-header">
                <h5 class="feedback-title">${section.title}</h5>
                <span class="feedback-icon">${section.icon}</span>
            </div>
            <div class="feedback-content">
                <ul class="feedback-list">
                    ${section.items.map(item => `<li class="feedback-item">${item}</li>`).join('')}
                </ul>
            </div>
        </div>
    `).join('');
    
    // Add click handlers for accordion
    elements.feedbackSections.querySelectorAll('.feedback-header').forEach(header => {
        header.addEventListener('click', () => {
            const section = header.parentElement;
            section.classList.toggle('expanded');
        });
    });
}

function populateSummary() {
    elements.summaryContent.textContent = analysisResults.summary;
    elements.summaryCharCount.textContent = `${analysisResults.summary.length} characters`;
}

// Tab Management
function switchTab(tabName) {
    // Update tab buttons
    elements.tabBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });
    
    // Update tab panes
    elements.tabPanes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === tabName) {
            pane.classList.add('active');
        }
    });
}

// Copy to Clipboard
async function copyToClipboard() {
    try {
        await navigator.clipboard.writeText(analysisResults.summary);
        
        // Show success state
        const copyText = elements.copyBtn.querySelector('.copy-text');
        const copySuccess = elements.copyBtn.querySelector('.copy-success');
        
        copyText.style.display = 'none';
        copySuccess.style.display = 'inline';
        
        setTimeout(() => {
            copyText.style.display = 'inline';
            copySuccess.style.display = 'none';
        }, 2000);
        
        showToast('📋', 'Summary copied to clipboard!');
    } catch (err) {
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = analysisResults.summary;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        showToast('📋', 'Summary copied to clipboard!');
    }
}

// Navigation
function goHome() {
    elements.resultsPage.style.display = 'none';
    elements.homePage.style.display = 'block';
    elements.newScanBtn.style.display = 'none';
    
    // Clear inputs if desired
    // elements.resumeTextarea.value = '';
    // elements.jobDescription.value = '';
    // updateCharCounters();
    // checkInputStatus();
    
    // Scroll to upload section
    setTimeout(() => {
        document.getElementById('uploadSection').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

// Modal Management
function showModal(title, message) {
    elements.modalTitle.textContent = title;
    elements.modalMessage.textContent = message;
    elements.modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function hideModal() {
    elements.modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Toast Notifications
function showToast(icon, message, type = 'success') {
    elements.toastIcon.textContent = icon;
    elements.toastMessage.textContent = message;
    
    // Update toast color based on type
    const toastContent = elements.toast.querySelector('.toast-content');
    if (type === 'error') {
        toastContent.style.background = '#ef4444';
    } else {
        toastContent.style.background = '#10b981';
    }
    
    elements.toast.style.display = 'block';
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        elements.toast.style.display = 'none';
    }, 3000);
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth Scrolling for Internal Links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Intersection Observer for Animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, observerOptions);
    
    // Observe feature cards and other elements
    document.querySelectorAll('.feature-card, .step, .upload-card').forEach(el => {
        observer.observe(el);
    });
}

// Error Handling
window.addEventListener('error', (e) => {
    console.error('Application Error:', e.error);
    showToast('❌', 'An error occurred. Please try again.', 'error');
});

// Responsive Design Helpers
function handleResize() {
    // Adjust layout for mobile devices
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
        // Mobile-specific adjustments
        document.querySelectorAll('.btn-lg').forEach(btn => {
            btn.classList.add('btn-full-width');
        });
    } else {
        // Desktop-specific adjustments
        document.querySelectorAll('.btn-lg').forEach(btn => {
            btn.classList.remove('btn-full-width');
        });
    }
}

window.addEventListener('resize', debounce(handleResize, 250));

// Keyboard Accessibility
document.addEventListener('keydown', (e) => {
    // ESC key to close modal
    if (e.key === 'Escape' && elements.modal.style.display === 'flex') {
        hideModal();
    }
    
    // Enter key on analyze button
    if (e.key === 'Enter' && document.activeElement === elements.analyzeBtn && !elements.analyzeBtn.disabled) {
        analyzeResume();
    }
});

// Performance Optimization
function preloadImages() {
    // Preload any critical images if needed
    // This is a placeholder for future image preloading
}

// Analytics (placeholder)
function trackEvent(action, category = 'User Interaction') {
    // Placeholder for analytics tracking
    console.log(`Analytics: ${category} - ${action}`);
}

// Initialize application when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Additional CSS animation for fade in effect
const fadeInUpKeyframes = `
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;

// Inject animation CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = fadeInUpKeyframes;
document.head.appendChild(styleSheet);

// Export functions for potential external use
window.ATSScanner = {
    init,
    analyzeResume,
    setTheme,
    showToast
};

console.log('🎯 ATS Resume Scanner Pro - Ready to help you land your dream job!');