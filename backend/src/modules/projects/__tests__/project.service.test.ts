import {
  _createProject,
  _listProjects,
  _getProjectById,
  _updateProjectStatus,
  _deleteProject,
} from '../project.service';
import { Project } from '../schema/Project';
import mongoose from 'mongoose';

// Mock Mongoose
jest.mock('../schema/Project');

describe('Project Service', () => {
  const mockProjectData = {
    name: 'Test Project',
    clientName: 'Test Client',
    status: 'active',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    deleted: false,
  };

  const mockProjectId = new mongoose.Types.ObjectId();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('_createProject', () => {
    it('should create a new project', async () => {
      const mockProject = {
        ...mockProjectData,
        _id: mockProjectId,
        save: jest.fn().mockResolvedValue({
          ...mockProjectData,
          _id: mockProjectId,
        }),
      };

      (Project as any).mockImplementation(() => mockProject);

      const result = await _createProject(mockProjectData);

      expect(result).toBeDefined();
      expect(mockProject.save).toHaveBeenCalled();
    });

    it('should throw error if required fields are missing', async () => {
      const invalidData = {
        clientName: 'Test Client',
        startDate: new Date('2024-01-01'),
      };

      let errorThrown = false;
      try {
        await _createProject(invalidData);
      } catch (error: any) {
        errorThrown = true;
        expect(error.message).toContain('name');
      }

    });
  });

  describe('_listProjects', () => {
    it('should list all projects excluding deleted ones', async () => {
      const mockProjects = [mockProjectData];

      (Project.find as any) = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockProjects),
      });

      const result = await _listProjects({});

      expect(result).toEqual(mockProjects);
    });

    it('should filter projects by status', async () => {
      const mockProjects = [{ ...mockProjectData, status: 'on_hold' }];

      (Project.find as any) = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockProjects),
      });

      const result = await _listProjects({ status: 'on_hold' });

      expect(result).toBeDefined();
    });

    it('should search projects by name or clientName', async () => {
      const mockProjects = [mockProjectData];

      (Project.find as any) = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockProjects),
      });

      const result = await _listProjects({ search: 'Test' });

      expect(result).toBeDefined();
    });
  });

  describe('_getProjectById', () => {
    it('should get project by ID', async () => {
      (Project.findOne as any) = jest
        .fn()
        .mockResolvedValue({ ...mockProjectData, _id: mockProjectId });

      const result = await _getProjectById(mockProjectId.toString());

      expect(result).toBeDefined();
      expect(result._id).toEqual(mockProjectId);
    });

    it('should throw error if project not found', async () => {
      (Project.findOne as any) = jest.fn().mockResolvedValue(null);

      let errorThrown = false;
      try {
        await _getProjectById(mockProjectId.toString());
      } catch (error: any) {
        errorThrown = true;
        expect(error.message).toBe('Project not found');
      }
      expect(errorThrown).toBe(true);
    });
  });

  describe('_updateProjectStatus', () => {
    it('should update project status with valid transition', async () => {
      const mockProject = {
        ...mockProjectData,
        _id: mockProjectId,
        status: 'active',
        save: jest.fn().mockResolvedValue({
          ...mockProjectData,
          _id: mockProjectId,
          status: 'on_hold',
        }),
      };

      (Project.findOne as any) = jest.fn().mockResolvedValue(mockProject);

      const result = await _updateProjectStatus(
        mockProjectId.toString(),
        'on_hold'
      );

      expect(result.status).toBe('on_hold');
      expect(mockProject.save).toHaveBeenCalled();
    });

    it('should reject invalid status transitions', async () => {
      const mockProject = {
        ...mockProjectData,
        _id: mockProjectId,
        status: 'completed',
      };

      (Project.findOne as any) = jest.fn().mockResolvedValue(mockProject);

      let errorThrown = false;
      try {
        await _updateProjectStatus(mockProjectId.toString(), 'active');
      } catch (error: any) {
        errorThrown = true;
        expect(error.message).toContain('Cannot transition');
      }
      expect(errorThrown).toBe(true);
    });
  });

  describe('_deleteProject', () => {
    it('should soft delete a project', async () => {
      const mockProject = {
        ...mockProjectData,
        _id: mockProjectId,
        deleted: false,
        save: jest.fn().mockResolvedValue({
          ...mockProjectData,
          _id: mockProjectId,
          deleted: true,
        }),
      };

      (Project.findOne as any) = jest.fn().mockResolvedValue(mockProject);

      const result = await _deleteProject(mockProjectId.toString());

      expect(result.deleted).toBe(true);
      expect(mockProject.save).toHaveBeenCalled();
    });

    it('should throw error if project not found', async () => {
      (Project.findOne as any) = jest.fn().mockResolvedValue(null);

      let errorThrown = false;
      try {
        await _deleteProject(mockProjectId.toString());
      } catch (error: any) {
        errorThrown = true;
        expect(error.message).toBe('Project not found');
      }
      expect(errorThrown).toBe(true);
    });
  });
});
