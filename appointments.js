// Check if user is logged in
document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || user.role !== 'patient') {
        window.location.href = 'login.html';
        return;
    }
    
    document.getElementById('userDisplay').textContent = user.name;
    loadAppointments();
    setupDoctorsList();
});

// Sample doctors data
const doctors = {
    'Cardiology': ['Dr. Priya Sharma', 'Dr. Amit Patel'],
    'Orthopedics': ['Dr. Rajesh Kumar', 'Dr. Meera Reddy'],
    'Neurology': ['Dr. Suresh Singh', 'Dr. Anita Desai'],
    'Pediatrics': ['Dr. Rahul Verma', 'Dr. Sneha Gupta'],
    'General Medicine': ['Dr. Vikram Shah', 'Dr. Pooja Mehta']
};

// Setup doctors dropdown based on department
function setupDoctorsList() {
    const departmentSelect = document.getElementById('department');
    const doctorSelect = document.getElementById('doctor');
    
    departmentSelect.addEventListener('change', function() {
        const selectedDepartment = this.value;
        const departmentDoctors = doctors[selectedDepartment] || [];
        
        doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
        departmentDoctors.forEach(doctor => {
            doctorSelect.innerHTML += `<option value="${doctor}">${doctor}</option>`;
        });
    });
}

// Load appointments from storage
function loadAppointments() {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const user = JSON.parse(sessionStorage.getItem('user'));
    
    const userAppointments = appointments.filter(apt => apt.patientId === user.id);
    const tbody = document.getElementById('appointmentsTable');
    tbody.innerHTML = '';

    if (userAppointments.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">No appointments found</td>
            </tr>
        `;
        return;
    }

    userAppointments.sort((a, b) => new Date(a.date) - new Date(b.date))
        .forEach(apt => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${formatDate(apt.date)}</td>
                <td>${apt.time}</td>
                <td>${apt.doctor}</td>
                <td>${apt.department}</td>
                <td><span class="badge ${apt.status === 'Confirmed' ? 'bg-success' : 'bg-warning'}">${apt.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="rescheduleAppointment('${apt.id}')">
                        Reschedule
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="cancelAppointment('${apt.id}')">
                        Cancel
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
}

// Format date to readable format
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Validate appointment date and time
function validateAppointment(date, time) {
    const selectedDateTime = new Date(date + ' ' + time);
    const now = new Date();
    
    if (selectedDateTime < now) {
        showError('Cannot book appointment in the past');
        return false;
    }
    
    // Check if the time is during working hours (9 AM to 5 PM)
    const hour = parseInt(time.split(':')[0]);
    if (hour < 9 || hour >= 17) {
        showError('Appointments are only available between 9 AM and 5 PM');
        return false;
    }
    
    return true;
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('bookingError');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 3000);
}

// Book new appointment
function bookAppointment() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const department = document.getElementById('department').value;
    const doctor = document.getElementById('doctor').value;
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;

    // Validate all fields
    if (!department || !doctor || !date || !time) {
        showError('Please fill in all fields');
        return;
    }

    // Validate appointment date and time
    if (!validateAppointment(date, time)) {
        return;
    }

    const appointment = {
        id: Date.now().toString(),
        patientId: user.id,
        patientName: user.name,
        department,
        doctor,
        date,
        time,
        status: 'Pending',
        createdAt: new Date().toISOString()
    };

    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));

    // Close modal and reload appointments
    const modal = bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
    modal.hide();
    
    // Show success message
    alert('Appointment booked successfully!');
    loadAppointments();
}

// Cancel appointment
function cancelAppointment(appointmentId) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const updatedAppointments = appointments.filter(apt => apt.id !== appointmentId);
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
        loadAppointments();
    }
}

// Reschedule appointment
function rescheduleAppointment(appointmentId) {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const appointment = appointments.find(apt => apt.id === appointmentId);
    
    if (appointment) {
        // Pre-fill the booking modal with current appointment details
        document.getElementById('department').value = appointment.department;
        document.getElementById('doctor').value = appointment.doctor;
        document.getElementById('appointmentDate').value = appointment.date;
        document.getElementById('appointmentTime').value = appointment.time;

        // Remove the old appointment
        const updatedAppointments = appointments.filter(apt => apt.id !== appointmentId);
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));

        // Open booking modal for rescheduling
        const modal = new bootstrap.Modal(document.getElementById('bookingModal'));
        modal.show();
    }
}

// Logout function
function logout() {
    sessionStorage.removeItem('user');
    window.location.href = 'login.html';
}
