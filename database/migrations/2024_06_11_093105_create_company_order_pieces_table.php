<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('company_order_pieces', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('piece_id');
            $table->unsignedBigInteger('company_order_id');
            $table->foreign("piece_id")
                ->references("id")
                ->on("pieces")
                ->onDelete("cascade");
            $table->foreign("company_order_id")
                ->references("id")
                ->on("company_orders")
                ->onDelete("cascade");
            $table->float("price");
            $table->integer("quantity");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_order_pieces');
    }
};
