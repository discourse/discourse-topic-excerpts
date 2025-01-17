import Component from "@glimmer/component";
import { on } from "@ember/modifier";
import { action } from "@ember/object";
import { service } from "@ember/service";
import icon from "discourse-common/helpers/d-icon";
import { i18n } from "discourse-i18n";

export default class ExcerptToggle extends Component {
  @service excerptState;
  @service site;
  @service router;

  constructor() {
    super(...arguments);
    this.excerptState.excerptClass(this.excerptState.prefersExcerpt);
  }

  get shouldShow() {
    const categoriesRoute =
      this.router.currentRouteName === "discovery.categories";

    if (!settings.show_toggle || categoriesRoute) {
      return;
    }

    const isTopicHeader =
      this.args.outletArgs?.name === "default" ||
      this.args.outletArgs?.name === "topic.title" ||
      this.site.mobileView;

    return (
      this.excerptState.shouldExpandPinned() &&
      isTopicHeader &&
      !this.args.outletArgs.bulkSelectEnabled
    );
  }

  get buttonIcon() {
    return this.excerptState.prefersExcerpt ? "square-check" : "far-square";
  }

  @action
  toggleExcerpt() {
    this.excerptState.toggleExcerpt();
  }

  <template>
    {{#if this.shouldShow}}
      <button
        type="button"
        {{on "click" this.toggleExcerpt}}
        class="excerpt-toggle"
      >
        {{icon this.buttonIcon}}
        <span>{{i18n (themePrefix "show_excerpts")}}</span>
      </button>
    {{/if}}
  </template>
}
