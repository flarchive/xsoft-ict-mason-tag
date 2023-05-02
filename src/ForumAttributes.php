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

use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Settings\SettingsRepositoryInterface;

class ForumAttributes
{
    public function __invoke(ForumSerializer $serializer): array
    {
        /**
         * @var $settings SettingsRepositoryInterface
         */
        $settings = resolve(SettingsRepositoryInterface::class);

        $actor = $serializer->getActor();

        $canFill = $actor->can('xsoft-mason-tag.fill-fields');
        $canSeeSome = $actor->can('xsoft-mason-tag.see-other-fields') || $actor->can('xsoft-mason-tag.see-own-fields');

        $attributes = [
            'canFillMasonFields' => $canFill,
        ];

        if ($canFill || $canSeeSome) {
            $attributes['xsoft-mason-tag.fields-section-title'] = $settings->get('xsoft-mason-tag.fields-section-title', '');
            $attributes['xsoft-mason-tag.column-count'] = (int) $settings->get('xsoft-mason-tag.column-count', 1);
        }

        if ($canFill) {
            $attributes['xsoft-mason-tag.by-tag'] = (bool) $settings->get('xsoft-mason-tag.by-tag', false);
            $attributes['xsoft-mason-tag.labels-as-placeholders'] = (bool) $settings->get('xsoft-mason-tag.labels-as-placeholders', false);
            $attributes['xsoft-mason-tag.tags-as-fields'] = (bool) $settings->get('xsoft-mason-tag.tags-as-fields', false);
            $attributes['xsoft-mason-tag.tags-field-name'] = $settings->get('xsoft-mason-tag.tags-field-name', '');
        }

        if ($canSeeSome) {
            $attributes['xsoft-mason-tag.fields-in-hero'] = (bool) $settings->get('xsoft-mason-tag.fields-in-hero', false);
            $attributes['xsoft-mason-tag.hide-empty-fields-section'] = (bool) $settings->get('xsoft-mason-tag.hide-empty-fields-section', false);
        }

        return $attributes;
    }
}
