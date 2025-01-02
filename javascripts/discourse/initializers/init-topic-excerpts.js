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
      const router = api.container.lookup("service:router");
      api.registerValueTransformer(
        "topic-list-item-expand-pinned",
        ({ value, context }) => {
          const overrideEverywhere =
            enabledCategories.length === 0 && enabledTags.length === 0;
          const overrideInCategory = enabledCategories.includes(
            excerptsViewingCategoryId(
              router.currentRouteName,
              router.currentRoute.attributes.category.id
            )
          );
          const overrideInTag = enabledTags.includes(
            excerptsViewingTag(
              router.currentRouteName,
              router.currentRoute.attributes.id,
              router.currentRoute.attributes.tag.id
            )
          );
          const overrideOnDevice = context.mobileView
            ? settings.show_excerpts_mobile
            : settings.show_excerpts_desktop;

          if (
            (overrideEverywhere || overrideInTag || overrideInCategory) &&
            overrideOnDevice
          ) {
            return true;
          }
          return value; // Return default value
        }
      );
    });
  },
};

const excerptsViewingCategoryId = (currentRouteName, categoryId) => {
  if (!currentRouteName.match(/^discovery\./)) {
    return;
  }
  return categoryId;
};

const excerptsViewingTag = (currentRouteName, legacyTagId, tagId) => {
  if (!currentRouteName.match(/^tag\.show/)) {
    return;
  }
  return tagId || legacyTagId;
};
