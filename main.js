// Enhanced LeadHub JavaScript with Professional Assessment System
console.log('🚀 LeadHub Professional loaded successfully!');

// Assessment Data
const assessmentData = {
    'leadership-style': {
        title: 'Leadership Style Assessment',
        description: 'Discover your natural leadership style and learn how to adapt it to different situations.',
        questions: [
            {
                question: 'When faced with a team conflict, I typically...',
                options: [
                    'Facilitate open discussion among team members',
                    'Make a decisive decision based on the facts',
                    'Seek consensus through collaborative discussion',
                    'Delegate resolution to the most relevant team members'
                ],
                category: 'Conflict Resolution'
            },
            {
                question: 'In team meetings, my primary role is usually...',
                options: [
                    'Encouraging participation from everyone',
                    'Driving toward clear decisions and actions',
                    'Building alignment and shared understanding',
                    'Providing expertise and guidance'
                ],
                category: 'Meeting Leadership'
            },
            {
                question: 'When setting team goals, I prefer to...',
                options: [
                    'Involve the team in collaborative goal-setting',
                    'Set clear, ambitious targets based on data',
                    'Build consensus around shared objectives',
                    'Leverage team expertise to define realistic goals'
                ],
                category: 'Goal Setting'
            },
            {
                question: 'My approach to giving feedback is...',
                options: [
                    'Supportive and focused on development',
                    'Direct and focused on performance improvement',
                    'Collaborative and discussion-based',
                    'Expert-driven with specific recommendations'
                ],
                category: 'Feedback Style'
            },
            {
                question: 'When the team faces uncertainty, I...',
                options: [
                    'Focus on maintaining team morale and confidence',
                    'Create clear plans and decisive direction',
                    'Facilitate discussion to build shared understanding',
                    'Provide expert analysis and recommendations'
                ],
                category: 'Crisis Management'
            }
        ]
    },
    'eq-quiz': {
        title: 'Emotional Intelligence Self-Assessment',
        description: 'Measure your emotional intelligence across self-awareness, empathy, and social skills.',
        questions: [
            {
                question: 'When a team member is visibly upset, I usually...',
                options: [
                    'Give them space and time to process emotions',
                    'Offer practical solutions to address the issue',
                    'Listen empathetically and validate their feelings',
                    'Help them refocus on positive aspects'
                ],
                category: 'Empathy'
            },
            {
                question: 'When I receive critical feedback, my first reaction is...',
                options: [
                    'Reflect on it privately before responding',
                    'Analyze the facts and data behind the feedback',
                    'Seek to understand the perspective behind it',
                    'Consider how to immediately implement improvements'
                ],
                category: 'Self-Awareness'
            },
            {
                question: 'In stressful situations, I typically...',
                options: [
                    'Remain calm and maintain perspective',
                    'Focus on actionable steps and solutions',
                    'Check in with how others are feeling',
                    'Rely on established processes and expertise'
                ],
                category: 'Self-Regulation'
            },
            {
                question: 'When building relationships with new team members, I...',
                options: [
                    'Take time to understand their background and interests',
                    'Establish clear expectations and working styles',
                    'Find common ground and shared interests',
                    'Share relevant expertise and knowledge'
                ],
                category: 'Social Skills'
            }
        ]
    },
    'communication-test': {
        title: 'Communication Effectiveness Assessment',
        description: 'Evaluate your communication skills and identify areas for improvement.',
        questions: [
            {
                question: 'In important presentations, I focus on...',
                options: [
                    'Engaging the audience with stories and examples',
                    'Delivering clear, data-driven messages',
                    'Building connection and rapport with listeners',
                    'Providing comprehensive, detailed information'
                ],
                category: 'Presentation Style'
            },
            {
                question: 'When explaining complex ideas, I typically...',
                options: [
                    'Use analogies and relatable examples',
                    'Break down information into logical steps',
                    'Check frequently for understanding',
                    'Provide detailed documentation and references'
                ],
                category: 'Explanation Style'
            },
            {
                question: 'My approach to active listening involves...',
                options: [
                    'Maintaining eye contact and positive body language',
                    'Taking notes and asking clarifying questions',
                    'Paraphrasing to confirm understanding',
                    'Providing relevant insights and connections'
                ],
                category: 'Listening Skills'
            },
            {
                question: 'When communicating with different personality types, I...',
                options: [
                    'Adapt my style to match their preferences',
                    'Stick to clear, factual communication',
                    'Focus on building personal connection',
                    'Provide detailed, thorough information'
                ],
                category: 'Adaptability'
            }
        ]
    }
};

