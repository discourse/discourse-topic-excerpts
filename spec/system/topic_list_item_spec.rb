# frozen_string_literal: true

RSpec.describe "Viewing the search banner", type: :system do
  fab!(:theme) { upload_theme_component }
  fab!(:category)
  fab!(:category_2) { Fabricate(:category) }
  fab!(:tag)
  fab!(:tag_2) { Fabricate(:tag) }
  fab!(:topic) { Fabricate(:topic, category: category, tags: [tag]) }
  fab!(:post) { Fabricate(:post, topic: topic, cooked: "This is expanded text") }
  fab!(:topic_2) { Fabricate(:topic, category: category_2, tags: [tag_2]) }
  fab!(:post_2) { Fabricate(:post, topic: topic_2, cooked: "This is not expanded text") }

  let(:topic_list_page) { PageObjects::Components::TopicList.new }

  before do
    topic.update!(excerpt: "This is expanded text")
    topic_2.update!(excerpt: "This is not expanded text")
  end

  it "should display the topic-excerpt when viewing category included in `enabled_categories`" do
    theme.update_setting(:enabled_categories, category.id.to_s)
    theme.save!

    visit("/c/#{category.id}") # Visit category included in enabled_categories setting
    expect(topic_list_page).to have_css(
      topic_list_page.topic_list_item_class(topic) + " .topic-excerpt",
      text: "This is expanded text",
    )
  end

  it "should not display the topic-excerpt when viewing category not included in `enabled_categories`" do
    theme.update_setting(:enabled_categories, category.id.to_s)
    theme.save!

    visit("/c/#{category_2.id}") # Visit category not included in enabled_categories setting
    expect(topic_list_page).to have_topics(count: 1)
    expect(topic_list_page).to have_no_css(
      topic_list_page.topic_list_item_class(topic_2) + " .topic-excerpt",
      text: "This is not expanded text",
    )
  end

  it "should display the topic-excerpt when viewing tag included in `enabled_tags`" do
    theme.update_setting(:enabled_tags, tag.name)
    theme.save!

    visit("/tag/#{tag.name}") # Visit tag included in enabled_tags setting
    expect(topic_list_page).to have_css(
      topic_list_page.topic_list_item_class(topic) + " .topic-excerpt",
      text: "This is expanded text",
    )
  end

  it "should not display the topic-excerpt when viewing tag not included in `enabled_tags`" do
    theme.update_setting(:enabled_tags, tag.name)
    theme.save!

    visit("/tag/#{tag_2.name}") # Visit tag included in enabled_tags setting
    expect(topic_list_page).to have_topics(count: 1)
    expect(topic_list_page).to have_no_css(
      topic_list_page.topic_list_item_class(topic_2) + " .topic-excerpt",
      text: "This is not expanded text",
    )
  end
end
