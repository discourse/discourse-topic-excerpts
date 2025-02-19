// services/excerpt-state.js
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import Service, { service } from "@ember/service";

const EXCERPT_PREF_KEY = "showExcerpt";
const enabledCategories = settings.enabled_categories
  .split("|")
  .map(Number)
  .filter(Boolean);
const enabledTags = settings.enabled_tags.split("|").filter(Boolean);

export default class ExcerptState extends Service {
  @service router;
  @service discovery;
  @service site;

  @tracked
  prefersExcerpt = settings.show_toggle
    ? localStorage.getItem(EXCERPT_PREF_KEY) !== "false"
    : true;

  get shouldApplyOverride() {
    const overrideEverywhere =
      enabledCategories.length === 0 && enabledTags.length === 0;
    const overrideInCategory = enabledCategories.includes(
      this.discovery.category?.id
    );
    const overrideInTag = enabledTags.includes(this.discovery.tag?.id);
    const overrideOnDevice = this.site.mobileView
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
  }
}
