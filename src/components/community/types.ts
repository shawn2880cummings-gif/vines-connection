export type Me = {
  username: string;
  name: string;
  emailVerified: boolean;
  avatar: string | null;
};

export type Flags = { video: boolean; email: boolean };
