import React from "react";
import { useParams } from "react-router-dom";
import TestResult from "./TestResult";

function GuestTestResult() {
  const { id } = useParams();

  return (
    <div>
      <TestResult id={id} isShare={true}/>
    </div>
  );
}

export default GuestTestResult;
