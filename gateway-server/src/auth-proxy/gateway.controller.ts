import { Controller, All, Req, Res, UseGuards, Patch } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/guards/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Request, Response } from 'express';
import axios from 'axios';

@Controller()
export class GatewayAuthController {
 
  // 1. 회원가입(권한 체크 없음)
  @All('users/register')
  async proxyRegister(@Req() req: Request, @Res() res: Response) {
    try {
      const {host, 'content-length': _, ...headersWithoutHostAndLength} = req.headers;
      const usersServerUrl = process.env.AUTH_SERVER_URL || 'http://auth:3001';
      const targetUrl = `${usersServerUrl}${req.originalUrl}`;
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
      res.status(500).json({ message: 'auth-server 프록시 에러', error: errorMessage });
    }
  }

  // 2. 권한 변경(ADMIN만)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('users/:mapleId/role')
  async proxyUpdateRole(@Req() req: Request, @Res() res: Response) {
    try {
      const {host, 'content-length': _, ...headersWithoutHostAndLength} = req.headers;
      const usersServerUrl = process.env.AUTH_SERVER_URL || 'http://auth:3001';
      const targetUrl = `${usersServerUrl}${req.originalUrl}`;
      const axiosConfig = {
        method: req.method as any,
        url: targetUrl,
        headers: {
          ...headersWithoutHostAndLength,
          'content-type': 'application/json',
        },
        data: req.body,
        validateStatus: () => true,
      };
      const response = await axios(axiosConfig);
      res.status(response.status).json(response.data);
    } catch (e) {
      let errorMessage = '알 수 없는 에러';
      if (e && typeof e === 'object' && 'message' in e) {
        errorMessage = (e as any).message;
      }
      res.status(500).json({ message: 'auth-server 프록시 에러', error: errorMessage });
    }
  }

  // 3. 비밀번호 변경(권한 체크 없음)
  @All('users/:mapleId/password')
  async proxyChangePassword(@Req() req: Request, @Res() res: Response) {
    try {
      const {host, 'content-length': _, ...headersWithoutHostAndLength} = req.headers;
      const usersServerUrl = process.env.AUTH_SERVER_URL || 'http://auth:3001';
      const targetUrl = `${usersServerUrl}${req.originalUrl}`;
      const axiosConfig = {
        method: req.method as any,
        url: targetUrl,
        headers: {
          ...headersWithoutHostAndLength,
          'content-type': 'application/json',
        },
        data: req.body,
        validateStatus: () => true,
      };
      const response = await axios(axiosConfig);
      res.status(response.status).json(response.data);
    } catch (e) {
      let errorMessage = '알 수 없는 에러';
      if (e && typeof e === 'object' && 'message' in e) {
        errorMessage = (e as any).message;
      }
      res.status(500).json({ message: 'auth-server 프록시 에러', error: errorMessage });
    }
  }

  // 4. 회원 삭제(권한 체크 없음)
  @All('users/:mapleId')
  async proxyDeleteUser(@Req() req: Request, @Res() res: Response) {
    if (req.method !== 'DELETE') {
      return res.status(405).json({ message: '허용되지 않은 메서드' });
    }
    try {
      const {host, 'content-length': _, ...headersWithoutHostAndLength} = req.headers;
      const usersServerUrl = process.env.AUTH_SERVER_URL || 'http://auth:3001';
      const targetUrl = `${usersServerUrl}${req.originalUrl}`;
      const axiosConfig = {
        method: req.method as any,
        url: targetUrl,
        headers: {
          ...headersWithoutHostAndLength,
          'content-type': 'application/json',
        },
        data: req.body,
        validateStatus: () => true,
      };
      const response = await axios(axiosConfig);
      res.status(response.status).json(response.data);
    } catch (e) {
      let errorMessage = '알 수 없는 에러';
      if (e && typeof e === 'object' && 'message' in e) {
        errorMessage = (e as any).message;
      }
      res.status(500).json({ message: 'auth-server 프록시 에러', error: errorMessage });
    }
  }

  // 0. 로그인(권한 체크 없음)
  @All('auth/login')
  async proxyLogin(@Req() req: Request, @Res() res: Response) {
    try {
      const {host, 'content-length': _, ...headersWithoutHostAndLength} = req.headers;
      const authServerUrl = process.env.AUTH_SERVER_URL || 'http://auth:3001';
      const targetUrl = `${authServerUrl}${req.originalUrl}`;
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
      res.status(500).json({ message: 'auth-server 프록시 에러', error: errorMessage });
    }
  }
}
