<?php

namespace App\service;

use App\Models\RegistroServicio;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RegistroServicioService
{
    public function create(array $data): RegistroServicio
    {
        return DB::transaction(function () use ($data) {
            return RegistroServicio::create($this->normalizeData($data));
        });
    }

    public function update(RegistroServicio $registroServicio, array $data): RegistroServicio
    {
        return DB::transaction(function () use ($registroServicio, $data) {
            $registroServicio->fill($this->normalizeData($data));
            $registroServicio->save();

            return $registroServicio->fresh();
        });
    }

    public function delete(RegistroServicio $registroServicio): bool
    {
        return DB::transaction(function () use ($registroServicio) {
            return (bool) $registroServicio->delete();
        });
    }

    protected function normalizeData(array $data): array
    {
        $normalized = $data;

        if (isset($normalized['fecha_servicio']) && ! $normalized['fecha_servicio'] instanceof \DateTimeInterface) {
            $normalized['fecha_servicio'] = $normalized['fecha_servicio'] instanceof \Carbon\Carbon
                ? $normalized['fecha_servicio']->toDateString()
                : $normalized['fecha_servicio'];
        }

        return $normalized;
    }
}
