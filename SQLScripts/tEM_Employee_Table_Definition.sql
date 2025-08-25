USE [dEmployeeManager]
GO

/****** Object:  Table [dbo].[tEM_Employee]    Script Date: 8/25/2025 12:57:17 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[tEM_Employee](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[FirstName] [varchar](100) NOT NULL,
	[LastName] [varchar](100) NOT NULL,
	[Email] [varchar](100) NOT NULL,
	[Phone] [varchar](12) NOT NULL,
	[DepartmentId] [int] NOT NULL,
 CONSTRAINT [PK_tEM_Employee] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[tEM_Employee]  WITH CHECK ADD  CONSTRAINT [FK_tEM_Department_Id] FOREIGN KEY([DepartmentId])
REFERENCES [dbo].[tEM_Department] ([Id])
GO

ALTER TABLE [dbo].[tEM_Employee] CHECK CONSTRAINT [FK_tEM_Department_Id]
GO

