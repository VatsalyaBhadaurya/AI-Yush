// Patient Appointment Management System
Rao
    window.cancelAppointment = function(appointmentId) {
        if (confirm('Are you sure you want to cancel this appointment?')) {
            appointmentManager.updateAppointmentStatus(appointmentId, 'cancelled');
            loadPatientAppointments();
        }
    };

    // Filter appointments
    const filterSelect = document.getElementById('appointmentFilter');
    if (filterSelect) {
        filterSelect.addEventListener('change', function(e) {
            const filter = e.target.value;
            const cards = appointmentsList.getElementsByClassName('appointment-card');
            
            Array.from(cards).forEach(card => {
                const status = card.querySelector('.status-badge').textContent.toLowerCase();
                card.style.display = (filter === 'all' || status === filter) ? 'block' : 'none';
            });
        }); mera Tuka mera
    }

    // Search appointments
    const searchInput = document.getElementById('appointmentSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const cards = appointmentsList.getElementsByClassName('appointment-card');
            
            Array.from(cards).forEach(card => {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(searchTerm) ? 'block' : 'none';
            });
        });
    }

    // Initial load of appointments
    loadPatientAppointments();
});

// Check authentication
const user = Auth.getCurrentUser();
if (!user || user.role !== 'patient') {
    window.location.href = 'login.html';
    return;
}

// Display user name
document.getElementById('userDisplay').textContent = user.name;

// Initialize the page
// initializeAppointmentModal();
// loadAppointments();

// Handle form submission
// document.getElementById('appointmentForm').addEventListener('submit', function(event) {
//     event.preventDefault();
//     bookAppointment();
// });

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

// function loadAppointments() {
//     const appointments = DashboardSync.getAppointments() || [];
//     const user = Auth.getCurrentUser();
//     console.log('Loading appointments for user:', user.id);
//     console.log('All appointments:', appointments);
    
//     // Get filter values
//     const testType = document.getElementById('filterTestType').value;
//     const status = document.getElementById('filterStatus').value;
//     const dateRange = document.getElementById('filterDate').value;
//     const sortBy = document.getElementById('sortBy').value;
    
//     // Filter appointments for current patient
//     let filteredAppointments = appointments.filter(apt => apt.patientId === user.id);
//     console.log('Filtered appointments for patient:', filteredAppointments);
    
//     // Apply filters
//     if (testType && testType !== 'All Tests') {
//         filteredAppointments = filteredAppointments.filter(apt => apt.testType === testType);
//     }
    
//     if (status && status !== 'All Status') {
//         filteredAppointments = filteredAppointments.filter(apt => apt.status === status);
//     }
    
//     // Apply date filter
//     const today = new Date('2025-01-11T00:48:38+05:30');
//     today.setHours(0, 0, 0, 0);
    
//     if (dateRange === 'today') {
//         filteredAppointments = filteredAppointments.filter(apt => 
//             new Date(apt.date).toDateString() === today.toDateString()
//         );
//     } else if (dateRange === 'upcoming') {
//         filteredAppointments = filteredAppointments.filter(apt => 
//             new Date(apt.date) >= today
//         );
//     }
    
//     // Sort appointments
//     if (sortBy === 'date-asc') {
//         filteredAppointments.sort((a, b) => new Date(a.date) - new Date(b.date));
//     } else if (sortBy === 'date-desc') {
//         filteredAppointments.sort((a, b) => new Date(b.date) - new Date(a.date));
//     }
    
//     // Display appointments
//     const container = document.getElementById('appointmentsContainer');
//     if (!container) {
//         console.error('Appointments container not found');
//         return;
//     }
    
//     if (filteredAppointments.length === 0) {
//         container.innerHTML = `
//             <div class="text-center py-5">
//                 <i class="bi bi-calendar-x text-muted" style="font-size: 3rem;"></i>
//                 <p class="mt-3">No appointments found</p>
//             </div>
//         `;
//         return;
//     }
    
//     container.innerHTML = filteredAppointments.map(apt => {
//         const doctor = window.healthTechUsers?.doctors?.find(d => d.id === apt.doctorId);
//         const doctorName = doctor ? doctor.name : 'Unknown Doctor';
        
//         return `
//             <div class="card mb-3">
//                 <div class="card-body">
//                     <div class="row align-items-center">
//                         <div class="col-md-3">
//                             <h5 class="mb-0">${formatDate(apt.date)}</h5>
//                             <small class="text-muted">${apt.time}</small>
//                         </div>
//                         <div class="col-md-3">
//                             <h6 class="mb-0">${doctorName}</h6>
//                             <small class="text-muted">${apt.testType}</small>
//                         </div>
//                         <div class="col-md-2">
//                             <span class="badge ${getStatusBadge(apt.status)}">
//                                 ${apt.status}
//                             </span>
//                         </div>
//                         <div class="col-md-4 text-end">
//                             ${getActionButtons(apt)}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         `;
//     }).join('');
// }

