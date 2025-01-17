import { withPluginApi } from "discourse/lib/plugin-api";
import { withSilencedDeprecations } from "discourse-common/lib/deprecated";

export default {
  name: "topic-excerpts-init",

  initialize() {
    withPluginApi("1.34.0", (api) => {
      const excerptState = api.container.lookup("service:excerpt-state");

      api.registerValueTransformer(
        "topic-list-item-expand-pinned",
        ({ value }) => {
          return excerptState.shouldExpandPinned() || value;
        }
      );

      // TODO: cvx - remove after the glimmer topic list transition
      withSilencedDeprecations("discourse.hbr-topic-list-overrides", () => {
        api.modifyClass("component:topic-list-item", {
          pluginId: "discourse-topic-excerpts",

          expandPinned() {
            const shouldExpand = excerptState.shouldExpandPinned();
            return shouldExpand || this._super(...arguments);
          },
        });
      });
    });
  },
};
