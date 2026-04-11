import MoreIcon from "@rsuite/icons/legacy/More";
import { Dropdown, IconButton, Popover, Whisper } from "rsuite";
const ActionCell = ({ rowData, children }) => {
    const renderMenu = ({ onClose, left, top, className }, ref) => {
        return (
            <Popover ref={ref} className={className} style={{ left, top }} full>
                <Dropdown.Menu className="hover:overflow-hidden">
                    {typeof children === "function"
                        ? children(rowData, onClose) // 👈 yaha inject kar diya
                        : children}
                </Dropdown.Menu>
            </Popover>
        );
    };

    return (
        <Whisper placement="bottomEnd" trigger="click" speaker={renderMenu}>
            <IconButton size="sm" appearance="subtle" icon={<MoreIcon />} />
        </Whisper>
    );
};

export default ActionCell;
