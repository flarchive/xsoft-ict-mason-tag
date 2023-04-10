<?php

/*
 * This file is part of xsoft/mason-tag.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->create('fof_mason_bytag', function (Blueprint $table) {
            $table->increments('id');
            $table->string('tag_name');
            $table->integer('tag_id');
            $table->string('field_name');
            $table->boolean('switch');
            $table->timestamps();
            $table->softDeletes();
        });
    },
    'down' => function (Builder $schema) {
        $schema->drop('fof_mason_bytag');
    },
];
