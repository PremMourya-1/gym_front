import { Tooltip } from "rsuite";
function CustomToolTip({ id, msg, place = "top" }) {
  <Tooltip anchorSelect={id} place={place}>
    {msg}
  </Tooltip>;
}

export default CustomToolTip;
