import { apiInitializer } from "discourse/lib/api";
import TopicExcerptToggle from "../components/topic-excerpt-toggle";

export default apiInitializer("1.8.0", (api) => {
  const site = api.container.lookup("service:site");

  api.renderInOutlet(
    "extra-nav-item",
    <template>
      {{#if site.mobileView}}<TopicExcerptToggle
          @name={{@outletArgs.name}}
          @bulkSelectEnabled={{@outletArgs.bulkSelectEnabled}}
        />{{/if}}
    </template>
  );

  api.renderInOutlet(
    "topic-list-heading-bottom",
    <template>
      {{#if site.desktopView}}<TopicExcerptToggle
          @name={{@outletArgs.name}}
          @bulkSelectEnabled={{@outletArgs.bulkSelectEnabled}}
        />{{/if}}
    </template>
  );
});
