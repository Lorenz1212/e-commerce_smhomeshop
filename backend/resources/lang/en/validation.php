<?php

return [
    'required' => 'The :attribute field is required.',
    'unique' => 'The :attribute has already been taken.',
    'max' => [
        'string' => 'The :attribute may not be greater than :max characters.',
        'file' => 'The :attribute may not be greater than :max kilobytes.',
    ],
    'min' => [
        'string' => 'The :attribute must be at least :min characters.',
        'file' => 'The :attribute must be at least :min kilobytes.',
    ],
    'email' => 'The :attribute must be a valid email address.',
    'confirmed' => 'The :attribute confirmation does not match.',
    'same' => 'The :attribute and :other must match.',
];
