export type BookTags = {
  PER?: string[];
  ORG?: string[];
  LOC?: string[];

  [key: string]: string[] | undefined;
};

export type Book = {
  id: number;
  title: string;
  file_path: string;
  is_public: boolean;
  tags: BookTags | null;
};

export type PublicBook = {
  id: number;
  title: string;
  file_path: string;
  owner_username?: string;
  tags: BookTags | null;
};

export type MyBook = {
  id: number;
  title: string;
  file_path: string;
  is_public: boolean;
  tags: BookTags | null;
};