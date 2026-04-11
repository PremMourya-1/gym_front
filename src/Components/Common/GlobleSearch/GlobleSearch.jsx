function GlobleSearch({ query, setQuery }) {
  return (
    <>
      {/* <div className=" inputEffect shadow-none flex gap-6 items-center   border-b border-gray-100">
        <input
          type="text"
          className="outline-0 py-1 border-0 w-full text-lg md:py-1 md:text-sm bg-transparent"
          placeholder="Search Product"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
    
      </div> */}
      <div className="inputBox">
        <input
          required
          name={"search"}
          type={"text"}
          className={`formControl `}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
        <label htmlFor={"id"}>Search</label>
      </div>
    </>
  );
}

export default GlobleSearch;
