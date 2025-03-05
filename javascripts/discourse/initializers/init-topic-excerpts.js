import { getOwner } from "@ember/application";
import { service } from "@ember/service";
import discourseComputed from "discourse/lib/decorators";
import { withSilencedDeprecations } from "discourse/lib/deprecated";
import { withPluginApi } from "discourse/lib/plugin-api";

const enabledCategories = settings.enabled_categories
  .split("|")
  .map((id) => parseInt(id, 10))
  .filter((id) => id);
const enabledTags = settings.enabled_tags.split("|").filter((tag) => tag);

export default {
  name: "topic-excerpts-init",

  initialize() {
    withPluginApi("1.34.0", (api) => {
      api.registerValueTransformer(
        "topic-list-item-expand-pinned",
        ({ value }) => {
          const excerptState = api.container.lookup("service:excerpt-state");
          return excerptState.shouldApplyOverride
            ? excerptState.prefersExcerpt
            : value;
        }
      );

      // TODO: cvx - remove after the glimmer topic list transition
      withSilencedDeprecations("discourse.hbr-topic-list-overrides", () => {
        api.modifyClass(
          "component:topic-list-item",
          (Superclass) =>
            class extends Superclass {
              @service("router") excerptsRouter;

              @discourseComputed(
                "excerptsRouter.currentRouteName",
                "excerptsRouter.currentRoute.attributes.category.id"
              )
              excerptsViewingCategoryId(currentRouteName, categoryId) {
                if (!currentRouteName.match(/^discovery\./)) {
                  return;
                }
                return categoryId;
              }

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
              }

              @discourseComputed(
                "excerptsViewingCategoryId",
                "excerptsViewingTag"
              )
              expandPinned(viewingCategory, viewingTag) {
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
                  ? true
                  : super.expandPinned;
              }
            }
        );
      });
    });
  },
};
