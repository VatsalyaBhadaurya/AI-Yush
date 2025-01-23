// Initialize appointments display
document.addEventListener('DOMContentLoaded', () => {
    const appointments = localStorage.getItem('healthtech_appointments');
    console.log('Raw appointments from localStorage:', appointments);
    
    // Get current user
    const currentUser = Auth.getCurrentUser();
    console.log('Current user:', currentUser);
    
    if (!currentUser || currentUser.role !== 'doctor') {
        window.location.href = 'login.html';
        return;
    }

    loadDoctorAppointments();
    
    // Listen for appointment updates
    window.addEventListener(DashboardSync.EVENTS.APPOINTMENT_UPDATED, () => {
        console.log('Appointment update detected, refreshing...');
        loadDoctorAppointments();
    });
});

function loadDoctorAppointments() {
    // Get raw data from localStorage for debugging
    const rawData = localStorage.getItem('healthtech_appointments');
    console.log('Raw appointments data:', rawData);
    
    // Get appointments through DashboardSync
    const appointments = DashboardSync.getAppointments() || [];
    console.log('Parsed appointments:', appointments);
    
    // Get current doctor
    const currentDoctor = Auth.getCurrentUser();
    console.log('Current doctor:', currentDoctor);
    
    if (!appointments || !Array.isArray(appointments)) {
        console.error('No valid appointments data found');
        displayNoAppointments();
        return;
    }
    
    // Filter appointments for current doctor
    const doctorAppointments = appointments.filter(apt => {
        console.log('Checking appointment:', apt);
        console.log('Comparing doctorId:', apt.doctorId, 'with current doctor id:', currentDoctor.id);
        return apt.doctorId === currentDoctor.id;
    });
    
    console.log('Filtered doctor appointments:', doctorAppointments);
    
    // Display appointments
    const container = document.getElementById('appointmentsContainer');
    if (!container) {
        console.error('Appointments container not found');
        return;
    }
    
    if (!doctorAppointments.length) {
        displayNoAppointments();
        return;
    }
    
    // Sort appointments by date and time
    doctorAppointments.sort((a, b) => {
        const dateA = new Date(a.date + 'T' + a.time);
        const dateB = new Date(b.date + 'T' + b.time);
        return dateA - dateB;
    });
    
    container.innerHTML = doctorAppointments.map(apt => {
        // Get patient details
        const patient = window.healthTechUsers?.patients?.find(p => p.id === apt.patientId);
        console.log('Found patient for appointment:', patient);
        
        const patientName = patient ? patient.name : 'Unknown Patient';
        const appointmentDate = new Date(apt.date + 'T' + apt.time);
        
        return `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-3">
                            <h5 class="mb-0">${formatDate(apt.date)}</h5>
                            <small class="text-muted">${apt.time}</small>
                        </div>
                        <div class="col-md-3">
                            <h6 class="mb-0">${patientName}</h6>
                            <small class="text-muted">${apt.testType || 'General Checkup'}</small>
                        </div>
                        <div class="col-md-2">
                            <span class="badge ${getStatusBadge(apt.status)}">
                                ${apt.status || 'Pending'}
                            </span>
                        </div>
                        <div class="col-md-4 text-end">
                            ${getActionButtons(apt)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Update stats if we're on the dashboard
    if (document.getElementById('dashboardStats')) {
        updateDashboardStats(doctorAppointments);
    }
}

function displayNoAppointments() {
    const container = document.getElementById('appointmentsContainer');
    if (container) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-calendar-x text-muted" style="font-size: 3rem;"></i>
                <p class="mt-3">No appointments found</p>
            </div>
        `;
    }
}

function getStatusBadge(status) {
    const statusMap = {
        'Pending': 'bg-warning',
        'Confirmed': 'bg-success',
        'Completed': 'bg-primary',
        'Cancelled': 'bg-danger',
        'Rejected': 'bg-danger'
    };
    return statusMap[status] || 'bg-warning';
}

function getActionButtons(appointment) {
    if (appointment.status === 'Pending') {
        return `
            <button class="btn btn-sm btn-success me-2" onclick="confirmAppointment('${appointment.id}')">
                Confirm
            </button>
            <button class="btn btn-sm btn-danger" onclick="rejectAppointment('${appointment.id}')">
                Reject
            </button>
        `;
    } else if (appointment.status === 'Confirmed') {
        return `
            <button class="btn btn-sm btn-primary me-2" onclick="completeAppointment('${appointment.id}')">
                Complete
            </button>
            <button class="btn btn-sm btn-danger" onclick="cancelAppointment('${appointment.id}')">
                Cancel
            </button>
        `;
    } else {
        return `
            <button class="btn btn-sm btn-primary" onclick="viewAppointmentDetails('${appointment.id}')">
                View Details
            </button>
        `;
    }
}

function confirmAppointment(id) {
    updateAppointmentStatus(id, 'Confirmed');
}

function rejectAppointment(id) {
    if (confirm('Are you sure you want to reject this appointment?')) {
        updateAppointmentStatus(id, 'Rejected');
    }
}

function completeAppointment(id) {
    updateAppointmentStatus(id, 'Completed');
}

function cancelAppointment(id) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
        updateAppointmentStatus(id, 'Cancelled');
    }
}

function updateAppointmentStatus(appointmentId, newStatus) {
    const appointments = DashboardSync.getAppointments() || [];
    const index = appointments.findIndex(apt => apt.id === appointmentId);
    
    if (index !== -1) {
        appointments[index].status = newStatus;
        console.log('Updating appointment status:', appointments[index]);
        DashboardSync.saveAppointments(appointments);
        loadDoctorAppointments();
    } else {
        console.error('Appointment not found:', appointmentId);
    }
}

function updateDashboardStats(appointments) {
    const today = new Date('2025-01-11T00:48:38+05:30');
    today.setHours(0, 0, 0, 0);
    
    const stats = {
        today: appointments.filter(apt => new Date(apt.date).toDateString() === today.toDateString()).length,
        pending: appointments.filter(apt => apt.status === 'Pending').length,
        confirmed: appointments.filter(apt => apt.status === 'Confirmed').length,
        total: appointments.length
    };
    
    Object.entries({
        'todayAppointments': stats.today,
        'pendingAppointments': stats.pending,
        'confirmedAppointments': stats.confirmed,
        'totalAppointments': stats.total
    }).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function viewAppointmentDetails(appointmentId) {
    const appointments = DashboardSync.getAppointments() || [];
    const appointment = appointments.find(apt => apt.id === appointmentId);
    
    if (appointment) {
        const patient = window.healthTechUsers?.patients?.find(p => p.id === appointment.patientId);
        const patientName = patient ? patient.name : 'Unknown Patient';
        
        const modalBody = document.getElementById('appointmentDetailsBody');
        if (modalBody) {
            modalBody.innerHTML = `
                <p><strong>Patient:</strong> ${patientName}</p>
                <p><strong>Test Type:</strong> ${appointment.testType || 'General Checkup'}</p>
                <p><strong>Date:</strong> ${formatDate(appointment.date)}</p>
                <p><strong>Time:</strong> ${appointment.time}</p>
                <p><strong>Status:</strong> ${appointment.status}</p>
                ${appointment.notes ? `<p><strong>Notes:</strong> ${appointment.notes}</p>` : ''}
            `;
            
            const modal = new bootstrap.Modal(document.getElementById('appointmentDetailsModal'));
            modal.show();
        }
    }
}

function logout() {
    Auth.logout();
    window.location.href = 'login.html';
}
