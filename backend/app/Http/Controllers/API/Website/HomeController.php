<?php

namespace App\Http\Controllers\API\Website;

use App\Http\Controllers\Controller;
use App\Services\Website\HomeService; 
use Illuminate\Http\Request;

class HomeController extends Controller
{
    protected $homeService;

    public function __construct(HomeService $homeService)
    {
        $this->homeService = $homeService;
    }

    public function getProductBestSeller(Request $request)
    {
        $response = $this->homeService->getProductBestSeller($request);

        return $response;
    } 
    
    public function getProductNewArrival()
    {
        $response = $this->homeService->getProductNewArrival();

        return $response;
    }

    public function getProductAll()
    {
        $response = $this->homeService->getProductAll();

        return $response;
    }
}