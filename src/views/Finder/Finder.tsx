import React, { useState, useEffect } from "react";
import { useLazyQuery, useApolloClient } from "@apollo/react-hooks";
import { GET_REPOSITORIES, Repositories } from "./Query";
import SearchInput from "../../components/SearchInput";
import RepositoriesList from "../../components/RepositoriesList";
import Pagination from "../../components/Pagination";
import Loader from "../../components/Loader";

export const itemsPerPage = 30;

interface SavedPreviousSearchResult {
  [key: string]: Repositories;
}

const Finder = () => {
  const client = useApolloClient();
  const [getRepos, { loading: searching, data }] = useLazyQuery<Repositories>(
    GET_REPOSITORIES,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
    }
  );
  const [searchValue, setSearchValue] = useState<string>("");
  const [savedSearchQuery, setSavedSearchQuery] = useState<string>("");
  const [savedPreviousSearchResult, setSavedPreviousSearchResult] = useState<
    SavedPreviousSearchResult
  >();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [customCache, setCustomCache] = useState<Repositories | undefined>(
    undefined
  );

  useEffect(() => {
    // Scroll to top on page change
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  useEffect(() => {
    // Loading status override, due to the fact that if query was aborted - it's still stays as `Loading`
    setLoading(searching);
  }, [searching]);

  useEffect(() => {
    // Custom cache due to abort query issue (see line:78)
    if (data) {
      if (!customCache) {
        // Setting the first page
        setCustomCache(data);
      } else {
        // Update cache with new data
        const newEdges = data.search.edges;
        const pageInfo = data.search.pageInfo;
        const repositoryCount = data.search.repositoryCount;
        setCustomCache({
          search: {
            pageInfo,
            repositoryCount,
            __typename: customCache.search.__typename,
            edges: [...customCache.search.edges, ...newEdges],
          },
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleSearch = (event: React.FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearchValue(value);
  };

  const abortQueries = () => {
    // Unfortunately aborting query breaks the fetchMore feature of query in the Apollo Client:
    // Error Invariant Violation: ObservableQuery with this id doesn't exist: 1
    // "fixed" by adding custom cache, and saving queries manually to it.
    client.stop();
    prevPage();
    setLoading(false);
  };

  const search = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchValue || loading) return;
    setCurrentPage(0);
    if (searchValue === savedSearchQuery) {
      // preventing from refetching since the value not in cache yet
      setSavedSearchQuery(searchValue);
      return;
    }
    handleAdvancedCaching();
    if (savedPreviousSearchResult?.[searchValue]) {
      setCustomCache(savedPreviousSearchResult[searchValue]);
      setSavedSearchQuery(searchValue);
    } else {
      getRepos({
        variables: {
          query: searchValue + " sort:stars in:name",
          after: null,
          first: itemsPerPage,
        },
      });
      setCustomCache(undefined);
      setSavedSearchQuery(searchValue);
    }
  };

  const handleNextPage = () => {
    if (!customCache) return;
    if (
      currentPage * itemsPerPage + itemsPerPage <
      customCache.search.edges.length
    ) {
      setCurrentPage(currentPage + 1);
    } else {
      // Loading status update in case if it's was freezed by aborting query.
      searching && setLoading(true);
      getRepos({
        variables: {
          query: savedSearchQuery + " sort:stars in:name",
          after: customCache.search.pageInfo.endCursor,
          first: itemsPerPage,
        },
      });
      nextPage();
    }
  };

  const handleAdvancedCaching = () => {
    if (customCache) {
      const updatedCache: SavedPreviousSearchResult = {
        ...savedPreviousSearchResult,
      };
      updatedCache[savedSearchQuery] = customCache;
      setSavedPreviousSearchResult(updatedCache);
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
        <Loader abortQueries={abortQueries} />
      ) : (
        <>
          <RepositoriesList
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            list={customCache}
          />
          <Pagination
            prevPage={prevPage}
            nextPage={handleNextPage}
            currentPage={currentPage}
            repositories={customCache}
          />
        </>
      )}
    </>
  );
};

export default Finder;
