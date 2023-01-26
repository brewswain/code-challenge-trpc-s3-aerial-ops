export interface MessageProps {
  // Swap to string once UUID generation is worked out
  userId: number;
  message: {
    // Allow both to be optional so that users can upload an image by itself etc
    id: number;
    image?: string;
    messageText?: string;
    createdAt: Date;
  };
}
[];

export const testMessages: MessageProps[] = [
  {
    userId: 1,
    message: {
      id: 1,
      image: "https://placekitten.com/200/200",
      messageText: "Testing image upload!",
      createdAt: new Date(),
    },
  },
  {
    userId: 2,
    message: {
      id: 2,
      image: "https://placekitten.com/200/200",
      messageText: "Second Message",
      createdAt: new Date(),
    },
  },
];
