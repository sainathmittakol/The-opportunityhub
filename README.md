# Opportunity Hub

BUILD OPPORTUNITYHUB — COMPLETE STUDENT OPPORTUNITY DISCOVERY & CAREER READINESS PLATFORM

Build a complete, modern, premium, production-quality and fully responsive web application called OpportunityHub.

OpportunityHub is a centralized platform where students can discover and manage:

Full-time Jobs

Internships

Freelance Opportunities

Hackathons

Competitions

Courses

Certifications

Career opportunities

The platform should not feel like a basic job board. It should work as a student career discovery and career-readiness ecosystem connecting:

Discover → Match → Prepare → Apply → Track → Improve

The application must work beautifully on:

Desktop

Laptop

Tablet

Mobile

Do not create separate applications for mobile and desktop. Build one highly responsive web application.

1. IMPORTANT BUILDING RULES

Build the application as a complete functional product, not as a static UI prototype.

All major buttons, forms, filters, authentication flows, database operations, saves, applications, profile updates and dashboards must actually work.

Use reasonable implementation decisions when something is unspecified.

Do not ask unnecessary follow-up questions. Make sensible product and technical decisions and continue implementation.

Do not invent:

API keys

Supabase credentials

Private credentials

External service credentials

Real company data

Fake integrations

Use placeholders and environment/connection configuration where credentials are required.

Do not hard-code secrets into source code.

Do not expose service-role/private Supabase credentials in frontend code.

2. SUPABASE CONNECTION

Use Supabase as the backend from the beginning.

I will provide the Supabase connection details in the following dedicated section:

SUPABASE_PROJECT_URL="https://supabase.com/dashboard/project/qqwmhcxemseayjpbrlai"
SUPABASE_PUBLISHABLE_KEY="sb_publishable_OcEaVy2JbMBJOc4-q7_H7w_5oKDqjIl"


Supabase requirements

Connect the application to Supabase and configure:

Supabase Authentication

PostgreSQL Database

Supabase Storage

Row Level Security

SQL migrations

Database relationships

Foreign keys

Indexes

Appropriate constraints

Secure access policies

If Lovable's Supabase integration/connection interface is available, use it rather than creating a custom insecure credential-storage mechanism.

The Supabase publishable key may be used by the frontend according to Supabase architecture.

Never put a Supabase service-role/private key in frontend code.

Never store credentials as normal application data inside the database.

Use environment/secret configuration for credentials.

Create the complete database structure using SQL migrations.

3. PRODUCT OBJECTIVE

OpportunityHub should solve the problem that students currently need to visit many different websites to discover jobs, internships, hackathons, courses and other career opportunities.

The platform should allow students to:

Create a student profile.

Add education, skills, interests and career goals.

Discover opportunities.

Search and filter opportunities.

Receive personalized recommendations.

See why an opportunity matches their profile.

Save opportunities.

Apply through external application links.

Track applications.

Track upcoming deadlines.

Upload their resume.

Check resume ATS compatibility.

Receive actionable resume improvement suggestions.

Compare their resume against a target opportunity.

Identify skill gaps.

Discover courses that help close those skill gaps.

Use a Help Center.

Use an optional AI-powered help assistant.

Receive relevant notifications.

4. DESIGN DIRECTION

Create a unique, premium, modern and student-focused design.

The design should feel like a combination of:

Modern SaaS product

Career platform

Student productivity platform

Clean dashboard

Slightly futuristic technology product

Do NOT directly copy LinkedIn, Indeed, Internshala, Unstop, Coursera, or any other existing platform.

Create an original visual identity.

Design characteristics

Minimal

Premium

Clean

Modern

Professional

Student-friendly

Slightly futuristic

Strong visual hierarchy

Excellent spacing

Smooth interactions

Clear typography

Accessible

Mobile-first responsive behavior

Avoid:

Excessive gradients

Excessive animations

Cluttered cards

Huge amounts of text

Overly corporate appearance

Generic template appearance

Use subtle animations only where they improve UX.

5. PUBLIC LANDING PAGE

The website must be useful even before login.

Create a beautiful landing page.

Hero section

Headline:

Your Next Opportunity Starts Here.

Supporting text:

