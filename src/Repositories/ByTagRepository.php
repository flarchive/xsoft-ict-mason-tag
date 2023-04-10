<?php

/*
 * This file is part of xsoft/mason-tag.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Xsoft\MasonTag\Repositories;

use Xsoft\MasonTag\ByTag;
use Xsoft\MasonTag\Validators\ByTagValidator;
use Illuminate\Cache\Repository;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class ByTagRepository
{
    protected $bytag;
    protected $validator;
    protected $cache;

    public function __construct(ByTag $bytag, ByTagValidator $validator, Repository $cache)
    {
        $this->bytag = $bytag;
        $this->validator = $validator;
        $this->cache = $cache;
    }

    protected function query(): Builder
    {
        return $this->bytag->newQuery();
    }

    /**
     * @param $id
     *
     * @return ByTag|Model
     */
    public function findOrFail($id): ByTag
    {
        return $this->bytag->newQuery()->findOrFail($id);
    }

    /**
     * @return Collection|ByTag[]
     */
    public function all(): Collection
    {
        return $this->query()->get();
    }

    public function store(array $attributes): ByTag
    {
        $this->validator->assertValid($attributes);

        $bytag = new ByTag($attributes);
        $bytag->save();

        return $bytag;
    }

    public function update(ByTag $bytag, array $attributes): ByTag
    {
        $this->validator->assertValid($attributes);

        $bytag->fill($attributes);
        $bytag->save();

        return $bytag;
    }

    public function delete(ByTag $bytag)
    {
        $bytag->delete();
    }

    public function sorting(array $sorting)
    {
        foreach ($sorting as $i => $bytagId) {
            $this->bytag->newQuery()->where('id', $bytagId)->update(['sort' => $i]);
        }
    }
}
