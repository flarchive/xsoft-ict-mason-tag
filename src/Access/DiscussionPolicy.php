<?php

/*
 * This file is part of xsoft/mason-tag.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Xsoft\MasonTag\Access;

use Flarum\Discussion\Discussion;
use Flarum\User\Access\AbstractPolicy;
use Flarum\User\User;

class DiscussionPolicy extends AbstractPolicy
{
    public function seeMasonAnswers(User $actor, Discussion $discussion)
    {
        if ($actor->can('xsoft-mason-tag.see-other-fields')) {
            return $this->allow();
        }

        if ($actor->can('xsoft-mason-tag.see-own-fields') && $discussion->user_id == $actor->id) {
            return $this->allow();
        }
    }

    public function fillMasonAnswers(User $actor, Discussion $discussion)
    {
        if ($actor->can('xsoft-mason-tag.fill-fields')) {
            return $this->allow();
        }
    }

    public function updateMasonAnswers(User $actor, Discussion $discussion)
    {
        if ($actor->can('xsoft-mason-tag.update-other-fields')) {
            return $this->allow();
        }

        if ($actor->can('xsoft-mason-tag.update-own-fields') && $discussion->user_id == $actor->id) {
            return $this->allow();
        }
    }
}
