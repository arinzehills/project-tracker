import { Icon } from "@iconify/react/dist/iconify.js";

export const SpinnerLoader = () => {
  return (
    <div className="bg-purple-gradient text-white w-24 h-24 rounded-full flex flex-col items-center justify-center my-2">
      <Icon icon="ph:spinner" className="animate-spin h-10 w-10 " />
    </div>
  );
};
