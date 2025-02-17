document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
// regerg
    // Add Doctor form handling
    const addDoctorForm = document.getElementById('addDoctorForm');
    const addDoctorBtn = document.querySelector('#addDoctorModal .btn-primary');

    addDoctorBtn?.addEventListener('click', function() {
        if (addDoctorForm.checkValidity()) {
            this.disabled = true;
            this.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Adding...';

            // Simulate API call
            setTimeout(() => {
                showToast('Success', 'Doctor added successfully');
                bootstrap.Modal.getInstance(document.getElementById('addDoctorModal')).hide();
                
                // Reset form and button
                addDoctorForm.reset();
                this.disabled = false;
                this.innerHTML = 'Add Doctor';

                // Refresh doctor list
                updateDoctorList();
            }, 1500);
        } else {
            addDoctorForm.classList.add('was-validated');
        }
    });

    // Initialize ML model monitoring
    initializeModelMonitoring();
});

// Function to update doctor list
function updateDoctorList() {
    const doctorTable = document.querySelector('table tbody');
    const loadingRow = `
        <tr>
            <td colspan="4" class="text-center">
                <div class="spinner-border spinner-border-sm text-primary"></div>
                Updating list...
            </td>
        </tr>
    `;
    
    doctorTable.innerHTML = loadingRow;

    // Simulate API call
    setTimeout(() => {
        doctorTable.innerHTML = `
            <tr>
                <td>Dr. John Smith</td>
                <td>Neurology</td>
                <td><span class="badge bg-success">Active</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary">Edit</button>
                    <button class="btn btn-sm btn-outline-danger">Remove</button>
                </td>
            </tr>
            <tr>
                <td>Dr. Sarah Johnson</td>
                <td>Cardiology</td>
                <td><span class="badge bg-success">Active</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary">Edit</button>
                    <button class="btn btn-sm btn-outline-danger">Remove</button>
                </td>
            </tr>
        `;
    }, 1000);
}

// Function to initialize ML model monitoring
function initializeModelMonitoring() {
    const models = [
        {
            name: 'Brain Tumor Detection',
            status: 'active',
            accuracy: 95,
            lastUpdate: '2 hours ago'
        },
        {
            name: 'Diabetic Retinopathy',
            status: 'active',
            accuracy: 92,
            lastUpdate: '1 day ago'
        },
        {
            name: 'Lung Cancer Detection',
            status: 'updating',
            accuracy: 88,
            lastUpdate: 'Update in progress...'
        }
    ];

    // Update model status every 30 seconds
    setInterval(() => {
        models.forEach(model => {
            // Simulate random accuracy fluctuations
            model.accuracy = Math.max(85, Math.min(98, model.accuracy + (Math.random() - 0.5) * 2));
            
            // Update UI
            const modelCard = document.querySelector(`[data-model="${model.name}"]`);
            if (modelCard) {
                const accuracyBar = modelCard.querySelector('.progress-bar');
                accuracyBar.style.width = `${model.accuracy}%`;
                accuracyBar.textContent = `${model.accuracy.toFixed(1)}% Accuracy`;
            }
        });
    }, 30000);
}

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

// Function to handle model updates
function updateModel(modelName) {
    const modelCard = document.querySelector(`[data-model="${modelName}"]`);
    const statusBadge = modelCard.querySelector('.badge');
    const updateInfo = modelCard.querySelector('small');

    statusBadge.className = 'badge bg-warning';
    statusBadge.textContent = 'Updating';
    updateInfo.textContent = 'Update in progress...';

    // Simulate update process
    setTimeout(() => {
        statusBadge.className = 'badge bg-success';
        statusBadge.textContent = 'Active';
        updateInfo.textContent = 'Last updated: Just now';
        showToast('Success', `${modelName} has been updated successfully`);
    }, 5000);
}

// Function to handle logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'index.html';
    }
}
