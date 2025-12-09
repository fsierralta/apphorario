<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FormaPago>
 */
class FormaPagoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        try {
            //code...
              return [
            //
            ["nombre_forma_pago"=>"DOLARES EFECTIVO",
             "descripcion"=>'Dolares en efeftivo',
             "nombre_corto"=>"$ Efectivo" 
           ],
            ["nombre_forma_pago"=>"ZELLE EN DOLARES",
             "descripcion"=>'Zelle en Dolares ',
             "nombre_corto"=>"$ Zelle " 
           ],
           ["nombre_forma_pago"=>"DOLARES EFECTIVO+ ZELLE",
             "descripcion"=>'Dolares en efeftivo+ ZELLE',
             "nombre_corto"=>"$ Efectivo +Zelle+" 
        ],
         ["nombre_forma_pago"=>"DOLARES EFECTIVO +Pago Movil",
             "descripcion"=>'Dolares en efeftivo+  Pago Movil',
             "nombre_corto"=>"$ Efectivo+Pago Movil" 
         ],
         ["nombre_forma_pago"=>"Pago Movil bs",
             "descripcion"=>'Pago Movil bs',
             "nombre_corto"=>"Pago Movil bs" 
         ],
         ["nombre_forma_pago"=>"DOLARES EFECTIVO +Pago Movil",
             "descripcion"=>'Dolares en efectivo+  Pago Movil',
             "nombre_corto"=>"$ Efectivo+Pago Movil" 
         ],
         ["nombre_forma_pago"=>"Pago Movil + Efectivo Bs",
             "descripcion"=>'Pago Movil+Efectivobs',
             "nombre_corto"=>"PMovil+Efect." 
         ],
         ["nombre_forma_pago"=>"Efectivo bs",
             "descripcion"=>'Efectivo Bs',
             "nombre_corto"=>"Bolivares" 
         ]
         

        ];
        } catch (\Throwable $th) {
            //throw $th;
            info("error",["error"=>$th->getMessage()]);
      
    }
    return [];
}
}
