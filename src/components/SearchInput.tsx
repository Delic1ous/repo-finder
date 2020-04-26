import React from "react";
import SearchIcon from "../icons/SearchIcon";

interface Props {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange: (event: React.FormEvent<HTMLInputElement>) => void;
  value: string;
  loading: boolean;
}

const SearchInput = (props: Props) => {
  const { onSubmit, onChange, value, loading } = props;

  return (
    <form onSubmit={onSubmit}>
      <input
        disabled={loading}
        value={value}
        onChange={onChange}
        placeholder="Search Repository..."
      />
      <button disabled={loading} type="submit">
        <SearchIcon />
      </button>
    </form>
  );
};

export default SearchInput;
