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
use Xsoft\MasonTag\Api\Serializers\ByTagSerializer;
use Xsoft\MasonTag\Repositories\ByTagRepository;
use Xsoft\MasonTag\Validators\OrderValidator;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class ByTagOrderController extends AbstractListController
{
    public $serializer = ByTagSerializer::class;

    protected $validator;
    protected $bytags;

    public function __construct(OrderValidator $validator, ByTagRepository $bytags)
    {
        $this->validator = $validator;
        $this->bytags = $bytags;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $request->getAttribute('actor')->assertAdmin();

        $attributes = $request->getParsedBody();

        $this->validator->assertValid($attributes);

        $order = Arr::get($attributes, 'sort');

        $this->bytags->sorting($order);

        // Return updated sorting values
        return $this->bytags->all();
    }
}
