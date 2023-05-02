<?php

/*
 * This file is part of xsoft/mason-tag.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Xsoft\MasonTag\Api\Controllers;

use Flarum\Api\Controller\AbstractDeleteController;
use Flarum\Http\RequestUtil;
use Xsoft\MasonTag\Repositories\ByTagRepository;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;

class ByTagDeleteController extends AbstractDeleteController
{
    protected $bytags;

    public function __construct(ByTagRepository $bytags)
    {
        $this->bytags = $bytags;
    }

    protected function delete(ServerRequestInterface $request)
    {
        RequestUtil::getActor($request)->assertAdmin();

        $id = Arr::get($request->getQueryParams(), 'id');

        $field = $this->bytags->findOrFail($id);

        $this->bytags->delete($field);
    }
}
