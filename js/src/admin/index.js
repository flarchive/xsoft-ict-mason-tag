import app from 'flarum/admin/app';

import Answer from '@common/models/Answer';
import Field from '@common/models/Field';
import ByTag from '@common/models/ByTag';
import MasonFieldsPage from './pages/MasonFieldsPage';

app.initializers.add('xsoft-ict-mason-tag', () => {
    app.store.models['mason-fields'] = Field;
    app.store.models['mason-answers'] = Answer;
    app.store.models['mason-bytags'] = ByTag;

    app.extensionData
        .for('xsoft-ict-mason-tag')
        .registerPage(MasonFieldsPage)
        .registerPermission(
            {
                icon: 'fas fa-eye',
                label: app.translator.trans('xsoft-mason-tag.admin.permissions.see-own-fields'),
                permission: 'xsoft-mason-tag.see-own-fields',
            },
            'view'
        )
        .registerPermission(
            {
                icon: 'fas fa-eye',
                label: app.translator.trans('xsoft-mason-tag.admin.permissions.see-other-fields'),
                permission: 'xsoft-mason-tag.see-other-fields',
                allowGuest: true,
            },
            'view'
        )
        .registerPermission(
            {
                icon: 'fas fa-tasks',
                label: app.translator.trans('xsoft-mason-tag.admin.permissions.fill-fields'),
                permission: 'xsoft-mason-tag.fill-fields',
            },
            'reply'
        )
        .registerPermission(
            {
                icon: 'fas fa-edit',
                label: app.translator.trans('xsoft-mason-tag.admin.permissions.update-own-fields'),
                permission: 'xsoft-mason-tag.update-own-fields',
            },
            'reply'
        )
        .registerPermission(
            {
                icon: 'fas fa-edit',
                label: app.translator.trans('xsoft-mason-tag.admin.permissions.update-other-fields'),
                permission: 'xsoft-mason-tag.update-other-fields',
                allowGuest: true,
            },
            'moderate'
        )
        .registerPermission(
            {
                icon: 'fas fa-forward',
                label: app.translator.trans('xsoft-mason-tag.admin.permissions.skip-required-fields'),
                permission: 'xsoft-mason-tag.skip-required-fields',
            },
            'moderate'
        );
});
