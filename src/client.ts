import axios from "axios";

export const getBookByISBN = async (isbn: string) => {
  const data = await fetch(
    `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
  )
    .then((res) => res.text())
    .then((data) => {
      if (data) {
        console.log(JSON.parse(data));
      }
    });
  return data;
};
