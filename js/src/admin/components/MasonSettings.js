import app from 'flarum/admin/app';
import saveSettings from 'flarum/common/utils/saveSettings';
import Component from 'flarum/common/Component';
import Select from 'flarum/common/components/Select';
import Switch from 'flarum/common/components/Switch';

export default class MasonSettings extends Component {
    oninit(vnode) {
        super.oninit(vnode);

        this.fieldsSectionTitle = app.data.settings['xsoft-mason-tag.fields-section-title'] || '';
        this.columnCount = app.data.settings['xsoft-mason-tag.column-count'] || 1;
        this.labelsAsPlaceholders = app.data.settings['xsoft-mason-tag.labels-as-placeholders'] > 0;
        this.fieldsInHero = app.data.settings['xsoft-mason-tag.fields-in-hero'] > 0;
        this.hideEmptyFieldsSection = app.data.settings['xsoft-mason-tag.hide-empty-fields-section'] > 0;
        this.tagsAsFields = app.data.settings['xsoft-mason-tag.tags-as-fields'] > 0;
        this.tagsFieldName = app.data.settings['xsoft-mason-tag.tags-field-name'] || '';

        this.columnOptions = {};

        for (let i = 1; i <= 3; i++) {
            this.columnOptions[i] = app.translator.trans('xsoft-mason-tag.admin.settings.n-columns', { count: i });
        }
    }

    view() {
        return (
            <div className="Mason-Container">
                <div className="Form-group">
                    <label>
                        {app.translator.trans('xsoft-mason-tag.admin.settings.fields-section-title')}
                        <input
                            className="FormControl"
                            value={this.fieldsSectionTitle}
                            placeholder={app.translator.trans('xsoft-mason-tag.admin.settings.fields-section-title-placeholder')}
                            onchange={(event) => {
                                this.updateSetting('fieldsSectionTitle', 'xsoft-mason-tag.fields-section-title', event.target.value);
                            }}
                        />
                    </label>
                    <div className="helpText">{app.translator.trans('xsoft-mason-tag.admin.settings.fields-section-title-help')}</div>
                </div>
                <div className="Form-group">
                    <label>
                        {app.translator.trans('xsoft-mason-tag.admin.settings.column-count')},
                        <Select
                            options={this.columnOptions}
                            value={this.columnCount}
                            onchange={this.updateSetting.bind(this, 'columnCount', 'xsoft-mason-tag.column-count')}
                        />
                    </label>
                </div>
                <div className="Form-group">
                    <label>
                        <Switch
                            state={this.labelsAsPlaceholders}
                            onchange={this.updateSetting.bind(this, 'labelsAsPlaceholders', 'xsoft-mason-tag.labels-as-placeholders')}
                        >
                            {app.translator.trans('xsoft-mason-tag.admin.settings.labels-as-placeholders')}
                        </Switch>
                    </label>
                    <div className="helpText">{app.translator.trans('xsoft-mason-tag.admin.settings.labels-as-placeholders-help')}</div>
                </div>
                <div className="Form-group">
                    <label>
                        <Switch state={this.fieldsInHero} onchange={this.updateSetting.bind(this, 'fieldsInHero', 'xsoft-mason-tag.fields-in-hero')}>
                            {app.translator.trans('xsoft-mason-tag.admin.settings.fields-in-hero')}
                        </Switch>
                    </label>
                </div>
                <div className="Form-group">
                    <label>
                        <Switch
                            state={this.hideEmptyFieldsSection}
                            onchange={this.updateSetting.bind(this, 'hideEmptyFieldsSection', 'xsoft-mason-tag.hide-empty-fields-section')}
                        >
                            {app.translator.trans('xsoft-mason-tag.admin.settings.hide-empty-fields-section')}
                        </Switch>
                    </label>
                    <div className="helpText">{app.translator.trans('xsoft-mason-tag.admin.settings.hide-empty-fields-section-help')}</div>
                </div>
                <div className="Form-group">
                    <label>
                        <Switch state={this.tagsAsFields} onchange={this.updateSetting.bind(this, 'tagsAsFields', 'xsoft-mason-tag.tags-as-fields')}>
                            {app.translator.trans('xsoft-mason-tag.admin.settings.tags-as-field')}
                        </Switch>
                    </label>
                    <div className="helpText">{app.translator.trans('xsoft-mason-tag.admin.settings.tags-as-field-help')}</div>
                </div>
                {this.tagsAsFields && (
                    <div className="Form-group">
                        <label>{app.translator.trans('xsoft-mason-tag.admin.settings.tags-field-name')}</label>
                        <input
                            className="FormControl"
                            value={this.tagsFieldName}
                            placeholder={app.translator.trans('xsoft-mason-tag.admin.settings.tags-field-name-placeholder')}
                            onchange={(event) => {
                                this.updateSetting('tagsFieldName', 'xsoft-mason-tag.tags-field-name', event.target.value);
                            }}
                        />
                    </div>
                )}
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
