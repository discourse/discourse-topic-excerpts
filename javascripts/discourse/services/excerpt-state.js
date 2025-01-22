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

  @action
  toggleExcerpt() {
    this.prefersExcerpt = !this.prefersExcerpt;

    localStorage.setItem(EXCERPT_PREF_KEY, this.prefersExcerpt);
  }
}
