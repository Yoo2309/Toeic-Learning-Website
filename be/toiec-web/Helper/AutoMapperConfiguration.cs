using AutoMapper;
using toeic_web.Data;
using toeic_web.Models;
using toeic_web.ViewModels.Course;
using toeic_web.ViewModels.Lesson;
using toeic_web.ViewModels.Question;
using toeic_web.ViewModels.Quiz;
using toeic_web.ViewModels.Test;
using toeic_web.ViewModels.TestPart;
using toeic_web.ViewModels.TestQuestionUnit;
using toeic_web.ViewModels.TestType;
using toeic_web.ViewModels.User;
using toeic_web.ViewModels.UserAnswer;
using toeic_web.ViewModels.Vocabulary;
using toeic_web.ViewModels.VocTopic;
using toeic_web.ViewModels.VipPackage;
using toeic_web.ViewModels.Record;
using toeic_web.ViewModels.Payment;
using toeic_web.ViewModels.DoTest;
using toiec_web.Models;
using toiec_web.ViewModels.Comment;
using Microsoft.EntityFrameworkCore.Internal;
using toiec_web.ViewModels.Report;
using toiec_web.Data;
using toiec_web.ViewModels.RoadMap;

namespace toeic_web.Helper
{
    public class AutoMapperConfiguration : Profile
    {
        public AutoMapperConfiguration()
        {
            #region Course
            CreateMap<Course, CourseModel>().ReverseMap();
            CreateMap<CourseModel, CourseViewModel>().ReverseMap();
            CreateMap<CourseModel, CourseAddModel>().ReverseMap();
            CreateMap<CourseModel, CourseUpdateModel>().ReverseMap();
            #endregion

            #region Comment
            CreateMap<Comment, CommentModel>().ReverseMap();
            CreateMap<CommentModel, CommentAddModel>().ReverseMap();
            CreateMap<CommentModel, CommentUpdateModel>().ReverseMap();
            CreateMap<CommentModel, FirstCommentViewModel>().ReverseMap();
            #endregion
            CreateMap<Report, ReportModel>().ReverseMap();
            CreateMap<ReportModel, ReportViewModel>().ReverseMap();
            CreateMap<ReportModel, ReportAddModel>().ReverseMap();
            CreateMap<ReportModel, ReportUpdateModel>().ReverseMap();
            #region Report

            #endregion

            #region RoadMap
            CreateMap<RoadMap, RoadMapModel>().ReverseMap();
            CreateMap<RoadMapModel, RoadMapUpdateModel>().ReverseMap();
            #endregion

            #region ChatBot
            CreateMap<UserChatBot, ChatAvailableModel>().ReverseMap();
            #endregion

            #region User
            CreateMap<Users, UserModel>().ReverseMap();
            CreateMap<Users, UserViewModel>().ReverseMap();
            CreateMap<UserModel, UserViewModel>().ReverseMap();
            #endregion

            #region Student
            CreateMap<Student, StudentModel>().ReverseMap();
            #endregion

            #region Professor
            CreateMap<Professor, ProfessorModel>().ReverseMap();
            #endregion

            #region Admin
            CreateMap<Admin, AdminModel>().ReverseMap();
            #endregion

            #region VipStudent
            CreateMap<VipStudent, VipStudentModel>().ReverseMap();
            #endregion

            #region Lesson
            CreateMap<Lesson, LessonModel>().ReverseMap();
            CreateMap<LessonModel, LessonAddModel>().ReverseMap();
            CreateMap<LessonModel, LessonViewModel>().ReverseMap();
            CreateMap<LessonModel, LessonUpdateModel>().ReverseMap();
            #endregion

            #region Quiz
            CreateMap<Quiz, QuizModel>().ReverseMap();
            CreateMap<QuizModel, QuizAddModel>().ReverseMap();
            CreateMap<QuizModel, QuizUpdateModel>().ReverseMap();
            CreateMap<QuizModel, QuizViewModel>().ReverseMap();
            #endregion

            #region VocTopic
            CreateMap<VocList, VocListModel>().ReverseMap();
            CreateMap<VocListModel, VocListViewModel>().ReverseMap();
            CreateMap<VocListModel, VocListAddModel>().ReverseMap();
            CreateMap<VocListModel, VocListUpdateModel>().ReverseMap();
            #endregion

            #region Vocabulary
            CreateMap<Vocabulary, VocabularyModel>().ReverseMap();
            CreateMap<VocabularyModel, VocabularyAddModel>().ReverseMap();
            CreateMap<VocabularyModel, VocabularyViewModel>().ReverseMap();
            CreateMap<VocabularyModel, VocabularyUpdateModel>().ReverseMap();
            #endregion

            #region TestType
            CreateMap<TestType, TestTypeModel>().ReverseMap();
            CreateMap<TestTypeModel, TestTypeViewModel>().ReverseMap();
            CreateMap<TestTypeModel, TestTypeAddModel>().ReverseMap();
            CreateMap<TestTypeModel, TestTypeUpdateModel>().ReverseMap();
            #endregion

            #region PaymentMethod
            CreateMap<PaymentMethod, PaymentMethodModel>().ReverseMap();
            #endregion

            #region Payment
            CreateMap<Payment, PaymentModel>().ReverseMap();
            CreateMap<PaymentModel, PaymentViewModel>().ReverseMap();
            #endregion

            #region Test
            CreateMap<Test, TestModel>().ReverseMap();
            CreateMap<TestModel, TestViewModel>().ReverseMap();
            CreateMap<TestModel, TestAddModel>().ReverseMap();
            CreateMap<TestModel, TestUpdateModel>().ReverseMap();
            #endregion

            #region TestQuestionUnit
            CreateMap<TestQuestionUnit, TestQuestionUnitModel>().ReverseMap();
            CreateMap<TestQuestionUnitModel, TestQuestionUnitViewModel>().ReverseMap();
            CreateMap<TestQuestionUnitModel, TestQuestionUnitAddModel>().ReverseMap();
            CreateMap<TestQuestionUnitModel, TestQuestionUnitUpdateModel>().ReverseMap();
            CreateMap<TestQuestionUnitModel, TestQuestionUnitViewModel>().ReverseMap();
            #endregion

            #region TestPart
            CreateMap<TestPart, TestPartModel>().ReverseMap();
            CreateMap<TestPartModel, TestPartViewModel>().ReverseMap();
            #endregion

            #region Question
            CreateMap<Question, QuestionModel>().ReverseMap();
            CreateMap<QuestionModel, QuestionViewModel>().ReverseMap();
            CreateMap<QuestionModel, QuestionAddModel>().ReverseMap();
            CreateMap<QuestionModel, QuestionUpdateModel>().ReverseMap();
            CreateMap<QuestionModel, DoTestQuestionModel>().ReverseMap();
            #endregion

            #region VipPackage
            CreateMap<VipPackage, VipPackageModel>().ReverseMap();
            CreateMap<VipPackageModel, VipPackageViewModel>().ReverseMap();
            CreateMap<VipPackageModel, VipPackageAddModel>().ReverseMap();
            CreateMap<VipPackageModel, VipPackageUpdateModel>().ReverseMap();
            #endregion

            #region UserAnswer
            CreateMap<UserAnswer, UserAnswerModel>().ReverseMap();
            CreateMap<UserAnswerModel, UserAnswerAddModel>().ReverseMap();
            CreateMap<UserAnswerModel, UserAnswerViewModel>().ReverseMap();
            #endregion

            #region Record
            CreateMap<TestRecord, RecordModel>().ReverseMap();
            CreateMap<RecordModel, RecordViewModel>().ReverseMap();
            #endregion

        }
    }
}
