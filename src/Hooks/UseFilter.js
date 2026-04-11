import { useState } from "react";

export default function UseFilter(data, nameQuery) {
  const [query, setQuery] = useState("");
  return {
    query,
    setQuery,
    filteredData: data?.filter((item) =>
      item[nameQuery]?.toLowerCase().includes(query.toLowerCase())
    ),
  };
}

// export default function UseFilter(data, nameQuery =['name','title']) {
//   const [query, setQuery] = useState('')
//   return {
//    query,
//     setQuery,
//     filteredData: data.filter((item) =>
//       item[nameQuery].toLowerCase().includes(query.toLowerCase())
//     ),
//   }
// }
