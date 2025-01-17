import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import Service, { service } from "@ember/service";

const EXCERPT_PREF_KEY = "showExcerpt";
const EXCERPT_PREF = localStorage.getItem(EXCERPT_PREF_KEY);

export default class ExcerptState extends Service {
  @service site;
  @service discovery;

  @tracked
  prefersExcerpt = EXCERPT_PREF === null ? true : EXCERPT_PREF === "true";

  get enabledCategories() {
    return settings.enabled_categories
      .split("|")
      .map((id) => parseInt(id, 10))
      .filter(Boolean);
  }

  get enabledTags() {
    return settings.enabled_tags.split("|").filter(Boolean);
  }

  shouldExpandPinned() {
    const isMobile = this.site?.mobileView;

    const overrideEverywhere =
      this.enabledCategories.length === 0 && this.enabledTags.length === 0;

    const overrideInCategory = this.enabledCategories.includes(
      this.discovery.category?.id
    );
    const overrideInTag = this.enabledTags.includes(this.discovery.tag?.id);

    const overrideOnDevice = isMobile
      ? settings.show_excerpts_mobile
      : settings.show_excerpts_desktop;

    return (
      (overrideEverywhere || overrideInTag || overrideInCategory) &&
      overrideOnDevice
    );
  }

  @action
  toggleExcerpt() {
    this.prefersExcerpt = !this.prefersExcerpt;
    localStorage.setItem(EXCERPT_PREF_KEY, this.prefersExcerpt);
    this.excerptClass(this.prefersExcerpt);
  }

  @action
  excerptClass(show) {
    if (show) {
      document.body.classList.remove("hide-excerpt");
    } else {
      document.body.classList.add("hide-excerpt");
    }
  }
}
