use App\Http\Controllers\AppointmentController;

// Appointment routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::get('/doctor/appointments', [AppointmentController::class, 'doctorAppointments']);
    Route::patch('/appointments/{appointment}/status', [AppointmentController::class, 'updateStatus']);
}); 