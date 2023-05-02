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

use Flarum\Api\Controller\CreateDiscussionController;
use Flarum\Api\Controller\ListDiscussionsController;
use Flarum\Api\Controller\ShowDiscussionController;
use Flarum\Api\Controller\ShowForumController;
use Flarum\Api\Controller\UpdateDiscussionController;
use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Discussion\Discussion;
use Flarum\Discussion\Event\Saving;
use Flarum\Extend;
use Xsoft\MasonTag\Api\Serializers\AnswerSerializer;
use Xsoft\MasonTag\Api\Serializers\ByTagSerializer;
use Xsoft\MasonTag\Api\Serializers\FieldSerializer;
use Xsoft\MasonTag\Listeners\DiscussionSaving;

return [
    (new Extend\Frontend('forum'))
        ->css(__DIR__.'/resources/less/forum.less')
        ->js(__DIR__.'/js/dist/forum.js'),

    (new Extend\Frontend('admin'))
        ->css(__DIR__.'/resources/less/admin.less')
        ->js(__DIR__.'/js/dist/admin.js'),

    (new Extend\Routes('api'))
        // Fields
        ->post('/xsoft/mason-tag/fields/order', 'xsoft-mason-tag.api.fields.order', Api\Controllers\FieldOrderController::class)
        ->get('/xsoft/mason-tag/fields', 'xsoft-mason-tag.api.fields.index', Api\Controllers\FieldIndexController::class)
        ->post('/xsoft/mason-tag/fields', 'xsoft-mason-tag.api.fields.store', Api\Controllers\FieldStoreController::class)
        ->patch('/xsoft/mason-tag/fields/{id:[0-9]+}', 'xsoft-mason-tag.api.fields.update', Api\Controllers\FieldUpdateController::class)
        ->delete('/xsoft/mason-tag/fields/{id:[0-9]+}', 'xsoft-mason-tag.api.fields.delete', Api\Controllers\FieldDeleteController::class)

        // Answers
        ->post('/xsoft/mason-tag/fields/{id:[0-9]+}/answers/order', 'xsoft-mason-tag.api.answers.order', Api\Controllers\AnswerOrderController::class)
        ->post('/xsoft/mason-tag/fields/{id:[0-9]+}/answers', 'xsoft-mason-tag.api.answers.create', Api\Controllers\AnswerStoreController::class)
        ->patch('/xsoft/mason-tag/answers/{id:[0-9]+}', 'xsoft-mason-tag.api.answers.update', Api\Controllers\AnswerUpdateController::class)
        ->delete('/xsoft/mason-tag/answers/{id:[0-9]+}', 'xsoft-mason-tag.api.answers.delete', Api\Controllers\AnswerDeleteController::class)

        // ByTag // will have to update regex to match names for patch and delete
        ->post('/xsoft/mason-tag/bytag/order', 'xsoft-mason-tag.api.bytag.order', Api\Controllers\ByTagOrderController::class)
        ->get('/xsoft/mason-tag/bytag', 'xsoft-mason-tag.api.bytag.index', Api\Controllers\ByTagIndexController::class)
        ->post('/xsoft/mason-tag/bytag', 'xsoft-mason-tag.api.bytag.store', Api\Controllers\ByTagStoreController::class)
        ->patch('/xsoft/mason-tag/bytag/{id:[0-9]+}', 'xsoft-mason-tag.api.bytag.update', Api\Controllers\ByTagUpdateController::class)
        ->delete('/xsoft/mason-tag/bytag/{id:[0-9]+}', 'xsoft-mason-tag.api.bytag.delete', Api\Controllers\ByTagDeleteController::class),

    new Extend\Locales(__DIR__.'/resources/locale'),

    (new Extend\ApiController(ShowForumController::class))
        ->addInclude('masonFields.suggestedAnswers')
        ->addInclude('masonByTags')
        ->prepareDataForSerialization(LoadForumFieldsRelationship::class),

    (new Extend\ApiSerializer(ForumSerializer::class))
        ->hasMany('masonFields', FieldSerializer::class)
        ->attributes(ForumAttributes::class),

    (new Extend\ApiSerializer(ForumSerializer::class))
        ->hasMany('masonByTags', ByTagSerializer::class)
        ->attributes(ForumAttributes::class),

    (new Extend\ApiController(ListDiscussionsController::class))
        ->addInclude('masonAnswers.field'),

    (new Extend\ApiController(ShowDiscussionController::class))
        ->addInclude('masonAnswers.field'),

    (new Extend\ApiController(CreateDiscussionController::class))
        ->addInclude('masonAnswers.field'),

    (new Extend\ApiController(UpdateDiscussionController::class))
        ->addInclude('masonAnswers.field'),

    (new Extend\ApiSerializer(DiscussionSerializer::class))
        ->hasMany('masonAnswers', AnswerSerializer::class)
        ->attributes(function (DiscussionSerializer $serializer, Discussion $discussion): array {
            $canSee = $serializer->getActor()->can('seeMasonAnswers', $discussion);

            if (!$canSee) {
                // Will cause a skip of the relationship retrieval
                $discussion->setRelation('masonAnswers', null);
            }

            return [
                'canSeeMasonAnswers'    => $canSee,
                'canUpdateMasonAnswers' => $serializer->getActor()->can('updateMasonAnswers', $discussion),
            ];
        }),

    (new Extend\Model(Discussion::class))
        ->relationship('masonAnswers', function (Discussion $discussion) {
            return $discussion->belongsToMany(Answer::class, 'fof_mason_discussion_answer', 'discussion_id', 'answer_id')
                ->withTimestamps()
                ->whereHas('field', function ($query) {
                    // Only load answers to fields that have not been deleted
                    $query->whereNull('deleted_at');
                });
        }),

    (new Extend\Event())
        ->listen(Saving::class, DiscussionSaving::class),

    (new Extend\Policy())
        ->modelPolicy(Answer::class, Access\AnswerPolicy::class)
        ->modelPolicy(Discussion::class, Access\DiscussionPolicy::class)
        ->modelPolicy(Field::class, Access\FieldPolicy::class),
];