// Assessment State
let currentAssessment = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let assessmentResults = {};

// Enhanced Course Data
const courseData = {
    'leadership-fundamentals': 'Leadership Fundamentals',
    'strategic-communication': 'Strategic Communication', 
    'emotional-intelligence': 'Emotional Intelligence',
    'team-leadership': 'Team Leadership Dynamics',
    'strategic-decision-making': 'Strategic Decision Making',
    'conflict-resolution': 'Conflict Resolution',
    'public-speaking': 'Public Speaking Excellence',
    'time-management': 'Strategic Time Management',
    'change-leadership': 'Leading Organizational Change',
    'mentoring': 'Leadership Mentoring & Coaching',
    'innovation': 'Leading Innovation & Creativity',
    'ethics': 'Ethical Leadership & Decision Making'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM loaded - initializing LeadHub Professional');
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    checkAuthentication();
    initializeProgress();
    // Check backend availability (if a server is running)
    if (window.location.protocol.indexOf('http') === 0) {
        checkServer();
    }
    // Load courses from backend to populate the courses grid
    loadCourses();
}

// Load courses from backend and render into .courses-grid
function loadCourses() {
    fetch('/api/courses')
        .then(res => res.json())
        .then(courses => {
            const grid = document.querySelector('.courses-grid');
            if (!grid) return;

            // Render simple course cards
            grid.innerHTML = courses.map(course => `
                <div class="course-card">
                    <div class="course-header">
                        <div class="course-icon">👑</div>
                        <span class="course-badge beginner">Core</span>
                    </div>
                    <h3>${escapeHtml(course.title)}</h3>
                    <p>${escapeHtml(course.description || '')}</p>
                    <div class="course-meta">
                        <span><i class="fas fa-clock"></i> ${escapeHtml(course.duration || '')}</span>
                    </div>
                    <div class="course-progress">
                        <div class="progress-bar">
                            <div class="progress" style="width: 0%"></div>
                        </div>
                        <span>Not started</span>
                    </div>
                    <button class="course-btn" onclick="startCourse('${course.id}')">
                        <i class="fas fa-play"></i>
                        Start Learning
                    </button>
                </div>
            `).join('');

            // Update any progress bars from local progress store
            updateCourseProgressBars();
        })
        .catch(err => {
            console.warn('Failed to load courses:', err);
            showNotification('Unable to load courses from backend', 'error');
        });
}

// Small helper to escape HTML when injecting content
function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"'`]/g, s => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '`': '&#96;'
    }[s]));
}

// Enhanced setupEventListeners
function setupEventListeners() {
    // Mobile Menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Navigation
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Forms
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Enhanced modal close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeVideoModal();
            closeAssessmentModal();
        }
    });
    
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.id === 'videoModal') {
            closeVideoModal();
        }
        if (e.target.id === 'assessmentModal') {
            closeAssessmentModal();
        }
    });
}

// Enhanced Navigation Handler
function handleNavigation(e) {
    if (this.id === 'logoutBtn') return;
    
    e.preventDefault();
    const href = this.getAttribute('href');
    
    if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        showSection(targetId);
    }
    
    // Close mobile menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
}

// Enhanced showSection function
function showSection(sectionId) {
    console.log('🔄 Switching to section:', sectionId);
    
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        console.log('✅ Section shown:', sectionId);
    }
    
    // Check authentication for protected sections
    const protectedSections = ['home', 'about', 'courses', 'challenges', 'progress'];
    if (protectedSections.includes(sectionId) && !localStorage.getItem('userName')) {
        console.log('🔐 User not logged in, redirecting to login');
        showSection('login');
        return;
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Update progress when showing progress section
    if (sectionId === 'progress') {
        updateProgressDisplay();
    }
}

// AUTHENTICATION FUNCTIONS - IMPLEMENTED
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    // Attempt login via backend
    showNotification('Logging in...', 'info');
    fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json().then(body => ({ ok: res.ok, body })))
    .then(({ ok, body }) => {
        if (!ok) {
            showNotification(body.error || 'Login failed', 'error');
            return;
        }
        const user = body.user || {};
        localStorage.setItem('authToken', body.token || 'demo-token');
        localStorage.setItem('userName', user.name || (user.email || email).split('@')[0]);
        localStorage.setItem('userEmail', user.email || email);
        showNotification('Welcome back! 🎉', 'success');
        showSection('home');
    })
    .catch(err => {
        showNotification('Network error: ' + err.message, 'error');
    });
}

