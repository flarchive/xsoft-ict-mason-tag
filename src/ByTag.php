<?php

/*
 * This file is part of xsoft/mason-tag.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Xsoft\MasonTag;

use Flarum\Database\AbstractModel;
use Illuminate\Database\Eloquent\SoftDeletes;
use Xsoft\MasonTag\Field;

/**
 * @property string $tagname
 * @property int $tagid
 * @property string $field_name
 * @property \Illuminate\Database\Eloquent\Collection|ByTag[] $bytags
 */
class ByTag extends AbstractModel
{
    use SoftDeletes;

    public $timestamps = true;

    protected $table = 'fof_mason_bytag';

    protected $visible = [
        'tag_name',
        'tag_id',
        'field_name',
        'switch',
    ];

    protected $fillable = [
        'tag_name',
        'tag_id',
        'field_name',
        'switch',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function fields()
    {
        return $this->hasMany(Field::class);
    }
}
