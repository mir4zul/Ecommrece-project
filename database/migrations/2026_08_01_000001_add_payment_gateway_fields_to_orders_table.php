<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('gateway_session_id')->nullable()->after('payment_method');
            $table->string('gateway_transaction_id')->nullable()->unique()->after('gateway_session_id');
            $table->string('gateway_validation_id')->nullable()->after('gateway_transaction_id');
            $table->string('gateway_status')->nullable()->index()->after('gateway_validation_id');
            $table->json('gateway_response')->nullable()->after('gateway_status');
            $table->timestamp('paid_at')->nullable()->after('gateway_response');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'gateway_session_id',
                'gateway_transaction_id',
                'gateway_validation_id',
                'gateway_status',
                'gateway_response',
                'paid_at',
            ]);
        });
    }
};