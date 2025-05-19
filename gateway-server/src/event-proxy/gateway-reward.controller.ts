import { Controller, Post, Get, Delete, Req, Res, UseGuards, Param, Body } from '@nestjs/common';
import { Request, Response } from 'express';
import axios from 'axios';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/guards/roles.decorator';

@Controller('rewards')
export class GatewayRewardController {
  // 1. 보상 생성 가능 권한: OPERATOR, ADMIN
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OPERATOR', 'ADMIN')
  @Post()
  async proxyCreateReward(@Req() req: Request, @Res() res: Response) {
    try {
      const {host, 'content-length': _, ...headersWithoutHostAndLength} = req.headers;
      const rewardServerUrl = process.env.EVENT_SERVER_URL || 'http://event:3002';
      const targetUrl = `${rewardServerUrl}${req.originalUrl}`;
      const axiosConfig = {
        method: req.method as any,
        url: targetUrl,
        headers: {
          ...headersWithoutHostAndLength,
          'content-type': 'application/json',
        },
        data: req.body,
        validateStatus: () => true,
        timeout: 5000,
      };
      const response = await axios(axiosConfig);
      res.status(response.status).json(response.data);
    } catch (e) {
      let errorMessage = '알 수 없는 에러';
      if (e && typeof e === 'object' && 'message' in e) {
        errorMessage = (e as any).message;
      }
      res.status(500).json({ message: 'event-server 프록시 에러', error: errorMessage });
    }
  }

  // 2. 보상 단건 조회 가능 권한: USER, OPERATOR, AUDITOR, ADMIN
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'OPERATOR', 'AUDITOR', 'ADMIN')
  @Get(':id')
  async proxyGetReward(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
    try {
      const {host, 'content-length': _, ...headersWithoutHostAndLength} = req.headers;
      const rewardServerUrl = process.env.EVENT_SERVER_URL || 'http://event:3002';
      const targetUrl = `${rewardServerUrl}${req.originalUrl}`;
      const axiosConfig = {
        method: req.method as any,
        url: targetUrl,
        headers: {
          ...headersWithoutHostAndLength,
          'content-type': 'application/json',
        },
        data: req.body,
        validateStatus: () => true,
        timeout: 5000,
      };
      const response = await axios(axiosConfig);
      res.status(response.status).json(response.data);
    } catch (e) {
      let errorMessage = '알 수 없는 에러';
      if (e && typeof e === 'object' && 'message' in e) {
        errorMessage = (e as any).message;
      }
      res.status(500).json({ message: 'event-server 프록시 에러', error: errorMessage });
    }
  }

  // 3. 보상 삭제 가능 권한: OPERATOR, ADMIN
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OPERATOR', 'ADMIN')
  @Delete(':id')
  async proxyDeleteReward(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
    try {
      const {host, 'content-length': _, ...headersWithoutHostAndLength} = req.headers;
      const rewardServerUrl = process.env.EVENT_SERVER_URL || 'http://event:3002';
      const targetUrl = `${rewardServerUrl}${req.originalUrl}`;
      const axiosConfig = {
        method: req.method as any,
        url: targetUrl,
        headers: {
          ...headersWithoutHostAndLength,
          'content-type': 'application/json',
        },
        data: req.body,
        validateStatus: () => true,
        timeout: 5000,
      };
      const response = await axios(axiosConfig);
      res.status(response.status).json(response.data);
    } catch (e) {
      let errorMessage = '알 수 없는 에러';
      if (e && typeof e === 'object' && 'message' in e) {
        errorMessage = (e as any).message;
      }
      res.status(500).json({ message: 'event-server 프록시 에러', error: errorMessage });
    }
  }
} 