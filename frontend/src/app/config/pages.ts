import { PageItem } from "../../components/interfaces";

// export const loggedInPages: PageItem[] = [
//   {
//     name: "dashboard",
//     route: "/dashboard",
//     current: false,
//   },
//   {
//     name: "tracker",
//     route: "/track",
//     current: false,
//   },
//   {
//     name: "profile",
//     route: "/profile",
//     current: false,
//   },
// ];

export const loggedOutButtons: PageItem[] = [
  {
    name: "Login",
    route: "/auth/login",
    current: false,
    variant: "outline",
  },
];

export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
