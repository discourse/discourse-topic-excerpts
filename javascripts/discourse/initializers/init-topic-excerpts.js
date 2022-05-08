import { withPluginApi } from "discourse/lib/plugin-api";
import discourseComputed from "discourse-common/utils/decorators";
import { inject as service } from "@ember/service";

const enabledCategories = settings.enabled_categories
  .split("|")
  .map((id) => parseInt(id, 10))
  .filter((id) => id);

const enabledTags = settings.enabled_tags.split("|").filter((tag) => tag);

export default {
  name: "topic-excerpts-init",
  initialize() {
    withPluginApi("0.8.7", (api) => this.initWithApi(api));
  },

  initWithApi(api) {
    const site = api.container.lookup("site:main");

    api.modifyClass("component:topic-list-item", {
      excerptsRouter: service("router"),

      @discourseComputed(
        "excerptsRouter.currentRouteName",
        "excerptsRouter.currentRoute.attributes.category.id"
      )
      excerptsViewingCategoryId(currentRouteName, categoryId) {
        if (!currentRouteName.match(/^discovery\./)) {
          return;
        }
        return categoryId;
      },

      @discourseComputed(
        "excerptsRouter.currentRouteName",
        "excerptsRouter.currentRoute.attributes.id", // For discourse instances earlier than https://github.com/discourse/discourse/commit/f7b5ff39cf
        "excerptsRouter.currentRoute.attributes.tag.id"
      )
      excerptsViewingTag(currentRouteName, legacyTagId, tagId) {
        if (!currentRouteName.match(/^tag\.show/)) {
          return;
        }
        return tagId || legacyTagId;
      },

      @discourseComputed("excerptsViewingCategoryId", "excerptsViewingTag")
      expandPinned(viewingCategory, viewingTag) {
        const overrideEverywhere =
          enabledCategories.length === 0 && enabledTags.length === 0;

        const overrideInCategory = enabledCategories.includes(viewingCategory);
        const overrideInTag = enabledTags.includes(viewingTag);

        const overrideOnDevice = site.mobileView
          ? settings.show_excerpts_mobile
          : settings.show_excerpts_desktop;

        return (overrideEverywhere || overrideInTag || overrideInCategory) &&
          overrideOnDevice
          ? true
          : this._super();
      },
    });
  },
};
