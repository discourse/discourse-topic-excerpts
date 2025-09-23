import { apiInitializer } from "discourse/lib/api";
import TopicExcerptToggle from "../components/topic-excerpt-toggle";

export default apiInitializer((api) => {
  const site = api.container.lookup("service:site");

  api.renderInOutlet(
    "extra-nav-item",
    <template>
      {{#if site.mobileView}}<TopicExcerptToggle
          @name={{@name}}
          @bulkSelectEnabled={{@bulkSelectEnabled}}
        />{{/if}}
    </template>
  );

  api.renderInOutlet(
    "topic-list-heading-bottom",
    <template>
      {{#if site.desktopView}}<TopicExcerptToggle
          @name={{@name}}
          @bulkSelectEnabled={{@bulkSelectEnabled}}
        />{{/if}}
    </template>
  );
});
