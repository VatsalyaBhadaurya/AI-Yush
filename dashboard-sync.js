// Shared data management and synchronization
class DashboardSync {
    // Storage keys
    static KEYS = {
        APPOINTMENTS: 'healthtech_appointments',
        REPORTS: 'healthtech_reports',
        PATIENTS: 'healthtech_patients'
    };

    // Event names for real-time updates
    static EVENTS = {
        APPOINTMENT_UPDATED: 'appointmentUpdated',
        REPORT_UPDATED: 'reportUpdated'
    };

    // Get data from localStorage with proper parsing
    static getAppointments() {
        try {
            const appointments = JSON.parse(localStorage.getItem(this.KEYS.APPOINTMENTS)) || [];
            console.log('Retrieved appointments:', appointments);
            return appointments;
        } catch (e) {
            console.error('Error parsing appointments:', e);
            return [];
        }
    }

    static getReports() {
        try {
            return JSON.parse(localStorage.getItem(this.KEYS.REPORTS)) || [];
        } catch (e) {
            console.error('Error parsing reports:', e);
            return [];
        }
    }

    static getPatients() {
        try {
            return JSON.parse(localStorage.getItem(this.KEYS.PATIENTS)) || [];
        } catch (e) {
            console.error('Error parsing patients:', e);
            return [];
        }
    }

    // Save data to localStorage with proper stringification
    static saveAppointments(appointments) {
        try {
            console.log('Saving appointments:', appointments);
            localStorage.setItem(this.KEYS.APPOINTMENTS, JSON.stringify(appointments));
            this.notifyUpdate(this.EVENTS.APPOINTMENT_UPDATED);
            return true;
        } catch (e) {
            console.error('Error saving appointments:', e);
            return false;
        }
    }

    static saveReports(reports) {
        try {
            localStorage.setItem(this.KEYS.REPORTS, JSON.stringify(reports));
            this.notifyUpdate(this.EVENTS.REPORT_UPDATED);
            return true;
        } catch (e) {
            console.error('Error saving reports:', e);
            return false;
        }
    }

    static savePatients(patients) {
        try {
            localStorage.setItem(this.KEYS.PATIENTS, JSON.stringify(patients));
            return true;
        } catch (e) {
            console.error('Error saving patients:', e);
            return false;
        }
    }

    // Notify all components about updates
    static notifyUpdate(eventName) {
        console.log('Dispatching event:', eventName);
        window.dispatchEvent(new CustomEvent(eventName));
    }

    // Clear all data (useful for testing)
    static clearAll() {
        localStorage.removeItem(this.KEYS.APPOINTMENTS);
        localStorage.removeItem(this.KEYS.REPORTS);
        localStorage.removeItem(this.KEYS.PATIENTS);
    }
}

// Initialize storage if empty
if (!localStorage.getItem(DashboardSync.KEYS.APPOINTMENTS)) {
    localStorage.setItem(DashboardSync.KEYS.APPOINTMENTS, JSON.stringify([]));
}
if (!localStorage.getItem(DashboardSync.KEYS.REPORTS)) {
    localStorage.setItem(DashboardSync.KEYS.REPORTS, JSON.stringify([]));
}
if (!localStorage.getItem(DashboardSync.KEYS.PATIENTS)) {
    localStorage.setItem(DashboardSync.KEYS.PATIENTS, JSON.stringify([]));
}

// Export the class for use in other files
window.DashboardSync = DashboardSync;
