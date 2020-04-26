import React from "react";
import SearchIcon from "../icons/SearchIcon";
import CloseIcon from "../icons/CloseIcon";

interface Props {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange: (event: React.FormEvent<HTMLInputElement>) => void;
  value: string;
  loading: boolean;
  abortQueries: () => void;
}

const SearchInput = (props: Props) => {
  const { onSubmit, onChange, value, loading, abortQueries } = props;
  
  return (
    <form onSubmit={onSubmit}>
      <input
        disabled={loading}
        value={value}
        onChange={onChange}
        placeholder={loading ? "Searching..." : "Search Repository..."}
      />
      {loading ? (
        <button onClick={abortQueries}>
          <CloseIcon />
        </button>
      ) : (
        <button>
          <SearchIcon />
        </button>
      )}
    </form>
  );
};

export default SearchInput;
