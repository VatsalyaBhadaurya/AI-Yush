<template>
  <div class="appointment-scheduler">
    <div class="card">
      <div class="card-header">
        <h3>Schedule Appointment</h3>
      </div>
      <div class="card-body">
        <form @submit.prevent="scheduleAppointment">
          <!-- Doctor Selection -->
          <div class="form-group">
            <label>Select Doctor</label>
            <select v-model="form.doctor_id" class="form-control" @change="loadTimeSlots">
              <option value="">Choose a doctor</option>
              <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">
                {{ doctor.name }} - {{ doctor.specialization }}
              </option>
            </select>
          </div>

          <!-- Date Selection -->
          <div class="form-group">
            <label>Select Date</label>
            <input 
              type="date" 
              v-model="form.appointment_date" 
              class="form-control"
              :min="minDate"
              @change="loadTimeSlots"
            >
          </div>

          <!-- Time Selection -->
          <div class="form-group">
            <label>Select Time</label>
            <select v-model="form.appointment_time" class="form-control">
              <option value="">Choose time</option>
              <option v-for="slot in availableSlots" :key="slot" :value="slot">
                {{ slot }}
              </option>
            </select>
          </div>

          <!-- Reason -->
          <div class="form-group">
            <label>Reason for Visit</label>
            <textarea 
              v-model="form.reason" 
              class="form-control" 
              rows="3"
            ></textarea>
          </div>

          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Scheduling...' : 'Schedule Appointment' }}
          </button>
        </form>
      </div>
    </div>

    <!-- Display existing appointments -->
    <div class="card mt-4">
      <div class="card-header">
        <h3>My Appointments</h3>
      </div>
      <div class="card-body">
        <div v-if="myAppointments.length === 0">No appointments scheduled</div>
        <div v-else class="appointment-list">
          <div v-for="appointment in myAppointments" :key="appointment.id" class="appointment-item">
            <div class="appointment-details">
              <p><strong>Doctor:</strong> {{ appointment.doctor.name }}</p>
              <p><strong>Date:</strong> {{ formatDate(appointment.appointment_date) }}</p>
              <p><strong>Time:</strong> {{ appointment.appointment_time }}</p>
              <p><strong>Status:</strong> {{ appointment.status }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      doctors: [],
      availableSlots: [],
      myAppointments: [],
      loading: false,
      form: {
        doctor_id: '',
        appointment_date: '',
        appointment_time: '',
        reason: ''
      }
    }
  },
  computed: {
    minDate() {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split('T')[0];
    }
  },
  methods: {
    async loadDoctors() {
      try {
        const response = await axios.get('/api/available-doctors');
        this.doctors = response.data.doctors;
      } catch (error) {
        console.error('Error loading doctors:', error);
      }
    },
    async loadTimeSlots() {
      if (!this.form.doctor_id || !this.form.appointment_date) return;
      
      try {
        const response = await axios.get('/api/available-time-slots', {
          params: {
            doctor_id: this.form.doctor_id,
            date: this.form.appointment_date
          }
        });
        this.availableSlots = response.data.available_slots;
      } catch (error) {
        console.error('Error loading time slots:', error);
      }
    },
    async loadMyAppointments() {
      try {
        const response = await axios.get('/api/patient/appointments');
        this.myAppointments = response.data.appointments;
      } catch (error) {
        console.error('Error loading appointments:', error);
      }
    },
    async scheduleAppointment() {
      this.loading = true;
      try {
        await axios.post('/api/appointments', this.form);
        this.form = {
          doctor_id: '',
          appointment_date: '',
          appointment_time: '',
          reason: ''
        };
        this.loadMyAppointments();
        alert('Appointment scheduled successfully!');
      } catch (error) {
        alert(error.response?.data?.message || 'Error scheduling appointment');
      } finally {
        this.loading = false;
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    }
  },
  mounted() {
    this.loadDoctors();
    this.loadMyAppointments();
  }
}
</script>

<style scoped>
.appointment-scheduler {
  max-width: 800px;
  margin: 0 auto;
}
.appointment-item {
  border-bottom: 1px solid #eee;
  padding: 15px 0;
}
.appointment-item:last-child {
  border-bottom: none;
}
.form-group {
  margin-bottom: 1rem;
}
</style> 