module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");

  const slug = (s) =>
    String(s)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  eleventyConfig.addFilter("slug", slug);

  const byPriority = (a, b) => {
    const ao = a.data.order == null ? Infinity : a.data.order;
    const bo = b.data.order == null ? Infinity : b.data.order;
    if (ao !== bo) return ao - bo;
    return String(a.data.title).localeCompare(String(b.data.title));
  };

  eleventyConfig.addCollection("resources", (api) => {
    return api.getFilteredByGlob("src/resources/*.md").sort(byPriority);
  });

  eleventyConfig.addFilter("resourcesForTopic", function (allResources, topicSlug, typeOrder) {
    const inTopic = allResources.filter((r) => slug(r.data.topic || "") === topicSlug);
    const groups = [];
    for (const t of typeOrder) {
      const items = inTopic
        .filter((r) => (r.data.type || "writing") === t.key)
        .sort(byPriority);
      if (items.length) groups.push({ label: t.label, key: t.key, items });
    }
    return groups;
  });

  eleventyConfig.addFilter("countForTopic", function (allResources, topicSlug) {
    return allResources.filter((r) => slug(r.data.topic || "") === topicSlug).length;
  });

  eleventyConfig.addCollection("tagList", (api) => {
    const tags = new Map();
    api.getFilteredByGlob("src/resources/*.md").forEach((r) => {
      (r.data.tags || []).forEach((t) => {
        tags.set(slug(t), t);
      });
    });
    return Array.from(tags, ([tagSlug, name]) => ({ slug: tagSlug, name })).sort(
      (a, b) => a.name.localeCompare(b.name)
    );
  });

  eleventyConfig.addFilter("resourcesForTag", function (allResources, tagSlug) {
    return allResources
      .filter((r) => (r.data.tags || []).map(slug).includes(tagSlug))
      .sort(byPriority);
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
