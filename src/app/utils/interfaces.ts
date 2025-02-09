export interface LoginCredentials {
  email: string;
  password: string;
}

export interface PostInterface {
  id: string;
  title: string;
  content: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface PostInterface {
  id: string;
  title: string;
  content: string;
  categories?: Category[];
}