Discover jobs, internships, hackathons, courses and career opportunities based on your skills, interests and goals.

Primary CTA:

Explore Opportunities

Secondary CTA:

Create Student Profile

Opportunity categories

Show visually attractive category cards:

Jobs

Internships

Freelance

Hackathons

Competitions

Courses

Certifications

Featured opportunities

Display opportunity cards using database data.

Each card can contain:

Company/logo

Opportunity title

Type

Location

Work mode

Salary/stipend

Skills

Deadline

Verification status

View Details button

How OpportunityHub Works

Display:

1. Create Your Profile

↓

2. Discover Opportunities

↓

3. Get Matched

↓

4. Prepare Your Resume

↓

5. Apply

↓

6. Track Your Progress

Resume section

Promote:

Check Your Resume's ATS Compatibility

Explain that students can upload a resume and receive compatibility analysis and actionable suggestions.

Final CTA

Ready to find your next opportunity?

Button:

Create Free Profile

6. PUBLIC VS AUTHENTICATED EXPERIENCE

Do not force users to log in simply to browse.

Users without an account can:

View landing page

Browse opportunities

Search

Filter

View opportunity details

Explore jobs

Explore internships

Explore hackathons

Explore courses

Login should be required for:

Saving opportunities

Creating student profile

Personalized recommendations

Application tracking

Resume upload

ATS analysis

Skill-gap analysis

Notifications

Personalized dashboard

If a logged-out user clicks Save or another authenticated feature, show a clear login/signup prompt.

7. AUTHENTICATION

Use Supabase Authentication.

Implement:

Sign up

Login

Logout

Forgot password

Reset password

Session persistence

Protected routes

Authenticated user state

Prefer a clean authentication UI.

Possible future provider:

Google OAuth

Do not implement OAuth unless the required configuration is available.

8. STUDENT ONBOARDING

After a student creates an account, guide them through profile setup.

Create a multi-step onboarding flow.

Step 1 — Basic information

Full name

Email

Phone

Location

Short bio

Step 2 — Education

Degree

Field of study

College

University

Graduation year

CGPA/percentage

Step 3 — Skills

Allow multiple skills.

Examples:

Python

Java

JavaScript

React

SQL

Excel

Data Analytics

AI/ML

Cloud

Cybersecurity

Step 4 — Interests

Examples:

Software Development

Data Analytics

AI/ML

Cybersecurity

Cloud

UI/UX

Product

Digital Marketing

Step 5 — Career Goals

Examples:

Get my first job

Find an internship

Become a Data Analyst

Become a Software Developer

Learn AI

Build projects

Prepare for placements

Freelance

Step 6 — Preferences

Opportunity types

Preferred locations

Remote/hybrid/on-site

Experience level

At the end show:

Your OpportunityHub profile is ready.

Show profile completion percentage.

9. STUDENT PROFILE

Create a complete profile page.

Route:

/profile

Sections:

Personal Information

Education

Skills

Interests

Career Goals

Opportunity Preferences

Resume

Profile Completion

Example:

Profile Completion: 82%

Give actionable suggestions:

Add your projects to improve your profile.

10. DATABASE ARCHITECTURE

Create appropriate Supabase PostgreSQL tables.

At minimum implement:

profiles

Fields:

id

user_id

full_name

email

phone

location

bio

profile_image

career_goal

experience_level

created_at

updated_at

education

Fields:

id

profile_id

degree

field_of_study

college

university

graduation_year

percentage

cgpa

created_at

updated_at

skills

Fields:

id

name

category

created_at

profile_skills

Fields:

profile_id

skill_id

skill_level

interests

Fields:

id

name

profile_interests

Fields:

profile_id

interest_id

companies

Fields:

id

name

logo

description

website

location

created_at

updated_at

opportunities

Fields:

id

title

company_id

description

opportunity_type

location

work_mode

experience_level

salary_min

salary_max

stipend

deadline

external_url

source_name

source_url

status

verified

verified_at

created_at

updated_at

opportunity_skills

Fields:

opportunity_id

skill_id

required

saved_opportunities

Fields:

id

user_id

opportunity_id

created_at

applications

Fields:

id

user_id

opportunity_id

status

applied_at

notes

updated_at

resumes

Fields:

