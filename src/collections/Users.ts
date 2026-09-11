import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  access: {
    delete: ({ req }) => req.user?.role === "admin",
    update: ({ req }) => Boolean(req.user),
  },
  admin: {
    useAsTitle: "email",
  },
  fields: [
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
      access: {
        update: ({ req }) => req.user?.role === "admin",
      },
    },
  ],
};
