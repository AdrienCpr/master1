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
        Schema::create('range_operations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('range_id');
            $table->unsignedBigInteger('operation_id');
            $table->foreign("range_id")
                ->references("id")
                ->on("ranges")
                ->onDelete("cascade");
            $table->foreign("operation_id")
                ->references("id")
                ->on("operations")
                ->onDelete("cascade");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('range_operations');
    }
};
