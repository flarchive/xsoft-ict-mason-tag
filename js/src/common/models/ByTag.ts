import Model from 'flarum/common/Model';

export default class ByTag extends Model {
    tag_name = Model.attribute('tag_name');
    tag_id = Model.attribute('tag_id');
    field_name = Model.attribute('field_name');
    switch = Model.attribute('switch');

    apiEndpoint() {
        return '/xsoft/mason-tag/bytags' + (this.exists ? '/' + this.data.id : '');
    }
}