id

user_id

file_name

storage_path

file_type

uploaded_at

updated_at

resume_analysis

Fields:

id

user_id

resume_id

overall_score

keyword_score

skills_score

experience_score

projects_score

formatting_score

suggestions

created_at

notifications

Fields:

id

user_id

title

message

type

read

created_at

help_articles

Fields:

id

title

category

content

published

created_at

updated_at

Create additional tables where technically necessary for:

Skill-gap analysis

Career goals

User preferences

Opportunity categories

Application events

Administrative operations

Do not create redundant tables unnecessarily.

11. DATABASE RELATIONSHIPS

Implement proper foreign-key relationships.

Examples:

User
 ↓
Profile
 ↓
Education
 ↓
Skills
 ↓
Interests


And:

Company
 ↓
Opportunities
 ↓
Opportunity Skills


And:

User
 ↓
Saved Opportunities
 ↓
Opportunity


And:

User
 ↓
Applications
 ↓
Opportunity


12. ROW LEVEL SECURITY

Implement strong RLS policies.

Students should only be able to modify their own private data.

Users should be able to:

Read/update their own profile

Read/write their own education

Read/write their own skills/preferences

Read/write their own saved opportunities

Read/write their own applications

Read/write their own resume records

Read their own resume analysis

Read/update their own notifications

Students must NOT be able to:

Read another student's private profile

Read another student's applications

Modify another student's applications

Read another student's resume

Modify another student's resume data

Public opportunity information can be readable according to the application's public access design.

Admin permissions must be separated from student permissions.

13. SUPABASE STORAGE

Create private storage for student resumes.

Example conceptual structure:

/resumes/{user_id}/


Optionally create profile-image storage.

Resume files should not be publicly accessible.

Use secure access policies.

Support:

PDF

DOCX

Validate file type and file size.

14. EXPLORE OPPORTUNITIES

Create:

/explore

This is the main discovery page.

At the top:

Find your next opportunity

Search bar:

Search jobs, internships, hackathons, courses...

Display opportunity cards.

15. OPPORTUNITY TYPES

Support:

Full-time Jobs

Internships

Freelance

Hackathons

Competitions

Courses

Certifications

Create category navigation.

16. SEARCH

Search across appropriate opportunity fields:

Title

Company

Description

Skills

Location

Opportunity type

Search examples:

Python Developer

Data Analyst

AI Internship

Pune Internship

Remote

Hackathon

Use efficient database queries and indexes.

Do not load the entire database into the browser just to perform search.

17. FILTERING

Implement filters for:

Opportunity Type

Job

Internship

Freelance

Hackathon

Competition

Course

Certification

Location

Remote

Pune

Mumbai

Bengaluru

Hyderabad

Other

Work Mode

Remote

Hybrid

On-site

Experience

Fresher

0–1 years

1–3 years

Other

Skills

Multiple selection.

Deadline

Ending today

This week

This month

Salary/stipend

Appropriate ranges.

Make filters responsive.

On mobile, use a filter drawer/bottom sheet.

18. PAGINATION

Do not load thousands of opportunities at once.

Implement:

Pagination or

Efficient infinite scrolling

Keep performance high.

19. OPPORTUNITY CARD

Create one reusable opportunity card component.

Example information:

Company
Opportunity Title
Opportunity Type
Location
Work Mode
Salary/Stipend
Experience
Skills
Deadline
Verification
Save button
View Details


Use clear badges.

Example:

Verified ✓

Fresher

Remote

20. OPPORTUNITY DETAILS

Create:

/opportunity/:id

Show:

Opportunity title

Company

Company logo

Description

Responsibilities

Eligibility

Required skills

Location

Work mode

Salary/stipend

Deadline

Source

Verification status

Match score where available

Actions:

Save Opportunity

Apply Now

21. EXTERNAL APPLICATION SYSTEM

OpportunityHub should not pretend to be the employer's application system when the actual application is external.

The main button should be:

Apply Now ↗

Open the external application URL.

After returning, allow the student to record:

Did you apply?

Buttons:

Yes, track application

Not yet

If they select Yes:

Create an application record.

Default status:

Applied

22. APPLICATION TRACKER

Create:

/applications

Support statuses:

