<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('courier_booking_status')->nullable()->after('tracking_number');
            $table->string('courier_booking_reference')->nullable()->after('courier_booking_status');
            $table->text('courier_booking_error')->nullable()->after('courier_booking_reference');
            $table->timestamp('courier_booked_at')->nullable()->after('courier_booking_error');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['courier_booking_status', 'courier_booking_reference', 'courier_booking_error', 'courier_booked_at']);
        });
    }
};
