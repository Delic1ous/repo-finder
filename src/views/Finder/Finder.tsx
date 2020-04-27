import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/react-hooks";
import { GET_REPOSITORIES, Repositories } from "./Query";
import SearchInput from "../../components/SearchInput";
import RepositoriesList from "../../components/RepositoriesList";
import Pagination from "../../components/Pagination";
import Loader from "../../components/Loader";

export const itemsPerPage = 30;

const Finder = () => {
  const [getRepos, { loading, data, fetchMore }] = useLazyQuery<Repositories>(
    GET_REPOSITORIES,
    {
      notifyOnNetworkStatusChange: true,
    }
  );
  const [searchValue, setSearchValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(0);

  useEffect(() => {
    // Scroll to top on page change
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  const handleSearch = (event: React.FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearchValue(value);
  };

  const search = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchValue || loading) return;
    setCurrentPage(0);
    getRepos({
      variables: {
        query: searchValue + " sort:stars in:name",
        after: null,
        first: itemsPerPage,
      },
    });
  };

  const handleNextPage = () => {
    if (!data) return;
    if (currentPage * itemsPerPage + itemsPerPage < data.search.edges.length) {
      setCurrentPage(currentPage + 1);
    } else {
      fetchMore({
        variables: {
          after: data.search.pageInfo.endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }): Repositories => {
          if (!fetchMoreResult) return prev;
          const newEdges = fetchMoreResult.search.edges;
          const pageInfo = fetchMoreResult.search.pageInfo;
          const repositoryCount = fetchMoreResult.search.repositoryCount;
          return {
            search: {
              pageInfo,
              repositoryCount,
              __typename: prev.search.__typename,
              edges: [...prev.search.edges, ...newEdges],
            },
          };
        },
      });
      nextPage();
    }
  };

  const prevPage = () => {
    currentPage && setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <>
      <SearchInput
        onSubmit={search}
        onChange={handleSearch}
        value={searchValue}
        loading={loading}
      />
      {loading ? (
        <Loader abortQueries={() => {}} />
      ) : (
        <>
          <RepositoriesList
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            list={data}
          />
          <Pagination
            prevPage={prevPage}
            nextPage={handleNextPage}
            currentPage={currentPage}
            repositories={data}
          />
        </>
      )}
    </>
  );
};

export default Finder;

// Unfortunately, pretty easy to cancel while using fetch but barely possible with GraphQL

// import React from 'react'

// const Finder = () => {
//     let controller: any;
//     let signal: any;

//   const handleAbort = () => {
//       if (controller) {
//         controller.abort();
//       }
//   };

//   const fetchRepos = () => {
//       controller = new AbortController();
//       signal = controller.signal;
//       fetch("https://jsonplaceholder.typicode.com/posts", { signal })
//         .then((res) => console.log(res))
//         .catch((e) => {
//           console.log("ERROR", e);
//         });
//   };

//   return (
//     <div style={{width: 200, height: 200, display: "flex", alignItems: "center", justifyContent: "space-around", margin: "0 auto"}}>
//       <button onClick={fetchRepos}>Start</button>
//       <button onClick={handleAbort}>Stop</button>
//     </div>
//   )
// }

// export const itemsPerPage = 30;

// export default Finder
