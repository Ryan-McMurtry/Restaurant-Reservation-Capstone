import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

export default function NewTable(){
    const initialTable = {
        table_name: "",
        capacity: 0
    };

    const [tableData, setTableData] = useState(...initialTable);
    const [tableError, setTableError] = useState(null);
    const [disableButton, setDisableButton] = useState(false);
    const history = useHistory();
    
    const changeHandler = (event) => {
        event.preventDefault();
        setTableData({
            ...tableData,
            [event.target.name]: event.target.value
        })
    }

    const submitHandler = (event) => {
        event.preventDefault();
        const abortController = new AbortController();
        setDisableButton(state => !state)

    }

    return (
      <div>
        {tableError ? <ErrorAlert error={tableError} /> : null}
        <form>
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
          <button type="submit" className="btn btn-primary m-1">
            Submit
          </button>

          <button type="reset" className="btn btn-danger m-1">
            Cancel
          </button>
        </form>
      </div>
    );
}

