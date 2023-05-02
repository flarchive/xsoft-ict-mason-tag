import app from 'flarum/admin/app';
import icon from 'flarum/common/helpers/icon';
import Component from 'flarum/common/Component';
import Switch from 'flarum/common/components/Switch';
import sortByAttribute from '@common/helpers/sortByAttribute';

export default class TagFields extends Component {
    oninit(vnode) {
        super.oninit(vnode);
        this.init();
    }

    init() {
        app.request({
            method: 'GET',
            url: app.forum.attribute('apiUrl') + '/xsoft/mason-tag/bytag',
        }).then((result) => {
            app.store.pushPayload(result);
            this.initRows();
        });

        this.tag = this.attrs.name;
        this.tagID = this.attrs.id;
        this.dirty = false;
        this.processing = false;
        this.toggleFields = false;
        this.dataRow;
        this.fieldsList = [];
        this.matchingTags = [];
    }

    initRows() {
        const fields = sortByAttribute(app.store.all('mason-fields'));
        const bytags = app.store.all('mason-bytags').filter(bytag => bytag.data.attributes.tag_name == this.tag)

        // if a Tag or Field has just been created, make its rows in the database
        fields.map((field) => {
            const existed = bytags.find(bytag => bytag.data.attributes.field_name == field.data.attributes.name);
            if (!existed) {
                let rec = app.store.createRecord('mason-bytags', {
                    attributes: {
                        tag_name: this.tag,
                        tag_id: this.tagID,
                        field_name: field.data.attributes.name,
                        switch: false,
                    },
                });
                this.makeRow(rec.data.attributes);
            }
        });

        // if a field has been deleted, remove it in the database
        bytags.filter(bytag => !fields.find(field => field.data.attributes.name === bytag.data.attributes.field_name)).map(bytag => {
            this.deleteRow(bytag)
        })

        this.matchingTags = bytags
        // sort alphabetically
        this.matchingTags.sort(function (x, y) {
            let a = x.data.attributes.field_name,
                b = y.data.attributes.field_name;
            return a == b ? 0 : a > b ? 1 : -1;
        });
        m.redraw();
    }

    makeRow(attributes) {
        app.request({
            method: 'POST',
            url: app.forum.attribute('apiUrl') + '/xsoft/mason-tag/bytag',
            body: {
                data: {
                    attributes,
                },
            },
        }).then((result) => {
            app.store.pushPayload(result);
            return;
        });
    }

    updateRow(field, state) {
        app.request({
            method: 'PATCH',
            url: app.forum.attribute('apiUrl') + '/xsoft/mason-tag/bytag/' + field.data.id,
            body: {
                data: {
                    attributes: {
                        switch: state,
                    },
                },
            },
        }).then((result) => {
            app.store.pushPayload(result);
            m.redraw();
        });
    }

    deleteRow(bytag) {
        app.request({
            method: 'DELETE',
            url: app.forum.attribute('apiUrl') + '/xsoft/mason-tag/bytag/' + bytag.data.id,
        }).then((result) => {
            app.store.remove(bytag);
        });
    }

    reInit(num) {
        // re-initialize once all the rows are made per tag;
        if (app.store.all('mason-fields').length == num) {
            this.init();
        }
    }

    view() {
        return (
            <div className='Mason-Tags-Dropdown'>
                <div className='Button Button--block Mason-Box-Header' onclick={() => this.toggleFields = !this.toggleFields}>
                    <div className='Mason-Box-Header-Title'>{this.tag}</div>
                    <div>{icon('fas fa-chevron-' + (this.toggleFields ? 'up' : 'down'))}</div>
                </div>
                {this.toggleFields && this.matchingTags.map(field => (
                    <div className='Form-group'>
                        <label>
                            <Switch
                                state={field.data.attributes.switch}
                                onchange={this.updateRow.bind(this, field)}
                            >
                                {field.data.attributes.field_name}
                            </Switch>
                        </label>
                    </div>
                ))}
            </div>
        );
    }
}
