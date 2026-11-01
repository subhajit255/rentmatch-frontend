import { AUTHORIZATION } from "../../constants/api/auth";

const { Bearer } = AUTHORIZATION;

export type Endpoint = string | Record<string, unknown> | FormData;
export type Params = Record<string, unknown>;

type AuthHeader = {
  Authorization: `${typeof Bearer} ${string}`;
};

export type Payload = string | Record<string, unknown> | FormData;

export type Headers =
  | {
      Accept: string;
      "Content-Type": string;
    }
  | AuthHeader;
