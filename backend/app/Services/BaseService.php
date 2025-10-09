<?php

namespace App\Services;

use App\Helpers\DataFetcher;
use App\Traits\Encryption;
use App\Helpers\AddressHelper;

class BaseService
{
    use Encryption; 

    private $dataFetcher;
    private $addressHelper;

    public function __construct(DataFetcher $dataFetcher, AddressHelper $addressHelper) {
        $this->dataFetcher = $dataFetcher;
        $this->addressHelper = $addressHelper;
    }

    public function getDefiner($value, $default)
    {
        return $this->dataFetcher->getAllDefiners($value, $default);
    }

    public function getFullAddress($additional_address, $addressWhere)
    {
        return $this->addressHelper->getFullAddress($additional_address, $addressWhere);
    }
}
