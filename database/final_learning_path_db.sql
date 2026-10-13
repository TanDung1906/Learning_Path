USE [master]
GO
IF EXISTS (SELECT name FROM sys.databases WHERE name = N'LearningPath_Base')
BEGIN
    ALTER DATABASE [LearningPath_Base] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE [LearningPath_Base];
END
GO
CREATE DATABASE [LearningPath_Base]
GO
ALTER DATABASE [LearningPath_Base] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [LearningPath_Base].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [LearningPath_Base] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [LearningPath_Base] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [LearningPath_Base] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [LearningPath_Base] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [LearningPath_Base] SET ARITHABORT OFF 
GO
ALTER DATABASE [LearningPath_Base] SET AUTO_CLOSE ON 
GO
ALTER DATABASE [LearningPath_Base] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [LearningPath_Base] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [LearningPath_Base] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [LearningPath_Base] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [LearningPath_Base] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [LearningPath_Base] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [LearningPath_Base] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [LearningPath_Base] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [LearningPath_Base] SET  ENABLE_BROKER 
GO
ALTER DATABASE [LearningPath_Base] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [LearningPath_Base] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [LearningPath_Base] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [LearningPath_Base] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [LearningPath_Base] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [LearningPath_Base] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [LearningPath_Base] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [LearningPath_Base] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [LearningPath_Base] SET  MULTI_USER 
GO
ALTER DATABASE [LearningPath_Base] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [LearningPath_Base] SET DB_CHAINING OFF 
GO
ALTER DATABASE [LearningPath_Base] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [LearningPath_Base] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [LearningPath_Base] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [LearningPath_Base] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'LearningPath_Base', N'ON'
GO
ALTER DATABASE [LearningPath_Base] SET QUERY_STORE = ON
GO
ALTER DATABASE [LearningPath_Base] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [LearningPath_Base]
GO
USE [LearningPath_Base]
GO
/****** Object:  Sequence [dbo].[Seq_Test_ChoiceId]    Script Date: 7/15/2026 7:38:46 PM ******/
CREATE SEQUENCE [dbo].[Seq_Test_ChoiceId] 
 AS [int]
 START WITH 21
 INCREMENT BY 1
 MINVALUE -2147483648
 MAXVALUE 2147483647
 CACHE 
GO
USE [LearningPath_Base]
GO
/****** Object:  Sequence [dbo].[Seq_Test_QuestionId]    Script Date: 7/15/2026 7:38:46 PM ******/
CREATE SEQUENCE [dbo].[Seq_Test_QuestionId] 
 AS [int]
 START WITH 6
 INCREMENT BY 1
 MINVALUE -2147483648
 MAXVALUE 2147483647
 CACHE 
GO
/****** Object:  UserDefinedFunction [dbo].[fn_CanUserTakeTest]    Script Date: 7/15/2026 7:38:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* ============================================================
   8. Function: Kiểm tra user có được làm test không
   ============================================================ */
CREATE   FUNCTION [dbo].[fn_CanUserTakeTest]
(
    @UserId INT,
    @TestId INT
)
RETURNS BIT
AS
BEGIN
    DECLARE @Mode VARCHAR(20);
    DECLARE @CourseId INT;
    DECLARE @TestOrder INT;

    SELECT @Mode = [PrerequisiteMode], @CourseId = [CourseId], @TestOrder = [TestOrder]
    FROM [dbo].[Tests]
    WHERE [TestId] = @TestId;

    IF @Mode = 'NONE'
        RETURN 1;

    IF @Mode = 'ALL_PREVIOUS'
    BEGIN
        IF NOT EXISTS (
            SELECT 1
            FROM [dbo].[Tests] prev
            WHERE prev.[CourseId] = @CourseId
              AND prev.[TestOrder] < @TestOrder
              AND prev.[IsActive] = 1
              AND NOT EXISTS (
                  SELECT 1
                  FROM [dbo].[Test_Attempts] ta
                  WHERE ta.[UserId] = @UserId
                    AND ta.[TestId] = prev.[TestId]
                    AND ta.[IsPass] = 1
              )
        )
            RETURN 1;
        RETURN 0;
    END;

    /* CUSTOM: thỏa ít nhất 1 prerequisite group */
    IF NOT EXISTS (SELECT 1 FROM [dbo].[Test_Prerequisite_Group] WHERE [TestId] = @TestId)
        RETURN 1;

    IF EXISTS (
        SELECT 1
        FROM [dbo].[Test_Prerequisite_Group] g
        WHERE g.[TestId] = @TestId
          AND NOT EXISTS (
              SELECT 1
              FROM [dbo].[Test_Prerequisite_Item] i
              WHERE i.[GroupId] = g.[GroupId]
                AND NOT EXISTS (
                    SELECT 1
                    FROM [dbo].[Test_Attempts] ta
                    WHERE ta.[UserId] = @UserId
                      AND ta.[TestId] = i.[RequireTestId]
                      AND ta.[IsPass] = 1
                )
          )
    )
        RETURN 1;

    RETURN 0;
END;
GO
/****** Object:  UserDefinedFunction [dbo].[fn_IsAttemptPassed]    Script Date: 7/15/2026 7:38:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* ============================================================
   9. Function: Kiểm tra attempt có pass không
   ============================================================ */
CREATE   FUNCTION [dbo].[fn_IsAttemptPassed]
(
    @TestId INT,
    @ScorePercentage DECIMAL(5, 2)
)
RETURNS BIT
AS
BEGIN
    DECLARE @MinScore DECIMAL(5, 2) = 80.00;

    SELECT @MinScore = [MinPassScore]
    FROM [dbo].[Test_Pass_Config]
    WHERE [TestId] = @TestId;

    IF @ScorePercentage >= ISNULL(@MinScore, 80.00)
        RETURN 1;

    RETURN 0;
