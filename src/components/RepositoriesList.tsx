import React from "react";
import { Repositories, Edge } from "../views/Finder/Query";
import RepositoryItem from "./RepositoryItem";
import GitHubIcon from "../icons/GitHubIcon";

interface Props {
  list: Repositories | undefined;
  loading: boolean;
  currentPage: number;
  itemsPerPage: number;
}

const RepositoriesList = (props: Props) => {
  const { list, loading, currentPage, itemsPerPage } = props;
  if (!list && loading) return <GitHubIcon />;
  if (!list)
    return (
      <div className="repository-container">
        <p>Your search result will appear here</p>
      </div>
    );

  return (
    <>
      <h3>{list.search.repositoryCount} Repositories Found</h3>
      {loading ? (
        <GitHubIcon />
      ) : (
        <div className="repositories-list">
          {list.search.edges
            .slice(
              currentPage * itemsPerPage,
              currentPage * itemsPerPage + itemsPerPage
            )
            .map((edge: Edge) => (
              <RepositoryItem key={edge.node.id} listItem={edge} />
            ))}
        </div>
      )}
    </>
  );
};

export default RepositoriesList;
