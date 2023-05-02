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

use Flarum\Api\Controller\AbstractListController;
use Flarum\Http\RequestUtil;
use Xsoft\MasonTag\Api\Serializers\ByTagSerializer;
use Xsoft\MasonTag\Repositories\ByTagRepository;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class ByTagIndexController extends AbstractListController
{
    public $serializer = ByTagSerializer::class;

    // public $include = [
    //     'allAnswers',
    // ];

    protected $bytags;

    public function __construct(ByTagRepository $bytags)
    {
        $this->bytags = $bytags;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        RequestUtil::getActor($request)->assertAdmin();

        return $this->bytags->all();
    }
}
