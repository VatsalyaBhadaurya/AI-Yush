<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AppointmentController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if (Auth::user()->role !== 'patient') {
                return response()->json(['message' => 'Only patients can schedule appointments'], 403);
            }
            return $next($request);
        })->only('store');
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'doctor_id' => 'required|exists:users,id',
                'appointment_date' => 'required|date|after:today',
                'appointment_time' => 'required|date_format:H:i',
                'reason' => 'required|string|max:500'
            ]);

            // Check if the doctor already has an appointment at this time
            $existingAppointment = Appointment::where('doctor_id', $validated['doctor_id'])
                ->where('appointment_date', $validated['appointment_date'])
                ->where('appointment_time', $validated['appointment_time'])
                ->where('status', 'scheduled')
                ->first();

            if ($existingAppointment) {
                return response()->json([
                    'message' => 'This time slot is already booked',
                ], 422);
            }

            $appointment = Appointment::create([
                'patient_id' => Auth::id(),
                'doctor_id' => $validated['doctor_id'],
                'appointment_date' => $validated['appointment_date'],
                'appointment_time' => $validated['appointment_time'],
                'reason' => $validated['reason'],
                'status' => 'scheduled'
            ]);

            return response()->json([
                'message' => 'Appointment scheduled successfully',
                'appointment' => $appointment->load('doctor', 'patient')
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to schedule appointment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function doctorAppointments()
    {
        $appointments = Appointment::where('doctor_id', Auth::id())
            ->with('patient')
            ->orderBy('appointment_date')
            ->orderBy('appointment_time')
            ->get();

        return response()->json($appointments);
    }

    public function updateStatus(Request $request, Appointment $appointment)
    {
        $validated = $request->validate([
            'status' => 'required|in:scheduled,completed,cancelled'
        ]);

        $appointment->update(['status' => $validated['status']]);

        return response()->json([
            'message' => 'Appointment status updated successfully',
            'appointment' => $appointment
        ]);
    }

    public function getAvailableDoctors()
    {
        $doctors = User::where('role', 'doctor')
            ->select('id', 'name', 'email', 'specialization')
            ->get();

        return response()->json([
            'doctors' => $doctors
        ]);
    }

    public function patientAppointments()
    {
        $appointments = Appointment::where('patient_id', Auth::id())
            ->with('doctor')
            ->orderBy('appointment_date')
            ->orderBy('appointment_time')
            ->get();

        return response()->json([
            'appointments' => $appointments
        ]);
    }

    public function getAvailableTimeSlots(Request $request)
    {
        $request->validate([
            'doctor_id' => 'required|exists:users,id',
            'date' => 'required|date|after:today',
        ]);

        // Define available time slots (9 AM to 5 PM)
        $timeSlots = [];
        $start = 9; // 9 AM
        $end = 17;  // 5 PM

        for ($hour = $start; $hour < $end; $hour++) {
            $timeSlots[] = sprintf("%02d:00", $hour);
            $timeSlots[] = sprintf("%02d:30", $hour);
        }

        // Get booked appointments for the selected date and doctor
        $bookedSlots = Appointment::where('doctor_id', $request->doctor_id)
            ->where('appointment_date', $request->date)
            ->where('status', 'scheduled')
            ->pluck('appointment_time')
            ->map(function($time) {
                return substr($time, 0, 5);
            })
            ->toArray();

        // Remove booked slots from available slots
        $availableSlots = array_diff($timeSlots, $bookedSlots);

        return response()->json([
            'available_slots' => array_values($availableSlots)
        ]);
    }
} 