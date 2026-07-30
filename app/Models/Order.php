<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id', 'customer_name', 'customer_email', 'customer_phone',
        'shipping_address', 'shipping_city', 'shipping_postal_code',
        'order_number', 'status', 'payment_status', 'payment_method',
        'courier_name', 'tracking_number', 'confirmed_at', 'shipped_at',
        'delivered_at', 'cancelled_at', 'subtotal',
        'discount', 'shipping', 'total', 'stock_deducted', 'ordered_at',
    ];

    protected function casts(): array
    {
        return [
            'subtotal' => 'decimal:2',
            'discount' => 'decimal:2',
            'shipping' => 'decimal:2',
            'total' => 'decimal:2',
            'stock_deducted' => 'boolean',
            'ordered_at' => 'datetime',
            'confirmed_at' => 'datetime',
            'shipped_at' => 'datetime',
            'delivered_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function histories()
    {
        return $this->hasMany(OrderStatusHistory::class)->latest();
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
