import { getPayloadClient } from "./payloadClient";

export interface ContactMessageInput {
  name: string;
  email: string;
  message: string;
}

export const create = async (input: ContactMessageInput): Promise<void> => {
  const payload = await getPayloadClient();
  await payload.create({ collection: "contact-messages", data: input });
};
