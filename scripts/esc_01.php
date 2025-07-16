<?php 

use Carbon\Carbon;

$c=app(\App\Http\Controllers\EmployeeScheduleController::class);  
$fechai=Carbon::parse("2025-07-01")->format('Y-m-d'); 
$fechaf=Carbon::parse("2025-07-31")->format('Y-m-d'); 
$c->reporteFallas($fechai,$fechaf,4,'entrada');   

