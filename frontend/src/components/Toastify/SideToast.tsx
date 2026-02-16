import { toast } from "react-toastify";

export const toastOptions = {
  theme: "colored",
  //  position: "top-right",
  autoClose: 5000, // Auto close after 5 seconds
  hideProgressBar: true,
};
const SideToast = ({ title = "Title", message = "" }) => {
  return (
    <div>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
};
SideToast.FireSuccess = ({
  message = "Action completed Successfully",
  title = "Success",
}) => {
  toast.success(<SideToast message={message} title={title} />, {
    ...toastOptions,
    style: { background: "var(--success)" },
  });
};
SideToast.FireWarning = ({
  message = "Action completed Successfully",
  title = "Success",
}) => {
  toast.warn(<SideToast message={message} title={title} />, {
    ...toastOptions,
    // style: { background: "var(--success)" },
  });
};
SideToast.FireInfo = ({
  message = "Information",
  title = "Info",
}) => {
  toast.info(<SideToast message={message} title={title} />, {
    ...toastOptions,
    style: { background: "var(--info)" },
  });
};
SideToast.FireError = ({ title = "Error", message = "" }) => {
  toast.error(<SideToast message={message} title={title} />, {
    ...toastOptions,
    style: { background: "var(--danger)" },
  });
};

export default SideToast;
