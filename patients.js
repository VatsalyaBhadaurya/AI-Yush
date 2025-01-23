document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || user.role !== 'doctor') {
        window.location.replace('./login.html');
        return;
    }

    // Display user name
    document.getElementById('userDisplay').textContent = user.name;

    // Load patients
    loadPatients();

    // Add search functionality
    document.getElementById('searchPatient').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        filterPatients(searchTerm);
    });
});

function loadPatients() {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const user = JSON.parse(sessionStorage.getItem('user'));
    
    // Get unique patients for this doctor
    const uniquePatients = appointments
        .filter(apt => apt.doctor === user.name)
        .reduce((acc, apt) => {
            if (!acc.find(p => p.id === apt.patientId)) {
                acc.push({
                    id: apt.patientId,
                    name: apt.patientName,
                    lastVisit: apt.date,
                    appointmentsCount: 1
                });
            } else {
                const patient = acc.find(p => p.id === apt.patientId);
                patient.appointmentsCount++;
                if (new Date(apt.date) > new Date(patient.lastVisit)) {
                    patient.lastVisit = apt.date;
                }
            }
            return acc;
        }, []);

    displayPatients(uniquePatients);
}

function displayPatients(patients) {
    const container = document.getElementById('patientsContainer');
    container.innerHTML = '';

    if (patients.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <h5 class="text-muted">No patients found</h5>
            </div>
        `;
        return;
    }

    patients.forEach(patient => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';
        card.innerHTML = `
            <div class="card patient-card shadow-sm h-100" data-patient-id="${patient.id}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="card-title mb-0">${patient.name}</h5>
                        <span class="badge bg-primary">${patient.appointmentsCount} visits</span>
                    </div>
                    <p class="card-text">
                        <small class="text-muted">
                            Last Visit: ${formatDate(patient.lastVisit)}
                        </small>
                    </p>
                    <div class="d-flex justify-content-between align-items-center">
                        <button class="btn btn-primary btn-sm" onclick="viewPatientHistory('${patient.id}')">
                            View History
                        </button>
                        <button class="btn btn-outline-primary btn-sm" onclick="scheduleAppointment('${patient.id}')">
                            Schedule Appointment
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function filterPatients(searchTerm) {
    const cards = document.querySelectorAll('.patient-card');
    cards.forEach(card => {
        const patientName = card.querySelector('.card-title').textContent.toLowerCase();
        const parentCol = card.parentElement;
        if (patientName.includes(searchTerm)) {
            parentCol.style.display = '';
        } else {
            parentCol.style.display = 'none';
        }
    });
}

function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
}

function viewPatientHistory(patientId) {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const patientAppointments = appointments.filter(apt => apt.patientId === patientId);
    
    if (patientAppointments.length > 0) {
        const history = patientAppointments
            .map(apt => `${formatDate(apt.date)} - ${apt.department} (${apt.status})`)
            .join('\n');
        alert(`Patient History:\n${history}`);
    } else {
        alert('No history found for this patient');
    }
}

function scheduleAppointment(patientId) {
    // Redirect to appointments page with patient ID
    window.location.href = `appointments.html?patientId=${patientId}`;
}
