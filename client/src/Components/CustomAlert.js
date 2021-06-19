import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const CustomAlert = (props) => {
  return confirmAlert({
    title: props.title,
    message: props.message,
    buttons: [
      {
        label: props.label,
        onClick: props.onClick,
      },
    ],
  });
};

export default CustomAlert;
