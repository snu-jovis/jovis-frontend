import { useContext, useState } from "react";
import {
  List,
  ListItem,
  ListItemSuffix,
  Accordion,
  AccordionHeader,
  AccordionBody,
  IconButton,
  Checkbox,
} from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import "../../assets/stylesheets/Sidebar.css";

import { QueriesContext } from "../providers/QueriesProvider";

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
    >
      <path
        fillRule="evenodd"
        d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ListAcoordion(props) {
  const { icon, title, defaultOpen, children } = props;
  const { queries, selectedQueries, addSelectedQueries, delQueries } =
    useContext(QueriesContext);

  const [open, setOpen] = useState(
    defaultOpen !== undefined ? defaultOpen : false
  );

  const toggleQuerySelection = (id) => {
    addSelectedQueries(id);
  };

  /* DOM */
  let body;
  if (children !== undefined) {
    body = children;
  } else {
    body = (
      <List className="min-w-0 px-0">
        {queries.map((query) => (
          <ListItem key={query.id} className="h-6 p-0" ripple={false}>
            <Checkbox
              defaultChecked={selectedQueries.includes(query.id)}
              ripple={false}
              onChange={() => toggleQuerySelection(query.id)}
              className="h-4 w-4 rounded-full border-gray-900/20 bg-gray-900/10 transition-all hover:scale-105 hover:before:opacity-0"
            />
            <p className="query-menu-text">{query.title}</p>
            <ListItemSuffix>
              <IconButton
                variant="text"
                color="blue-gray"
                className="h-6 w-6 hover:bg-transparent"
                onClick={() => delQueries(query.id)}
              >
                <TrashIcon />
              </IconButton>
            </ListItemSuffix>
          </ListItem>
        ))}
      </List>
    );
  }

  return (
    <Accordion
      open={open}
      icon={
        <ChevronDownIcon
          strokeWidth={2.5}
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      }
      className="px-0.5"
    >
      <AccordionHeader
        className="w-full h-8 px-2 justify-between items-center hover:!bg-gray-100 hover:!text-gray-900 rounded-md border-b-0"
        onClick={() => setOpen(!open)}
      >
        <div className="mr-2">{icon}</div>
        <p className="sub-menu-text">{title}</p>
      </AccordionHeader>
      <div className="px-2">
        <AccordionBody className="py-0 overflow-y-auto overflow-x-hidden">
          {body}
        </AccordionBody>
      </div>
    </Accordion>
  );
}

export default ListAcoordion;
