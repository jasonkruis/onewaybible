module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    if (!dateObj) return "";
    const d = new Date(dateObj);
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
  });

  const slug = (s) =>
    String(s)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  eleventyConfig.addFilter("slug", slug);

  // Sort helper: by priority (order) ascending; missing order sinks to the
  // bottom; ties broken alphabetically by title. No dependence on dates.
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
    const inTopic = allResources.filter((r) => {
      const topics = (r.data.topics || []).map(slug);
      return topics.includes(topicSlug);
    });
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
    return allResources.filter((r) =>
      (r.data.topics || []).map(slug).includes(topicSlug)
    ).length;
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