function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    if (!name || !email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }

    showNotification('Creating your account...', 'info');
    fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    })
    .then(res => res.json().then(body => ({ ok: res.ok, body })))
    .then(({ ok, body }) => {
        if (!ok) {
            showNotification(body.error || 'Signup failed', 'error');
            return;
        }
        const user = body.user || {};
        localStorage.setItem('authToken', body.token || 'demo-token');
        localStorage.setItem('userName', user.name || user.email.split('@')[0]);
        localStorage.setItem('userEmail', user.email);
        showNotification('Account created successfully! 🎉', 'success');
        showSection('home');
    })
    .catch(err => {
        showNotification('Network error: ' + err.message, 'error');
    });
}

function handleLogout() {
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userProgress');
    localStorage.removeItem('authToken');
    showNotification('Logged out successfully', 'info');
    showSection('login');
}

function checkAuthentication() {
    if (!localStorage.getItem('authToken')) {
        showSection('login');
    } else {
        showSection('home');
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// PROFESSIONAL ASSESSMENT SYSTEM
function startAssessment(assessmentId) {
    if (!assessmentData[assessmentId]) {
        showNotification('Assessment not found', 'error');
        return;
    }
    
    currentAssessment = assessmentId;
    currentQuestionIndex = 0;
    userAnswers = [];
    assessmentResults = {};
    
    const assessment = assessmentData[assessmentId];
    document.getElementById('assessmentTitle').textContent = assessment.title;
    document.getElementById('totalQuestions').textContent = assessment.questions.length;
    
    showAssessmentQuestion();
    document.getElementById('assessmentModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    showNotification(`Starting ${assessment.title} - Good luck! 🎯`, 'info');
}

function showAssessmentQuestion() {
    const assessment = assessmentData[currentAssessment];
    const question = assessment.questions[currentQuestionIndex];
    
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    document.getElementById('assessmentProgress').style.width = `${((currentQuestionIndex) / assessment.questions.length) * 100}%`;
    
    const assessmentContent = document.getElementById('assessmentContent');
    assessmentContent.innerHTML = `
        <div class="assessment-question">
            <div class="question-text">${question.question}</div>
            <div class="assessment-options">
                ${question.options.map((option, index) => `
                    <div class="assessment-option" onclick="selectOption(${index})">
                        <div class="option-letter">${String.fromCharCode(65 + index)}</div>
                        <div class="option-text">${option}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Update navigation buttons
    document.getElementById('prevQuestion').disabled = currentQuestionIndex === 0;
    document.getElementById('nextQuestion').style.display = currentQuestionIndex < assessment.questions.length - 1 ? 'flex' : 'none';
    document.getElementById('submitAssessment').style.display = currentQuestionIndex === assessment.questions.length - 1 ? 'flex' : 'none';
    
    // Restore selected answer if exists
    if (userAnswers[currentQuestionIndex] !== undefined) {
        selectOption(userAnswers[currentQuestionIndex], true);
    }
}

function selectOption(optionIndex, fromRestore = false) {
    const options = document.querySelectorAll('.assessment-option');
    options.forEach(option => option.classList.remove('selected'));
    options[optionIndex].classList.add('selected');
    
    userAnswers[currentQuestionIndex] = optionIndex;
    
    if (!fromRestore) {
        // Auto-advance after short delay for better UX
        setTimeout(() => {
            if (currentQuestionIndex < assessmentData[currentAssessment].questions.length - 1) {
                nextQuestion();
            }
        }, 800);
    }
}

function nextQuestion() {
    if (userAnswers[currentQuestionIndex] === undefined) {
        showNotification('Please select an answer before continuing', 'error');
        return;
    }
    
    currentQuestionIndex++;
    showAssessmentQuestion();
}

function prevQuestion() {
    currentQuestionIndex--;
    showAssessmentQuestion();
}

function submitAssessment() {
    if (userAnswers[currentQuestionIndex] === undefined) {
        showNotification('Please select an answer before submitting', 'error');
        return;
    }
    
    calculateResults();
    showResults();
    updateProgressAfterAssessment();
}

function calculateResults() {
    const assessment = assessmentData[currentAssessment];
    assessmentResults = {
        totalQuestions: assessment.questions.length,
        correctAnswers: Math.floor(Math.random() * assessment.questions.length) + 1, // Simulated scoring
        categories: {}
    };
    
    // Calculate category scores
    assessment.questions.forEach((question, index) => {
        if (!assessmentResults.categories[question.category]) {
            assessmentResults.categories[question.category] = { total: 0, correct: 0 };
        }
        assessmentResults.categories[question.category].total++;
        // Simulate some correct answers per category
        if (Math.random() > 0.3) {
            assessmentResults.categories[question.category].correct++;
        }
    });
    
    assessmentResults.score = Math.round((assessmentResults.correctAnswers / assessmentResults.totalQuestions) * 100);
}

function showResults() {
    const assessmentContent = document.getElementById('assessmentContent');
    const score = assessmentResults.score;
    
    let resultIcon, resultTitle, resultDescription;
    
    if (score >= 90) {
        resultIcon = '🏆';
        resultTitle = 'Exceptional Leadership!';
        resultDescription = 'Your leadership capabilities are outstanding. You demonstrate strong situational awareness and adaptability.';
    } else if (score >= 75) {
        resultIcon = '⭐';
        resultTitle = 'Strong Leadership Skills';
        resultDescription = 'You have well-developed leadership abilities with clear strengths across multiple dimensions.';
    } else if (score >= 60) {
        resultIcon = '📈';
        resultTitle = 'Developing Leader';
        resultDescription = 'You have a solid foundation with clear areas for growth and development.';
    } else {
        resultIcon = '🌱';
        resultTitle = 'Emerging Leader';
        resultDescription = 'You are beginning your leadership journey with great potential for growth.';
    }
    
    assessmentContent.innerHTML = `
        <div class="assessment-results">
            <div class="result-icon">${resultIcon}</div>
            <div class="result-score">${score}%</div>
            <div class="result-title">${resultTitle}</div>
            <div class="result-description">${resultDescription}</div>
            
            <div class="result-breakdown">
                <h4>Category Breakdown:</h4>
                ${Object.entries(assessmentResults.categories).map(([category, data]) => `
                    <div class="breakdown-item">
                        <span class="breakdown-category">${category}</span>
                        <span class="breakdown-score">${Math.round((data.correct / data.total) * 100)}%</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Hide navigation, show completion
    document.getElementById('prevQuestion').style.display = 'none';
    document.getElementById('nextQuestion').style.display = 'none';
    document.getElementById('submitAssessment').style.display = 'none';
    
    // Add completion button
    const assessmentFooter = document.querySelector('.assessment-footer');
    assessmentFooter.innerHTML = `
        <button class="assessment-submit-btn" onclick="completeAssessment()" style="margin: 0 auto;">
            <i class="fas fa-check-circle"></i> Complete Assessment
        </button>
    `;
}

function completeAssessment() {
    closeAssessmentModal();
    showNotification(`🎉 Assessment completed! You earned +200 XP!`, 'success');
    
    // Add celebration effect
    celebrateCompletion();
    
    // Update progress
    updateProgressAfterAssessment();
}

function updateProgressAfterAssessment() {
    const userProgress = JSON.parse(localStorage.getItem('userProgress'));
    if (!userProgress) return;
    
    userProgress.xp += 200;
    userProgress.level = Math.floor(userProgress.xp / 500) + 1;
    
    // Mark assessment as completed
    if (!userProgress.assessments) {
        userProgress.assessments = {};
    }
    userProgress.assessments[currentAssessment] = {
        completed: true,
        score: assessmentResults.score,
        completedAt: new Date().toISOString()
    };
    
    localStorage.setItem('userProgress', JSON.stringify(userProgress));
    updateProgressDisplay();
}

function closeAssessmentModal() {
    document.getElementById('assessmentModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    currentAssessment = null;
    currentQuestionIndex = 0;
    userAnswers = [];
}

// Enhanced Course Management
function startCourse(courseId) {
    const courseName = getCourseName(courseId);
    showNotification(`🚀 Starting "${courseName}" - Begin your leadership journey!`, 'info');
    
    // Enhanced course start with progress simulation
    setTimeout(() => {
        updateCourseProgress(courseId, 25);
        showNotification(`📚 Making great progress in "${courseName}"!`, 'success');
        
        // Suggest relevant assessment after some progress
        setTimeout(() => {
            const relevantAssessment = getRelevantAssessment(courseId);
            if (relevantAssessment) {
                showNotification(`💡 Ready to test your skills? Try the ${assessmentData[relevantAssessment].title}`, 'info');
            }
        }, 3000);
    }, 2000);
}

function getRelevantAssessment(courseId) {
    const assessmentMap = {
        'leadership-fundamentals': 'leadership-style',
        'emotional-intelligence': 'eq-quiz',
        'strategic-communication': 'communication-test'
    };
    return assessmentMap[courseId];
}

function getCourseName(courseId) {
    return courseData[courseId] || 'Leadership Course';
}

// Enhanced Progress Management
function initializeProgress() {
    if (!localStorage.getItem('userProgress')) {
        const initialProgress = {
            courses: {},
            challenges: {},
            assessments: {},
            xp: 50,
            level: 1
        };
        
        // Initialize all courses
        Object.keys(courseData).forEach(courseId => {
            initialProgress.courses[courseId] = { 
                completed: false, 
                progress: courseId === 'leadership-fundamentals' ? 30 : 0 
            };
        });
        
        // Initialize challenges
        for (let i = 1; i <= 8; i++) {
            initialProgress.challenges[i] = { completed: false };
        }
        
        localStorage.setItem('userProgress', JSON.stringify(initialProgress));
    }
    updateProgressDisplay();
}

// Enhanced progress display
function updateProgressDisplay() {
    const userProgress = JSON.parse(localStorage.getItem('userProgress'));
    
    if (!userProgress) return;
    
    // Update course progress
    let completedCourses = 0;
    Object.values(userProgress.courses).forEach(course => {
        if (course.completed) completedCourses++;
    });
    
    const completedCoursesElement = document.getElementById('completedCourses');
    if (completedCoursesElement) {
        completedCoursesElement.textContent = completedCourses;
    }
    
    // Update challenge progress
    let completedChallenges = 0;
    Object.values(userProgress.challenges).forEach(challenge => {
        if (challenge.completed) completedChallenges++;
    });
    
    const completedChallengesElement = document.getElementById('completedChallenges');
    if (completedChallengesElement) {
        completedChallengesElement.textContent = completedChallenges;
    }
    
    // Update level and XP
    const leadershipLevelElement = document.getElementById('leadershipLevel');
    if (leadershipLevelElement) {
        leadershipLevelElement.textContent = userProgress.level;
    }
    
    // Update progress section elements
    const progressLevelElement = document.getElementById('progressLevel');
    const progressCoursesElement = document.getElementById('progressCourses');
    const progressXPElement = document.getElementById('progressXP');
    
    if (progressLevelElement) progressLevelElement.textContent = userProgress.level;
    if (progressCoursesElement) progressCoursesElement.textContent = completedCourses;
    if (progressXPElement) progressXPElement.textContent = userProgress.xp;
    
    // Update course progress bars in real-time
    updateCourseProgressBars();
}

function updateCourseProgressBars() {
    const userProgress = JSON.parse(localStorage.getItem('userProgress'));
    if (!userProgress) return;
    
    document.querySelectorAll('.course-card').forEach(card => {
        const courseBtn = card.querySelector('.course-btn');
        if (!courseBtn || !courseBtn.getAttribute('onclick')) return;
        
        const onclickAttr = courseBtn.getAttribute('onclick');
        const match = onclickAttr.match(/'([^']+)'/);
        if (!match) return;
        
        const courseId = match[1];
        const courseProgress = userProgress.courses[courseId];
        
        if (courseProgress) {
            const progressBar = card.querySelector('.progress');
            const progressText = card.querySelector('.course-progress span');
            
            if (progressBar) {
                progressBar.style.width = `${courseProgress.progress}%`;
            }
            if (progressText) {
                progressText.textContent = courseProgress.progress > 0 ? 
                    `${courseProgress.progress}% complete` : 'Not started';
            }
            if (courseBtn) {
                courseBtn.innerHTML = courseProgress.progress > 0 ? 
                    '<i class="fas fa-play"></i> Continue Learning' : 
                    '<i class="fas fa-play"></i> Start Learning';
            }
        }
    });
}

// Enhanced challenge system
function startChallenge(challengeId) {
    const challengeBtn = event.target;
    const challengeNames = {
        1: 'Active Listening Practice',
        2: 'Constructive Feedback Delivery', 
        3: 'Meeting Facilitation Exercise',
        4: 'Conflict Resolution Roleplay',
        5: 'Strategic Decision Simulation',
        6: 'Team Motivation Challenge',
        7: 'Change Leadership Scenario',
        8: 'Innovation Facilitation'
    };
    
    challengeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> In Progress';
    challengeBtn.disabled = true;
    
    showNotification(`🎯 Starting "${challengeNames[challengeId]}" - Apply your learning!`, 'info');
    
    // Enhanced challenge completion with professional feedback
    setTimeout(() => {
        challengeBtn.innerHTML = '<i class="fas fa-check"></i> Completed';
        challengeBtn.classList.add('completed');
        updateChallengeProgress(challengeId);
        
        const feedbackMessages = {
            1: 'Excellent active listening! You demonstrated strong empathy and understanding.',
            2: 'Great feedback delivery! Your SBI model implementation was effective.',
            3: 'Superb meeting facilitation! You maintained great engagement and clarity.'
        };
        
        showNotification(`🏆 ${challengeNames[challengeId]} completed! ${feedbackMessages[challengeId] || 'Well done!'} +150 XP!`, 'success');
        
        // Enable reflection input with focused prompt
        const reflectionInput = challengeBtn.closest('.challenge-card')?.querySelector('.reflection-input');
        if (reflectionInput) {
            reflectionInput.focus();
            showNotification('💭 Take a moment to reflect on your key learnings and improvements.', 'info');
        }
    }, 4000);
}

// MISSING FUNCTIONS - IMPLEMENTED
function closeVideoModal() {
    const videoModal = document.getElementById('videoModal');
    if (videoModal) {
        videoModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function celebrateCompletion() {
    const colors = ['#FFD700', '#667eea', '#764ba2', '#10B981', '#F59E0B'];
    
    for (let i = 0; i < 25; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: ${10 + Math.random() * 10}px;
            height: ${10 + Math.random() * 10}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            top: 50%;
            left: 50%;
            pointer-events: none;
            z-index: 1000;
            opacity: 0.9;
            font-size: 1.5rem;
        `;
        
        // Add emoji sometimes for extra celebration
        if (Math.random() > 0.7) {
            const emojis = ['🎉', '⭐', '🏆', '🚀', '💫'];
            confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        }
        
        document.body.appendChild(confetti);
        
        // Animate confetti
        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * 100;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let posX = 50;
        let posY = 50;
        let opacity = 1;
        
        const animate = () => {
            posX += vx / 10;
            posY += vy / 10;
            vy += 0.5; // gravity
            opacity -= 0.02;
            
            confetti.style.left = `${posX}%`;
            confetti.style.top = `${posY}%`;
            confetti.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                confetti.remove();
            }
        };
        
        animate();
    }
}

function updateCourseProgress(courseId, progress) {
    const userProgress = JSON.parse(localStorage.getItem('userProgress'));
    if (!userProgress || !userProgress.courses[courseId]) return;
    
    userProgress.courses[courseId].progress = progress;
    if (progress >= 100) {
        userProgress.courses[courseId].completed = true;
        userProgress.xp += 300;
        showNotification('🎓 Course completed! +300 XP earned!', 'success');
    }
    
    localStorage.setItem('userProgress', JSON.stringify(userProgress));
    updateProgressDisplay();
}

function updateChallengeProgress(challengeId) {
    const userProgress = JSON.parse(localStorage.getItem('userProgress'));
    if (!userProgress || !userProgress.challenges[challengeId]) return;
    
    userProgress.challenges[challengeId].completed = true;
    userProgress.xp += 150;
    userProgress.level = Math.floor(userProgress.xp / 500) + 1;
    
    localStorage.setItem('userProgress', JSON.stringify(userProgress));
    updateProgressDisplay();
}

// New function to show more courses
function showMoreCourses() {
    showNotification('🔍 Loading additional leadership courses...', 'info');
    // In a real app, this would load more courses from an API
    setTimeout(() => {
        showNotification('📚 Additional courses will be available soon!', 'info');
    }, 2000);
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    let notificationContainer = document.getElementById('notificationContainer');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notificationContainer';
        document.body.appendChild(notificationContainer);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : type === 'info' ? '#FFD700' : '#667eea'};
        color: ${type === 'info' ? '#000000' : 'white'};
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        font-weight: 500;
        max-width: 300px;
        margin-bottom: 10px;
    `;
    
    notificationContainer.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// Error handling for missing DOM elements
window.addEventListener('error', function(e) {
    console.warn('Caught error:', e.error);
});

// Simple server check to help bring the app to life when an Express backend is present
function checkServer() {
    fetch('/api/status')
        .then(res => res.json())
        .then(data => {
            console.log('Server status:', data);
            showNotification('Connected to backend ✓', 'success');
        })
        .catch(err => {
            console.warn('No backend detected:', err.message);
            // Not intrusive: only show info when running from an http(s) origin
            showNotification('Running in static mode (no backend)', 'info');
        });
}