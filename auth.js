// User database (In production, this would be on a server)
const users = {
    patients: [
        {
            email: 'rajesh@patient.com',
            password: 'patient123',
            name: 'Rajesh Kumar',
            role: 'patient',
            id: 'P001'
        },
        {
            email: 'john.doe@example.com',
            password: 'patient123',
            name: 'John Doe',
            role: 'patient',
            id: 'P002'
        },
        {
            email: 'jane.smith@example.com',
            password: 'patient123',
            name: 'Jane Smith',
            role: 'patient',
            id: 'P003'
        },
        {
            email: 'alice.johnson@example.com',
            password: 'patient123',
            name: 'Alice Johnson',
            role: 'patient',
            id: 'P004'
        },
        {
            email: 'bob.brown@example.com',
            password: 'patient123',
            name: 'Bob Brown',
            role: 'patient',
            id: 'P005'
        }
    ],
    doctors: [
        {
            email: 'priya@doctor.com',
            password: 'doctor123',
            name: 'Dr. Priya Sharma',
            role: 'doctor',
            id: 'D001',
            specialization: 'Lung Cancer Detection',
            department: 'Oncology',
            description: 'Specialist in early detection and diagnosis of lung cancer using advanced imaging techniques.'
        },
        {
            email: 'amit@doctor.com',
            password: 'doctor123',
            name: 'Dr. Amit Patel',
            role: 'doctor',
            id: 'D002',
            specialization: 'Brain Tumor Analysis',
            department: 'Neurology',
            description: 'Expert in brain tumor diagnosis and treatment planning using MRI analysis.'
        },
        {
            email: 'sarah@doctor.com',
            password: 'doctor123',
            name: 'Dr. Sarah Johnson',
            role: 'doctor',
            id: 'D003',
            specialization: 'Diabetic Retinopathy',
            department: 'Ophthalmology',
            description: 'Specialized in early detection and treatment of diabetic retinopathy.'
        },
        {
            email: 'raj@doctor.com',
            password: 'doctor123',
            name: 'Dr. Raj Malhotra',
            role: 'doctor',
            id: 'D004',
            specialization: 'Osteoarthritis Detection',
            department: 'Orthopedics',
            description: 'Expert in diagnosis and treatment of osteoarthritis using AI-assisted imaging.'
        },
        {
            email: 'meera@doctor.com',
            password: 'doctor123',
            name: 'Dr. Meera Reddy',
            role: 'doctor',
            id: 'D005',
            specialization: 'Goiter Analysis',
            department: 'Endocrinology',
            description: 'Specialized in thyroid disorders and goiter detection using ultrasound imaging.'
        }
    ]
};

// Make users available globally
window.healthTechUsers = users;

class Auth {
    static login(credentials) {
        const user = this.findUser(credentials.email, credentials.password);
        if (user) {
            sessionStorage.setItem('user', JSON.stringify(user));
            return true;
        }
        return false;
    }

    static logout() {
        sessionStorage.removeItem('user');
    }

    static isLoggedIn() {
        return !!sessionStorage.getItem('user');
    }

    static getCurrentUser() {
        const userStr = sessionStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    static findUser(email, password) {
        // Check both patients and doctors
        for (const role of ['patients', 'doctors']) {
            const user = users[role].find(u => u.email === email && u.password === password);
            if (user) {
                // Create a copy without the password
                const { password: _, ...userWithoutPassword } = user;
                return userWithoutPassword;
            }
        }
        return null;
    }
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (Auth.login({ email, password })) {
        const user = Auth.getCurrentUser();
        if (user.role === 'patient') {
            window.location.href = 'patient-dashboard.html';
        } else if (user.role === 'doctor') {
            window.location.href = 'doctor-dashboard.html';
        }
    } else {
        showError('Invalid email or password');
    }
}

    // Show error message
    function showError(message) {
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }

// Check if user is already logged in
function checkAuth() {
    if (Auth.isLoggedIn()) {
        const user = Auth.getCurrentUser();
        const currentPage = window.location.pathname.split('/').pop();
        
        if (currentPage === 'login.html') {
            if (user.role === 'patient') {
                window.location.href = 'patient-dashboard.html';
            } else if (user.role === 'doctor') {
                window.location.href = 'doctor-dashboard.html';
            }
        } else if (
            (user.role === 'patient' && !currentPage.startsWith('patient-')) ||
            (user.role === 'doctor' && !currentPage.startsWith('doctor-'))
        ) {
            window.location.href = 'login.html';
        }
    }
}

// Initialize login page
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    checkAuth();
});

function googleTranslateElementInit()
{
    new google.translate.TranslateElement(
        {pageLanguage:'en'},
        'google_translate_element'
    );
}