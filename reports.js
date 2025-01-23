// Check authentication
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || user.role !== 'doctor') {
        window.location.replace('./login.html');
        return;
    }

    // Display user name
    document.getElementById('userDisplay').textContent = user.name;

    // Load initial reports
    loadReports();

    // Add event listeners for filters
    document.getElementById('searchPatient').addEventListener('input', debounce(filterReports, 300));
    document.getElementById('reportType').addEventListener('change', filterReports);
    document.getElementById('dateRange').addEventListener('change', filterReports);
});

// Initialize reports in localStorage if not exists
if (!localStorage.getItem('reports')) {
    localStorage.setItem('reports', JSON.stringify([]));
}

function loadReports() {
    const reports = JSON.parse(localStorage.getItem('reports')) || [];
    const user = JSON.parse(sessionStorage.getItem('user'));
    
    // Filter reports for current doctor
    const doctorReports = reports.filter(report => report.doctorId === user.id);
    
    displayReports(doctorReports);
}

function displayReports(reports) {
    const tbody = document.getElementById('reportsTable');
    tbody.innerHTML = '';

    if (reports.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">No reports found</td>
            </tr>
        `;
        return;
    }

    reports.forEach(report => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${formatDate(report.date)}</td>
            <td>${report.patientName}</td>
            <td>${report.type}</td>
            <td>
                <span class="badge ${report.status === 'Completed' ? 'bg-success' : 'bg-warning'}">
                    ${report.status}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary me-2" onclick="viewReport('${report.id}')">
                    View
                </button>
                <button class="btn btn-sm btn-outline-primary" onclick="downloadReport('${report.id}')">
                    Download
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filterReports() {
    const reports = JSON.parse(localStorage.getItem('reports')) || [];
    const user = JSON.parse(sessionStorage.getItem('user'));
    const searchTerm = document.getElementById('searchPatient').value.toLowerCase();
    const reportType = document.getElementById('reportType').value;
    const dateRange = document.getElementById('dateRange').value;

    let filteredReports = reports.filter(report => {
        const matchesDoctor = report.doctorId === user.id;
        const matchesSearch = report.patientName.toLowerCase().includes(searchTerm);
        const matchesType = reportType === 'all' || report.type === reportType;
        const matchesDate = checkDateRange(report.date, dateRange);

        return matchesDoctor && matchesSearch && matchesType && matchesDate;
    });

    displayReports(filteredReports);
}

function checkDateRange(dateStr, range) {
    const reportDate = new Date(dateStr);
    const today = new Date();
    
    switch(range) {
        case 'today':
            return isSameDay(reportDate, today);
        case 'week':
            const weekAgo = new Date(today.setDate(today.getDate() - 7));
            return reportDate >= weekAgo;
        case 'month':
            const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
            return reportDate >= monthAgo;
        default:
            return true;
    }
}

function isSameDay(date1, date2) {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
}

function createNewReport() {
    const reportId = 'R' + Date.now();
    const user = JSON.parse(sessionStorage.getItem('user'));
    
    // In a real app, this would open a form to fill report details
    const reportData = {
        id: reportId,
        doctorId: user.id,
        doctorName: user.name,
        patientName: prompt('Enter patient name:'),
        type: prompt('Enter report type (Blood Test, X-Ray, MRI, CT Scan):'),
        date: new Date().toISOString(),
        status: 'Pending',
        content: 'Report content will be added here.'
    };

    if (reportData.patientName && reportData.type) {
        const reports = JSON.parse(localStorage.getItem('reports')) || [];
        reports.push(reportData);
        localStorage.setItem('reports', JSON.stringify(reports));
        loadReports();
    }
}

function viewReport(reportId) {
    const reports = JSON.parse(localStorage.getItem('reports')) || [];
    const report = reports.find(r => r.id === reportId);
    
    if (report) {
        const reportDetails = `
            Report ID: ${report.id}
            Patient: ${report.patientName}
            Type: ${report.type}
            Date: ${formatDate(report.date)}
            Status: ${report.status}
            Content: ${report.content}
        `;
        alert(reportDetails);
    }
}

function downloadReport(reportId) {
    const reports = JSON.parse(localStorage.getItem('reports')) || [];
    const report = reports.find(r => r.id === reportId);
    
    if (report) {
        // In a real app, this would generate and download a PDF
        alert('Downloading report for ' + report.patientName);
    }
}

function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Logout function
function logout() {
    sessionStorage.removeItem('user');
    window.location.replace('login.html');
}
