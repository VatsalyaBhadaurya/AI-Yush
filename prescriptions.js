// Check if user is logged in
document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) {
        window.location.replace('login.html');
        return;
    }
    
    document.getElementById('userDisplay').textContent = user.name;
    loadPrescriptions();
});

// Sample prescriptions data
const samplePrescriptions = {
    active: [
        {
            id: '1',
            medicine: 'Amoxicillin',
            dosage: '500mg',
            frequency: 'Twice daily',
            duration: '7 days',
            doctor: 'Dr. Priya Sharma',
            date: '2025-01-08',
            instructions: 'Take with food'
        },
        {
            id: '2',
            medicine: 'Paracetamol',
            dosage: '650mg',
            frequency: 'As needed',
            duration: '5 days',
            doctor: 'Dr. Amit Patel',
            date: '2025-01-09',
            instructions: 'Take for fever above 100°F'
        }
    ],
    past: [
        {
            id: '3',
            medicine: 'Ciprofloxacin',
            dosage: '250mg',
            frequency: 'Twice daily',
            duration: '5 days',
            doctor: 'Dr. Meera Reddy',
            date: '2024-12-15',
            status: 'Completed'
        },
        {
            id: '4',
            medicine: 'Omeprazole',
            dosage: '20mg',
            frequency: 'Once daily',
            duration: '14 days',
            doctor: 'Dr. Priya Sharma',
            date: '2024-12-01',
            status: 'Completed'
        }
    ]
};

// Load prescriptions
function loadPrescriptions() {
    loadActivePrescriptions();
    loadPastPrescriptions();
}

// Load active prescriptions
function loadActivePrescriptions() {
    const tbody = document.getElementById('activePrescriptions');
    tbody.innerHTML = '';

    samplePrescriptions.active.forEach(prescription => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${prescription.medicine}</td>
            <td>${prescription.dosage}</td>
            <td>${prescription.frequency}</td>
            <td>${prescription.duration}</td>
            <td>${prescription.doctor}</td>
            <td>${prescription.date}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewPrescription('${prescription.id}')">
                    View Details
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Load past prescriptions
function loadPastPrescriptions() {
    const tbody = document.getElementById('pastPrescriptions');
    tbody.innerHTML = '';

    samplePrescriptions.past.forEach(prescription => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${prescription.medicine}</td>
            <td>${prescription.dosage}</td>
            <td>${prescription.frequency}</td>
            <td>${prescription.duration}</td>
            <td>${prescription.doctor}</td>
            <td>${prescription.date}</td>
            <td><span class="badge bg-secondary">${prescription.status}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

// View prescription details
function viewPrescription(prescriptionId) {
    const prescription = [...samplePrescriptions.active, ...samplePrescriptions.past]
        .find(p => p.id === prescriptionId);
    
    if (prescription) {
        document.getElementById('prescriptionDetails').innerHTML = `
            <div class="mb-3">
                <strong>Medicine:</strong> ${prescription.medicine}
            </div>
            <div class="mb-3">
                <strong>Dosage:</strong> ${prescription.dosage}
            </div>
            <div class="mb-3">
                <strong>Frequency:</strong> ${prescription.frequency}
            </div>
            <div class="mb-3">
                <strong>Duration:</strong> ${prescription.duration}
            </div>
            <div class="mb-3">
                <strong>Prescribed By:</strong> ${prescription.doctor}
            </div>
            <div class="mb-3">
                <strong>Date:</strong> ${prescription.date}
            </div>
            ${prescription.instructions ? `
            <div class="mb-3">
                <strong>Special Instructions:</strong> ${prescription.instructions}
            </div>
            ` : ''}
        `;
        
        const modal = new bootstrap.Modal(document.getElementById('prescriptionModal'));
        modal.show();
    }
}

// Download prescription
function downloadPrescription() {
    // In a real application, this would generate and download a PDF
    alert('Prescription download started...');
}

// Logout function
function logout() {
    sessionStorage.removeItem('user');
    window.location.replace('login.html');
}
