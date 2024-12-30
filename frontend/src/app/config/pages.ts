import { PageItem } from "../components/interfaces";

export const loggedInPages: PageItem[] = [
  {
    name: "dashboard",
    route: "/dashboard",
    current: false,
  },
  {
    name: "tracker",
    route: "/track",
    current: false,
  },
  {
    name: "profile",
    route: "/profile",
    current: false,
  },
];

export const loggedOutPages: PageItem[] = [
  {
    name: "register",
    route: "/auth/register",
    current: false,
  },
  {
    name: "login",
    route: "/auth/login",
    current: false,
  },
];
