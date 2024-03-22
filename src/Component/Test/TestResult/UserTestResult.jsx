import React, { useContext } from "react";
import { UserContext } from "../../../Context/UserContext";
import { useParams } from "react-router-dom";
import UserAnswer from "./UserAnswer";
import TestResult from "./TestResult";

function UserTestResult() {
  const { user } = useContext(UserContext);
  const { id } = useParams();

  return <div>
    <TestResult id={id} isShare={true}/>
    {user.idUser && id ? <UserAnswer id={id} /> : <></>}</div>;
}

export default UserTestResult;
