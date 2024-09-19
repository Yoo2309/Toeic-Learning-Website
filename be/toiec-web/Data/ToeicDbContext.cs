using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using toeic_web.Data;
using toiec_web.Data;

namespace toeic_web.Models
{
    public class ToeicDbContext : IdentityDbContext<IdentityUser>
    {
        public ToeicDbContext(DbContextOptions<ToeicDbContext> options) 
            : base(options) 
        { 

        }
        #region DbSet
        public virtual DbSet<Admin> Admins { get; set; }
        public virtual DbSet<AnswerQuestion> AnswerQuestions { get; set; }
        public virtual DbSet<Comment> Comments { get; set; }
        public virtual DbSet<Course> Courses { get; set; }
        public virtual DbSet<Lesson> Lessons { get; set; }
        public virtual DbSet<Payment> Payments { get; set; }
        public virtual DbSet<PaymentMethod> PaymentMethods { get; set; }
        public virtual DbSet<Professor> Professors { get; set; }
        public virtual DbSet<Question> Questions { get; set; }
        public virtual DbSet<Quiz> Quizs { get; set; }
        public virtual DbSet<Report> Reports { get; set; }
        public virtual DbSet<Student> Students { get; set; }
        public virtual DbSet<Test> Tests { get; set; }
        public virtual DbSet<TestPart> TestParts { get; set; }
        public virtual DbSet<TestQuestionUnit> TestQuestionUnits { get; set; }
        public virtual DbSet<TestRecord> TestRecords { get; set; }
        public virtual DbSet<TestType> TestTypes { get; set; }
        public virtual DbSet<UserAnswer> UserAnswers { get; set; }
        public virtual DbSet<Users> Users { get; set; }
        public virtual DbSet<VipPackage> VipPackages { get; set; }
        public virtual DbSet<VipStudent> VipStudents { get; set; }
        public virtual DbSet<Vocabulary> Vocabularies { get; set;}
        public virtual DbSet<VocList> VocList { get; set; }
        public virtual DbSet<ResetPassword> ResetPasswords { get; set; }
        public virtual DbSet<ScoreParam> ScoreParams { get; set; }
        public virtual DbSet<RoadMap> RoadMaps { get; set; }
        public virtual DbSet<UserRoute> UserRoutes { get; set; }
        public virtual DbSet<UserChatBot> UserChatBots { get; set; }

        #endregion

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            //SeedDatas(modelBuilder);

