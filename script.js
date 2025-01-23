document.addEventListener('DOMContentLoaded', function() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const imageUpload = document.getElementById('imageUpload');
    const resultCard = document.getElementById('resultCard');
    const resultContent = document.getElementById('resultContent');
    const diseaseType = document.getElementById('diseaseType');

    let selectedImage = null;

    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            selectedImage = file;
            // Preview image if needed
        }
    });

    analyzeBtn.addEventListener('click', async function() {
        if (!selectedImage) {
            alert('Please select an image first');
            return;
        }

        // Show loading state
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Analyzing...';

        try {
            // Here we'll add the actual image processing logic
            // For now, showing a mock result
            await mockAnalysis();
        } catch (error) {
            console.error('Error during analysis:', error);
            alert('An error occurred during analysis. Please try again.');
        } finally {
            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = 'Analyze Image';
        }
    });

    async function mockAnalysis() {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        const results = {
            'brain': {
                prediction: 'Tumor detected',
                confidence: 0.92,
                location: 'Right temporal lobe',
                severity: 'Medium'
            },
            'retina': {
                prediction: 'Mild diabetic retinopathy',
                confidence: 0.88,
                details: 'Early signs of microaneurysms detected'
            },
            'thyroid': {
                prediction: 'Goiter present',
                confidence: 0.95,
                size: '2.3 cm',
                recommendation: 'Further evaluation recommended'
            },
            'lung': {
                prediction: 'Suspicious nodule detected',
                confidence: 0.85,
                location: 'Upper right lobe',
                size: '1.5 cm'
            },
            'bone': {
                prediction: 'Moderate osteoarthritis',
                confidence: 0.91,
                affected_area: 'Knee joint',
                severity: 'Grade 2'
            }
        };

        const selectedDisease = diseaseType.value;
        const result = results[selectedDisease];

        // Display results
        resultCard.style.display = 'block';
        resultContent.innerHTML = `
            <div class="result-item">
                <h4>${result.prediction}</h4>
                <p>Confidence: <span class="${result.confidence > 0.9 ? 'confidence-high' : 'confidence-medium'}">
                    ${(result.confidence * 100).toFixed(1)}%
                </span></p>
                ${Object.entries(result)
                    .filter(([key]) => !['prediction', 'confidence'].includes(key))
                    .map(([key, value]) => `<p><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${value}</p>`)
                    .join('')}
            </div>
        `;
    }

    // Initialize all tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Department and Doctor selection handling
    const departmentSelect = document.querySelector('#appointmentForm select:first-of-type');
    const doctorSelect = document.querySelector('#appointmentForm select:nth-of-type(2)');
    const timeSelect = document.querySelector('#appointmentForm select:last-of-type');
    
    const doctors = {
        'Cardiology': ['Dr. John Smith', 'Dr. Sarah Johnson', 'Dr. Michael Chen'],
        'Neurology': ['Dr. Emma Wilson', 'Dr. David Brown', 'Dr. Lisa Anderson'],
        'Orthopedics': ['Dr. James Williams', 'Dr. Robert Taylor', 'Dr. Maria Garcia'],
        'General Medicine': ['Dr. Thomas Moore', 'Dr. Jennifer Lee', 'Dr. William Davis']
    };

    const timeSlots = [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
        '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
    ];

    // Update doctors when department changes
    departmentSelect?.addEventListener('change', function() {
        doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
        if (this.value) {
            doctors[this.value].forEach(doctor => {
                const option = document.createElement('option');
                option.textContent = doctor;
                doctorSelect.appendChild(option);
            });
        }
    });

    // Populate time slots
    timeSlots.forEach(slot => {
        const option = document.createElement('option');
        option.textContent = slot;
        timeSelect?.appendChild(option);
    });

    // Form submission handling
    const appointmentForm = document.getElementById('appointmentForm');
    const bookAppointmentBtn = document.getElementById('bookAppointmentBtn');

    bookAppointmentBtn?.addEventListener('click', function() {
        if (appointmentForm.checkValidity()) {
            // Show loading state
            this.disabled = true;
            this.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Booking...';

            // Simulate API call
            setTimeout(() => {
                // Show success message
                const modalBody = appointmentForm.parentElement;
                modalBody.innerHTML = `
                    <div class="text-center">
                        <i class="bi bi-check-circle text-success" style="font-size: 4rem;"></i>
                        <h4 class="mt-3">Appointment Booked Successfully!</h4>
                        <p class="mb-4">You will receive a confirmation email and SMS shortly.</p>
                        <div class="alert alert-info">
                            <strong>Appointment Details:</strong><br>
                            Department: ${departmentSelect.value}<br>
                            Doctor: ${doctorSelect.value}<br>
                            Date: ${document.querySelector('input[type="date"]').value}<br>
                            Time: ${timeSelect.value}
                        </div>
                    </div>
                `;

                // Update modal footer
                const modalFooter = document.querySelector('#appointmentModal .modal-footer');
                modalFooter.innerHTML = `
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" onclick="window.location.reload()">Book Another</button>
                `;
            }, 2000);
        } else {
            appointmentForm.classList.add('was-validated');
        }
    });

    // Login form handling
    const loginForm = document.getElementById('loginForm');
    const loginBtn = loginForm?.nextElementSibling.querySelector('.btn-primary');

    loginBtn?.addEventListener('click', function() {
        if (loginForm.checkValidity()) {
            // Add your login logic here
            this.disabled = true;
            this.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Logging in...';
            
            // Simulate login
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {
            loginForm.classList.add('was-validated');
        }
    });

    // Register form handling
    const registerForm = document.getElementById('registerForm');
    const registerBtn = registerForm?.nextElementSibling.querySelector('.btn-primary');

    registerBtn?.addEventListener('click', function() {
        if (registerForm.checkValidity()) {
            // Add your registration logic here
            this.disabled = true;
            this.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Creating account...';
            
            // Simulate registration
            setTimeout(() => {
                const modalBody = registerForm.parentElement;
                modalBody.innerHTML = `
                    <div class="text-center">
                        <i class="bi bi-check-circle text-success" style="font-size: 4rem;"></i>
                        <h4 class="mt-3">Registration Successful!</h4>
                        <p>Your account has been created. Please check your email for verification.</p>
                    </div>
                `;
            }, 2000);
        } else {
            registerForm.classList.add('was-validated');
        }
    });

    // Emergency call button handling
    const emergencyBtn = document.querySelector('.quick-action-card .btn-danger');
    emergencyBtn?.addEventListener('click', function() {
        const confirmation = confirm('This will initiate an emergency call. Continue?');
        if (confirmation) {
            window.location.href = 'tel:911';
        }
    });
});
function googleTranslateElementInit()
{
    new google.translate.TranslateElement(
        {pageLanguage:'en'},
        'google_translate_element'
    );
}