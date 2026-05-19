// Per-block repeater field schemas
export type FieldType = "text" | "textarea" | "url" | "image" | "icon" | "number" | "color" | "boolean" | "stringList";

export interface RepeaterField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
}

export interface RepeaterSchema {
  itemLabel: string;            // shown in header e.g. "Service"
  titleField?: string;          // which field to use as item header label
  fields: RepeaterField[];
  defaultItem: Record<string, any>;
}

// Key = `${blockType}.${arrayKey}`
export const REPEATER_SCHEMAS: Record<string, RepeaterSchema> = {
  "services.items": {
    itemLabel: "Service",
    titleField: "title",
    fields: [
      { name: "icon", label: "Icon (lucide name)", type: "icon", placeholder: "Sparkles" },
      { name: "image", label: "Image", type: "image" },
      { name: "title", label: "Title", type: "text" },
      { name: "body", label: "Description", type: "textarea" },
      { name: "badge", label: "Badge", type: "text" },
      { name: "buttonText", label: "Button Text", type: "text" },
      { name: "buttonLink", label: "Button Link", type: "url" },
    ],
    defaultItem: { icon: "Sparkles", title: "New service", body: "Describe your service." },
  },
  "pricing.plans": {
    itemLabel: "Plan",
    titleField: "name",
    fields: [
      { name: "name", label: "Plan Name", type: "text" },
      { name: "price", label: "Price", type: "text" },
      { name: "period", label: "Period", type: "text", placeholder: "/mo" },
      { name: "featured", label: "Highlight this plan", type: "boolean" },
      { name: "features", label: "Features", type: "stringList" },
      { name: "buttonText", label: "Button Text", type: "text" },
      { name: "buttonLink", label: "Button Link", type: "url" },
    ],
    defaultItem: { name: "Plan", price: "$0", features: ["Feature one"] },
  },
  "testimonial.items": {
    itemLabel: "Testimonial",
    titleField: "author",
    fields: [
      { name: "image", label: "Avatar", type: "image" },
      { name: "author", label: "Name", type: "text" },
      { name: "role", label: "Role / Company", type: "text" },
      { name: "rating", label: "Rating (1-5)", type: "number" },
      { name: "quote", label: "Quote", type: "textarea" },
    ],
    defaultItem: { author: "New client", quote: "Add a great quote." },
  },
  "team.members": {
    itemLabel: "Member",
    titleField: "name",
    fields: [
      { name: "image", label: "Photo", type: "image" },
      { name: "name", label: "Name", type: "text" },
      { name: "role", label: "Role", type: "text" },
      { name: "bio", label: "Bio", type: "textarea" },
    ],
    defaultItem: { name: "New member", role: "Role", image: "https://i.pravatar.cc/200" },
  },
  "faq.items": {
    itemLabel: "Question",
    titleField: "question",
    fields: [
      { name: "question", label: "Question", type: "text" },
      { name: "answer", label: "Answer", type: "textarea" },
    ],
    defaultItem: { question: "New question?", answer: "Answer here." },
  },
  "accordion.items": {
    itemLabel: "Item",
    titleField: "title",
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "body", label: "Body", type: "textarea" },
    ],
    defaultItem: { title: "New item", body: "Content here." },
  },
  "tabs.items": {
    itemLabel: "Tab",
    titleField: "title",
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "body", label: "Body", type: "textarea" },
    ],
    defaultItem: { title: "New tab", body: "Tab content." },
  },
  "stats.items": {
    itemLabel: "Stat",
    titleField: "label",
    fields: [
      { name: "value", label: "Value", type: "text" },
      { name: "label", label: "Label", type: "text" },
    ],
    defaultItem: { value: "100+", label: "New stat" },
  },
  "form.fields": {
    itemLabel: "Field",
    titleField: "label",
    fields: [
      { name: "label", label: "Label", type: "text" },
      { name: "type", label: "Type (text/email/textarea/number)", type: "text" },
    ],
    defaultItem: { label: "New field", type: "text" },
  },
  "footer.links": {
    itemLabel: "Link",
    titleField: "label",
    fields: [
      { name: "label", label: "Label", type: "text" },
      { name: "url", label: "URL", type: "url" },
    ],
    defaultItem: { label: "New link", url: "#" },
  },
  "footer.columns": {
    itemLabel: "Column",
    titleField: "title",
    fields: [
      { name: "title", label: "Column Title", type: "text" },
      { name: "linksText", label: "Links (one per line — Label|URL)", type: "textarea" },
    ],
    defaultItem: { title: "New Column", linksText: "Link one|#\nLink two|#" },
  },
  "footer.socialLinks": {
    itemLabel: "Social",
    titleField: "platform",
    fields: [
      { name: "platform", label: "Platform (twitter/github/linkedin/instagram/facebook/youtube)", type: "text" },
      { name: "url", label: "URL", type: "url" },
    ],
    defaultItem: { platform: "twitter", url: "https://" },
  },
  "navbar.links": {
    itemLabel: "Link",
    titleField: "label",
    fields: [
      { name: "label", label: "Label", type: "text" },
      { name: "url", label: "URL", type: "url" },
    ],
    defaultItem: { label: "New link", url: "#" },
  },
  "social.links": {
    itemLabel: "Social",
    titleField: "platform",
    fields: [
      { name: "platform", label: "Platform (twitter/github/linkedin/instagram/facebook/youtube)", type: "text" },
      { name: "url", label: "URL", type: "url" },
    ],
    defaultItem: { platform: "twitter", url: "https://" },
  },
  "productGrid.items": {
    itemLabel: "Product",
    titleField: "title",
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "price", label: "Price", type: "text", placeholder: "$49" },
      { name: "oldPrice", label: "Old price (optional)", type: "text", placeholder: "$69" },
      { name: "image", label: "Image", type: "image" },
      { name: "hoverImage", label: "Hover image (optional)", type: "image" },
      { name: "badge", label: "Badge", type: "text", placeholder: "Sale / New" },
      { name: "rating", label: "Rating (0-5)", type: "number" },
      { name: "inStock", label: "In stock", type: "boolean" },
      { name: "link", label: "Link", type: "url" },
    ],
    defaultItem: { title: "New product", price: "$0", image: "", rating: 5, inStock: true },
  },
  "categoryGrid.items": {
    itemLabel: "Category",
    titleField: "name",
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "image", label: "Image", type: "image" },
      { name: "count", label: "Item count", type: "text", placeholder: "120 items" },
      { name: "link", label: "Link", type: "url" },
    ],
    defaultItem: { name: "Category", image: "", link: "#" },
  },
};

// Array-of-strings repeaters
export const STRING_LIST_SCHEMAS: Record<string, { itemLabel: string; type: "image" | "text"; placeholder?: string }> = {
  "gallery.images": { itemLabel: "Image", type: "image" },
  "logos.logos": { itemLabel: "Logo / brand", type: "text", placeholder: "Brand name" },
};
