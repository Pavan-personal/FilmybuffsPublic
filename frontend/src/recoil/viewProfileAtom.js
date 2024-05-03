import { atom } from "recoil";
export const viewProfileAtom = atom({
  key: "viewProfile",
  default: {
    visible: false,
    username: undefined,
  },
});