// function getStatusBadge(status) {
//     const statusMap = {
//         'Pending': 'bg-warning',
//         'Confirmed': 'bg-success',
//         'Completed': 'bg-primary',
//         'Cancelled': 'bg-danger',
//         'Rejected': 'bg-danger'
//     };
//     return statusMap[status] || 'bg-warning';
// }

// function getActionButtons(appointment) {
//     if (appointment.status === 'Pending') {
//         return `
//             <button class="btn btn-sm btn-danger" onclick="cancelAppointment('${appointment.id}')">
//                 Cancel
//             </button>
//         `;
//     } else if (appointment.status === 'Confirmed') {
//         return `
//             <button class="btn btn-sm btn-danger" onclick="cancelAppointment('${appointment.id}')">
//                 Cancel
//             </button>
//         `;
//     } else {
//         return `
//             <button class="btn btn-sm btn-primary" onclick="viewAppointmentDetails('${appointment.id}')">
//                 View Details
//             </button>
//         `;
//     }
// }

// function initializeAppointmentModal() {
//     // Populate test types from available doctors
//     const testTypeSelect = document.getElementById('testType');
//     if (testTypeSelect) {
//         const doctors = window.healthTechUsers?.doctors || [];
//         const testTypes = [...new Set(doctors.map(d => d.specialization))];
        
//         testTypeSelect.innerHTML = testTypes.map(type => 
//             `<option value="${type}">${type}</option>`
//         ).join('');
//     }
    
//     // Initialize date picker with min date as today
//     const datePicker = document.getElementById('appointmentDate');
//     if (datePicker) {
//         const today = new Date('2025-01-11T00:48:38+05:30');
//         const formattedDate = today.toISOString().split('T')[0];
//         datePicker.min = formattedDate;
//         datePicker.value = formattedDate;
//     }
    
//     // Generate time slots
//     generateTimeSlots();
// }

// function generateTimeSlots() {
//     const timeSelect = document.getElementById('appointmentTime');
//     if (!timeSelect) return;
    
//     const slots = [];
//     for (let hour = 9; hour <= 17; hour++) {
//         for (let minute of ['00', '30']) {
//             slots.push(`${hour.toString().padStart(2, '0')}:${minute}`);
//         }
//     }
    
//     timeSelect.innerHTML = slots.map(time => 
//         `<option value="${time}">${time}</option>`
//     ).join('');
// }

// function showBookAppointmentModal(specialization = '') {
//     const modal = new bootstrap.Modal(document.getElementById('bookAppointmentModal'));
    
//     if (specialization) {
//         const testTypeSelect = document.getElementById('testType');
//         if (testTypeSelect) {
//             testTypeSelect.value = specialization;
//         }
//     }
    
//     modal.show();
// }

// function bookAppointment() {
//     const user = Auth.getCurrentUser();
//     if (!user) {
//         showNotification('Please log in to book an appointment', 'error');
//         return;
//     }
    
//     console.log('Current user:', user);
    
//     const testType = document.getElementById('testType').value;
//     const date = document.getElementById('appointmentDate').value;
//     const time = document.getElementById('appointmentTime').value;
//     const notes = document.getElementById('appointmentNotes').value.trim();
    
//     console.log('Form values:', { testType, date, time, notes });
    
//     if (!testType || !date || !time) {
//         showNotification('Please fill in all required fields', 'error');
//         return;
//     }

//     // Get the selected doctor based on test type
//     const doctors = window.healthTechUsers?.doctors;
//     console.log('Available doctors:', doctors);
    
//     if (!doctors) {
//         console.error('Doctors data not found');
//         showNotification('System error: Doctor data not available', 'error');
//         return;
//     }
    
//     const doctor = doctors.find(d => d.specialization === testType);
//     console.log('Selected doctor for specialization:', testType, doctor);
    
//     if (!doctor) {
//         showNotification('No doctor available for this test type', 'error');
//         return;
//     }
    
//     // Create appointment object
//     const appointment = {
//         id: 'apt_' + Date.now(),
//         doctorId: doctor.id,
//         patientId: user.id,
//         patientName: user.name,
//         testType: testType,
//         date: date,
//         time: time,
//         notes: notes,
//         status: 'Pending',
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//     };
    