            //config table
            #region relationship
            modelBuilder.Entity<Admin>(entity =>
            {
                entity.HasKey(s => s.idAdmin);

            });
            modelBuilder.Entity<UserChatBot>(entity =>
            {
                entity.HasKey(s => s.idUser);

            });
            modelBuilder.Entity<AnswerQuestion>(entity =>
            {
                entity.HasKey(s => s.idAnswer);

            });
            modelBuilder.Entity<Comment>(entity =>
            {
                entity.HasKey(s => s.idComment);
                entity.HasOne(s => s.Users).WithMany(s => s.Comments)
                    .HasForeignKey(s => s.idUser)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_CommentsOfUser");
                entity.HasOne(s => s.Lessons).WithMany(s => s.Comments)
                    .HasForeignKey(s => s.idLesson)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_CommentsOfLesson");

            });
            modelBuilder.Entity<Course>(entity =>
            {
                entity.HasKey(s => s.idCourse);
                entity.HasOne(s => s.Professor).WithMany(s => s.Courses)
                    .HasForeignKey(s => s.idProfessor)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_CourseOfProfessor");
                entity.HasOne(s => s.RoadMap).WithMany(s => s.Courses)
                    .HasForeignKey(s => s.idRoadMap)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_CourseOfRoadMap");

            });
            modelBuilder.Entity<Lesson>(entity =>
            {
                entity.HasKey(s => s.idLesson);
                entity.HasOne(s => s.Course).WithMany(s => s.Lessons)
                    .HasForeignKey(s => s.idCourse)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_LessonOfCourse");
            });
            modelBuilder.Entity<Payment>(entity =>
            {
                entity.HasKey(s => s.idPayment);
                entity.HasOne(s => s.PaymentMethod).WithMany(s => s.Payments)
                    .HasForeignKey(s => s.idMethod)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("PaymentOfMethod");
                entity.HasOne(s => s.Student).WithMany(s => s.Payments)
                    .HasForeignKey(s => s.idStudent)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("PaymentOfStudent");
                entity.HasOne(s => s.VipPackage).WithMany(s => s.Payments)
                    .HasForeignKey(s => s.idPackage)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("PaymentOfVipPackage");
            });
            modelBuilder.Entity<PaymentMethod>(entity =>
            {
                entity.HasKey(s => s.idMethod);
                
            });
            modelBuilder.Entity<Professor>(entity =>
            {
                entity.HasKey(s => s.idProfessor);

            });
            modelBuilder.Entity<Question>(entity =>
            {
                entity.HasKey(s => s.idQuestion);
                entity.HasOne(s => s.Quiz).WithMany(s => s.Questions)
                    .HasForeignKey(s => s.idQuiz)
                    .IsRequired(false)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_QuestionsOfQuiz");
                entity.HasOne(s => s.TestQuestionUnit).WithMany(s => s.Questions)
                    .HasForeignKey(s => s.idUnit)
                    .IsRequired(false)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_QuestionsOfUnit");
                entity.HasOne(s => s.Professor).WithMany(s => s.Questions)
                    .HasForeignKey(s => s.idProfessor)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_QuestionsOfProfessor");

            });
            modelBuilder.Entity<Quiz>(entity =>
            {
                entity.HasKey(s => s.idQuiz);
                entity.HasOne(s => s.Lesson).WithMany(s => s.Quizzes)
                    .HasForeignKey(s => s.idLesson)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_QuizzesOfLesson");
            });
            modelBuilder.Entity<Report>(entity =>
            {
                entity.HasKey(s => s.idReport);
                entity.HasOne(s => s.Users).WithMany(s => s.Reports)
                    .HasForeignKey(s => s.idUser)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ReportsOfUser");
                entity.HasOne(s => s.Comment).WithMany(s => s.Reports)
                    .HasForeignKey(s => s.idComment)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ReportOfComment");

            });
            modelBuilder.Entity<RoadMap>(entity =>
            {
                entity.HasKey(s => s.Id);
            });
            modelBuilder.Entity<UserRoute>(entity =>
            {
                entity.HasKey(s => s.Id);
                entity.HasOne(s => s.RoadMap).WithMany(s => s.UserRoutes)
                    .HasForeignKey(s => s.IdRoadMap)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_UserRouteOfRoadMap");
                entity.HasOne(s => s.Users).WithMany(s => s.UserRoutes)
                    .HasForeignKey(s => s.IdUser)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_UserRouteOfUser");
            });
            modelBuilder.Entity<Student>(entity =>
            {
                entity.HasKey(s => s.idStudent);
                entity.HasOne(s => s.VipStudent).WithOne(s => s.Student)
                    .HasForeignKey<VipStudent>(s => s.idStudent)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_VipStudentOfStudent");
            });
            modelBuilder.Entity<Test>(entity =>
            {
                entity.HasKey(s => s.idTest);
                entity.HasOne(s => s.TestType).WithMany(s => s.Tests)
                    .HasForeignKey(s => s.idType)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("TypeTest");
                entity.HasOne(s => s.Professor).WithMany(s => s.Tests)
                    .HasForeignKey(s => s.idProfessor)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("TestOfProfessor");
                entity.HasOne(s => s.RoadMap).WithMany(s => s.Tests)
                    .HasForeignKey(s => s.idRoadMap)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("TestOfRoadMap");
            });
            modelBuilder.Entity<TestPart>(entity =>
            {
                entity.HasKey(s => s.partId);
            });
            modelBuilder.Entity<TestQuestionUnit>(entity =>
            {
                entity.HasKey(s => s.idQuestionUnit);
                entity.HasOne(s => s.TestPart).WithMany(s => s.TestQuestionUnits)
                    .HasForeignKey(s => s.idTestPart)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_UnitOfTestPart");
                entity.HasOne(s => s.Test).WithMany(s => s.TestQuestionUnits)
                    .HasForeignKey(s => s.idTest)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_UnitsOfTest");
            });
            modelBuilder.Entity<TestRecord>(entity =>
            {
                entity.HasKey(s => s.idRecord);
                entity.HasOne(s => s.Test).WithMany(s => s.TestRecords)
                    .HasForeignKey(s => s.idTest)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("RecordOfTest");
                entity.HasOne(s => s.Student).WithMany(s => s.TestRecords)
                    .HasForeignKey(s => s.idStudent)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("RecordOfStudent");

            });
            modelBuilder.Entity<TestType>(entity =>
            {
                entity.HasKey(s => s.idTestType);
            });
            modelBuilder.Entity<UserAnswer>(entity =>
            {
                entity.HasKey(s => s.idUAnswer);
                entity.HasOne(s => s.TestRecord).WithMany(s => s.UserAnswers)
                    .HasForeignKey(s => s.idRecord)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_RecordAnswer");
                entity.HasOne(s => s.Question).WithMany(s => s.UserAnswers)
                    .HasForeignKey(s => s.idQuestion)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_AnswerOfQuestion");
                entity.HasOne(s => s.Student).WithMany(s => s.UserAnswers)
                    .HasForeignKey(s => s.idStudent)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_AnswerOfStudent");
            });
            modelBuilder.Entity<Users>(entity =>
            {
                entity.HasOne(s => s.Student).WithOne(s => s.Users)
                    .HasForeignKey<Student>(s => s.idUser)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_StudentOfUser");
                entity.HasOne(s => s.Admin).WithOne(s => s.Users)
                    .HasForeignKey<Admin>(s => s.idUser)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_AdminOfUser");
                entity.HasOne(s => s.Professor).WithOne(s => s.Users)
                    .HasForeignKey<Professor>(s => s.idUser)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_ProfessorOfUser");

            });
            modelBuilder.Entity<VipPackage>(entity =>
            {
                entity.HasKey(s => s.idPackage);
                entity.HasOne(s => s.Admin).WithMany(s => s.VipPackages)
                    .HasForeignKey(s => s.idAdmin)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ManageVipPackage");
            });
            modelBuilder.Entity<VipStudent>(entity =>
            {
                entity.HasKey(s => s.idVipStudent);
                
            });
            modelBuilder.Entity<Vocabulary>(entity =>
            {
                entity.HasKey(s => s.idVoc);

                // Define foreign key and cascade delete behavior
                entity.HasOne(s => s.VocTopic)
                    .WithMany(s => s.Vocabularies)
                    .HasForeignKey(s => s.idList)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_VocOfTopic");

                // Create index on idVoc column
                entity.HasIndex(s => s.idVoc)
                    .IsUnique(); // Optional: If idVoc is unique, specify it
                entity.HasIndex(v => v.idList);
            });
            modelBuilder.Entity<VocList>(entity =>
            {
                entity.HasKey(s => s.idVocList);
                entity.HasOne(s => s.Users).WithMany(s => s.VocTopics)
                    .HasForeignKey(s => s.idUser)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_TopicOfUser");
                entity.HasOne(s => s.RoadMap).WithMany(s => s.VocLists)
                    .HasForeignKey(s => s.idRoadMap)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_TopicOfRoadMap");
            });
            modelBuilder.Entity<ScoreParam>(entity =>
            {
                entity.HasKey(s => s.correctAnswers);
            });

