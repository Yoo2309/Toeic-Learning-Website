import "./App.css";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Component/Home/Home";
import Login from "./Component/Login/Login";
import VocabularyTopic from "./Component/Vocabulary/VocabularyTopic";
import VocabularyByTopic from "./Component/Vocabulary/VocabularyByTopic";
import Courses from "./Component/Courses/Courses";
import CourseLessons from "./Component/Courses/CourseLessons";
import Lesson from "./Component/Courses/Lessons/Lesson";
import TestIndex from "./Component/Test/TestIndex";
import TestList from "./Component/Test/TestList";
import TestMain from "./Component/Test/TestMain/TestMain";
import UserLayout from "./Component/Common/Layout/UserLayout";
import ProfessorLayout from "./Component/Common/Layout/ProfessorLayout";
import ProfessorHome from "./Component/ProfessorComponent/Common/ProfessorHome";
import ProfessorTestManage from "./Component/ProfessorComponent/TestManage/ProfessorTestManage";
import ProfessorVocabularyTopic from "./Component/ProfessorComponent/VocabularyManage/ProfessorVocabularyTopic";
import ProfessorVocabulary from "./Component/ProfessorComponent/VocabularyManage/ProfessorVocabulary";
import ForgotPassword from "./Component/Login/ForgotPassword";
import CourseManageIndex from "./Component/ProfessorComponent/CourseManage/CourseManageIndex";
import LessonManage from "./Component/ProfessorComponent/CourseManage/Lesson/LessonManage";
import AddLesson from "./Component/ProfessorComponent/CourseManage/Lesson/AddLesson";
import UpdateLesson from "./Component/ProfessorComponent/CourseManage/Lesson/UpdateLesson";
import UpdateQuiz from "./Component/ProfessorComponent/CourseManage/Lesson/Quiz/UpdateQuiz";
import UpdateTest from "./Component/ProfessorComponent/TestManage/UpdateTest";
import AdminLayout from "./Component/Common/Layout/AdminLayout";
import AdminHome from "./Component/AdminComponent/Common/AdminHome";
import UserManage from "./Component/AdminComponent/UserManage/UserManage";
import AddUser from "./Component/AdminComponent/UserManage/AddUser";
import UserProfile from "./Component/Profile/UserProfile";
import UpdateUnit from "./Component/ProfessorComponent/TestManage/UpdateUnit";
import VipPackage from "./Component/Payment/VipPackage";
import VipPackageDetail from "./Component/Payment/VipPackageDetail";
import VipPackageCheckout from "./Component/Payment/VipPackageCheckout";
import VipPackageManage from "./Component/AdminComponent/VipPackageManage/VipPackageManage";
import AddVipPackage from "./Component/AdminComponent/VipPackageManage/AddVipPackage";
import UpdateVipPackage from "./Component/AdminComponent/VipPackageManage/UpdateVipPackage";
import ChangePassword from "./Component/Profile/ChangePassword";
import TestRecord from "./Component/Test/TestRecord/TestRecord";
import RecordByTest from "./Component/Test/TestRecord/RecordByTest";
import UserPrivate from "./Component/Common/Layout/UserPrivate";
import EmailVerify from "./Component/Login/MailVerify/EmailVerify";
import TestResult from "./Component/Test/TestResult/TestResult";
import CommentManage from "./Component/AdminComponent/CommentManage/CommentManage";
import VocabularyUserManager from "./Component/Vocabulary/VocabularyManager";
import { VocabularyProvider } from "./Context/VocabularyContext";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ToastContainer
          position={toast.POSITION.BOTTOM_RIGHT}
          autoClose={5000}
          closeOnClick={true}
          pauseOnHover={true}
          draggable={true}
        />
        <UserLayout>
          <VocabularyProvider>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/login/success" element={<EmailVerify />} />
              <Route
                exact
                path="/practice-vocabulary"
                element={<VocabularyTopic />}
              />
              <Route
                exact
                path="/vocabulary-by-topic/:id"
                element={<VocabularyByTopic />}
              />
              <Route exact path="/courses" element={<Courses />} />
              <Route
                exact
                path="/course-lessons/:id"
                element={<CourseLessons />}
              />
              <Route exact path="/test" element={<TestIndex />} />
              <Route exact path="/test/type/:id" element={<TestList />} />
              <Route exact path="/test/result/:id" element={<TestResult />} />
              <Route
                exact
                path="/forgot-password"
                element={<ForgotPassword />}
              />

              <Route element={<UserPrivate />}>
                <Route
                  exact
                  path="/vocabulary-by-user/:id"
                  element={<VocabularyUserManager />}
                />
                <Route
                  exact
                  path="/user/profile/:id"
                  element={<UserProfile />}
                />
                <Route
                  exact
                  path="/user/changePassword"
                  element={<ChangePassword />}
                />
                <Route exact path="/lesson/:id" element={<Lesson />} />
                <Route exact path="/test/record" element={<TestRecord />} />
                <Route exact path="/test/:id" element={<RecordByTest />} />
                <Route exact path="/do-test/:id" element={<TestMain />} />
                <Route exact path="/vippackage" element={<VipPackage />} />
                <Route
                  exact
                  path="/vippackage-detail/:id"
                  element={<VipPackageDetail />}
                />
                <Route
                  exact
                  path="/vippackage-checkout/:state"
                  element={<VipPackageCheckout />}
                />
                <Route
                  exact
                  path="/payment-history"
                  element={<VipPackageCheckout />}
                />
              </Route>
            </Routes>
          </VocabularyProvider>
        </UserLayout>
        <ProfessorLayout>
          <Routes>
            <Route exact path="/" element={<ProfessorHome />}>
              <Route exact path="/user/profile/:id" element={<UserProfile />} />
              <Route
                exact
                path="/user/changePassword"
                element={<ChangePassword />}
              />
              <Route
                exact
                path="professor/test"
                element={<ProfessorTestManage />}
              />
              <Route exact path="professor/test/:id" element={<UpdateTest />} />
              <Route
                exact
                path="professor/test/unit/:id"
                element={<UpdateUnit />}
              />

              <Route
                exact
                path="professor/vocabulary"
                element={<ProfessorVocabularyTopic />}
              />
              <Route
                exact
                path="professor/vocabulary/:id"
                element={<ProfessorVocabulary />}
              />
              <Route
                exact
                path="professor/course"
                element={<CourseManageIndex />}
              />
              <Route
                exact
                path="professor/course/:id"
                element={<LessonManage />}
              />
              <Route
                exact
                path="professor/course/lesson/:id"
                element={<UpdateLesson />}
              />
              <Route
                exact
                path="professor/course/lesson/add/:id"
                element={<AddLesson />}
              />
              <Route
                exact
                path="professor/course/lesson/quiz/:id"
                element={<UpdateQuiz />}
              />
            </Route>
          </Routes>
        </ProfessorLayout>
        <AdminLayout>
          <Routes>
            <Route exact path="/" element={<AdminHome />}>
              <Route exact path="/user/profile/:id" element={<UserProfile />} />
              <Route
                exact
                path="/user/changePassword"
                element={<ChangePassword />}
              />
              <Route exact path="admin/user" element={<UserManage />} />
              <Route exact path="admin/user/add" element={<AddUser />} />
              <Route
                exact
                path="admin/vip-package"
                element={<VipPackageManage />}
              />
              <Route
                exact
                path="admin/vip-package/add"
                element={<AddVipPackage />}
              />
              <Route
                exact
                path="admin/vip-package/update/:idPackage"
                element={<UpdateVipPackage />}
              />
              <Route
                exact
                path="admin/comment-manage"
                element={<CommentManage />}
              />
            </Route>
          </Routes>
        </AdminLayout>
      </BrowserRouter>
    </div>
  );
}

export default App;