END;
GO
/****** Object:  Table [dbo].[Test_Prerequisites]    Script Date: 7/15/2026 7:38:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Test_Prerequisites](
	[TestId] [int] NOT NULL,
	[PrerequisiteTestId] [int] NOT NULL,
 CONSTRAINT [PK_Test_Prerequisites] PRIMARY KEY CLUSTERED 
(
	[TestId] ASC,
	[PrerequisiteTestId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Tests]    Script Date: 7/15/2026 7:38:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Tests](
	[TestId] [int] NOT NULL,
	[PathId] [int] NULL,
	[CourseId] [int] NOT NULL,
	[InstructorId] [int] NOT NULL,
	[IsCourseTest] [bit] NULL,
	[TestName] [nvarchar](200) NULL,
	[TestOrder] [int] NOT NULL,
	[IsActive] [bit] NOT NULL,
	[HasPrerequisite] [bit] NOT NULL,
 CONSTRAINT [PK_Tests] PRIMARY KEY CLUSTERED 
(
	[TestId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  View [dbo].[vw_Test_Prerequisite_Summary]    Script Date: 7/15/2026 7:38:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO

CREATE VIEW [dbo].[vw_Test_Prerequisite_Summary]
AS
SELECT
    tp.[TestId],
    t.[TestName] AS [TestName],
    t.[PathId] AS [PathId],
    t.[CourseId] AS [CourseId],
    t.[HasPrerequisite],
    tp.[PrerequisiteTestId],
    pre.[TestName] AS [PrerequisiteTestName],
    pre.[PathId] AS [PrerequisitePathId],
    pre.[TestOrder] AS [PrerequisiteTestOrder]
FROM dbo.Test_Prerequisites tp
INNER JOIN dbo.Tests t ON t.[TestId] = tp.[TestId]
INNER JOIN dbo.Tests pre ON pre.[TestId] = tp.[PrerequisiteTestId];
GO
/****** Object:  Table [dbo].[Categories]    Script Date: 7/15/2026 7:38:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Categories](
	[CategoryId] [int] IDENTITY(1,1) NOT NULL,
	[CategoryName] [nvarchar](50) NOT NULL,
	[DisplayName] [nvarchar](100) NOT NULL,
	[CreatedAt] [datetime] NOT NULL,
	[IsActive] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[CategoryId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Course_Comments]    Script Date: 7/15/2026 7:38:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Course_Comments](
	[CommentId] [int] IDENTITY(1,1) NOT NULL,
	[CourseId] [int] NOT NULL,
	[UserId] [int] NOT NULL,
	[Rating] [tinyint] NULL,
	[Content] [nvarchar](255) NOT NULL,
	[CreatedAt] [datetime] NULL,
	[EditCount] [int] NOT NULL,
	[ParentCommentId] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Courses]    Script Date: 7/15/2026 7:38:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Courses](
	[CourseId] [int] IDENTITY(1,1) NOT NULL,
	[CourseName] [nvarchar](200) NOT NULL,
	[Description] [nvarchar](max) NULL,
	[CategoryId] [int] NULL,
	[LevelId] [int] NULL,
	[InstructorId] [int] NULL,
	[Thumbnail] [nvarchar](500) NULL,
	[Rating] [decimal](3, 1) NULL,
	[TotalLessons] [int] NULL,
	[CreatedAt] [datetime] NOT NULL,
	[UpdatedAt] [datetime] NULL,
	[IsPublished] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[CourseId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Levels]    Script Date: 7/15/2026 7:38:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Levels](
	[LevelId] [int] IDENTITY(1,1) NOT NULL,
	[LevelName] [nvarchar](20) NOT NULL,
	[DisplayName] [nvarchar](50) NOT NULL,
	[SortOrder] [int] NOT NULL,
	[CreatedAt] [datetime] NOT NULL,
	[IsActive] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[LevelId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[News]    Script Date: 7/15/2026 7:38:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[News](
	[NewsId] [int] IDENTITY(1,1) NOT NULL,
	[Title] [nvarchar](255) NOT NULL,
	[CategoryId] [int] NULL,
	[Status] [varchar](20) NOT NULL,
	[Author] [nvarchar](100) NULL,
	[Excerpt] [nvarchar](500) NULL,
	[Content] [nvarchar](max) NULL,
	[Thumbnail] [nvarchar](500) NULL,
	[PublishedAt] [datetime] NULL,
	[UpdatedAt] [datetime] NULL,
	[CreatedBy] [int] NULL,
	[CreatedAt] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[NewsId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Node_Materials]    Script Date: 7/15/2026 7:38:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Node_Materials](
	[MaterialId] [int] IDENTITY(1,1) NOT NULL,
	[NodeId] [int] NOT NULL,
	[MaterialType] [nvarchar](20) NOT NULL,
	[Title] [nvarchar](255) NOT NULL,
	[MaterialUrl] [nvarchar](max) NULL,
	[MaterialOrder] [int] NOT NULL,
	[SourceType] [nvarchar](20) NULL,
	[FileName] [nvarchar](255) NULL,
	[FileSize] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[MaterialId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[OTP_Verification]    Script Date: 7/15/2026 7:38:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OTP_Verification](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Email] [nvarchar](150) NOT NULL,
	[FullName] [nvarchar](100) NOT NULL,
	[Phone] [nvarchar](20) NOT NULL,
	[Password] [nvarchar](255) NOT NULL,
	[DateOfBirth] [date] NOT NULL,
	[OtpCode] [nvarchar](6) NOT NULL,
	[ExpiresAt] [datetime] NOT NULL,
	[CreatedAt] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Path_Nodes]    Script Date: 7/15/2026 7:38:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Path_Nodes](
	[NodeId] [int] IDENTITY(1,1) NOT NULL,
	[PathId] [int] NOT NULL,
	[NodeName] [nvarchar](255) NOT NULL,
	[NodeOrder] [int] NOT NULL,
	[Description] [nvarchar](max) NULL,
	[IsActive] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[NodeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Paths]    Script Date: 7/15/2026 7:38:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Paths](
	[PathId] [int] IDENTITY(1,1) NOT NULL,
	[CourseId] [int] NOT NULL,
	[PathName] [nvarchar](100) NOT NULL,
	[Description] [nvarchar](max) NULL,
	[CreatedAt] [datetime] NOT NULL,
	[Order] [int] NULL,
	[IsActive] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[PathId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Question_Bank]    Script Date: 7/15/2026 7:38:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Question_Bank](
	[BankId] [int] IDENTITY(1,1) NOT NULL,
	[InstructorId] [int] NOT NULL,
	[CourseId] [int] NOT NULL,
	[CourseName] [nvarchar](200) NOT NULL,
	[CourseDescription] [nvarchar](200) NOT NULL,
	[BankDescription] [nvarchar](200) NULL,
	[CreatedAt] [datetime2](7) NULL,
	[UpdatedAt] [datetime2](7) NULL,
	[IsPublished] [bit] NOT NULL,
 CONSTRAINT [PK_Question_Bank] PRIMARY KEY CLUSTERED 
(
	[BankId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Question_Choices]    Script Date: 7/15/2026 7:38:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Question_Choices](
	[ChoiceId] [int] IDENTITY(1,1) NOT NULL,
	[QuestionId] [int] NOT NULL,
	[Title] [nvarchar](250) NOT NULL,
	[Order] [int] NOT NULL,
	[IsTrue] [bit] NOT NULL,
 CONSTRAINT [PK_Question_Choices] PRIMARY KEY CLUSTERED 
(
	[ChoiceId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Question_Sections]    Script Date: 7/15/2026 7:38:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Question_Sections](
	[SectionId] [int] IDENTITY(1,1) NOT NULL,
	[Question_Path_Id] [int] NOT NULL,
	[SectionName] [nvarchar](200) NOT NULL,
	[Title] [nvarchar](200) NULL,
	[TypeId] [int] NOT NULL,
	[Order] [int] NOT NULL,
	[SourceUrl] [nvarchar](max) NULL,
	[IsUseForTest] [bit] NULL,
 CONSTRAINT [PK_Question_Sections] PRIMARY KEY CLUSTERED 
(
	[SectionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Questions]    Script Date: 7/15/2026 7:38:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Questions](
	[QuestionId] [int] IDENTITY(1,1) NOT NULL,
	[SectionId] [int] NOT NULL,
	[Title] [nvarchar](max) NOT NULL,
	[IsActive] [bit] NOT NULL,
	[Order] [int] NOT NULL,
	[IsUseForTest] [bit] NULL,
 CONSTRAINT [PK_Questions_List] PRIMARY KEY CLUSTERED 
(
	[QuestionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Questions_Path]    Script Date: 7/15/2026 7:38:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Questions_Path](
	[Question_Path_Id] [int] IDENTITY(1,1) NOT NULL,
	[BankId] [int] NOT NULL,
	[PathId] [int] NOT NULL,
	[IsActive] [bit] NULL,
 CONSTRAINT [PK_Questions_Path] PRIMARY KEY CLUSTERED 
(
	[Question_Path_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Roles]    Script Date: 7/15/2026 7:38:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Roles](
	[RoleId] [int] IDENTITY(1,1) NOT NULL,
	[RoleName] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Section_Type]    Script Date: 7/15/2026 7:38:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Section_Type](
	[TypeId] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_QuestionType] PRIMARY KEY CLUSTERED 
(
	[TypeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Test_Attempt_Answers]    Script Date: 7/15/2026 7:38:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Test_Attempt_Answers](
	[AnswerId] [int] IDENTITY(1,1) NOT NULL,
	[AttemptId] [int] NOT NULL,
	[QuestionId] [int] NOT NULL,
	[ChoiceId] [int] NULL,
	[IsCorrect] [bit] NOT NULL,
	[AnsweredAt] [datetime] NOT NULL,
 CONSTRAINT [PK_Test_Attempt_Answers] PRIMARY KEY CLUSTERED 
(
	[AnswerId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Test_Attempts]    Script Date: 7/15/2026 7:38:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Test_Attempts](
	[AttemptId] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[TestId] [int] NOT NULL,
	[StartedAt] [datetime] NOT NULL,
	[ExpiresAt] [datetime] NOT NULL,
	[Status] [varchar](50) NOT NULL,
	[Point] [decimal](18, 0) NOT NULL,
	[IsPass] [bit] NOT NULL,
	[ScorePercentage] [decimal](5, 2) NULL,
	[SubmittedAt] [datetime] NULL,
 CONSTRAINT [PK_Test_Attempts] PRIMARY KEY CLUSTERED 
(
	[AttemptId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Test_Config]    Script Date: 7/15/2026 7:38:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Test_Config](
	[ConfigId] [int] IDENTITY(1,1) NOT NULL,
	[TestId] [int] NOT NULL,
	[DurationMinutes] [int] NULL,
	[MaxAttempts] [int] NULL,
	[UpdatedBy] [int] NULL,
	[UpdatedAt] [datetime] NOT NULL,
 CONSTRAINT [PK_Test_Config] PRIMARY KEY CLUSTERED 
(
	[ConfigId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Test_Config_Section]    Script Date: 7/15/2026 7:38:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Test_Config_Section](
	[ConfigSectionId] [int] IDENTITY(1,1) NOT NULL,
	[ConfigId] [int] NOT NULL,
	[QuestionQuantity] [int] NOT NULL,
	[TypeId] [int] NOT NULL,
	[BankSectionId] [int] NULL,
 CONSTRAINT [PK_Test_Config_Section] PRIMARY KEY CLUSTERED 
(
	[ConfigSectionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Test_Pass_Config]    Script Date: 7/15/2026 7:38:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Test_Pass_Config](
	[Test_Pass_Config_Id] [int] NOT NULL,
	[TestId] [int] NOT NULL,
	[MinPassScore] [decimal](5, 2) NOT NULL,
	[AllowReviewAfterPass] [bit] NOT NULL,
	[UpdatedBy] [int] NOT NULL,
	[UpdatedAt] [datetime] NULL,
 CONSTRAINT [PK_Test_Pass_Config_1] PRIMARY KEY CLUSTERED 
(
	[Test_Pass_Config_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[User_Categories]    Script Date: 7/15/2026 7:38:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[User_Categories](
	[UserId] [int] NOT NULL,
	[CategoryId] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[CategoryId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[User_Courses]    Script Date: 7/15/2026 7:38:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[User_Courses](
	[UserId] [int] NOT NULL,
	[CourseId] [int] NOT NULL,
	[ProgressPercentage] [int] NOT NULL,
	[EnrollmentDate] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[CourseId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[User_Nodes]    Script Date: 7/15/2026 7:38:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[User_Nodes](
	[UserId] [int] NOT NULL,
	[NodeId] [int] NOT NULL,
	[IsCompleted] [bit] NOT NULL,
	[CompletedAt] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[NodeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[User_Roles]    Script Date: 7/15/2026 7:38:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[User_Roles](
	[UserId] [int] NOT NULL,
	[RoleId] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 7/15/2026 7:38:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[UserId] [int] IDENTITY(1,1) NOT NULL,
	[FullName] [nvarchar](100) NOT NULL,
	[Email] [nvarchar](150) NULL,
	[Phone] [nvarchar](20) NULL,
	[Password] [nvarchar](255) NULL,
	[DateOfBirth] [date] NULL,
	[IsFirstLogin] [bit] NOT NULL,
	[ResetOtpCode] [nvarchar](6) NULL,
	[ResetOtpExpires] [datetime] NULL,
	[CreatedAt] [datetime] NOT NULL,
	[UpdatedAt] [datetime] NULL,
	[CurrentLevelId] [int] NULL,
	[LearningGoal] [nvarchar](100) NULL,
	[AvatarUrl] [nvarchar](max) NULL,
	[IsActive] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Categories] ON 
GO
INSERT [dbo].[Categories] ([CategoryId], [CategoryName], [DisplayName], [CreatedAt], [IsActive]) VALUES (1, N'business', N'Business English', CAST(N'2026-07-09T00:29:19.160' AS DateTime), 1)
GO
INSERT [dbo].[Categories] ([CategoryId], [CategoryName], [DisplayName], [CreatedAt], [IsActive]) VALUES (2, N'it', N'IT English', CAST(N'2026-07-09T00:29:19.160' AS DateTime), 1)
GO
INSERT [dbo].[Categories] ([CategoryId], [CategoryName], [DisplayName], [CreatedAt], [IsActive]) VALUES (3, N'travel', N'Travel English', CAST(N'2026-07-09T00:29:19.160' AS DateTime), 1)
GO
SET IDENTITY_INSERT [dbo].[Categories] OFF
GO
SET IDENTITY_INSERT [dbo].[Courses] ON 
GO
INSERT [dbo].[Courses] ([CourseId], [CourseName], [Description], [CategoryId], [LevelId], [InstructorId], [Thumbnail], [Rating], [TotalLessons], [CreatedAt], [UpdatedAt], [IsPublished]) VALUES (1, N'Business English for Workplace', N'Khóa học tiếng Anh thương mại: email, họp, thuyết trình và giao tiếp hàng ngày tại công ty.', 1, 3, 2, N'https://res.cloudinary.com/demo/image/upload/sample.jpg', CAST(4.5 AS Decimal(3, 1)), 6, CAST(N'2026-07-09T00:29:19.160' AS DateTime), CAST(N'2026-07-12T01:00:07.000' AS DateTime), 1)
GO
INSERT [dbo].[Courses] ([CourseId], [CourseName], [Description], [CategoryId], [LevelId], [InstructorId], [Thumbnail], [Rating], [TotalLessons], [CreatedAt], [UpdatedAt], [IsPublished]) VALUES (2, N'IT English Essentials', N'Từ vựng và mẫu câu tiếng Anh chuyên ngành CNTT cho developer và QA.', 2, 2, 2, NULL, CAST(4.0 AS Decimal(3, 1)), 4, CAST(N'2026-07-09T00:29:19.160' AS DateTime), CAST(N'2026-07-09T00:49:03.000' AS DateTime), 0)
GO
INSERT [dbo].[Courses] ([CourseId], [CourseName], [Description], [CategoryId], [LevelId], [InstructorId], [Thumbnail], [Rating], [TotalLessons], [CreatedAt], [UpdatedAt], [IsPublished]) VALUES (3, N'Tiếng Anh trong doanh nghiệp', N'Dành cho người mới bắt đầu', 1, 1, 2, N'/assets/avatars/courses/course_avt_3.jpg', CAST(0.0 AS Decimal(3, 1)), 1, CAST(N'2026-07-09T00:50:40.103' AS DateTime), CAST(N'2026-07-11T23:35:52.797' AS DateTime), 1)
GO
INSERT [dbo].[Courses] ([CourseId], [CourseName], [Description], [CategoryId], [LevelId], [InstructorId], [Thumbnail], [Rating], [TotalLessons], [CreatedAt], [UpdatedAt], [IsPublished]) VALUES (4, N'adf', N'asdfasdf', 3, 2, 2, N'/assets/avatars/courses/course_avt_4.jpg', CAST(0.0 AS Decimal(3, 1)), 1, CAST(N'2026-07-09T01:11:14.310' AS DateTime), CAST(N'2026-07-09T01:11:14.650' AS DateTime), 0)
GO
INSERT [dbo].[Courses] ([CourseId], [CourseName], [Description], [CategoryId], [LevelId], [InstructorId], [Thumbnail], [Rating], [TotalLessons], [CreatedAt], [UpdatedAt], [IsPublished]) VALUES (5, N'Giao Tiếp Thông Minh và Tài Ứng Xử V2', N'Giao Tiếp Thông Minh và Tài Ứng Xử V2', 1, 1, 2, N'/assets/avatars/courses/course_avt_5.jpg', CAST(0.0 AS Decimal(3, 1)), 1, CAST(N'2026-07-10T17:13:52.057' AS DateTime), CAST(N'2026-07-10T17:13:52.083' AS DateTime), 0)
GO
INSERT [dbo].[Courses] ([CourseId], [CourseName], [Description], [CategoryId], [LevelId], [InstructorId], [Thumbnail], [Rating], [TotalLessons], [CreatedAt], [UpdatedAt], [IsPublished]) VALUES (6, N'test', N'adsf', 2, 2, 2, N'/assets/avatars/courses/course_avt_6.jpg', CAST(0.0 AS Decimal(3, 1)), 1, CAST(N'2026-07-10T17:34:40.243' AS DateTime), CAST(N'2026-07-10T17:34:40.290' AS DateTime), 0)
GO
INSERT [dbo].[Courses] ([CourseId], [CourseName], [Description], [CategoryId], [LevelId], [InstructorId], [Thumbnail], [Rating], [TotalLessons], [CreatedAt], [UpdatedAt], [IsPublished]) VALUES (7, N'Giao Tiếp Thông Minh và Tài Ứng Xử V1', N'sdasdsa', 1, 1, 2, N'/assets/avatars/courses/course_avt_7.jpg', CAST(0.0 AS Decimal(3, 1)), 1, CAST(N'2026-07-10T21:16:43.413' AS DateTime), CAST(N'2026-07-10T21:16:43.463' AS DateTime), 0)
GO
INSERT [dbo].[Courses] ([CourseId], [CourseName], [Description], [CategoryId], [LevelId], [InstructorId], [Thumbnail], [Rating], [TotalLessons], [CreatedAt], [UpdatedAt], [IsPublished]) VALUES (8, N'khóa demo 3', N'aaaa', 1, 2, 2, N'/assets/avatars/courses/course_avt_8.jpg', CAST(0.0 AS Decimal(3, 1)), 1, CAST(N'2026-07-13T13:32:16.883' AS DateTime), CAST(N'2026-07-13T13:32:49.460' AS DateTime), 0)
GO
INSERT [dbo].[Courses] ([CourseId], [CourseName], [Description], [CategoryId], [LevelId], [InstructorId], [Thumbnail], [Rating], [TotalLessons], [CreatedAt], [UpdatedAt], [IsPublished]) VALUES (9, N'Tiếng anh FPT', N'MT1', 2, 2, 2, N'/assets/avatars/courses/course_avt_9.jpg', CAST(0.0 AS Decimal(3, 1)), 5, CAST(N'2026-07-14T11:09:40.227' AS DateTime), CAST(N'2026-07-14T12:06:00.720' AS DateTime), 1)
GO
SET IDENTITY_INSERT [dbo].[Courses] OFF
GO
SET IDENTITY_INSERT [dbo].[Levels] ON 
GO
INSERT [dbo].[Levels] ([LevelId], [LevelName], [DisplayName], [SortOrder], [CreatedAt], [IsActive]) VALUES (1, N'a1---beginner', N'A1 - Beginner', 1, CAST(N'2026-07-09T00:29:19.160' AS DateTime), 0)
GO
INSERT [dbo].[Levels] ([LevelId], [LevelName], [DisplayName], [SortOrder], [CreatedAt], [IsActive]) VALUES (2, N'a2', N'A2 - Elementary', 2, CAST(N'2026-07-09T00:29:19.160' AS DateTime), 1)
GO
INSERT [dbo].[Levels] ([LevelId], [LevelName], [DisplayName], [SortOrder], [CreatedAt], [IsActive]) VALUES (3, N'b1', N'B1 - Intermediate', 3, CAST(N'2026-07-09T00:29:19.160' AS DateTime), 1)
GO
INSERT [dbo].[Levels] ([LevelId], [LevelName], [DisplayName], [SortOrder], [CreatedAt], [IsActive]) VALUES (4, N'b2', N'B2 - Upper Int.', 4, CAST(N'2026-07-09T00:29:19.160' AS DateTime), 1)
GO
SET IDENTITY_INSERT [dbo].[Levels] OFF
GO
SET IDENTITY_INSERT [dbo].[News] ON 
GO
INSERT [dbo].[News] ([NewsId], [Title], [CategoryId], [Status], [Author], [Excerpt], [Content], [Thumbnail], [PublishedAt], [UpdatedAt], [CreatedBy], [CreatedAt]) VALUES (1, N'Lộ trình IELTS Writing cho người mới bắt đầu', 1, N'PUBLISHED', N'Admin', N'Lộ trình 8 tuần giúp bạn nắm vững Task 1 và Task 2 từ con số 0.', N'<p>Lộ trình IELTS Writing gồm <strong>8 tuần</strong> luyện tập có hệ thống.</p><ul><li>Tuần 1–2: Task 1 cơ bản</li><li>Tuần 3–5: Mô tả biểu đồ nâng cao</li><li>Tuần 6–8: Task 2 và chữa bài</li></ul>', NULL, CAST(N'2026-05-28T08:00:00.000' AS DateTime), CAST(N'2026-07-13T04:04:16.533' AS DateTime), 1, CAST(N'2026-07-13T03:00:07.743' AS DateTime))
GO
INSERT [dbo].[News] ([NewsId], [Title], [CategoryId], [Status], [Author], [Excerpt], [Content], [Thumbnail], [PublishedAt], [UpdatedAt], [CreatedBy], [CreatedAt]) VALUES (2, N'5 mẹo luyện Speaking IELTS hiệu quả tại nhà', 1, N'PUBLISHED', N'Nguyễn Minh Anh', N'Cách tự luyện nói mỗi ngày 15 phút mà không cần partner.', N'<p>5 mẹo luyện Speaking IELTS tại nhà hiệu quả.</p>', NULL, CAST(N'2026-07-12T21:05:47.817' AS DateTime), CAST(N'2026-07-13T04:05:47.827' AS DateTime), 1, CAST(N'2026-07-13T03:00:07.743' AS DateTime))
GO
INSERT [dbo].[News] ([NewsId], [Title], [CategoryId], [Status], [Author], [Excerpt], [Content], [Thumbnail], [PublishedAt], [UpdatedAt], [CreatedBy], [CreatedAt]) VALUES (3, N'Lộ trình Giao tiếp tiếng Anh cơ bản', 2, N'HIDDEN', N'Admin', N'Từ chào hỏi đến hội thoại hàng ngày trong 6 tuần.', N'<p>Lộ trình giao tiếp tiếng Anh cơ bản 6 tuần.</p>', NULL, NULL, CAST(N'2026-07-13T03:35:58.750' AS DateTime), 1, CAST(N'2026-07-13T03:00:07.743' AS DateTime))
GO
INSERT [dbo].[News] ([NewsId], [Title], [CategoryId], [Status], [Author], [Excerpt], [Content], [Thumbnail], [PublishedAt], [UpdatedAt], [CreatedBy], [CreatedAt]) VALUES (4, N'Phân biệt Present Perfect và Past Simple', 1, N'HIDDEN', N'Trần Hoàng Long', N'Giải thích ngắn gọn kèm ví dụ thực tế cho người học trung cấp.', N'<p>Phân biệt Present Perfect và Past Simple.</p>', NULL, NULL, CAST(N'2026-07-13T03:38:46.370' AS DateTime), 1, CAST(N'2026-07-13T03:00:07.743' AS DateTime))
GO
INSERT [dbo].[News] ([NewsId], [Title], [CategoryId], [Status], [Author], [Excerpt], [Content], [Thumbnail], [PublishedAt], [UpdatedAt], [CreatedBy], [CreatedAt]) VALUES (5, N'Lộ trình Phát âm chuẩn Anh-Mỹ', 3, N'DRAFT', N'Admin', N'Bài tập IPA và shadowing theo từng tuần.', N'<p>Lộ trình phát âm chuẩn Anh-Mỹ.</p>', NULL, NULL, CAST(N'2026-06-01T11:20:00.000' AS DateTime), 1, CAST(N'2026-07-13T03:00:07.743' AS DateTime))
GO
INSERT [dbo].[News] ([NewsId], [Title], [CategoryId], [Status], [Author], [Excerpt], [Content], [Thumbnail], [PublishedAt], [UpdatedAt], [CreatedBy], [CreatedAt]) VALUES (6, N'TOEIC 750+ trong 3 tháng — có khả thi không?', 1, N'DRAFT', N'Lê Thị Hương', N'Phân tích lộ trình và khối lượng bài tập cần thiết.', N'<p>Phân tích lộ trình TOEIC 750+.</p>', NULL, NULL, CAST(N'2026-06-02T16:45:00.000' AS DateTime), 1, CAST(N'2026-07-13T03:00:07.743' AS DateTime))
GO
INSERT [dbo].[News] ([NewsId], [Title], [CategoryId], [Status], [Author], [Excerpt], [Content], [Thumbnail], [PublishedAt], [UpdatedAt], [CreatedBy], [CreatedAt]) VALUES (7, N'Lộ trình Luyện thi TOEIC Listening', 1, N'DRAFT', N'Admin', N'Tập trung Part 1–4 với chiến lược làm bài và mock test.', N'<p>Lộ trình luyện thi TOEIC Listening.</p>', NULL, NULL, CAST(N'2026-07-13T03:38:54.920' AS DateTime), 1, CAST(N'2026-07-13T03:00:07.743' AS DateTime))
GO
INSERT [dbo].[News] ([NewsId], [Title], [CategoryId], [Status], [Author], [Excerpt], [Content], [Thumbnail], [PublishedAt], [UpdatedAt], [CreatedBy], [CreatedAt]) VALUES (8, N'Cách đọc hiểu bài IELTS Reading dài', 1, N'HIDDEN', N'Phạm Quốc Bảo', N'Kỹ thuật skimming, scanning và quản lý thời gian.', N'<p>Kỹ thuật đọc IELTS Reading.</p>', NULL, CAST(N'2026-03-01T09:00:00.000' AS DateTime), CAST(N'2026-05-01T08:30:00.000' AS DateTime), 1, CAST(N'2026-07-13T03:00:07.743' AS DateTime))
GO
INSERT [dbo].[News] ([NewsId], [Title], [CategoryId], [Status], [Author], [Excerpt], [Content], [Thumbnail], [PublishedAt], [UpdatedAt], [CreatedBy], [CreatedAt]) VALUES (9, N'Lộ trình Business English cho dân văn phòng', 2, N'DRAFT', N'Admin', N'Email, họp online và thuyết trình bằng tiếng Anh.', N'<p>Lộ trình Business English cho dân văn phòng.</p>', NULL, NULL, CAST(N'2026-07-13T03:53:13.597' AS DateTime), 1, CAST(N'2026-07-13T03:00:07.743' AS DateTime))
GO
INSERT [dbo].[News] ([NewsId], [Title], [CategoryId], [Status], [Author], [Excerpt], [Content], [Thumbnail], [PublishedAt], [UpdatedAt], [CreatedBy], [CreatedAt]) VALUES (10, N'Từ vựng chủ đề Environment cho IELTS', 1, N'PUBLISHED', N'Nguyễn Minh Anh', N'50 collocations thường gặp trong Writing Task 2.', N'<p>50 collocations chủ đề Environment.</p>', NULL, CAST(N'2026-03-20T06:00:00.000' AS DateTime), CAST(N'2026-03-20T06:00:00.000' AS DateTime), 1, CAST(N'2026-07-13T03:00:07.743' AS DateTime))
GO
INSERT [dbo].[News] ([NewsId], [Title], [CategoryId], [Status], [Author], [Excerpt], [Content], [Thumbnail], [PublishedAt], [UpdatedAt], [CreatedBy], [CreatedAt]) VALUES (11, N'Lộ trình IELTS 6.5 Overall', 1, N'DRAFT', N'Admin', N'Kế hoạch 12 tuần cân bằng 4 kỹ năng.', N'<p>Lộ trình IELTS 6.5 Overall 12 tuần.</p>', N'/uploads/news/news_thumb_11_1783916681368.jpg', NULL, CAST(N'2026-07-13T11:24:41.397' AS DateTime), 1, CAST(N'2026-07-13T03:00:07.743' AS DateTime))
GO
INSERT [dbo].[News] ([NewsId], [Title], [CategoryId], [Status], [Author], [Excerpt], [Content], [Thumbnail], [PublishedAt], [UpdatedAt], [CreatedBy], [CreatedAt]) VALUES (12, N'Học tiếng Anh qua podcast — gợi ý 10 kênh', 2, N'PUBLISHED', N'Trần Hoàng Long', N'Danh sách podcast phù hợp trình độ A2–B2.', N'<p>10 kênh podcast học tiếng Anh.</p>', NULL, CAST(N'2026-02-14T08:00:00.000' AS DateTime), CAST(N'2026-02-14T08:00:00.000' AS DateTime), 1, CAST(N'2026-07-13T03:00:07.743' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[News] OFF
GO
SET IDENTITY_INSERT [dbo].[Node_Materials] ON 
GO
INSERT [dbo].[Node_Materials] ([MaterialId], [NodeId], [MaterialType], [Title], [MaterialUrl], [MaterialOrder], [SourceType], [FileName], [FileSize]) VALUES (1, 1, N'VIDEO', N'Video: Email structure overview', N'https://res.cloudinary.com/diyjnwfsy/video/upload/q_auto/v1783680606/s2c1qeoa216wywoegxnn.mp4', 1, N'UPLOAD', N'9mb.mp4', 9622535)
GO
INSERT [dbo].[Node_Materials] ([MaterialId], [NodeId], [MaterialType], [Title], [MaterialUrl], [MaterialOrder], [SourceType], [FileName], [FileSize]) VALUES (2, 1, N'DOC', N'Slide: Email templates', N'https://res.cloudinary.com/diyjnwfsy/raw/upload/v1783532468/learning-path/materials/tieng-anh-ma-de-402-2019_1783433753581_1783524170101_1783532466961.docx', 2, N'UPLOAD', N'tieng-anh-ma-de-402-2019_1783433753581_1783524170101.docx', 72721)
GO
INSERT [dbo].[Node_Materials] ([MaterialId], [NodeId], [MaterialType], [Title], [MaterialUrl], [MaterialOrder], [SourceType], [FileName], [FileSize]) VALUES (3, 2, N'TEXT', N'Cheat sheet: Meeting phrases', N'https://res.cloudinary.com/diyjnwfsy/raw/upload/v1783680825/learning-path/materials/text/Cheat_sheet_Meeting_phrases_1783680823308.html', 1, N'UPLOAD', N'Cheat_sheet_Meeting_phrases.html', 44209)
GO
INSERT [dbo].[Node_Materials] ([MaterialId], [NodeId], [MaterialType], [Title], [MaterialUrl], [MaterialOrder], [SourceType], [FileName], [FileSize]) VALUES (4, 3, N'TEST', N'Quiz Chương 1', NULL, 1, NULL, NULL, NULL)
GO
INSERT [dbo].[Node_Materials] ([MaterialId], [NodeId], [MaterialType], [Title], [MaterialUrl], [MaterialOrder], [SourceType], [FileName], [FileSize]) VALUES (5, 4, N'VIDEO', N'Video: Presentation openings', N'https://res.cloudinary.com/diyjnwfsy/video/upload/q_auto/v1783690799/fuvhnx68ndtfrn8qqthd.mp4', 1, N'UPLOAD', N'9mb.mp4', 9622535)
GO
INSERT [dbo].[Node_Materials] ([MaterialId], [NodeId], [MaterialType], [Title], [MaterialUrl], [MaterialOrder], [SourceType], [FileName], [FileSize]) VALUES (7, 6, N'DOC', N'IT glossary PDF', N'https://res.cloudinary.com/demo/raw/upload/sample.pdf', 1, N'UPLOAD', N'it-glossary.pdf', 204800)
GO
INSERT [dbo].[Node_Materials] ([MaterialId], [NodeId], [MaterialType], [Title], [MaterialUrl], [MaterialOrder], [SourceType], [FileName], [FileSize]) VALUES (8, 7, N'DOC', N'tài liệu tham khảo', N'https://res.cloudinary.com/diyjnwfsy/raw/upload/v1783533036/learning-path/materials/tieng-anh-ma-de-402-2019_1783433753581_1783524170101_1783532466961_1783533035060.docx', 1, N'UPLOAD', N'tieng-anh-ma-de-402-2019_1783433753581_1783524170101_1783532466961.docx', 72721)
GO
INSERT [dbo].[Node_Materials] ([MaterialId], [NodeId], [MaterialType], [Title], [MaterialUrl], [MaterialOrder], [SourceType], [FileName], [FileSize]) VALUES (9, 8, N'VIDEO', N'Just One More Drink -- Jazz Noir', N'https://www.youtube.com/watch?v=7gtIh5dF9Xk&list=RD7gtIh5dF9Xk&start_radio=1', 1, N'LINK', NULL, NULL)
GO
INSERT [dbo].[Node_Materials] ([MaterialId], [NodeId], [MaterialType], [Title], [MaterialUrl], [MaterialOrder], [SourceType], [FileName], [FileSize]) VALUES (10, 9, N'VIDEO', N'TOP 20 Bản Nhạc Lofi Chill 2023 - Nhạc Ballad Chill Nhẹ Nhàng - Nhạc Lofi Chill Buồn Hot TikTok', N'https://www.youtube.com/watch?v=DAPS1rBUPZ0&list=RDDAPS1rBUPZ0&start_radio=1', 1, N'LINK', NULL, NULL)
GO
INSERT [dbo].[Node_Materials] ([MaterialId], [NodeId], [MaterialType], [Title], [MaterialUrl], [MaterialOrder], [SourceType], [FileName], [FileSize]) VALUES (11, 10, N'TEXT', N'ádf', N'https://res.cloudinary.com/diyjnwfsy/raw/upload/v1783679679/learning-path/materials/text/_df_1783679677625.html', 1, N'UPLOAD', N'_df.html', 44209)
GO
INSERT [dbo].[Node_Materials] ([MaterialId], [NodeId], [MaterialType], [Title], [MaterialUrl], [MaterialOrder], [SourceType], [FileName], [FileSize]) VALUES (12, 10, N'DOC', N'ádfasdf', N'https://res.cloudinary.com/diyjnwfsy/raw/upload/v1783679668/learning-path/materials/tieng-anh-ma-de-402-2019_1783433753581_1783679667671.docx', 2, N'UPLOAD', N'tieng-anh-ma-de-402-2019_1783433753581.docx', 72721)
GO
INSERT [dbo].[Node_Materials] ([MaterialId], [NodeId], [MaterialType], [Title], [MaterialUrl], [MaterialOrder], [SourceType], [FileName], [FileSize]) VALUES (13, 10, N'DOC', N'ádfasdf', N'https://res.cloudinary.com/diyjnwfsy/raw/upload/v1783679669/learning-path/materials/tieng-anh-ma-de-402-2019_1783679669132.docx', 3, N'UPLOAD', N'tieng-anh-ma-de-402-2019.docx', 72721)
GO
INSERT [dbo].[Node_Materials] ([MaterialId], [NodeId], [MaterialType], [Title], [MaterialUrl], [MaterialOrder], [SourceType], [FileName], [FileSize]) VALUES (14, 10, N'VIDEO', N'ádfasdfasdf', N'https://res.cloudinary.com/diyjnwfsy/video/upload/q_auto/v1783679929/b390tef725ufv0exqcqv.mp4', 4, N'UPLOAD', N'9mb.mp4', 9622535)
GO
INSERT [dbo].[Node_Materials] ([MaterialId], [NodeId], [MaterialType], [Title], [MaterialUrl], [MaterialOrder], [SourceType], [FileName], [FileSize]) VALUES (15, 11, N'VIDEO', N'1', N'https://res.cloudinary.com/diyjnwfsy/video/upload/q_auto/v1783691233/smd3n7ucnybfgo3p7ieh.mp4', 1, N'UPLOAD', N'9mb.mp4', 9622535)
GO
INSERT [dbo].[Node_Materials] ([MaterialId], [NodeId], [MaterialType], [Title], [MaterialUrl], [MaterialOrder], [SourceType], [FileName], [FileSize]) VALUES (22, 3, N'VIDEO', N'1', N'https://res.cloudinary.com/diyjnwfsy/video/upload/q_auto/v1783692081/ggrbfjatr6gt4oocxx3t.mp4', 2, N'UPLOAD', N'9mb.mp4', 9622535)
GO
INSERT [dbo].[Node_Materials] ([MaterialId], [NodeId], [MaterialType], [Title], [MaterialUrl], [MaterialOrder], [SourceType], [FileName], [FileSize]) VALUES (23, 3, N'VIDEO', N'22222', N'https://res.cloudinary.com/diyjnwfsy/video/upload/q_auto/v1783692095/rmmfdww9gfjaqdh6wbgc.mp4', 3, N'UPLOAD', N'9mb.mp4', 9622535)
GO
INSERT [dbo].[Node_Materials] ([MaterialId], [NodeId], [MaterialType], [Title], [MaterialUrl], [MaterialOrder], [SourceType], [FileName], [FileSize]) VALUES (24, 12, N'VIDEO', N'asdfsadf', N'https://res.cloudinary.com/diyjnwfsy/video/upload/q_auto/v1783692936/vszwixhia5qpt2sr8uel.mov', 1, N'UPLOAD', N'file_example_MOV_1920_2_2MB.mov', 2247200)
GO
INSERT [dbo].[Node_Materials] ([MaterialId], [NodeId], [MaterialType], [Title], [MaterialUrl], [MaterialOrder], [SourceType], [FileName], [FileSize]) VALUES (25, 12, N'VIDEO', N'sadf', N'https://res.cloudinary.com/diyjnwfsy/video/upload/q_auto/v1783692941/hsohgspi85jwpurafvlj.webm', 2, N'UPLOAD', N'file_example_WEBM_1920_3_7MB.webm', 3667214)
GO
INSERT [dbo].[Node_Materials] ([MaterialId], [NodeId], [MaterialType], [Title], [MaterialUrl], [MaterialOrder], [SourceType], [FileName], [FileSize]) VALUES (26, 12, N'VIDEO', N'fff', N'https://res.cloudinary.com/diyjnwfsy/video/upload/q_auto/v1783692951/zisqxwlppuqdi7lewpny.mp4', 3, N'UPLOAD', N'9mb.mp4', 9622535)
GO
INSERT [dbo].[Node_Materials] ([MaterialId], [NodeId], [MaterialType], [Title], [MaterialUrl], [MaterialOrder], [SourceType], [FileName], [FileSize]) VALUES (27, 12, N'TEXT', N'fdas', N'https://res.cloudinary.com/diyjnwfsy/raw/upload/v1783693002/learning-path/materials/text/fdas_1783693000462.html', 4, N'UPLOAD', N'fdas.html', 44209)
GO
INSERT [dbo].[Node_Materials] ([MaterialId], [NodeId], [MaterialType], [Title], [MaterialUrl], [MaterialOrder], [SourceType], [FileName], [FileSize]) VALUES (28, 12, N'DOC', N'asdfsdfaaa', N'https://res.cloudinary.com/diyjnwfsy/image/upload/v1783695227/learning-path/materials/Hong_Quc_Hng_%281%29_1783695224250.pdf', 5, N'UPLOAD', N'Hong_Quc_Hng (1).pdf', 182567)
GO
INSERT [dbo].[Node_Materials] ([MaterialId], [NodeId], [MaterialType], [Title], [MaterialUrl], [MaterialOrder], [SourceType], [FileName], [FileSize]) VALUES (29, 12, N'DOC', N'asdfsdf', N'https://res.cloudinary.com/diyjnwfsy/raw/upload/v1783692988/learning-path/materials/tieng-anh-ma-de-402-2019_1783692988151.docx', 6, N'UPLOAD', N'tieng-anh-ma-de-402-2019.docx', 72721)
GO
INSERT [dbo].[Node_Materials] ([MaterialId], [NodeId], [MaterialType], [Title], [MaterialUrl], [MaterialOrder], [SourceType], [FileName], [FileSize]) VALUES (30, 12, N'DOC', N'ZDVcv', N'https://res.cloudinary.com/ribjky4d/raw/upload/v1783765411/learning-path/materials/tieng-anh-ma-de-402-2019_%282%29_%281%29_1783765409098.docx', 7, N'UPLOAD', N'tieng-anh-ma-de-402-2019 (2) (1).docx', 72721)
GO
INSERT [dbo].[Node_Materials] ([MaterialId], [NodeId], [MaterialType], [Title], [MaterialUrl], [MaterialOrder], [SourceType], [FileName], [FileSize]) VALUES (31, 12, N'VIDEO', N'ZDVcv', N'https://res.cloudinary.com/diyjnwfsy/video/upload/q_auto/v1783699981/nratjgzkokswjoqwmx8n.mp4', 8, N'UPLOAD', N'vszwixhia5qpt2sr8uel.mov', 2037754)
GO
INSERT [dbo].[Node_Materials] ([MaterialId], [NodeId], [MaterialType], [Title], [MaterialUrl], [MaterialOrder], [SourceType], [FileName], [FileSize]) VALUES (32, 12, N'VIDEO', N'xzcvxzcv', N'https://res.cloudinary.com/ribjky4d/video/upload/q_auto/v1783765719/wendj7qq0uuh7cw8fagk.mp4', 9, N'UPLOAD', N'vszwixhia5qpt2sr8uel.mov', 2037754)
GO
INSERT [dbo].[Node_Materials] ([MaterialId], [NodeId], [MaterialType], [Title], [MaterialUrl], [MaterialOrder], [SourceType], [FileName], [FileSize]) VALUES (33, 12, N'DOC', N'zdfxvcxzvzcx', N'https://res.cloudinary.com/ribjky4d/raw/upload/v1783765989/learning-path/materials/tieng-anh-ma-de-402-2019_%282%29_%281%29_1783765985205.docx', 10, N'UPLOAD', N'tieng-anh-ma-de-402-2019 (2) (1).docx', 72721)
GO
INSERT [dbo].[Node_Materials] ([MaterialId], [NodeId], [MaterialType], [Title], [MaterialUrl], [MaterialOrder], [SourceType], [FileName], [FileSize]) VALUES (34, 13, N'VIDEO', N'adsasdads', N'https://res.cloudinary.com/ribjky4d/video/upload/q_auto/v1783792817/pp5t1nzxvfhs7lvej8cz.mp4', 1, N'UPLOAD', N'vszwixhia5qpt2sr8uel.mov', 2037754)
GO
INSERT [dbo].[Node_Materials] ([MaterialId], [NodeId], [MaterialType], [Title], [MaterialUrl], [MaterialOrder], [SourceType], [FileName], [FileSize]) VALUES (35, 14, N'DOC', N'tai lieu demo', N'https://res.cloudinary.com/diyjnwfsy/raw/upload/v1783924349/learning-path/materials/SLP_RDS-Document_NEW_1783924278806.docx', 1, N'UPLOAD', N'SLP_RDS-Document_NEW.docx', 946617)
GO
INSERT [dbo].[Node_Materials] ([MaterialId], [NodeId], [MaterialType], [Title], [MaterialUrl], [MaterialOrder], [SourceType], [FileName], [FileSize]) VALUES (36, 15, N'VIDEO', N'Luyện nghe Tiếng Anh Thụ động Song ngữ | I''m Mary', N'https://youtu.be/QHQjGV9A2fs?si=5dek0iI03OS69LHT', 1, N'LINK', NULL, NULL)
GO
INSERT [dbo].[Node_Materials] ([MaterialId], [NodeId], [MaterialType], [Title], [MaterialUrl], [MaterialOrder], [SourceType], [FileName], [FileSize]) VALUES (37, 16, N'VIDEO', N'( 5) NGHE TIẾNG ANH LẶP LẠI NHIỀU LẦN - LUYỆN NÓI TIẾNG ANH  - Thời gian rảnh rỗi ( Free time)', N'https://youtu.be/HL6t2DMg4rI?si=oBiO2bYzH5LNYfMf', 1, N'LINK', NULL, NULL)
GO
INSERT [dbo].[Node_Materials] ([MaterialId], [NodeId], [MaterialType], [Title], [MaterialUrl], [MaterialOrder], [SourceType], [FileName], [FileSize]) VALUES (38, 17, N'VIDEO', N'( 5) NGHE TIẾNG ANH LẶP LẠI NHIỀU LẦN - LUYỆN NÓI TIẾNG ANH  - Thời gian rảnh rỗi ( Free time)', N'https://youtu.be/HL6t2DMg4rI?si=oBiO2bYzH5LNYfMf', 1, N'LINK', NULL, NULL)
GO
INSERT [dbo].[Node_Materials] ([MaterialId], [NodeId], [MaterialType], [Title], [MaterialUrl], [MaterialOrder], [SourceType], [FileName], [FileSize]) VALUES (39, 18, N'VIDEO', N'( 5) NGHE TIẾNG ANH LẶP LẠI NHIỀU LẦN - LUYỆN NÓI TIẾNG ANH  - Thời gian rảnh rỗi ( Free time)', N'https://youtu.be/HL6t2DMg4rI?si=oBiO2bYzH5LNYfMf', 1, N'LINK', NULL, NULL)
GO
INSERT [dbo].[Node_Materials] ([MaterialId], [NodeId], [MaterialType], [Title], [MaterialUrl], [MaterialOrder], [SourceType], [FileName], [FileSize]) VALUES (40, 19, N'VIDEO', N'( 5) NGHE TIẾNG ANH LẶP LẠI NHIỀU LẦN - LUYỆN NÓI TIẾNG ANH  - Thời gian rảnh rỗi ( Free time)', N'https://youtu.be/HL6t2DMg4rI?si=oBiO2bYzH5LNYfMf', 1, N'LINK', NULL, NULL)
GO
SET IDENTITY_INSERT [dbo].[Node_Materials] OFF
GO
SET IDENTITY_INSERT [dbo].[Path_Nodes] ON 
GO
INSERT [dbo].[Path_Nodes] ([NodeId], [PathId], [NodeName], [NodeOrder], [Description], [IsActive]) VALUES (1, 1, N'Bài 1: Professional Email Basics', 1, N'Cấu trúc email formal/informal.', 1)
GO
INSERT [dbo].[Path_Nodes] ([NodeId], [PathId], [NodeName], [NodeOrder], [Description], [IsActive]) VALUES (2, 1, N'Bài 2: Meeting Phrases', 2, N'Mẫu câu mở đầu và kết thúc cuộc họp.', 1)
GO
INSERT [dbo].[Path_Nodes] ([NodeId], [PathId], [NodeName], [NodeOrder], [Description], [IsActive]) VALUES (3, 1, N'Bài 3: Quiz cuối chương asdfasdf', 3, N'Kiểm tra Listening + Reading + Vocabulary.', 1)
GO
INSERT [dbo].[Path_Nodes] ([NodeId], [PathId], [NodeName], [NodeOrder], [Description], [IsActive]) VALUES (4, 2, N'Bài 1: Opening a Presentation', 1, N'Giới thiệu chủ đề và outline.', 0)
GO
INSERT [dbo].[Path_Nodes] ([NodeId], [PathId], [NodeName], [NodeOrder], [Description], [IsActive]) VALUES (6, 3, N'Bài 1: Git & Agile Terms', 1, N'Từ vựng Git, sprint, backlog.', 1)
GO
INSERT [dbo].[Path_Nodes] ([NodeId], [PathId], [NodeName], [NodeOrder], [Description], [IsActive]) VALUES (7, 4, N'Giới thiệu', 1, N'giới thiệu', 0)
GO
INSERT [dbo].[Path_Nodes] ([NodeId], [PathId], [NodeName], [NodeOrder], [Description], [IsActive]) VALUES (8, 5, N'adsf', 1, N'asdf', 0)
GO
INSERT [dbo].[Path_Nodes] ([NodeId], [PathId], [NodeName], [NodeOrder], [Description], [IsActive]) VALUES (9, 6, N'dsasd', 1, N'sdsd', 0)
GO
INSERT [dbo].[Path_Nodes] ([NodeId], [PathId], [NodeName], [NodeOrder], [Description], [IsActive]) VALUES (10, 7, N'àdasdf', 1, N'ádfasfdsadf', 0)
GO
INSERT [dbo].[Path_Nodes] ([NodeId], [PathId], [NodeName], [NodeOrder], [Description], [IsActive]) VALUES (11, 2, N'Bài 2: Quiz cuối chươngasdf', 3, N'adsfasdf', 0)
GO
INSERT [dbo].[Path_Nodes] ([NodeId], [PathId], [NodeName], [NodeOrder], [Description], [IsActive]) VALUES (12, 8, N'asdfsadf', 1, N'sadfasdf', 0)
GO
INSERT [dbo].[Path_Nodes] ([NodeId], [PathId], [NodeName], [NodeOrder], [Description], [IsActive]) VALUES (13, 12, N'ádasd', 1, N'adssaddasads', 0)
GO
INSERT [dbo].[Path_Nodes] ([NodeId], [PathId], [NodeName], [NodeOrder], [Description], [IsActive]) VALUES (14, 13, N'hoc demo 1', 1, N'hoc demo 1', 0)
GO
INSERT [dbo].[Path_Nodes] ([NodeId], [PathId], [NodeName], [NodeOrder], [Description], [IsActive]) VALUES (15, 15, N'Buổi 1', 1, N'Giới thiệu', 1)
GO
INSERT [dbo].[Path_Nodes] ([NodeId], [PathId], [NodeName], [NodeOrder], [Description], [IsActive]) VALUES (16, 16, N'Buoi 2', 1, N'aaaaaa', 1)
GO
INSERT [dbo].[Path_Nodes] ([NodeId], [PathId], [NodeName], [NodeOrder], [Description], [IsActive]) VALUES (17, 17, N'aaaaaaaaaaaaaaaa', 1, N'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 0)
GO
INSERT [dbo].[Path_Nodes] ([NodeId], [PathId], [NodeName], [NodeOrder], [Description], [IsActive]) VALUES (18, 18, N'dddddddd', 1, N'dddddddddddđ', 0)
GO
INSERT [dbo].[Path_Nodes] ([NodeId], [PathId], [NodeName], [NodeOrder], [Description], [IsActive]) VALUES (19, 19, N'ddddddd', 1, N'dddddddddddddđ', 0)
GO
SET IDENTITY_INSERT [dbo].[Path_Nodes] OFF
GO
SET IDENTITY_INSERT [dbo].[Paths] ON 
GO
INSERT [dbo].[Paths] ([PathId], [CourseId], [PathName], [Description], [CreatedAt], [Order], [IsActive]) VALUES (1, 1, N'Chuong 1: Email & Meetings', N'Kỹ năng viết email và tham gia cuộc họp.', CAST(N'2026-07-09T00:29:19.160' AS DateTime), 1, 0)
GO
INSERT [dbo].[Paths] ([PathId], [CourseId], [PathName], [Description], [CreatedAt], [Order], [IsActive]) VALUES (2, 1, N'Chương 2: Presentations', N'Thuyết trình và báo cáo tiến độ.', CAST(N'2026-07-09T00:29:19.160' AS DateTime), 2, 0)
GO
INSERT [dbo].[Paths] ([PathId], [CourseId], [PathName], [Description], [CreatedAt], [Order], [IsActive]) VALUES (3, 2, N'Chương 1: Dev Vocabulary', N'Từ vựng cơ bản cho lập trình viên.', CAST(N'2026-07-09T00:29:19.160' AS DateTime), 1, 1)
GO
INSERT [dbo].[Paths] ([PathId], [CourseId], [PathName], [Description], [CreatedAt], [Order], [IsActive]) VALUES (4, 3, N'Văn hóa doanh nghiệp', N'văn hóa doanh nghiệp', CAST(N'2026-07-09T00:50:40.127' AS DateTime), 1, 1)
GO
INSERT [dbo].[Paths] ([PathId], [CourseId], [PathName], [Description], [CreatedAt], [Order], [IsActive]) VALUES (5, 4, N'asdf', N'asdf', CAST(N'2026-07-09T01:11:14.437' AS DateTime), 1, 0)
GO
INSERT [dbo].[Paths] ([PathId], [CourseId], [PathName], [Description], [CreatedAt], [Order], [IsActive]) VALUES (6, 5, N'1', N'adsds', CAST(N'2026-07-10T17:13:52.070' AS DateTime), 1, 0)
GO
INSERT [dbo].[Paths] ([PathId], [CourseId], [PathName], [Description], [CreatedAt], [Order], [IsActive]) VALUES (7, 6, N'ádf', N'ádf', CAST(N'2026-07-10T17:34:40.270' AS DateTime), 1, 0)
GO
INSERT [dbo].[Paths] ([PathId], [CourseId], [PathName], [Description], [CreatedAt], [Order], [IsActive]) VALUES (8, 7, N'asdfasdf', N'asdfasdfasdf', CAST(N'2026-07-10T21:16:43.443' AS DateTime), 1, 0)
GO
INSERT [dbo].[Paths] ([PathId], [CourseId], [PathName], [Description], [CreatedAt], [Order], [IsActive]) VALUES (12, 1, N'adsdas', N'ádasddasdas', CAST(N'2026-07-12T00:59:57.237' AS DateTime), 3, 0)
GO
INSERT [dbo].[Paths] ([PathId], [CourseId], [PathName], [Description], [CreatedAt], [Order], [IsActive]) VALUES (13, 8, N'test chuong 1', N'chuong 1', CAST(N'2026-07-13T13:32:16.900' AS DateTime), 1, 0)
GO
INSERT [dbo].[Paths] ([PathId], [CourseId], [PathName], [Description], [CreatedAt], [Order], [IsActive]) VALUES (14, 8, N'testing demo 2', N'a', CAST(N'2026-07-13T13:32:49.450' AS DateTime), 2, 0)
GO
INSERT [dbo].[Paths] ([PathId], [CourseId], [PathName], [Description], [CreatedAt], [Order], [IsActive]) VALUES (15, 9, N'Trans 1', N'Top nouth 1', CAST(N'2026-07-14T11:09:40.237' AS DateTime), 1, 1)
GO
INSERT [dbo].[Paths] ([PathId], [CourseId], [PathName], [Description], [CreatedAt], [Order], [IsActive]) VALUES (16, 9, N'Trans2', N'Top notch 2', CAST(N'2026-07-14T11:24:27.867' AS DateTime), 2, 1)
GO
INSERT [dbo].[Paths] ([PathId], [CourseId], [PathName], [Description], [CreatedAt], [Order], [IsActive]) VALUES (17, 9, N'aaaaa', N'aaaaaaaaaaa', CAST(N'2026-07-14T11:53:54.850' AS DateTime), 2, 0)
GO
INSERT [dbo].[Paths] ([PathId], [CourseId], [PathName], [Description], [CreatedAt], [Order], [IsActive]) VALUES (18, 9, N'ddddddddđ', N'ddddddddddddddddđ', CAST(N'2026-07-14T11:57:07.860' AS DateTime), 2, 0)
GO
INSERT [dbo].[Paths] ([PathId], [CourseId], [PathName], [Description], [CreatedAt], [Order], [IsActive]) VALUES (19, 9, N'ddddđ', N'ddddddddddddddđ', CAST(N'2026-07-14T11:59:58.000' AS DateTime), 2, 0)
GO
SET IDENTITY_INSERT [dbo].[Paths] OFF
GO
SET IDENTITY_INSERT [dbo].[Question_Bank] ON 
GO
INSERT [dbo].[Question_Bank] ([BankId], [InstructorId], [CourseId], [CourseName], [CourseDescription], [BankDescription], [CreatedAt], [UpdatedAt], [IsPublished]) VALUES (1, 2, 1, N'Business English for Workplace', N'Ngân hàng câu hỏi quiz Business English', N'Listening / Reading / Vocabulary cho chương 1 & 2', CAST(N'2026-07-09T00:29:19.1629133' AS DateTime2), CAST(N'2026-07-09T00:29:19.1629133' AS DateTime2), 1)
GO
INSERT [dbo].[Question_Bank] ([BankId], [InstructorId], [CourseId], [CourseName], [CourseDescription], [BankDescription], [CreatedAt], [UpdatedAt], [IsPublished]) VALUES (2, 2, 9, N'Tiếng anh FPT', N'MT1', NULL, CAST(N'2026-07-14T11:12:58.8066667' AS DateTime2), CAST(N'2026-07-14T11:12:58.8066667' AS DateTime2), 0)
GO
SET IDENTITY_INSERT [dbo].[Question_Bank] OFF
GO
SET IDENTITY_INSERT [dbo].[Question_Choices] ON 
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (1, 1, N'At the office reception', 1, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (2, 1, N'In a meeting room', 2, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (3, 1, N'At the airport', 3, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (4, 1, N'In the cafeteria', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (5, 2, N'Scheduling a follow-up meeting', 1, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (6, 2, N'Canceling a business trip', 2, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (7, 2, N'Applying for a new position', 3, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (8, 2, N'Resigning from the company', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (9, 3, N'by', 1, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (10, 3, N'on', 2, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (11, 3, N'in', 3, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (12, 3, N'at', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (13, 4, N'due date', 1, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (14, 4, N'holiday', 2, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (15, 4, N'break time', 3, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (16, 4, N'overtime', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (17, 5, N'She doesn''t agree with the proposal.', 1, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (18, 5, N'She don''t agree with the proposal.', 2, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (19, 5, N'She not agree with the proposal.', 3, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (20, 5, N'She agree not with the proposal.', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (21, 6, N'The timeline for the project', 1, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (22, 6, N'Office relocation plans', 2, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (23, 6, N'Annual leave policy', 3, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (24, 6, N'Cafeteria menu changes', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (25, 7, N'begin', 1, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (26, 7, N'began', 2, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (27, 7, N'beginning', 3, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (28, 7, N'begun', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (29, 8, N'Visit the park', 1, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (30, 8, N'Study for a science test', 2, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (31, 8, N'Go to a food festival', 3, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (32, 8, N'Repair her bicycle', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (33, 9, N'Her friend', 1, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (34, 9, N'Her father', 2, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (35, 9, N'Her younger brother', 3, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (36, 9, N'Her classmate', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (37, 10, N'Thirty minutes', 1, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (38, 10, N'One hour', 2, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (39, 10, N'Two hours', 3, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (40, 10, N'Three hours', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (41, 11, N'There was a sports competition.', 1, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (42, 11, N'There was a school event.', 2, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (43, 11, N'There was a local food festival.', 3, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (44, 11, N'There was a bicycle race.', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (45, 12, N'Chocolate pancakes', 1, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (46, 12, N'A spicy chicken sandwich', 2, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (47, 12, N'Traditional soup', 3, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (48, 12, N'Fried fish', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (49, 13, N'He lost his bicycle.', 1, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (50, 13, N'He hurt his leg.', 2, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (51, 13, N'His bicycle had a flat tire.', 3, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (52, 13, N'He forgot the way home.', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (53, 14, N'1:00 p.m.', 1, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (54, 14, N'1:30 p.m.', 2, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (55, 14, N'2:00 p.m.', 3, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (56, 14, N'2:30 p.m.', 4, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (57, 15, N'Emma missed her science test.', 1, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (58, 15, N'Emma did well on her science test.', 2, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (59, 15, N'Emma went back to the festival.', 3, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (60, 15, N'Emma studied with Jack.', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (61, 16, N'ádf', 1, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (62, 16, N'adsffd', 2, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (63, 16, N'adsfds', 3, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (64, 16, N'ádfs', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (65, 17, N'a', 1, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (66, 17, N'ad', 2, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (67, 17, N'f', 3, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (68, 17, N's', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (69, 18, N'connection', 1, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (70, 18, N'contact', 2, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (71, 18, N'communication', 3, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (72, 18, N'attention', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (73, 19, N'polite', 1, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (74, 19, N'politeness', 2, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (75, 19, N'politely', 3, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (76, 19, N'more polite', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (77, 20, N'bow', 1, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (78, 20, N'wave', 2, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (79, 20, N'hug', 3, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (80, 20, N'kiss', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (81, 21, N'polite', 1, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (82, 21, N'impolite', 2, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (83, 21, N'friendly', 3, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (84, 21, N'patient', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (85, 22, N'should', 1, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (86, 22, N'shouldn’t', 2, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (87, 22, N'have to', 3, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (88, 22, N'can', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (89, 23, N'introduce', 1, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (90, 23, N'introduction', 2, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (91, 23, N'introduced', 3, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (92, 23, N'introducing', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (93, 24, N'at', 1, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (94, 24, N'for', 2, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (95, 24, N'of', 3, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (96, 24, N'with', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (97, 25, N'because', 1, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (98, 25, N'while', 2, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (99, 25, N'but', 3, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (100, 25, N'although', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (101, 26, N'distance', 1, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (102, 26, N'place', 2, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (103, 26, N'direction', 3, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (104, 26, N'position', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (105, 27, N'repeating', 1, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (106, 27, N'repeated', 2, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (107, 27, N'repeat', 3, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (108, 27, N'repeats', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (109, 28, N'clear', 1, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (110, 28, N'clearly', 2, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (111, 28, N'clearness', 3, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (112, 28, N'clearing', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (113, 29, N'knock', 1, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (114, 29, N'hit', 2, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (115, 29, N'touch', 3, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (116, 29, N'push', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (117, 30, N'at', 1, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (118, 30, N'in', 2, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (119, 30, N'on', 3, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (120, 30, N'by', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (121, 31, N'respectfully', 1, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (122, 31, N'angrily', 2, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (123, 31, N'careless', 3, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (124, 31, N'loudly', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (125, 32, N'should', 1, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (126, 32, N'must', 2, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (127, 32, N'mustn’t', 3, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (128, 32, N'have to', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (169, 43, N'a', 1, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (170, 43, N'â', 2, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (171, 43, N'd', 3, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (172, 43, N's', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (173, 44, N'sfd', 1, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (174, 44, N'Ấ', 2, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (175, 44, N'FFS', 3, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (176, 44, N'ew', 4, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (177, 45, N'3e3', 1, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (178, 45, N'2we', 2, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (179, 45, N'ssf', 3, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (180, 45, N'ứdd', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (181, 46, N'fgd', 1, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (182, 46, N'qew', 2, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (183, 46, N'df', 3, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (184, 46, N'qư', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (185, 47, N'qe', 1, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (186, 47, N'gsf', 2, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (187, 47, N'sd', 3, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (188, 47, N'qư', 4, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (189, 48, N'Vì đó là yêu cầu của công việc.', 1, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (190, 48, N'Vì anh ấy thích giữ cơ thể năng động và điều đó tốt cho sức khỏe', 2, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (191, 48, N'Vì bác sĩ khuyên anh ấy nên làm vậy.', 3, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (192, 48, N'Vì anh ấy muốn giảm cân nhanh chóng.', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (193, 49, N'Thường xuyên đi chạy bộ vào buổi sáng', 1, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (194, 49, N'Thích đi du lịch đến những nơi xa xôi.', 2, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (195, 49, N'Thức dậy và lướt internet trong nhiều giờ, sau đó chơi guita', 3, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (196, 49, N'Thích gặp gỡ nhiều người mới mỗi ngày.', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (197, 50, N'Anh ấy rất thích vì không gian yên tĩnh.', 1, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (198, 50, N'Anh ấy cảm thấy đó là cách thư giãn tốt nhất.', 2, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (199, 50, N'Anh ấy đặc biệt ghét việc ngồi trong nhà và lướt internet', 3, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (200, 50, N'Anh ấy chỉ làm vậy khi thời tiết xấu.', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (201, 51, N'Vì Brazil có nhiều sân vận động hiện đại nhất thế giới.', 1, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (202, 51, N'Vì người dân Brazil rất yêu thích việc xem và chơi bóng đá trong thời gian rảnh.', 2, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (203, 51, N'Vì bóng đá là môn thể thao bắt buộc tại các trường học.', 3, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (204, 51, N'Vì người dân Brazil luôn có những đôi giày bóng đá đắt tiền.', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (205, 52, N'Có 11 cầu thủ trong mỗi đội và bóng rất nhẹ.', 1, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (206, 52, N'Chỉ được chơi trên sân cỏ nhân tạo.', 2, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (207, 52, N'Có 5 cầu thủ trong mỗi đội và bóng nhỏ, nặng vì chứa đầy cát.', 3, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (208, 52, N'Không có thủ môn tham gia.', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (209, 53, N'Anna', 1, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (210, 53, N'ANNAA', 2, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (211, 53, N'aaa', 3, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (212, 53, N'aaaa', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (213, 54, N't', 1, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (214, 54, N'ff', 2, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (215, 54, N'f', 3, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (216, 54, N'fff', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (217, 55, N'qư', 1, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (218, 55, N'ưer', 2, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (219, 55, N'êc', 3, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (220, 55, N'ee', 4, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (221, 56, N'fdsgsdfg', 1, 1)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (222, 56, N'sdfgsdfg', 2, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (223, 56, N'gủtwre', 3, 0)
GO
INSERT [dbo].[Question_Choices] ([ChoiceId], [QuestionId], [Title], [Order], [IsTrue]) VALUES (224, 56, N'gưegerw', 4, 0)
GO
SET IDENTITY_INSERT [dbo].[Question_Choices] OFF
GO
SET IDENTITY_INSERT [dbo].[Question_Sections] ON 
GO
INSERT [dbo].[Question_Sections] ([SectionId], [Question_Path_Id], [SectionName], [Title], [TypeId], [Order], [SourceUrl], [IsUseForTest]) VALUES (1, 1, N'Listening 1', N'Đoạn hội thoại văn phòng', 1, 1, N'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 0)
GO
INSERT [dbo].[Question_Sections] ([SectionId], [Question_Path_Id], [SectionName], [Title], [TypeId], [Order], [SourceUrl], [IsUseForTest]) VALUES (2, 1, N'Reading 1', N'Email điền từ', 2, 2, N'https://res.cloudinary.com/ribjky4d/raw/upload/v1783786157/learning-path/materials/text/Email_i_n_t__1783786155972.html', 0)
GO
INSERT [dbo].[Question_Sections] ([SectionId], [Question_Path_Id], [SectionName], [Title], [TypeId], [Order], [SourceUrl], [IsUseForTest]) VALUES (3, 1, N'Vocabulary 1', N'Từ vựng công sở', 3, 2, NULL, 1)
GO
INSERT [dbo].[Question_Sections] ([SectionId], [Question_Path_Id], [SectionName], [Title], [TypeId], [Order], [SourceUrl], [IsUseForTest]) VALUES (4, 2, N'Listening 2', N'Presentation Q&A', 1, 1, N'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 0)
GO
INSERT [dbo].[Question_Sections] ([SectionId], [Question_Path_Id], [SectionName], [Title], [TypeId], [Order], [SourceUrl], [IsUseForTest]) VALUES (5, 2, N'Reading 2', N'Ngữ pháp thuyết trình', 2, 1, NULL, 1)
GO
INSERT [dbo].[Question_Sections] ([SectionId], [Question_Path_Id], [SectionName], [Title], [TypeId], [Order], [SourceUrl], [IsUseForTest]) VALUES (6, 1, N'Nghe 1', N'A Trip to Green Park', 1, 2, N'https://res.cloudinary.com/ribjky4d/video/upload/q_auto/v1783775365/py158jo1uyhrgahaeegg.mp3', 0)
GO
INSERT [dbo].[Question_Sections] ([SectionId], [Question_Path_Id], [SectionName], [Title], [TypeId], [Order], [SourceUrl], [IsUseForTest]) VALUES (7, 1, N'ádf', N'ádfasdf', 1, 3, N'https://res.cloudinary.com/ribjky4d/video/upload/q_auto/v1783775722/zlmui7p5hut1ay9rxcot.mp3', 1)
GO
INSERT [dbo].[Question_Sections] ([SectionId], [Question_Path_Id], [SectionName], [Title], [TypeId], [Order], [SourceUrl], [IsUseForTest]) VALUES (8, 1, N'fdd', N'dadsfasdf', 2, 1, N'https://res.cloudinary.com/ribjky4d/raw/upload/v1783775838/learning-path/materials/text/dadsfasdf_1783775836686.html', 1)
GO
INSERT [dbo].[Question_Sections] ([SectionId], [Question_Path_Id], [SectionName], [Title], [TypeId], [Order], [SourceUrl], [IsUseForTest]) VALUES (9, 1, N'Văn hóa giao tiếp', N'Văn hóa giao tiếp', 3, 1, NULL, 1)
GO
INSERT [dbo].[Question_Sections] ([SectionId], [Question_Path_Id], [SectionName], [Title], [TypeId], [Order], [SourceUrl], [IsUseForTest]) VALUES (10, 1, N'Giao tiếp nơi làm việc — Workplace Communication', N'Giao tiếp nơi làm việc — Workplace Communication', 3, 3, NULL, 1)
GO
INSERT [dbo].[Question_Sections] ([SectionId], [Question_Path_Id], [SectionName], [Title], [TypeId], [Order], [SourceUrl], [IsUseForTest]) VALUES (13, 4, N'ddddddd', N'ddddddd', 3, 1, NULL, 1)
GO
INSERT [dbo].[Question_Sections] ([SectionId], [Question_Path_Id], [SectionName], [Title], [TypeId], [Order], [SourceUrl], [IsUseForTest]) VALUES (14, 4, N'1', N'1', 3, 2, NULL, 1)
GO
INSERT [dbo].[Question_Sections] ([SectionId], [Question_Path_Id], [SectionName], [Title], [TypeId], [Order], [SourceUrl], [IsUseForTest]) VALUES (15, 5, N'nghe', N'Nghe hội thoại', 1, 1, N'https://youtu.be/FWLvrh2md-M?si=Qxttk4KI15dK8u-x', 1)
GO
INSERT [dbo].[Question_Sections] ([SectionId], [Question_Path_Id], [SectionName], [Title], [TypeId], [Order], [SourceUrl], [IsUseForTest]) VALUES (16, 5, N'Nghe 2', N'Nghe hội thoại 2', 1, 2, N'https://youtu.be/HL6t2DMg4rI?si=29gjETQib-B7cb-k', 1)
GO
INSERT [dbo].[Question_Sections] ([SectionId], [Question_Path_Id], [SectionName], [Title], [TypeId], [Order], [SourceUrl], [IsUseForTest]) VALUES (17, 5, N'sssss', N'aaaa', 2, 1, N'https://res.cloudinary.com/ribjky4d/raw/upload/v1784002902/learning-path/materials/text/aaaa_1784002902093.html', 1)
GO
INSERT [dbo].[Question_Sections] ([SectionId], [Question_Path_Id], [SectionName], [Title], [TypeId], [Order], [SourceUrl], [IsUseForTest]) VALUES (18, 5, N'ssssss', N'ssssss', 3, 1, NULL, 1)
GO
INSERT [dbo].[Question_Sections] ([SectionId], [Question_Path_Id], [SectionName], [Title], [TypeId], [Order], [SourceUrl], [IsUseForTest]) VALUES (19, 5, N'sssssww', N'ddđ', 1, 3, N'https://youtu.be/UKTp5voOFq8?si=Y0L8k75NuEVEuSFG', 1)
GO
INSERT [dbo].[Question_Sections] ([SectionId], [Question_Path_Id], [SectionName], [Title], [TypeId], [Order], [SourceUrl], [IsUseForTest]) VALUES (20, 5, N'fgrwertgrew', N'dsfdfsgsdfgdsf', 2, 2, N'https://res.cloudinary.com/ribjky4d/raw/upload/v1784102714/learning-path/materials/text/dsfdfsgsdfgdsf_1784102713775.html', 1)
GO
SET IDENTITY_INSERT [dbo].[Question_Sections] OFF
GO
SET IDENTITY_INSERT [dbo].[Questions] ON 
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (1, 1, N'Nghe đoạn hội thoại. Người nói đang ở đâu? adsfadsf', 0, 1, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (2, 1, N'Chọn ý chính của đoạn nghe:', 1, 1, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (3, 2, N'Choose the best word: submit the report ___ Friday.', 1, 1, 0)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (4, 3, N'Chọn từ đồng nghĩa với "deadline":', 1, 1, 0)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (5, 3, N'Which sentence is grammatically correct?', 1, 2, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (6, 4, N'What is the speaker mainly asking about?', 1, 1, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (7, 5, N'Fill in: "Let me ___ with an overview."', 1, 1, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (8, 6, N'What did Emma originally plan to do on Saturday morning?', 1, 1, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (9, 6, N'Who asked Emma to go cycling?', 1, 2, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (10, 6, N'How long did Emma study before leaving home?', 1, 3, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (11, 6, N'Why was Green Park busier than usual?', 1, 4, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (12, 6, N'What was Emma’s favorite food?', 1, 5, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (13, 6, N'What problem did Jack have?', 1, 6, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (14, 6, N'What time did they finally arrive home?', 1, 7, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (15, 6, N'What happened on Monday?', 1, 8, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (16, 7, N'adsfasdf', 1, 1, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (17, 8, N'fddd', 1, 1, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (18, 9, N'In many cultures, it is important to make eye ______ when speaking to someone', 1, 1, 0)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (19, 9, N'You should always speak ______ to older people.', 1, 2, 0)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (20, 9, N'In Japan, people often ______ to greet each other.', 1, 3, 0)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (21, 9, N'It is considered ______ to interrupt someone while they are speaking.', 1, 4, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (22, 9, N'You ______ use your phone during an important meeting.', 1, 5, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (23, 9, N'When you meet someone for the first time, you should ______ yourself.', 1, 6, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (24, 9, N'People in different countries may have different ways ______ greeting each other.', 1, 7, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (25, 9, N'You should listen carefully ______ someone is sharing their opinion.', 1, 8, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (26, 9, N'In some cultures, people prefer to keep a certain physical ______ during a conversation.', 1, 9, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (27, 9, N'If you do not understand someone, you can say: “Could you please ______ that?”', 1, 10, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (28, 10, N'Employees should communicate ______ with their managers and colleagues.', 1, 1, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (29, 10, N'Before entering your manager’s office, you should ______ on the door.', 1, 2, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (30, 10, N'It is important to arrive ______ time for a business meeting.', 1, 3, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (31, 10, N'If you disagree with a colleague, you should express your opinion ______.', 1, 4, 0)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (32, 10, N'Employees ______ share confidential company information with strangers.', 1, 5, 0)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (43, 13, N'adsads', 1, 1, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (44, 13, N'adsadsddd', 1, 2, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (45, 14, N'123', 1, 1, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (46, 14, N'sdffds', 1, 2, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (47, 14, N'fdg', 1, 3, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (48, 15, N'Tại sao nhân vật chính trong video lại coi trọng việc tập thể dục?', 1, 1, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (49, 15, N'Thói quen của người bạn cùng phòng (roommate) của nhân vật chính là gì?', 1, 2, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (50, 15, N'Nhân vật chính cảm thấy thế nào về việc "ngồi trong nhà" (sitting around indoors)?', 1, 3, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (51, 16, N': Theo video, tại sao bóng đá lại là một phần quan trọng trong cuộc sống ở Brazil?', 1, 1, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (52, 16, N'Điểm đặc biệt của môn thể thao Futsal được đề cập trong video là gì', 1, 2, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (53, 17, N'Tên là', 1, 1, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (54, 18, N'Đây là chọn gì', 1, 1, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (55, 19, N'aaaaaa', 1, 1, 1)
GO
INSERT [dbo].[Questions] ([QuestionId], [SectionId], [Title], [IsActive], [Order], [IsUseForTest]) VALUES (56, 20, N'sfdgsdfgsdfg', 1, 1, 1)
GO
SET IDENTITY_INSERT [dbo].[Questions] OFF
GO
SET IDENTITY_INSERT [dbo].[Questions_Path] ON 
GO
INSERT [dbo].[Questions_Path] ([Question_Path_Id], [BankId], [PathId], [IsActive]) VALUES (1, 1, 1, 1)
GO
INSERT [dbo].[Questions_Path] ([Question_Path_Id], [BankId], [PathId], [IsActive]) VALUES (2, 1, 2, 1)
GO
INSERT [dbo].[Questions_Path] ([Question_Path_Id], [BankId], [PathId], [IsActive]) VALUES (4, 1, 12, NULL)
GO
INSERT [dbo].[Questions_Path] ([Question_Path_Id], [BankId], [PathId], [IsActive]) VALUES (5, 2, 15, NULL)
GO
SET IDENTITY_INSERT [dbo].[Questions_Path] OFF
GO
SET IDENTITY_INSERT [dbo].[Roles] ON 
GO
INSERT [dbo].[Roles] ([RoleId], [RoleName], [Description]) VALUES (1, N'Admin', N'Quản trị hệ thống')
GO
INSERT [dbo].[Roles] ([RoleId], [RoleName], [Description]) VALUES (2, N'Mentor', N'Giảng viên / người tạo khóa học')
GO
INSERT [dbo].[Roles] ([RoleId], [RoleName], [Description]) VALUES (3, N'Student', N'Học viên')
GO
SET IDENTITY_INSERT [dbo].[Roles] OFF
GO
SET IDENTITY_INSERT [dbo].[Section_Type] ON 
GO
INSERT [dbo].[Section_Type] ([TypeId], [Name]) VALUES (1, N'Nghe')
GO
INSERT [dbo].[Section_Type] ([TypeId], [Name]) VALUES (2, N'Đọc')
GO
INSERT [dbo].[Section_Type] ([TypeId], [Name]) VALUES (3, N'Từ Vựng/ Ngữ pháp')
GO
SET IDENTITY_INSERT [dbo].[Section_Type] OFF
GO
SET IDENTITY_INSERT [dbo].[Test_Attempt_Answers] ON 
GO
INSERT [dbo].[Test_Attempt_Answers] ([AnswerId], [AttemptId], [QuestionId], [ChoiceId], [IsCorrect], [AnsweredAt]) VALUES (1, 5, 51, 202, 1, CAST(N'2026-07-15T19:05:12.513' AS DateTime))
GO
INSERT [dbo].[Test_Attempt_Answers] ([AnswerId], [AttemptId], [QuestionId], [ChoiceId], [IsCorrect], [AnsweredAt]) VALUES (2, 5, 52, 205, 1, CAST(N'2026-07-15T19:05:12.513' AS DateTime))
GO
INSERT [dbo].[Test_Attempt_Answers] ([AnswerId], [AttemptId], [QuestionId], [ChoiceId], [IsCorrect], [AnsweredAt]) VALUES (3, 5, 53, 209, 1, CAST(N'2026-07-15T19:05:12.513' AS DateTime))
GO
INSERT [dbo].[Test_Attempt_Answers] ([AnswerId], [AttemptId], [QuestionId], [ChoiceId], [IsCorrect], [AnsweredAt]) VALUES (4, 5, 53, 210, 1, CAST(N'2026-07-15T19:05:12.513' AS DateTime))
GO
INSERT [dbo].[Test_Attempt_Answers] ([AnswerId], [AttemptId], [QuestionId], [ChoiceId], [IsCorrect], [AnsweredAt]) VALUES (5, 5, 54, 213, 1, CAST(N'2026-07-15T19:05:12.513' AS DateTime))
GO
INSERT [dbo].[Test_Attempt_Answers] ([AnswerId], [AttemptId], [QuestionId], [ChoiceId], [IsCorrect], [AnsweredAt]) VALUES (6, 6, 48, 192, 0, CAST(N'2026-07-15T19:05:32.250' AS DateTime))
GO
INSERT [dbo].[Test_Attempt_Answers] ([AnswerId], [AttemptId], [QuestionId], [ChoiceId], [IsCorrect], [AnsweredAt]) VALUES (7, 6, 49, 193, 0, CAST(N'2026-07-15T19:05:32.250' AS DateTime))
GO
INSERT [dbo].[Test_Attempt_Answers] ([AnswerId], [AttemptId], [QuestionId], [ChoiceId], [IsCorrect], [AnsweredAt]) VALUES (8, 6, 50, 198, 0, CAST(N'2026-07-15T19:05:32.250' AS DateTime))
GO
INSERT [dbo].[Test_Attempt_Answers] ([AnswerId], [AttemptId], [QuestionId], [ChoiceId], [IsCorrect], [AnsweredAt]) VALUES (9, 6, 53, 209, 1, CAST(N'2026-07-15T19:05:32.250' AS DateTime))
GO
INSERT [dbo].[Test_Attempt_Answers] ([AnswerId], [AttemptId], [QuestionId], [ChoiceId], [IsCorrect], [AnsweredAt]) VALUES (10, 6, 53, 210, 1, CAST(N'2026-07-15T19:05:32.250' AS DateTime))
GO
INSERT [dbo].[Test_Attempt_Answers] ([AnswerId], [AttemptId], [QuestionId], [ChoiceId], [IsCorrect], [AnsweredAt]) VALUES (11, 6, 54, 213, 1, CAST(N'2026-07-15T19:05:32.250' AS DateTime))
GO
INSERT [dbo].[Test_Attempt_Answers] ([AnswerId], [AttemptId], [QuestionId], [ChoiceId], [IsCorrect], [AnsweredAt]) VALUES (12, 7, 48, 189, 0, CAST(N'2026-07-15T19:16:05.663' AS DateTime))
GO
INSERT [dbo].[Test_Attempt_Answers] ([AnswerId], [AttemptId], [QuestionId], [ChoiceId], [IsCorrect], [AnsweredAt]) VALUES (13, 7, 49, 193, 0, CAST(N'2026-07-15T19:16:05.663' AS DateTime))
GO
INSERT [dbo].[Test_Attempt_Answers] ([AnswerId], [AttemptId], [QuestionId], [ChoiceId], [IsCorrect], [AnsweredAt]) VALUES (14, 7, 50, 197, 0, CAST(N'2026-07-15T19:16:05.663' AS DateTime))
GO
INSERT [dbo].[Test_Attempt_Answers] ([AnswerId], [AttemptId], [QuestionId], [ChoiceId], [IsCorrect], [AnsweredAt]) VALUES (15, 7, 54, 215, 0, CAST(N'2026-07-15T19:16:05.663' AS DateTime))
GO
INSERT [dbo].[Test_Attempt_Answers] ([AnswerId], [AttemptId], [QuestionId], [ChoiceId], [IsCorrect], [AnsweredAt]) VALUES (16, 7, 56, 222, 0, CAST(N'2026-07-15T19:16:05.663' AS DateTime))
GO
INSERT [dbo].[Test_Attempt_Answers] ([AnswerId], [AttemptId], [QuestionId], [ChoiceId], [IsCorrect], [AnsweredAt]) VALUES (17, 8, 51, 201, 0, CAST(N'2026-07-15T19:17:51.680' AS DateTime))
GO
INSERT [dbo].[Test_Attempt_Answers] ([AnswerId], [AttemptId], [QuestionId], [ChoiceId], [IsCorrect], [AnsweredAt]) VALUES (18, 8, 52, 205, 1, CAST(N'2026-07-15T19:17:51.680' AS DateTime))
GO
INSERT [dbo].[Test_Attempt_Answers] ([AnswerId], [AttemptId], [QuestionId], [ChoiceId], [IsCorrect], [AnsweredAt]) VALUES (19, 8, 53, 209, 1, CAST(N'2026-07-15T19:17:51.680' AS DateTime))
GO
INSERT [dbo].[Test_Attempt_Answers] ([AnswerId], [AttemptId], [QuestionId], [ChoiceId], [IsCorrect], [AnsweredAt]) VALUES (20, 8, 53, 210, 1, CAST(N'2026-07-15T19:17:51.680' AS DateTime))
GO
INSERT [dbo].[Test_Attempt_Answers] ([AnswerId], [AttemptId], [QuestionId], [ChoiceId], [IsCorrect], [AnsweredAt]) VALUES (21, 8, 54, 213, 1, CAST(N'2026-07-15T19:17:51.680' AS DateTime))
GO
INSERT [dbo].[Test_Attempt_Answers] ([AnswerId], [AttemptId], [QuestionId], [ChoiceId], [IsCorrect], [AnsweredAt]) VALUES (22, 9, 51, 201, 0, CAST(N'2026-07-15T19:25:12.280' AS DateTime))
GO
INSERT [dbo].[Test_Attempt_Answers] ([AnswerId], [AttemptId], [QuestionId], [ChoiceId], [IsCorrect], [AnsweredAt]) VALUES (23, 9, 52, 205, 1, CAST(N'2026-07-15T19:25:12.280' AS DateTime))
GO
INSERT [dbo].[Test_Attempt_Answers] ([AnswerId], [AttemptId], [QuestionId], [ChoiceId], [IsCorrect], [AnsweredAt]) VALUES (24, 9, 53, 211, 0, CAST(N'2026-07-15T19:25:12.280' AS DateTime))
GO
INSERT [dbo].[Test_Attempt_Answers] ([AnswerId], [AttemptId], [QuestionId], [ChoiceId], [IsCorrect], [AnsweredAt]) VALUES (25, 9, 53, 210, 0, CAST(N'2026-07-15T19:25:12.280' AS DateTime))
GO
INSERT [dbo].[Test_Attempt_Answers] ([AnswerId], [AttemptId], [QuestionId], [ChoiceId], [IsCorrect], [AnsweredAt]) VALUES (26, 9, 54, 213, 1, CAST(N'2026-07-15T19:25:12.280' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[Test_Attempt_Answers] OFF
GO
SET IDENTITY_INSERT [dbo].[Test_Attempts] ON 
GO
INSERT [dbo].[Test_Attempts] ([AttemptId], [UserId], [TestId], [StartedAt], [ExpiresAt], [Status], [Point], [IsPass], [ScorePercentage], [SubmittedAt]) VALUES (1, 4, 3, CAST(N'2026-07-14T12:42:57.447' AS DateTime), CAST(N'2026-07-14T05:57:57.447' AS DateTime), N'submitted', CAST(75 AS Decimal(18, 0)), 1, NULL, CAST(N'2026-07-14T12:43:07.707' AS DateTime))
GO
INSERT [dbo].[Test_Attempts] ([AttemptId], [UserId], [TestId], [StartedAt], [ExpiresAt], [Status], [Point], [IsPass], [ScorePercentage], [SubmittedAt]) VALUES (2, 4, 3, CAST(N'2026-07-14T13:13:21.560' AS DateTime), CAST(N'2026-07-14T06:28:21.553' AS DateTime), N'submitted', CAST(100 AS Decimal(18, 0)), 1, NULL, CAST(N'2026-07-14T13:13:35.940' AS DateTime))
GO
INSERT [dbo].[Test_Attempts] ([AttemptId], [UserId], [TestId], [StartedAt], [ExpiresAt], [Status], [Point], [IsPass], [ScorePercentage], [SubmittedAt]) VALUES (3, 3, 3, CAST(N'2026-07-15T13:15:57.763' AS DateTime), CAST(N'2026-07-15T06:27:57.770' AS DateTime), N'submitted', CAST(100 AS Decimal(18, 0)), 1, NULL, CAST(N'2026-07-15T13:16:04.910' AS DateTime))
GO
INSERT [dbo].[Test_Attempts] ([AttemptId], [UserId], [TestId], [StartedAt], [ExpiresAt], [Status], [Point], [IsPass], [ScorePercentage], [SubmittedAt]) VALUES (4, 3, 3, CAST(N'2026-07-15T13:44:28.210' AS DateTime), CAST(N'2026-07-15T06:56:28.213' AS DateTime), N'submitted', CAST(0 AS Decimal(18, 0)), 0, NULL, CAST(N'2026-07-15T13:44:31.477' AS DateTime))
GO
INSERT [dbo].[Test_Attempts] ([AttemptId], [UserId], [TestId], [StartedAt], [ExpiresAt], [Status], [Point], [IsPass], [ScorePercentage], [SubmittedAt]) VALUES (5, 3, 3, CAST(N'2026-07-15T19:05:00.700' AS DateTime), CAST(N'2026-07-15T12:17:00.690' AS DateTime), N'submitted', CAST(100 AS Decimal(18, 0)), 1, NULL, CAST(N'2026-07-15T19:05:12.497' AS DateTime))
GO
INSERT [dbo].[Test_Attempts] ([AttemptId], [UserId], [TestId], [StartedAt], [ExpiresAt], [Status], [Point], [IsPass], [ScorePercentage], [SubmittedAt]) VALUES (6, 3, 3, CAST(N'2026-07-15T19:05:17.390' AS DateTime), CAST(N'2026-07-15T12:17:17.390' AS DateTime), N'submitted', CAST(40 AS Decimal(18, 0)), 0, NULL, CAST(N'2026-07-15T19:05:32.240' AS DateTime))
GO
INSERT [dbo].[Test_Attempts] ([AttemptId], [UserId], [TestId], [StartedAt], [ExpiresAt], [Status], [Point], [IsPass], [ScorePercentage], [SubmittedAt]) VALUES (7, 3, 3, CAST(N'2026-07-15T19:15:55.377' AS DateTime), CAST(N'2026-07-15T12:27:55.383' AS DateTime), N'submitted', CAST(0 AS Decimal(18, 0)), 0, NULL, CAST(N'2026-07-15T19:16:05.660' AS DateTime))
GO
INSERT [dbo].[Test_Attempts] ([AttemptId], [UserId], [TestId], [StartedAt], [ExpiresAt], [Status], [Point], [IsPass], [ScorePercentage], [SubmittedAt]) VALUES (8, 3, 3, CAST(N'2026-07-15T19:17:40.257' AS DateTime), CAST(N'2026-07-15T12:29:40.257' AS DateTime), N'submitted', CAST(75 AS Decimal(18, 0)), 1, NULL, CAST(N'2026-07-15T19:17:51.673' AS DateTime))
GO
INSERT [dbo].[Test_Attempts] ([AttemptId], [UserId], [TestId], [StartedAt], [ExpiresAt], [Status], [Point], [IsPass], [ScorePercentage], [SubmittedAt]) VALUES (9, 3, 3, CAST(N'2026-07-15T19:24:59.987' AS DateTime), CAST(N'2026-07-15T12:36:59.987' AS DateTime), N'submitted', CAST(50 AS Decimal(18, 0)), 0, NULL, CAST(N'2026-07-15T19:25:12.270' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[Test_Attempts] OFF
GO
SET IDENTITY_INSERT [dbo].[Test_Config] ON 
GO
INSERT [dbo].[Test_Config] ([ConfigId], [TestId], [DurationMinutes], [MaxAttempts], [UpdatedBy], [UpdatedAt]) VALUES (3, 1, 99, 199, 2, CAST(N'2026-07-12T01:15:15.977' AS DateTime))
GO
INSERT [dbo].[Test_Config] ([ConfigId], [TestId], [DurationMinutes], [MaxAttempts], [UpdatedBy], [UpdatedAt]) VALUES (4, 2, 15, 3, 2, CAST(N'2026-07-11T23:44:26.763' AS DateTime))
GO
INSERT [dbo].[Test_Config] ([ConfigId], [TestId], [DurationMinutes], [MaxAttempts], [UpdatedBy], [UpdatedAt]) VALUES (5, 3, 12, 11111, 2, CAST(N'2026-07-14T13:45:36.343' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[Test_Config] OFF
GO
SET IDENTITY_INSERT [dbo].[Test_Config_Section] ON 
GO
INSERT [dbo].[Test_Config_Section] ([ConfigSectionId], [ConfigId], [QuestionQuantity], [TypeId], [BankSectionId]) VALUES (1, 3, 1, 1, NULL)
GO
INSERT [dbo].[Test_Config_Section] ([ConfigSectionId], [ConfigId], [QuestionQuantity], [TypeId], [BankSectionId]) VALUES (2, 3, 1, 2, NULL)
GO
INSERT [dbo].[Test_Config_Section] ([ConfigSectionId], [ConfigId], [QuestionQuantity], [TypeId], [BankSectionId]) VALUES (3, 3, 5, 3, 9)
GO
INSERT [dbo].[Test_Config_Section] ([ConfigSectionId], [ConfigId], [QuestionQuantity], [TypeId], [BankSectionId]) VALUES (4, 3, 1, 3, 3)
GO
INSERT [dbo].[Test_Config_Section] ([ConfigSectionId], [ConfigId], [QuestionQuantity], [TypeId], [BankSectionId]) VALUES (5, 3, 3, 3, 10)
GO
INSERT [dbo].[Test_Config_Section] ([ConfigSectionId], [ConfigId], [QuestionQuantity], [TypeId], [BankSectionId]) VALUES (15, 5, 1, 1, NULL)
GO
INSERT [dbo].[Test_Config_Section] ([ConfigSectionId], [ConfigId], [QuestionQuantity], [TypeId], [BankSectionId]) VALUES (16, 5, 1, 2, NULL)
GO
INSERT [dbo].[Test_Config_Section] ([ConfigSectionId], [ConfigId], [QuestionQuantity], [TypeId], [BankSectionId]) VALUES (17, 5, 1, 3, 18)
GO
SET IDENTITY_INSERT [dbo].[Test_Config_Section] OFF
GO
INSERT [dbo].[Test_Pass_Config] ([Test_Pass_Config_Id], [TestId], [MinPassScore], [AllowReviewAfterPass], [UpdatedBy], [UpdatedAt]) VALUES (1, 1, CAST(36.00 AS Decimal(5, 2)), 0, 2, CAST(N'2026-07-12T01:15:16.017' AS DateTime))
GO
INSERT [dbo].[Test_Pass_Config] ([Test_Pass_Config_Id], [TestId], [MinPassScore], [AllowReviewAfterPass], [UpdatedBy], [UpdatedAt]) VALUES (2, 2, CAST(70.00 AS Decimal(5, 2)), 0, 2, CAST(N'2026-07-11T23:44:26.787' AS DateTime))
GO
INSERT [dbo].[Test_Pass_Config] ([Test_Pass_Config_Id], [TestId], [MinPassScore], [AllowReviewAfterPass], [UpdatedBy], [UpdatedAt]) VALUES (3, 3, CAST(70.00 AS Decimal(5, 2)), 0, 2, CAST(N'2026-07-14T13:45:36.357' AS DateTime))
GO
INSERT [dbo].[Test_Prerequisites] ([TestId], [PrerequisiteTestId]) VALUES (2, 1)
GO
INSERT [dbo].[Tests] ([TestId], [PathId], [CourseId], [InstructorId], [IsCourseTest], [TestName], [TestOrder], [IsActive], [HasPrerequisite]) VALUES (1, 1, 1, 2, 0, N'Quiz Chuong 1: Email & Meetings', 1, 1, 0)
GO
INSERT [dbo].[Tests] ([TestId], [PathId], [CourseId], [InstructorId], [IsCourseTest], [TestName], [TestOrder], [IsActive], [HasPrerequisite]) VALUES (2, 2, 1, 2, 0, N'Quiz Chương 2: Presentations', 2, 1, 1)
GO
INSERT [dbo].[Tests] ([TestId], [PathId], [CourseId], [InstructorId], [IsCourseTest], [TestName], [TestOrder], [IsActive], [HasPrerequisite]) VALUES (3, 15, 9, 2, 0, N'Quiz Trans 1', 1, 1, 0)
GO
INSERT [dbo].[User_Categories] ([UserId], [CategoryId]) VALUES (3, 1)
GO
INSERT [dbo].[User_Categories] ([UserId], [CategoryId]) VALUES (3, 2)
GO
INSERT [dbo].[User_Categories] ([UserId], [CategoryId]) VALUES (4, 1)
GO
INSERT [dbo].[User_Courses] ([UserId], [CourseId], [ProgressPercentage], [EnrollmentDate]) VALUES (3, 1, 35, CAST(N'2026-06-25T00:29:19.160' AS DateTime))
GO
INSERT [dbo].[User_Courses] ([UserId], [CourseId], [ProgressPercentage], [EnrollmentDate]) VALUES (3, 2, 0, CAST(N'2026-07-09T00:29:19.160' AS DateTime))
GO
INSERT [dbo].[User_Courses] ([UserId], [CourseId], [ProgressPercentage], [EnrollmentDate]) VALUES (3, 9, 100, CAST(N'2026-07-15T13:15:46.337' AS DateTime))
GO
INSERT [dbo].[User_Courses] ([UserId], [CourseId], [ProgressPercentage], [EnrollmentDate]) VALUES (4, 1, 10, CAST(N'2026-07-06T00:29:19.160' AS DateTime))
GO
INSERT [dbo].[User_Courses] ([UserId], [CourseId], [ProgressPercentage], [EnrollmentDate]) VALUES (4, 3, 0, CAST(N'2026-07-14T17:06:06.647' AS DateTime))
GO
INSERT [dbo].[User_Courses] ([UserId], [CourseId], [ProgressPercentage], [EnrollmentDate]) VALUES (4, 9, 40, CAST(N'2026-07-14T13:13:05.523' AS DateTime))
GO
INSERT [dbo].[User_Nodes] ([UserId], [NodeId], [IsCompleted], [CompletedAt]) VALUES (3, 1, 1, CAST(N'2026-06-29T00:29:19.160' AS DateTime))
GO
INSERT [dbo].[User_Nodes] ([UserId], [NodeId], [IsCompleted], [CompletedAt]) VALUES (3, 2, 1, CAST(N'2026-07-02T00:29:19.160' AS DateTime))
GO
INSERT [dbo].[User_Nodes] ([UserId], [NodeId], [IsCompleted], [CompletedAt]) VALUES (3, 3, 0, CAST(N'2026-07-09T00:29:19.160' AS DateTime))
GO
INSERT [dbo].[User_Nodes] ([UserId], [NodeId], [IsCompleted], [CompletedAt]) VALUES (3, 15, 1, CAST(N'2026-07-15T13:15:53.783' AS DateTime))
GO
INSERT [dbo].[User_Nodes] ([UserId], [NodeId], [IsCompleted], [CompletedAt]) VALUES (3, 16, 1, CAST(N'2026-07-15T13:16:18.833' AS DateTime))
GO
INSERT [dbo].[User_Nodes] ([UserId], [NodeId], [IsCompleted], [CompletedAt]) VALUES (4, 1, 1, CAST(N'2026-07-07T00:29:19.160' AS DateTime))
GO
INSERT [dbo].[User_Nodes] ([UserId], [NodeId], [IsCompleted], [CompletedAt]) VALUES (4, 15, 1, CAST(N'2026-07-14T13:13:10.140' AS DateTime))
GO
INSERT [dbo].[User_Nodes] ([UserId], [NodeId], [IsCompleted], [CompletedAt]) VALUES (4, 16, 1, CAST(N'2026-07-14T13:43:19.517' AS DateTime))
GO
INSERT [dbo].[User_Roles] ([UserId], [RoleId]) VALUES (1, 1)
GO
INSERT [dbo].[User_Roles] ([UserId], [RoleId]) VALUES (2, 2)
GO
INSERT [dbo].[User_Roles] ([UserId], [RoleId]) VALUES (3, 3)
GO
INSERT [dbo].[User_Roles] ([UserId], [RoleId]) VALUES (4, 3)
GO
SET IDENTITY_INSERT [dbo].[Users] ON 
GO
INSERT [dbo].[Users] ([UserId], [FullName], [Email], [Phone], [Password], [DateOfBirth], [IsFirstLogin], [ResetOtpCode], [ResetOtpExpires], [CreatedAt], [UpdatedAt], [CurrentLevelId], [LearningGoal], [AvatarUrl], [IsActive]) VALUES (1, N'S.T.A.R Admin', N'admin@gmail.com', N'0900000001', N'123456', CAST(N'1990-01-01' AS Date), 0, NULL, NULL, CAST(N'2026-07-09T00:29:19.160' AS DateTime), NULL, 3, N'Quản lý nền tảng', NULL, 1)
GO
INSERT [dbo].[Users] ([UserId], [FullName], [Email], [Phone], [Password], [DateOfBirth], [IsFirstLogin], [ResetOtpCode], [ResetOtpExpires], [CreatedAt], [UpdatedAt], [CurrentLevelId], [LearningGoal], [AvatarUrl], [IsActive]) VALUES (2, N'Nguyen Van Mentor', N'mentor@gmail.com', N'0900000002', N'123456', CAST(N'1988-05-15' AS Date), 0, NULL, NULL, CAST(N'2026-07-09T00:29:19.160' AS DateTime), NULL, 4, N'Giảng dạy Business English', NULL, 1)
GO
INSERT [dbo].[Users] ([UserId], [FullName], [Email], [Phone], [Password], [DateOfBirth], [IsFirstLogin], [ResetOtpCode], [ResetOtpExpires], [CreatedAt], [UpdatedAt], [CurrentLevelId], [LearningGoal], [AvatarUrl], [IsActive]) VALUES (3, N'Tran Thi Student', N'student@gmail.com', N'0900000003', N'123456', CAST(N'2002-08-20' AS Date), 0, NULL, NULL, CAST(N'2026-07-09T00:29:19.160' AS DateTime), NULL, 2, N'Cải thiện tiếng Anh công sở', NULL, 1)
GO
INSERT [dbo].[Users] ([UserId], [FullName], [Email], [Phone], [Password], [DateOfBirth], [IsFirstLogin], [ResetOtpCode], [ResetOtpExpires], [CreatedAt], [UpdatedAt], [CurrentLevelId], [LearningGoal], [AvatarUrl], [IsActive]) VALUES (4, N'Le Van Student', N'student2@gmail.com', N'0900000004', N'123456', CAST(N'2001-03-10' AS Date), 0, NULL, NULL, CAST(N'2026-07-09T00:29:19.160' AS DateTime), NULL, 2, N'Luyện thi B1', NULL, 1)
GO
SET IDENTITY_INSERT [dbo].[Users] OFF
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Categori__8517B2E0F258EC74]    Script Date: 7/15/2026 7:38:46 PM ******/
ALTER TABLE [dbo].[Categories] ADD UNIQUE NONCLUSTERED 
(
	[CategoryName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Levels__9EF3BE7B812228E8]    Script Date: 7/15/2026 7:38:46 PM ******/
ALTER TABLE [dbo].[Levels] ADD UNIQUE NONCLUSTERED 
(
	[LevelName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ_NodeMaterials_Order]    Script Date: 7/15/2026 7:38:46 PM ******/
ALTER TABLE [dbo].[Node_Materials] ADD  CONSTRAINT [UQ_NodeMaterials_Order] UNIQUE NONCLUSTERED 
(
	[NodeId] ASC,
	[MaterialOrder] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__OTP_Veri__A9D10534F2BE68F6]    Script Date: 7/15/2026 7:38:46 PM ******/
ALTER TABLE [dbo].[OTP_Verification] ADD UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ_PathNodes_Order]    Script Date: 7/15/2026 7:38:46 PM ******/
ALTER TABLE [dbo].[Path_Nodes] ADD  CONSTRAINT [UQ_PathNodes_Order] UNIQUE NONCLUSTERED 
(
	[PathId] ASC,
	[NodeOrder] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_Question_Bank]    Script Date: 7/15/2026 7:38:46 PM ******/
ALTER TABLE [dbo].[Question_Bank] ADD  CONSTRAINT [IX_Question_Bank] UNIQUE NONCLUSTERED 
(
	[CourseId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ_Question_Sections_Path_Type_Order]    Script Date: 7/15/2026 7:38:46 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UQ_Question_Sections_Path_Type_Order] ON [dbo].[Question_Sections]
(
	[Question_Path_Id] ASC,
	[TypeId] ASC,
	[Order] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Roles__8A2B6160E43FF95E]    Script Date: 7/15/2026 7:38:46 PM ******/
ALTER TABLE [dbo].[Roles] ADD UNIQUE NONCLUSTERED 
(
	[RoleName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ_Test_AttemptAns_Attempt_Question_Choice]    Script Date: 7/15/2026 7:38:46 PM ******/
ALTER TABLE [dbo].[Test_Attempt_Answers] ADD  CONSTRAINT [UQ_Test_AttemptAns_Attempt_Question_Choice] UNIQUE NONCLUSTERED 
(
	[AttemptId] ASC,
	[QuestionId] ASC,
	[ChoiceId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_Test_AttemptAns_Attempt_Question]    Script Date: 7/15/2026 7:38:46 PM ******/
CREATE NONCLUSTERED INDEX [IX_Test_AttemptAns_Attempt_Question] ON [dbo].[Test_Attempt_Answers]
(
	[AttemptId] ASC,
	[QuestionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_Test_AttemptAns_AttemptId]    Script Date: 7/15/2026 7:38:46 PM ******/
CREATE NONCLUSTERED INDEX [IX_Test_AttemptAns_AttemptId] ON [dbo].[Test_Attempt_Answers]
(
	[AttemptId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ_Test_Config_TestId]    Script Date: 7/15/2026 7:38:46 PM ******/
ALTER TABLE [dbo].[Test_Config] ADD  CONSTRAINT [UQ_Test_Config_TestId] UNIQUE NONCLUSTERED 
(
	[TestId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ_Test_ConfigSec_Config_Bank]    Script Date: 7/15/2026 7:38:46 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UQ_Test_ConfigSec_Config_Bank] ON [dbo].[Test_Config_Section]
(
	[ConfigId] ASC,
	[BankSectionId] ASC
)
WHERE ([BankSectionId] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ_Test_ConfigSec_Config_Type]    Script Date: 7/15/2026 7:38:46 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UQ_Test_ConfigSec_Config_Type] ON [dbo].[Test_Config_Section]
(
	[ConfigId] ASC,
	[TypeId] ASC
)
WHERE ([BankSectionId] IS NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_Test_Prerequisites_PrerequisiteTestId]    Script Date: 7/15/2026 7:38:46 PM ******/
CREATE NONCLUSTERED INDEX [IX_Test_Prerequisites_PrerequisiteTestId] ON [dbo].[Test_Prerequisites]
(
	[PrerequisiteTestId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UQ_Tests_PathId_ChapterQuiz]    Script Date: 7/15/2026 7:38:46 PM ******/
CREATE UNIQUE NONCLUSTERED INDEX [UQ_Tests_PathId_ChapterQuiz] ON [dbo].[Tests]
(
	[PathId] ASC
)
WHERE ([PathId] IS NOT NULL AND [IsCourseTest]=(0))
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Users__5C7E359E14671816]    Script Date: 7/15/2026 7:38:46 PM ******/
ALTER TABLE [dbo].[Users] ADD UNIQUE NONCLUSTERED 
(
	[Phone] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Users__A9D10534242CCE4E]    Script Date: 7/15/2026 7:38:46 PM ******/
ALTER TABLE [dbo].[Users] ADD UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Categories] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Categories] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Course_Comments] ADD  CONSTRAINT [DF__Course_Co__EditC__2739D489]  DEFAULT ((0)) FOR [EditCount]
GO
ALTER TABLE [dbo].[Courses] ADD  DEFAULT ((0)) FOR [TotalLessons]
GO
ALTER TABLE [dbo].[Courses] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Levels] ADD  DEFAULT ((0)) FOR [SortOrder]
GO
ALTER TABLE [dbo].[Levels] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Levels] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[News] ADD  DEFAULT ('DRAFT') FOR [Status]
GO
ALTER TABLE [dbo].[News] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[OTP_Verification] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Paths] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Test_Attempt_Answers] ADD  CONSTRAINT [DF_Test_AttemptAns_IsCorrect]  DEFAULT ((0)) FOR [IsCorrect]
GO
ALTER TABLE [dbo].[Test_Attempt_Answers] ADD  CONSTRAINT [DF_Test_AttemptAns_AnsweredAt]  DEFAULT (getdate()) FOR [AnsweredAt]
GO
ALTER TABLE [dbo].[Test_Attempts] ADD  CONSTRAINT [DF__Test_Atte__Start__76969D2E]  DEFAULT (getdate()) FOR [StartedAt]
GO
ALTER TABLE [dbo].[Test_Attempts] ADD  CONSTRAINT [DF__Test_Atte__Statu__778AC167]  DEFAULT ('in_progress') FOR [Status]
GO
ALTER TABLE [dbo].[Test_Config] ADD  CONSTRAINT [DF_Test_Config_UpdatedAt]  DEFAULT (getdate()) FOR [UpdatedAt]
GO
ALTER TABLE [dbo].[Test_Pass_Config] ADD  CONSTRAINT [DF_Test_Pass_AllowReview]  DEFAULT ((0)) FOR [AllowReviewAfterPass]
GO
ALTER TABLE [dbo].[Test_Pass_Config] ADD  CONSTRAINT [DF_Test_Pass_UpdatedAt]  DEFAULT (getdate()) FOR [UpdatedAt]
GO
ALTER TABLE [dbo].[Tests] ADD  CONSTRAINT [DF_Tests_TestOrder]  DEFAULT ((0)) FOR [TestOrder]
GO
ALTER TABLE [dbo].[Tests] ADD  CONSTRAINT [DF_Tests_IsActive]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Tests] ADD  CONSTRAINT [DF_Tests_HasPrerequisite]  DEFAULT ((0)) FOR [HasPrerequisite]
GO
ALTER TABLE [dbo].[User_Courses] ADD  DEFAULT ((0)) FOR [ProgressPercentage]
GO
ALTER TABLE [dbo].[User_Courses] ADD  DEFAULT (getdate()) FOR [EnrollmentDate]
GO
ALTER TABLE [dbo].[User_Nodes] ADD  DEFAULT ((0)) FOR [IsCompleted]
GO
ALTER TABLE [dbo].[User_Nodes] ADD  DEFAULT (getdate()) FOR [CompletedAt]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((1)) FOR [IsFirstLogin]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Course_Comments]  WITH CHECK ADD  CONSTRAINT [FK_CourseComments_Courses] FOREIGN KEY([CourseId])
REFERENCES [dbo].[Courses] ([CourseId])
GO
ALTER TABLE [dbo].[Course_Comments] CHECK CONSTRAINT [FK_CourseComments_Courses]
GO
ALTER TABLE [dbo].[Course_Comments]  WITH CHECK ADD  CONSTRAINT [FK_CourseComments_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[Course_Comments] CHECK CONSTRAINT [FK_CourseComments_Users]
GO
ALTER TABLE [dbo].[Courses]  WITH CHECK ADD  CONSTRAINT [FK_Courses_Categories] FOREIGN KEY([CategoryId])
REFERENCES [dbo].[Categories] ([CategoryId])
ON DELETE SET NULL
GO
ALTER TABLE [dbo].[Courses] CHECK CONSTRAINT [FK_Courses_Categories]
GO
ALTER TABLE [dbo].[Courses]  WITH CHECK ADD  CONSTRAINT [FK_Courses_Levels] FOREIGN KEY([LevelId])
REFERENCES [dbo].[Levels] ([LevelId])
ON DELETE SET NULL
GO
ALTER TABLE [dbo].[Courses] CHECK CONSTRAINT [FK_Courses_Levels]
GO
ALTER TABLE [dbo].[News]  WITH CHECK ADD  CONSTRAINT [FK_News_Categories] FOREIGN KEY([CategoryId])
REFERENCES [dbo].[Categories] ([CategoryId])
ON DELETE SET NULL
GO
ALTER TABLE [dbo].[News] CHECK CONSTRAINT [FK_News_Categories]
GO
ALTER TABLE [dbo].[News]  WITH CHECK ADD  CONSTRAINT [FK_News_Users] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[News] CHECK CONSTRAINT [FK_News_Users]
GO
ALTER TABLE [dbo].[Node_Materials]  WITH CHECK ADD  CONSTRAINT [FK_NodeMaterials_Nodes] FOREIGN KEY([NodeId])
REFERENCES [dbo].[Path_Nodes] ([NodeId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Node_Materials] CHECK CONSTRAINT [FK_NodeMaterials_Nodes]
GO
ALTER TABLE [dbo].[Path_Nodes]  WITH CHECK ADD  CONSTRAINT [FK_PathNodes_Paths] FOREIGN KEY([PathId])
REFERENCES [dbo].[Paths] ([PathId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Path_Nodes] CHECK CONSTRAINT [FK_PathNodes_Paths]
GO
ALTER TABLE [dbo].[Paths]  WITH CHECK ADD  CONSTRAINT [FK_Paths_Courses] FOREIGN KEY([CourseId])
REFERENCES [dbo].[Courses] ([CourseId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Paths] CHECK CONSTRAINT [FK_Paths_Courses]
GO
ALTER TABLE [dbo].[Question_Bank]  WITH CHECK ADD  CONSTRAINT [FK_Question_Bank_Courses] FOREIGN KEY([CourseId])
REFERENCES [dbo].[Courses] ([CourseId])
GO
ALTER TABLE [dbo].[Question_Bank] CHECK CONSTRAINT [FK_Question_Bank_Courses]
GO
ALTER TABLE [dbo].[Question_Bank]  WITH CHECK ADD  CONSTRAINT [FK_Question_Bank_Users] FOREIGN KEY([InstructorId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[Question_Bank] CHECK CONSTRAINT [FK_Question_Bank_Users]
GO
ALTER TABLE [dbo].[Question_Choices]  WITH CHECK ADD  CONSTRAINT [FK_Question_Choices_Questions_List] FOREIGN KEY([QuestionId])
REFERENCES [dbo].[Questions] ([QuestionId])
GO
ALTER TABLE [dbo].[Question_Choices] CHECK CONSTRAINT [FK_Question_Choices_Questions_List]
GO
ALTER TABLE [dbo].[Question_Sections]  WITH CHECK ADD  CONSTRAINT [FK_Question_Sections_Questions_Path] FOREIGN KEY([Question_Path_Id])
REFERENCES [dbo].[Questions_Path] ([Question_Path_Id])
GO
ALTER TABLE [dbo].[Question_Sections] CHECK CONSTRAINT [FK_Question_Sections_Questions_Path]
GO
ALTER TABLE [dbo].[Question_Sections]  WITH CHECK ADD  CONSTRAINT [FK_Question_Sections_QuestionType] FOREIGN KEY([TypeId])
REFERENCES [dbo].[Section_Type] ([TypeId])
GO
ALTER TABLE [dbo].[Question_Sections] CHECK CONSTRAINT [FK_Question_Sections_QuestionType]
GO
ALTER TABLE [dbo].[Questions]  WITH CHECK ADD  CONSTRAINT [FK_Questions_Question_Sections1] FOREIGN KEY([SectionId])
REFERENCES [dbo].[Question_Sections] ([SectionId])
GO
ALTER TABLE [dbo].[Questions] CHECK CONSTRAINT [FK_Questions_Question_Sections1]
GO
ALTER TABLE [dbo].[Questions_Path]  WITH CHECK ADD  CONSTRAINT [FK_Questions_Path_Paths] FOREIGN KEY([PathId])
REFERENCES [dbo].[Paths] ([PathId])
GO
ALTER TABLE [dbo].[Questions_Path] CHECK CONSTRAINT [FK_Questions_Path_Paths]
GO
ALTER TABLE [dbo].[Questions_Path]  WITH CHECK ADD  CONSTRAINT [FK_Questions_Path_Question_Bank] FOREIGN KEY([BankId])
REFERENCES [dbo].[Question_Bank] ([BankId])
GO
ALTER TABLE [dbo].[Questions_Path] CHECK CONSTRAINT [FK_Questions_Path_Question_Bank]
GO
ALTER TABLE [dbo].[Test_Attempt_Answers]  WITH CHECK ADD  CONSTRAINT [FK_Test_AttemptAns_Attempts] FOREIGN KEY([AttemptId])
REFERENCES [dbo].[Test_Attempts] ([AttemptId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Test_Attempt_Answers] CHECK CONSTRAINT [FK_Test_AttemptAns_Attempts]
GO
ALTER TABLE [dbo].[Test_Attempt_Answers]  WITH CHECK ADD  CONSTRAINT [FK_Test_AttemptAns_Choices_New] FOREIGN KEY([ChoiceId])
REFERENCES [dbo].[Question_Choices] ([ChoiceId])
GO
ALTER TABLE [dbo].[Test_Attempt_Answers] CHECK CONSTRAINT [FK_Test_AttemptAns_Choices_New]
GO
ALTER TABLE [dbo].[Test_Attempt_Answers]  WITH CHECK ADD  CONSTRAINT [FK_Test_AttemptAns_Questions_New] FOREIGN KEY([QuestionId])
REFERENCES [dbo].[Questions] ([QuestionId])
GO
ALTER TABLE [dbo].[Test_Attempt_Answers] CHECK CONSTRAINT [FK_Test_AttemptAns_Questions_New]
GO
ALTER TABLE [dbo].[Test_Attempts]  WITH CHECK ADD  CONSTRAINT [FK_Test_Attempts_Tests] FOREIGN KEY([TestId])
REFERENCES [dbo].[Tests] ([TestId])
GO
ALTER TABLE [dbo].[Test_Attempts] CHECK CONSTRAINT [FK_Test_Attempts_Tests]
GO
ALTER TABLE [dbo].[Test_Attempts]  WITH CHECK ADD  CONSTRAINT [FK_Test_Attempts_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[Test_Attempts] CHECK CONSTRAINT [FK_Test_Attempts_Users]
GO
ALTER TABLE [dbo].[Test_Config]  WITH CHECK ADD  CONSTRAINT [FK_Test_Config_Tests] FOREIGN KEY([TestId])
REFERENCES [dbo].[Tests] ([TestId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Test_Config] CHECK CONSTRAINT [FK_Test_Config_Tests]
GO
ALTER TABLE [dbo].[Test_Config]  WITH CHECK ADD  CONSTRAINT [FK_Test_Config_Users] FOREIGN KEY([UpdatedBy])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[Test_Config] CHECK CONSTRAINT [FK_Test_Config_Users]
GO
ALTER TABLE [dbo].[Test_Config_Section]  WITH NOCHECK ADD  CONSTRAINT [FK_Test_Config_Section_BankSection] FOREIGN KEY([BankSectionId])
REFERENCES [dbo].[Question_Sections] ([SectionId])
GO
ALTER TABLE [dbo].[Test_Config_Section] CHECK CONSTRAINT [FK_Test_Config_Section_BankSection]
GO
ALTER TABLE [dbo].[Test_Config_Section]  WITH CHECK ADD  CONSTRAINT [FK_Test_ConfigSec_Config] FOREIGN KEY([ConfigId])
REFERENCES [dbo].[Test_Config] ([ConfigId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Test_Config_Section] CHECK CONSTRAINT [FK_Test_ConfigSec_Config]
GO
ALTER TABLE [dbo].[Test_Pass_Config]  WITH CHECK ADD  CONSTRAINT [FK_Test_Pass_Config_Tests1] FOREIGN KEY([TestId])
REFERENCES [dbo].[Tests] ([TestId])
GO
ALTER TABLE [dbo].[Test_Pass_Config] CHECK CONSTRAINT [FK_Test_Pass_Config_Tests1]
GO
ALTER TABLE [dbo].[Test_Pass_Config]  WITH CHECK ADD  CONSTRAINT [FK_Test_Pass_Config_Users] FOREIGN KEY([UpdatedBy])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[Test_Pass_Config] CHECK CONSTRAINT [FK_Test_Pass_Config_Users]
GO
ALTER TABLE [dbo].[Test_Prerequisites]  WITH CHECK ADD  CONSTRAINT [FK_Test_Prerequisites_PrerequisiteTest] FOREIGN KEY([PrerequisiteTestId])
REFERENCES [dbo].[Tests] ([TestId])
GO
ALTER TABLE [dbo].[Test_Prerequisites] CHECK CONSTRAINT [FK_Test_Prerequisites_PrerequisiteTest]
GO
ALTER TABLE [dbo].[Test_Prerequisites]  WITH CHECK ADD  CONSTRAINT [FK_Test_Prerequisites_Test] FOREIGN KEY([TestId])
REFERENCES [dbo].[Tests] ([TestId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Test_Prerequisites] CHECK CONSTRAINT [FK_Test_Prerequisites_Test]
GO
ALTER TABLE [dbo].[Tests]  WITH CHECK ADD  CONSTRAINT [FK_Tests_Courses] FOREIGN KEY([CourseId])
REFERENCES [dbo].[Courses] ([CourseId])
GO
ALTER TABLE [dbo].[Tests] CHECK CONSTRAINT [FK_Tests_Courses]
GO
ALTER TABLE [dbo].[Tests]  WITH CHECK ADD  CONSTRAINT [FK_Tests_Paths] FOREIGN KEY([PathId])
REFERENCES [dbo].[Paths] ([PathId])
GO
ALTER TABLE [dbo].[Tests] CHECK CONSTRAINT [FK_Tests_Paths]
GO
ALTER TABLE [dbo].[Tests]  WITH CHECK ADD  CONSTRAINT [FK_Tests_Users] FOREIGN KEY([InstructorId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[Tests] CHECK CONSTRAINT [FK_Tests_Users]
GO
ALTER TABLE [dbo].[User_Categories]  WITH CHECK ADD  CONSTRAINT [FK_UserCategories_Categories] FOREIGN KEY([CategoryId])
REFERENCES [dbo].[Categories] ([CategoryId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[User_Categories] CHECK CONSTRAINT [FK_UserCategories_Categories]
GO
ALTER TABLE [dbo].[User_Categories]  WITH CHECK ADD  CONSTRAINT [FK_UserCategories_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([UserId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[User_Categories] CHECK CONSTRAINT [FK_UserCategories_Users]
GO
ALTER TABLE [dbo].[User_Courses]  WITH CHECK ADD  CONSTRAINT [FK_UC_Courses] FOREIGN KEY([CourseId])
REFERENCES [dbo].[Courses] ([CourseId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[User_Courses] CHECK CONSTRAINT [FK_UC_Courses]
GO
ALTER TABLE [dbo].[User_Courses]  WITH CHECK ADD  CONSTRAINT [FK_UC_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([UserId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[User_Courses] CHECK CONSTRAINT [FK_UC_Users]
GO
ALTER TABLE [dbo].[User_Nodes]  WITH CHECK ADD  CONSTRAINT [FK_UserNodes_Nodes] FOREIGN KEY([NodeId])
REFERENCES [dbo].[Path_Nodes] ([NodeId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[User_Nodes] CHECK CONSTRAINT [FK_UserNodes_Nodes]
GO
ALTER TABLE [dbo].[User_Nodes]  WITH CHECK ADD  CONSTRAINT [FK_UserNodes_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([UserId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[User_Nodes] CHECK CONSTRAINT [FK_UserNodes_Users]
GO
ALTER TABLE [dbo].[User_Roles]  WITH CHECK ADD  CONSTRAINT [FK_UR_Roles] FOREIGN KEY([RoleId])
REFERENCES [dbo].[Roles] ([RoleId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[User_Roles] CHECK CONSTRAINT [FK_UR_Roles]
GO
ALTER TABLE [dbo].[User_Roles]  WITH CHECK ADD  CONSTRAINT [FK_UR_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([UserId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[User_Roles] CHECK CONSTRAINT [FK_UR_Users]
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD  CONSTRAINT [FK_Users_Levels] FOREIGN KEY([CurrentLevelId])
REFERENCES [dbo].[Levels] ([LevelId])
GO
ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [FK_Users_Levels]
GO
ALTER TABLE [dbo].[Courses]  WITH CHECK ADD CHECK  (([Rating]>=(0.0) AND [Rating]<=(5.0)))
GO
ALTER TABLE [dbo].[Courses]  WITH CHECK ADD CHECK  (([Rating]>=(0.0) AND [Rating]<=(5.0)))
GO
ALTER TABLE [dbo].[Node_Materials]  WITH CHECK ADD  CONSTRAINT [CK_Node_Materials_MaterialType] CHECK  (([MaterialType]='TEST' OR [MaterialType]='TEXT' OR [MaterialType]='DOC' OR [MaterialType]='VIDEO'))
GO
ALTER TABLE [dbo].[Node_Materials] CHECK CONSTRAINT [CK_Node_Materials_MaterialType]
GO
ALTER TABLE [dbo].[Test_Config_Section]  WITH CHECK ADD  CONSTRAINT [CK_Test_ConfigSec_Quantity] CHECK  (([QuestionQuantity]>(0)))
GO
ALTER TABLE [dbo].[Test_Config_Section] CHECK CONSTRAINT [CK_Test_ConfigSec_Quantity]
GO
ALTER TABLE [dbo].[Test_Pass_Config]  WITH CHECK ADD  CONSTRAINT [CK_Test_Pass_MinPassScore] CHECK  (([MinPassScore]>=(0) AND [MinPassScore]<=(100)))
GO
ALTER TABLE [dbo].[Test_Pass_Config] CHECK CONSTRAINT [CK_Test_Pass_MinPassScore]
GO
ALTER TABLE [dbo].[Test_Prerequisites]  WITH CHECK ADD  CONSTRAINT [CK_Test_Prerequisites_NotSelf] CHECK  (([TestId]<>[PrerequisiteTestId]))
GO
ALTER TABLE [dbo].[Test_Prerequisites] CHECK CONSTRAINT [CK_Test_Prerequisites_NotSelf]
GO
ALTER TABLE [dbo].[User_Courses]  WITH CHECK ADD CHECK  (([ProgressPercentage]>=(0) AND [ProgressPercentage]<=(100)))
GO
ALTER TABLE [dbo].[User_Courses]  WITH CHECK ADD CHECK  (([ProgressPercentage]>=(0) AND [ProgressPercentage]<=(100)))
GO
/****** Object:  StoredProcedure [dbo].[usp_SyncManualTestFromConfig]    Script Date: 7/15/2026 7:38:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* Wrapper giữ tên cũ */
CREATE   PROCEDURE [dbo].[usp_SyncManualTestFromConfig]
    @TestId INT
AS
BEGIN
    EXEC [dbo].[usp_MaterializeTestFromConfig] @TestId = @TestId;
END;
GO
USE [master]
GO
ALTER DATABASE [LearningPath_Base] SET  READ_WRITE 
GO
