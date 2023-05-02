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

use Flarum\Api\Controller\AbstractShowController;
use Flarum\Http\RequestUtil;
use Xsoft\MasonTag\Api\Serializers\FieldSerializer;
use Xsoft\MasonTag\Repositories\AnswerRepository;
use Xsoft\MasonTag\Repositories\FieldRepository;
use Xsoft\MasonTag\Validators\OrderValidator;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class AnswerOrderController extends AbstractShowController
{
    public $serializer = FieldSerializer::class;

    public $include = [
        'allAnswers',
    ];

    protected $validator;
    protected $answers;
    protected $fields;

    public function __construct(OrderValidator $validator, AnswerRepository $answers, FieldRepository $fields)
    {
        $this->validator = $validator;
        $this->answers = $answers;
        $this->fields = $fields;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        RequestUtil::getActor($request)->assertAdmin();

        $attributes = $request->getParsedBody();

        $this->validator->assertValid($attributes);

        $order = Arr::get($attributes, 'sort');

        $this->answers->sorting($order);

        $fieldId = Arr::get($request->getQueryParams(), 'id');

        // Return updated sorting values
        // Return the field instead of individual answers as it's easier to update the store client-side
        return $this->fields->findOrFail($fieldId);
    }
}
