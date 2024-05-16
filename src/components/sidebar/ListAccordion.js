import { useState } from "react";
import "../../assets/stylesheets/Sidebar.css";
import {
  List,
  ListItem,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

function ListAcoordion(props) {
  /* props area */
  const icon = props.icon;
  const title = props.title;
  const defaultOpen = props.defaultOpen;
  const onClick = props.onClick;

  // only one of the below two should be passed
  const data = props.data ? props.data : [];
  const children = props.children;

  /* states */
  const [open, setOpen] = useState(
    defaultOpen !== undefined ? defaultOpen : false
  );

  /* DOM */
  let body;
  if (children !== undefined) {
    body = children;
  } else {
    body = (
      <List className="min-w-0">
        {data.map((sql, idx) => (
          <ListItem
            key={idx}
            onClick={() => onClick(idx)}
            className="h-6 px-2 hover:!bg-gray-100 hover:!text-gray-900 rounded-md"
            ripple={false}
          >
            <p className="query-menu-text">{sql}</p>
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