Saved

Applied

Under Review

Shortlisted

Interview

Selected

Rejected

Withdrawn

Students can update status manually.

Show:

Opportunity

Company

Applied date

Current status

Notes

Last updated

23. APPLICATION DASHBOARD STATISTICS

Show:

Total applications

Interviews

Shortlisted

Selected

Rejected

Use clear visual cards.

24. SAVED OPPORTUNITIES

Create:

/saved

Students can:

Save

Remove

View

Apply

Filter saved opportunities

Show a useful empty state:

You haven't saved any opportunities yet.

Button:

Explore Opportunities

25. HACKATHONS

Create:

/hackathons

Dedicated experience.

Show:

Hackathon name

Organizer

Theme

Prize

Team size

Online/offline

Eligibility

Registration deadline

Event date

Registration link

Add filtering.

26. COURSES & CERTIFICATIONS

Create:

/courses

Show:

Course title

Provider

Difficulty

Duration

Price/free

Certificate

Skills

Filters:

Free

Certificate

Beginner

Intermediate

Advanced

Python

AI

Data Analytics

Other skills

27. PERSONALIZED RECOMMENDATION ENGINE

Do not simply label everything as AI.

First implement a reliable rule-based matching engine.

Use:

Student skills

Student interests

Career goals

Education

Experience level

Location

Opportunity type preference

Calculate a transparent match score.

Example weighting:

Skills              40%
Interests           25%
Experience          15%
Location            10%
Career Goal         10%


Make the weighting configurable.

Display:

87% Match

Also show:

Why this matches you

✓ Matches your Python skill
✓ Matches your Data Analytics interest
✓ Suitable for your experience level
✓ Matches your preferred work mode

Do not claim an opportunity is suitable solely because of a numerical score.

28. PERSONALIZED DASHBOARD

Create:

/dashboard

Show:

Greeting

Good morning 👋

Profile Completion

Application Summary

Saved Opportunities

Recommended Opportunities

Upcoming Deadlines

Resume Score

Skill Gap

Recently Viewed

Upcoming Hackathons

29. SIGNATURE FEATURE — OPPORTUNITY MATCH

Every applicable opportunity can show:

Your Match: 87%

Break it down:

Skills           90%
Interests        95%
Experience       80%
Location        100%
Career Goal      85%


Provide explanation rather than displaying only a number.

30. DEADLINE SYSTEM

Calculate remaining time dynamically from the actual deadline.

Examples:

1 day remaining

5 days remaining

12 days remaining

Do not store manually written remaining-day values.

Automatically mark opportunities as expired when appropriate.

31. NOTIFICATIONS

Create notification functionality.

Examples:

New opportunity matching profile

Saved opportunity closing soon

Application status updated

New hackathon matching interests

Profile completion reminder

Resume analysis completed

Allow students to mark notifications as read.

32. RESUME MODULE

Create:

/resume

Features:

Upload resume

View current resume

Replace resume

Delete resume

Analyze resume

View previous analyses where appropriate

Accept:

PDF

DOCX

Store files securely.

33. ATS COMPATIBILITY ANALYZER

Create a resume analysis pipeline:

Resume Upload
      ↓
Text Extraction
      ↓
Content Analysis
      ↓
Keyword Analysis
      ↓
Skills Analysis
      ↓
Experience Analysis
      ↓
Project Analysis
      ↓
Formatting/Structure Analysis
      ↓
ATS Compatibility Score
      ↓
Suggestions


Show:

ATS Compatibility Score

Example:

78 / 100

Do NOT claim:

Your resume will definitely pass every ATS.

Instead explain:

This is an estimated compatibility analysis. Different applicant tracking systems use different parsing and ranking methods.

34. ATS BREAKDOWN

Show categories such as:

Keywords

Skills

Experience

Projects

Formatting/structure

Show actionable feedback.

Example:

Consider adding relevant keywords from the target role if they accurately describe your experience.

Use consistent date formatting.

Add measurable outcomes to project descriptions where applicable.

Never encourage students to add skills they do not actually possess.

35. JOB-SPECIFIC RESUME MATCHING

Allow the student to select an OpportunityHub opportunity.

Compare:

Resume ↔ Opportunity Description

Show:

