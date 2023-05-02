<?php

/*
 * This file is part of xsoft/mason-tag.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Xsoft\MasonTag\Api\Serializers;

use Flarum\Api\Serializer\AbstractSerializer;
use Xsoft\MasonTag\ByTag;
use Xsoft\MasonTag\Repositories\FieldRepository;
use Tobscure\JsonApi\Collection;
use Tobscure\JsonApi\Relationship;

class ByTagSerializer extends AbstractSerializer
{
    protected $type = 'mason-bytags';

    /**
     * Get the default set of serialized attributes for a model.
     *
     * @param ByTag|array $model
     *
     * @return array
     */
    protected function getDefaultAttributes($model)
    {
        return $model->toArray();
    }

    /**
     * @param ByTag $model
     *
     * @return Relationship
     */
    public function allFields($model)
    {
        $actor = $this->getActor();

        if (!$actor || !$actor->isAdmin()) {
            return null;
        }

        /**
         * @var $fields FieldRepository
         */
        $fields = resolve(FieldRepository::class);

        return new Relationship(new Collection($fields->all($model), resolve(FieldSerializer::class)));
    }
}
