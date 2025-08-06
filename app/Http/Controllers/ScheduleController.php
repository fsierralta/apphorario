<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    public function index()
    {
        $schedules = Schedule::with('days')->get();

        return Inertia::render('Schedules/Index', [
            'schedules' => $schedules,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'has_break' => 'boolean',
            'break_start' => 'nullable|date_format:H:i|required_if:has_break,true',
            'break_end' => 'nullable|date_format:H:i|after:break_start|required_if:has_break,true',
            'tolerance_minutes' => 'integer|min:0',
            'days' => 'required|array|size:7',
            'days.*.day_of_week' => 'required|integer|between:1,7',
            'days.*.is_working_day' => 'required|boolean',
        ]);
        // $validated=$request->validate();
        DB::transaction(function () use ($validated) {
            try {
                // code...
                $schedule = Schedule::create($validated);

                foreach ($validated['days'] as $day) {       $schedule->days()->create($day);
             
                }
            } catch (\Throwable $th) {
                // throw $th;
                info('error', ['info' => $th->getMessage()]);
            }

        });

        return redirect()->route('schedules.index');
    }

    public function update(Request $request, Schedule $schedule)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'has_break' => 'boolean',
            'break_start' => 'nullable|date_format:H:i|required_if:has_break,true',
            'break_end' => 'nullable|date_format:H:i|after:break_start|required_if:has_break,true',
            'tolerance_minutes' => 'integer|min:0',
            'days' => 'required|array|size:7',
            'days.*.day_of_week' => 'required|integer|between:1,7',
            'days.*.is_working_day' => 'required|boolean',
        ]);

        DB::transaction(function () use ($schedule, $validated) {
            $schedule->update($validated);
            $schedule->days()->delete();

            foreach ($validated['days'] as $day) {
                $schedule->days()->create($day);
            }
        });

        return redirect()->route('schedules.index');
    }

    public function destroy(Schedule $schedule)
    {
        $schedule->delete();

        return redirect()->route('schedules.index');
    }
}
