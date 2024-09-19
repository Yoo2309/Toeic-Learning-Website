import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../Context/UserContext";
import { useParams } from "react-router-dom";
import Loader from "../../Common/Loader/Loader";
import SimulateTest from "./SimulateTest";
import NormalTest from "./NormalTest";

function TestMain() {
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const [vip, setVip] = useState(null);
  useEffect(() => {
    if (user.role) {
      if (user.role[1] === "VipStudent") setVip(true);
      else setVip(false);
    }
  }, [user.role]);
  if (vip === null) {
    return <Loader />;
  } else if (vip === true) {
    return <SimulateTest id={id} />;
  } else {
    return <NormalTest id={id} />;
  }
}

export default TestMain;
