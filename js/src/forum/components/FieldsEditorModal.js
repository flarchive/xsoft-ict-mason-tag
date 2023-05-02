import app from 'flarum/forum/app';
import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import FieldsEditor from './FieldsEditor';
import FieldsEditorByTags from './FieldsEditorByTags';
import ByTagsComposer from './ByTagsComposer';

export default class FieldsEditorModal extends Modal {
    oninit(vnode) {
        super.oninit(vnode);

        this.answers = this.attrs.discussion.masonAnswers();
        this.dirty = false;
        this.processing = false;
        this.tagRelationship = this.attrs.discussion.data.relationships.tags.data[0];
        this.byTagEnabled = app.data.resources[0].attributes['xsoft-mason-tag.by-tag'];

        // Stays null if the feature is not used
        this.tags = null;

        let ByTagsUnit = new ByTagsComposer();
        const matchingTags = ByTagsUnit.matchTags();
        this.myFields = [];

        // annoying way to get current Tag name, but it works
        let thisIncludes = this.attrs.discussion.payload.included;
        const findTag = thisIncludes.find((element) => element.type == 'tags');

        for (let i = 0; i < matchingTags.length; i++) {
            if (matchingTags[i].tagName == findTag.attributes.name) {
                this.myFields = matchingTags[i].fields;
            }
        }
    }

    title() {
        return app.translator.trans('xsoft-mason-tag.forum.answers-modal.edit-title', {
            title: <em>{this.attrs.discussion.title()}</em>,
        });
    }

    content() {
        return (
            <>
                <div className="Modal-body">
                    {
                        this.byTagEnabled ?
                        <FieldsEditorByTags
                            discussion={this.attrs.discussion} // Only for the tags feature
                            answers={this.answers}
                            bytags={this.myFields}
                            tags={this.tags}
                            onchange={this.answersChanged.bind(this)}
                        />
                        :
                        <FieldsEditor
                            discussion={this.attrs.discussion} // Only for the tags feature
                            answers={this.answers}
                            onchange={this.answersChanged.bind(this)}
                            ontagchange={(tags) => {
                                this.tags = tags;
                                this.dirty = true;
                            }}
                        />
                    }
                </div>
                <div className="Modal-footer">
                    <Button className="Button Button--primary" loading={this.processing} disabled={!this.dirty} onclick={this.saveAnswers.bind(this)}>
                        {app.translator.trans('xsoft-mason-tag.forum.answers-modal.save')}
                    </Button>
                </div>
            </>
        );
    }

    answersChanged(answers) {
        this.answers = answers;
        this.dirty = true;
    }

    saveAnswers() {
        this.processing = true;

        let tagRelationship = {
            data: this.tagRelationship,
        };
        let relationships = {
            tags: [tagRelationship],
            masonAnswers: this.answers,
        };

        // If tag edit is enabled, take care of them here as well
        // if (this.tags !== null) {
        //     relationships.tags = this.tags;
        // }

        // Use a temporary discussion object
        // Otherwise Flarum persists the relationships to the model while the request is still processing
        // Which causes errors with components outside of the modal redrawing and reading non-persisted data
        // The real discussion will be updated automatically by the store once the request completes which is all we need
        const temporaryDiscussion = app.store.createRecord('discussions');
        temporaryDiscussion.pushData({ id: this.attrs.discussion.id() });
        temporaryDiscussion.exists = true;

        temporaryDiscussion
            .save({
                relationships,
            })
            .then(() => {
                this.processing = false;
                app.modal.close();
                m.redraw();
            })
            .catch((err) => {
                this.processing = false;
                throw err;
            });
    }
}
