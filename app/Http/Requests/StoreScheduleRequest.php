<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreScheduleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
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
            //
        ];
    }
}
