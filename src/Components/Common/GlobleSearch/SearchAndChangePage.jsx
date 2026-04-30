import { useEffect } from "react";
import Card from "../../Card/Card";
import ClearSearch from "../../ClearSearch";
import Button from "../../Button/Button";
import useDebounce from "../../../Hooks/UseBounce";
import LoaderSpiner from "../Loader/LoaderSpiner";

function SearchAndChangePage({
  handleSearch,
  setSearch,
  search,
  searchLoading,
  limit,
  setLimit,
  getButton,
  children,
  callAfterSearch,
  placeholder,
}) {
  const debouncedSearch = useDebounce(search, 500);
  useEffect(() => {
    callAfterSearch?.(search);
  }, [debouncedSearch]);
  return (
    <Card isBorder className=" rounded-b-none border-b-0">
      <div className="flex justify-between lg:flex-col gap-4 ">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className={`flex gap-4  items-center w-full max-w-[200px] lg:max-w-full `}
        >
          <div className={`inputBox  w-full shrink-0`}>
            <input
              onChange={(e) => setSearch(e.target.value)}
              required
              value={search}
              type="text"
              className="formControl"
              placeholder={placeholder}
            />
            <label htmlFor="">Search</label>
            <ClearSearch search={search} setSearch={setSearch} />
          </div>
          {getButton && (
            <Button>{searchLoading ? <LoaderSpiner /> : "Get"}</Button>
          )}
        </form>
        <div className="flex gap-2 items-center">
          {children}
          <div className="flex gap-3 shrink-0">
            <label
              htmlFor="limit"
              className="flex items-center gap-2 text-sm border border-color p rounded-md ps-2"
            >
              <span className=" font-medium "> Per Page</span>

              <div className="relative">
                <select
                  id="limit"
                  value={limit}
                  onChange={(e) => {
                    setLimit(e.target.value);
                  }}
                  className="appearance-none py-2 px-4 pe-4
                 bg-[var(--background-light)] 
                  font-medium
                outline-none
                 transition cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>

                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-gray-400">
                  ▾
                </div>
              </div>

              {/* <span className="">Entries</span> */}
            </label>
            {/* <div className="inputBox w-full max-w-[220px]">
            <select
              required
              onChange={(e) => {
                onChangeType(e.target.value);
              }}
              className="formControl"
            >
              {CategoryTypes.map((item) => {
                return <option key={item.value}>{item.label}</option>;
              })}
            </select>
            <label htmlFor="">Filter By Type</label>
          </div> */}
            {/* <SelectPicker
            onChange={(e) => onChangeType(e)}
            data={CategoryTypes}
            searchable={false}
            defaultValue="All"
            cleanable
            label={`Filter by`}
            className="w-[200px] lg:w-full picker capitalize"
          /> */}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default SearchAndChangePage;
