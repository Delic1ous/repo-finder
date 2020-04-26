import React from "react";
import { Edge } from "../views/Finder/Query";
import StarIcon from "../icons/StarIcon";

interface Props {
  listItem: Edge;
}

const RepositoryItem = (props: Props) => {
  const { listItem } = props;

  return (
    <a
      className="repository-container clickable"
      href={listItem.node.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div>
        <p className="name">{listItem.node.name}</p>
        <p>
          {listItem.node.stargazers.totalCount}
          <StarIcon />
        </p>
      </div>
    </a>
  );
};

export default RepositoryItem;
