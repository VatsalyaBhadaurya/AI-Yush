document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || user.role !== 'patient') {
        window.location.replace('./login.html');
        return;
    }

    // Display user name
    document.getElementById('userDisplay').textContent = user.name;
    
    // Load reports
    loadReports();
});

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function loadReports() {
    const reports = JSON.parse(localStorage.getItem('reports')) || [];
    const user = JSON.parse(sessionStorage.getItem('user'));
    
    // Get filter values
    const testType = document.getElementById('filterTestType').value;
    const dateRange = document.getElementById('filterDate').value;
    const sortBy = document.getElementById('sortBy').value;
    
    // Filter reports for current user
    let filteredReports = reports.filter(report => report.patientId === user.id);
    
    // Apply filters
    if (testType) {
        filteredReports = filteredReports.filter(report => report.testType === testType);
    }
    
    if (dateRange) {
        const today = new Date();
        let cutoffDate;
        
        switch(dateRange) {
            case 'week':
                cutoffDate = new Date(today.setDate(today.getDate() - 7));
                break;
            case 'month':
                cutoffDate = new Date(today.setMonth(today.getMonth() - 1));
                break;
            case 'year':
                cutoffDate = new Date(today.setFullYear(today.getFullYear() - 1));
                break;
        }
        
        if (cutoffDate) {
            filteredReports = filteredReports.filter(report => 
                new Date(report.date) >= cutoffDate
            );
        }
    }
    
    // Sort reports
    switch(sortBy) {
        case 'date-asc':
            filteredReports.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'date-desc':
            filteredReports.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'type':
            filteredReports.sort((a, b) => a.testType.localeCompare(b.testType));
            break;
    }

    // Display reports
    const container = document.getElementById('reportsContainer');
    
    if (filteredReports.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-file-earmark-medical text-muted" style="font-size: 3rem;"></i>
                <p class="mt-3">No reports found</p>
                <a href="patient-appointments.html" class="btn btn-custom">
                    Book an Appointment
                </a>
            </div>
        `;
    } else {
        container.innerHTML = filteredReports.map(report => `
            <div class="card report-card animate__animated animate__fadeIn">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-2">
                            <img src="${report.previewImage || 'placeholder-image.jpg'}" 
                                 alt="Report Preview" 
                                 class="report-preview img-fluid">
                        </div>
                        <div class="col-md-6">
                            <h5 class="card-title">${report.testType}</h5>
                            <p class="card-text mb-1">
                                <small class="text-muted">
                                    <i class="bi bi-calendar-event me-2"></i>${formatDate(report.date)}
                                </small>
                            </p>
                            <p class="card-text mb-1">
                                <small class="text-muted">
                                    <i class="bi bi-person-badge me-2"></i>Dr. ${report.doctor}
                                </small>
                            </p>
                            <p class="card-text">
                                <small class="text-muted">
                                    <i class="bi bi-file-earmark-text me-2"></i>${report.diagnosis}
                                </small>
                            </p>
                        </div>
                        <div class="col-md-4 text-end">
                            <button class="btn btn-custom me-2" onclick="viewReport('${report.id}')">
                                View Details
                            </button>
                            <button class="btn btn-outline-primary" onclick="downloadReport('${report.id}')">
                                <i class="bi bi-download me-2"></i>Download
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function filterReports() {
    loadReports();
}

function viewReport(reportId) {
    const reports = JSON.parse(localStorage.getItem('reports')) || [];
    const report = reports.find(r => r.id === reportId);
    
    if (report) {
        const modalContent = document.getElementById('reportModalContent');
        modalContent.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Test Details</h6>
                    <p><strong>Test Type:</strong> ${report.testType}</p>
                    <p><strong>Date:</strong> ${formatDate(report.date)}</p>
                    <p><strong>Doctor:</strong> Dr. ${report.doctor}</p>
                </div>
                <div class="col-md-6">
                    <h6>Results</h6>
                    <p><strong>Diagnosis:</strong> ${report.diagnosis}</p>
                    <p><strong>Severity:</strong> ${report.severity || 'N/A'}</p>
                </div>
            </div>
            <hr>
            <div class="row">
                <div class="col-12">
                    <h6>Detailed Analysis</h6>
                    <p>${report.analysis || 'No detailed analysis available.'}</p>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-12">
                    <h6>Recommendations</h6>
                    <ul>
                        ${(report.recommendations || ['No specific recommendations.']).map(rec => `
                            <li>${rec}</li>
                        `).join('')}
                    </ul>
                </div>
            </div>
            ${report.images ? `
                <div class="row mt-3">
                    <div class="col-12">
                        <h6>Images</h6>
                        <div class="row">
                            ${report.images.map(img => `
                                <div class="col-md-4 mb-3">
                                    <img src="${img}" alt="Report Image" class="img-fluid rounded">
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            ` : ''}
        `;
        
        const modal = new bootstrap.Modal(document.getElementById('viewReportModal'));
        modal.show();
    }
}

function downloadReport(reportId) {
    const reports = JSON.parse(localStorage.getItem('reports')) || [];
    const report = reports.find(r => r.id === reportId);
    
    if (report) {
        // In a real application, this would generate a PDF or download the actual report file
        // For this demo, we'll just show an alert
        alert('Report download started...');
    }
}

function logout() {
    sessionStorage.removeItem('user');
    window.location.replace('./login.html');
}
