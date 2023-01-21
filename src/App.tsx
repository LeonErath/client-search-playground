import { Fragment } from "react";
import classes from "./App.module.css";
import { TabList } from "./components/TabList";
import { useSearch } from "./hooks/useSearch";
import { ContactAmount } from "./utils/data-generator";

function App() {
  const {
    amount,
    setAmount,
    searchString,
    setSearchString,
    contactsToRender,
    type,
    setType,
    searchTypes,
    time,
    loading,
  } = useSearch("simple");

  return (
    <div className={classes.container}>
      <div className={classes.formContainer}>
        <label>Input</label>
        <input
          placeholder="Search for a name or email…"
          className={classes.searchInput}
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />

        <label>Architecture</label>
        <TabList
          tabs={searchTypes.map((s) => ({
            id: s,
            selected: type === s,
            onClick: () => setType(s),
            displayValue: s,
          }))}
        />

        <label>Amount</label>
        <select
          className={classes.select}
          onChange={(e) => {
            const size = e.target.value as "SMALL" | "MEDIUM" | "LARGE";
            const number = ContactAmount[size];
            setAmount(number);
          }}
        >
          <option value="SMALL">10.000 Contacts</option>
          <option value="MEDIUM">100.000 Contacts</option>
          <option value="LARGE">1.000.000 Contacts</option>
        </select>

        <ul className={classes.contactContainer}>
          {loading ? (
            <div>Loading…</div>
          ) : (
            contactsToRender.map((contact) => (
              <Fragment key={contact.userId}>
                <li className={classes.contact}>
                  <img src={contact.avatar} width={40} height={40} />

                  <div className={classes.contactInfo}>
                    <div>
                      {contact.firstName} {contact.lastName}
                    </div>
                    <div className={classes.description}>
                      <span>{contact.email}</span>
                      <span>{contact.phonenumber}</span>
                    </div>
                  </div>
                </li>
                <hr className={classes.divider}></hr>
              </Fragment>
            ))
          )}
        </ul>

        <div className={classes.info}>
          {contactsToRender.length} Results ({time})
        </div>
      </div>
    </div>
  );
}

export default App;
