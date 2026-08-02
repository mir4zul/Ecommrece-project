<?php

return [
    'free_offer' => env('SHIPPING_FREE_OFFER', false),
    'inside_dhaka_fee' => (float) env('SHIPPING_INSIDE_DHAKA_FEE', 100),
    'outside_dhaka_fee' => (float) env('SHIPPING_OUTSIDE_DHAKA_FEE', 150),
];