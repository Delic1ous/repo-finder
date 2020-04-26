import React from "react";
import { Repositories } from "../views/Finder/Query";
import { itemsPerPage } from "../views/Finder/Finder";

interface Props {
  prevPage: () => void;
  nextPage: () => void;
  currentPage: number;
  repositories: Repositories | undefined;
  loading: boolean;
}

const Pagination = (props: Props) => {
  const { prevPage, nextPage, currentPage, repositories, loading } = props;
  if (!repositories || loading || !repositories.search.repositoryCount)
    return null;

  const pagesAmount = repositories.search.repositoryCount / itemsPerPage;
  return (
    <div className="pagination">
      <button disabled={!currentPage} onClick={prevPage}>
        Previous
      </button>
      <div>Page - {currentPage + 1}</div>
      <button disabled={currentPage + 1 >= pagesAmount} onClick={nextPage}>
        Next
      </button>
    </div>
  );
};

export default Pagination;
