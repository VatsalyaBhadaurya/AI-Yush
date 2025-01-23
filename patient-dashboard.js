// Check if user is logged in
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || user.role !== 'patient') {
        window.location.replace('./login.html');
        return;
    }

    // Display user name and set greeting
    document.getElementById('userDisplay').textContent = user.name;
    setGreeting();
    
    // Initialize the dashboard
    loadDashboardData();
    
    // Add animation delays to elements
    document.querySelectorAll('[data-animate-delay]').forEach(element => {
        const delay = parseInt(element.getAttribute('data-animate-delay'));
        element.style.animationDelay = `${delay}ms`;
    });

    // Initialize appointment booking modal
    initializeAppointmentModal();
});

function setGreeting() {
    const hour = new Date().getHours();
    const greetingText = document.getElementById('greetingText');
    
    if (hour < 12) {
        greetingText.textContent = 'Good Morning!';
    } else if (hour < 18) {
        greetingText.textContent = 'Good Afternoon!';
    } else {
        greetingText.textContent = 'Good Evening!';
    }
}

function loadDashboardData() {
    loadAppointments();
    loadDoctors();
    updateStatistics();
    updateHealthProgress();
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(timeStr) {
    return new Date('2000-01-01 ' + timeStr).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function loadAppointments() {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const user = JSON.parse(sessionStorage.getItem('user'));
    
    // Filter appointments for this patient
    const userAppointments = appointments.filter(apt => 
        apt.patientId === user.id
    ).sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));

    const container = document.getElementById('appointmentsContainer');
    if (!container) return;

    if (userAppointments.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4">
                <i class="bi bi-calendar-x text-muted" style="font-size: 3rem;"></i>
                <p class="mt-3">No upcoming appointments</p>
                <button class="btn btn-custom" onclick="showBookAppointmentModal()">
                    Book Your First Appointment
                </button>
            </div>
        `;
    } else {
        container.innerHTML = userAppointments.map(apt => `
            <div class="card mb-3 appointment-card ${apt.status.toLowerCase()}">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-2">
                            <div class="text-center">
                                <h5 class="mb-0">${formatDate(apt.date)}</h5>
                                <small class="text-muted">${formatTime(apt.time)}</small>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <h6 class="mb-0">${apt.doctor}</h6>
                            <small class="text-muted">${apt.testType}</small>
                        </div>
                        <div class="col-md-3">
                            <span class="badge ${apt.status === 'Confirmed' ? 'bg-success' : 'bg-warning'}">
                                ${apt.status}
                            </span>
                        </div>
                        <div class="col-md-4 text-end">
                            ${apt.status === 'Pending' ? `
                                <button class="btn btn-sm btn-outline-danger me-2" onclick="cancelAppointment(event, '${apt.id}')">
                                    Cancel
                                </button>
                                <button class="btn btn-sm btn-outline-primary" onclick="rescheduleAppointment(event, '${apt.id}')">
                                    Reschedule
                                </button>
                            ` : `
                                <button class="btn btn-sm btn-primary" onclick="viewAppointmentDetails('${apt.id}')">
                                    View Details
                                </button>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function loadDoctors() {
    const doctors = users.doctors;
    const container = document.getElementById('doctorsContainer');
    if (!container) return;

    container.innerHTML = doctors.map(doctor => `
        <div class="col-md-4 mb-4">
            <div class="card doctor-card" onclick="showBookAppointmentModal('${doctor.specialization}')">
                <div class="card-body">
                    <span class="doctor-specialization">${doctor.specialization}</span>
                    <h5 class="card-title mb-1">${doctor.name}</h5>
                    <p class="text-muted mb-2">${doctor.department}</p>
                    <p class="small mb-0">${doctor.description}</p>
                </div>
            </div>
        </div>
    `).join('');
}

function updateStatistics() {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const reports = JSON.parse(localStorage.getItem('reports')) || [];
    const user = JSON.parse(sessionStorage.getItem('user'));

    // Update appointments count
    const userAppointments = appointments.filter(apt => apt.patientId === user.id);
    document.getElementById('totalAppointments').textContent = userAppointments.length;

    // Update reports count
    const userReports = reports.filter(report => report.patientId === user.id);
    document.getElementById('totalReports').textContent = userReports.length;

    // Animate numbers
    animateNumbers();
}

function updateHealthProgress() {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const reports = JSON.parse(localStorage.getItem('reports')) || [];
    const user = JSON.parse(sessionStorage.getItem('user'));

    // Calculate appointment progress
    const userAppointments = appointments.filter(apt => apt.patientId === user.id);
    const completedAppointments = userAppointments.filter(apt => apt.status === 'Confirmed');
    const appointmentProgress = userAppointments.length ? 
        Math.round((completedAppointments.length / userAppointments.length) * 100) : 0;

    // Calculate reports progress
    const userReports = reports.filter(report => report.patientId === user.id);
    const completedReports = userReports.filter(report => report.status === 'Completed');
    const reportsProgress = userReports.length ? 
        Math.round((completedReports.length / userReports.length) * 100) : 0;

    // Update progress bars with animation
    const appointmentsBar = document.querySelector('.progress-bar-custom');
    const reportsBar = document.querySelectorAll('.progress-bar-custom')[1];
    
    setTimeout(() => {
        if (appointmentsBar) {
            appointmentsBar.style.width = `${appointmentProgress}%`;
            document.getElementById('appointmentsProgress').textContent = `${appointmentProgress}%`;
        }
        if (reportsBar) {
            reportsBar.style.width = `${reportsProgress}%`;
            document.getElementById('reportsProgress').textContent = `${reportsProgress}%`;
        }
    }, 500);
}

function animateNumbers() {
    document.querySelectorAll('.stats-number').forEach(element => {
        const target = parseInt(element.textContent);
        let current = 0;
        const increment = target / 30; // Animate over 30 steps
        const interval = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(interval);
            } else {
                element.textContent = Math.round(current);
            }
        }, 50);
    });
}

function initializeAppointmentModal() {
    // Populate time slots
    const timeSelect = document.getElementById('appointmentTime');
    if (!timeSelect) return;

    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM
    
    for (let hour = startHour; hour <= endHour; hour++) {
        for (let minute of ['00', '30']) {
            const time = `${hour.toString().padStart(2, '0')}:${minute}`;
            const option = document.createElement('option');
            option.value = time;
            option.textContent = new Date(`2000-01-01 ${time}`).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
            timeSelect.appendChild(option);
        }
    }

    // Set minimum date to today
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
}

function handleFeatureCardClick(feature) {
    switch(feature) {
        case 'appointments':
            showBookAppointmentModal();
            break;
        case 'reports':
            window.location.href = 'patient-reports.html';
            break;
        case 'emergency':
            showEmergencyContact();
            break;
    }
}

function showEmergencyContact() {
    const emergencyInfo = `
        Emergency Contacts:
        - Emergency Hotline: 911
        - Hospital Reception: 1-800-HEALTH
        - Ambulance Service: 1-800-AMBULANCE
        
        Available 24/7 for immediate assistance.
    `;
    alert(emergencyInfo);
}

function showBookAppointmentModal() {
    const modal = new bootstrap.Modal(document.getElementById('bookAppointmentModal'));
    modal.show();
}

function cancelAppointment(event, appointmentId) {
    event.preventDefault();
    if (confirm('Are you sure you want to cancel this appointment?')) {
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const updatedAppointments = appointments.filter(apt => apt.id !== appointmentId);
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
        loadAppointments();
    }
}

function rescheduleAppointment(event, appointmentId) {
    event.preventDefault();
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const appointment = appointments.find(apt => apt.id === appointmentId);
    
    if (appointment) {
        // Pre-fill the booking modal with current appointment details
        document.getElementById('testType').value = appointment.testType || '';
        document.getElementById('appointmentDate').value = appointment.date || '';
        document.getElementById('appointmentTime').value = appointment.time || '';
        document.getElementById('appointmentNotes').value = appointment.notes || '';
        
        // Show the booking modal
        showBookAppointmentModal();
        
        // Remove the old appointment
        cancelAppointment(event, appointmentId);
    }
}

function bookAppointment() {
    const testType = document.getElementById('testType').value;
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    const notes = document.getElementById('appointmentNotes').value;
    
    if (!testType || !date || !time) {
        alert('Please fill in all required fields');
        return;
    }

    const user = JSON.parse(sessionStorage.getItem('user'));
    const doctor = getDoctorForTestType(testType);

    const appointment = {
        id: 'APT' + Date.now(),
        patientId: user.id,
        patientName: user.name,
        doctor: doctor.name,
        doctorId: doctor.id,
        testType: testType,
        date: date,
        time: time,
        notes: notes,
        status: 'Pending',
        createdAt: new Date().toISOString()
    };

    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));

    // Close modal and reload appointments
    const modal = bootstrap.Modal.getInstance(document.getElementById('bookAppointmentModal'));
    modal.hide();
    loadAppointments();
    
    alert('Appointment booked successfully!');
}

function getDoctorForTestType(testType) {
    const doctors = {
        'Lung Cancer Detection': { id: 'D1', name: 'Dr. Priya Sharma' },
        'Brain Tumor Analysis': { id: 'D2', name: 'Dr. Amit Patel' },
        'Diabetic Retinopathy': { id: 'D3', name: 'Dr. Sarah Johnson' },
        'Osteoarthritis Detection': { id: 'D4', name: 'Dr. Raj Malhotra' },
        'Goiter Analysis': { id: 'D5', name: 'Dr. Meera Reddy' }
    };
    return doctors[testType] || { id: 'D1', name: 'Dr. Priya Sharma' };
}

function viewAppointmentDetails(appointmentId) {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const appointment = appointments.find(apt => apt.id === appointmentId);
    
    if (appointment) {
        const details = `
            Appointment Details:
            
            Doctor: ${appointment.doctor}
            Test Type: ${appointment.testType}
            Date: ${formatDate(appointment.date)}
            Time: ${formatTime(appointment.time)}
            Status: ${appointment.status}
            ${appointment.notes ? '\nNotes: ' + appointment.notes : ''}
        `;
        alert(details);
    }
}

// Logout function
function logout() {
    sessionStorage.removeItem('user');
    window.location.replace('./login.html');
}

// Edit profile
function editProfile() {
    window.location.href = 'edit-profile.html';
}

// Emergency contact
function emergencyContact() {
    alert('Emergency contact: +91 112');
    // In a real application, this would trigger an emergency alert system
}

// Profile form handling
const profileForm = document.getElementById('profileForm');
const saveProfileBtn = document.querySelector('#profileModal .btn-primary');

saveProfileBtn?.addEventListener('click', function() {
    this.disabled = true;
    this.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Saving...';

    // Simulate saving profile
    setTimeout(() => {
        this.innerHTML = '<i class="bi bi-check"></i> Saved';
        
        // Show success toast
        showToast('Profile Updated', 'Your profile has been updated successfully.');

        // Close modal after delay
        setTimeout(() => {
            bootstrap.Modal.getInstance(document.getElementById('profileModal')).hide();
            this.disabled = false;
            this.innerHTML = 'Save Changes';
        }, 1000);
    }, 1500);
});

// Function to show toast notifications
function showToast(title, message) {
    const toastHTML = `
        <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
            <div class="toast show" role="alert">
                <div class="toast-header">
                    <strong class="me-auto">${title}</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', toastHTML);
    const toast = new bootstrap.Toast(document.querySelector('.toast'));
    toast.show();

    // Remove toast after it's hidden
    document.querySelector('.toast').addEventListener('hidden.bs.toast', function() {
        this.parentElement.remove();
    });
}

// Book Appointment
function bookAppointment() {
    const modal = new bootstrap.Modal(document.getElementById('bookAppointmentModal'));
    modal.show();
}

// Submit Appointment
function submitAppointment() {
    const form = document.getElementById('appointmentForm');
    if (form.checkValidity()) {
        // Here you would typically make an API call to save the appointment
        alert('Appointment booked successfully!');
        const modal = bootstrap.Modal.getInstance(document.getElementById('bookAppointmentModal'));
        modal.hide();
    } else {
        form.reportValidity();
    }
}

// View Reports
function viewReports() {
    // Here you would typically fetch and display all reports
    window.location.href = '#reports';
}

// View specific report
function viewReport(reportId) {
    const modal = new bootstrap.Modal(document.getElementById('viewReportModal'));
    // Here you would typically fetch the report content
    document.getElementById('reportContent').innerHTML = `
        <div class="report-content">
            <h4>Report Details</h4>
            <p><strong>Date:</strong> January 7, 2025</p>
            <p><strong>Doctor:</strong> Dr. Amit Patel</p>
            <p><strong>Department:</strong> Neurology</p>
            <div class="report-findings mt-4">
                <h5>Findings</h5>
                <p>All parameters are within normal range. No significant abnormalities detected.</p>
            </div>
        </div>
    `;
    modal.show();
}

// Download report
function downloadReport() {
    // Here you would typically trigger the report download
    alert('Report download started...');
}

// Reschedule Appointment
function rescheduleAppointment(appointmentId) {
    // Here you would typically show a reschedule form
    alert('Please contact the hospital reception to reschedule your appointment.');
}

// View all appointments
function viewAllAppointments() {
    window.location.href = '#appointments';
}

// Function to view latest reports
function viewLatestReports() {
    // Simulate loading reports
    const reportsSection = document.querySelector('.list-group');
    const loadingHTML = `
        <div class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading your reports...</p>
        </div>
    `;
    
    reportsSection.innerHTML = loadingHTML;

    // Simulate API call
    setTimeout(() => {
        reportsSection.innerHTML = `
            <a href="#" class="list-group-item list-group-item-action">
                <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">Brain MRI Analysis Report</h6>
                    <small>Just now</small>
                </div>
                <p class="mb-1">Dr. Smith - Neurology Department</p>
                <small class="text-muted">Click to view full report</small>
            </a>
        `;
    }, 2000);
}
