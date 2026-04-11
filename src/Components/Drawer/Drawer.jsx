import { Drawer } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";

const DrawerComponent = ({ body, open, setOpen, placement, title, size }) => {
  return (
    <>
      <Drawer
        style={{ maxWidth: size ? size : "420px", width: "100%" }}
        className="outline-none border-none"
        backdrop={"static"}
        // size={}
        placement={placement ? placement : "right"}
        open={open}
        onClose={() => setOpen(false)}
      >
        <Drawer.Header className="p-2 ">
          <span className="capitalize font-semibold py-2 text-base">
            {title}
          </span>
        </Drawer.Header>
        <div className="drawerBody  p-5 md:p-2.5 overflow-y-auto h-full max-h-[calc(100vh-4rem)] ">
          {body}
        </div>
      </Drawer>
    </>
  );
};
export default DrawerComponent;
