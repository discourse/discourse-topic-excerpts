import { withPluginApi } from "discourse/lib/plugin-api";

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
    });
  },
};
