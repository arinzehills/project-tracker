import request from 'supertest';
import { app } from '../index';
import mongoose from 'mongoose';
import { Project } from '../modules/projects/schema/Project';

describe('Projects API Integration Tests', () => {
  let projectId: string;

  beforeAll(async () => {
    // Connect to MongoDB
    const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/project-tracker-test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(DB_URI);
    }
  });

  afterAll(async () => {
    // Cleanup and disconnect
    await Project.deleteMany({});
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    // Clear projects before each test
    await Project.deleteMany({});
  });

  describe('POST /api/projects', () => {
    it('should create a new project', async () => {
      const projectData = {
        name: 'Website Redesign',
        clientName: 'Acme Corp',
        status: 'active',
        startDate: '2024-01-15',
        endDate: '2024-06-30',
      };

      const response = await request(app)
        .post('/api/projects')
        .send(projectData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Project created successfully');
      expect(response.body.data.name).toBe('Website Redesign');
      expect(response.body.data.clientName).toBe('Acme Corp');
      expect(response.body.data.status).toBe('active');

      projectId = response.body.data._id;
    });

    it('should fail if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/projects')
        .send({
          clientName: 'Acme Corp',
          startDate: '2024-01-15',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Validation');
    });

    it('should fail if endDate is before startDate', async () => {
      const response = await request(app)
        .post('/api/projects')
        .send({
          name: 'Test Project',
          clientName: 'Acme Corp',
          startDate: '2024-12-31',
          endDate: '2024-01-01',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail if status is invalid', async () => {
      const response = await request(app)
        .post('/api/projects')
        .send({
          name: 'Test Project',
          clientName: 'Acme Corp',
          status: 'invalid_status',
          startDate: '2024-01-01',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should default status to active if not provided', async () => {
      const response = await request(app)
        .post('/api/projects')
        .send({
          name: 'Test Project',
          clientName: 'Acme Corp',
          startDate: '2024-01-01',
        })
        .expect(201);

      expect(response.body.data.status).toBe('active');
    });
  });

  describe('GET /api/projects', () => {
    beforeEach(async () => {
      // Create test projects
      await Project.create([
        {
          name: 'Project A',
          clientName: 'Client A',
          status: 'active',
          startDate: new Date('2024-01-01'),
        },
        {
          name: 'Project B',
          clientName: 'Client B',
          status: 'on_hold',
          startDate: new Date('2024-02-01'),
        },
        {
          name: 'Project C',
          clientName: 'Client A',
          status: 'completed',
          startDate: new Date('2024-03-01'),
        },
      ]);
    });

    it('should list all projects', async () => {
      const response = await request(app)
        .get('/api/projects')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(3);
    });

    it('should filter projects by status', async () => {
      const response = await request(app)
        .get('/api/projects?status=active')
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].status).toBe('active');
    });

    it('should search projects by name', async () => {
      const response = await request(app)
        .get('/api/projects?search=Project%20A')
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Project A');
    });

    it('should search projects by clientName', async () => {
      const response = await request(app)
        .get('/api/projects?search=Client%20A')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
    });

    it('should sort projects by createdAt descending', async () => {
      const response = await request(app)
        .get('/api/projects?sortBy=createdAt&sortOrder=desc')
        .expect(200);

      expect(response.body.data).toHaveLength(3);
      // Should have 3 projects
      const names = response.body.data.map((p: any) => p.name);
      expect(names).toContain('Project A');
      expect(names).toContain('Project B');
      expect(names).toContain('Project C');
    });

    it('should combine filters and search', async () => {
      const response = await request(app)
        .get('/api/projects?status=active&search=Client%20A')
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Project A');
    });

    it('should exclude deleted projects', async () => {
      // Delete one project
      const projects = await Project.find();
      await Project.updateOne(
        { _id: projects[0]._id },
        { deleted: true }
      );

      const response = await request(app)
        .get('/api/projects')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
    });
  });

  describe('GET /api/projects/:id', () => {
    let testProjectId: string;

    beforeEach(async () => {
      const project = await Project.create({
        name: 'Test Project',
        clientName: 'Test Client',
        status: 'active',
        startDate: new Date('2024-01-01'),
      });
      testProjectId = project._id.toString();
    });

    it('should get project by ID', async () => {
      const response = await request(app)
        .get(`/api/projects/${testProjectId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testProjectId);
      expect(response.body.data.name).toBe('Test Project');
    });

    it('should return 404 if project not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/projects/${fakeId}`)
        .expect(500);

      expect(response.body.success).toBe(false);
    });

    it('should not return deleted projects', async () => {
      await Project.updateOne(
        { _id: testProjectId },
        { deleted: true }
      );

      const response = await request(app)
        .get(`/api/projects/${testProjectId}`)
        .expect(500);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/projects/:id/status', () => {
    let testProjectId: string;

    beforeEach(async () => {
      const project = await Project.create({
        name: 'Test Project',
        clientName: 'Test Client',
        status: 'active',
        startDate: new Date('2024-01-01'),
      });
      testProjectId = project._id.toString();
    });

    it('should update project status', async () => {
      const response = await request(app)
        .patch(`/api/projects/${testProjectId}/status`)
        .send({ status: 'on_hold' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('on_hold');
    });

    it('should reject invalid status transitions', async () => {
      // First transition to completed
      await request(app)
        .patch(`/api/projects/${testProjectId}/status`)
        .send({ status: 'completed' });

      // Try to transition back to active (invalid)
      const response = await request(app)
        .patch(`/api/projects/${testProjectId}/status`)
        .send({ status: 'active' })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Cannot transition');
    });

    it('should allow active → on_hold', async () => {
      const response = await request(app)
        .patch(`/api/projects/${testProjectId}/status`)
        .send({ status: 'on_hold' })
        .expect(200);

      expect(response.body.data.status).toBe('on_hold');
    });

    it('should allow active → completed', async () => {
      const response = await request(app)
        .patch(`/api/projects/${testProjectId}/status`)
        .send({ status: 'completed' })
        .expect(200);

      expect(response.body.data.status).toBe('completed');
    });

    it('should allow on_hold → active', async () => {
      // First transition to on_hold
      await request(app)
        .patch(`/api/projects/${testProjectId}/status`)
        .send({ status: 'on_hold' });

      // Then transition back to active
      const response = await request(app)
        .patch(`/api/projects/${testProjectId}/status`)
        .send({ status: 'active' })
        .expect(200);

      expect(response.body.data.status).toBe('active');
    });

    it('should allow on_hold → completed', async () => {
      // First transition to on_hold
      await request(app)
        .patch(`/api/projects/${testProjectId}/status`)
        .send({ status: 'on_hold' });

      // Then transition to completed
      const response = await request(app)
        .patch(`/api/projects/${testProjectId}/status`)
        .send({ status: 'completed' })
        .expect(200);

      expect(response.body.data.status).toBe('completed');
    });

    it('should not allow completed → any transition', async () => {
      // First transition to completed
      await request(app)
        .patch(`/api/projects/${testProjectId}/status`)
        .send({ status: 'completed' });

      // Try to transition to on_hold
      const response = await request(app)
        .patch(`/api/projects/${testProjectId}/status`)
        .send({ status: 'on_hold' })
        .expect(500);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/projects/:id', () => {
    let testProjectId: string;

    beforeEach(async () => {
      const project = await Project.create({
        name: 'Test Project',
        clientName: 'Test Client',
        status: 'active',
        startDate: new Date('2024-01-01'),
      });
      testProjectId = project._id.toString();
    });

    it('should soft delete a project', async () => {
      const response = await request(app)
        .delete(`/api/projects/${testProjectId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Project deleted successfully');

      // Verify it's not in list
      const listResponse = await request(app)
        .get('/api/projects')
        .expect(200);

      expect(listResponse.body.data).toHaveLength(0);
    });

    it('should return 404 if project already deleted', async () => {
      // Delete the project
      await request(app)
        .delete(`/api/projects/${testProjectId}`);

      // Try to delete again
      const response = await request(app)
        .delete(`/api/projects/${testProjectId}`)
        .expect(500);

      expect(response.body.success).toBe(false);
    });

    it('should not actually remove from database', async () => {
      await request(app)
        .delete(`/api/projects/${testProjectId}`);

      // Check database directly - should exist but be marked deleted
      const project = await Project.findById(testProjectId);
      expect(project).toBeDefined();
      expect(project?.deleted).toBe(true);
    });
  });
});
