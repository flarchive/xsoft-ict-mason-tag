import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';

export default class ByTagsComposer extends Component {
    matchTags() {
        // build an array of Tags with the fields that match them

        const tags = app.store.all('tags');
        let tagsList = [];

        let tempStorage = app.store.all('mason-bytags');
        var usedList = [];

        for (let i = 0; i < tags.length; i++) {
            let fields = [];
            let fieldIDs = [];
            var tagName = tags[i].data.attributes.name;
            let tagsObj = {};

            usedList = tempStorage.filter((match) => match.data.attributes.tag_name == tagName && match.data.attributes.switch == true);

            // It may be better to create an object with all the Tags represented
            // even if they have no fields enabled. Turn this conditional back off if so.
            if (usedList[0]) {
                usedList.forEach(function (e) {
                    fields.push(e.data.attributes.field_name);
                    fieldIDs.push(e.data.id);
                });

                tagsObj = { tagName, fields, fieldIDs };
                tagsList.push(tagsObj);
            }
        }

        return tagsList;
    }
}
