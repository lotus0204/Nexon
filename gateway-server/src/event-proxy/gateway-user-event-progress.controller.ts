import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import axios from 'axios';

const IP_WHITELIST = ['127.0.0.1', '::1']; // 실제 운영시 게임서버 IP로 변경

class IpWhitelistGuard {
  canActivate(context) {
    const req = context.switchToHttp().getRequest();
    const ip = req.ip || req.connection?.remoteAddress;
    if (!IP_WHITELIST.includes(ip)) {
      return false;
    }
    return true;
  }
}

@Controller('user-event-progress')
export class GatewayUserEventProgressController {
  @UseGuards(IpWhitelistGuard)
  @Post()
  async proxyUpsert(@Req() req: Request, @Res() res: Response) {
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