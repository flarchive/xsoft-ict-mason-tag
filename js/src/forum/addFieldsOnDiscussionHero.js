import { extend, override } from 'flarum/common/extend';
import app from 'flarum/forum/app';
import DiscussionHero from 'flarum/common/components/DiscussionHero';
import Composer from 'flarum/components/Composer';
import FieldsViewer from './components/FieldsViewer';

export default function () {
    extend(DiscussionHero.prototype, 'items', function (items) {
        if (!this.attrs.discussion.canSeeMasonAnswers() || !app.forum.attribute('xsoft-mason-tag.fields-in-hero')) {
            return;
        }

        items.add('mason-fields', <FieldsViewer discussion={this.attrs.discussion} />);
    });

    override(Composer.prototype, 'animateToPosition', function (original, position) {
        // we need to detect if there are any mason fields present and if there are
        // add their height to the default height of the composer window
        const $composer = this.$().stop(true);
        const composerHeight = $composer.outerHeight();
        m.redraw(true);
        $composer.show();

        //const $composer = this.$();
        const headerHeight = this.$('.ComposerBody-header').outerHeight();

        if (position === Composer.PositionEnum.NORMAL && composerHeight < headerHeight) {
            this.height = headerHeight + composerHeight;
            this.updateHeight();
        }

        return original(position);
    });
}