Resume Match: 84%

Sections:

Matching Skills

✓ Python
✓ SQL
✓ Data Analysis

Underrepresented/Missing From Resume

○ Power BI
○ Tableau

Clearly distinguish:

Not found in resume

from:

Student does not possess the skill

Do not assume a missing keyword means the student lacks the actual skill.

36. SKILL GAP SYSTEM

Create:

/skill-gap

Allow student to select a career target.

Example:

Data Analyst

Show:

Current skills

✓ Excel
✓ Python
✓ SQL

Recommended skills

○ Power BI
○ Statistics
○ Tableau

Then recommend relevant courses from the OpportunityHub database.

Flow:

Career Goal
     ↓
Required Skills
     ↓
Student Skills
     ↓
Skill Gap
     ↓
Recommended Courses
     ↓
Relevant Opportunities


37. CAREER GOALS

Support:

Get first job

Find internship

Become Data Analyst

Become Software Developer

Learn AI/ML

Build portfolio

Prepare for placements

Freelance

Other

Use career goals in recommendations.

38. HELP CENTER

Create:

/help

Include:

Search Help

Search box:

What do you need help with?

Categories:

Getting Started

Account

Profile

Opportunities

Applications

Resume

ATS

Notifications

Technical Issues

Privacy & Security

Create searchable help articles.

39. AI HELP ASSISTANT

Add an AI help assistant only after the normal Help Center is working.

It should answer questions based on approved OpportunityHub help documentation and available platform context.

Examples:

How do I save an opportunity?

How does the match score work?

How do I upload my resume?

What does ATS compatibility mean?

How do I update an application?

Do not allow the assistant to fabricate application status, company information or platform policies.

40. ADMIN DASHBOARD

Create a separate protected admin area.

Route:

/admin

Admin dashboard statistics:

Total students

Total opportunities

Active opportunities

Expired opportunities

Applications

Saved opportunities

Hackathons

Courses

41. ADMIN OPPORTUNITY MANAGEMENT

Admin can:

Create

Read

Update

Delete

Verify

Unverify

Expire

Restore

opportunities.

42. OPPORTUNITY VERIFICATION

Support:

Verified ✓

Store:

verified

verified_at

verified_by

source_url

last_checked_at

Show verification status clearly.

43. OPPORTUNITY EXPIRATION

Automatically detect opportunities where:

deadline < current date

and mark them:

Expired

Expired opportunities should not appear as active opportunities.

44. COMPANY MANAGEMENT

Admin can manage:

Company name

Logo

Description

Website

Location

Opportunities

45. COURSE & HACKATHON MANAGEMENT

Admin CRUD operations for:

Courses

Certifications

Hackathons

Competitions

46. HELP ARTICLE MANAGEMENT

Admin can:

Create article

Edit article

Publish/unpublish article

Delete article

Categorize article

47. ADMIN ACCESS CONTROL

Do not allow normal students to access admin functionality.

Implement role-based authorization.

Possible roles:

student
admin


Use secure server/database authorization, not merely hiding admin links in the UI.

48. OPPORTUNITY SOURCES

Every opportunity should have source information.

Store:

Source name

Source URL

External application URL

Posted date where available

Deadline

Last verified date

Do not scrape websites blindly.

Use authorized APIs, feeds, manually managed opportunities, partner submissions or other legally/technically appropriate sources.

49. DEMO DATA

Create useful seed/demo data for development.

Include examples of:

Jobs

Internships

Hackathons

Courses

Competitions

Include different:

Locations

Skills

Experience levels

Work modes

Deadlines

Clearly treat demo records as demo/seed data.

Do not fabricate real-world claims about companies.

50. MOBILE RESPONSIVENESS

The entire application must be responsive.

Desktop:

Use sidebar navigation.

Mobile:

Use a clean bottom navigation such as:

Home
Explore
Saved
Applications
Profile


Other sections should remain accessible through menus.

Mobile requirements:

Touch-friendly controls

No horizontal overflow

Responsive cards

Responsive filters

Responsive tables

Mobile-friendly file upload

Readable typography

Proper spacing

51. LOADING STATES

Every asynchronous feature needs a loading state.

Use:

Skeleton loaders

Progress indicators

