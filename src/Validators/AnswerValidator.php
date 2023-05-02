<?php

/*
 * This file is part of xsoft/mason-tag.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Xsoft\MasonTag\Validators;

use Flarum\Foundation\AbstractValidator;

class AnswerValidator extends AbstractValidator
{
    protected function getRules()
    {
        return [
            'content'      => 'required|string',
            'is_suggested' => 'sometimes|boolean',
        ];
    }
}
