import React from "react";
import { Edge } from "../views/Finder/Query";
import StarIcon from "../icons/StarIcon";

interface Props {
  listItem: Edge;
}

const RepositoryItem = (props: Props) => {
  const { listItem } = props;

  return (
    <div
      className="repository-container clickable"
      onClick={() => window.open(listItem.node.url, "_blank")}
    >
      <div>
        <p className="name">{listItem.node.name}</p>
        <p>
          {listItem.node.stargazers.totalCount}
          <StarIcon />
        </p>
      </div>
    </div>
  );
};

export default RepositoryItem;
