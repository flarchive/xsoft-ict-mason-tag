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

use Flarum\Api\Controller\ShowForumController;
use Flarum\User\User;
use Psr\Http\Message\ServerRequestInterface;
use Xsoft\MasonTag\Repositories\ByTagRepository;
use Xsoft\MasonTag\Repositories\FieldRepository;

class LoadForumFieldsRelationship
{
    public function __invoke(ShowForumController $controller, &$data, ServerRequestInterface $request)
    {
        /**
         * @var User $actor
         */
        $actor = $request->getAttribute('actor');

        /**
         * @var FieldRepository $fields
         */
        $fields = resolve(FieldRepository::class);

        /**
         * @var ByTagRepository $fields
         */
        $bytags = resolve(ByTagRepository::class);

        // Fields need to be pre-loaded for the discussion composer, and also to be able to show empty fields on discussions
        // We first try the permissions the users are most likely to have
        if ($actor->can('xsoft-mason-tag.see-other-fields') || $actor->can('xsoft-mason-tag.fill-fields') || $actor->can('xsoft-mason-tag.see-own-fields')) {
            $data['masonFields'] = $fields->all();
            $data['masonByTags'] = $bytags->all();
        } else {
            // Fill empty set. Without this, installs with visible notices will get "Undefined index: masonFields"
            $data['masonFields'] = [];
            $data['masonByTags'] = [];
        }
    }
}
