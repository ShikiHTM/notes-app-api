<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $duplicates = DB::table('users')
            ->select('display_name', DB::raw('COUNT(*) as count'))
            ->groupBy('display_name')
            ->having('count', '>', 1)
            ->pluck('display_name')
            ->all();

        if (!empty($duplicates)) {
            throw new \RuntimeException(
                'Cannot add unique constraint on users.display_name: duplicate values exist for ['
                . implode(', ', $duplicates)
                . ']. Resolve duplicates before running this migration.'
            );
        }

        Schema::table('users', function (Blueprint $table) {
            $table->unique('display_name');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['display_name']);
        });
    }
};
