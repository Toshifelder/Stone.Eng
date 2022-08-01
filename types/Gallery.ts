export type Image = {
  id: string;
  title?: string;
  link?: string;
  image: {
    url: string;
    height: number;
    width: number;
  };
  createdAt: string;
};

export type Gallery = {
  contents: Image[];
};