            #endregion

        }

        private static void SeedDatas(ModelBuilder builder)
        {
            builder.Entity<IdentityRole>().HasData
                (
                new IdentityRole() { Id = "8111cfd6-214a-4694-a13c-c6ec3d7f56b2", Name = "Admin", ConcurrencyStamp = "1", NormalizedName = "Admin" },
                new IdentityRole() { Id = "1257b8ad-564a-456f-81a1-d38f180ddd63", Name = "Student", ConcurrencyStamp = "2", NormalizedName = "Student" },
                new IdentityRole() { Id = "35564c0c-f6fc-4ce5-ad98-f3c362e90ed1", Name = "VipStudent", ConcurrencyStamp = "3", NormalizedName = "VipStudent" },
                new IdentityRole() { Id = "9faf18a9-5a41-4b13-9db3-63246839aea9", Name = "Professor", ConcurrencyStamp = "4", NormalizedName = "Professor" }
                );
            builder.Entity<TestPart>().HasData
                (
                new TestPart() { partId = Guid.Parse("06e8a549-7718-4bb0-9c15-224525d10b0f"), partName = "Part 1" },
                new TestPart() { partId = Guid.Parse("05964104-9e0f-48cf-b7ac-0868b8522269"), partName = "Part 2" },
                new TestPart() { partId = Guid.Parse("4985a804-99e7-44bf-bec7-a2f0dff6a9da"), partName = "Part 3" },
                new TestPart() { partId = Guid.Parse("8e459976-3213-47b0-b695-2f8846b61f8b"), partName = "Part 4" },
                new TestPart() { partId = Guid.Parse("9766f92b-5c9e-4723-8191-bb43846501d6"), partName = "Part 5" },
                new TestPart() { partId = Guid.Parse("9ca38118-de2d-4567-aa37-e2c9ad934759"), partName = "Part 6" },
                new TestPart() { partId = Guid.Parse("e8b85f16-f021-4611-90d9-9613c85589e8"), partName = "Part 7" }
                );
            builder.Entity<TestType>().HasData
                (
                    new TestType() { idTestType = Guid.Parse("6a389eb7-551c-402f-a909-974a594892a2"), typeName = "Mini Test"},
                    new TestType() { idTestType = Guid.Parse("177146a9-5270-4092-a8f3-b385f480b9d8"), typeName = "Full Test" }
                );
        }
    }
}
