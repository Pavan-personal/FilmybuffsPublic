import axios from "axios";
import { atom, selector } from "recoil";

export const profileAtom = atom({
  key: "profileAtom",
  default: undefined,
});
