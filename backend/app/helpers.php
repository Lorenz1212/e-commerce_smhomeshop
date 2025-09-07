<?php
if (! function_exists('c')) {
    function c($key, $default = null) {
        return config('constant.' . $key, $default);
    }
}

if (! function_exists('company')) {
    function company($key, $default = null) {
        return config('company.' . $key, $default);
    }
}

if (! function_exists('to_snake_case')) {
    function to_snake_case($string)
    {
        return strtolower(str_replace(' ', '_', $string));
    }
}

if (! function_exists('_lang_message')) {
    function _lang_message($key, $array=false)
    {   
        if($array){
            return __('messages.'.$key, $array);
        }else{
            return __('messages.'.$key);
        }
        
    }
}

if (! function_exists('_lang_validation')) {
    function _lang_validation($key, $array)
    {
        if($array){
            return __('validation.'.$key, $array);
        }else{
            return __('messages.'.$key);
        }
    }
}