import { apiInitializer } from "discourse/lib/api";
import TopicExcerptToggle from "../components/topic-excerpt-toggle";

export default apiInitializer("1.8.0", (api) => {
  const isMobile = api.container.lookup("service:site").mobileView;

  if (isMobile) {
    api.renderInOutlet("extra-nav-item", TopicExcerptToggle);
  } else {
    api.renderInOutlet("topic-list-heading-bottom", TopicExcerptToggle);
  }
});
