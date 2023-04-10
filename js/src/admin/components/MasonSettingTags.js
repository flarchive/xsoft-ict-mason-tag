import app from 'flarum/admin/app';
import saveSettings from 'flarum/common/utils/saveSettings';
import Component from 'flarum/common/Component';
import Switch from 'flarum/common/components/Switch';
import TagFields from './TagFields'

export default class MasonSettingTags extends Component {
    oninit(vnode) {
        super.oninit(vnode);

        this.byTag = app.data.settings['xsoft-mason-tag.by-tag'] > 0;
        this.tagsList = [];
        const tags = app.store.all('tags');
        for ( let i = 0; i < tags.length; i++){   
            const name = tags[i].data.attributes.name;
            const id = tags[i].data.id;

            this.tagsList.push({name, id});
        }
    }

    view() {
        return (
            <div className="Mason-Container">
                <div className="Form-group">
                    <label>
                        <Switch state={this.byTag} onchange={this.updateSetting.bind(this, 'byTag', 'xsoft-mason-tag.by-tag')}>
                            {app.translator.trans('xsoft-mason-tag.admin.settings.by-tag')}
                        </Switch>
                    </label>
                </div>
                {
                    this.byTag && (
                        <div className="Form-group">
                            <label>{app.translator.trans('xsoft-mason-tag.admin.settings.by-tag-name')}</label>
                            {this.tagsList.map(tag => (
                                <div className="js-tag-data" data-id={tag.name}>
                                    <TagFields name={tag.name} id={tag.id} />
                                </div>
                            ))}
                        </div>
                    )
                }
            </div>
        );
    }

    /**
     * Updates setting in database.
     * @param attribute
     * @param setting
     * @param value
     */
    updateSetting(attribute, setting, value) {
        saveSettings({
            [setting]: value,
        });

        this[attribute] = value;
    }
}
