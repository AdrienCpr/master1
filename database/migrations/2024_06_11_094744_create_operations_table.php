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
        Schema::create('operations', function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->time("time");
            $table->unsignedBigInteger('post_id');
            $table->unsignedBigInteger('machine_id');
            $table->foreign("post_id")
                ->references("id")
                ->on("posts");
            $table->foreign("machine_id")
                ->references("id")
                ->on("machines");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('operations');
    }
};
