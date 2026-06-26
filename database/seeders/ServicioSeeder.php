<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Servicio;
class ServicioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $dataJson=file_get_contents('storage/data/precio.json');
        $dataConvert=json_decode($dataJson,true);
        Servicio::truncate();
        foreach($dataConvert as $item){
            foreach($item as $servicio){

                Servicio::create([
                    'nombre_servicio'=>$servicio['descripcion'],
                    'descripcion'=>$servicio['descripcion'],
                    'precio'=>$servicio['precio'],
                    'estado'=>"activo",
                    'categoria_id'=>1,

                ]);
            }
                
          
    } 



}
}

