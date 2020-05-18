import { withPluginApi } from "discourse/lib/plugin-api";
import discourseComputed from "discourse-common/utils/decorators";
import { inject as service } from "@ember/service";

const enabledCategories = settings.enabled_categories
  .split("|")
  .map((id) => parseInt(id, 10))
  .filter((id) => id);

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
        if (!currentRouteName.match(/^discovery\./)) return;
        return categoryId;
      },

      @discourseComputed("excerptsViewingCategoryId")
      expandPinned(viewingCategory) {
        const overrideInCategory =
          enabledCategories.length === 0 ||
          enabledCategories.includes(viewingCategory);
        const overrideOnDevice = site.mobileView
          ? settings.show_excerpts_mobile
          : settings.show_excerpts_desktop;

        return overrideInCategory && overrideOnDevice ? true : this._super();
      },
    });
  },
};
