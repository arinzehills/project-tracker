# Project Tracker

A full-stack project tracking system built with React/Next.js (frontend) and Node.js/Express (backend).

## Project Structure

```
project-tracker/
├── frontend/          # Next.js React application
│   └── src/
│       ├── app/       # Next.js app router pages
│       ├── modules/   # Feature-based modules
│       ├── components/# Shared components
│       ├── hooks/     # Custom React hooks
│       └── types/     # TypeScript type definitions
├── backend/           # Express API server
│   └── src/
│       ├── modules/   # Feature modules (projects, auth, etc.)
│       ├── config/    # Configuration files
│       ├── utils/     # Application-level utilities
│       └── middleware/# Express middleware
└── package.json       # Root package.json with concurrently
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB (local or Atlas URI)

### Installation

1. Install root dependencies:
```bash
npm install
```

2. Install backend dependencies:
```bash
npm install --prefix backend
```

3. Install frontend dependencies:
```bash
npm install --prefix frontend
```

### Configuration

Backend (.env):
```
PORT=5000
DB_URI=mongodb://localhost:27017/project-tracker
NODE_ENV=development
```

Frontend (.env.local):
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Running the Project

Start both frontend and backend concurrently:
```bash
npm run dev
```

This will start:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## Testing

### Running Backend Tests
```bash
npm test --prefix backend
```

**Test Coverage:**
- 25 integration and unit tests
- POST /api/projects - 5 tests (create, validation, defaults)
- GET /api/projects - 7 tests (list, filter, search, sort, soft delete exclusion)
- GET /api/projects/:id - 3 tests (retrieve, 404 handling, soft delete exclusion)
- PATCH /api/projects/:id/status - 7 tests (valid transitions, invalid transitions)
- DELETE /api/projects/:id - 3 tests (soft delete, recovery verification)

All tests use:
- **Jest** for test framework
- **Supertest** for HTTP assertions
- **MongoDB test database** for integration tests

## Features

- Create, read, update, and delete projects
- Filter projects by status
- Search projects by name or client name
- Sort projects by creation date or start date
- Track project status (active, on_hold, completed)
- **Project Details Side Panel** - Slide-in animated panel with blurred backdrop
- **More Options Menu** - Per-card dropdown with View & Delete actions
- **Live Status/Priority Updates** - Change project status and priority from detail panel with `UpdateStateListComponent`
- **Custom Input Components** - TypeScript InputField and CustomDropDown components
- **Animated Modals** - Add project modal with smooth Framer Motion animations

## API Endpoints

### Projects API

#### 1. Create Project
```
POST /api/projects
Content-Type: application/json

Request:
{
  "name": "Website Redesign",
  "clientName": "Acme Corp",
  "status": "active",           // optional, defaults to "active"
  "startDate": "2024-01-15",    // required, ISO date string
  "endDate": "2024-06-30"       // optional, must be >= startDate
}

Response (201):
{
  "success": true,
  "message": "Project created successfully",
  "data": { ...project object... }
}
```

#### 2. List Projects
```
GET /api/projects?status=active&search=Acme&sortBy=createdAt&sortOrder=desc

Query Parameters:
  - status: (optional) active | on_hold | completed
  - search: (optional) search in name or clientName
  - sortBy: (optional) createdAt | startDate (default: createdAt)
  - sortOrder: (optional) asc | desc (default: desc)

Response (200):
{
  "success": true,
  "message": "Projects retrieved successfully",
  "data": [{ ...projects... }]
}
```

#### 3. Get Project by ID
```
GET /api/projects/:id

Response (200):
{
  "success": true,
  "message": "Project retrieved successfully",
  "data": { ...project object... }
}

Error (404):
{
  "success": false,
  "message": "Project not found"
}
```

#### 4. Update Project Status
```
PATCH /api/projects/:id/status
Content-Type: application/json

Request:
{
  "status": "on_hold"  // must be valid transition
}

Valid Transitions:
  - active → on_hold, completed
  - on_hold → active, completed
  - completed → (no transitions allowed)

Response (200):
{
  "success": true,
  "message": "Project status updated successfully",
  "data": { ...updated project... }
}

Error (400):
{
  "success": false,
  "message": "Cannot transition from 'completed' to 'active'. Allowed transitions: none"
}
```

#### 5. Delete Project (Soft Delete)
```
DELETE /api/projects/:id

Response (200):
{
  "success": true,
  "message": "Project deleted successfully"
}

