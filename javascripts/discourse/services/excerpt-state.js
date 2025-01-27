import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import Service from "@ember/service";

const EXCERPT_PREF_KEY = "showExcerpt";
const EXCERPT_PREF = settings.show_toggle
  ? localStorage.getItem(EXCERPT_PREF_KEY)
  : "false";
export default class ExcerptState extends Service {
  @tracked
  prefersExcerpt = EXCERPT_PREF === null ? true : EXCERPT_PREF === "true";

  @action
  toggleExcerpt() {
    this.prefersExcerpt = !this.prefersExcerpt;

    localStorage.setItem(EXCERPT_PREF_KEY, this.prefersExcerpt);
  }
}
