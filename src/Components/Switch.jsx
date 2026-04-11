import { Toggle } from "rsuite";
import CheckIcon from "@rsuite/icons/Check";
import CloseIcon from "@rsuite/icons/Close";

function Switch({ item, onChangeStatus, checked, type }) {
    return (
        <Toggle
            //   disabled={
            //     !checkUserPermissions(userPermissions, [`edit${title}`, "all"]) ||
            //     disabled
            //   }
            onChange={(e) => {
                onChangeStatus(Number(e), item.id, type);
            }}
            checkedChildren={<CheckIcon />}
            unCheckedChildren={<CloseIcon />}
            checked={checked}
            size={"sm"}
        />
    );
}

export default Switch;
