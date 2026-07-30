<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'price',
        'discount_price',
        'image',
        'images',
        'description',
        'user_id',
        'stock',
        'rating',
        'is_new',
        'is_top_rated',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'images' => 'array',
            'discount_price' => 'integer',
            'rating' => 'integer',
            'is_new' => 'boolean',
            'is_top_rated' => 'boolean',
        ];
    }
}
