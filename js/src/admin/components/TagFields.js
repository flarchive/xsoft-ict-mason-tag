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
        // result is from the API call, switch to that if nec;
        let tempStorage = app.store.all('mason-bytags');
        const fields = app.store.all('mason-fields');

        // match each Tag with the rows in the database that contain its fields
        this.matchingTags = tempStorage.filter((match) => match.data.attributes.tag_name == this.tag);
        // sort alphabetically
        this.matchingTags.sort(function (x, y) {
            let a = x.data.attributes.field_name,
                b = y.data.attributes.field_name;
            return a == b ? 0 : a > b ? 1 : -1;
        });

        // if a Tag has just been created, make its rows in the database
        if (this.matchingTags == false) {
            sortByAttribute(fields).map((field, i) => {
                let rec = app.store.createRecord('mason-bytags', {
                    attributes: {
                        tag_name: this.tag,
                        tag_id: this.tagID,
                        field_name: field.data.attributes.name,
                        switch: false,
                    },
                });
                this.matchingTags.push(rec);
                this.makeRow(rec.data.attributes, i);
            });
        }
    }

    makeRow(attributes, count) {
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
            // this.reInit(count);
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