Upload progress

Analysis progress

Never leave the user staring at a blank screen.

52. EMPTY STATES

Create meaningful empty states.

Examples:

Saved

You haven't saved any opportunities yet.

Applications

Your application tracker is empty.

Notifications

You're all caught up.

Search

No opportunities match your current filters.

Include useful action buttons.

53. ERROR HANDLING

Implement friendly error messages.

Examples:

Something went wrong. Please try again.

We couldn't load this opportunity.

Resume upload failed. Please check the file type and try again.

Never expose raw database errors to users.

Provide retry actions where appropriate.

54. FORM VALIDATION

Validate:

Required fields

Email

URLs

Dates

Numeric fields

File type

File size

Text length

Show inline validation.

55. ACCESSIBILITY

Follow good accessibility practices.

Implement:

Semantic HTML

Keyboard navigation

Visible focus states

Proper labels

Alt text

Accessible buttons

Accessible forms

Appropriate color contrast

Screen-reader-friendly structure

56. PERFORMANCE

Optimize:

Database queries

Indexes

Images

Components

API requests

Pagination

Lazy loading

Do not fetch unnecessary data.

Avoid excessive client-side processing.

57. SEO

Public pages should have:

Appropriate page titles

Meta descriptions

Open Graph metadata

Descriptive URLs

Opportunity URLs should be human-readable where practical.

58. SECURITY

Implement secure practices throughout.

Requirements:

Supabase RLS

Protected routes

Role-based authorization

Secure storage

Input validation

File validation

No secrets in frontend source

No service-role key in client

Safe external links

Proper error handling

59. APPLICATION DATA PRIVACY

Student-specific information must remain private.

Especially:

Resume

Phone

Applications

Private profile information

ATS analysis

Personal preferences

Do not expose this information publicly.

60. COMPONENT ARCHITECTURE

Use reusable components.

Examples:

Navbar
Sidebar
MobileBottomNav
OpportunityCard
CompanyCard
SearchBar
FilterPanel
FilterDrawer
MatchScore
DeadlineBadge
SaveButton
ApplicationStatusBadge
ProfileCompletion
ResumeUploader
ATSScoreCard
SkillGapCard
NotificationPanel
HelpArticle
EmptyState
ErrorState
LoadingSkeleton


Avoid duplicating the same UI logic across pages.

61. ROUTING

Create appropriate routes such as:

/
 /explore
 /jobs
 /internships
 /hackathons
 /courses
 /opportunity/:id
 /login
 /signup
 /forgot-password
 /dashboard
 /profile
 /saved
 /applications
 /resume
 /skill-gap
 /notifications
 /help
 /admin
 /admin/opportunities
 /admin/companies
 /admin/courses
 /admin/hackathons
 /admin/help
 /admin/users


Protect authenticated and admin routes appropriately.

62. DASHBOARD INFORMATION ARCHITECTURE

The student dashboard should feel like a personal career command center.

Example:

Good morning 👋

Profile Completion
82%

Applications     8
Saved            14
Interviews        2
Recommended      12

Recommended For You
-------------------
Data Analyst Intern      91%
Python Developer         87%
AI Hackathon             84%

Closing Soon
-------------------
Python Internship
2 days remaining

Resume
-------------------
ATS Compatibility
78/100

Skill Gap
-------------------
Data Analyst
3 recommended skills


63. CORE PRODUCT LOOP

Make the application internally connected.

The main system should work like this:

Student Profile
      ↓
Skills + Interests + Career Goal
      ↓
Opportunity Matching
      ↓
Recommended Opportunities
      ↓
Opportunity Details
      ↓
Save / Apply
      ↓
Application Tracking
      ↓
Resume Analysis
      ↓
Skill Gap
      ↓
Recommended Courses
      ↓
Better Preparation
      ↓
More Relevant Opportunities


This connection is fundamental to the product.

64. SIGNATURE USER EXPERIENCE

The most important differentiator should be:

Opportunity Match

For example:

87% Match

Then:

Skills             90%
Interests          95%
Experience         80%
Location           100%
Career Goal        85%


And:

Why this opportunity matches you

✓ Python matches your profile
✓ Data Analytics matches your interest
✓ Suitable experience level
✓ Matches your preferred work mode

