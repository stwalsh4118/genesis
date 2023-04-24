import { BookDoc } from "@/client";

const genreList = [
  "Action and Adventure",
  "Anthology",
  "Classic",
  "Comic and Graphic Novel",
  "Crime and Detective",
  "Drama",
  "Fairytale",
  "Fantasy",
  "Fiction",
  "Historical Fiction",
  "Horror",
  "Literary Fiction",
  "Mystery",
  "Mythology",
  "Non-Fiction",
  "Poetry",
  "Political Thriller",
  "Romance",
  "Saga",
  "Satire",
  "Science Fiction",
  "Short Story",
  "Suspense",
  "Thriller",
  "Western",
  "Young Adult",
];

export const matchGenres = (genres: string[]) => {
  if (!genres) return [];
  const matchedGenres = genreList.filter((genreInList) => {
    return genres.some((genre) => {
      return genre.toLowerCase().includes(genreInList.toLowerCase());
    });
  });

  return matchedGenres;
};
