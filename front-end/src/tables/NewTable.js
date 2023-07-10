import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";

export default function NewTable() {
  let initialTable = {
    table_name: "",
    capacity: 0,
  };

  const [tableData, setTableData] = useState({ ...initialTable });
  const [tableError, setTableError] = useState(null);
  //   const [disableButton, setDisableButton] = useState(false);
  const history = useHistory();

  const changeHandler = (event) => {
    event.preventDefault();
    setTableData({
      ...tableData,
      [event.target.name]: event.target.value,
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    // setDisableButton((state) => !state);
    createTable(tableData, abortController.signal)
      .then(() => history.push("/"))
      .catch(setTableError);
    // setDisableButton((state) => !state);
  };

  const cancelHandler = (event) => {
    event.preventDefault();
    // setDisableButton((state) => !state);
    history.goBack();
  };

  return (
    <div>
      {tableError ? <ErrorAlert error={tableError} /> : null}
      <form onSubmit={submitHandler} onReset={cancelHandler}>
        <h1>New Table</h1>
        <div className="form-group">
          <label htmlFor="table_name">Table Name</label>
          <input
            type="text"
            className="form-control"
            name="table_name"
            id="table_name"
            placeholder="table_name"
            value={tableData.table_name}
            onChange={changeHandler}
          />
        </div>
        <div className="form-group">
          <label htmlFor="capacity">Capacity</label>
          <input
            type="number"
            className="form-control"
            name="capacity"
            id="capacity"
            placeholder="capacity"
            value={tableData.capacity}
            onChange={changeHandler}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary m-1"
          //   disabled={disableButton}
        >
          Submit
        </button>

        <button
          type="reset"
          className="btn btn-danger m-1"
          //   disabled={disableButton}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
