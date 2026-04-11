import Card from "../Card/Card";

function Showing({ dataInDb, limit, multyCheckData }) {
  return (
    <Card
      // color="light"
      isBorder
      className="!p-0 !ps-2 text-sm flex gap-2 items-center max-md:w-full text-center justify-center !rounded-md shrink-0"
    >
      <span>Showing</span>
      <p className="bg-[var(--background-light)] p-2">
        {multyCheckData?.length
          ? ` / Selected : ${multyCheckData?.length}`
          : ""}
        {dataInDb < limit ? dataInDb : limit} of {dataInDb}
      </p>{" "}
    </Card>
  );
}

export default Showing;
