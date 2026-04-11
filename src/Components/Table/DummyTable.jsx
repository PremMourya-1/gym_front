import Tippy from "@tippyjs/react";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { Link } from "react-router-dom";
import { useState } from "react";
import Pagination from "../../Pagination/Pagination";
import Table from "./Table";

function DummyTable() {
  const [multyCheck, setMultyCheck] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const data = [
    {
      id: 1,
      name: "Apple iPhone 14",
      image: "iphone14.jpg",
      category: { title: "Smartphones" },
      brand: { name: "Apple" },
      unit: { name: "Piece" },
      size: { name: "128GB" },
      tax: { name: "GST", rate: 18 },
      sku: "APL-IPH14-128",
      salePrice: 79999,
      purchasePrice: 70000,
      minStock: 5,
      currentStock: 20,
      description: "Latest iPhone with A15 chip and advanced camera system",
    },
    {
      id: 2,
      name: "Samsung Galaxy S23",
      image: "galaxyS23.jpg",
      category: { title: "Smartphones" },
      brand: { name: "Samsung" },
      unit: { name: "Piece" },
      size: { name: "256GB" },
      tax: { name: "GST", rate: 18 },
      sku: "SMS-GLX-S23-256",
      salePrice: 69999,
      purchasePrice: 62000,
      minStock: 3,
      currentStock: 15,
      description: "Flagship Samsung phone with AMOLED display",
    },
    {
      id: 3,
      name: "Nike Running Shoes",
      image: "nikeShoes.jpg",
      category: { title: "Footwear" },
      brand: { name: "Nike" },
      unit: { name: "Pair" },
      size: { name: "10 US" },
      tax: { name: "GST", rate: 12 },
      sku: "NKE-RUN-10",
      salePrice: 7999,
      purchasePrice: 6500,
      minStock: 10,
      currentStock: 50,
      description: "Comfortable running shoes for daily workout",
    },
    {
      id: 4,
      name: "Dell Inspiron Laptop",
      image: "dellLaptop.jpg",
      category: { title: "Laptops" },
      brand: { name: "Dell" },
      unit: { name: "Piece" },
      size: { name: "15 inch" },
      tax: { name: "GST", rate: 18 },
      sku: "DLL-INSP-15",
      salePrice: 54999,
      purchasePrice: 50000,
      minStock: 2,
      currentStock: 5,
      description: "Reliable laptop for work and study with Intel i5 processor",
    },
    {
      id: 5,
      name: "Logitech Wireless Mouse",
      image: "logitechMouse.jpg",
      category: { title: "Accessories" },
      brand: { name: "Logitech" },
      unit: { name: "Piece" },
      size: { name: "Standard" },
      tax: { name: "GST", rate: 18 },
      sku: "LOG-MOU-WLS",
      salePrice: 1499,
      purchasePrice: 1200,
      minStock: 5,
      currentStock: 30,
      description: "Ergonomic wireless mouse with long battery life",
    },

    // ---- New 15 Records ----

    {
      id: 6,
      name: "HP Pavilion Laptop",
      image: "hpLaptop.jpg",
      category: { title: "Laptops" },
      brand: { name: "HP" },
      unit: { name: "Piece" },
      size: { name: "14 inch" },
      tax: { name: "GST", rate: 18 },
      sku: "HP-PAV-14",
      salePrice: 48999,
      purchasePrice: 45000,
      minStock: 4,
      currentStock: 12,
      description: "Lightweight laptop for students and office work",
    },
    {
      id: 7,
      name: "OnePlus 12",
      image: "oneplus12.jpg",
      category: { title: "Smartphones" },
      brand: { name: "OnePlus" },
      unit: { name: "Piece" },
      size: { name: "256GB" },
      tax: { name: "GST", rate: 18 },
      sku: "OP-12-256",
      salePrice: 64999,
      purchasePrice: 60000,
      minStock: 6,
      currentStock: 18,
      description: "High performance smartphone with fast charging",
    },
    {
      id: 8,
      name: "Adidas Sports T-Shirt",
      image: "adidasShirt.jpg",
      category: { title: "Clothing" },
      brand: { name: "Adidas" },
      unit: { name: "Piece" },
      size: { name: "L" },
      tax: { name: "GST", rate: 5 },
      sku: "ADD-TSH-L",
      salePrice: 1999,
      purchasePrice: 1500,
      minStock: 15,
      currentStock: 60,
      description: "Comfortable sports t-shirt for gym and running",
    },
    {
      id: 9,
      name: "Boat Bluetooth Speaker",
      image: "boatSpeaker.jpg",
      category: { title: "Electronics" },
      brand: { name: "Boat" },
      unit: { name: "Piece" },
      size: { name: "Standard" },
      tax: { name: "GST", rate: 18 },
      sku: "BOAT-SPK",
      salePrice: 2499,
      purchasePrice: 2000,
      minStock: 8,
      currentStock: 25,
      description: "Portable Bluetooth speaker with deep bass",
    },
    {
      id: 10,
      name: "Sony Headphones",
      image: "sonyHeadphones.jpg",
      category: { title: "Electronics" },
      brand: { name: "Sony" },
      unit: { name: "Piece" },
      size: { name: "Over Ear" },
      tax: { name: "GST", rate: 18 },
      sku: "SNY-HDPHN",
      salePrice: 8999,
      purchasePrice: 7500,
      minStock: 5,
      currentStock: 22,
      description: "Noise cancelling over-ear headphones",
    },

    {
      id: 11,
      name: "Puma Sneakers",
      image: "pumaSneakers.jpg",
      category: { title: "Footwear" },
      brand: { name: "Puma" },
      unit: { name: "Pair" },
      size: { name: "9 US" },
      tax: { name: "GST", rate: 12 },
      sku: "PMA-SNK-9",
      salePrice: 5999,
      purchasePrice: 4800,
      minStock: 10,
      currentStock: 40,
      description: "Stylish sneakers for casual wear",
    },
    {
      id: 12,
      name: "Lenovo ThinkPad",
      image: "thinkpad.jpg",
      category: { title: "Laptops" },
      brand: { name: "Lenovo" },
      unit: { name: "Piece" },
      size: { name: "14 inch" },
      tax: { name: "GST", rate: 18 },
      sku: "LNV-TP-14",
      salePrice: 72999,
      purchasePrice: 68000,
      minStock: 3,
      currentStock: 9,
      description: "Business laptop with durable build quality",
    },
    {
      id: 13,
      name: "Mi Power Bank",
      image: "miPowerbank.jpg",
      category: { title: "Accessories" },
      brand: { name: "Xiaomi" },
      unit: { name: "Piece" },
      size: { name: "20000mAh" },
      tax: { name: "GST", rate: 18 },
      sku: "MI-PB-20K",
      salePrice: 2199,
      purchasePrice: 1800,
      minStock: 20,
      currentStock: 75,
      description: "Fast charging 20000mAh power bank",
    },
    {
      id: 14,
      name: "Canon DSLR Camera",
      image: "canonDslr.jpg",
      category: { title: "Cameras" },
      brand: { name: "Canon" },
      unit: { name: "Piece" },
      size: { name: "24MP" },
      tax: { name: "GST", rate: 18 },
      sku: "CAN-DSLR-24",
      salePrice: 45999,
      purchasePrice: 42000,
      minStock: 2,
      currentStock: 6,
      description: "High resolution DSLR camera for photography",
    },
    {
      id: 15,
      name: "Apple MacBook Air",
      image: "macbookAir.jpg",
      category: { title: "Laptops" },
      brand: { name: "Apple" },
      unit: { name: "Piece" },
      size: { name: "13 inch" },
      tax: { name: "GST", rate: 18 },
      sku: "APL-MBA-13",
      salePrice: 99999,
      purchasePrice: 92000,
      minStock: 2,
      currentStock: 7,
      description: "Lightweight laptop with M-series chip",
    },

    {
      id: 16,
      name: "Realme Smart Watch",
      image: "realmeWatch.jpg",
      category: { title: "Wearables" },
      brand: { name: "Realme" },
      unit: { name: "Piece" },
      size: { name: "Standard" },
      tax: { name: "GST", rate: 18 },
      sku: "RLM-WCH",
      salePrice: 3499,
      purchasePrice: 2800,
      minStock: 10,
      currentStock: 35,
      description: "Fitness tracking smart watch",
    },
    {
      id: 17,
      name: "LG LED TV",
      image: "lgTv.jpg",
      category: { title: "Electronics" },
      brand: { name: "LG" },
      unit: { name: "Piece" },
      size: { name: "43 inch" },
      tax: { name: "GST", rate: 18 },
      sku: "LG-TV-43",
      salePrice: 32999,
      purchasePrice: 30000,
      minStock: 3,
      currentStock: 11,
      description: "Full HD Smart LED TV",
    },
    {
      id: 18,
      name: "Wooden Study Table",
      image: "studyTable.jpg",
      category: { title: "Furniture" },
      brand: { name: "HomeStyle" },
      unit: { name: "Piece" },
      size: { name: "Standard" },
      tax: { name: "GST", rate: 18 },
      sku: "HMS-TBL",
      salePrice: 7999,
      purchasePrice: 6500,
      minStock: 5,
      currentStock: 14,
      description: "Durable wooden study table",
    },
    {
      id: 19,
      name: "Kitchen Mixer Grinder",
      image: "mixerGrinder.jpg",
      category: { title: "Home Appliances" },
      brand: { name: "Philips" },
      unit: { name: "Piece" },
      size: { name: "750W" },
      tax: { name: "GST", rate: 18 },
      sku: "PHL-MIX-750",
      salePrice: 4999,
      purchasePrice: 4200,
      minStock: 6,
      currentStock: 20,
      description: "Powerful mixer grinder for kitchen use",
    },
    {
      id: 20,
      name: "Office Executive Chair",
      image: "officeChair.jpg",
      category: { title: "Furniture" },
      brand: { name: "ComfortPlus" },
      unit: { name: "Piece" },
      size: { name: "Standard" },
      tax: { name: "GST", rate: 18 },
      sku: "CMP-CHR",
      salePrice: 8999,
      purchasePrice: 7600,
      minStock: 4,
      currentStock: 16,
      description: "Ergonomic office chair with lumbar support",
    },
  ];
  const columns = [
    {
      title: "Name",
      selector: (row) => (
        <Tippy
          content={row.name}
          placement="top-start"
          className=" p-2 capitalize "
        >
          <Link
            className="cursor-pointer capitalize line-clamp-1"
            state={row}
            to={`/catelog/item/${row?.id}`}
          >
            {row.name}
          </Link>
        </Tippy>
      ),
      width: 150,
    },

    {
      title: "Category",
      selector: (row) => (
        <Tippy
          content={row?.category?.title}
          placement="top-start"
          className=" p-2 capitalize "
        >
          <p className="cursor-pointer capitalize line-clamp-1">
            {row?.category?.title}
          </p>
        </Tippy>
      ),
      width: 150,
    },
    {
      title: "Brand",
      selector: (row) => (
        <Tippy
          content={row?.brand?.name}
          placement="top-start"
          className=" p-2 capitalize "
        >
          <p className="cursor-pointer capitalize line-clamp-1">
            {row?.brand?.name}
          </p>
        </Tippy>
      ),
      width: 150,
    },
    {
      title: "Unit",
      selector: (row) => (
        <Tippy
          content={row?.unit?.name}
          placement="top-start"
          className=" p-2 capitalize "
        >
          <p className="cursor-pointer capitalize line-clamp-1">
            {row?.unit?.name}
          </p>
        </Tippy>
      ),
      width: 150,
    },
    {
      title: "Size",
      selector: (row) => (
        <Tippy
          content={row?.size?.name}
          placement="top-start"
          className=" p-2 capitalize "
        >
          <p className="cursor-pointer  capitalize line-clamp-1">
            {row?.size?.name}
          </p>
        </Tippy>
      ),
      width: 150,
    },
    {
      title: "Tax",
      selector: (row) =>
        row?.tax?.rate ? (
          <Tippy
            content={
              <>{`${row?.tax?.name} (${Math.floor(row?.tax?.rate)}%)`}</>
            }
            placement="top-start"
            className=" p-2 capitalize "
          >
            <p className="cursor-pointer capitalize line-clamp-1">
              {row?.tax?.name}
              {` (${Math.floor(row?.tax?.rate)}%)`}
            </p>
          </Tippy>
        ) : (
          <p>No Tax</p>
        ),
      width: 150,
    },
    {
      title: "SKU",
      selector: (row) =>
        row?.tax?.rate ? (
          <Tippy
            content={row?.sku}
            placement="top-start"
            className=" p-2   uppercase "
          >
            <p className="cursor-pointer uppercase line-clamp-1">{row?.sku}</p>
          </Tippy>
        ) : (
          <p>No SKU</p>
        ),
      width: 150,
    },

    {
      title: "Sale Price",

      selector: (row) => {
        const salesPrice = (
          <span className="line-clamp-1 capitalize cursor-pointer flex">
            <MdOutlineCurrencyRupee className="mt-[3px]" />
            {Number(row?.salePrice)?.toLocaleString()}
          </span>
        );
        return row?.purchasePrice ? (
          <Tippy content={salesPrice} placement="top-start" className=" p-2">
            <p>{salesPrice}</p>
          </Tippy>
        ) : (
          <p>No Sales Price</p>
        );
      },
      width: 100,
    },
    {
      title: "Purchase Price",

      selector: (row) => {
        const purchasePrice = (
          <span className="line-clamp-1 cursor-pointer flex">
            <MdOutlineCurrencyRupee className="mt-[3px]" />
            {Number(row?.purchasePrice)?.toLocaleString()}
          </span>
        );
        return (
          <Tippy
            content={purchasePrice}
            placement="top-start"
            className=" p-2 capitalize"
          >
            <p>{purchasePrice}</p>
          </Tippy>
        );
      },
      width: 130,
    },

    {
      title: "Min Stock",
      selector: (row) => (
        <p className="capitalize">
          {row?.minStock == 0 ? (
            "No Min Stock"
          ) : (
            <span>
              {row?.minStock} / {row?.unit?.name}
            </span>
          )}
        </p>
      ),
      width: 150,
    },
    {
      title: "Current Stock",
      selector: (row) => (
        <p className="capitalize">
          {row?.currentStock == 0 ? (
            "No Current Stock"
          ) : (
            <span>
              {row?.currentStock} / {row?.unit?.name}
            </span>
          )}
        </p>
      ),
      width: 150,
    },
    {
      title: "Description",
      // selector: (row) => <p>{row?.description}</p>,
      selector: (row) =>
        row?.description?.trimStart() ? (
          <Tippy
            content={row?.description}
            placement="top-start"
            className=" p-2 capitalize"
          >
            <p className="line-clamp-1 cursor-pointer capitalize">
              {row?.description}
            </p>
          </Tippy>
        ) : (
          <p>No Description</p>
        ),

      width: 150,
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        data={data}
        multyCheck={multyCheck}
        setMultyCheck={setMultyCheck}
        page={page}
        limit={limit}
        //   stickyEnabled={false}
      />
      <Pagination
        limit={limit}
        dataInDb={100}
        page={page}
        setPage={setPage}
        setLimit={setLimit}
      />
    </>
  );
}

export default DummyTable;
