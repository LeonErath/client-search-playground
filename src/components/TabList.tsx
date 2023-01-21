import { Fragment } from "react";
import classes from "./TabList.module.css";

type Tab = {
  id: string;
  selected: boolean;
  onClick: () => void;
  displayValue: string;
};

type Props = {
  tabs: Tab[];
};

export const TabList = ({ tabs }: Props) => {
  return (
    <div className={classes.tabList} role="tablist" aria-label="Entertainment">
      {tabs.map((tab, i) => (
        <Fragment key={tab.id}>
          <button
            role="tab"
            aria-selected={tab.selected}
            aria-controls={`${tab.id}-tab`}
            onClick={tab.onClick}
            id={tab.id}
          >
            {tab.displayValue}
          </button>
          {i < tabs.length - 1 && <div className={classes.divider} />}
        </Fragment>
      ))}
    </div>
  );
};