Error (404):
{
  "success": false,
  "message": "Project not found"
}
```

## Assumptions & Trade-offs

### Backend Decisions
1. **Soft Delete**: Projects are marked as `deleted: true` rather than permanently removed. This preserves audit trails and allows recovery.
2. **Status Transitions**: Enforced valid state transitions (completed projects cannot change status). Prevents invalid state changes.
3. **Validation**: Used Joi schema validation for all inputs (name, clientName, dates, status).
4. **Filtering**: Case-insensitive regex search for name and clientName to improve UX.
5. **Error Handling**: Centralized error handling middleware that catches async errors via `asyncHandler`.

### Architecture Choices
1. **Modular structure**: Each feature (projects) has routes, controllers, services, validation, schema, and types
2. **Service layer separation**: Business logic in services, request handling in controllers
3. **Mongoose with TypeScript**: Full type safety for database models
4. **Joi validation middleware**: Validates request body/query before controller execution

## Recent Updates (Frontend Enhancements)

### New Components
1. **UpdateStateListComponent** - Dropdown for changing project status/priority
   - Reusable for both status and priority updates
   - Real-time API calls with loading states
   - Color-coded options with checkmark indicator

2. **Enhanced ProjectDetail** - Full side panel with:
   - Animated slide-in from right (Framer Motion)
   - Blurred backdrop (glass-morphism effect)
   - Live status/priority updaters
   - Time remaining calculation
   - Delete functionality

3. **ProjectCard Enhancements**
   - More options menu (⋮) dropdown
   - View & Delete actions
   - Click entire card to open detail panel

### Key Changes
- Converted `CustomDropDown` from JSX to TypeScript
- Added custom `InputField` and `CustomDropDown` to `AddProjectModal`
- Flexible, responsive layout for search/filter bar
- Fixed `usePatch` hook integration (use `updateItem` not `execute`)

## Debugging Notes
- **Error**: `patchProject is not a function` - Fixed by using `updateItem` from `usePatch` hook
- **UI**: Made side panel wider (max-w-md → max-w-2xl) for better visibility
- **Backdrop**: Changed from solid black to blurred effect (backdrop-blur-sm)

## AI Usage

### AI Tool Used
**Claude Code** (Anthropic's Claude AI) - Interactive CLI for software engineering

### Parts Built with AI Assistance

#### Backend API (Complete Implementation + Tests)
**Backend - What was built:**
- Mongoose schema with validation (`src/modules/projects/schema/Project.ts`)
- Service layer with business logic (`src/modules/projects/project.service.ts`)
- Controllers for all 5 endpoints (`src/modules/projects/project.controller.ts`)
- Joi validation schemas (`src/modules/projects/project.validation.ts`)
- Express router with middleware chain (`src/modules/projects/project.router.ts`)
- Error handling middleware (`src/middlewares/errorHandler.middleware.ts`)
- Validation middleware (`src/middlewares/validation.middleware.ts`)
- **Test suite**: 25 integration & unit tests using Jest + Supertest
  - Service unit tests (`src/modules/projects/__tests__/project.service.test.ts`)
  - API integration tests (`src/__tests__/projects.integration.test.ts`)
  - Jest configuration (`jest.config.js`)

#### Frontend - Components & Features
**Recently built:**
- `UpdateStateListComponent` - Dropdown for status/priority changes
- Enhanced `ProjectDetail` - Full side panel with animations
- Improved `ProjectList` - More options menu on cards
- `AddProjectModal` - Using custom InputField and CustomDropDown
- TypeScript `CustomDropDown.tsx` - Converted from JSX

**What was modified/rejected:**
1. **Rejected**: Direct copy of CustomError/CustomResponse classes from reference project
   - **Reason**: Project already had `baseApiResponse.ts` utilities; kept it DRY and consistent
   - **How it was changed**: Used existing `successResponse()` and `errorResponse()` helpers instead

2. **Rejected**: Copying entire validation structure from reference project
   - **Reason**: Customized Joi schemas specific to Project entity, not generic user schemas
   - **Result**: Cleaner, focused validation just for what projects need

3. **Modified**: TypeScript interface for Mongoose documents
   - **Original approach**: Extended IProject with Document (caused _id type conflicts)
   - **Final approach**: Created separate IProjectDocument interface inheriting from Document only
   - **Why**: Avoided ObjectId vs string type mismatch issues

4. **Modified**: Validation middleware
   - **Original approach**: Validated req.params too
   - **Issue**: ID params were being validated against schemas meant for body/query only
   - **Fix**: Only validate `req.query` and `req.body`, skip params

### What I Understand Fully
- ✅ **Mongoose schema design** with validation rules, defaults, and custom validators
- ✅ **Express middleware chain** and async error handling pattern
- ✅ **Service/Controller separation** and data flow
- ✅ **Joi validation** for request input validation
- ✅ **Status transition logic** with allowed transitions mapping
- ✅ **Soft delete pattern** and how it's queried (filtering by `deleted: false`)
- ✅ **MongoDB aggregation** with filters, regex search, and sorting
- ✅ All **5 API endpoints** and their request/response contracts

### What I Understand Partially/Would Need to Verify
- Performance implications of case-insensitive regex search at scale (might need indexing strategy for production)
- MongoDB aggregation pipeline optimization for complex queries
- Security: CORS is set to '*' (suitable for development, would need restriction in production)

### Testing & Verification
All endpoints tested with curl:
- ✅ POST create project
- ✅ GET list with filtering/search/sorting
- ✅ GET by ID
- ✅ PATCH status with valid/invalid transitions
- ✅ DELETE soft delete
- ✅ Verified deleted projects excluded from queries

### Code Quality Notes
- Full TypeScript type safety throughout
- Centralized error handling
- Clear separation of concerns (routes → controllers → services)
- Input validation before processing
- Consistent API response format

## License

ISC
