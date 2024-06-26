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
        Schema::create('range_produce_operations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('range_produce_id');
            $table->foreign("range_produce_id")
                ->references("id")
                ->on("range_produces");
            $table->unsignedBigInteger('operation_id');
            $table->foreign("operation_id")
                ->references("id")
                ->on("operations");
            $table->unsignedBigInteger('post_id');
            $table->foreign("post_id")
                ->references("id")
                ->on("posts");
            $table->unsignedBigInteger('machine_id');
            $table->foreign("machine_id")
                ->references("id")
                ->on("machines");
            $table->time("time");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('range_produce_operations');
    }
};
