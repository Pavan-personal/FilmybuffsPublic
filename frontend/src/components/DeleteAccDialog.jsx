import React from "react";
import { Button, Dialog } from "@mui/material";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { loadingAtom } from "../recoil/loadingAtom";
import toast from "react-hot-toast";
export default function DeleteAccDialog() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const setHomeLoad = useSetRecoilState(loadingAtom);
  const handleOpen = () => setOpen((cur) => !cur);
  const handleDelete = async (e) => {
    e.preventDefault();
    var response = await axios.delete("https://filmy-buffs-backend.vercel.app/open/deleteacc", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.data.success) {
      toast.success(response.data.message);
      localStorage.removeItem("role");
      localStorage.removeItem("token");
      navigate("/");
      // window.location.reload();
      return;
    } else {
      setHomeLoad(false);
      toast.error(response.data.message);
    }
  };
  return (
    <>
      <Button
        onClick={handleOpen}
        variant="contained"
        color="error"
        sx={{
          fontFamily: '"Apple Color Emoji"',
        }}
        style={{
          borderRadius: "2rem",
          textTransform: "capitalize",
          paddingTop: "0.5rem",
          paddingBottom: "0.5rem",
          fontWeight: 600,
          color: "rgb(226 ,255 ,255)",
          fontSize: "0.92rem",
        }}
        id="back-button"
        className=" bg-red-500 col-span-2 text-white px-6 py-2 rounded-full shadow-lg"
      >
        Delete account
      </Button>
      <Dialog
        open={open}
        onClose={handleOpen} // Fix: Correctly close the dialog on overlay click or escape press
        className="bg-transparent shadow-none flex justify-center items-center"
      >
        <div
          id="popup-modal"
          tabindex="-1"
          class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] flex max-h-full"
        >
          <div class="relative px-6 p-4 w-fit mx-auto">
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button
                type="button"
                class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="popup-modal"
                onClick={handleOpen}
              >
                <svg
                  class="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span class="sr-only">Close modal</span>
              </button>
              <div class="p-4 md:p-5 text-center">
                <svg
                  class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete your account?
                  <div>this can't be undone</div>
                </h3>
                <button
                  data-modal-hide="popup-modal"
                  type="button"
                  onClick={handleDelete}
                  class="text-white bg-red-600 hover:bg-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center duration-300"
                >
                  Yes, I'm sure
                </button>
                <button
                  data-modal-hide="popup-modal"
                  onClick={handleOpen}
                  type="button"
                  class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 duration-300 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
