import React from "react";
import GitHubIcon from "../icons/GitHubIcon";

interface Props {
  abortQueries: () => void;
}

const Loader = (props: Props) => {
  const { abortQueries } = props;
  return (
    <div className="loader">
      <GitHubIcon />
      <button type="button" onClick={abortQueries}>Cancel Search</button>
    </div>
  );
};

export default Loader;
