import { Controller, Get, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AdminGuard } from '../auth/admin.guard';
import { JwtAuthGuard } from '../auth/auth.guard';


@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Get system logs' })
//   @UseGuards(JwtAuthGuard, AdminGuard)
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
//   @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('logs/controller')
  getControllerLogs() {
    try {
      const logs = this.adminService.readControllerLogs();
      return { logs };
    } catch (error) {
      throw new HttpException('Failed to retrieve controller logs', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
