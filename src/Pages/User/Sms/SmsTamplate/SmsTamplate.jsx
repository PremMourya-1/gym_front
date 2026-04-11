import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import getSmsTamplateData from "./tamplateService";
import TamplateTable from "./TamplateTable";
import "react-multi-date-picker/styles/colors/green.css";
import UseFilter from "../../../../Hooks/UseFilter";
import BreadCrumb from "../../../../Components/Common/BreadCrumb/BreadCrumb";

function SmsTamplate() {
  const dispatch = useDispatch();

  const [tamplateList, setTamplateList] = useState();

  const tamplateStoreData = useSelector((state) => state.tamplate);

  useEffect(() => {
    !tamplateStoreData
      ? getSmsTamplateData(dispatch)
      : setTamplateList(tamplateStoreData);
  }, [tamplateStoreData]);

  const { query, setQuery, filteredData } = UseFilter(tamplateList, "message");
  return (
    <>
      <div className="breadCrumbAndSearchBar">
        <BreadCrumb />
        <div className="searchAndButton">
          <div className="searchContainer">
            <div className="inputBox w-full">
              <input
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
                value={query}
                required
                type={"textarea"}
                className={`formControl `}
              />
              <label htmlFor={"id"}>Search</label>
            </div>
          </div>
        </div>
      </div>

      <TamplateTable data={filteredData} />
    </>
  );
}

export default SmsTamplate;
