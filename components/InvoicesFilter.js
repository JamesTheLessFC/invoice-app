import {
  faCheck,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../styles/InvoicesFilter.module.scss";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectInvoiceList,
  addFilter,
  removeFilter,
} from "../features/invoiceList/invoiceListSlice";
import { useRouter } from "next/router";
import { selectDarkMode } from "../features/darkMode/darkModeSlice";

export default function InvoicesFilter() {
  const [hideOptions, setHideOptions] = useState(true);
  const invoiceList = useSelector(selectInvoiceList);
  const dispatch = useDispatch();
  const filterOptions = ["paid", "pending", "draft"];
  const router = useRouter();
  const darkMode = useSelector(selectDarkMode);

  useEffect(() => {
    if (!hideOptions) {
      const handleOutsideClick = () => {
        setHideOptions(true);
      };
      setTimeout(() => {
        window.addEventListener("click", handleOutsideClick);
      });
      return () => {
        window.removeEventListener("click", handleOutsideClick);
      };
    }
  }, [hideOptions]);

  const handleOptionSelect = (e, option) => {
    e.stopPropagation();
    let selectedFilters = invoiceList.filters;
    if (selectedFilters.includes(option)) {
      dispatch(removeFilter(option));
      selectedFilters = selectedFilters.filter((val) => val !== option);
    } else {
      dispatch(addFilter(option));
      selectedFilters = [...selectedFilters, option];
    }
    router.push(
      `/invoices?${
        selectedFilters.length > 0
          ? `filter=${
              selectedFilters.length > 1
                ? selectedFilters.join(",")
                : selectedFilters[0]
            }&`
          : ""
      }page=1`
    );
  };

  const toggleOptions = (e) => {
    e.stopPropagation();
    setHideOptions((prevState) => {
      return !prevState;
    });
  };

  return (
    <div className={`${styles.root} ${darkMode.on ? styles.root_dark : ""}`}>
      <span>Filter</span>
      <button className={styles.toggle_button} onClick={toggleOptions}>
        <FontAwesomeIcon icon={hideOptions ? faChevronDown : faChevronUp} />
      </button>
      <ul className={hideOptions ? styles.hidden : ""}>
        {filterOptions.map((option) => (
          <li key={option}>
            <button
              className={styles.option_button}
              onClick={(e) => handleOptionSelect(e, option)}
            >
              <span
                className={`${styles.checkbox} ${
                  invoiceList.filters.includes(option)
                    ? styles.checkbox_checked
                    : ""
                }`}
              >
                <FontAwesomeIcon icon={faCheck} className={styles.check} />
              </span>
              <span>{option}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
