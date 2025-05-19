import { Controller, Post, Get, Req, Res, UseGuards, Body, Param, Query } from '@nestjs/common';
import { Request, Response } from 'express';
import axios from 'axios';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/guards/roles.decorator';

@Controller('reward-requests')
export class GatewayRewardRequestController {
  // 1. 보상 요청 생성 가능 권한: USER, ADMIN
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN')
  @Post()
  async proxyCreateRewardRequest(@Req() req: Request, @Res() res: Response, @Body() body: any) {
    try {
      const {host, 'content-length': _, ...headersWithoutHostAndLength} = req.headers;
      const eventServerUrl = process.env.EVENT_SERVER_URL || 'http://event:3002';
      const targetUrl = `${eventServerUrl}${req.originalUrl}`;
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

  // 2. 유저 보상 요청 조회 가능 권한: USER, OPERATOR, AUDITOR, ADMIN
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'OPERATOR', 'AUDITOR', 'ADMIN')
  @Get('user/:userId')
  async proxyGetByUserId(@Req() req: Request, @Res() res: Response, @Param('userId') userId: string) {
    try {
      const {host, 'content-length': _, ...headersWithoutHostAndLength} = req.headers;
      const eventServerUrl = process.env.EVENT_SERVER_URL || 'http://event:3002';
      const targetUrl = `${eventServerUrl}${req.originalUrl}`;
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

  // 3. 보상 요청 목록 조회 가능 권한: OPERATOR, AUDITOR, ADMIN
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OPERATOR', 'AUDITOR', 'ADMIN')
  @Get()
  async proxyGetList(@Req() req: Request, @Res() res: Response, @Query() query: any) {
    try {
      const {host, 'content-length': _, ...headersWithoutHostAndLength} = req.headers;
      const eventServerUrl = process.env.EVENT_SERVER_URL || 'http://event:3002';
      const targetUrl = `${eventServerUrl}${req.originalUrl}`;
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