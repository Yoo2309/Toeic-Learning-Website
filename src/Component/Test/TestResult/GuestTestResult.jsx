import React from "react";
import { useParams } from "react-router-dom";
import TestResult from "./TestResult";

function GuestTestResult() {
  const { id } = useParams();

  return (
    <div>
      <TestResult id={id} isShare={false}/>
    </div>
  );
}

export default GuestTestResult;
