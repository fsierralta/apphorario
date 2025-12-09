<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\FormaPago;

class FormaPagoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $data=[
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

           
            
            try {
                //code...
                
             foreach($data as $item){
                 FormaPago::create($item); 
             }
                //throw $th;
            }
            catch(\Exception $th){
                echo $th->getMessage();
            }
        }

       
      

    
}