Make the scoring transparent.

65. DO NOT OVERUSE AI

Use normal software/database logic where appropriate.

Use AI where it adds meaningful value:

Resume analysis

Resume/job comparison

Help assistant

Potential opportunity summarization

Advanced recommendations later

Do not use AI unnecessarily for:

Basic filtering

Login

Bookmarking

Application tracking

Simple database queries

66. TESTING REQUIREMENTS

Test the complete application.

Test:

Authentication

Signup

Login

Logout

Password reset

Profile

Create

Edit

Save

Validation

Opportunities

Search

Filter

Pagination

Details

Save

Apply

Applications

Create

Update status

View

Delete/withdraw where appropriate

Recommendations

Profile-based matching

Match calculation

Explanation

Resume

Upload

Replace

Delete

Analysis

Suggestions

Skill Gap

Career goal

Skills

Gap

Courses

Admin

CRUD

Verification

Expiration

Access control

Security

RLS

Unauthorized access

Private storage

Mobile

Test all major screens at mobile widths.

67. COMPLETE USER JOURNEY TEST

Verify this journey:

Landing Page
     ↓
Explore
     ↓
Opportunity Details
     ↓
Sign Up
     ↓
Student Onboarding
     ↓
Create Profile
     ↓
Dashboard
     ↓
Recommendation
     ↓
Opportunity Match
     ↓
Save
     ↓
Apply Externally
     ↓
Track Application


Then test:

Resume Upload
     ↓
ATS Analysis
     ↓
Suggestions
     ↓
Target Opportunity
     ↓
Resume/Job Match
     ↓
Skill Gap
     ↓
Recommended Course


68. FINAL QUALITY REQUIREMENTS

Before considering the project complete, verify:

No broken links

No dead buttons

No placeholder functionality presented as completed

No console errors

No unauthorized database access

No exposed private credentials

No fake API responses presented as real

No overflowing mobile layouts

No inaccessible controls

No broken loading states

No missing error handling

No duplicate UI logic where reusable components should be used

69. IMPLEMENTATION ORDER

Build in this order:

Phase 1

Project setup + design system

Phase 2

Landing page

Phase 3

Supabase connection + database + migrations

Phase 4

Authentication

Phase 5

Student onboarding/profile

Phase 6

Opportunity database

Phase 7

Explore/search/filter

Phase 8

Opportunity details

Phase 9

Save/bookmark

Phase 10

External application + application tracker

Phase 11

Student dashboard

Phase 12

Hackathons + courses + competitions

Phase 13

Recommendation engine

Phase 14

Opportunity match score

Phase 15

Deadlines + notifications

Phase 16

Resume upload

Phase 17

ATS analyzer

Phase 18

Resume/job matching

Phase 19

Skill-gap system

Phase 20

Help Center

Phase 21

AI Help Assistant

Phase 22

Admin dashboard

Phase 23

Verification + expiration

Phase 24

Security + RLS testing

Phase 25

Mobile optimization

Phase 26

Accessibility

Phase 27

Performance + SEO

Phase 28

Complete testing

Phase 29

Production readiness

70. IMPORTANT IMPLEMENTATION BEHAVIOR

Do not stop after generating the visual interface.

The finished application must have a functional connection between:

Frontend → Supabase Auth → PostgreSQL → Storage → RLS → Application Logic

Verify that actual database operations work.

When implementing a feature, connect its UI to the appropriate backend functionality instead of creating static placeholder data.

Where an advanced external service is not configured yet, create a clean integration boundary and clearly identify the required configuration rather than pretending the service is connected.

71. FINAL PRODUCT DEFINITION

The finished OpportunityHub product should allow a student to go from:

"I don't know where to find opportunities"

to:

"I found a relevant opportunity, understand why it matches me, know what skills I need, have improved my resume, applied, and can track what happens next."

The final product should feel like a polished, real-world student career platform rather than a college demo website.

Build the application with clean architecture, reusable components, secure Supabase integration, responsive UI, proper database design, strong RLS policies and maintainable code.

Start implementation from Phase 1 and proceed through the phases in order.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://ascent-opportunityhub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3900ddaa-b4a9-450f-bacd-0bb18be36740).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
