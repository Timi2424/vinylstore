import { Controller, Get, Delete, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AdminGuard } from '../auth/admin.guard';
import { SessionAuthGuard } from '../auth/auth.guard';


@ApiTags('Admin')
@Controller('admin')
@UseGuards(SessionAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Get system logs' })
  @Get('logs/system')
  getSystemLogs() {
    try {
      const logs = this.adminService.readSystemLogs();
      return { logs };
    } catch (error) {
      throw new HttpException('Failed to retrieve system logs', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Get controller logs' })
  @Get('logs/controller')
  getControllerLogs() {
    try {
      const logs = this.adminService.readControllerLogs();
      return { logs };
    } catch (error) {
      throw new HttpException('Failed to retrieve controller logs', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Delete system logs' })
  @Delete('logs/system')
  deleteSystemLogs() {
    try {
      const message = this.adminService.deleteSystemLogs();
      return { message };
    } catch (error) {
      throw new HttpException('Failed to delete system logs', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Delete controller logs' })
  @Delete('logs/controller')
  deleteControllerLogs() {
    try {
      const message = this.adminService.deleteControllerLogs();
      return { message };
    } catch (error) {
      throw new HttpException('Failed to delete controller logs', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
