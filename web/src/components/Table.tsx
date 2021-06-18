import {
  Table as BetterTable,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  makeStyles,
} from "@material-ui/core";
import React, { Fragment, useState } from "react";
import { faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  sortIcon: {
    position: "absolute",
    marginTop: "0.4em",
    marginLeft: "0.4em",
    color: "var(--border)",
    "&.active": {
      color: "black",
    },
  },
  sortLabel: {
    cursor: "pointer",
    "& > span::selection": {
      backgroundColor: "transparent",
    },
  },
  tableContainer: {
    display: "flex",
    justifyContent: "center",
    flexGrow: 1,
    maxHeight: "60%",
    maxWidth: "70%",
    "&::-webkit-scrollbar": {
      width: "0.5em",
      backgroundColor: "var(--input)",
      borderRadius: "1em",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "var(--border)",
      borderRadius: "1em",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "var(--highlighting)",
    },
  },
});

function accessNestedValues(path: string, object: {}) {
  const properties = path.split(".");
  return properties.reduce(
    (accumulator: any, current) => accumulator && accumulator[current],
    object
  );
}

// every item should have an id, that we can identify it by. This is used as a key for its row.
interface SimplestItem {
  id: string | number;
}

interface Header {
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: any) => JSX.Element;
}

export type TableHeaders<T extends SimplestItem> = AllTableHeaders<T>;
export type AllTableHeaders<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
  ? {
      [K in keyof T]: K extends string ? AllTableHeaders<T[K]> : never;
    }
  : Header;

interface TableProps<T extends SimplestItem> {
  tableHeaders: TableHeaders<T>;
  rows: T[];
  sort?: Array<string>;
}

type Prev = [
  never,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  ...0[]
];

type Join<K, P> = K extends string
  ? P extends string
    ? P extends ""
      ? `${K}`
      : `${K}.${P}`
    : never
  : never;

type Leaves<T, D extends number = 5> = [D] extends [never]
  ? never
  : T extends object
  ? { [K in keyof T]-?: Join<K, Leaves<T[K], Prev[D]>> }[keyof T]
  : "";

function comparator<T>(a: T, b: T, orderBy: Leaves<T>) {
  let newA = accessNestedValues(orderBy, a);
  let newB = accessNestedValues(orderBy, b);
  if (!isNaN(newA) && !isNaN(newB)) {
    newA = parseInt(newA);
    newB = parseInt(newB);
  }

  if (newA > newB) return -1;
  if (newA < newB) return 1;
  return 0;
}

function getComparator<T>(
  order: "asc" | "desc",
  orderBy: Leaves<T>
): (a: T, b: T) => number {
  return order === "desc"
    ? (a, b) => comparator(a, b, orderBy)
    : (a, b) => -comparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  array.sort((a, b) => {
    const order = comparator(a, b);
    if (order !== 0) return order;
    return -1;
  });
  return array;
}

