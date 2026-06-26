<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Illuminate\Support\Facades\Log;

class ScheduleController extends Controller
{
    /**
     * Display the specified schedule with its days.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $schedule = Schedule::with(['days' => function ($query) {
                $query->orderBy('day_of_week');
            }])->findOrFail($id);

            // Map days to the expected format
            $daysMap = [
                1 => 'monday',
                2 => 'tuesday',
                3 => 'wednesday',
                4 => 'thursday',
                5 => 'friday',
                6 => 'saturday',
                7 => 'sunday',
            ];

            $formattedDays = [];
            foreach ($schedule->days as $day) {
                $formattedDays[] = [
                    'day' => $daysMap[$day->day_of_week] ?? $day->day_of_week,
                    'is_working_day' => (bool) $day->is_working_day,
                    'start_time' => $day->is_working_day ? $schedule->start_time : null,
                    'end_time' => $day->is_working_day ? $schedule->end_time : null,
                    'break_start' => $day->is_working_day && $schedule->has_break ? $schedule->break_start : null,
                    'break_end' => $day->is_working_day && $schedule->has_break ? $schedule->break_end : null,
                ];
            }

            return response()->json([
                'id' => $schedule->id,
                'name' => $schedule->name,
                'start_time' => $schedule->start_time,
                'end_time' => $schedule->end_time,
                'days' => $formattedDays,
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching schedule details: '.$e->getMessage());

            return response()->json([
                'message' => 'Error al cargar el horario',
                'error' => $e->getMessage(),
            ], 404);
        }
    }
}
