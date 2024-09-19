import React from "react";
import { Link } from "react-router-dom";
import Heading from "../../Common/Header/Heading";
import "./TestHome.css";

function TestHome({ subtitle, title }) {
  return (
    <div className="testHome">
      <section>
        <Heading subtitle={subtitle} title={title} />
        <div className="test-item-wrapper">
          <div className="test-item">
            <div className="test-item-panel">
              <div className="test-item-content">
                <div className="test-item-title">
                  <h1>Thi thử MiniTest</h1>
                </div>
                <div className="test-item-decs">
                  Làm bài mini test với số lượng câu hỏi và thời gian giảm một
                  nửa so với bài thi thật.
                </div>
              </div>
            </div>
            <Link to={`/test/type/MiniTest`}>
              <div className="test-item-button">
                <button>Làm bài thi thử ngay</button>
              </div>
            </Link>
          </div>
          <div className="test-item">
            <div className="test-item-panel">
              <div className="test-item-content">
                <div className="test-item-title">
                  <h1>Thi thử FullTest</h1>
                </div>
                <div className="test-item-decs">
                  Làm bài full test với số lượng câu hỏi và thời gian giống như
                  bài thi thật.
                </div>
              </div>
            </div>
            <Link to={`/test/type/FullTest`}>
              <div className="test-item-button">
                <button>Làm bài thi thử ngay</button>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TestHome;