export default function Table<T extends SimplestItem>({
  tableHeaders,
  rows,
  sort,
}: TableProps<T>) {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<Leaves<T>>("id" as Leaves<T>);
  const [direction, setDirection] = useState<"asc" | "desc">("asc");
  const classes = useStyles();
  const [accessKeys, setAccessKeys] = useState<Array<Leaves<T>>>([]);
  let keyThing = 0;

  useEffect(() => {
    const keys = Object.keys(tableHeaders) as (keyof T & keyof SimplestItem)[];

    const generateAccessKeys = (
      keys: string | (keyof T & keyof SimplestItem)[],
      tmpAccessKeys: Leaves<T>[] = []
    ): Leaves<T>[] => {
      if (Array.isArray(keys)) {
        keys.forEach((key) => {
          const childObject = accessNestedValues(key, tableHeaders);
          const hasChildren = !childObject.label;
          if (!hasChildren) tmpAccessKeys.push(key as Leaves<T>);
          else {
            const nestedKeys = Object.keys(childObject) as (keyof T &
              keyof SimplestItem)[];
            nestedKeys.forEach((nestedKey) => {
              generateAccessKeys(`${key}.${nestedKey}`, tmpAccessKeys);
            });
          }
        });
      } else {
        const childObject = accessNestedValues(keys, tableHeaders);
        const hasChildren = !childObject.label;
        if (!hasChildren) tmpAccessKeys.push(keys as Leaves<T>);
        else {
          const nestedKeys = Object.keys(childObject) as (keyof T &
            keyof SimplestItem)[];
          nestedKeys.forEach((nestedKey) =>
            generateAccessKeys(`${keys}.${nestedKey}`, tmpAccessKeys)
          );
        }
      }
      return tmpAccessKeys;
    };

    setAccessKeys(generateAccessKeys(keys));
  }, [tableHeaders]);

  function RenderValue(element: T, key: Leaves<T>, id?: string | number) {
    const uniqueId = id ? id : element.id;
    const uniqueKey = `${uniqueId}.${key}`;

    const header = accessNestedValues(key, tableHeaders);
    const value = accessNestedValues(key, element);
    return (
      <TableCell key={uniqueKey} align={header.align}>
        {header.format ? header.format(value) : value}
      </TableCell>
    );
  }

  function RenderRow(row: T) {
    return (
      <TableRow
        hover
        key={`row.${row.id}`}
        onClick={() => navigate(`./${row.id}`)}
      >
        {accessKeys.map((nestedKey) => {
          return RenderValue(row, nestedKey);
        })}
      </TableRow>
    );
  }

  function RenderHeader(header: Header, orderBy: Leaves<T>) {
    const isAscending = direction === "asc";
    const isDescending = direction === "desc";
    const isCurrentlySortedBy = sortBy === orderBy;

    const isAscendingAndActive =
      isAscending && isCurrentlySortedBy ? " active" : "";
    const isDescendingAndActive =
      isDescending && isCurrentlySortedBy ? " active" : "";

    const toggleDirection = () => {
      setDirection(direction === "asc" ? "desc" : "asc");
    };

    function doTheThing() {
      if (sortBy === orderBy) {
        toggleDirection();
      } else {
        setSortBy(orderBy);
        setDirection("asc");
      }
    }

    return (
      <TableCell key={`${orderBy}`}>
        {sort?.includes(header.label) ? (
          <label
            onClick={() => {
              doTheThing();
            }}
            key={`${orderBy}.label`}
            className={classes.sortLabel}
          >
            <span key={`${orderBy}.span`}>{header.label}</span>
            <FontAwesomeIcon
              className={`${classes.sortIcon} ${isAscendingAndActive}`}
              icon={faSortUp}
              key={`${orderBy}.up`}
            />
            <FontAwesomeIcon
              className={`${classes.sortIcon} ${isDescendingAndActive}`}
              icon={faSortDown}
              key={`${orderBy}.down`}
            />
          </label>
        ) : (
          header.label
        )}
      </TableCell>
    );
  }

  function RenderHeaders(
    headers: TableHeaders<T>,
    nestedKeys: Leaves<T> | Leaves<T>[] = accessKeys
  ): JSX.Element {
    keyThing++;
    return (
      <Fragment key={`headers.${keyThing}`}>
        {Array.isArray(nestedKeys)
          ? nestedKeys.map((innerNestedKey) =>
              RenderHeaders(headers, innerNestedKey)
            )
          : RenderHeader(accessNestedValues(nestedKeys, headers), nestedKeys)}
      </Fragment>
    );
  }

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className="table">
      <BetterTable>
        <TableHead>
          <TableRow>{RenderHeaders(tableHeaders)}</TableRow>
        </TableHead>
        <TableBody>
          {stableSort(rows, getComparator(direction, sortBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => {
              return RenderRow(row);
            })}
        </TableBody>
      </BetterTable>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
}
