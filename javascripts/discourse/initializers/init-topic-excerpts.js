import { getOwner } from "@ember/application";
import { service } from "@ember/service";
import { withPluginApi } from "discourse/lib/plugin-api";
import { withSilencedDeprecations } from "discourse-common/lib/deprecated";
import discourseComputed from "discourse-common/utils/decorators";

const enabledCategories = settings.enabled_categories
  .split("|")
  .map((id) => parseInt(id, 10))
  .filter((id) => id);
const enabledTags = settings.enabled_tags.split("|").filter((tag) => tag);

export default {
  name: "topic-excerpts-init",

  initialize() {
    withPluginApi("1.34.0", (api) => {
      const discovery = api.container.lookup("service:discovery");

      api.registerValueTransformer(
        "topic-list-item-expand-pinned",
        ({ value, context }) => {
          const overrideEverywhere =
            enabledCategories.length === 0 && enabledTags.length === 0;
          const overrideInCategory = enabledCategories.includes(
            discovery.category?.id
          );
          const overrideInTag = enabledTags.includes(discovery.tag?.id);
          const overrideOnDevice = context.mobileView
            ? settings.show_excerpts_mobile
            : settings.show_excerpts_desktop;

          const prefersExcerpt = api.container.lookup(
            "service:excerpt-state"
          ).prefersExcerpt;

          if (
            (overrideEverywhere || overrideInTag || overrideInCategory) &&
            overrideOnDevice
          ) {
            return prefersExcerpt;
          }
          return value; // Return default value
        }
      );

      // TODO: cvx - remove after the glimmer topic list transition
      withSilencedDeprecations("discourse.hbr-topic-list-overrides", () => {
        api.modifyClass("component:topic-list-item", {
          pluginId: "discourse-topic-excerpts",

          excerptsRouter: service("router"),
          excerptState: service("excerpt-state"),

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

          @discourseComputed(
            "excerptsViewingCategoryId",
            "excerptsViewingTag",
            "excerptState.prefersExcerpt"
          )
          expandPinned(viewingCategory, viewingTag, prefersExcerpt) {
            const overrideEverywhere =
              enabledCategories.length === 0 && enabledTags.length === 0;

            const overrideInCategory =
              enabledCategories.includes(viewingCategory);
            const overrideInTag = enabledTags.includes(viewingTag);

            const overrideOnDevice = getOwner(this).lookup("service:site")
              .mobileView
              ? settings.show_excerpts_mobile
              : settings.show_excerpts_desktop;

            return (overrideEverywhere ||
              overrideInTag ||
              overrideInCategory) &&
              overrideOnDevice
              ? prefersExcerpt
              : this._super();
          },
        });
      });
    });
  },
};
