// Per-block content field schemas — drives the Dynamic Edit Panel.
// Allows grouping, friendly labels, and proper input types for each block type.

export type ContentFieldType =
  | "text"
  | "textarea"
  | "url"
  | "image"
  | "icon"
  | "number"
  | "color"
  | "boolean"
  | "select";

export interface ContentField {
  name: string;                 // key in block.content
  label: string;                // shown to user
  type: ContentFieldType;
  placeholder?: string;
  options?: { value: string; label: string }[]; // for select
  help?: string;
}

export interface ContentGroup {
  title: string;                // group header e.g. "Headline"
  fields: ContentField[];
  defaultOpen?: boolean;
}

export interface ContentSchema {
  groups: ContentGroup[];
}

// Key = block.type
export const CONTENT_SCHEMAS: Record<string, ContentSchema> = {
  hero: {
    groups: [
      {
        title: "Headline",
        defaultOpen: true,
        fields: [
          { name: "eyebrow", label: "Eyebrow / Tag", type: "text", placeholder: "Welcome" },
          { name: "title", label: "Title", type: "textarea" },
          { name: "subtitle", label: "Subtitle", type: "textarea" },
        ],
      },
      {
        title: "Call To Action",
        fields: [
          { name: "buttonText", label: "Primary Button", type: "text" },
          { name: "buttonLink", label: "Primary Link", type: "url" },
          { name: "secondaryText", label: "Secondary Button", type: "text" },
          { name: "secondaryLink", label: "Secondary Link", type: "url" },
        ],
      },
      {
        title: "Media",
        fields: [
          { name: "image", label: "Hero Image", type: "image" },
          { name: "imageUrl", label: "Image URL (fallback)", type: "image" },
          { name: "video", label: "Video URL", type: "url" },
        ],
      },
    ],
  },

  navbar: {
    groups: [
      {
        title: "Branding",
        defaultOpen: true,
        fields: [
          { name: "brand", label: "Brand Name", type: "text" },
          { name: "logoUrl", label: "Logo", type: "image" },
          {
            name: "layout",
            label: "Layout",
            type: "select",
            options: [
              { value: "split", label: "Split (logo left, menu right)" },
              { value: "center", label: "Centered menu" },
              { value: "left", label: "Left aligned" },
            ],
          },
        ],
      },
      {
        title: "CTA",
        fields: [
          { name: "ctaText", label: "Button Text", type: "text" },
          { name: "ctaLink", label: "Button Link", type: "url" },
        ],
      },
    ],
  },

  about: {
    groups: [
      {
        title: "Heading",
        defaultOpen: true,
        fields: [
          { name: "eyebrow", label: "Eyebrow", type: "text" },
          { name: "title", label: "Title", type: "text" },
          { name: "body", label: "Body", type: "textarea" },
        ],
      },
      {
        title: "Media",
        fields: [
          { name: "image", label: "Image", type: "image" },
        ],
      },
    ],
  },

  services: {
    groups: [
      {
        title: "Heading",
        defaultOpen: true,
        fields: [
          { name: "eyebrow", label: "Eyebrow", type: "text" },
          { name: "title", label: "Section Title", type: "text" },
          { name: "subtitle", label: "Subtitle", type: "textarea" },
        ],
      },
      {
        title: "Layout",
        fields: [
          {
            name: "columns",
            label: "Columns",
            type: "select",
            options: [
              { value: "2", label: "2 Columns" },
              { value: "3", label: "3 Columns" },
              { value: "4", label: "4 Columns" },
            ],
          },
        ],
      },
    ],
  },

  pricing: {
    groups: [
      {
        title: "Heading",
        defaultOpen: true,
        fields: [
          { name: "eyebrow", label: "Eyebrow", type: "text" },
          { name: "title", label: "Section Title", type: "text" },
          { name: "subtitle", label: "Subtitle", type: "textarea" },
        ],
      },
      {
        title: "Currency",
        fields: [
          { name: "currency", label: "Currency Symbol", type: "text", placeholder: "$" },
        ],
      },
    ],
  },

  testimonial: {
    groups: [
      {
        title: "Heading",
        defaultOpen: true,
        fields: [
          { name: "eyebrow", label: "Eyebrow", type: "text" },
          { name: "title", label: "Section Title", type: "text" },
          { name: "subtitle", label: "Subtitle", type: "textarea" },
        ],
      },
    ],
  },

  contact: {
    groups: [
      {
        title: "Heading",
        defaultOpen: true,
        fields: [
          { name: "title", label: "Title", type: "text" },
          { name: "subtitle", label: "Subtitle", type: "textarea" },
        ],
      },
      {
        title: "Contact Info",
        fields: [
          { name: "email", label: "Email", type: "text" },
          { name: "phone", label: "Phone", type: "text" },
          { name: "address", label: "Address", type: "textarea" },
        ],
      },
    ],
  },

  footer: {
    groups: [
      {
        title: "Brand",
        defaultOpen: true,
        fields: [
          { name: "brand", label: "Brand Name", type: "text" },
          { name: "logoUrl", label: "Logo", type: "image" },
          { name: "tagline", label: "Tagline", type: "textarea" },
        ],
      },
      {
        title: "Copyright",
        fields: [
          { name: "copyright", label: "Copyright Text", type: "text" },
        ],
      },
    ],
  },

  cta: {
    groups: [
      {
        title: "Message",
        defaultOpen: true,
        fields: [
          { name: "eyebrow", label: "Eyebrow", type: "text" },
          { name: "title", label: "Title", type: "text" },
          { name: "subtitle", label: "Subtitle", type: "textarea" },
        ],
      },
      {
        title: "Buttons",
        fields: [
          { name: "buttonText", label: "Primary Button", type: "text" },
          { name: "buttonLink", label: "Primary Link", type: "url" },
          { name: "secondaryText", label: "Secondary Button", type: "text" },
          { name: "secondaryLink", label: "Secondary Link", type: "url" },
        ],
      },
    ],
  },

  stats: {
    groups: [
      {
        title: "Heading",
        defaultOpen: true,
        fields: [
          { name: "eyebrow", label: "Eyebrow", type: "text" },
          { name: "title", label: "Section Title", type: "text" },
        ],
      },
    ],
  },

  faq: {
    groups: [
      {
        title: "Heading",
        defaultOpen: true,
        fields: [
          { name: "eyebrow", label: "Eyebrow", type: "text" },
          { name: "title", label: "Section Title", type: "text" },
          { name: "subtitle", label: "Subtitle", type: "textarea" },
        ],
      },
    ],
  },

  gallery: {
    groups: [
      {
        title: "Heading",
        defaultOpen: true,
        fields: [
          { name: "eyebrow", label: "Eyebrow", type: "text" },
          { name: "title", label: "Section Title", type: "text" },
        ],
      },
      {
        title: "Layout",
        fields: [
          {
            name: "columns",
            label: "Columns",
            type: "select",
            options: [
              { value: "2", label: "2 Columns" },
              { value: "3", label: "3 Columns" },
              { value: "4", label: "4 Columns" },
            ],
          },
        ],
      },
    ],
  },

  button: {
    groups: [
      {
        title: "Button",
        defaultOpen: true,
        fields: [
          { name: "text", label: "Label", type: "text" },
          { name: "link", label: "Link / URL", type: "url" },
          {
            name: "variant",
            label: "Variant",
            type: "select",
            options: [
              { value: "primary", label: "Primary" },
              { value: "secondary", label: "Secondary" },
              { value: "outline", label: "Outline" },
              { value: "ghost", label: "Ghost" },
            ],
          },
        ],
      },
    ],
  },

  heading: {
    groups: [
      {
        title: "Heading",
        defaultOpen: true,
        fields: [
          { name: "text", label: "Text", type: "textarea" },
          {
            name: "level",
            label: "Level",
            type: "select",
            options: [
              { value: "h1", label: "H1" },
              { value: "h2", label: "H2" },
              { value: "h3", label: "H3" },
              { value: "h4", label: "H4" },
            ],
          },
        ],
      },
    ],
  },

  paragraph: {
    groups: [
      {
        title: "Paragraph",
        defaultOpen: true,
        fields: [{ name: "text", label: "Text", type: "textarea" }],
      },
    ],
  },

  image: {
    groups: [
      {
        title: "Image",
        defaultOpen: true,
        fields: [
          { name: "src", label: "Image", type: "image" },
          { name: "alt", label: "Alt text", type: "text" },
          { name: "link", label: "Link (optional)", type: "url" },
        ],
      },
    ],
  },

  productGrid: {
    groups: [
      {
        title: "Heading",
        defaultOpen: true,
        fields: [
          { name: "eyebrow", label: "Eyebrow", type: "text" },
          { name: "title", label: "Section Title", type: "text" },
          { name: "subtitle", label: "Subtitle", type: "textarea" },
        ],
      },
      {
        title: "Layout & Style",
        fields: [
          {
            name: "columns",
            label: "Columns",
            type: "select",
            options: [
              { value: "2", label: "2 Columns" },
              { value: "3", label: "3 Columns" },
              { value: "4", label: "4 Columns" },
            ],
          },
          { name: "accentColor", label: "Accent Color (hex)", type: "text", placeholder: "#0f172a" },
        ],
      },
    ],
  },

  productCard: {
    groups: [
      {
        title: "Product",
        defaultOpen: true,
        fields: [
          { name: "title", label: "Title", type: "text" },
          { name: "price", label: "Price", type: "text" },
          { name: "oldPrice", label: "Old Price", type: "text" },
          { name: "badge", label: "Badge", type: "text" },
          { name: "rating", label: "Rating (0-5)", type: "number" },
          { name: "inStock", label: "In Stock", type: "boolean" },
        ],
      },
      {
        title: "Media",
        fields: [
          { name: "image", label: "Image", type: "image" },
          { name: "hoverImage", label: "Hover Image", type: "image" },
        ],
      },
      {
        title: "Style",
        fields: [
          { name: "accentColor", label: "Accent Color (hex)", type: "text", placeholder: "#0f172a" },
        ],
      },
    ],
  },

  categoryGrid: {
    groups: [
      {
        title: "Heading",
        defaultOpen: true,
        fields: [
          { name: "eyebrow", label: "Eyebrow", type: "text" },
          { name: "title", label: "Section Title", type: "text" },
        ],
      },
      {
        title: "Layout",
        fields: [
          {
            name: "columns",
            label: "Columns",
            type: "select",
            options: [
              { value: "2", label: "2 Columns" },
              { value: "3", label: "3 Columns" },
              { value: "4", label: "4 Columns" },
            ],
          },
        ],
      },
    ],
  },
    groups: [
      {
        title: "Image",
        defaultOpen: true,
        fields: [
          { name: "src", label: "Image", type: "image" },
          { name: "alt", label: "Alt text", type: "text" },
          { name: "link", label: "Link (optional)", type: "url" },
        ],
      },
    ],
  },
};
