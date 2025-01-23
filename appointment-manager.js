// Appointment management system
class AppointmentManager {
    constructor() {
        this.appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    }

    // Add new appointment
    addAppointment(appointment) {
        appointment.id = Date.now(); // Unique ID for each appointment
        appointment.status = 'pending'; // Initial status
        appointment.createdAt = new Date().toISOString();
        this.appointments.push(appointment);
        this.saveAppointments();
    }

    // Get all appointments
    getAllAppointments() {
        return this.appointments;
    }

    // Get appointments for a specific doctor
    getDoctorAppointments(doctorId) {
        return this.appointments.filter(apt => apt.doctorId === doctorId);
    }

    // Get appointments for a specific patient
    getPatientAppointments(patientId) {
        return this.appointments.filter(apt => apt.patientId === patientId);
    }

    // Update appointment status
    updateAppointmentStatus(appointmentId, status) {
        const appointment = this.appointments.find(apt => apt.id === appointmentId);
        if (appointment) {
            appointment.status = status;
            this.saveAppointments();
        }
    }

    // Save appointments to localStorage
    saveAppointments() {
        localStorage.setItem('appointments', JSON.stringify(this.appointments));
    }

    // Generate appointment summary
    generateSummary() {
        return {
            total: this.appointments.length,
            pending: this.appointments.filter(apt => apt.status === 'pending').length,
            confirmed: this.appointments.filter(apt => apt.status === 'confirmed').length,
            cancelled: this.appointments.filter(apt => apt.status === 'cancelled').length
        };
    }
}

// Initialize appointment manager
const appointmentManager = new AppointmentManager();
