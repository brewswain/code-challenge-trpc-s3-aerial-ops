export interface MessageProps {
  // Swap to string once UUID generation is worked out
  userId: number;
  message: {
    // Allow both to be optional so that users can upload an image by itself etc
    id: number;
    image?: string;
    messageText?: string;
  };
}
[];

export const testMessages: MessageProps[] = [
  {
    userId: 122323,
    message: {
      id: 1,
      image: "https://placekitten.com/200/200",
      messageText: "Testing image upload!",
    },
  },
];
