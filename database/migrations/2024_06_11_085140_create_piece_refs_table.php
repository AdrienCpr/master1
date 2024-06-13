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
            $table->unsignedBigInteger('piece_to_create_id');
            $table->unsignedBigInteger('piece_need_id');
            $table->foreign("piece_to_create_id")
                ->references("id")
                ->on("pieces")
                ->onDelete("cascade");
            $table->foreign("piece_need_id")
                ->references("id")
                ->on("pieces")
                ->onDelete("cascade");
            $table->integer("quantity");
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
