import type { CollectionConfig } from "payload";

export const ContactMessages: CollectionConfig = {
  slug: "contact-messages",
  access: {
    // Submissions only ever come from this site's own contact form
    // Server Action, which uses the Local API (bypasses access control by
    // default) — locking down `create` here just blocks spam through the
    // public REST/GraphQL endpoints.
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: () => false,
    delete: ({ req }) => req.user?.role === "admin",
  },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email", "createdAt"],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "email",
      type: "email",
      required: true,
    },
    {
      name: "message",
      type: "textarea",
      required: true,
    },
  ],
};