//     console.log('New appointment:', appointment);

//     try {
//         // Get existing appointments
//         const existingAppointments = DashboardSync.getAppointments() || [];
//         console.log('Existing appointments:', existingAppointments);
        
//         // Add new appointment
//         existingAppointments.push(appointment);
//         console.log('Updated appointments array:', existingAppointments);
        
//         // Save appointments
//         const saved = DashboardSync.saveAppointments(existingAppointments);
//         console.log('Save result:', saved);
        
//         if (saved) {
//             // Close modal and show success message
//             const modal = bootstrap.Modal.getInstance(document.getElementById('bookAppointmentModal'));
//             if (modal) {
//                 modal.hide();
//             }
            
//             showNotification('Appointment booked successfully!', 'success');
            
//             // Refresh appointments list
//             loadAppointments();

//             // Reset form
//             document.getElementById('appointmentForm').reset();
//         } else {
//             throw new Error('Failed to save appointment');
//         }
//     } catch (error) {
//         console.error('Error booking appointment:', error);
//         showNotification('An error occurred while booking the appointment. Please try again.', 'error');
//     }
// }

// function showNotification(message, type = 'info') {
//     const notificationDiv = document.getElementById('notification');
//     if (!notificationDiv) return;
    
//     const typeClasses = {
//         'success': 'alert-success',
//         'error': 'alert-danger',
//         'info': 'alert-info',
//         'warning': 'alert-warning'
//     };
    
//     // Remove existing alert classes
//     notificationDiv.classList.remove('alert-success', 'alert-danger', 'alert-info', 'alert-warning');
    
//     // Add new class and show message
//     notificationDiv.classList.add('alert', typeClasses[type] || 'alert-info');
//     notificationDiv.textContent = message;
//     notificationDiv.style.display = 'block';
    
//     // Hide after 3 seconds
//     setTimeout(() => {
//         notificationDiv.style.display = 'none';
//     }, 3000);
// }

// function cancelAppointment(appointmentId) {
//     if (!confirm('Are you sure you want to cancel this appointment?')) return;
    
//     const appointments = DashboardSync.getAppointments() || [];
//     const index = appointments.findIndex(apt => apt.id === appointmentId);
    
//     if (index !== -1) {
//         appointments[index].status = 'Cancelled';
//         DashboardSync.saveAppointments(appointments);
//         loadAppointments();
//     }
// }

// function viewAppointmentDetails(appointmentId) {
//     const appointments = DashboardSync.getAppointments() || [];
//     const appointment = appointments.find(apt => apt.id === appointmentId);
    
//     if (appointment) {
//         const doctor = window.healthTechUsers?.doctors?.find(d => d.id === appointment.doctorId);
//         const doctorName = doctor ? doctor.name : 'Unknown Doctor';
        
//         const modalBody = document.getElementById('appointmentDetailsBody');
//         if (modalBody) {
//             modalBody.innerHTML = `
//                 <p><strong>Doctor:</strong> ${doctorName}</p>
//                 <p><strong>Test Type:</strong> ${appointment.testType}</p>
//                 <p><strong>Date:</strong> ${formatDate(appointment.date)}</p>
//                 <p><strong>Time:</strong> ${appointment.time}</p>
//                 <p><strong>Status:</strong> ${appointment.status}</p>
//                 ${appointment.notes ? `<p><strong>Notes:</strong> ${appointment.notes}</p>` : ''}
//             `;
            
//             const modal = new bootstrap.Modal(document.getElementById('appointmentDetailsModal'));
//             modal.show();
//         }
//     }
// }

// function logout() {
//     Auth.logout();
//     window.location.href = 'login.html';
// }

// function filterAppointments() {
//     loadAppointments();
// }

// function initializeTestPatients() {
//     const testPatients = [
//         {
//             id: 'patient_1',
//             name: 'John Doe',
//             email: 'john.doe@example.com',
//             appointments: []
//         },
//         {
//             id: 'patient_2',
//             name: 'Jane Smith',
//             email: 'jane.smith@example.com',
//             appointments: []
//         },
//         {
//             id: 'patient_3',
//             name: 'Alice Johnson',
//             email: 'alice.johnson@example.com',
//             appointments: []
//         },
//         {
//             id: 'patient_4',
//             name: 'Bob Brown',
//             email: 'bob.brown@example.com',
//             appointments: []
//         }
//     ];

//     // Save test patients to localStorage
//     localStorage.setItem('patients', JSON.stringify(testPatients));
// }

// // Call the function to initialize test patients
// initializeTestPatients();
