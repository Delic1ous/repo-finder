import { gql } from "apollo-boost";

export const GET_REPOSITORIES = gql`
  query getRepositories($query: String!, $after: String, $first: Int) {
    search(first: $first, after: $after, query: $query, type: REPOSITORY) {
      pageInfo {
        endCursor
        hasNextPage
        startCursor
        hasPreviousPage
      }
      repositoryCount
      edges {
        cursor
        node {
          ... on Repository {
            id
            url
            description
            createdAt
            name
            stargazers {
              totalCount
            }
          }
        }
      }
    }
  }
`;

export interface Repositories {
  search: Search;
}

interface Search {
  pageInfo: PageInfo;
  repositoryCount: number;
  edges: Edge[];
  __typename: string;
}

export interface PageInfo {
  startCursor: string;
  endCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Edge {
  cursor: string;
  node: Node;
  __typename: string;
}

interface Node {
  id: string;
  createdAt: string;
  name: string;
  url: string;
  description: string;
  stargazers: Stargazers;
  __typename: string;
}

interface Stargazers {
  totalCount: number;
  __typename: string;
}
