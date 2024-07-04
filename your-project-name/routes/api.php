<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Igrac;
use App\Models\User;
use App\Http\Controllers\API\UserController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::get('/test',function (Request $request){
    $connection = DB::connection('mongodb');
    $msg = 'Radiiii';
    try{
        $connection->command(['ping'=>1]);
    }
    catch(\Exception $e){
        $msg='Duvaj ga Fara'.$e->getMessage();
    }
    return ["msg"=>$msg];

});

Route::post('/Kreiranje_Igraci',function(Request $request){
    try{
        $success=Igrac::create([
            'imeprezime' => 'Bovb',
            'broj' => '4',
            'statistika' => 'blabla',
        ]);
        $msg='OK';


    }catch(\Exception $e){
        $msg = 'Greska'.$e->getMessage;
    }
});

// Route::post('/kreiraj_usera',function(Request $request){
//     try{
//         $success=User::create([
//             'name' => 'Bovb',
//             'email' => 'bobi@gmail.com',
//             'password' => 'blabla',
//         ]);
//         $msg='OK';


//     }catch(\Exception $e){
//         $msg = 'Greska'.$e->getMessage;
//     }
// });


Route::get('/igraci/broj/{broj}', function ($broj) {
    $igraci = Igrac::where('broj', $broj)->get();
    return response()->json($igraci);
});

//Route::post('/register',[AuthController::class,"register"]);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/auth/register', [UserController::class, 'createUser']);
Route::post('/auth/login', [UserController::class, 'loginUser']);

