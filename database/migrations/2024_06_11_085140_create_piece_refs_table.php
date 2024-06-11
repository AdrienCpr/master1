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
        Schema::create('piece_refs', function (Blueprint $table) {
            $table->id();
            $table->integer("quantity");
            $table->unsignedBigInteger('piece_id');
            $table->foreign("piece_id")
                ->references("id")
                ->on("pieces")
                ->onDelete("cascade");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('piece_refs');
    }
};
